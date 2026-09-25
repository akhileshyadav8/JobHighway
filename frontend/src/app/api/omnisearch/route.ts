import { NextRequest, NextResponse } from "next/server";
import { getLiveJobsPaginated, getLiveCompaniesFromDb } from "@/lib/db";
import { mockJobs, mockCompanies } from "@/lib/mock-data";
import { BLOG_ARTICLES } from "@/lib/blog_articles";

export const dynamic = "force-dynamic";

export const PREPARE_SEARCH_ITEMS = [
  { id: "prep_1", title: "Online Assessment (OA) Aptitude Strategies", category: "Prepare", subtitle: "Round 1 Elimination Prep · Math & Speed Coding", href: "/prepare#selection-process", tags: ["oa", "aptitude", "round 1", "test", "assessment"] },
  { id: "prep_2", title: "Core Technical & Data Structures (DSA) Round", category: "Prepare", subtitle: "Round 2 Coding Prep · Optimal Space & Time Complexity", href: "/prepare#selection-process", tags: ["dsa", "data structures", "algorithms", "coding", "technical"] },
  { id: "prep_3", title: "Machine Coding & System Architecture (HLD/LLD)", category: "Prepare", subtitle: "Round 3 Design Prep · Scalability & DB Trade-offs", href: "/prepare#selection-process", tags: ["system design", "hld", "lld", "architecture", "scalability"] },
  { id: "prep_4", title: "Leadership Principles & STAR Behavioral Method", category: "Prepare", subtitle: "Round 4 Fit Prep · Engineering Culture & Situation Stories", href: "/prepare#selection-process", tags: ["behavioral", "star method", "hr", "managerial", "fit"] },
  { id: "prep_5", title: "Striver's A2Z DSA Sheet", category: "Prepare", subtitle: "Curated Study Sheet · 450+ Step-by-Step DSA Problems", href: "/prepare#study-sheets", tags: ["striver", "a2z", "dsa sheet", "leetcode", "problems", "dsa"] },
  { id: "prep_6", title: "LeetCode Top SQL 50 Study Plan", category: "Prepare", subtitle: "Curated Study Sheet · Window Functions & Joins", href: "/prepare#study-sheets", tags: ["sql", "leetcode sql", "database", "query", "data analyst", "mysql"] },
  { id: "prep_7", title: "Engineering Career Ladder & Salary Growth", category: "Prepare", subtitle: "Career Pathway · Fresher to Principal Engineer Bands", href: "/prepare#career-pathways", tags: ["career", "ladder", "salary", "promotion", "fresher", "growth"] }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({
      query: "",
      jobs: [],
      companies: [],
      prep: [],
      articles: []
    });
  }

  const qLower = q.toLowerCase();

  // 1. Fetch matching jobs (top 5)
  let jobs: any[] = [];
  try {
    const liveJobsRes = await getLiveJobsPaginated({ search: q, pageSize: 6 });
    if (liveJobsRes && liveJobsRes.items.length > 0) {
      jobs = liveJobsRes.items.map(j => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        company: {
          name: j.company?.name || "Company",
          logo_url: j.company?.logo_url || null,
        },
        location: Array.isArray(j.location) ? j.location[0] : (typeof j.location === "string" ? j.location : "Remote"),
        work_mode: j.work_mode || "Full-time",
        job_type: (j as any).employment_type || (j as any).job_type || "Full-time",
        salary: (j as any).salary_min 
          ? `${(j as any).salary_currency || "$"}${(j as any).salary_min.toLocaleString()} - ${(j as any).salary_currency || "$"}${(j as any).salary_max ? (j as any).salary_max.toLocaleString() : ""}`
          : (j as any).salary || null,
        source: (j as any).official_domain || (j as any).source || "Direct ATS",
      }));
    }
  } catch (err) {
    console.warn("Omnisearch DB jobs error:", err);
  }

  // Fallback to mockJobs if DB returned no results
  if (jobs.length === 0) {
    jobs = mockJobs
      .filter(j => 
        j.title.toLowerCase().includes(qLower) || 
        j.company.name.toLowerCase().includes(qLower) ||
        (j.skills_required && j.skills_required.some((s: string) => s.toLowerCase().includes(qLower))) ||
        (j.location && (Array.isArray(j.location) ? j.location.join(" ") : j.location).toLowerCase().includes(qLower))
      )
      .slice(0, 6)
      .map(j => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        company: {
          name: j.company?.name || "Company",
          logo_url: j.company?.logo_url || null,
        },
        location: Array.isArray(j.location) ? j.location[0] : (typeof j.location === "string" ? j.location : "Remote"),
        work_mode: j.work_mode || "Full-time",
        job_type: (j as any).employment_type || (j as any).job_type || "Full-time",
        salary: (j as any).salary_min 
          ? `${(j as any).salary_currency || "$"}${(j as any).salary_min.toLocaleString()} - ${(j as any).salary_currency || "$"}${(j as any).salary_max ? (j as any).salary_max.toLocaleString() : ""}`
          : (j as any).salary || null,
        source: (j as any).official_domain || (j as any).source || "Direct ATS",
      }));
  }

  // 2. Fetch matching companies (top 5)
  let companies: any[] = [];
  try {
    const liveComps = await getLiveCompaniesFromDb();
    if (liveComps && liveComps.length > 0) {
      companies = liveComps
        .filter(c => 
          c.name.toLowerCase().includes(qLower) || 
          (c.industry && c.industry.toLowerCase().includes(qLower)) ||
          (c.headquarters && c.headquarters.toLowerCase().includes(qLower))
        )
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          industry: c.industry || "Technology",
          headquarters: c.headquarters,
          active_job_count: c.active_job_count || 1
        }));
    }
  } catch (err) {
    console.warn("Omnisearch DB companies error:", err);
  }

  if (companies.length === 0) {
    companies = mockCompanies
      .filter(c => 
        c.name.toLowerCase().includes(qLower) || 
        (c.industry && c.industry.toLowerCase().includes(qLower)) ||
        (c.headquarters && c.headquarters.toLowerCase().includes(qLower))
      )
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        industry: c.industry || "Technology",
        headquarters: c.headquarters,
        active_job_count: c.active_job_count || 1
      }));
  }

  // 3. Prepare items matching
  const prep = PREPARE_SEARCH_ITEMS.filter(item => 
    item.title.toLowerCase().includes(qLower) || 
    item.subtitle.toLowerCase().includes(qLower) ||
    item.tags.some(t => t.includes(qLower))
  ).slice(0, 4);

  // 4. Blog articles matching (using summary field from BlogArticle)
  const articles = BLOG_ARTICLES.filter(a => 
    a.title.toLowerCase().includes(qLower) || 
    a.summary.toLowerCase().includes(qLower) ||
    a.category.toLowerCase().includes(qLower) ||
    (a.tags && a.tags.some(t => t.toLowerCase().includes(qLower)))
  ).slice(0, 3).map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: a.category,
    readTime: a.readTime,
    summary: a.summary
  }));

  return NextResponse.json({
    query: q,
    jobs,
    companies,
    prep,
    articles
  });
}
