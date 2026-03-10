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