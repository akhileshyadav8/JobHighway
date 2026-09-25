import React from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Code2, 
  Database, 
  Cloud, 
  BrainCircuit, 
  FileText, 
  Award, 
  Zap, 
  Target, 
  Compass, 
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Preparation & Interview Hub | JobHighway",
  description: "Comprehensive interview roadmaps, selection rounds, curated free study sheets, and career pathways for software engineers, data analysts, and tech professionals."
};

const SELECTION_ROUNDS = [
  {
    step: "01",
    title: "Online Assessment (OA) & Aptitude Round",
    focus: "Quantitative Aptitude, Logical Reasoning & Speed Coding",
    description: "The primary elimination round used by top product & tech employers. Tests mental math, pattern recognition, data interpretation, and 2-3 standard algorithmic coding problems.",
    tips: [
      "Master time per question: do not spend more than 90 seconds on a single aptitude question.",
      "Practice edge cases for coding questions: empty inputs, maximum integer constraints, 0 and negative values.",
      "Ensure fast I/O in your preferred language (Python sys.stdin.readline or Java BufferedReader)."
    ],
    recommendedTools: [
      { name: "IndiaBIX Quantitative Aptitude", url: "https://www.indiabix.com/aptitude/questions-and-answers/" },
      { name: "HackerRank Interview Prep Kit", url: "https://www.hackerrank.com/interview/interview-preparation-kit" }
    ]
  },
  {
    step: "02",
    title: "Core Technical & Data Structures Round",
    focus: "DSA, Problem Solving, Space-Time Complexity Analysis",
    description: "Live 45–60 minute interactive technical interviews with senior engineers. Focuses on writing clean, optimal, and modular code on a shared whiteboard or live editor.",
    tips: [
      "Always communicate your thoughts out loud before typing a single line of code.",
      "Start with a working brute-force approach first, state its time/space complexity, then optimize.",
      "Proactively dry-run your solution with sample test cases before telling the interviewer you are done."
    ],
    recommendedTools: [
      { name: "Striver's A2Z DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
      { name: "LeetCode Top 150 Interview Questions", url: "https://leetcode.com/studyplan/top-interview-150/" }
    ]
  },
  {
    step: "03",
    title: "Machine Coding & System Architecture Round",
    focus: "Low-Level Design (LLD), High-Level Design (HLD) & Clean Architecture",
    description: "Design real-world scalable applications (e.g. Rate Limiter, URL Shortener, Notification Engine). Evaluates modularity, database schema choices, caching strategies, and concurrency.",
    tips: [
      "Clarify functional and non-functional requirements (read vs write heavy, latency, SLA) in the first 5 minutes.",
      "Clearly articulate trade-offs (e.g. SQL vs NoSQL, Redis caching vs direct DB reads, sync vs async messaging).",
      "Sketch component diagrams clearly and justify every service boundary."
    ],
    recommendedTools: [
      { name: "System Design Primer by Donne Martin", url: "https://github.com/donnemartin/system-design-primer" },
      { name: "ByteByteGo Architecture Digest", url: "https://blog.bytebytego.com/" }
    ]
  },
  {
    step: "04",
    title: "Leadership Principles & Behavioral Round",
    focus: "STAR Method, Conflict Resolution, Ownership & Culture Fit",
    description: "Conducted by Engineering Managers or Directors. Tests how you navigate ambiguity, deliver under deadlines, collaborate across cross-functional teams, and handle engineering mistakes.",
    tips: [
      "Structure every answer using the STAR framework: Situation, Task, Action, Result.",
      "Quantify your results with concrete numbers (e.g., 'reduced API latency by 42%', 'saved $12k/month on AWS').",
      "Always have 2-3 thoughtful questions prepared for the interviewer about team culture, engineering velocity, and technical roadmap."
    ],
    recommendedTools: [
      { name: "Amazon 16 Leadership Principles Guide", url: "https://www.aboutamazon.com/about-us/leadership-principles" },
      { name: "Behavioral Interview Prep Guide", url: "https://www.themuse.com/advice/star-interview-method" }
    ]
  }
];

const ROLE_CURRICULUMS = [
  {
    role: "Software Development Engineer (SDE / Backend)",
    icon: Code2,
    badge: "Most In-Demand",
    color: "teal",
    description: "End-to-end backend mastery covering algorithms, concurrent programming, distributed architecture, and database engineering.",
    coreCompetencies: ["Data Structures & Algorithms", "System Design (HLD & LLD)", "PostgreSQL / MySQL", "Redis & In-Memory Caches", "Kafka / RabbitMQ", "Docker & Microservices"],
    studyPlanUrl: "https://roadmap.sh/backend"
  },
  {
    role: "Data Analyst & Business Intelligence",
    icon: Database,
    badge: "Fresher & Transition Friendly",
    color: "blue",
    description: "Extracting actionable business intelligence from massive relational and warehouse datasets with clean visualizations.",
    coreCompetencies: ["Advanced SQL (Joins, Window Functions)", "Python Pandas & NumPy", "Power BI / Tableau Dashboards", "Statistical Hypothesis Testing", "Business Metrics (CAC, LTV, Churn)"],
    studyPlanUrl: "https://roadmap.sh/data-analyst"
  },
  {
    role: "Data Scientist & Machine Learning Engineer",
    icon: BrainCircuit,
    badge: "High Growth",
    color: "purple",
    description: "Designing predictive machine learning models, fine-tuning LLMs, and operationalizing production ML pipelines.",
    coreCompetencies: ["Linear Algebra & Probability", "Feature Engineering & Scikit-Learn", "Deep Learning (PyTorch)", "MLOps & Model Tracking (MLflow)", "Vector DBs & LLM Fine-Tuning"],
    studyPlanUrl: "https://roadmap.sh/ai-data-scientist"
  },
  {
    role: "DevOps & Cloud Infrastructure Engineer",
    icon: Cloud,
    badge: "Mission Critical",
    color: "amber",
    description: "Automating cloud provisioning, container orchestration, zero-downtime CI/CD pipelines, and observability.",
    coreCompetencies: ["Linux Kernel & Shell Scripting", "Kubernetes & Docker", "Terraform & Infrastructure as Code", "AWS / GCP Solutions Architecture", "Prometheus & Grafana Observability"],
    studyPlanUrl: "https://roadmap.sh/devops"
  }
];

const CURATED_SHEETS = [
  {
    title: "Striver's A2Z DSA Sheet (TakeUForward)",
    category: "Coding & DSA",
    provider: "TakeUForward",
    description: "450+ structured problems categorized from basics (Arrays, Strings, Recursion) to advanced (Graphs, DP, Tries) with clean video walkthroughs.",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
  },
  {
    title: "LeetCode Top SQL 50 Study Plan",
    category: "Databases & SQL",
    provider: "LeetCode Official",
    description: "The gold standard collection of 50 query problems covering window functions, recursive CTEs, and complex joins asked in interviews.",
    url: "https://leetcode.com/studyplan/top-sql-50/"
  },
  {
    title: "NeetCode 150 Problem Roadmap",
    category: "Blind 75 & DSA",
    provider: "NeetCode.io",
    description: "Hand-picked, high-signal problems mapped across every DSA concept with visual solutions and Python/Java/C++ code samples.",
    url: "https://neetcode.io/practice"
  },
  {
    title: "System Design Primer by Donne Martin",
    category: "Architecture & Scale",
    provider: "GitHub Open Source",
    description: "Over 260k GitHub stars. Covers CDN, Load Balancing, Caching, Sharding, CAP Theorem, and end-to-end architectures.",
    url: "https://github.com/donnemartin/system-design-primer"
  },
  {
    title: "IndiaBIX Quantitative Aptitude & Verbal Practice",
    category: "Aptitude (OA)",
    provider: "IndiaBIX",
    description: "Comprehensive problem sets for numerical capability, logical deduction, data interpretation, and verbal comprehension.",
    url: "https://www.indiabix.com/aptitude/questions-and-answers/"
  },
  {
    title: "GeeksforGeeks SDE Company-Wise Interview Archive",
    category: "Real Questions",
    provider: "GeeksforGeeks",
    description: "Real candidate interview experiences, round-by-round breakdown, and technical questions asked at Amazon, Google, Microsoft, and Uber.",
    url: "https://www.geeksforgeeks.org/company-preparation/"
  }
];

const CAREER_PATHWAYS = [
  {
    stage: "Fresher / Associate Engineer",
    experience: "0 – 1 Years",
    compensation: "₹6L – ₹14L / $75k – $110k",
    focus: "Execution & Clean Code",
    responsibilities: "Writing clean unit-tested features, fixing bug backlogs, learning git workflows, and mastering company codebase architecture."
  },
  {
    stage: "Mid-Level Engineer (SDE II)",
    experience: "2 – 4 Years",
    compensation: "₹15L – ₹30L / $110k – $160k",
    focus: "Independent Ownership",
    responsibilities: "Leading subsystem design, owning production deployments, participating in code reviews, optimizing slow queries, and handling alerts."
  },
  {
    stage: "Senior Engineer (SDE III / Tech Lead)",
    experience: "5 – 8 Years",
    compensation: "₹32L – ₹65L / $170k – $240k",
    focus: "Architecture & Mentorship",
    responsibilities: "Designing resilient distributed systems, driving high-impact technical initiatives, mentoring junior engineers, and setting coding standards."
  },
  {
    stage: "Staff / Principal Engineer",
    experience: "8+ Years",
    compensation: "₹70L – ₹1.5Cr+ / $250k – $400k+",
    focus: "Org Strategy & Innovation",
    responsibilities: "Defining cross-organization technical strategy, eliminating systemic bottlenecks, shaping 3-year roadmaps, and representing tech leadership."
  }
];

export default function PreparePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-emerald-50/20 to-slate-50 border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-200">
            <GraduationCap className="w-4 h-4 text-teal-700" />
            <span>JobHighway Career Preparation Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Crack Technical Rounds.<br />
            <span className="text-teal-600">Land Direct ATS Offers.</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
            Step-by-step selection round breakdowns, verified study roadmaps, free curated sheets, and career ladders to guide your journey from discovery to offer.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#selection-process"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              Explore Selection Rounds
            </a>
            <a
              href="#study-sheets"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Curated Free Sheets
            </a>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Browse Live Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-10 sm:py-12 space-y-16">
        {/* Section 1: Selection Process Stages */}
        <section id="selection-process" className="scroll-mt-24 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-teal-600" />
                <span>Standard Tech Selection Rounds</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                How tier-1 tech companies evaluate candidates across each stage of the hiring funnel
              </p>
            </div>
            <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md border border-teal-200">
              4 Step Funnel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SELECTION_ROUNDS.map((round) => (
              <div
                key={round.step}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                      ROUND {round.step}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{round.focus}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {round.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {round.description}
                  </p>

                  <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Key Strategies &amp; Tips:
                    </span>
                    {round.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                  <span className="text-slate-400 font-medium">Recommended Prep:</span>
                  <div className="flex items-center gap-2">
                    {round.recommendedTools.map((tool, idx) => (
                      <a
                        key={idx}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>{tool.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Role-Specific Curriculums */}
        <section id="role-curriculums" className="scroll-mt-24 space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-teal-600" />
              <span>Role-Specific Interview Curriculums</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Targeted skill trees and expectations calibrated for modern hiring requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROLE_CURRICULUMS.map((curr, idx) => {
              const Icon = curr.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 leading-snug">
                            {curr.role}
                          </h3>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 inline-block mt-0.5">
                            {curr.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {curr.description}
                    </p>

                    <div className="mb-4">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Must-Have Core Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {curr.coreCompetencies.map((comp, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={curr.studyPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1.5"
                    >
                      <span>Interactive Roadmap &amp; Guide</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      href={`/?q=${encodeURIComponent(curr.role.split(" ")[0])}`}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                    >
                      <span>View Openings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Curated Free Study Sheets */}
        <section id="study-sheets" className="scroll-mt-24 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-teal-600" />
                <span>Verified Free Study Sheets &amp; Repositories</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                100% free, community-vetted resources with zero paywalls
              </p>
            </div>
            <span className="hidden sm:inline text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
              100% Free
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURATED_SHEETS.map((sheet, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 uppercase">
                      {sheet.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {sheet.provider}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2 leading-snug">
                    {sheet.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {sheet.description}
                  </p>
                </div>

                <a
                  href={sheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-700 text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Visual Career Pathways */}
        <section id="career-pathways" className="scroll-mt-24 space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-teal-600" />
              <span>Engineering Career Ladder &amp; Salary Growth</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Typical progression expectations, focus areas, and compensation bands across software tiers
            </p>
          </div>

          <div className="relative border-l-2 border-teal-500/40 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {CAREER_PATHWAYS.map((path, idx) => (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full bg-teal-600 border-4 border-white shadow-xs" />

                <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900">
                      {path.stage}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {path.experience}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {path.compensation}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1.5">
                    Core Focus: {path.focus}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {path.responsibilities}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to apply what you&apos;ve prepared?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Search 60,000+ verified active openings discovered directly from employer applicant tracking systems every single hour.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Discover Verified Jobs Now
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Analyze Your Resume Fit
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
