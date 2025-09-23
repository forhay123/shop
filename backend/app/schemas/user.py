from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


# ----------------------
# For registering users
# ----------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None   # optional field
    # ❌ role removed (defaults to "user" in backend)

    
    # ✅ Add new optional profile fields
    address: Optional[str] = None
    birthday: Optional[str] = None
    phone: Optional[str] = None
    sex: Optional[str] = None

# ----------------------
# For returning user info
# ----------------------
class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    role: str   # will be set automatically to "user"
    is_verified: Optional[bool] = False

    # ✅ This line must be present
    model_config = ConfigDict(from_attributes=True)


# ----------------------
# For login token response
# ----------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
