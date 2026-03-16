from uuid import UUID
from sqlmodel import Session, select
from .models import VaultItem
from .schemas import VaultItemCreate, VaultItemUpdate


def get_items_by_user(user_id: UUID, session: Session) -> list[VaultItem]:
    statement = select( VaultItem
        ).where( VaultItem.user_id == user_id
        ).order_by( VaultItem.updated_at.desc()
        )
    items = session.exec(statement).all()
    return items


def get_item_by_id(item_id: UUID, session: Session) -> VaultItem | None:
    return session.get(VaultItem, item_id)


def create_item(user_id: UUID, data: VaultItemCreate, session: Session) -> VaultItem:
    item_data = {"user_id": user_id, **data}
    item = VaultItem.model_validate(item_data)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def update_item(item: VaultItem, data: VaultItemUpdate, session: Session) -> VaultItem:
    
    item.sqlmodel_update(data.model_dump(exclude_unset=True))

    session.add(item)
    session.commit()
    session.refresh(item)
    return item


def delete_item(item: VaultItem, session: Session) -> None:
    session.delete(item)
    session.commit()