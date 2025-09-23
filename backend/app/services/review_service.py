from sqlalchemy.orm import Session, joinedload
from app.models.review import Review
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem  # <-- Import the OrderItem model
from fastapi import HTTPException, status
from typing import List


def create_review_for_delivered_item(
    db: Session, user_id: int, product_id: int, rating: int, comment: str | None = None
) -> Review:
    """Creates a review for a product, ensuring the user has a delivered order for it."""
    # Check if the user has a delivered order containing the product
    order_delivered = (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .filter(Order.status == "delivered")
        .join(OrderItem)  # <-- Explicitly join with OrderItem
        .filter(OrderItem.product_id == product_id)  # <-- Filter on OrderItem's product_id
        .first()
    )

    if not order_delivered:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review products from delivered orders.",
        )

    # Check if a review already exists for this user and product
    existing_review = (
        db.query(Review)
        .filter(Review.user_id == user_id)
        .filter(Review.product_id == product_id)
        .first()
    )

    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already reviewed this product.",
        )

    review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=rating,
        comment=comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def get_all_reviews(db: Session) -> List[Review]:
    """Admin-only: Fetches all reviews, with user and product details."""
    reviews = db.query(Review).options(
        joinedload(Review.user), joinedload(Review.product)
    ).order_by(Review.created_at.desc()).all()
    return reviews