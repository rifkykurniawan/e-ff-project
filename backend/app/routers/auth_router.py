from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.auth_service import AuthService
from app.schemas.user_schema import (
    UserLogin,
    TokenEnvelopeResponse,
    TokenData,
    UserResponse,
    UserEnvelopeResponse
)
from app.dependencies.auth_dep import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/login",
    response_model=TokenEnvelopeResponse,
    summary="Login to receive access token"
)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    user = await auth_service.authenticate_user(
        email=credentials.email,
        password=credentials.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = await auth_service.generate_user_token(user)
    
    # We load UserResponse schema to serialize the user correctly
    user_response = UserResponse.model_validate(user)
    
    return TokenEnvelopeResponse(
        success=True,
        message="Login successful",
        data=TokenData(
            access_token=token,
            user=user_response
        )
    )

@router.get(
    "/me",
    response_model=UserEnvelopeResponse,
    summary="Get current logged in user details"
)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    user_response = UserResponse.model_validate(current_user)
    return UserEnvelopeResponse(
        success=True,
        message="User profile retrieved successfully",
        data=user_response
    )
