from sqlmodel import Session, select
from .models import UserTable


def get_user_by_email(email: str, session: Session) -> UserTable | None:
    """Retrieves a user by email, or None if not found."""
    statement = select(UserTable).where(UserTable.email == email)
    return session.exec(statement).first()


def create_user(
    username: str, email: str, auth_hash: str, salt_base64: str, session: Session
) -> UserTable:
    """Inserts a new user and returns the created record."""
    user = UserTable(
        username=username,
        email=email,
        auth_hash=auth_hash,
        salt_base64=salt_base64,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user