from backend.auth.hash import hash_password, verify_password, _fake_salt
from sqlmodel import Session

from .schemas import UserCreate, UserPublic, UserLogin, UserJwtInfo, SaltResponse
from .repository import get_user_by_email, create_user


class EmailAlreadyTaken(Exception):
    """Raised when attempting to register with an email that already exists."""


class InvalidCredentials(Exception):
    """Raised when login credentials are incorrect."""


class InactiveAccount(Exception):
    """Raised when an inactive user attempts to log in."""

def get_user_salt(email: str, session: Session) -> SaltResponse:
    """Returns the salt for a given email, or a fake salt if the email doesn't exist."""
    user = get_user_by_email(email=email, session=session)
    if user:
        return SaltResponse(salt_base64=user.salt_base64)
    else:
        return SaltResponse(salt_base64=_fake_salt(email))

def register_user(user: UserCreate, session: Session) -> UserPublic:
    """
    Registers a new user.

    Raises:
        EmailAlreadyTaken: If the email is already registered.
    """
    if get_user_by_email(email=user.email, session=session):
        raise EmailAlreadyTaken(user.email)

    hashed = hash_password(user.auth_hash)
    created = create_user(
        username=user.username,
        email=user.email,
        auth_hash=hashed,
        salt_base64=user.salt_base64,
        session=session,
    )

    return UserPublic.model_validate(created)


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
        plain_password=credentials.auth_hash,
        hashed_password=user.auth_hash,
    ):
        raise InvalidCredentials()

    if not user.is_active:
        raise InactiveAccount()

    return UserJwtInfo.model_validate(user)
