from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    name: Optional[str] = None
    email: Optional[str] = None


class TokenData(BaseModel):
    sub: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str
