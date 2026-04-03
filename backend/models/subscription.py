from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid

class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    plan_id: str
    status: str = Field(default="pending")  # pending, active, cancelled
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: Optional[datetime] = None
    payment_method: str
    amount: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SubscriptionCreate(BaseModel):
    plan_id: str
    payment_method: str