from __future__ import annotations

from ...ports.repositories.user_repository import UserRepository

ALLOWED_ROLES = {"paciente", "medico", "recepcionista", "admin"}


def list_users(user_repo: UserRepository, role: str | None = None):
    if role and role not in ALLOWED_ROLES:
        raise ValueError("Invalid role")
    return user_repo.list_all(role=role)
