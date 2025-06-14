from fastapi import FastAPI, Depends
from api.v1.endpoints import sistema
app = FastAPI()

# Rotas públicas
app.include_router(sistema.router, prefix="/api/v1")


