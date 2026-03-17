from sqlmodel import SQLModel
from uuid import UUID
from datetime import datetime
from .models import ItemType


class VaultItemCreate(SQLModel):
    """Lo que el cliente envía al crear un ítem."""
    item_type: ItemType
    ciphertext: str
    iv: str


class VaultItemUpdate(SQLModel):
    """Lo que el cliente envía al editar — siempre re-cifra todo."""
    ciphertext: str
    iv: str


class VaultItemPublic(SQLModel):
    """Lo que el servidor devuelve — nunca datos en plano."""
    item_type: ItemType
    ciphertext: str
    iv: str