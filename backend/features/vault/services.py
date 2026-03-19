from uuid import UUID
from sqlmodel import Session
from backend.shared import get_utc_now
from backend.auth.jwt import UserJwtInfo

from .schemas import VaultItemCreate, VaultItemUpdate, VaultItemPublic
from .repository import get_items_by_user, get_item_by_id, create_item, update_item, delete_item

class ItemNotFound(Exception):
    """Raised when a vault item is not found."""

class NotOwner(Exception):
    """Raised when a user tries to access an item they don't own."""



def list_items(user_id: UUID, session: Session) -> list[VaultItemPublic]:
    items = get_items_by_user(user_id, session)
    items_public = [VaultItemPublic.model_validate(i) for i in items] 
    return items_public


def add_item(user_jwt: UserJwtInfo, data: VaultItemCreate, session: Session) -> VaultItemPublic:
    item = create_item(user_jwt.id, data.model_dump(), session)
    return VaultItemPublic.model_validate(item)


def edit_item(
    item_id: UUID, user_id: UUID, data: VaultItemUpdate, session: Session
) -> VaultItemPublic:
    item = _get_owned_item(item_id, user_id, session)
    updated = update_item(
        item,
        {**data.model_dump(), "updated_at": get_utc_now()},
        session,
    )
    return VaultItemPublic.model_validate(updated)


def remove_item(item_id: UUID, user_id: UUID, session: Session) -> None:
    item = _get_owned_item(item_id, user_id, session)
    delete_item(item, session)


def _get_owned_item(item_id: UUID, user_id: UUID, session: Session) -> ...:
    """
    Verifica existencia y ownership en un solo lugar.
    Separar ItemNotFound de NotOwner permite devolver 404 en ambos casos
    desde la ruta — no le decimos al cliente si el ítem existe pero no es suyo.
    """
    item = get_item_by_id(item_id, session)
    if not item:
        raise ItemNotFound()
    if item.user_id != user_id:
        raise NotOwner()
    return item