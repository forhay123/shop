from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user, get_current_admin_user, get_current_read_admin_user # ✅ Import new dependency
from app.schemas.review import ReviewIn, ReviewOut
from app.services.review_service import (
    create_review_for_delivered_item,
    get_all_reviews
)

router = APIRouter(tags=["Reviews"])

@router.post("/", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review_route(
    review_in: ReviewIn,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Allows a user to create a review for a delivered product."""
    return create_review_for_delivered_item(
        db=db,
        user_id=current_user.id,
        product_id=review_in.product_id,
        rating=review_in.rating,
        comment=review_in.comment,
    )

@router.get("/admin", response_model=List[ReviewOut])
def get_all_reviews_route(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_read_admin_user), # ✅ Use new read-only dependency
):
    """Admin-only: Retrieves a list of all reviews."""
    return get_all_reviews(db=db)