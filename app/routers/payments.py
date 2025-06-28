from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from app.database import get_db, Payment
from pydantic import BaseModel

router = APIRouter()

class PaymentBase(BaseModel):
    guest_id: int
    amount: float
    payment_type: str
    description: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdate(BaseModel):
    amount: Optional[float] = None
    payment_type: Optional[str] = None
    description: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=PaymentResponse)
async def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db)
):
    """Create a new payment"""
    try:
        db_payment = Payment(**payment.dict())
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        return db_payment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: int,
    payment_update: PaymentUpdate,
    db: Session = Depends(get_db)
):
    """Update payment information"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Update fields
    update_data = payment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(payment, field, value)
    
    db.commit()
    db.refresh(payment)
    return payment 