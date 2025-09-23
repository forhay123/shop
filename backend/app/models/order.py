from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, Float, ForeignKey, String, DateTime
from datetime import datetime
from app.db.base import Base
from typing import List


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    total_amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    # New column to store the shipping tracking ID
    tracking_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationship with User
    user = relationship("User", back_populates="orders")
    # add at bottom inside Order class
    items: Mapped[List["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")