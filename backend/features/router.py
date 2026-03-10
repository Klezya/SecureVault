from fastapi import APIRouter
from .users.routes import router as users_router

app_router = APIRouter()

app_router.include_router(users_router)