from fastapi import APIRouter, HTTPException, status
from backend.core.database import SessionDep

from .models import UserCreate, UserPublic
from .services import is_email_taken, create_user

router = APIRouter()

@router.post("/auth/register/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def post_user(user: UserCreate, session: SessionDep):
    """
    Endpoint to register a new user.
    Args:
        user (UserCreate): The user data to create.
    Returns:
        UserPublic: The created user data.
    """
    if is_email_taken(email=user.email, session=session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Email is already registered"
        )

    return create_user(user_data=user, session=session)