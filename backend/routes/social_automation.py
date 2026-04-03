from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user
from dependencies import get_db
from pydantic import BaseModel
import os
import subprocess
import uuid
from pathlib import Path

router = APIRouter(prefix="/api/social", tags=["social-automation"])

UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

class ConnectAccountRequest(BaseModel):
    network_id: str
    username: str
    password: str

class PostVideoRequest(BaseModel):
    network_id: str
    video_path: str
    title: str
    description: str = ""

@router.post("/connect")
async def connect_social_account(
    request: ConnectAccountRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Conecta uma conta de rede social usando automação
    Salva cookies/sessão para uso posterior
    """
    # Aqui você implementaria a automação com Playwright
    # Por enquanto, vamos simular o salvamento da conexão
    
    connection = {
        "network_id": request.network_id,
        "username": request.username,
        "connected_at": "2026-01-01T00:00:00",
        "status": "connected"
    }
    
    # Atualizar usuário com a nova conexão
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$push": {"connected_networks": connection}}
    )
    
    return {
        "success": True,
        "message": f"{request.network_id} conectado com sucesso!",
        "network": request.network_id
    }

@router.post("/disconnect/{network_id}")
async def disconnect_social_account(
    network_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Desconecta uma conta de rede social
    """
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$pull": {"connected_networks": {"network_id": network_id}}}
    )
    
    return {
        "success": True,
        "message": f"{network_id} desconectado"
    }

@router.get("/connected")
async def get_connected_accounts(
    current_user: dict = Depends(get_current_user)
):
    """
    Lista todas as contas conectadas do usuário
    """
    return {
        "connected_networks": current_user.get("connected_networks", [])
    }

@router.post("/post")
async def post_to_social_network(
    request: PostVideoRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Posta um vídeo em uma rede social específica
    """
    # Verificar se a rede está conectada
    networks = current_user.get("connected_networks", [])
    is_connected = any(n["network_id"] == request.network_id for n in networks)
    
    if not is_connected:
        raise HTTPException(
            status_code=400,
            detail=f"{request.network_id} não está conectado. Conecte primeiro."
        )
    
    # Aqui você implementaria a lógica de postagem
    # Para Kwai/Snapchat: usar Playwright
    # Para YouTube/Instagram: usar APIs oficiais
    
    # Salvar registro da postagem
    post_record = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "network_id": request.network_id,
        "video_path": request.video_path,
        "title": request.title,
        "description": request.description,
        "status": "posted",
        "posted_at": "2026-01-01T00:00:00"
    }
    
    await db.posts.insert_one(post_record)
    
    return {
        "success": True,
        "message": f"Vídeo postado no {request.network_id}!",
        "post_id": post_record["id"]
    }