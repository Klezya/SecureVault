from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from pydantic import EmailStr

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(unique=True)
    email: EmailStr = Field(index=True, unique=True)
    password_hash: str
    is_active: bool = Field(default=True)