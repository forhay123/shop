from sqlalchemy.orm import Session
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.review import Review
from app.models.product import Product
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from typing import List

def get_user_orders(db: Session, user_id: int) -> List[Order]:
    """Fetches all orders for a user, with their items, products, and reviews."""
    orders = (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.items).joinedload(OrderItem.product).joinedload(Product.reviews)
        )
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


def update_order_status(db: Session, order_id: int, status: str) -> Order:
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    db.refresh(order)
    return order


def delete_order(db: Session, order_id: int) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    return order


def ship_order(db: Session, order_id: int, tracking_id: str) -> Order:
    """Updates an order's status to 'shipped' and adds a tracking ID."""
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "paid":
        raise HTTPException(status_code=400, detail="Order has not been paid yet")

    order.status = "shipped"
    order.tracking_id = tracking_id
    db.commit()
    db.refresh(order)
    return order


def acknowledge_delivery(db: Session, order_id: int) -> Order:
    """Marks a shipped order as 'delivered'."""
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.status != "shipped":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Order cannot be marked as delivered. It must be 'shipped' first."
        )

    order.status = "delivered"
    db.commit()
    db.refresh(order)
    return order