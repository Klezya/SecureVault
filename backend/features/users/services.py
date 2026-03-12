from backend.auth.hash import hash_password, verify_password
from sqlmodel import Session

from .schemas import UserCreate, UserPublic, UserLogin, UserJwtInfo
from .repository import get_user_by_email, create_user


class EmailAlreadyTaken(Exception):
    """Raised when attempting to register with an email that already exists."""


class InvalidCredentials(Exception):
    """Raised when login credentials are incorrect."""


class InactiveAccount(Exception):
    """Raised when an inactive user attempts to log in."""


def register_user(user: UserCreate, session: Session) -> UserPublic:
    """
    Registers a new user.

    Raises:
        EmailAlreadyTaken: If the email is already registered.
    """
    if get_user_by_email(email=user.email, session=session):
        raise EmailAlreadyTaken(user.email)

    hashed = hash_password(user.password)
    created = create_user(
        username=user.username,
        email=user.email,
        password_hash=hashed,
        session=session,
    )

    return UserPublic(username=created.username, email=created.email)


def authenticate_user(credentials: UserLogin, session: Session) -> UserJwtInfo:
    """
    Authenticates a user by email and password.

    Raises:
        InvalidCredentials: If the email doesn't exist or the password is wrong.
        InactiveAccount: If the user account is inactive.
    """
    user = get_user_by_email(email=credentials.email, session=session)
    if not user:
        raise InvalidCredentials()

    if not verify_password(
        plain_password=credentials.password,
        hashed_password=user.password_hash,
    ):
        raise InvalidCredentials()

    if not user.is_active:
        raise InactiveAccount()

    return UserJwtInfo(
        id=user.id,
        username=user.username,
        email=user.email,
        is_active=user.is_active,
    )
