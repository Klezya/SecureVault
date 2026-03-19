# backend/vault/routes.py
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from backend.core.database import SessionDep
from backend.auth.dependencies import get_current_user
from backend.auth.jwt import UserJwtInfo

from .schemas import VaultItemCreate, VaultItemUpdate, VaultItemPublic
from .services import (
    list_items, add_item, edit_item, remove_item,
    ItemNotFound, NotOwner,
)

router = APIRouter()

# ── Dependencia reutilizable ──────────────────────────────────
CurrentUser = Depends(get_current_user)


@router.get("/vault/items/", response_model=list[VaultItemPublic])
def get_items(
    session: SessionDep,
    current_user: UserJwtInfo = CurrentUser,
):
    return list_items(current_user.id, session)


@router.post("/vault/items/", response_model=VaultItemPublic, status_code=status.HTTP_201_CREATED)
def create_item(
    data: VaultItemCreate,
    session: SessionDep,
    current_user: UserJwtInfo = CurrentUser,
):
    return add_item(current_user, data, session)


@router.patch("/vault/items/{item_id}/", response_model=VaultItemPublic)
def update_item(
    item_id: UUID,
    data: VaultItemUpdate,
    session: SessionDep,
    current_user: UserJwtInfo = CurrentUser,
):
    try:
        return edit_item(item_id, current_user.id, data, session)
    except (ItemNotFound, NotOwner):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


@router.delete("/vault/items/{item_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: UUID,
    session: SessionDep,
    current_user: UserJwtInfo = CurrentUser,
):
    try:
        remove_item(item_id, current_user.id, session)
    except (ItemNotFound, NotOwner):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
