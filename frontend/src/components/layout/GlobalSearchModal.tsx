"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  MapPin,
  ExternalLink,
  History,
  TrendingUp,
  Sparkles,
  Loader2,
  Trash2,
  ChevronRight
} from "lucide-react";
import { mockJobs, mockCompanies } from "@/lib/mock-data";
import { BLOG_ARTICLES } from "@/lib/blog_articles";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchJob {
  id: string | number;
  slug: string;
  title: string;
  company: {
    name: string;
    logo_url?: string | null;
  };
  location?: string | string[];
  work_mode?: string;
  job_type?: string;
  salary?: any;
  source?: string;
}

interface SearchCompany {
  id: string | number;
  name: string;
  slug: string;
  industry?: string;
  headquarters?: string;
  active_job_count?: number;
}

interface SearchPrep {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  href: string;
}

interface SearchArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  summary: string;
}

const PREPARE_ITEMS: SearchPrep[] = [
  { id: "prep_1", title: "Online Assessment (OA) Aptitude Strategies", category: "Prepare", subtitle: "Round 1 Elimination Prep · Math & Speed Coding", href: "/prepare#selection-process" },
  { id: "prep_2", title: "Core Technical & Data Structures (DSA) Round", category: "Prepare", subtitle: "Round 2 Coding Prep · Optimal Space & Time Complexity", href: "/prepare#selection-process" },
  { id: "prep_3", title: "Machine Coding & System Architecture (HLD/LLD)", category: "Prepare", subtitle: "Round 3 Design Prep · Scalability & DB Trade-offs", href: "/prepare#selection-process" },
  { id: "prep_4", title: "Leadership Principles & STAR Behavioral Method", category: "Prepare", subtitle: "Round 4 Fit Prep · Engineering Culture & Situation Stories", href: "/prepare#selection-process" },
  { id: "prep_5", title: "Striver's A2Z DSA Sheet", category: "Prepare", subtitle: "Curated Study Sheet · 450+ Step-by-Step DSA Problems", href: "/prepare#study-sheets" },
  { id: "prep_6", title: "LeetCode Top SQL 50 Study Plan", category: "Prepare", subtitle: "Curated Study Sheet · Window Functions & Joins", href: "/prepare#study-sheets" },
  { id: "prep_7", title: "Engineering Career Ladder & Salary Growth", category: "Prepare", subtitle: "Career Pathway · Fresher to Principal Engineer Bands", href: "/prepare#career-pathways" }
];

