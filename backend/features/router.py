from fastapi import APIRouter
from .users.routes import router as users_router
from .vault.routes import router as vault_router

app_router = APIRouter()

app_router.include_router(users_router, tags=["users"])
app_router.include_router(vault_router, tags=["vault"])