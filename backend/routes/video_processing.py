from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase
from routes.auth import get_current_user
from dependencies import get_db
from pydantic import BaseModel
from typing import Optional
import os
import subprocess
import uuid
from uuid import uuid4
from pathlib import Path
import shutil
from datetime import datetime, timezone
import math
import json

router = APIRouter(prefix="/api/video", tags=["video-processing"])

UPLOAD_DIR = Path("/app/backend/uploads")
PROCESSED_DIR = Path("/app/backend/processed")
UPLOAD_DIR.mkdir(exist_ok=True)
PROCESSED_DIR.mkdir(exist_ok=True)

class ClipConfigRequest(BaseModel):
    video_url: str
    video_duration: int  # em segundos
    clip_duration: int  # duração desejada de cada corte
    format: str  # "vertical" ou "horizontal"
    framing: str  # "automatico", "centro", etc
    apply_bypass: bool = True

class VideoMetadataRequest(BaseModel):
    video_url: str

@router.post("/extract-metadata")
async def extract_video_metadata(
    request: VideoMetadataRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Extrai metadados de um vídeo usando yt-dlp
    Retorna: título, duração, visualizações, data de upload, thumbnail
    """
    try:
        # Usar yt-dlp para extrair metadados JSON
        cmd = [
            "/root/.venv/bin/yt-dlp",
            "--dump-json",
            "--no-download",
            request.video_url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            raise HTTPException(
                status_code=400,
                detail=f"Erro ao extrair metadados: {result.stderr}"
            )
        
        # Parse JSON
        metadata = json.loads(result.stdout)
        
        # Extrair informações principais
        return {
            "success": True,
            "metadata": {
                "title": metadata.get("title", "Vídeo sem título"),
                "duration": metadata.get("duration", 0),
                "views": metadata.get("view_count", 0),
                "upload_date": metadata.get("upload_date", ""),
                "thumbnail": metadata.get("thumbnail", ""),
                "description": metadata.get("description", "")[:200],  # Primeiros 200 chars
                "channel": metadata.get("uploader", ""),
                "video_id": metadata.get("id", "")
            }
        }
        
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Timeout ao extrair metadados")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Erro ao parsear metadados do vídeo")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro inesperado: {str(e)}")


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
    apply_bypass: bool = True,  # Aplicar quebra de originalidade
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Corta um vídeo usando FFmpeg com quebra de originalidade automática
    - Corta 0.01s do início e fim
    - Aplica aceleração de 0.2% (setpts=0.998*PTS)
    - Aplica filtro suave de 0.2% de brilho/contraste
    """
    # Buscar vídeo
    video = await db.videos.find_one({"id": video_id, "user_id": current_user["id"]})
    if not video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    input_path = video["file_path"]
    output_filename = f"cut_{uuid.uuid4()}.mp4"
    output_path = PROCESSED_DIR / output_filename
    
    if apply_bypass:
        # Comando FFmpeg COM quebra de originalidade
        # 1. Trim 0.01s from start and end
        # 2. Speed up by 0.2% (setpts=0.998*PTS for video, atempo=1.002 for audio)
        # 3. Apply subtle filter (eq=brightness=0.002:contrast=1.002)
        command = [
            "ffmpeg",
            "-ss", "0.01",  # Skip 0.01s from start
            "-i", input_path,
            "-to", end_time,  # Will cut 0.01s from end automatically
            "-filter_complex",
            "[0:v]trim=start=0.01,setpts=0.998*PTS,eq=brightness=0.002:contrast=1.002[v];[0:a]atrim=start=0.01,atempo=1.002[a]",
            "-map", "[v]",
            "-map", "[a]",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "192k",
            str(output_path)
        ]
    else:
        # Comando FFmpeg simples (sem quebra de originalidade)
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
        "bypass_applied": apply_bypass,
        "status": "processed"
    }
    
    await db.clips.insert_one(clip_record)
    
    return {
        "success": True,
        "message": "Vídeo cortado com sucesso com quebra de originalidade!" if apply_bypass else "Vídeo cortado com sucesso!",
        "clip_id": clip_record["id"],
        "file_path": str(output_path),
        "bypass_applied": apply_bypass
    }


