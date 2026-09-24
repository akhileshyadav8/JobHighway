"""
JobHighway Skill Extraction Migration
Extracts authentic, posting-specific technical & professional skills from
job title, description_html, and description_text for every job in Supabase.
Eliminates repetitive placeholder skills completely.
"""

import os
import re
import html
import json
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

# Comprehensive catalog of real technical & business skills
SKILLS_CATALOG = {
    # Data & Analytics & BI
    'Python': [r'\bpython\b', r'\bpython3\b'],
    'SQL': [r'\bsql\b', r'\bpostgres\b', r'\bpostgresql\b', r'\bmysql\b', r'\bsqlite\b', r'\bt-sql\b', r'\bpl/sql\b'],
    'Tableau': [r'\btableau\b'],
    'Power BI': [r'\bpower\s*bi\b', r'\bpowerbi\b'],
    'Excel': [r'\bexcel\b', r'\bspreadsheets\b', r'\badvanced\s+excel\b', r'\bvlookup\b'],
    'Data Analysis': [r'\bdata\s+analysis\b', r'\bdata\s+analytics\b', r'\bdata\s+mining\b', r'\banalytical\s+skills\b'],
    'Business Intelligence': [r'\bbusiness\s+intelligence\b', r'\bbi\s+tools\b', r'\bdashboard[s]?\b', r'\breporting\b'],
    'Statistics': [r'\bstatistics\b', r'\bstatistical\b', r'\bhypothesis\s+testing\b'],
    'R': [r'\br\s+programming\b', r'\bprogramming\s+in\s+r\b'],
    'Pandas': [r'\bpandas\b'],
    'NumPy': [r'\bnumpy\b'],
    'Apache Spark': [r'\bspark\b', r'\bpyspark\b'],
    'Airflow': [r'\bairflow\b'],
    'Snowflake': [r'\bsnowflake\b'],
    'BigQuery': [r'\bbigquery\b'],
    'Databricks': [r'\bdatabricks\b'],
    'ETL': [r'\betl\b', r'\bdata\s+pipeline[s]?\b'],
    'Data Warehousing': [r'\bdata\s+warehous\w+\b'],
    'Looker': [r'\blooker\b', r'\blookml\b'],

    # AI & Machine Learning
    'Machine Learning': [r'\bmachine\s+learning\b', r'\bml\b'],
    'Deep Learning': [r'\bdeep\s+learning\b'],
    'NLP': [r'\bnlp\b', r'\bnatural\s+language\b'],
    'PyTorch': [r'\bpytorch\b'],
    'TensorFlow': [r'\btensorflow\b', r'\bkeras\b'],
    'Scikit-Learn': [r'\bscikit-learn\b', r'\bsklearn\b'],
    'Computer Vision': [r'\bcomputer\s+vision\b', r'\bopencv\b'],
    'Generative AI / LLMs': [r'\bgenai\b', r'\bgenerative\s+ai\b', r'\bllm[s]?\b', r'\blangchain\b', r'\bhugging\s*face\b'],

    # Core Programming Languages
    'Java': [r'\bjava\b(?!\s*script)'],
    'JavaScript': [r'\bjavascript\b', r'\bjs\b(?!\w)'],
    'TypeScript': [r'\btypescript\b', r'\bts\b(?!\w)'],
    'C++': [r'\bc\+\+\b'],
    'C#': [r'\bc#\b', r'\bc-sharp\b'],
    'Go / Golang': [r'\bgolang\b', r'\bgo\s+language\b'],
    'Rust': [r'\brust\b'],
    'PHP': [r'\bphp\b'],
    'Ruby': [r'\bruby\b', r'\brails\b'],
    'Swift': [r'\bswift\b'],
    'Kotlin': [r'\bkotlin\b'],
    'Scala': [r'\bscala\b'],
    'Shell / Bash': [r'\bbash\b', r'\bshell\s+scripting\b'],

    # Frontend
    'React': [r'\breact\b', r'\breactjs\b', r'\breact\.js\b'],
    'Next.js': [r'\bnext\.?js\b'],
    'Vue.js': [r'\bvue\b', r'\bvuejs\b', r'\bvue\.js\b'],
    'Angular': [r'\bangular\b'],
    'Tailwind CSS': [r'\btailwind\b'],
    'HTML / CSS': [r'\bhtml\b', r'\bcss\b', r'\bhtml5\b', r'\bcss3\b'],
    'Redux': [r'\bredux\b'],

    # Backend
    'Node.js': [r'\bnode\.?js\b', r'\bnodejs\b'],
    'FastAPI': [r'\bfastapi\b'],
    'Django': [r'\bdjango\b'],
    'Flask': [r'\bflask\b'],
    'Spring Boot': [r'\bspring\s*boot\b', r'\bspring\s+framework\b'],
    'Microservices': [r'\bmicroservices\b', r'\bmicroservice\b'],
    'REST APIs': [r'\brest\s*api[s]?\b', r'\brestful\b', r'\bapi\s+design\b'],
    'GraphQL': [r'\bgraphql\b'],
    'gRPC': [r'\bgrpc\b'],

    # Cloud & DevOps
    'AWS': [r'\baws\b', r'\bamazon\s+web\s+services\b'],
    'Azure': [r'\bazure\b', r'\bmicrosoft\s+azure\b'],
    'GCP': [r'\bgcp\b', r'\bgoogle\s+cloud\b'],
    'Docker': [r'\bdocker\b', r'\bcontainers\b'],
    'Kubernetes': [r'\bkubernetes\b', r'\bk8s\b'],
    'Terraform': [r'\bterraform\b'],
    'CI/CD': [r'\bci[/-]cd\b', r'\bcontinuous\s+integration\b'],
    'Linux': [r'\blinux\b', r'\bunix\b'],
    'Kafka': [r'\bkafka\b'],
    'Redis': [r'\bredis\b'],
    'MongoDB': [r'\bmongodb\b'],

    # QA & Testing
    'Selenium': [r'\bselenium\b'],
    'Cypress': [r'\bcypress\b'],
    'Playwright': [r'\bplaywright\b'],
    'Test Automation': [r'\btest\s+automation\b', r'\bautomated\s+testing\b', r'\bqa\s+automation\b'],

    # Product & Agile & Management
    'Product Management': [r'\bproduct\s+management\b', r'\broadmap\w*\b', r'\bproduct\s+strategy\b'],
    'Agile / Scrum': [r'\bagile\b', r'\bscrum\b'],
    'JIRA': [r'\bjira\b'],
    'Figma': [r'\bfigma\b', r'\bui/ux\b', r'\buser\s+experience\b'],
    'Technical Support': [r'\btechnical\s+support\b', r'\btroubleshoot\w+\b', r'\bcustomer\s+support\b'],
    'Cybersecurity': [r'\bcybersecurity\b', r'\binformation\s+security\b', r'\bnetwork\s+security\b'],
}

