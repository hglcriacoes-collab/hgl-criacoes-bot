from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Clip(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    start_time: str
    end_time: str
    score: int

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    video_url: Optional[str] = None
    thumbnail: Optional[str] = None
    status: str = Field(default="processing")  # processing, completed, failed
    duration: Optional[str] = None
    clips: List[Clip] = Field(default_factory=list)
    views: Optional[str] = None
    engagement: Optional[str] = None
    algorithm: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    video_url: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    thumbnail: Optional[str]
    status: str
    duration: Optional[str]
    views: Optional[str]
    engagement: Optional[str]
    algorithm: Optional[str]
    created_at: datetime