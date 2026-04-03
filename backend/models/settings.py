from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class AISettings(BaseModel):
    provider: str = Field(default="openai")
    model: str = Field(default="gpt-4o")
    api_key: Optional[str] = None
    system_prompt: Optional[str] = None
    temperature: float = Field(default=0.7)
    max_tokens: int = Field(default=500)
    enabled: bool = Field(default=False)

class PaymentMethod(BaseModel):
    enabled: bool = Field(default=False)
    key: Optional[str] = None

class PaymentSettings(BaseModel):
    pix: PaymentMethod = Field(default_factory=PaymentMethod)
    mercado_pago: PaymentMethod = Field(default_factory=PaymentMethod)
    pag_seguro: PaymentMethod = Field(default_factory=PaymentMethod)

class WhatsAppSettings(BaseModel):
    number: Optional[str] = None
    enabled: bool = Field(default=False)

class Settings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ai: AISettings = Field(default_factory=AISettings)
    payment: PaymentSettings = Field(default_factory=PaymentSettings)
    whatsapp: WhatsAppSettings = Field(default_factory=WhatsAppSettings)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SettingsResponse(BaseModel):
    ai: AISettings
    payment: PaymentSettings
    whatsapp: WhatsAppSettings