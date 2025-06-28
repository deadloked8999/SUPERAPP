from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from app.database import get_db, Shift
from pydantic import BaseModel

router = APIRouter()

class ShiftBase(BaseModel):
    user_id: int
    notes: Optional[str] = None

class ShiftCreate(ShiftBase):
    pass

class ShiftResponse(ShiftBase):
    id: int
    start_time: datetime
    end_time: Optional[datetime]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=ShiftResponse)
async def create_shift(
    shift: ShiftCreate,
    db: Session = Depends(get_db)
):
    """Create a new shift"""
    try:
        db_shift = Shift(**shift.dict())
        db.add(db_shift)
        db.commit()
        db.refresh(db_shift)
        return db_shift
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/active/{user_id}", response_model=Optional[ShiftResponse])
async def get_active_shift(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get active shift for user"""
    shift = db.query(Shift).filter(
        Shift.user_id == user_id,
        Shift.status == "active"
    ).first()
    return shift

@router.put("/{shift_id}/end")
async def end_shift(
    shift_id: int,
    db: Session = Depends(get_db)
):
    """End a shift"""
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    shift.end_time = datetime.now()
    shift.status = "ended"
    db.commit()
    return {"success": True}

@router.get("/{shift_id}/stats")
async def get_shift_stats(
    shift_id: int,
    db: Session = Depends(get_db)
):
    """Get shift statistics"""
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    # Calculate duration if shift is ended
    duration = None
    if shift.end_time:
        duration = (shift.end_time - shift.start_time).total_seconds() / 3600  # hours
    
    return {
        "shift_id": shift.id,
        "start_time": shift.start_time,
        "end_time": shift.end_time,
        "duration_hours": duration,
        "status": shift.status
    } 