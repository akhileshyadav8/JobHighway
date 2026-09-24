import asyncio
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.workers.celery_app import celery_app
from app.database import AsyncSessionLocal
from app.models.job import Job
from app.models.company import Company
from app.config import settings
from sqlalchemy import select
from sqlalchemy.orm import selectinload

class EnrichedJobData(BaseModel):
    selection_process: Dict[str, str]
    interview_experience: Dict[str, str]
    work_culture_summary: str
    study_materials: Dict[str, str]
    jobhighway_rating: str
    rating_reason: str

async def async_enrich_job(job_id: int):
    if not settings.GEMINI_API_KEY:
        return
        
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Job).options(selectinload(Job.company)).where(Job.id == job_id)
        )
        job = result.scalar_one_or_none()
        if not job or not job.description_text:
            return

        prompt = f"""
        Act as an expert technical career advisor and provide an enrichment summary for the following job.
        Company: {job.company.name}
        Job Title: {job.title}
        Description:
        {job.description_text[:2000]}
        
        Rate the job as one of: excellent, good, average, poor.
        """

        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=EnrichedJobData,
                )
            )
            
            import json
            data = json.loads(response.text)
            
            job.selection_process = data.get("selection_process")
            job.interview_experience = data.get("interview_experience")
            job.work_culture_summary = data.get("work_culture_summary")
            job.study_materials = data.get("study_materials")
            job.jobhighway_rating = data.get("jobhighway_rating")
            job.rating_reason = data.get("rating_reason")
            
            await session.commit()
            
        except Exception as e:
            print(f"AI Enrichment failed for {job_id}: {e}")

@celery_app.task
def enrich_job(job_id: int):
    asyncio.run(async_enrich_job(job_id))
