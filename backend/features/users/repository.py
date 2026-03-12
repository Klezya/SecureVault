from backend.auth.hash import hash_password
from sqlmodel import Session, select
from .models import UserTable, UserCreate

def select_user_by_email(email: str, session: Session) -> UserTable | None:
    """
    Retrieves a user from the database based on their email address.
    Args:        
        email (str): The email address of the user to retrieve.
        session (Session): Injectable database session dependency.
    Returns:
        user (UserTable): The user object if found, otherwise None.
    """
    statement = select(
            UserTable
        ).where(
            UserTable.email == email
        )
    user = session.exec(statement).first()
    if not user:
        return None
    return user

def insert_user(user_data: UserCreate, session: Session) -> UserTable:
    """
    Inserts a new user into the database.
    Args:
        user_data (UserCreate): The data for the user to create.
        session (Session): Injectable database session dependency.
    Returns:
        UserTable: The created user object.
    """
    user_data.password = hash_password(user_data.password)

    user_data = UserTable(
        username=user_data.username,
        email=user_data.email,
        password_hash=user_data.password
    )
    
    session.add(user_data)
    session.commit()
    session.refresh(user_data)

    return user_data