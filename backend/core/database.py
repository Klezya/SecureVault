from sqlmodel import SQLModel, create_engine, Session
from backend.core.settings import settings
from typing import Annotated
from fastapi import Depends

engine = create_engine(
    settings.DATABASE_URL, 
    echo=settings.DEBUG
)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    from backend.features import UserTable, VaultItem
    from backend.auth.models import RefreshTokenTable
    SQLModel.metadata.create_all(engine)

SessionDep = Annotated[Session, Depends(get_session)]


