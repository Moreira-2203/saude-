from __future__ import annotations

from ...core.security import hash_token
from ...ports.repositories.session_repository import SessionRepository
from ...ports.repositories.user_repository import UserRepository


def get_current_user(
    user_repo: UserRepository,
    session_repo: SessionRepository,
    session_token: str,
):
    token_hash = hash_token(session_token)
    user_id = session_repo.get_user_id(token_hash)
    if not user_id:
        return None
    return user_repo.get_by_id(user_id)
