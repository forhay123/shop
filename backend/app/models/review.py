from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, String, Text, DateTime # 🟢 Import DateTime
from app.db.base import Base
from datetime import datetime # 🟢 Import datetime

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"))
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    # ✅ Add relationships
    user = relationship("User", back_populates="reviews")
    product = relationship("Product", back_populates="reviews")

    # 🟢 Add created_at column to track review creation time
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)