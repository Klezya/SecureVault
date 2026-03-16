from sqlmodel import SQLModel
from uuid import UUID
from datetime import datetime
from typing import Literal

type ItemType = Literal['password', 'note']


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
    id: UUID
    item_type: ItemType
    ciphertext: str
    iv: str
    created_at: datetime
    updated_at: datetime