# app/api/routes/cart.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.order import OrderOut, CheckoutPayload, AddItemPayload 
from app.schemas.order_item import OrderItemUpdateQuantity
from app.services.cart_service import (
    create_or_get_cart,
    add_item_to_cart,
    update_cart_item_quantity,
    delete_cart_item,
    checkout_cart_items,
)

router = APIRouter(tags=["Cart"])

@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def add_item_to_cart_route(
    payload: AddItemPayload, # ✅ Now it expects a flat object
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Adds a new item to the user's cart (pending order).
    Creates a new cart if one doesn't exist.
    """
    return add_item_to_cart(db, current_user, payload.product_id, payload.quantity)


@router.put("/items/{item_id}", response_model=OrderOut)
def update_cart_item_quantity_route(
    item_id: int,
    payload: OrderItemUpdateQuantity,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Updates the quantity of a specific item in the user's cart."""
    return update_cart_item_quantity(db, current_user, item_id, payload.quantity)


@router.delete("/items/{item_id}")
def delete_cart_item_route(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deletes a specific item from the user's cart."""
    delete_cart_item(db, current_user, item_id)
    return {"message": "Item removed from cart"}

# ------------------- CHECKOUT -------------------
@router.post("/checkout", response_model=OrderOut)
def checkout_selected_items(
    payload: CheckoutPayload, # ✅ Use the Pydantic model for validation
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Checks out selected items from the user's cart.
    Moves them to a new 'paid' order.
    """
    # The payload is now a CheckoutPayload object, access its attributes
    selected_item_ids = payload.selected_item_ids
    cart_id = payload.cart_id

    # ✅ Pass cart_id to the service function
    return checkout_cart_items(db, current_user, selected_item_ids, cart_id)