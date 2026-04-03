from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.chat import ChatRequest, ChatResponse, ChatConversation, Message
from routes.auth import get_current_user
from dependencies import get_db
import httpx
import os

router = APIRouter(prefix="/api/chat", tags=["chat"])

async def call_openai(messages: list, api_key: str, model: str, temperature: float, max_tokens: int):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            },
            timeout=30.0
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="AI service error")
        return response.json()["choices"][0]["message"]["content"]

async def call_deepseek(messages: list, api_key: str, model: str, temperature: float, max_tokens: int):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            },
            timeout=30.0
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="AI service error")
        return response.json()["choices"][0]["message"]["content"]

@router.post("", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Get user settings
    settings = await db.settings.find_one({"user_id": current_user["id"]})
    
    if not settings or not settings.get("ai", {}).get("enabled"):
        raise HTTPException(status_code=400, detail="AI assistant not configured")
    
    ai_config = settings["ai"]
    
    # Get or create conversation
    if chat_request.conversation_id:
        conversation = await db.conversations.find_one({"id": chat_request.conversation_id})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = ChatConversation(user_id=current_user["id"])
        await db.conversations.insert_one(conversation.dict())
    
    # Add user message
    user_message = Message(role="user", content=chat_request.message)
    conversation["messages"].append(user_message.dict())
    
    # Prepare messages for AI
    messages = []
    if ai_config.get("system_prompt"):
        messages.append({"role": "system", "content": ai_config["system_prompt"]})
    
    for msg in conversation["messages"]:
        messages.append({"role": msg["role"], "content": msg["content"]})
    
    # Call AI service
    try:
        if ai_config["provider"] == "openai":
            response_text = await call_openai(
                messages,
                ai_config["api_key"],
                ai_config["model"],
                ai_config.get("temperature", 0.7),
                ai_config.get("max_tokens", 500)
            )
        elif ai_config["provider"] == "deepseek":
            response_text = await call_deepseek(
                messages,
                ai_config["api_key"],
                ai_config["model"],
                ai_config.get("temperature", 0.7),
                ai_config.get("max_tokens", 500)
            )
        else:
            raise HTTPException(status_code=400, detail="Unsupported AI provider")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    # Add assistant message
    assistant_message = Message(role="assistant", content=response_text)
    conversation["messages"].append(assistant_message.dict())
    
    # Update conversation
    await db.conversations.update_one(
        {"id": conversation["id"]},
        {"$set": {"messages": conversation["messages"]}}
    )
    
    return ChatResponse(
        response=response_text,
        conversation_id=conversation["id"]
    )