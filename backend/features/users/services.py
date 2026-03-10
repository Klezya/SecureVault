from backend.auth.hash import hash_password
from sqlmodel import Session, select
from .models import UserTable, UserCreate, UserPublic

def get_user_by_email(email: str, session: Session):
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

def create_user(user_data: UserCreate, session: Session):
    """
    Creates a new user in the database.
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

    user_public = UserPublic(
        username=user_data.username,
        email=user_data.email
    )

    return user_public

def is_email_taken(email: str, session: Session) -> bool:
    """
    Checks if an email address is already registered in the database.
    Args:
        email (str): The email address to check for availability.
        session (Session): Injectable database session dependency.
    Returns:
        bool: True if the email is already taken, False otherwise.
    """
    user = get_user_by_email(email, session)
    if not user:
        return False
    return True

