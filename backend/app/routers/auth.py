from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.services import auth_service
from app.services.database import get_supabase

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.get("/login", status_code=status.HTTP_200_OK)
async def login_page():
    return {"message": "Login endpoint. Use POST to authenticate."}

@router.post("/login")
def login(data: LoginRequest, db=Depends(get_supabase)):
    result = auth_service.authenticate_user(db, data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/register", status_code=status.HTTP_200_OK)
async def register_page():
    return {"message": "Registration endpoint. Use POST to create an account."}

@router.post("/register")
def register(data: RegisterRequest, db=Depends(get_supabase)):
    result = auth_service.register_user(db, data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password_page():
    return {"message": "Forgot password endpoint. Use POST to request a reset link."}

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(db=Depends(get_supabase)):
    return {"message": "Password reset link sent if email exists"}

@router.get("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password_page():
    return {"message": "Reset password endpoint. Use PUT to update your password."}

@router.put("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(db=Depends(get_supabase)):
    return {"message": "Password reset successful"}
