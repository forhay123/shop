from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.order import Order
from app.models.user import User
from app.models.order_item import OrderItem
from app.models.product import Product
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from typing import List

def create_or_get_cart(db: Session, user: User) -> Order:
    """Finds or creates a pending order (cart) for a user."""
    cart = db.query(Order).filter(
        Order.user_id == user.id, Order.status == "pending"
    ).first()
    if not cart:
        cart = Order(user_id=user.id, status="pending", total_amount=0)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

def add_item_to_cart(db: Session, user: User, product_id: int, quantity: int) -> Order:
    """Adds a product to the user's cart or updates the quantity if it exists."""
    cart = create_or_get_cart(db, user)
    
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_item = db.query(OrderItem).filter(
        OrderItem.order_id == cart.id, OrderItem.product_id == product_id
    ).first()

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = OrderItem(
            order_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            price=product.selling_price
        )
        db.add(new_item)
    
    # Recalculate total amount and commit
    cart.total_amount = sum(item.quantity * item.price for item in cart.items)
    db.commit()
    db.refresh(cart)
    return cart

def update_cart_item_quantity(db: Session, user: User, item_id: int, new_quantity: int) -> Order:
    """Updates the quantity of a specific cart item."""
    item = db.query(OrderItem).options(joinedload(OrderItem.order)).get(item_id)
    
    if not item or item.order.user_id != user.id or item.order.status != "pending":
        raise HTTPException(status_code=404, detail="Cart item not found or not in your cart")
    
    if new_quantity <= 0:
        delete_cart_item(db, user, item_id)
        db.refresh(item.order) 
        return item.order
        
    item.quantity = new_quantity
    
    order = item.order
    order.total_amount = sum(i.quantity * i.price for i in order.items)
    db.commit()
    db.refresh(order)
    return order

def delete_cart_item(db: Session, user: User, item_id: int) -> None:
    """Deletes a specific item from the user's cart."""
    item = db.query(OrderItem).options(joinedload(OrderItem.order)).get(item_id)
    
    if not item or item.order.user_id != user.id or item.order.status != "pending":
        raise HTTPException(status_code=404, detail="Cart item not found or not in your cart")
    
    order = item.order
    db.delete(item)
    
    order.total_amount = sum(i.quantity * i.price for i in order.items)
    db.commit()
    db.refresh(order) 

# -------------------- Checkout --------------------

def checkout_cart_items(db: Session, user: User, selected_item_ids: List[int], cart_id: int) -> Order:
    """
    Processes checkout by updating the existing cart order to 'paid'.
    """
    try:
        # 1. Find the pending cart order
        order = db.query(Order).filter(
            Order.id == cart_id,
            Order.user_id == user.id,
            Order.status == "pending"
        ).options(
            joinedload(Order.items).joinedload(OrderItem.product)
        ).first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Pending cart not found or already processed."
            )

        # 2. Filter for items to be checked out and calculate total
        items_to_checkout = [item for item in order.items if item.id in selected_item_ids]
        
        if not items_to_checkout:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid items selected for checkout."
            )
        
        # 3. Validate stock and update product stock
        for item in items_to_checkout:
            if item.product.stock < item.quantity:
                raise HTTPException(status_code=400, detail=f"Not enough stock for {item.product.name}")
            item.product.stock -= item.quantity
        
        # 4. Remove unselected items from the cart and the database
        items_to_remove = [item for item in order.items if item.id not in selected_item_ids]
        for item in items_to_remove:
            db.delete(item)

        # 5. Update the existing order's status and total amount
        order.status = "paid"
        order.total_amount = sum(item.quantity * item.price for item in items_to_checkout)
        
        db.commit()
        db.refresh(order)
        
        return order
    
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error during checkout: {str(e)}")