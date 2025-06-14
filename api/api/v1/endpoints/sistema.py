from fastapi import APIRouter

router = APIRouter()

@router.get("/sistema")
def get_pagina():
    dados = {
        "titulo": "Minha Página",
        "descricao": "Esse é um exemplo de JSON retornado por um endpoint.",
        "itens": [
            {"id": 1, "nome": "Item A"},
            {"id": 2, "nome": "Item B"}
        ]
    }
    return dados