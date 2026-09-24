from typing import List, Optional, Any
from datetime import datetime
from sqlalchemy import String, Integer, Text, Boolean, DateTime, ForeignKey, Numeric, ARRAY, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), index=True, nullable=False)
    external_id: Mapped[Optional[str]] = mapped_column(String(255))
    
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    
    description_html: Mapped[Optional[str]] = mapped_column(Text)
    description_text: Mapped[Optional[str]] = mapped_column(Text)
    
    # Store JSON instead of ARRAY since asyncpg might have trouble with ARRAY without casting sometimes, or we can use JSON. The prompt allows JSON.
    location: Mapped[Optional[Any]] = mapped_column(JSON)
    department: Mapped[Optional[str]] = mapped_column(String(255))
    team: Mapped[Optional[str]] = mapped_column(String(255))
    employment_type: Mapped[Optional[str]] = mapped_column(String(50))
    work_mode: Mapped[Optional[str]] = mapped_column(String(50))
    
    salary_min: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))
    salary_max: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))
    salary_currency: Mapped[str] = mapped_column(String(10), default="INR")
    salary_period: Mapped[str] = mapped_column(String(20), default="annual")
    
    experience_min: Mapped[Optional[int]] = mapped_column(Integer)
    experience_max: Mapped[Optional[int]] = mapped_column(Integer)
    education: Mapped[Optional[str]] = mapped_column(String(255))
    eligible_batches: Mapped[Optional[Any]] = mapped_column(JSON)
    min_cgpa: Mapped[Optional[float]] = mapped_column(Numeric(3, 1))
    min_percentage: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    backlog_allowed: Mapped[Optional[bool]] = mapped_column(Boolean)
    
    skills_required: Mapped[Optional[Any]] = mapped_column(JSON)
    skills_preferred: Mapped[Optional[Any]] = mapped_column(JSON)
    
    job_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    apply_url: Mapped[Optional[str]] = mapped_column(String(1000))
    
    posted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), index=True)
    deadline: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_seen_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    
    content_hash: Mapped[Optional[str]] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)
    
    # Enrichment fields
    selection_process: Mapped[Optional[Any]] = mapped_column(JSON)
    interview_experience: Mapped[Optional[Any]] = mapped_column(JSON)
    work_culture_summary: Mapped[Optional[str]] = mapped_column(Text)
    study_materials: Mapped[Optional[Any]] = mapped_column(JSON)
    
    jobhighway_rating: Mapped[Optional[str]] = mapped_column("jobpulse_rating", String(20))
    rating_reason: Mapped[Optional[str]] = mapped_column(String(500))
    
    view_count: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    company: Mapped["Company"] = relationship("Company", back_populates="jobs")
    events: Mapped[List["JobEvent"]] = relationship("JobEvent", back_populates="job", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_jobs_company_id_status", "company_id", "status"),
    )
