from fastapi import FastAPI
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    from backend.core.database import create_db_and_tables
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)



@app.get("/")
async def root():
    return {"status": "ok",
            "message": "Welcome to SecureVault API!"}

# Importar y registrar los routers de las características
from backend.features.router import app_router

app.include_router(app_router, prefix="/api/v1")