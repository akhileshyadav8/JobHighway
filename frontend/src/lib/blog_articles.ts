export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  category: "Career Strategy" | "Interview Prep" | "Tech Guide" | "Coding" | "Resume & ATS";
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
  };
  summary: string;
  tags: string[];
  keyTakeaways: string[];
  relatedJobsQuery?: string;
  sections: {
    heading: string;
    content: string[];
    tips?: string[];
    codeSnippet?: {
      language: string;
      code: string;
    };
  }[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    slug: "crack-off-campus-hiring-2026",
    title: "How to Crack Off-Campus Hiring in 2026: The Ultimate Playbook",
    category: "Career Strategy",
    readTime: "6 min read",
    date: "Sep 08, 2026",
    author: {
      name: "JobPulse Career Research",
      role: "ATS Intelligence Team"
    },
    summary: "Most candidates apply weeks after a job is published when hundreds of applicants are already in the pipeline. Here is how applying within the first 1 hour via ATS triggers increases shortlisting odds by 5x.",
    tags: ["Off Campus", "Freshers", "Hiring", "Career Strategy"],
    relatedJobsQuery: "Software Engineer",
    keyTakeaways: [
      "90% of recruiters review applications in chronological batches of 25–50 candidates.",
      "Applying within the first 60 minutes gives you an uncrowded recruiter review window.",
      "Direct ATS portal links (Greenhouse, Lever, Ashby) completely bypass third-party broker delays.",
      "Customizing 3–4 bullet points with keywords from the JD doubles keyword parser scores."
    ],
    sections: [
      {
        heading: "1. The First-Mover Advantage in Modern ATS Systems",
        content: [
          "In 2026, automated Applicant Tracking Systems like Greenhouse and Ashby do not wait until a deadline to review resumes. They deliver applicant profiles into recruiters' queues continuously.",
          "When an employer posts a software engineering role, they typically receive 500+ applications within 48 hours. However, recruiter screeners typically review only the first 75–100 applications before scheduling phone screens.",
          "By monitoring official company career feeds in real-time with JobPulse, your application arrives at the top of the recruiter's morning dashboard before the floodgates open."
        ],
        tips: [
          "Set up daily or hourly alerts for your target companies rather than browsing weekly.",
          "Always apply through official career links (e.g. boards.greenhouse.io or jobs.lever.co) rather than aggregator spam."
        ]
      },
      {
        heading: "2. The 3-Tier Application Strategy",
        content: [
          "Tier 1 (Dream Companies): Apply within 2 hours of posting on their official career portal, then find an engineering manager or alumni on LinkedIn and send a 3-sentence note referencing your application ID.",
          "Tier 2 (High-Growth Startups & Unicorns): Apply with tailored GitHub project links directly in the application form fields.",
          "Tier 3 (Broad Volume): Target fresh openings with zero backlog requirements that match your core tech stack (React, Python, Java, SQL)."
        ]
      },
      {
        heading: "3. Cold Outreach Template That Actually Gets Responses",
        content: [
          "Recruiters receive dozens of generic messages daily. Keep your outreach under 70 words, specific, and polite."
        ],
        codeSnippet: {
          language: "markdown",
          code: `Hi [Name],

I noticed [Company] just opened the [Role Title] position on your official portal (App ID: #XXXX). 
I have built [1-sentence achievement with metrics, e.g. a real-time event pipeline processing 10k req/s using Node & Redis].

I have submitted my application directly on your career page and would love to be considered.

Best,
[Your Name] | [GitHub / Portfolio URL]`
        }
      }
    ]
  },
  {
    id: "2",
    slug: "top-50-sql-questions-data-analyst",
    title: "Top 50 SQL Query Questions Asked in Data Analyst & Engineering Rounds",
    category: "Interview Prep",
    readTime: "10 min read",
    date: "Sep 05, 2026",
    author: {
      name: "Akhilesh Yadav",
      role: "Lead Data Engineer"
    },
    summary: "A comprehensive breakdown of CTEs, Window Functions (ROW_NUMBER, DENSE_RANK), joins, and optimization questions commonly tested in technical assessments.",
    tags: ["SQL", "Data Analyst", "Interview", "PostgreSQL"],
    relatedJobsQuery: "Data Analyst",
    keyTakeaways: [
      "Master DENSE_RANK() vs ROW_NUMBER() for Nth highest salary problems.",
      "Understand why WHERE filters rows before aggregation while HAVING filters after GROUP BY.",
      "Use Common Table Expressions (CTEs) for readable multi-step transformations.",
      "Always know how to identify and handle NULL values in LEFT JOINs."
    ],
    sections: [
      {
        heading: "1. The Classic 'N-th Highest Salary' (Window Function Approach)",
        content: [
          "One of the most frequently asked questions across Google, Amazon, and FinTech startups is finding the Nth highest salary overall or per department."
        ],
        codeSnippet: {
          language: "sql",
          code: `-- Find the 2nd highest salary per department
WITH RankedSalaries AS (
  SELECT 
    emp_id,
    emp_name,
    department_id,
    salary,
    DENSE_RANK() OVER (
      PARTITION BY department_id 
      ORDER BY salary DESC
    ) as salary_rank
  FROM employees
)
SELECT department_id, emp_name, salary
FROM RankedSalaries
WHERE salary_rank = 2;`
        },
        tips: [
          "Always use DENSE_RANK() instead of ROW_NUMBER() when salaries might be tied.",
          "If the interviewer asks for MySQL without CTEs, use LIMIT 1 OFFSET 1 with DISTINCT."
        ]
      },
      {
        heading: "2. Calculating Month-over-Month (MoM) Growth with LAG()",
        content: [
          "Data analysts are often evaluated on revenue growth queries. Here is the cleanest industry-standard approach using LAG()."
        ],
        codeSnippet: {
          language: "sql",
          code: `-- Calculate MoM revenue growth percentage
WITH MonthlyRevenue AS (
  SELECT 
    DATE_TRUNC('month', order_date) as sales_month,
    SUM(amount) as current_revenue
  FROM orders
  GROUP BY 1
)
SELECT 
  sales_month,
  current_revenue,
  LAG(current_revenue, 1) OVER (ORDER BY sales_month) as prev_revenue,
  ROUND(
    ((current_revenue - LAG(current_revenue, 1) OVER (ORDER BY sales_month)) 
     / LAG(current_revenue, 1) OVER (ORDER BY sales_month)) * 100, 
    2
  ) as growth_percentage
FROM MonthlyRevenue;`
        }
      },
      {
        heading: "3. Finding Consecutive Logins / Streaks",
        content: [
          "The 'Gaps and Islands' problem tests your deeper understanding of window differences."
        ],
        codeSnippet: {
          language: "sql",
          code: `-- Find users who logged in 3 or more consecutive days
WITH GroupedLogins AS (
  SELECT 
    user_id,
    login_date,
    login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS grp
  FROM user_logins
)
SELECT user_id, MIN(login_date), MAX(login_date), COUNT(*) as streak_days
FROM GroupedLogins
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;`
        }
      }
    ]
  },
  {
    id: "3",
    slug: "demystifying-company-ats-greenhouse-lever",
    title: "Demystifying Company ATS: How Greenhouse, Lever & Ashby Screen Your Resume",
    category: "Tech Guide",
    readTime: "8 min read",
    date: "Aug 29, 2026",
    author: {
      name: "JobPulse Engineering",
      role: "Systems Architecture"
    },
    summary: "Learn what really happens when your resume enters an Applicant Tracking System. Discover formatting rules, keyword density matching, and common myths.",
    tags: ["ATS", "Resume", "Tech Jobs", "Career Guide"],
    relatedJobsQuery: "Engineer",
    keyTakeaways: [
      "Modern ATS systems do NOT auto-reject resumes purely based on AI scores — humans still review candidate lists.",
      "Complex multi-column resume templates fail text extraction in 40% of parsing engines.",
      "Clear standard section headers (Experience, Projects, Education, Skills) are mandatory for clean parsing.",
      "Never put contact info or key skills in image headers or footers."
    ],
    sections: [
      {
        heading: "1. How Greenhouse and Lever Actually Work",
        content: [
          "There is a widespread myth that an AI robot deletes 90% of resumes before human eyes see them. In reality, modern ATS platforms are primarily structured databases and workflow management tools.",
          "When you upload a PDF, the system runs an OCR / text parser that converts your document into structured fields: Name, Email, Companies Worked, Job Titles, Degrees, and Skills.",
          "Recruiters then sort and search this database. If your resume uses non-standard graphical layouts, the parser produces jumbled text, meaning your profile won't appear when the recruiter filters by 'React' or 'PostgreSQL'."
        ]
      },
      {
        heading: "2. The 5 ATS Formatting Golden Rules",
        content: [
          "Follow these formatting rules to ensure 100% parser accuracy across Workday, Greenhouse, Lever, and Taleo:"
        ],
        tips: [
          "Use a single-column layout. Avoid dual columns or sidebars.",
          "Use standard fonts: Inter, Arial, Calibri, or Roboto. Avoid custom icon fonts.",
          "Export as clean searchable PDF. If you can highlight and copy text in Acrobat/Chrome, the ATS can read it.",
          "Label sections clearly: 'Work Experience', 'Technical Skills', 'Projects', 'Education'.",
          "Include both acronyms and full names (e.g. 'AWS (Amazon Web Services)', 'GCP (Google Cloud Platform)')."
        ]
      }
    ]
  },
  {
    id: "4",
    slug: "dsa-roadmap-product-companies",
    title: "DSA Roadmap for Product Companies: What Freshers Must Master",
    category: "Coding",
    readTime: "7 min read",
    date: "Aug 22, 2026",
    author: {
      name: "JobPulse Tech Mentors",
      role: "Algorithms & Competitive Programming"
    },
    summary: "Which data structures matter most for junior SDE roles? Master binary search, two pointers, trees, and graphs without getting stuck in the dynamic programming trap.",
    tags: ["DSA", "LeetCode", "SDE", "Freshers"],
    relatedJobsQuery: "Software Development Engineer",
    keyTakeaways: [
      "80% of tech rounds for entry roles test Arrays, HashMaps, Two Pointers, and Binary Search.",
      "Stop spending 3 months on Hard Dynamic Programming before mastering Trees and Graph BFS/DFS.",
      "Always communicate time and space complexities (Big-O) before writing code.",
      "Clean code, edge case handling, and variable naming count for 50% of the evaluation."
    ],
    sections: [
      {
        heading: "1. The 12-Week Strategic Topic Order",
        content: [
          "Week 1–2: Arrays & HashMaps (Two Sum, Group Anagrams, Prefix Sums)",
          "Week 3–4: Two Pointers & Sliding Window (3Sum, Minimum Window Substring)",
          "Week 5–6: Binary Search (Rotated Arrays, Search in 2D Matrix)",
          "Week 7–8: Trees & Binary Search Trees (LCA, Level Order Traversal, Max Path Sum)",
          "Week 9–10: Graphs (BFS/DFS, Topological Sort, Number of Islands)",
          "Week 11–12: Heaps / Priority Queues & System Design Basics (Top K Frequent, Merge K Sorted Lists)"
        ],
        tips: [
          "Solve 150 well-chosen problems (e.g. NeetCode 150 / Blind 75) rather than 800 random LeetCode questions.",
          "Always practice writing code on a blank whiteboard or Google Docs without syntax autocomplete."
        ]
      },
      {
        heading: "2. The 5-Step Live Interview Framework",
        content: [
          "Step 1: Clarify constraints (Can values be negative? Are there duplicate inputs?)",
          "Step 2: Propose the brute-force solution and state its complexity.",
          "Step 3: Discuss optimizations (Can we use a HashMap to drop O(N^2) to O(N)?)",
          "Step 4: Write clean, well-modularized code.",
          "Step 5: Dry run with a small sample input and walk through edge cases (empty array, single element)."
        ]
      }
    ]
  },
  {
    id: "5",
    slug: "resume-formatting-for-modern-ats",
    title: "Resume Formatting Secrets: How to Pass 99% of Tech Screeners in 2026",
    category: "Resume & ATS",
    readTime: "5 min read",
    date: "Aug 15, 2026",
    author: {
      name: "JobPulse Career Research",
      role: "Talent Acquisition"
    },
    summary: "Discover the exact resume structure used by candidates hired at Google, Stripe, and top unicorns. Bullet formulas, metric verification, and design guidelines.",
    tags: ["Resume", "Career", "ATS", "Job Search"],
    relatedJobsQuery: "Frontend Engineer",
    keyTakeaways: [
      "Use Google's 'X-Y-Z' formula for bullet points: Accomplished [X], measured by [Y], by doing [Z].",
      "Keep technical skills organized by category: Languages, Frameworks, Cloud/Databases, Tools.",
      "Limit your resume to 1 page if you have under 5 years of experience.",
      "Every project bullet must state the business impact or performance improvement."
    ],
    sections: [
      {
        heading: "1. The Google 'X-Y-Z' Bullet Formula",
        content: [
          "Never write vague bullets like 'Responsible for maintaining React website'. Instead, follow the Google formula:",
          "'Accomplished [X] as measured by [Y], by doing [Z]'.",
          "Example: 'Optimized client-side rendering pipeline [Z], reducing initial bundle size by 42% [Y], leading to 1.8s faster page load times across 150,000 monthly users [X]'."
        ]
      },
      {
        heading: "2. Technical Skills Matrix Template",
        content: [
          "Group your skills into 4 distinct rows so recruiters can scan them in under 3 seconds:"
        ],
        codeSnippet: {
          language: "markdown",
          code: `Technical Skills:
• Languages: Python, TypeScript, JavaScript, SQL (PostgreSQL), Go, Java
• Frameworks: React, Next.js, Node.js, FastAPI, Tailwind CSS, Express
• Cloud & DevOps: AWS (EC2, S3, RDS), Docker, GitHub Actions, CI/CD, Linux
• Tools & Systems: Git, Redis, Kafka, Datadog, Jest, Postman`
        }
      }
    ]
  },
  {
    id: "6",
    slug: "high-paying-tech-roles-without-faang",
    title: "High-Paying Tech Roles Beyond FAANG: The 2026 Compensation Guide",
    category: "Career Strategy",
    readTime: "8 min read",
    date: "Aug 02, 2026",
    author: {
      name: "JobPulse Compensation Lab",
      role: "Salary Benchmark Team"
    },
    summary: "FAANG is no longer the only path to top-tier compensation. High-growth fintech, AI infrastructure startups, and global remote companies frequently outpay legacy tech giants.",
    tags: ["High Salary", "Fintech", "Remote Work", "Compensation"],
    relatedJobsQuery: "Full Stack Engineer",
    keyTakeaways: [
      "Companies like Stripe, Datadog, Linear, and Canva offer higher base salaries and flexible remote models.",
      "AI Infrastructure and FinTech offer 20-35% salary premiums over traditional enterprise IT.",
      "Negotiating multiple verified offers published in the last 30 days yields an average 18% compensation bump."
    ],
    sections: [
      {
        heading: "1. Where the Top Salaries Are in 2026",
        content: [
          "In 2026, the highest compensation bands have shifted significantly towards AI infrastructure providers, cloud security platforms, and high-frequency trading firms.",
          "In India, unicorns like CRED, Razorpay, and Swiggy offer 25–45 LPA base packages for mid-level engineers, rivaling Silicon Valley multinationals.",
          "Globally, fully distributed companies like GitLab, Automattic, and Supabase pay benchmarked USD/EUR rates regardless of where you reside."
        ],
        tips: [
          "Filter by 'High Salary (₹12L+ / $80K+)' on JobPulse to discover these verified postings.",
          "Look for roles requiring niche modern tooling like Kubernetes, Golang, PyTorch, and distributed SQL."
        ]
      }
    ]
  }
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find(a => a.slug === slug);
}

export function getAllArticles(): BlogArticle[] {
  return BLOG_ARTICLES;
}
