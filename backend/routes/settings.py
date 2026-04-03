from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.settings import Settings, SettingsResponse, AISettings, PaymentSettings, WhatsAppSettings
from routes.auth import get_current_user
from dependencies import get_db

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("", response_model=SettingsResponse)
async def get_settings(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    settings = await db.settings.find_one({"user_id": current_user["id"]})
    if not settings:
        # Create default settings
        settings = Settings(user_id=current_user["id"])
        await db.settings.insert_one(settings.dict())
    
    return SettingsResponse(**settings)

@router.put("/ai")
async def update_ai_settings(
    ai_settings: AISettings,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await db.settings.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"ai": ai_settings.dict()}},
        upsert=True
    )
    return {"success": True, "message": "AI settings updated"}

@router.put("/payment")
async def update_payment_settings(
    payment_settings: PaymentSettings,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await db.settings.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"payment": payment_settings.dict()}},
        upsert=True
    )
    return {"success": True, "message": "Payment settings updated"}

@router.put("/whatsapp")
async def update_whatsapp_settings(
    whatsapp_settings: WhatsAppSettings,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await db.settings.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"whatsapp": whatsapp_settings.dict()}},
        upsert=True
    )
    return {"success": True, "message": "WhatsApp settings updated"}