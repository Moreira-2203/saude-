from __future__ import annotations

from datetime import datetime
from typing import Protocol


class SessionRepository(Protocol):
    def create(self, user_id: str, token_hash: str, expires_at: datetime) -> None: ...

    def get_user_id(self, token_hash: str) -> str | None: ...

    def delete(self, token_hash: str) -> None: ...
