from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from enum import Enum
from backend.shared import get_utc_now


class ItemType(str, Enum):
    PASSWORD = "password"
    NOTE = "note"


class VaultItem(SQLModel, table=True):
    __tablename__ = "vault_items"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    item_type: ItemType
    ciphertext: str  # AES-256-GCM output, base64
    iv: str          # 12 bytes, base64 — único por cifrado
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)