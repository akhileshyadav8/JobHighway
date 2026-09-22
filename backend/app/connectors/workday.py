import httpx
from typing import List, Optional
from datetime import datetime
from tenacity import retry, stop_after_attempt, wait_exponential
from bs4 import BeautifulSoup
from app.connectors.base import ATSConnector, RawJob
from app.models.company import Company
import json

class WorkdayConnector(ATSConnector):

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def fetch_jobs(self, company: Company) -> List[RawJob]:
        # Identifier format: tenant/site
        # Ex: "mycompany/mycompany_careers"
        ident = company.ats_identifier
        if not ident or "/" not in ident:
            return []
            
        tenant, site = ident.split("/", 1)
        url = f"https://{tenant}.wd5.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs"
        
        jobs = []
        offset = 0
        limit = 20
        
        async with httpx.AsyncClient() as client:
            while True:
                payload = {
                    "appliedFacets": {},
                    "limit": limit,
                    "offset": offset,
                    "searchText": ""
                }
                
                response = await client.post(url, json=payload, timeout=30.0)
                if response.status_code != 200:
                    break
                    
                data = response.json()
                postings = data.get("jobPostings", [])
                
                if not postings:
                    break
                    
                for posting in postings:
                    job = RawJob(
                        external_id=posting.get("externalPath", ""),
                        title=posting.get("title", ""),
                        location=[posting.get("locationsText", "")],
                        job_url=f"https://{tenant}.wd5.myworkdayjobs.com/en-US/{site}{posting.get('externalPath', '')}",
                        raw_data=posting
                    )
                    jobs.append(job)
                    
                total_postings = data.get("total", len(jobs))
                offset += limit
                if offset >= total_postings or offset >= 2000:
                    break
                    
        return jobs

    async def fetch_job_detail(self, company: Company, job_id: str) -> Optional[RawJob]:
        return None
