from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user import User, UserResponse
from utils.auth import create_access_token
from dependencies import get_db
from pydantic import BaseModel
import httpx
import os

router = APIRouter(prefix="/api/auth/google", tags=["google-auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "")

class GoogleAuthRequest(BaseModel):
    token: str  # ID token from Google

@router.post("/verify")
async def verify_google_token(
    request: GoogleAuthRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Verifica o token do Google e cria/autentica o usuário
    """
    try:
        # Verificar token com Google
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={request.token}"
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Token inválido")
            
            google_data = response.json()
            
            # Validar client ID
            if GOOGLE_CLIENT_ID and google_data.get("aud") != GOOGLE_CLIENT_ID:
                raise HTTPException(status_code=401, detail="Token inválido")
            
            email = google_data.get("email")
            name = google_data.get("name")
            google_id = google_data.get("sub")
            
            if not email:
                raise HTTPException(status_code=400, detail="Email não encontrado")
            
            # Verificar se usuário já existe
            existing_user = await db.users.find_one({"email": email})
            
            if existing_user:
                # Usuário já existe, fazer login
                token = create_access_token(
                    data={"sub": existing_user["email"], "user_id": existing_user["id"]}
                )
                return {
                    "user": UserResponse(**existing_user),
                    "token": token
                }
            else:
                # Criar novo usuário
                new_user = User(
                    name=name or email.split('@')[0],
                    email=email,
                    password="google_oauth",  # Senha placeholder para OAuth
                    credits=180,
                    plan="lite"
                )
                
                # Adicionar google_id ao usuário
                user_dict = new_user.dict()
                user_dict["google_id"] = google_id
                
                await db.users.insert_one(user_dict)
                
                token = create_access_token(
                    data={"sub": new_user.email, "user_id": new_user.id}
                )
                
                return {
                    "user": UserResponse(**new_user.dict()),
                    "token": token
                }
    
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Erro ao verificar token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")