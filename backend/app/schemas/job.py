from typing import Optional, List, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.company import CompanyListItem

class JobBase(BaseModel):
    title: str
    slug: str
    location: Optional[List[str]] = []
    department: Optional[str] = None
    team: Optional[str] = None
    employment_type: Optional[str] = None
    work_mode: Optional[str] = None
    
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str = "INR"
    salary_period: str = "annual"
    
    experience_min: Optional[int] = None
    experience_max: Optional[int] = None
    education: Optional[str] = None
    eligible_batches: Optional[List[str]] = None
    min_cgpa: Optional[float] = None
    min_percentage: Optional[float] = None
    backlog_allowed: Optional[bool] = None
    
    skills_required: Optional[List[str]] = []
    skills_preferred: Optional[List[str]] = []
    
    job_url: str
    apply_url: Optional[str] = None
    
    posted_at: Optional[datetime] = None
    deadline: Optional[datetime] = None
    status: str = "active"
    
    jobhighway_rating: Optional[str] = None
    rating_reason: Optional[str] = None

class JobCreate(JobBase):
    company_id: int
    external_id: Optional[str] = None
    description_html: Optional[str] = None
    description_text: Optional[str] = None
    content_hash: Optional[str] = None

class JobListItem(JobBase):
    id: int
    company_id: int
    first_seen_at: datetime
    view_count: int
    company: Optional[CompanyListItem] = None
    
    model_config = {"from_attributes": True}

class JobEventSchema(BaseModel):
    id: int
    event_type: str
    detected_at: datetime
    field_changed: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None

    model_config = {"from_attributes": True}

class JobResponse(JobListItem):
    description_html: Optional[str] = None
    description_text: Optional[str] = None
    
    selection_process: Optional[Dict[str, Any]] = None
    interview_experience: Optional[Dict[str, Any]] = None
    work_culture_summary: Optional[str] = None
    study_materials: Optional[Dict[str, Any]] = None
    
    events: Optional[List[JobEventSchema]] = []

class JobFilters(BaseModel):
    q: Optional[str] = None
    company_slug: Optional[str] = None
    work_mode: Optional[str] = None
    employment_type: Optional[str] = None
    experience_max: Optional[int] = None
    salary_min: Optional[float] = None
    skills: Optional[List[str]] = None
    status: Optional[str] = "active"
