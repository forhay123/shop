from typing import List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.api.deps import get_db, get_current_user, get_current_admin_user, get_current_read_admin_user # ✅ Import new dependency
from app.models.order import Order
from app.models.user import User
from app.models.order_item import OrderItem
from app.schemas.order import OrderOut, OrderShip
from app.services.order_service import ship_order, acknowledge_delivery

router = APIRouter(tags=["Orders"])

# ------------------- USER: GET MY ORDERS -------------------
@router.get("/me", response_model=List[OrderOut])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetches all orders (pending and history) for the logged-in user."""
    orders = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [OrderOut.model_validate(order) for order in orders]


# ------------------- ADMIN: MANAGE ORDERS -------------------
@router.get("/", response_model=List[OrderOut])
def get_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_read_admin_user), # ✅ Use new read-only dependency
):
    """Admin-only: Fetches all orders from all users."""
    orders = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.created_at.desc())
        .all()
    )
    return [OrderOut.model_validate(order) for order in orders]


# ------------------- ADMIN: UPDATE ORDER STATUS -------------------
@router.put("/{order_id}", response_model=OrderOut)
def update_order_route(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user), # ❌ Keep the full admin dependency
):
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return OrderOut.model_validate(order)


# ------------------- ADMIN: DELETE ORDER -------------------
@router.delete("/{order_id}")
def delete_order_route(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user), # ❌ Keep the full admin dependency
):
    order = db.query(Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"detail": "Order deleted successfully"}


# ------------------- ADMIN: SHIP ORDER -------------------
@router.post("/{order_id}/ship", response_model=OrderOut)
def ship_order_route(
    order_id: int,
    ship_data: OrderShip,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user), # ❌ Keep the full admin dependency
):
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "paid":
        raise HTTPException(status_code=400, detail="Order cannot be shipped")
    order.status = "shipped"
    order.tracking_id = ship_data.tracking_id
    db.commit()
    db.refresh(order)
    return OrderOut.model_validate(order)


# ✅ New endpoint for delivery acknowledgment
@router.post("/{order_id}/delivered", response_model=OrderOut)
def acknowledge_delivery_route(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    User or Admin acknowledges an order as 'delivered'.
    Only the order owner or an admin can perform this action.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    # Permission check for user or admin
    if order.user_id != current_user.id and current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to acknowledge this delivery."
        )

    # Call the service function to update the status
    return acknowledge_delivery(db, order_id)