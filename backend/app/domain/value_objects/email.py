from __future__ import annotations

import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class Email:
    def __init__(self, value: str) -> None:
        normalized = value.strip().lower()
        if not EMAIL_RE.match(normalized):
            raise ValueError("Invalid email")
        self.value = normalized

    def __str__(self) -> str:
        return self.value
