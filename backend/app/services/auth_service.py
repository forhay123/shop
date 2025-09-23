import os
from uuid import uuid4
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

from app.models.user import User
from app.core.security import verify_password, get_password_hash
from app.core.roles import Role
from app.core.config import settings


# --- Configure FastAPI-Mail dynamically ---
conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,
    MAIL_PASSWORD=settings.SMTP_PASSWORD,
    MAIL_FROM=settings.EMAILS_FROM_EMAIL,
    MAIL_PORT=settings.SMTP_PORT,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_STARTTLS=settings.SMTP_STARTTLS,
    MAIL_SSL_TLS=settings.SMTP_SSL,
    USE_CREDENTIALS=True,
)


# --- Verification Email ---
async def send_verification_email(user: User, db: Session):
    verification_token = str(uuid4())
    user.verification_token = verification_token
    db.add(user)
    db.commit()
    db.refresh(user)

    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"

    message = MessageSchema(
        subject="Verify your account",
        recipients=[user.email],
        body=(
            f"Hi {user.name},\n\n"
            f"Please click the link to verify your email:\n{verification_link}\n\n"
            f"Thanks!"
        ),
        subtype="plain",
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return {"message": f"Verification email sent to {user.email}"}
    except Exception as e:
        print(f"❌ Email sending failed: {e}")
        return {"message": f"User created but email not sent. Reason: {e}"}


def verify_user_email(token: str, db: Session) -> bool:
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        return False
    user.is_verified = True
    user.verification_token = None
    db.add(user)
    db.commit()
    return True


# --- Password Reset Email ---
async def send_password_reset_email(user: User, db: Session):
    reset_token = str(uuid4())
    reset_token_expiry = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_CODE_EXPIRE_MINUTES
    )

    user.reset_token = reset_token
    user.reset_token_expiry = reset_token_expiry
    db.add(user)
    db.commit()
    db.refresh(user)

    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[user.email],
        body=(
            f"Hi {user.name},\n\n"
            f"Click the link below to reset your password:\n{reset_link}\n\n"
            f"If you did not request this, you can safely ignore this email."
        ),
        subtype="plain",
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return {"message": f"Password reset email sent to {user.email}"}
    except Exception as e:
        print(f"❌ Password reset email failed: {e}")
        return {"message": f"Password reset email not sent. Reason: {e}"}


def reset_password(token: str, new_password: str, db: Session) -> bool:
    user = (
        db.query(User)
        .filter(
            User.reset_token == token,
            User.reset_token_expiry > datetime.utcnow(),
        )
        .first()
    )
    if not user:
        return False
    user.password_hash = get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.add(user)
    db.commit()
    return True


# --- Auth Helpers ---
def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def create_user(db: Session, email: str, password: str, name: str) -> User:
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        password_hash=hashed_password,
        name=name,
        role=Role.USER,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
