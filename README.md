# JobHighway — Near Real-Time Official Job Discovery Engine

> A high-performance, official ATS-first job discovery engine that monitors company career portals, detects new job postings within minutes, extracts structured data, and publishes rich listings with salary insights, interview breakdowns, and free study materials.

---

## ⚡ Key Features

- **Near Real-Time ATS Ingestion**: Polls official company career portals (Greenhouse, Lever, Ashby, TeamTailor, Workday) every 5–15 minutes.
- **Zero-Delay Publishing**: Incremental change detection via SHA256 content hashes detects new, updated, and removed roles automatically.
- **100% Direct Official Apply Links**: No middlemen or dead third-party redirects — applies directly on the employer's official ATS.
- **Structured AI Extraction**: Normalizes messy job descriptions into structured data (salary ranges, tech stacks, experience levels, batch eligibility 2024–2026).
- **Candidate Prep Ecosystem**:
  - Round-by-round **Selection Process**
  - Real **Interview Experience** insights
  - Verified **Work Culture** summaries
  - Curated **Free Study Materials** (TakeUForward Striver's sheet, LeetCode SQL 50, IndiaBIX, GeeksforGeeks)
- **Hierarchical Location Filtering**: Dynamic Country & City selectors covering all major tech hubs in India and worldwide.
- **Dark / Light Mode Support**: Built-in sleek theme toggle.

---

## 🏗️ Tech Stack

### Backend
- **Framework**: Python 3.12, FastAPI (async)
- **Task Queue & Scheduler**: Celery 5 + Redis 7
- **Database**: PostgreSQL 16 with Async SQLAlchemy & Alembic
- **AI Extraction**: Google Gemini 2.0 Flash with JSON structured outputs
- **Connectors**: HTTPX, BeautifulSoup4, Tenacity

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React, shadcn/ui components

---

## 🚀 Quick Start

### 1. Clone & Configure
```bash
git clone https://github.com/akhileshyadav8/JobHighway.git
cd JobHighway
cp .env.example .env
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### 3. Run Backend (with Docker)
```bash
docker compose up -d db redis
cd backend
pip install -e .
alembic upgrade head
python scripts/seed_db.py
uvicorn app.main:app --reload
```

---

## 📄 License
MIT License. Built for job seekers and freshers across India and worldwide.