@router.post("/process-clips")
async def process_clips(
    config: ClipConfigRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Processa vídeo em múltiplos cortes usando a lógica matemática de divisão automática
    
    Lógica:
    1. Calcular número de cortes: round(duração_total / duração_desejada)
    2. Calcular duração real: duração_total / num_cortes
    3. Gerar cortes com FFmpeg aplicando quebra de originalidade
    """
    
    # Passo 1: Calcular divisão dos cortes
    total_seconds = config.video_duration
    desired_duration = config.clip_duration
    
    # Arredondar para número inteiro de cortes
    num_clips = round(total_seconds / desired_duration)
    if num_clips < 1:
        num_clips = 1
    
    # Calcular duração real de cada corte
    real_clip_duration = total_seconds / num_clips
    
    # Passo 2: Criar registro do job de processamento
    job_id = str(uuid4())
    job_record = {
        "id": job_id,
        "user_id": current_user["id"],
        "video_url": config.video_url,
        "total_duration": total_seconds,
        "desired_clip_duration": desired_duration,
        "num_clips": num_clips,
        "real_clip_duration": real_clip_duration,
        "format": config.format,
        "framing": config.framing,
        "apply_bypass": config.apply_bypass,
        "status": "processing",
        "clips": [],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.processing_jobs.insert_one(job_record)
    
    # Passo 3: Processar cortes em background
    background_tasks.add_task(
        process_video_clips,
        job_id=job_id,
        config=config,
        num_clips=num_clips,
        real_clip_duration=real_clip_duration,
        user_id=current_user["id"],
        db=db
    )
    
    return {
        "success": True,
        "job_id": job_id,
        "num_clips": num_clips,
        "real_clip_duration": real_clip_duration,
        "estimated_time_seconds": num_clips * 10,  # Estimativa: 10s por corte
        "message": f"Processamento iniciado! {num_clips} cortes serão gerados."
    }


async def process_video_clips(
    job_id: str,
    config: ClipConfigRequest,
    num_clips: int,
    real_clip_duration: float,
    user_id: str,
    db: AsyncIOMotorDatabase
):
    """
    Função background para processar os cortes do vídeo
    """
    try:
        # Atualizar status
        await db.processing_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "downloading"}}
        )
        
        # Passo 1: Download do vídeo (usando yt-dlp)
        video_filename = f"video_{job_id}.mp4"
        video_path = UPLOAD_DIR / video_filename
        
        # Download com yt-dlp (usando caminho completo)
        download_cmd = [
            "/root/.venv/bin/yt-dlp",
            "-f", "best[ext=mp4]",
            "-o", str(video_path),
            config.video_url
        ]
        
        result = subprocess.run(download_cmd, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            raise Exception(f"Erro no download: {result.stderr}")
        
        # Atualizar status
        await db.processing_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "cutting", "video_path": str(video_path)}}
        )
        
        # Passo 2: Gerar cortes
        clips_data = []
        
        for i in range(num_clips):
            # Calcular timestamp de início e fim deste corte
            start_time = i * real_clip_duration
            end_time = start_time + real_clip_duration
            
            # Garantir que não ultrapasse a duração total
            if end_time > config.video_duration:
                end_time = config.video_duration
            
            # Nome do arquivo de saída
            clip_filename = f"clip_{job_id}_{i+1}.mp4"
            clip_path = PROCESSED_DIR / clip_filename
            
            # Construir comando FFmpeg com quebra de originalidade
            if config.apply_bypass:
                # Com quebra de originalidade:
                # - Trim 0.01s do início
                # - Speed up 0.2% (setpts=0.998*PTS)
                # - Filtro suave (eq=brightness=0.002:contrast=1.002)
                ffmpeg_cmd = [
                    "ffmpeg",
                    "-ss", str(start_time + 0.01),  # Skip 0.01s
                    "-i", str(video_path),
                    "-to", str(end_time - start_time - 0.01),  # Trim 0.01s do fim
                    "-filter_complex",
                    f"[0:v]setpts=0.998*PTS,eq=brightness=0.002:contrast=1.002,scale={'720:1280' if config.format == 'vertical' else '1280:720'}[v];[0:a]atempo=1.002[a]",
                    "-map", "[v]",
                    "-map", "[a]",
                    "-c:v", "libx264",
                    "-preset", "fast",
                    "-crf", "23",
                    "-c:a", "aac",
                    "-b:a", "192k",
                    str(clip_path)
                ]
            else:
                # Sem quebra de originalidade (simples)
                ffmpeg_cmd = [
                    "ffmpeg",
                    "-ss", str(start_time),
                    "-i", str(video_path),
                    "-t", str(end_time - start_time),
                    "-c", "copy",
                    str(clip_path)
                ]
            
            # Executar FFmpeg
            result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True, timeout=120)
            if result.returncode != 0:
                print(f"Erro ao processar corte {i+1}: {result.stderr}")
                continue
            
            # Salvar informação do corte
            clip_info = {
                "clip_number": i + 1,
                "file_path": str(clip_path),
                "start_time": start_time,
                "end_time": end_time,
                "duration": end_time - start_time,
                "bypass_applied": config.apply_bypass
            }
            clips_data.append(clip_info)
            
            # Atualizar progresso
            progress = int((i + 1) / num_clips * 100)
            await db.processing_jobs.update_one(
                {"id": job_id},
                {"$set": {"progress": progress}}
            )
        
        # Passo 3: Finalizar job
        await db.processing_jobs.update_one(
            {"id": job_id},
            {
                "$set": {
                    "status": "completed",
                    "clips": clips_data,
                    "progress": 100,
                    "completed_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        # Limpar vídeo original
        if video_path.exists():
            os.remove(video_path)
        
    except Exception as e:
        # Registrar erro
        await db.processing_jobs.update_one(
            {"id": job_id},
            {
                "$set": {
                    "status": "failed",
                    "error": str(e),
                    "failed_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        print(f"Erro ao processar vídeo {job_id}: {str(e)}")


@router.get("/job-status/{job_id}")
async def get_job_status(
    job_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Consultar status do job de processamento
    """
    job = await db.processing_jobs.find_one(
        {"id": job_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    
    if not job:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    
    return job


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
            # Remove MongoDB ObjectId before adding to response
            clip_response = clip_record.copy()
            if '_id' in clip_response:
                del clip_response['_id']
            clips_created.append(clip_response)
        except Exception as e:
            print(f"Erro ao criar clip {i+1}: {str(e)}")
            continue
    
    return {
        "success": True,
        "message": f"{len(clips_created)} clips criados automaticamente!",
        "clips": clips_created
    }