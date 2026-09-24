import os
import json
import sys
from pathlib import Path
from urllib.parse import quote_plus
from datetime import datetime
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Load environment variables
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

# Add backend to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session

from app.models.base import Base
from app.models.company import Company
from app.models.job import Job
from app.models.job_event import JobEvent
from app.models.skill import Skill

def test_upstash_rest():
    print("[*] Testing Upstash REST Redis connection...", flush=True)
    import urllib.request
    
    url = "https://sought-anteater-164279.upstash.io/set/jobhighway_test/connected"
    token = "gQAAAAAAAoG3AAIgcDI2ODQzYzkyY2E3ZGE0MDAyYTAyZDhjNzc5ZjRlZWEzYw"
    
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode())
            print(f"[+] Upstash REST Redis is 100% ONLINE and WORKING! Result: {result}", flush=True)
            return True
    except Exception as e:
        print(f"[-] Upstash REST error: {e}", flush=True)
        return False

def test_supabase_connection():
    # Password: MyJobPulse@2026# -> encoded: MyJobPulse%402026%23
    db_pass = quote_plus("MyJobPulse@2026#")
    
    # Try different connection strings with 8 second timeouts
    urls = [
        ("Supabase Pooler (Port 6543 - Transaction)", f"postgresql://postgres.difdvbmniyhlltmdzngg:{db_pass}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"),
        ("Supabase Pooler (Port 5432 - Session)", f"postgresql://postgres.difdvbmniyhlltmdzngg:{db_pass}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"),
        ("Supabase Direct (Port 5432)", f"postgresql://postgres:{db_pass}@db.difdvbmniyhlltmdzngg.supabase.co:5432/postgres?sslmode=require")
    ]
    
    for name, conn_str in urls:
        print(f"[*] Trying connection to {name}...", flush=True)
        try:
            engine = create_engine(
                conn_str,
                connect_args={"connect_timeout": 8}
            )
            with engine.connect() as conn:
                val = conn.execute(text("SELECT 1")).scalar()
                if val == 1:
                    print(f"[+] Successfully connected to {name}!", flush=True)
                    return engine, conn_str
        except Exception as e:
            print(f"[-] Failed with {name}: {e}", flush=True)
            
    return None, None

def main():
    print("=" * 60, flush=True)
    print("JobHighway: Initializing Supabase & Upstash", flush=True)
    print("=" * 60, flush=True)

    # 1. Test Upstash
    test_upstash_rest()

    # 2. Test Supabase
    engine, active_url = test_supabase_connection()
    if not engine:
        print("[!] Could not connect to Supabase. Check error messages above.", flush=True)
        return

    # 3. Create tables
    print("\n[*] Creating database tables in Supabase...", flush=True)
    try:
        Base.metadata.create_all(engine)
        print("[+] Tables (companies, jobs, job_events, skills) verified/created successfully!", flush=True)
    except Exception as e:
        print(f"[-] Error creating tables: {e}", flush=True)
        return

    # 4. Load jobs from real_jobs.json
    json_path = Path(__file__).resolve().parent.parent.parent / "frontend" / "src" / "lib" / "real_jobs.json"
    if not json_path.exists():
        print(f"[-] File not found: {json_path}", flush=True)
        return

    print(f"\n[*] Reading {json_path.name}...", flush=True)
    with open(json_path, "r", encoding="utf-8") as f:
        jobs_data = json.load(f)

    print(f"[*] Found {len(jobs_data)} job postings to sync into Supabase.", flush=True)

    # 5. Insert / Seed into Supabase
    with Session(engine) as session:
        # Check existing count
        existing_jobs = session.query(Job).count()
        existing_companies = session.query(Company).count()
        print(f"[*] Current Supabase DB state: {existing_companies} companies, {existing_jobs} jobs.", flush=True)

        if existing_jobs >= len(jobs_data):
            print("[+] Database already has all jobs populated! No duplicate insert needed.", flush=True)
            return

        company_cache = {}
        for c in session.query(Company).all():
            company_cache[c.slug] = c

        added_companies = 0
        added_jobs = 0

        for item in jobs_data:
            comp_info = item.get("company", {})
            comp_slug = comp_info.get("slug")
            comp_name = comp_info.get("name")

            if not comp_slug or not comp_name:
                continue

            if comp_slug not in company_cache:
                company = Company(
                    name=comp_name,
                    slug=comp_slug,
                    website=f"https://{comp_slug}.com",
                    industry=comp_info.get("industry", "Technology"),
                    description=f"{comp_name} is a leading enterprise hiring organization.",
                    ats_type="custom",
                    is_active=True
                )
                session.add(company)
                session.flush()
                company_cache[comp_slug] = company
                added_companies += 1

            company = company_cache[comp_slug]

            job_slug = item.get("slug")
            if not job_slug:
                continue

            existing = session.query(Job).filter(Job.slug == job_slug).first()
            if existing:
                continue

            def parse_dt(dt_str):
                if not dt_str:
                    return None
                try:
                    return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
                except Exception:
                    return None

            job = Job(
                company_id=company.id,
                external_id=str(item.get("id")),
                title=item.get("title", "Software Engineer"),
                slug=job_slug,
                description_html=item.get("description_html"),
                description_text=item.get("description_text"),
                location=item.get("location", []),
                department=item.get("department"),
                employment_type=item.get("employment_type", "Full-time"),
                work_mode=item.get("work_mode", "Hybrid"),
                salary_min=item.get("salary_min"),
                salary_max=item.get("salary_max"),
                salary_currency=item.get("salary_currency", "INR"),
                salary_period=item.get("salary_period", "annual"),
                experience_min=item.get("experience_min"),
                experience_max=item.get("experience_max"),
                education=item.get("education"),
                eligible_batches=item.get("eligible_batches"),
                min_cgpa=item.get("min_cgpa"),
                skills_required=item.get("skills_required", []),
                job_url=item.get("job_url", ""),
                apply_url=item.get("apply_url", item.get("job_url", "")),
                posted_at=parse_dt(item.get("posted_at")),
                deadline=parse_dt(item.get("deadline")),
                first_seen_at=parse_dt(item.get("first_seen_at")) or datetime.utcnow(),
                status=item.get("status", "active"),
                jobhighway_rating=item.get("jobhighway_rating"),
                rating_reason=item.get("rating_reason"),
                view_count=item.get("view_count", 1)
            )
            session.add(job)
            added_jobs += 1

            if added_jobs % 100 == 0:
                session.commit()
                print(f"    -> Seeded {added_jobs} jobs...", flush=True)

        session.commit()

        final_jobs = session.query(Job).count()
        final_companies = session.query(Company).count()

        print("\n" + "=" * 60, flush=True)
        print("SUCCESS! Supabase Seeding Complete", flush=True)
        print("=" * 60, flush=True)
        print(f"Total Companies in Supabase: {final_companies} (+{added_companies} new)", flush=True)
        print(f"Total Jobs in Supabase:      {final_jobs} (+{added_jobs} new)", flush=True)
        print("=" * 60, flush=True)

if __name__ == "__main__":
    main()
