import os
import shutil
from typing import Optional, List
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from app.models.product import Product
from app.core.config import settings

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

def save_image(file: UploadFile) -> Optional[str]:
    """Save uploaded image to disk and return the filename."""
    if not file:
        return None
    filename = file.filename
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    # Overwrite if exists
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return filename

# ---------------- CRUD ----------------

def create_product(
    db: Session,
    name: str,
    description: Optional[str],
    price: float,
    selling_price: float,  # 🟢 ADDED
    profit_margin_percentage: float, # 🟢 ADDED
    stock: int,
    category: Optional[str],
    image: Optional[UploadFile],
) -> Product:
    """Create and persist a new product with optional image."""
    image_filename = save_image(image) if image else None
    product = Product(
        name=name,
        description=description,
        price=price,
        selling_price=selling_price, # 🟢 ADDED
        profit_margin_percentage=profit_margin_percentage, # 🟢 ADDED
        stock=stock,
        category=category or "Uncategorized",
        image_url=image_filename
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_products(db: Session, category: Optional[str] = None) -> List[Product]:
    """Return all products, optionally filtered by category."""
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    return query.all()

def get_product_by_id(db: Session, product_id: int) -> Product:
    """Return a single product by ID or raise 404."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found"
        )
    return product

def update_product(
    db: Session,
    product_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    price: Optional[float] = None,
    selling_price: Optional[float] = None, # 🟢 ADDED
    profit_margin_percentage: Optional[float] = None, # 🟢 ADDED
    stock: Optional[int] = None,
    category: Optional[str] = None,
    image: Optional[UploadFile] = None,
) -> Product:
    """Update product fields; only provided fields are updated. Optionally replace image."""
    product = get_product_by_id(db, product_id)

    if name is not None:
        product.name = name
    if description is not None:
        product.description = description
    if price is not None:
        product.price = price
    if selling_price is not None: # 🟢 ADDED
        product.selling_price = selling_price
    if profit_margin_percentage is not None: # 🟢 ADDED
        product.profit_margin_percentage = profit_margin_percentage
    if stock is not None:
        product.stock = stock
    if category is not None:
        product.category = category
    if image:
        # Remove old image if exists
        if product.image_url:
            old_path = os.path.join(settings.UPLOAD_DIR, product.image_url)
            if os.path.exists(old_path):
                os.remove(old_path)
        product.image_url = save_image(image)

    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, product_id: int) -> dict:
    """Delete a product by ID and remove image from disk."""
    product = get_product_by_id(db, product_id)
    if product.image_url:
        filepath = os.path.join(settings.UPLOAD_DIR, product.image_url)
        if os.path.exists(filepath):
            os.remove(filepath)
    db.delete(product)
    db.commit()
    return {"detail": "Product deleted successfully"}