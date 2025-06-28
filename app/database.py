from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
from datetime import datetime
import asyncio
from typing import Optional

from app.config import settings

# Database setup
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    role = Column(String, default="unknown")
    subrole_code = Column(String, nullable=True)
    code = Column(String, nullable=True)
    auth_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Shift(Base):
    __tablename__ = "shifts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    start_time = Column(DateTime, default=func.now())
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="active")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())

class Guest(Base):
    __tablename__ = "guests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, nullable=True)
    table_number = Column(Integer, nullable=True)
    arrival_time = Column(DateTime, default=func.now())
    departure_time = Column(DateTime, nullable=True)
    status = Column(String, default="present")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, index=True)
    amount = Column(Float)
    payment_type = Column(String)  # cash, card, etc.
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
async def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully") 