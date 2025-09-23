from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user, get_current_read_admin_user # ✅ Import new dependency
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter()


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=List[UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_read_admin_user), # ✅ Use new read-only dependency
):
    """
    Admin-only: Retrieves a list of all users.
    Read-only admins can now view this page.
    """
    return db.query(User).all()