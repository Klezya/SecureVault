from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from pydantic import EmailStr

# Tabla de usuarios
class UserTable(SQLModel, table=True):
    """
    User table model, for table creation and ORM mapping. 
    DO NOT USE IN API SCHEMAS OR ROUTES.
    """
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(unique=True)
    email: EmailStr = Field(index=True, unique=True)
    password_hash: str
    is_active: bool = Field(default=True)

# Esquemas para recibir y enviar datos relacionados con los usuarios
class UserPublic(SQLModel):
    """
    Schema for public user data, used in API responses.
    Args:
        id (UUID): The unique identifier of the user.
        username (str): The username of the user.
        email (EmailStr): The email address of the user.
    """
    username: str
    email: EmailStr

class UserCreate(SQLModel):
    """
    Schema for creating a new user.
    Args:
        username (str): The desired username for the new user.
        email (EmailStr): The email address of the new user.
        password (str): The plain text password for the new user.
    """
    username: str
    email: EmailStr
    password: str
