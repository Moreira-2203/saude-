from __future__ import annotations

from sqlalchemy.orm import Session

from ....domain.entities.user import User
from ...persistence.models import UserModel


class UserRepositorySql:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list_all(self, role: str | None = None) -> list[User]:
        query = self._db.query(UserModel)
        if role:
            query = query.filter(UserModel.role == role)
        models = query.order_by(UserModel.created_at.desc()).all()
        return [_to_entity(m) for m in models]

    def get_by_email(self, email: str) -> User | None:
        model = self._db.query(UserModel).filter(UserModel.email == email).first()
        return _to_entity(model) if model else None

    def get_by_id(self, user_id: str) -> User | None:
        model = self._db.query(UserModel).filter(UserModel.id == user_id).first()
        return _to_entity(model) if model else None

    def create(self, name: str, email: str, password_hash: str, role: str) -> User:
        model = UserModel(name=name, email=email, password_hash=password_hash, role=role)
        self._db.add(model)
        self._db.commit()
        self._db.refresh(model)
        return _to_entity(model)


def _to_entity(model: UserModel) -> User:
    return User(
        id=model.id,
        name=model.name,
        email=model.email,
        password_hash=model.password_hash,
        role=model.role,
        created_at=model.created_at,
    )
