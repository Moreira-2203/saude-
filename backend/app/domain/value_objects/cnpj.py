from __future__ import annotations

import re


class Cnpj:
    def __init__(self, value: str) -> None:
        digits = re.sub(r"\D", "", value or "")
        if len(digits) != 14:
            raise ValueError("Invalid CNPJ length")
        self.value = digits

    def __str__(self) -> str:
        return self.value
