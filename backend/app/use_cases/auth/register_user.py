from __future__ import annotations

from ...domain.value_objects.email import Email
from ...ports.repositories.user_repository import UserRepository
from ...core.security import hash_password

ALLOWED_ROLES = {"paciente", "medico", "recepcionista", "admin"}


def register_user(
    user_repo: UserRepository,
    name: str,
    email: str,
    password: str,
    role: str,
):
    if role not in ALLOWED_ROLES:
        raise ValueError("Invalid role")
    if len(password) < 6:
        raise ValueError("Password too short")

    normalized_email = str(Email(email))
    if user_repo.get_by_email(normalized_email):
        raise ValueError("Email already registered")

    password_hash = hash_password(password)
    return user_repo.create(name=name, email=normalized_email, password_hash=password_hash, role=role)
