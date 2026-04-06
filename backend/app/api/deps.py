from __future__ import annotations

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..adapters.persistence.repositories.session_repository_sql import SessionRepositorySql
from ..adapters.persistence.repositories.user_repository_sql import UserRepositorySql
from ..core.config import load_settings
from ..core.db import get_db
from ..use_cases.auth.get_current_user import get_current_user as get_current_user_uc

settings = load_settings()


def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_repo = UserRepositorySql(db)
    session_repo = SessionRepositorySql(db)
    user = get_current_user_uc(user_repo=user_repo, session_repo=session_repo, session_token=token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
