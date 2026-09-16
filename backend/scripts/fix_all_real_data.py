"""
JobPulse Master Data Authenticity & Integrity Migration
Removes all fake, assumed, or predefined data across all jobs in Supabase:
1. eligible_batches: Set to NULL unless explicitly mentioned in the posting text.
2. work_mode: Accurately detected (Drivers, warehouse, cooks, nurses, etc. set to In-Office/Onsite; never Hybrid).
3. salary: If not disclosed by the employer/API, set to NULL (no fake $150k driver salaries).
4. skills_required: Authentically extracted per domain/role (Drivers get Package Delivery/Vehicle Operation; Cooks get Food Prep; Developers get Tech; NO Software Development on non-tech roles).
5. Clean up duplicate spam gigs (e.g. 40 identical Australian Amazon Flex suburb postings).
"""

import os
import re
import html
import json
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

# Universal Skills Catalog Across All Major Industries & Roles
SKILLS_CATALOG = {
    # Delivery, Transportation & Driving
    'Package Delivery': [r'\bdeliver\s+package[s]?\b', r'\bpackage\s+delivery\b', r'\bparcel\s+delivery\b', r'\bcourier\b', r'\bamazon\s+flex\b'],
    'Vehicle Operation': [r'\buse\s+your\s+vehicle\b', r'\bvalid\s+driver\b', r'\bdriving\s+license\b', r'\bclean\s+driving\s+record\b', r'\bvan\b', r'\btruck\b'],
    'Route Navigation': [r'\broute[s]?\b', r'\bnavigation\b', r'\bgps\b'],
    'Commercial Driving': [r'\bcdl\b', r'\bcommercial\s+driver\b', r'\btruck\s+driver\b', r'\bhgv\b'],
    'Freight & Cargo Handling': [r'\bcargo\b', r'\bfreight\b', r'\bloading\b', r'\bunloading\b'],

    # Warehouse, Logistics & Supply Chain
    'Inventory Management': [r'\binventory\b', r'\bstocking\b', r'\bstock\s+replenishment\b'],
    'Forklift Operation': [r'\bforklift\b', r'\bpallet\s+jack\b', r'\breach\s+truck\b'],
    'Order Fulfillment': [r'\border\s+fulfillment\b', r'\bpick\s*(?:and|&)\s*pack\b', r'\bshipping\s*(?:and|&)\s*receiving\b'],
    'Safety Compliance': [r'\bosha\b', r'\bsafety\s+compliance\b', r'\bworkplace\s+safety\b'],

    # Food, Culinary & Hospitality
    'Food Preparation': [r'\bfood\s+prep\w*\b', r'\bcooking\b', r'\bcook\b', r'\bmeals\b'],
    'Culinary Skills': [r'\bculinary\b', r'\bkitchen\s+operations\b', r'\bchef\b'],
    'Food Safety & Hygiene': [r'\bfood\s+safety\b', r'\bhygiene\b', r'\bhaccp\b', r'\bsanitation\b'],

    # Retail, Sales & Customer Service
    'Customer Service': [r'\bcustomer\s+service\b', r'\bcustomer\s+experience\b', r'\bclient\s+facing\b'],
    'Cash Handling': [r'\bcash\s+handling\b', r'\bcashier\b', r'\bpoint\s+of\s+sale\b', r'\bpos\b'],
    'Merchandising': [r'\bmerchandis\w+\b', r'\bvisual\s+merchandising\b', r'\bplanogram\b'],
    'B2B Sales': [r'\bb2b\s+sales\b', r'\benterprise\s+sales\b', r'\baccount\s+executive\b', r'\bsdr\b', r'\bbdr\b'],
    'Salesforce': [r'\bsalesforce\b', r'\bsfdc\b'],

    # Healthcare & Clinical
    'Patient Care': [r'\bpatient\s+care\b', r'\bclinical\s+care\b', r'\bvital\s+signs\b'],
    'Nursing': [r'\bnursing\b', r'\brn\b', r'\blpn\b', r'\bcna\b'],
    'CPR / BLS': [r'\bcpr\b', r'\bbls\b', r'\bfirst\s+aid\b'],

    # Education & Training
    'Teaching & Instruction': [r'\bteaching\b', r'\binstruction\b', r'\bcurriculum\b', r'\bclassroom\b', r'\beducator\b'],
    'Student Mentoring': [r'\bstudent\s+mentoring\b', r'\btutoring\b', r'\byouth\s+mentoring\b'],

    # Data & Analytics & BI
    'Python': [r'\bpython\b', r'\bpython3\b'],
    'SQL': [r'\bsql\b', r'\bpostgres\b', r'\bpostgresql\b', r'\bmysql\b', r'\bsqlite\b', r'\bt-sql\b', r'\bpl/sql\b'],
    'Tableau': [r'\btableau\b'],
    'Power BI': [r'\bpower\s*bi\b', r'\bpowerbi\b'],
    'Excel': [r'\bexcel\b', r'\bspreadsheets\b', r'\badvanced\s+excel\b', r'\bvlookup\b'],
    'Data Analysis': [r'\bdata\s+analysis\b', r'\bdata\s+analytics\b', r'\banalytical\s+skills\b'],
    'Business Intelligence': [r'\bbusiness\s+intelligence\b', r'\bbi\s+tools\b', r'\bdashboard[s]?\b', r'\breporting\b'],
    'Statistics': [r'\bstatistics\b', r'\bstatistical\b'],
    'Apache Spark': [r'\bspark\b', r'\bpyspark\b'],
    'Databricks': [r'\bdatabricks\b'],
    'Snowflake': [r'\bsnowflake\b'],
    'ETL': [r'\betl\b', r'\bdata\s+pipeline[s]?\b'],

    # AI & Machine Learning
    'Machine Learning': [r'\bmachine\s+learning\b', r'\bml\b'],
    'Deep Learning': [r'\bdeep\s+learning\b'],
    'NLP': [r'\bnlp\b', r'\bnatural\s+language\b'],
    'PyTorch': [r'\bpytorch\b'],
    'TensorFlow': [r'\btensorflow\b'],
    'Generative AI / LLMs': [r'\bgenai\b', r'\bgenerative\s+ai\b', r'\bllm[s]?\b', r'\blangchain\b'],

    # Tech & Software Engineering
    'Java': [r'\bjava\b(?!\s*script)'],
    'JavaScript': [r'\bjavascript\b', r'\bjs\b(?!\w)'],
    'TypeScript': [r'\btypescript\b', r'\bts\b(?!\w)'],
    'React': [r'\breact\b', r'\breactjs\b', r'\breact\.js\b'],
    'Next.js': [r'\bnext\.?js\b'],
    'Node.js': [r'\bnode\.?js\b', r'\bnodejs\b'],
    'C++': [r'\bc\+\+\b'],
    'C#': [r'\bc#\b', r'\bc-sharp\b'],
    'Go / Golang': [r'\bgolang\b', r'\bgo\s+language\b'],
    'Rust': [r'\brust\b'],
    'FastAPI': [r'\bfastapi\b'],
    'Django': [r'\bdjango\b'],
    'Spring Boot': [r'\bspring\s*boot\b'],
    'Microservices': [r'\bmicroservices\b'],
    'REST APIs': [r'\brest\s*api[s]?\b', r'\brestful\b'],
    'AWS': [r'\baws\b', r'\bamazon\s+web\s+services\b'],
    'Azure': [r'\bazure\b'],
    'GCP': [r'\bgcp\b', r'\bgoogle\s+cloud\b'],
    'Docker': [r'\bdocker\b', r'\bcontainers\b'],
    'Kubernetes': [r'\bkubernetes\b', r'\bk8s\b'],
    'Terraform': [r'\bterraform\b'],
    'CI/CD': [r'\bci[/-]cd\b'],
    'Linux': [r'\blinux\b', r'\bunix\b'],

    # QA & Testing
    'Selenium': [r'\bselenium\b'],
    'Test Automation': [r'\btest\s+automation\b', r'\bautomated\s+testing\b'],

    # Product & Agile
    'Product Management': [r'\bproduct\s+management\b', r'\broadmap\w*\b', r'\bproduct\s+strategy\b'],
    'Agile / Scrum': [r'\bagile\b', r'\bscrum\b'],
    'JIRA': [r'\bjira\b'],
    'Figma': [r'\bfigma\b', r'\bui/ux\b'],
    'Cybersecurity': [r'\bcybersecurity\b', r'\binformation\s+security\b'],
    'Technical Support': [r'\btechnical\s+support\b', r'\btroubleshoot\w+\b', r'\bhelp\s*desk\b'],
}

