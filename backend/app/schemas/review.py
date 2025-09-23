from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.user import UserOut
from app.schemas.product import ProductOut

class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None

class ReviewIn(ReviewBase):
    product_id: int

class ReviewOut(ReviewBase):
    id: int
    user_id: int
    product_id: int
    created_at: datetime
    # Optional relationships to include user and product details
    user: UserOut | None = None
    product: ProductOut | None = None

    class Config:
        from_attributes = True