from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from .maps import *
import os
from io import BytesIO
from typing import Annotated

router = APIRouter()
client = genai.Client(api_key=os.getenv("GEMINI_KEY"))


class Data(BaseModel):
    img: UploadFile
    linguagem: str
    coords: list


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
async def post_pagina(img: Annotated[UploadFile, File()],
    linguagem: Annotated[str, Form()],
    coords: Annotated[str, Form()]):

    image_bytes = await img.read()
    imagem_gemini_file = types.Part.from_bytes(
        data=image_bytes,
        mime_type='image/jpeg',
      )
    linguagem = linguagem
    coords = coords.replace("[","").replace("]", "").split(",")
    mapa_info = get_address_and_places_info_google(float(coords[0]), float(coords[1]))
    print(mapa_info)
    gemini_response = get_gemini_response(imagem_gemini_file, mapa_info, linguagem)

    dados = {}

    print(gemini_response)

    for i in gemini_response.split("@"):
        temp = i.strip().split("|")
        dados[temp[0]] = temp[1].strip()

    return dados
