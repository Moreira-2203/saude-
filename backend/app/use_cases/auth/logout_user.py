from __future__ import annotations

from ...core.security import hash_token
from ...ports.repositories.session_repository import SessionRepository


def logout_user(session_repo: SessionRepository, session_token: str) -> None:
    token_hash = hash_token(session_token)
    session_repo.delete(token_hash)
