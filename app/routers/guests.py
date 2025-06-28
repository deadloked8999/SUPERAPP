from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from app.database import get_db, Guest
from pydantic import BaseModel

router = APIRouter()

class GuestBase(BaseModel):
    name: str
    phone: Optional[str] = None
    table_number: Optional[int] = None
    notes: Optional[str] = None

class GuestCreate(GuestBase):
    pass

class GuestUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    table_number: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class GuestResponse(GuestBase):
    id: int
    arrival_time: datetime
    departure_time: Optional[datetime]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=GuestResponse)
async def create_guest(
    guest: GuestCreate,
    db: Session = Depends(get_db)
):
    """Create a new guest"""
    try:
        db_guest = Guest(**guest.dict())
        db.add(db_guest)
        db.commit()
        db.refresh(db_guest)
        return db_guest
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{guest_id}", response_model=GuestResponse)
async def update_guest(
    guest_id: int,
    guest_update: GuestUpdate,
    db: Session = Depends(get_db)
):
    """Update guest information"""
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    # Update fields
    update_data = guest_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(guest, field, value)
    
    # If status is "left", set departure time
    if update_data.get("status") == "left" and not guest.departure_time:
        guest.departure_time = datetime.now()
    
    db.commit()
    db.refresh(guest)
    return guest

@router.get("/search")
async def search_guests(
    name: str = Query(...),
    db: Session = Depends(get_db)
):
    """Search guests by name"""
    guests = db.query(Guest).filter(
        Guest.name.ilike(f"%{name}%")
    ).all()
    return guests 