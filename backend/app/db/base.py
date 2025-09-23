# app/db/base.py
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# ✅ Import all models here so Alembic can discover them
from app.models import user
from app.models import product
from app.models import order
from app.models import review
from app.models import order_item
