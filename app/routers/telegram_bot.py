from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import asyncio
import os

from app.database import get_db, User
from app.config import settings

router = APIRouter()

@router.get("/status")
async def telegram_bot_status():
    """Get Telegram bot status"""
    return {
        "status": "active" if settings.telegram_bot_token else "inactive",
        "message": "Telegram bot is running" if settings.telegram_bot_token else "Telegram bot token not configured",
        "timestamp": datetime.now().isoformat()
    }

@router.post("/webhook")
async def telegram_webhook():
    """Handle Telegram webhook"""
    # This would be implemented when setting up webhook
    return {"status": "webhook received"}

@router.get("/users")
async def get_telegram_users(db: Session = Depends(get_db)):
    """Get all registered Telegram users"""
    users = db.query(User).all()
    return {
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "role": user.role,
                "subrole_code": user.subrole_code,
                "created_at": user.created_at.isoformat()
            }
            for user in users
        ]
    } 