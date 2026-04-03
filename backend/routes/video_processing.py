from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user
from dependencies import get_db
import os
import subprocess
import uuid
from pathlib import Path
import shutil

router = APIRouter(prefix="/api/video", tags=["video-processing"])

UPLOAD_DIR = Path("/app/backend/uploads")
PROCESSED_DIR = Path("/app/backend/processed")
UPLOAD_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Faz upload de um vídeo para processamento
    """
    # Gerar nome único
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Salvar arquivo
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Criar registro no banco
    video_record = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "original_filename": file.filename,
        "file_path": str(file_path),
        "status": "uploaded",
        "size_mb": os.path.getsize(file_path) / (1024 * 1024)
    }
    
    await db.videos.insert_one(video_record)
    
    return {
        "success": True,
        "message": "Vídeo enviado com sucesso!",
        "video_id": video_record["id"],
        "file_path": str(file_path)
    }

@router.post("/cut/{video_id}")
async def cut_video(
    video_id: str,
    start_time: str,  # formato: "00:00:10"
    end_time: str,    # formato: "00:00:30"
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Corta um vídeo usando FFmpeg
    """
    # Buscar vídeo
    video = await db.videos.find_one({"id": video_id, "user_id": current_user["id"]})
    if not video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    input_path = video["file_path"]
    output_filename = f"cut_{uuid.uuid4()}.mp4"
    output_path = PROCESSED_DIR / output_filename
    
    # Comando FFmpeg para cortar vídeo
    command = [
        "ffmpeg",
        "-i", input_path,
        "-ss", start_time,
        "-to", end_time,
        "-c", "copy",
        str(output_path)
    ]
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            raise Exception(f"FFmpeg error: {result.stderr}")
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Processamento do vídeo excedeu o tempo limite")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar vídeo: {str(e)}")
    
    # Salvar clip processado
    clip_record = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "original_video_id": video_id,
        "file_path": str(output_path),
        "start_time": start_time,
        "end_time": end_time,
        "status": "processed"
    }
    
    await db.clips.insert_one(clip_record)
    
    return {
        "success": True,
        "message": "Vídeo cortado com sucesso!",
        "clip_id": clip_record["id"],
        "file_path": str(output_path)
    }

@router.post("/auto-cut/{video_id}")
async def auto_cut_video(
    video_id: str,
    clip_duration: int = 30,  # duração em segundos
    max_clips: int = 5,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Corta automaticamente um vídeo em múltiplos clips
    """
    video = await db.videos.find_one({"id": video_id, "user_id": current_user["id"]})
    if not video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    input_path = video["file_path"]
    
    # Obter duração total do vídeo
    probe_command = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        input_path
    ]
    
    try:
        result = subprocess.run(probe_command, capture_output=True, text=True)
        total_duration = float(result.stdout.strip())
    except:
        raise HTTPException(status_code=500, detail="Erro ao analisar vídeo")
    
    # Calcular intervalos para os clips
    clips_created = []
    interval = total_duration / max_clips
    
    for i in range(max_clips):
        start = int(i * interval)
        end = int(min(start + clip_duration, total_duration))
        
        if end - start < 5:  # clips muito curtos
            break
        
        output_filename = f"auto_clip_{i+1}_{uuid.uuid4()}.mp4"
        output_path = PROCESSED_DIR / output_filename
        
        command = [
            "ffmpeg",
            "-i", input_path,
            "-ss", str(start),
            "-t", str(clip_duration),
            "-c:v", "libx264",
            "-c:a", "aac",
            "-strict", "experimental",
            str(output_path)
        ]
        
        try:
            subprocess.run(command, capture_output=True, timeout=300)
            
            clip_record = {
                "id": str(uuid.uuid4()),
                "user_id": current_user["id"],
                "original_video_id": video_id,
                "file_path": str(output_path),
                "start_time": str(start),
                "end_time": str(end),
                "duration": clip_duration,
                "clip_number": i + 1,
                "status": "processed"
            }
            
            await db.clips.insert_one(clip_record)
            clips_created.append(clip_record)
        except Exception as e:
            print(f"Erro ao criar clip {i+1}: {str(e)}")
            continue
    
    return {
        "success": True,
        "message": f"{len(clips_created)} clips criados automaticamente!",
        "clips": clips_created
    }