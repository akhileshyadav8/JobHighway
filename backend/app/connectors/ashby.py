import httpx
from typing import List, Optional
from tenacity import retry, stop_after_attempt, wait_exponential
from bs4 import BeautifulSoup
from app.connectors.base import ATSConnector, RawJob
from app.models.company import Company

class AshbyConnector(ATSConnector):
    BASE_URL = "https://api.ashbyhq.com/posting-api/job-board/{}"

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def fetch_jobs(self, company: Company) -> List[RawJob]:
        board_slug = company.ats_identifier or company.slug
        url = self.BASE_URL.format(board_slug)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json={}, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
        jobs = []
        for job_data in data.get("jobs", []):
            desc_html = job_data.get("descriptionHtml", "")
            soup = BeautifulSoup(desc_html, "html.parser")
            desc_text = soup.get_text(separator="\n", strip=True)
            
            salary_min = None
            salary_max = None
            comp_tier = job_data.get("compensationTierSummary")
            # Usually unstructured, would need parsing, skip for now or store as string
            
            locations = []
            if job_data.get("location"):
                locations.append(str(job_data.get("location")).strip())
            for sec in job_data.get("secondaryLocations", []):
                if isinstance(sec, dict) and sec.get("location"):
                    locations.append(str(sec.get("location")).strip())
                elif isinstance(sec, str) and sec.strip():
                    locations.append(sec.strip())
            seen_locs = set()
            clean_locations = []
            for l in locations:
                if l and l.lower() not in seen_locs:
                    seen_locs.add(l.lower())
                    clean_locations.append(l)

            job = RawJob(
                external_id=str(job_data.get("id")),
                title=job_data.get("title", ""),
                description_html=desc_html,
                description_text=desc_text,
                location=clean_locations,
                department=job_data.get("department"),
                team=job_data.get("team"),
                employment_type=job_data.get("employmentType"),
                job_url=job_data.get("jobUrl", ""),
                apply_url=job_data.get("applicationUrl", ""),
                raw_data=job_data
            )
            jobs.append(job)
        return jobs

    async def fetch_job_detail(self, company: Company, job_id: str) -> Optional[RawJob]:
        jobs = await self.fetch_jobs(company)
        for job in jobs:
            if job.external_id == job_id:
                return job
        return None
