from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.project import Project, ProjectCreate, ProjectResponse
from routes.auth import get_current_user
from dependencies import get_db
from typing import List

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    project = Project(
        user_id=current_user["id"],
        title=project_data.title,
        video_url=project_data.video_url,
        status="processing",
        thumbnail="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    )
    
    await db.projects.insert_one(project.dict())
    return ProjectResponse(**project.dict())

@router.get("", response_model=List[ProjectResponse])
async def get_projects(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    projects = await db.projects.find({"user_id": current_user["id"]}).to_list(100)
    return [ProjectResponse(**project) for project in projects]

@router.get("/{project_id}")
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    project = await db.projects.find_one({"id": project_id, "user_id": current_user["id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/{project_id}/generate-clips")
async def generate_clips(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    project = await db.projects.find_one({"id": project_id, "user_id": current_user["id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Here you would implement the actual clip generation logic
    # For now, we'll just return a mock response
    return {
        "jobId": f"job_{project_id}",
        "status": "processing",
        "estimatedTime": 300
    }