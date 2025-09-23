# app/schemas/order.py
from pydantic import BaseModel, ConfigDict, Field # ✅ Add Field here
from datetime import datetime
from typing import List, Optional

from app.schemas.user import UserOut 
from app.schemas.product import ProductOut 
from app.schemas.order_item import OrderItemBase, OrderItemOut

# Schema for the full order creation payload
class OrderCreate(BaseModel):
    items: List[OrderItemBase]


# Schema for a full order response, including user and items
class OrderOut(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    tracking_id: Optional[str] = None
    items: List[OrderItemOut]
    user: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

class CheckoutPayload(BaseModel):
    selected_item_ids: List[int]
    cart_id: int

# New Pydantic model for the request body when shipping an order
class OrderShip(BaseModel):
    tracking_id: str

# Your AddItemPayload model
class AddItemPayload(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)