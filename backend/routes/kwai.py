from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user
from dependencies import get_db
from pydantic import BaseModel
from automation.kwai_bot import KwaiBot
import logging

router = APIRouter(prefix="/api/kwai", tags=["kwai-automation"])
logger = logging.getLogger(__name__)

class KwaiLoginRequest(BaseModel):
    username: str
    password: str

class KwaiPostRequest(BaseModel):
    video_path: str
    title: str
    description: str = ""

@router.post("/login")
async def login_kwai(
    request: KwaiLoginRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Faz login no Kwai e salva a sessão para o usuário
    """
    try:
        bot = KwaiBot(current_user["id"])
        result = await bot.login(request.username, request.password)
        
        if result["success"]:
            # Atualizar usuário como conectado ao Kwai
            await db.users.update_one(
                {"id": current_user["id"]},
                {
                    "$push": {
                        "connected_networks": {
                            "network_id": "kwai",
                            "username": request.username,
                            "status": "connected"
                        }
                    }
                }
            )
            
        return result
    except Exception as e:
        logger.error(f"Erro no login Kwai: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/post")
async def post_to_kwai(
    request: KwaiPostRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Posta um vídeo no Kwai
    """
    try:
        # Verificar se usuário está conectado ao Kwai
        networks = current_user.get("connected_networks", [])
        kwai_connected = any(n.get("network_id") == "kwai" for n in networks)
        
        if not kwai_connected:
            raise HTTPException(
                status_code=400,
                detail="Kwai não conectado. Faça login primeiro."
            )
        
        bot = KwaiBot(current_user["id"])
        
        # Executar em background
        async def post_job():
            result = await bot.post_video(
                request.video_path,
                request.title,
                request.description
            )
            logger.info(f"Resultado da postagem: {result}")
        
        background_tasks.add_task(post_job)
        
        return {
            "success": True,
            "message": "Vídeo em processo de postagem no Kwai!"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao postar no Kwai: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def check_kwai_status(
    current_user: dict = Depends(get_current_user)
):
    """
    Verifica se o usuário está conectado ao Kwai
    """
    networks = current_user.get("connected_networks", [])
    kwai_network = next(
        (n for n in networks if n.get("network_id") == "kwai"),
        None
    )
    
    return {
        "connected": kwai_network is not None,
        "username": kwai_network.get("username") if kwai_network else None
    }