type CategoryFilter = "all" | "jobs" | "companies" | "prepare" | "blog";

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Live and local data states
  const [apiJobs, setApiJobs] = useState<SearchJob[]>([]);
  const [apiCompanies, setApiCompanies] = useState<SearchCompany[]>([]);
  const [apiPrep, setApiPrep] = useState<SearchPrep[]>([]);
  const [apiArticles, setApiArticles] = useState<SearchArticle[]>([]);

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jobhighway_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 6));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;
    try {
      setRecentSearches(prev => {
        const next = [clean, ...prev.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
        localStorage.setItem("jobhighway_recent_searches", JSON.stringify(next));
        return next;
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("jobhighway_recent_searches");
    } catch (e) {
      // ignore
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const next = prev.filter(s => s !== term);
      try {
        localStorage.setItem("jobhighway_recent_searches", JSON.stringify(next));
      } catch (err) {
        // ignore
      }
      return next;
    });
  };

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery("");
      setSelectedIndex(0);
      setCategoryFilter("all");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live API search
  useEffect(() => {
    const qTrim = query.trim();
    if (!qTrim) {
      setApiJobs([]);
      setApiCompanies([]);
      setApiPrep([]);
      setApiArticles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/omnisearch?q=${encodeURIComponent(qTrim)}`);
        if (res.ok) {
          const data = await res.json();
          setApiJobs(data.jobs || []);
          setApiCompanies(data.companies || []);
          setApiPrep(data.prep || []);
          setApiArticles(data.articles || []);
        }
      } catch (err) {
        console.warn("Omnisearch fetch failed, using local fallback:", err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Instant local fallbacks (0ms immediate feedback)
  const localResults = useMemo(() => {
    const qLower = query.toLowerCase().trim();
    if (!qLower) return { jobs: [], companies: [], prep: [], articles: [] };

    const jobs = mockJobs
      .filter(j => 
        j.title.toLowerCase().includes(qLower) || 
        j.company.name.toLowerCase().includes(qLower) ||
        (j.skills_required && j.skills_required.some((s: string) => s.toLowerCase().includes(qLower)))
      )
      .slice(0, 5)
      .map(j => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        company: { name: j.company.name, logo_url: j.company.logo_url },
        location: Array.isArray(j.location) ? j.location[0] : (typeof j.location === "string" ? j.location : "Remote"),
        work_mode: j.work_mode || "Full-time",
        job_type: j.job_type,
        source: j.source || "ATS",
      }));

    const companies = mockCompanies
      .filter(c => 
        c.name.toLowerCase().includes(qLower) || 
        (c.industry && c.industry.toLowerCase().includes(qLower)) ||
        (c.headquarters && c.headquarters.toLowerCase().includes(qLower))
      )
      .slice(0, 4)
      .map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        industry: c.industry,
        headquarters: c.headquarters,
        active_job_count: c.active_job_count
      }));

    const prep = PREPARE_ITEMS.filter(item => 
      item.title.toLowerCase().includes(qLower) || 
      item.subtitle.toLowerCase().includes(qLower)
    ).slice(0, 3);

    const articles = BLOG_ARTICLES
      .filter(a => 
        a.title.toLowerCase().includes(qLower) || 
        a.summary.toLowerCase().includes(qLower) ||
        a.category.toLowerCase().includes(qLower)
      )
      .slice(0, 3)
      .map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        readTime: a.readTime,
        summary: a.summary
      }));

    return { jobs, companies, prep, articles };
  }, [query]);

  // Combine API and local results (API takes precedence when loaded)
  const displayJobs = apiJobs.length > 0 ? apiJobs : localResults.jobs;
  const displayCompanies = apiCompanies.length > 0 ? apiCompanies : localResults.companies;
  const displayPrep = apiPrep.length > 0 ? apiPrep : localResults.prep;
  const displayArticles = apiArticles.length > 0 ? apiArticles : localResults.articles;

  // Flatten items for active keyboard navigation
  interface FlatItem {
    type: "action" | "job" | "company" | "prep" | "article";
    id: string;
    title: string;
    subtitle?: string;
    badge?: string;
    href: string;
    icon: any;
    onExecute: () => void;
  }

  const flatItems: FlatItem[] = useMemo(() => {
    const qTrim = query.trim();
    if (!qTrim) return [];

    const list: FlatItem[] = [];

    // 1. Primary Quick Action: Search all jobs
    if (categoryFilter === "all" || categoryFilter === "jobs") {
      list.push({
        type: "action",
        id: "search_all_jobs_" + qTrim,
        title: `Search all live jobs for "${qTrim}"`,
        subtitle: "Filter 62,000+ live verified ATS listings directly",
        badge: "Jobs Feed",
        href: `/?q=${encodeURIComponent(qTrim)}`,
        icon: Search,
        onExecute: () => {
          saveRecentSearch(qTrim);
          window.dispatchEvent(new CustomEvent("jobhighway_omnisearch_query", { detail: { query: qTrim } }));
          router.push(`/?q=${encodeURIComponent(qTrim)}`);
          onClose();
        }
      });
    }

    // 2. Jobs
    if (categoryFilter === "all" || categoryFilter === "jobs") {
      displayJobs.forEach(job => {
        list.push({
          type: "job",
          id: "job_" + (job.slug || job.id),
          title: job.title,
          subtitle: `${job.company.name} · ${Array.isArray(job.location) ? job.location[0] : (job.location || "Remote")} · ${job.work_mode || "Full-time"}`,
          badge: job.source ? `${job.source.toUpperCase()} ATS` : "Direct ATS",
          href: `/jobs/${job.slug || job.id}`,
          icon: Briefcase,
          onExecute: () => {
            saveRecentSearch(job.title);
            router.push(`/jobs/${job.slug || job.id}`);
            onClose();
          }
        });
      });
    }

    // 3. Companies
    if (categoryFilter === "all" || categoryFilter === "companies") {
      displayCompanies.forEach(comp => {
        list.push({
          type: "company",
          id: "comp_" + comp.slug,
          title: comp.name,
          subtitle: `${comp.industry || "Technology"} · ${comp.headquarters || "Global"} · ${(comp.active_job_count || 1)} active openings`,
          badge: "Verified ATS",
          href: `/companies/${comp.slug}`,
          icon: Building2,
          onExecute: () => {
            saveRecentSearch(comp.name);
            router.push(`/companies/${comp.slug}`);
            onClose();
          }
        });
      });
    }

    // 4. Prepare
    if (categoryFilter === "all" || categoryFilter === "prepare") {
      displayPrep.forEach(item => {
        list.push({
          type: "prep",
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          badge: "Study Guide",
          href: item.href,
          icon: GraduationCap,
          onExecute: () => {
            saveRecentSearch(item.title);
            router.push(item.href);
            onClose();
          }
        });
      });
    }

    // 5. Blog
    if (categoryFilter === "all" || categoryFilter === "blog") {
      displayArticles.forEach(art => {
        list.push({
          type: "article",
          id: "art_" + art.slug,
          title: art.title,
          subtitle: `${art.category} · ${art.readTime} · ${art.summary?.slice(0, 90)}...`,
          badge: "Playbook",
          href: `/blog/${art.slug}`,
          icon: BookOpen,
          onExecute: () => {
            saveRecentSearch(art.title);
            router.push(`/blog/${art.slug}`);
            onClose();
          }
        });
      });
    }

    // 6. Secondary Quick Action: Search companies matching
    if (categoryFilter === "all" || categoryFilter === "companies") {
      list.push({
        type: "action",
        id: "search_all_companies_" + qTrim,
        title: `Search companies matching "${qTrim}"`,
        subtitle: "Filter 17,500+ corporate career portals",
        badge: "Companies",
        href: `/companies?q=${encodeURIComponent(qTrim)}`,
        icon: Building2,
        onExecute: () => {
          saveRecentSearch(qTrim);
          window.dispatchEvent(new CustomEvent("jobhighway_omnisearch_company", { detail: { query: qTrim } }));
          router.push(`/companies?q=${encodeURIComponent(qTrim)}`);
          onClose();
        }
      });
    }

    return list;
  }, [query, categoryFilter, displayJobs, displayCompanies, displayPrep, displayArticles, router, onClose, saveRecentSearch]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatItems.length, categoryFilter]);

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (flatItems.length > 0 ? (prev + 1) % flatItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (flatItems.length > 0 ? (prev - 1 + flatItems.length) % flatItems.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatItems.length > 0 && flatItems[selectedIndex]) {
        flatItems[selectedIndex].onExecute();
      } else if (query.trim()) {
        const qTrim = query.trim();
        saveRecentSearch(qTrim);
        window.dispatchEvent(new CustomEvent("jobhighway_omnisearch_query", { detail: { query: qTrim } }));
        router.push(`/?q=${encodeURIComponent(qTrim)}`);
        onClose();
      }
    }
  };

  const handleSelectRecentOrPopular = (term: string, href?: string) => {
    saveRecentSearch(term);
    if (href) {
      if (href.startsWith("/?q=")) {
        window.dispatchEvent(new CustomEvent("jobhighway_omnisearch_query", { detail: { query: term } }));
      } else if (href.startsWith("/companies?q=")) {
        window.dispatchEvent(new CustomEvent("jobhighway_omnisearch_company", { detail: { query: term } }));
      }
      router.push(href);
      onClose();
    } else {
      setQuery(term);
    }
  };

  if (!isOpen) return null;

  const totalResultsCount = displayJobs.length + displayCompanies.length + displayPrep.length + displayArticles.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-16 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex items-center gap-3 bg-white">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-teal-600 animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search verified jobs, companies, interview prep, or study sheets..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 shadow-2xs">
            ESC
          </kbd>

          {/* Dedicated Close Button for Mobile & Touch Devices */}
          <button
            onClick={onClose}
            className="p-1.5 -mr-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Close search (Esc)"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills (Visible when typing) */}
        {query.trim() && (
          <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: "all", label: "All Results", count: totalResultsCount },
              { id: "jobs", label: "Jobs", count: displayJobs.length },
              { id: "companies", label: "Companies", count: displayCompanies.length },
              { id: "prepare", label: "Prepare", count: displayPrep.length },
              { id: "blog", label: "Blog", count: displayArticles.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as CategoryFilter)}
                className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  categoryFilter === tab.id
                    ? "bg-teal-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    categoryFilter === tab.id ? "bg-teal-700 text-teal-100" : "bg-slate-200 text-slate-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Results Body */}
        <div ref={listRef} className="p-2 sm:p-3 overflow-y-auto flex-1 space-y-1">
          {query.trim() === "" ? (
            /* Empty State: Recent Searches + Quick Jump Suggestions */
            <div className="py-4 sm:py-6 px-3 space-y-6">
              {/* Recent Searches (if available) */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                    <span className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectRecentOrPopular(term, `/?q=${encodeURIComponent(term)}`)}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-200 text-slate-700 hover:text-teal-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-slate-400 group-hover:text-teal-500" />
                        <span>{term}</span>
                        <span
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-slate-400 hover:text-rose-500 ml-0.5 p-0.5 rounded"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Job Roles */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  Popular Job Searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Software Engineer",
                    "Data Analyst",
                    "Frontend Developer",
                    "Full Stack Developer",
                    "DevOps Engineer",
                    "Product Manager"
                  ].map((role, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectRecentOrPopular(role, `/?q=${encodeURIComponent(role)}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200/80 hover:border-teal-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Verified Companies */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Verified Corporate Portals
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: "Google", slug: "google", openings: 154 },
                    { name: "Microsoft", slug: "microsoft", openings: 92 },
                    { name: "Postman", slug: "postman", openings: 67 },
                    { name: "Groww", slug: "groww", openings: 7 },
                    { name: "Stripe", slug: "stripe", openings: 38 },
                    { name: "Cloudflare", slug: "cloudflare", openings: 351 }
                  ].map((comp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectRecentOrPopular(comp.name, `/companies/${comp.slug}`)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-200 hover:bg-teal-50/50 text-left transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{comp.name}</div>
                        <div className="text-[11px] text-slate-500">{comp.openings} active jobs</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Study Sheets & Guides */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                  Curated Prep & Playbooks
                </p>
                <div className="space-y-1.5">
                  {[
                    { title: "Striver's A2Z DSA Sheet (450+ Problems)", href: "/prepare#study-sheets", badge: "Sheet" },
                    { title: "LeetCode Top SQL 50 Study Plan", href: "/prepare#study-sheets", badge: "SQL" },
                    { title: "Crack Off-Campus Hiring 2026: The Complete Guide", href: "/blog/crack-off-campus-hiring-2026", badge: "Playbook" }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectRecentOrPopular(item.title, item.href)}
                      className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 text-left transition-colors cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800 hover:text-teal-700 truncate">{item.title}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : flatItems.length > 0 ? (
            /* Results List */
            flatItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={item.onExecute}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                    isSelected 
                      ? "bg-teal-50/80 border-teal-200 shadow-2xs" 
                      : "bg-white hover:bg-slate-50/80 border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-teal-600 text-white border-teal-700"
                        : "bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-teal-50 group-hover:text-teal-700 group-hover:border-teal-200"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                          isSelected ? "text-teal-900" : "text-slate-900 group-hover:text-teal-700"
                        }`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border shrink-0 ${
                            isSelected 
                              ? "bg-teal-100 text-teal-800 border-teal-200" 
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className={`text-xs truncate mt-0.5 ${
                          isSelected ? "text-teal-700/90" : "text-slate-500"
                        }`}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 transition-all shrink-0 ${
                    isSelected 
                      ? "text-teal-600 translate-x-1" 
                      : "text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5"
                  }`} />
                </button>
              );
            })
          ) : (
            /* No Results Fallback */
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  No direct matches for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try searching with broader role titles like &quot;Software Engineer&quot;, &quot;Data Analyst&quot;, or press Enter to search the entire live job feed.
                </p>
              </div>
              <button
                onClick={() => {
                  const qTrim = query.trim();
                  saveRecentSearch(qTrim);
                  window.dispatchEvent(new CustomEvent("jobhighway_omnisearch_query", { detail: { query: qTrim } }));
                  router.push(`/?q=${encodeURIComponent(qTrim)}`);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Live Jobs Feed for &ldquo;{query}&rdquo;</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 shadow-2xs">↑</kbd>
              <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 shadow-2xs">↓</kbd>
              <span className="text-slate-400 ml-0.5">navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 shadow-2xs">↵</kbd>
              <span className="text-slate-400 ml-0.5">select</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 shadow-2xs">esc</kbd>
              <span className="text-slate-400 ml-0.5">close</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-teal-700 font-medium">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>JobHighway Omni-Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
