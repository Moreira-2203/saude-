from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from ...adapters.persistence.repositories.session_repository_sql import SessionRepositorySql
from ...adapters.persistence.repositories.user_repository_sql import UserRepositorySql
from ...core.config import load_settings
from ...core.db import get_db
from ...schemas.auth import LoginRequest, LoginResponse, RegisterRequest
from ...schemas.user import UserPublic
from ...use_cases.auth.login_user import login_user
from ...use_cases.auth.logout_user import logout_user
from ...use_cases.auth.register_user import register_user
from ..deps import get_current_user

router = APIRouter(tags=["auth"])
settings = load_settings()


@router.post("/auth/register", response_model=UserPublic)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user_repo = UserRepositorySql(db)
    try:
        user = register_user(
            user_repo=user_repo,
            name=payload.name,
            email=payload.email,
            password=payload.password,
            role=payload.role,
        )
        return _to_user_public(user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user_repo = UserRepositorySql(db)
    session_repo = SessionRepositorySql(db)
    try:
        token, user, expires_at = login_user(
            user_repo=user_repo,
            session_repo=session_repo,
            email=payload.email,
            password=payload.password,
            remember_me=payload.remember_me,
            session_days_default=settings.session_days_default,
            session_days_remember=settings.session_days_remember,
        )
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc

    max_age_days = settings.session_days_remember if payload.remember_me else settings.session_days_default
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=max_age_days * 24 * 60 * 60,
    )
    return LoginResponse(user=_to_user_public(user), expires_at=expires_at)


@router.post("/auth/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    session_repo = SessionRepositorySql(db)
    token = request.cookies.get(settings.session_cookie_name)
    if token:
        logout_user(session_repo=session_repo, session_token=token)
    response.delete_cookie(settings.session_cookie_name)
    return {"ok": True}


@router.get("/auth/me", response_model=UserPublic)
def me(user=Depends(get_current_user)):
    return _to_user_public(user)


def _to_user_public(user) -> UserPublic:
    return UserPublic(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
    )
