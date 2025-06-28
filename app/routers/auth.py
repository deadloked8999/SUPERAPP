from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string

from app.database import get_db, User
from app.schemas.auth import AuthCodeRequest, AuthCodeVerify, AuthResponse, User as UserSchema

router = APIRouter()

def generate_auth_code() -> str:
    """Generate a 4-digit authentication code"""
    return ''.join(random.choices(string.digits, k=4))

@router.post("/generate-code", response_model=AuthResponse)
async def generate_auth_code_endpoint(
    request: AuthCodeRequest,
    db: Session = Depends(get_db)
):
    """Generate authentication code for user"""
    try:
        # Clean username (remove @ if present)
        clean_username = request.username.lstrip('@')
        
        # Find user
        user = db.query(User).filter(
            (User.username == clean_username) | 
            (User.username == f"@{clean_username}")
        ).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Generate new code
        code = generate_auth_code()
        expires = datetime.now() + timedelta(minutes=10)
        
        # Update user
        user.code = code
        user.auth_expires = expires
        db.commit()
        
        print(f"🔑 Generated code {code} for user {clean_username}")
        
        return AuthResponse(
            success=True,
            message=f"Code generated successfully. Valid for 10 minutes.",
            user=UserSchema.from_orm(user)
        )
        
    except Exception as e:
        print(f"❌ Error generating code: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/verify-code")
async def verify_auth_code(
    username: str = Query(...),
    code: str = Query(...),
    db: Session = Depends(get_db)
):
    """Verify authentication code"""
    try:
        # Clean username
        clean_username = username.lstrip('@')
        
        # Find user
        user = db.query(User).filter(
            (User.username == clean_username) | 
            (User.username == f"@{clean_username}")
        ).first()
        
        if not user:
            print(f"❌ User not found: {clean_username}")
            return {"ok": False}
        
        # Check if code is valid and not expired
        if not user.code or not user.auth_expires:
            print(f"❌ No code or expired for user: {clean_username}")
            return {"ok": False}
        
        if datetime.now() > user.auth_expires:
            print(f"❌ Code expired for user: {clean_username}")
            return {"ok": False}
        
        if user.code != code:
            print(f"❌ Invalid code for user: {clean_username}")
            return {"ok": False}
        
        print(f"✅ Code verified successfully for user: {clean_username}")
        return {"ok": True}
        
    except Exception as e:
        print(f"❌ Error verifying code: {e}")
        return {"ok": False}

@router.get("/status")
async def auth_status():
    """Get authentication system status"""
    return {
        "status": "active",
        "message": "Authentication system is running",
        "timestamp": datetime.now().isoformat()
    } 