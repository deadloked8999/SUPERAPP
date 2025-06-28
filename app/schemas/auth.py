from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: str = "unknown"
    subrole_code: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    code: Optional[str] = None
    auth_expires: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class AuthCodeRequest(BaseModel):
    username: str

class AuthCodeVerify(BaseModel):
    username: str
    code: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[User] = None 