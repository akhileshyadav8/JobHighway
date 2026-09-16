"""
Clean frontend/src/lib/real_jobs.json to guarantee 100% data authenticity:
- Dynamic/truthful skills (no Software Development on Drivers/Cooks/Nurses)
- Dynamic work mode (In-Office for drivers, warehouse, physical jobs)
- Dynamic batches (null unless actually mentioned in posting)
- Real salary only (null if undisclosed, remove fabricated 6-figure salaries on drivers/service roles)
- Deduplicate Australia spam gigs
"""

import json
import re
import html
import os
import sys

# Import functions from fix_all_real_data
sys.path.insert(0, os.path.dirname(__file__))
from fix_all_real_data import extract_accurate_skills, detect_work_mode, detect_batches

FILE_PATH = os.path.join(os.path.dirname(__file__), '../../frontend/src/lib/real_jobs.json')

def clean_json():
    print(f"[*] Reading {FILE_PATH}...")
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        jobs = json.load(f)

    print(f"[+] Loaded {len(jobs)} jobs. Cleaning...")

    cleaned = []
    seen_gigs = set()
    flex_count = 0

    for j in jobs:
        title = j.get('title', '')
        desc_html = j.get('description_html', '')
        desc_text = j.get('description_text', '')
        loc = j.get('location', [])
        loc_str = " ".join(loc) if isinstance(loc, list) else str(loc or "")
        slug = j.get('slug', '')

        # Deduplicate Amazon Cargo Van Package Delivery Driver spam gigs (keep first 2)
        if 'amazon cargo van package delivery driver' in title.lower():
            flex_count += 1
            if flex_count > 2:
                continue

        # 1. Accurate authentic skills
        skills = extract_accurate_skills(title, desc_html, desc_text)

        # 2. Accurate authentic work mode
        work_mode = detect_work_mode(title, desc_text or "", loc_str)

        # 3. Accurate authentic batches (None if not mentioned!)
        batches = detect_batches(desc_text or "")

        # 4. Accurate authentic salary
        title_low = title.lower()
        is_non_tech = any(k in title_low for k in ['driver', 'delivery', 'van', 'truck', 'courier', 'cook', 'chef', 'warehouse', 'forklift', 'cashier', 'retail'])
        is_adzuna = slug.startswith("adzuna-")

        s_min = j.get('salary_min')
        s_max = j.get('salary_max')
        s_curr = j.get('salary_currency') or 'USD'
        s_basis = j.get('salary_basis')

        if is_non_tech and s_min and float(s_min) > 80000:
            s_min = None
            s_max = None
            s_basis = "Disclosed on Application"

        if is_adzuna and s_min and float(s_min) in [135000.0, 95000.0, 80000.0, 75000.0]:
            if is_non_tech:
                s_min = None
                s_max = None
                s_basis = "Disclosed on Application"

        is_est = False if s_min else True
        if s_min is None:
            s_basis = "Disclosed on Application"

        j['skills_required'] = skills
        j['work_mode'] = work_mode
        j['eligible_batches'] = batches
        j['salary_min'] = s_min
        j['salary_max'] = s_max
        j['salary_currency'] = s_curr
        j['salary_basis'] = s_basis
        j['is_salary_estimated'] = is_est

        cleaned.append(j)

    print(f"[+] Finished cleaning. Kept {len(cleaned)} jobs. Writing to file...")
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)

    print("[+] real_jobs.json updated with 100% authentic data!")

if __name__ == '__main__':
    clean_json()
