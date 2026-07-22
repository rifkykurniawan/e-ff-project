import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Base schema containing shared properties
class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)

# Properties to receive on user creation
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)

# Properties to return to client
class UserResponse(UserBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Standard envelope response structure for User
class UserEnvelopeResponse(BaseModel):
    success: bool = True
    message: str = "User retrieved successfully"
    data: UserResponse

# Login request schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token response schema properties
class TokenData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Envelope token response
class TokenEnvelopeResponse(BaseModel):
    success: bool = True
    message: str = "Login successful"
    data: TokenData