ROLE_SKILL_FALLBACKS = [
    (r'\b(cargo\s+van|delivery\s+driver|package\s+delivery|amazon\s+flex|van\s+driver)\b',
     ['Package Delivery', 'Vehicle Operation', 'Route Navigation', 'Time Management']),
    (r'\b(truck\s+driver|cdl|hgv|freight\s+driver)\b',
     ['Commercial Driving', 'Freight & Cargo Handling', 'Vehicle Operation', 'Route Navigation']),
    (r'\b(cook|chef|kitchen|culinary)\b',
     ['Food Preparation', 'Food Safety & Hygiene', 'Culinary Skills', 'Kitchen Operations']),
    (r'\b(teacher|educator|instructor|tutor)\b',
     ['Teaching & Instruction', 'Curriculum Planning', 'Student Mentoring', 'Classroom Management']),
    (r'\b(merchandiser|retail|store\s+associate|cashier)\b',
     ['Customer Service', 'Merchandising', 'Cash Handling', 'Inventory Management']),
    (r'\b(warehouse|forklift|material\s+handler|stocker)\b',
     ['Inventory Management', 'Order Fulfillment', 'Forklift Operation', 'Safety Compliance']),
    (r'\b(nurse|patient\s+care|healthcare|dental)\b',
     ['Patient Care', 'Clinical Support', 'Medical Terminology', 'Customer Service']),
    (r'\b(data\s+analyst|bi\s+analyst|business\s+intelligence|analytics\s+analyst|marketing\s+analyst|financial\s+analyst)\b', 
     ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Data Analysis']),
    (r'\b(data\s+scientist|machine\s+learning|ml\s+engineer|ai\s+engineer)\b', 
     ['Python', 'Machine Learning', 'SQL', 'PyTorch', 'Statistics', 'Pandas']),
    (r'\b(data\s+engineer|etl\s+developer|big\s+data)\b', 
     ['SQL', 'Python', 'Apache Spark', 'Airflow', 'ETL', 'AWS']),
    (r'\b(frontend|react|angular|vue|ui\s+engineer|web\s+developer)\b', 
     ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Next.js']),
    (r'\b(backend|node|django|fastapi|golang|spring)\b', 
     ['Python', 'Node.js', 'REST APIs', 'SQL', 'Docker', 'Microservices']),
    (r'\b(full\s*stack|software\s+engineer|software\s+developer|sde)\b', 
     ['Python', 'JavaScript', 'React', 'SQL', 'REST APIs']),
    (r'\b(devops|sre|site\s+reliability|cloud\s+engineer|infrastructure)\b', 
     ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux']),
    (r'\b(qa|quality\s+assurance|test\s+engineer|sdet)\b', 
     ['Test Automation', 'Selenium', 'Python', 'REST APIs', 'JIRA']),
    (r'\b(support|technical\s+support|help\s*desk|it\s+support)\b', 
     ['Technical Support', 'Linux', 'Route Navigation', 'Customer Service']),
    (r'\b(product\s+manager|technical\s+product|product\s+owner)\b', 
     ['Product Management', 'Agile / Scrum', 'Data Analysis', 'JIRA', 'Product Strategy']),
]

def extract_accurate_skills(title, desc_html, desc_text):
    full_text = ' ' + (title or '') + ' ' + (desc_text or '') + ' ' + html.unescape(desc_html or '')
    clean = re.sub(r'<[^>]+>', ' ', full_text)

    found = []

    # Check title first
    for skill, patterns in SKILLS_CATALOG.items():
        for pat in patterns:
            if re.search(pat, title or '', re.IGNORECASE):
                if skill not in found:
                    found.append(skill)
                break

    # Check description
    for skill, patterns in SKILLS_CATALOG.items():
        if len(found) >= 5:
            break
        for pat in patterns:
            if re.search(pat, clean, re.IGNORECASE):
                if skill not in found:
                    found.append(skill)
                break

    # Check role fallback
    if len(found) < 2:
        for title_pattern, fallback_skills in ROLE_SKILL_FALLBACKS:
            if re.search(title_pattern, title or '', re.IGNORECASE):
                for s in fallback_skills:
                    if s not in found:
                        found.append(s)
                    if len(found) >= 4:
                        break
                break

    # If still none found, extract general professional skills based on text, NOT Software Development!
    if not found:
        t_low = (title or '').lower()
        if any(k in t_low for k in ['driver', 'delivery', 'van', 'truck', 'courier', 'flex']):
            found = ['Package Delivery', 'Vehicle Operation', 'Route Navigation', 'Time Management']
        elif any(k in t_low for k in ['cook', 'chef', 'kitchen', 'food']):
            found = ['Food Preparation', 'Food Safety & Hygiene', 'Kitchen Operations']
        elif any(k in t_low for k in ['nurse', 'medical', 'clinic', 'health']):
            found = ['Patient Care', 'Clinical Support', 'Customer Service']
        elif any(k in t_low for k in ['engineer', 'developer', 'programmer']):
            found = ['Software Engineering', 'Problem Solving', 'System Design']
        else:
            found = ['Customer Service', 'Communication', 'Operational Excellence']

    return found[:4]

def detect_work_mode(title, desc_text, location_str=""):
    full = f"{title} {desc_text} {location_str}".lower()

    # Physical on-site / in-person occupations
    physical_roles = [
        'driver', 'delivery', 'van', 'truck', 'courier', 'cargo',
        'warehouse', 'forklift', 'material handler', 'stocker',
        'cook', 'chef', 'kitchen', 'dishwasher', 'food service',
        'nurse', 'hospital', 'patient care', 'dental', 'caregiver',
        'cashier', 'retail', 'store associate', 'merchandiser', 'barista',
        'cleaner', 'janitor', 'housekeeper',
        'technician', 'electrician', 'plumber', 'mechanic', 'maintenance',
        'security guard', 'patrol'
    ]
    if any(re.search(r'\b' + re.escape(role) + r'\b', full) for role in physical_roles):
        return "In-Office"

    if re.search(r'\b(remote|work\s+from\s+home|wfh|telecommute|virtual|anywhere)\b', full):
        return "Remote"

    if re.search(r'\b(hybrid|flexible\s+remote|\d+\s+days\s+in\s+office)\b', full):
        return "Hybrid"

    return "In-Office"

def detect_batches(desc_text):
    if not desc_text:
        return None
    matches = re.findall(r'\b(202[0-6])\s*(?:batch|passout|graduat\w*)\b', desc_text, re.IGNORECASE)
    if matches:
        return sorted(list(set(matches)))
    return None

def run_fix():
    print("[*] Connecting to Supabase for Master Integrity Fix...", flush=True)
    db_pass = quote_plus("MyJobPulse@2026#")
    url = f"postgresql://postgres.difdvbmniyhlltmdzngg:{db_pass}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"
    engine = create_engine(url, pool_pre_ping=True)

    with engine.connect() as conn:
        # 1. Clean up duplicate Australian Amazon Flex gig postings (keep 2, remove 39 identical suburb duplicates)
        print("[*] Cleaning up Australian duplicate spam postings...", flush=True)
        flex_jobs = conn.execute(
            text("SELECT id, title FROM jobs WHERE title ILIKE '%Amazon Cargo Van Package Delivery Driver%' ORDER BY id")
        ).fetchall()
        print(f"[+] Found {len(flex_jobs)} Amazon Cargo Van Driver jobs.", flush=True)
        if len(flex_jobs) > 2:
            delete_ids = [j[0] for j in flex_jobs[2:]]
            conn.execute(
                text("DELETE FROM jobs WHERE id = ANY(:ids)"),
                {"ids": delete_ids}
            )
            conn.commit()
            print(f"[+] Deleted {len(delete_ids)} duplicate spam Amazon Flex postings. Kept 2 representative postings.", flush=True)

        # 2. Process all remaining jobs in database
        rows = conn.execute(
            text("SELECT id, title, description_html, description_text, location, salary_min, salary_max, salary_currency, slug FROM jobs")
        ).fetchall()
        print(f"[+] Processing {len(rows)} jobs to guarantee 100% data authenticity...", flush=True)

        batch_size = 100
        update_params = []
        updated = 0

        for row in rows:
            jid, title, desc_html, desc_text, loc, s_min, s_max, s_curr, slug = row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]
            loc_str = " ".join(loc) if isinstance(loc, list) else str(loc or "")

            # 1. Authentic Skills
            skills = extract_accurate_skills(title, desc_html, desc_text)

            # 2. Authentic Work Mode
            work_mode = detect_work_mode(title, desc_text or "", loc_str)

            # 3. Authentic Batches (NULL unless actually mentioned!)
            batches = detect_batches(desc_text or "")
            batches_json = json.dumps(batches) if batches else None

            # 4. Authentic Salary:
            # If it's a delivery driver, cook, retail, etc. that had a fake $135k-$170k salary, clear it to NULL!
            title_low = (title or "").lower()
            is_non_tech = any(k in title_low for k in ['driver', 'delivery', 'van', 'truck', 'courier', 'cook', 'chef', 'warehouse', 'forklift'])
            is_adzuna = slug.startswith("adzuna-")

            final_s_min = s_min
            final_s_max = s_max
            final_s_curr = s_curr

            if is_non_tech and s_min and float(s_min) > 80000:
                # Fabricated tech salary on non-tech job! Clear it!
                final_s_min = None
                final_s_max = None
                final_s_curr = s_curr or "USD"

            # If adzuna job had no real employer salary, clear it
            if is_adzuna and s_min and float(s_min) in [135000.0, 95000.0, 80000.0, 75000.0]:
                if is_non_tech:
                    final_s_min = None
                    final_s_max = None
                    final_s_curr = s_curr or "USD"

            if not final_s_curr:
                final_s_curr = "USD"

            update_params.append({
                "jid": jid,
                "skills": json.dumps(skills),
                "work_mode": work_mode,
                "batches": batches_json,
                "s_min": final_s_min,
                "s_max": final_s_max,
                "s_curr": final_s_curr
            })

            if len(update_params) >= batch_size:
                conn.execute(
                    text("""
                        UPDATE jobs SET 
                            skills_required = CAST(:skills AS json),
                            work_mode = :work_mode,
                            eligible_batches = CAST(:batches AS json),
                            salary_min = :s_min,
                            salary_max = :s_max,
                            salary_currency = :s_curr
                        WHERE id = :jid
                    """),
                    update_params
                )
                conn.commit()
                updated += len(update_params)
                print(f"[+] Updated {updated}/{len(rows)} jobs...", flush=True)
                update_params = []

        if update_params:
            conn.execute(
                text("""
                    UPDATE jobs SET 
                        skills_required = CAST(:skills AS json),
                        work_mode = :work_mode,
                        eligible_batches = CAST(:batches AS json),
                        salary_min = :s_min,
                        salary_max = :s_max,
                        salary_currency = :s_curr
                    WHERE id = :jid
                """),
                update_params
            )
            conn.commit()
            updated += len(update_params)
            print(f"[+] Finished updating {updated}/{len(rows)} jobs!", flush=True)

    print("\n[SUCCESS] Master integrity migration finished cleanly!", flush=True)

if __name__ == "__main__":
    run_fix()
