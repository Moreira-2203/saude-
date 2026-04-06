from __future__ import annotations

from typing import Protocol

from ...domain.entities.user import User


class UserRepository(Protocol):
    def list_all(self, role: str | None = None) -> list[User]: ...

    def get_by_email(self, email: str) -> User | None: ...

    def get_by_id(self, user_id: str) -> User | None: ...

    def create(self, name: str, email: str, password_hash: str, role: str) -> User: ...
