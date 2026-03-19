from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    from backend.core.database import create_db_and_tables
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "ok",
            "message": "Welcome to SecureVault API!"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Importar y registrar los routers de las características
from backend.features.router import app_router

app.include_router(app_router, prefix="/api/v1")