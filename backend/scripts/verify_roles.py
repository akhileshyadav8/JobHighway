from urllib.parse import quote_plus
from sqlalchemy import create_engine, text

p = quote_plus('MyJobPulse@2026#')
engine = create_engine(f'postgresql://postgres.difdvbmniyhlltmdzngg:{p}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require')

with engine.connect() as conn:
    print('--- DRIVER RECORD ---')
    r1 = conn.execute(text("SELECT title, work_mode, eligible_batches, skills_required FROM jobs WHERE title ILIKE '%driver%' LIMIT 1")).fetchone()
    print('Title:', r1[0])
    print('Work Mode:', r1[1])
    print('Batches:', r1[2])
    print('Skills:', r1[3])

    print('\n--- INTERN RECORD ---')
    r2 = conn.execute(text("SELECT title, work_mode, eligible_batches, skills_required FROM jobs WHERE title ILIKE '%intern%' LIMIT 1")).fetchone()
    print('Title:', r2[0])
    print('Work Mode:', r2[1])
    print('Batches:', r2[2])
    print('Skills:', r2[3])

    print('\n--- SOFTWARE RECORD ---')
    r3 = conn.execute(text("SELECT title, work_mode, eligible_batches, skills_required FROM jobs WHERE title ILIKE '%software%' LIMIT 1")).fetchone()
    print('Title:', r3[0])
    print('Work Mode:', r3[1])
    print('Batches:', r3[2])
    print('Skills:', r3[3])
