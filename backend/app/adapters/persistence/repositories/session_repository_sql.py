from __future__ import annotations

from datetime import datetime

from sqlalchemy.orm import Session

from ...persistence.models import SessionModel


class SessionRepositorySql:
    def __init__(self, db: Session) -> None:
        self._db = db

    def create(self, user_id: str, token_hash: str, expires_at: datetime) -> None:
        model = SessionModel(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        self._db.add(model)
        self._db.commit()

    def get_user_id(self, token_hash: str) -> str | None:
        model = (
            self._db.query(SessionModel)
            .filter(SessionModel.token_hash == token_hash)
            .first()
        )
        if not model or model.expires_at < datetime.utcnow():
            return None
        return model.user_id

    def delete(self, token_hash: str) -> None:
        self._db.query(SessionModel).filter(SessionModel.token_hash == token_hash).delete()
        self._db.commit()
