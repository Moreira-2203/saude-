from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from .user import UserPublic


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: bool = False


class LoginResponse(BaseModel):
    user: UserPublic
    expires_at: datetime
