from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from backend.shared import get_utc_now
from datetime import datetime

class Password(SQLModel, table=True):
    __tablename__ = "passwords"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    password_hash: str
    created_at: datetime = Field(default_factory= get_utc_now)