from typing import List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.product_service import (
    create_product,
    get_products,
    get_product_by_id,
    update_product,
    delete_product,
)
from app.schemas.product import ProductOut
from app.api.deps import get_current_admin_user, get_current_read_admin_user # ✅ Import new dependency

router = APIRouter(tags=["Products"])

# ---------------- Public Routes ----------------

@router.get("/", response_model=List[ProductOut])
def list_products(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Public: list all products. Optionally filter by category."""
    return get_products(db, category=category)

@router.get("/{product_id}", response_model=ProductOut)
def retrieve_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Public: get one product by id."""
    return get_product_by_id(db, product_id)

# ---------------- Admin-only Routes ----------------
# ✅ NEW: Admin GET route for products, requiring read-only access
@router.get("/admin", response_model=List[ProductOut])
def list_products_admin(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_read_admin_user),
):
    """Admin-only: list all products with admin permissions."""
    return get_products(db, category=category)

@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product_route(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    selling_price: float = Form(...),
    profit_margin_percentage: float = Form(0.0),
    stock: int = Form(...),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user), # ❌ Keep the full admin dependency
):
    """Admin only: create a new product."""
    return create_product(db, name, description, price, selling_price, profit_margin_percentage, stock, category, image)

@router.put("/{product_id}", response_model=ProductOut)
def update_product_route(
    product_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    selling_price: Optional[float] = Form(None),
    profit_margin_percentage: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user), # ❌ Keep the full admin dependency
):
    """Admin only: update product fields."""
    return update_product(db, product_id, name, description, price, selling_price, profit_margin_percentage, stock, category, image)

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product_route(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin_user), # ❌ Keep the full admin dependency
):
    """Admin only: delete a product."""
    return delete_product(db, product_id)