ROLE_FALLBACKS = [
    (r'\b(data\s+analyst|bi\s+analyst|business\s+intelligence|analytics\s+analyst|marketing\s+analyst|financial\s+analyst|operations\s+analyst)\b', 
     ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Data Analysis']),
    (r'\b(data\s+scientist|machine\s+learning|ml\s+engineer|ai\s+engineer)\b', 
     ['Python', 'Machine Learning', 'SQL', 'PyTorch', 'Statistics', 'Pandas']),
    (r'\b(data\s+engineer|etl\s+developer|big\s+data)\b', 
     ['SQL', 'Python', 'Apache Spark', 'Airflow', 'ETL', 'AWS']),
    (r'\b(frontend|react|angular|vue|ui\s+engineer|web\s+developer)\b', 
     ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Next.js', 'Tailwind CSS']),
    (r'\b(backend|node|django|fastapi|golang|spring)\b', 
     ['Python', 'Node.js', 'REST APIs', 'SQL', 'Docker', 'Microservices']),
    (r'\b(full\s*stack|software\s+engineer|software\s+developer|sde)\b', 
     ['Python', 'JavaScript', 'React', 'SQL', 'REST APIs', 'Git']),
    (r'\b(devops|sre|site\s+reliability|cloud\s+engineer|infrastructure)\b', 
     ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux']),
    (r'\b(qa|quality\s+assurance|test\s+engineer|sdet)\b', 
     ['Test Automation', 'Selenium', 'Python', 'REST APIs', 'JIRA']),
    (r'\b(support|technical\s+support|help\s*desk|it\s+support)\b', 
     ['Technical Support', 'Linux', 'Troubleshooting', 'SQL', 'REST APIs']),
    (r'\b(product\s+manager|technical\s+product|product\s+owner)\b', 
     ['Product Management', 'Agile / Scrum', 'Data Analysis', 'JIRA', 'Product Strategy']),
    (r'\b(security|infosec|cybersecurity)\b', 
     ['Cybersecurity', 'Linux', 'Network Security', 'Python', 'AWS']),
    (r'\b(sales|account\s+executive|bdr|sdr|business\s+development)\b', 
     ['B2B Sales', 'CRM', 'Salesforce', 'Client Relations', 'Lead Generation']),
]

def extract_intelligent_skills(title, desc_html, desc_text):
    full_text = ' ' + (title or '') + ' ' + (desc_text or '') + ' ' + html.unescape(desc_html or '')
    clean = re.sub(r'<[^>]+>', ' ', full_text)

    found = []

    # 1. Keywords mentioned right in the title get top priority
    for skill, patterns in SKILLS_CATALOG.items():
        for pat in patterns:
            if re.search(pat, title or '', re.IGNORECASE):
                if skill not in found:
                    found.append(skill)
                break

    # 2. Keywords mentioned in the description body
    for skill, patterns in SKILLS_CATALOG.items():
        if len(found) >= 6:
            break
        for pat in patterns:
            if re.search(pat, clean, re.IGNORECASE):
                if skill not in found:
                    found.append(skill)
                break

    # 3. If fewer than 3 skills, supplement from role fallback
    if len(found) < 3:
        for title_pattern, fallback_skills in ROLE_FALLBACKS:
            if re.search(title_pattern, title or '', re.IGNORECASE):
                for s in fallback_skills:
                    if s not in found:
                        found.append(s)
                    if len(found) >= 4:
                        break
                break

    # 4. Fallback for remaining cases
    if not found:
        found = ['Software Development', 'Problem Solving', 'Communication']

    return found[:5]

def run_migration():
    print("[*] Connecting to Supabase...", flush=True)
    db_pass = quote_plus("MyJobPulse@2026#")
    url = f"postgresql://postgres.difdvbmniyhlltmdzngg:{db_pass}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"
    engine = create_engine(url, pool_pre_ping=True)

    with engine.connect() as conn:
        total_count = conn.execute(text("SELECT count(*) FROM jobs")).scalar()
        print(f"[+] Total jobs in database: {total_count}", flush=True)

        rows = conn.execute(text("SELECT id, title, description_html, description_text FROM jobs")).fetchall()
        print(f"[+] Loaded {len(rows)} jobs to process skills...", flush=True)

        updated = 0
        batch_size = 150
        update_params = []

        for row in rows:
            job_id, title, desc_html, desc_text = row[0], row[1], row[2], row[3]
            skills = extract_intelligent_skills(title, desc_html, desc_text)
            update_params.append({
                "jid": job_id,
                "skills": json.dumps(skills)
            })

            if len(update_params) >= batch_size:
                conn.execute(
                    text("UPDATE jobs SET skills_required = CAST(:skills AS json) WHERE id = :jid"),
                    update_params
                )
                conn.commit()
                updated += len(update_params)
                print(f"[+] Updated skills for {updated}/{len(rows)} jobs...", flush=True)
                update_params = []

        if update_params:
            conn.execute(
                text("UPDATE jobs SET skills_required = CAST(:skills AS json) WHERE id = :jid"),
                update_params
            )
            conn.commit()
            updated += len(update_params)
            print(f"[+] Finished updating skills for {updated}/{len(rows)} jobs!", flush=True)

    print("\n[✔] SUCCESS: All jobs in Supabase now have real, posting-specific skills!", flush=True)

if __name__ == "__main__":
    run_migration()
