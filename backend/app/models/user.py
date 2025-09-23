from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Enum, Boolean, DateTime
from app.core.roles import Role
from app.db.base import Base
from typing import List


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role), index=True)

    # Email verification
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_token: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Password reset
    reset_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reset_token_expiry: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)

    # Profile fields
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    birthday: Mapped[str | None] = mapped_column(String(10), nullable=True)  # e.g. "07-15"
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    sex: Mapped[str | None] = mapped_column(String(10), nullable=True)       # "Male", "Female"
    photo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Relationship with orders
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")

    # ✅ Add relationship with reviews
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="user")