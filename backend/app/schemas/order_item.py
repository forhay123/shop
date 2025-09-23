from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

# ✅ FIX: Import ProductOut schema
from app.schemas.product import ProductOut 

# Base schema for creating or updating an order item.
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

# Schema for the full order item details
class OrderItemOut(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float
    # ✅ FIX: Uncomment this line to include the nested product data
    product: ProductOut 

    # ✅ FIX: Use the Pydantic v2 configuration
    model_config = ConfigDict(from_attributes=True)

class OrderItemUpdateQuantity(BaseModel):
    quantity: int = Field(..., gt=0, description="New quantity for the item")