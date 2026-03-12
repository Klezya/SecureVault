from backend.auth.hash import hash_password, verify_password
from sqlmodel import Session, select

from .models import UserCreate, UserPublic, UserLogin, UserJwtInfo
from .repository import select_user_by_email, insert_user 

def is_email_taken(email: str, session: Session) -> bool:
    """
    Checks if an email address is already registered in the database.
    Args:
        email (str): The email address to check for availability.
        session (Session): Injectable database session dependency.
    Returns:
        bool: True if the email is already taken, False otherwise.
    """
    user = select_user_by_email(email, session)
    if not user:
        return False
    return True

def user_exists(email:str, session: Session) -> bool:
    """
    Checks if a user with the given email exists in the database.
    Args:
        email (str): The email address to check for existence.
        session (Session): Injectable database session dependency.
    Returns:
        bool: True if the user exists, False otherwise.
    """
    if is_email_taken(email=email, session=session):
        return True
    return False

def authenticate_user(user: UserLogin, session: Session) -> UserJwtInfo:
    """
    Authenticates a user by verifying their email and password.
    Args:
        user (UserLogin): The user login data containing email and password.
        session (Session): Injectable database session dependency.
    Returns:
        UserJwtInfo: The user information to include in the JWT token if authentication is successful.
    Raises:
        HTTPException: If the user does not exist or the password is incorrect.
    """
    database_user = select_user_by_email(email=user.email, session=session)
    if not database_user:
        return None
    if not verify_password(plain_password=user.password, hashed_password=database_user.password_hash):
        return None
    
    user_jwt_info = UserJwtInfo(
        username=database_user.username,
        email=database_user.email,
        is_active=database_user.is_active
    )

    return user_jwt_info
    
    

