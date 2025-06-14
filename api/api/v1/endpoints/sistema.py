from fastapi import APIRouter, UploadFile
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from .maps import *
import os
from io import BytesIO

router = APIRouter()
client = genai.Client(api_key=os.getenv("GEMINI_KEY"))


class Data(BaseModel):
    img: UploadFile
    linguagem: str
    coords: list

foto = client.files.upload(file="foto.jpg")

def get_gemini_response(imagem, mapa_info, linguagem="en"):
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=f"""
                Seu objetivo é atuar como um bot de análise de imagem. Ao receber uma imagem e um endereço no prompt, sua tarefa é identificar e descrever o ponto principal da imagem (seja um estabelecimento, obra de arte ou ponto histórico).
                Foque exclusivamente no assunto principal da imagem. Suas respostas devem ser objetivas e concisas, e serão listadas nas seguintes categorias:
                nome|[nome referente ao ponto principal da imagem]
                @descricao|[descrição sucinta da imagem]
                @contexto|[contexto histórico onde o ponto principal da imagem se insere]
                @curiosidade|[curiosidade sobre a imagem. Caso mais de uma, elas devem ser apresentadas como bullet points]
                Você deve responder apenas em {linguagem}.
                A resposta deve apenas conter as categorias, nada mais.
                """),
        contents=[imagem, f"""
                Endereço: {mapa_info["endereco_completo"]}.
            """]
    )
    return response.text

@router.post("/sistema")
async def post_pagina(data: Data):
    image_bytes = await data.img.read()
    file_obj_for_gemini = BytesIO(image_bytes)
    file_obj_for_gemini.name = data.img.filename  # O nome do arquivo é importante para o Gemini API

    # Faz o upload do arquivo para a Google Gemini File API (sem salvar no disco do seu servidor)
    # Este é um upload para os servidores do Google para que o modelo possa acessá-lo.
    imagem = client.files.upload(file_obj_for_gemini)

    linguagem = data.linguagem
    coords = data.coords
    mapa_info = get_address_and_places_info_google(coords[0], coords[1])

    gemini_response = get_gemini_response(imagem, mapa_info, linguagem)

    dados = {}

    print(gemini_response)

    for i in gemini_response.split("@"):
        temp = i.strip().split("|")
        dados[temp[0]] = temp[1].strip()

    return dados
