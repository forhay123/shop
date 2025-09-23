import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base

# Import models (needed for auto table creation)
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.review import Review

# Import routers
from app.api.routes import auth, users, products, orders, reviews, uploads, cart

# -------------------- FastAPI App --------------------
app = FastAPI(title=settings.PROJECT_NAME)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Auto-create Tables --------------------
Base.metadata.create_all(bind=engine)

# -------------------- API Routes --------------------
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
# app.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])

# -------------------- Static Uploads --------------------
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# -------------------- Serve Vite Frontend --------------------
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="shop")
else:
    print(f"Warning: Frontend dist folder not found at {FRONTEND_DIST}")
