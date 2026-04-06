from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ...adapters.persistence.repositories.user_repository_sql import UserRepositorySql
from ...core.db import get_db
from ...schemas.user import UserPublic
from ...use_cases.users.list_users import list_users
from ..deps import get_current_user

router = APIRouter(tags=["users"])


@router.get("/users", response_model=list[UserPublic])
def list_all(
    role: str | None = Query(default=None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user.role != "admin":
        if user.role == "recepcionista" and role == "paciente":
            pass
        else:
            raise HTTPException(status_code=403, detail="Not allowed")

    user_repo = UserRepositorySql(db)
    try:
        users = list_users(user_repo, role=role)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return [
        UserPublic(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            created_at=u.created_at,
        )
        for u in users
    ]
