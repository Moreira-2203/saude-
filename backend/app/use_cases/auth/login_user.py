from __future__ import annotations

from datetime import datetime, timedelta

from ...core.security import hash_token, new_session_token, verify_password
from ...domain.value_objects.email import Email
from ...ports.repositories.session_repository import SessionRepository
from ...ports.repositories.user_repository import UserRepository


def login_user(
    user_repo: UserRepository,
    session_repo: SessionRepository,
    email: str,
    password: str,
    remember_me: bool,
    session_days_default: int,
    session_days_remember: int,
):
    normalized_email = str(Email(email))
    user = user_repo.get_by_email(normalized_email)
    if not user:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")

    token = new_session_token()
    token_hash = hash_token(token)
    days = session_days_remember if remember_me else session_days_default
    expires_at = datetime.utcnow() + timedelta(days=days)

    session_repo.create(user_id=user.id, token_hash=token_hash, expires_at=expires_at)
    return token, user, expires_at
