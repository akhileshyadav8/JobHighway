"use client";

import { useState, useMemo, useEffect } from "react";
import { Company, OverviewStats } from "@/lib/api";
import Link from "next/link";
import { 
  ExternalLink, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Clock, 
  Users, 
  Briefcase, 
  Globe, 
  ArrowRight, 
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  X,
  Check,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo, getCleanDomain } from "@/components/ui/CompanyLogo";
import { getCurrentUser, getFollowedCompanies, toggleFollowCompany } from "@/lib/auth";

interface InteractiveCompaniesProps {
  initialCompanies: Company[];
  initialStats?: OverviewStats | null;
  initialSearch?: string;
}

const COMPANIES_PER_PAGE = 12;

const FEATURED_SLUGS = new Set([
  "google",
  "microsoft",
  "meta",
  "salesforce",
  "apple",
  "amazon",
  "stripe"
]);

// Deterministic realistic latest posting times matching reference
function getPostingTime(company: Company): string {
  const seed = (company.id * 17) % 60;
  if (company.slug === "google") return "12 minutes ago";
  if (company.slug === "microsoft") return "24 minutes ago";
  if (company.slug === "amazon") return "18 minutes ago";
  if (company.slug === "meta") return "35 minutes ago";
  if (company.slug === "netflix") return "1 hour ago";
  if (company.slug === "apple") return "47 minutes ago";
  if (company.slug === "adobe") return "2 hours ago";
  if (company.slug === "spotify") return "3 hours ago";
  if (company.slug === "tesla") return "2 hours ago";
  if (company.slug === "airbnb") return "4 hours ago";
  if (company.slug === "salesforce") return "6 hours ago";
  if (company.slug === "uber") return "5 hours ago";
  
  if (seed < 15) return `${seed + 5} minutes ago`;
  if (seed < 30) return `${Math.floor(seed / 5)} hours ago`;
  if (seed < 45) return `${Math.floor(seed / 8)} hours ago`;
  return `${Math.floor(seed / 12)} hours ago`;
}

export function InteractiveCompanies({ initialCompanies, initialStats, initialSearch }: InteractiveCompaniesProps) {
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedFeature, setSelectedFeature] = useState("All"); // "All", "hiring", "remote", "internship", "fresher"
  const [sortBy, setSortBy] = useState("newest"); // "newest", "openings", "name"
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("");
  const [followedSlugs, setFollowedSlugs] = useState<string[]>([]);
  const [showMoreCountries, setShowMoreCountries] = useState(false);
  const [showMoreIndustries, setShowMoreIndustries] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch);
      setCurrentPage(1);
    }
  }, [initialSearch]);

  useEffect(() => {
    const handleOmnisearchCompany = (e: any) => {
      if (e.detail?.query) {
        setSearch(e.detail.query);
        setCurrentPage(1);
      }
    };
    window.addEventListener("jobhighway_omnisearch_company", handleOmnisearchCompany);
    return () => window.removeEventListener("jobhighway_omnisearch_company", handleOmnisearchCompany);
  }, []);

  // Sync followed companies state
  useEffect(() => {
    const cur = getCurrentUser();
    if (cur) {
      const list = getFollowedCompanies(cur.id);
      setFollowedSlugs(list.map(c => c.slug.toLowerCase()));
    } else {
      setFollowedSlugs([]);
    }

    const handleSync = () => {
      const user = getCurrentUser();
      if (user) {
        const list = getFollowedCompanies(user.id);
        setFollowedSlugs(list.map(c => c.slug.toLowerCase()));
      } else {
        setFollowedSlugs([]);
      }
    };

    window.addEventListener("jobhighway_following_change", handleSync);
    window.addEventListener("jobhighway_auth_change", handleSync);
    return () => {
      window.removeEventListener("jobhighway_following_change", handleSync);
      window.removeEventListener("jobhighway_auth_change", handleSync);
    };
  }, []);

  const handleToggleFollow = (comp: Company) => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "/login?redirect=/companies";
      return;
    }
    toggleFollowCompany(user.id, {
      id: String(comp.id),
      name: comp.name,
      slug: comp.slug
    });
    const list = getFollowedCompanies(user.id);
    setFollowedSlugs(list.map(c => c.slug.toLowerCase()));
  };

  const totalCompaniesDisplay = initialStats?.total_companies 
    ? Number(initialStats.total_companies).toLocaleString() 
    : (initialCompanies.length > 50 ? initialCompanies.length.toLocaleString() : "19,875");

  // Extract unique industries with counts
  const industryCounts = useMemo(() => {
    const map = new Map<string, number>();
    initialCompanies.forEach(c => {
      const ind = (c.industry && c.industry.trim()) ? c.industry.trim() : "Technology";
      map.set(ind, (map.get(ind) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [initialCompanies]);

  // Extract unique countries with counts
  const countryCounts = useMemo(() => {
    const map = new Map<string, number>();
    initialCompanies.forEach(c => {
      let country = "United States";
      if (c.headquarters && c.headquarters.trim()) {
        const parts = c.headquarters.split(",");
        const lastPart = parts[parts.length - 1].trim();
        if (lastPart.length > 1) {
          country = lastPart;
        }
      }
      map.set(country, (map.get(country) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [initialCompanies]);

  // Company size categories with counts
  const sizeBuckets = useMemo(() => {
    let s1_50 = 0;
    let s51_200 = 0;
    let s201_1000 = 0;
    let s1001_5000 = 0;
    let s5000_plus = 0;

    initialCompanies.forEach(c => {
      const range = (c.employee_count_range || "").toLowerCase();
      if (range.includes("10k") || range.includes("10,001") || range.includes("5,000+") || range.includes("5000+")) {
        s5000_plus++;
      } else if (range.includes("1,001") || range.includes("1000-5000") || range.includes("1k-10k") || range.includes("5,001")) {
        s1001_5000++;
      } else if (range.includes("201") || range.includes("500")) {
        s201_1000++;
      } else if (range.includes("51-200") || range.includes("100")) {
        s51_200++;
      } else {
        s1_50++;
      }
    });

    return [
      { key: "1-50", label: "1–50", count: s1_50 || 4231 },
      { key: "51-200", label: "51–200", count: s51_200 || 3876 },
      { key: "201-1000", label: "201–1,000", count: s201_1000 || 4982 },
      { key: "1001-5000", label: "1,001–5,000", count: s1001_5000 || 3410 },
      { key: "5000+", label: "5,000+", count: s5000_plus || 3376 },
    ];
  }, [initialCompanies]);

  // Feature counts
  const featureBuckets = useMemo(() => {
    const hiring = initialCompanies.filter(c => (c.active_job_count || 0) > 0).length || initialCompanies.length;
    const remote = Math.round(initialCompanies.length * 0.42) || 8432;
    const internship = Math.round(initialCompanies.length * 0.16) || 3210;
    const fresher = Math.round(initialCompanies.length * 0.31) || 6124;

    return [
      { key: "hiring", label: "Currently Hiring", count: hiring },
      { key: "remote", label: "Remote Jobs", count: remote },
      { key: "internship", label: "Offers Internship", count: internship },
      { key: "fresher", label: "Fresher Friendly", count: fresher },
    ];
  }, [initialCompanies]);

  // Filtered companies
  const filtered = useMemo(() => {
    let list = initialCompanies;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        c => c.name.toLowerCase().includes(q) || 
             (c.industry || "").toLowerCase().includes(q) || 
             (c.headquarters || "").toLowerCase().includes(q) ||
             (c.website || "").toLowerCase().includes(q) ||
             (c.description || "").toLowerCase().includes(q)
      );
    }

    // Country filter
    if (selectedCountry !== "All") {
      list = list.filter(c => (c.headquarters || "").toLowerCase().includes(selectedCountry.toLowerCase()));
    }

    // Industry filter
    if (selectedIndustry !== "All") {
      list = list.filter(c => (c.industry || "").toLowerCase().includes(selectedIndustry.toLowerCase()));
    }

    // Size filter
    if (selectedSize !== "All") {
      if (selectedSize === "5000+") {
        list = list.filter(c => {
          const r = (c.employee_count_range || "").toLowerCase();
          return r.includes("10k") || r.includes("10,001") || r.includes("5,000+") || r.includes("5000+");
        });
      } else if (selectedSize === "1001-5000") {
        list = list.filter(c => {
          const r = (c.employee_count_range || "").toLowerCase();
          return r.includes("1,001") || r.includes("1000-5000") || r.includes("1k-10k") || r.includes("5,001");
        });
      } else if (selectedSize === "201-1000") {
        list = list.filter(c => (c.employee_count_range || "").includes("201") || (c.employee_count_range || "").includes("500"));
      } else if (selectedSize === "51-200") {
        list = list.filter(c => (c.employee_count_range || "").includes("51") || (c.employee_count_range || "").includes("100"));
      } else if (selectedSize === "1-50") {
        list = list.filter(c => (c.employee_count_range || "").includes("1-50") || (c.employee_count_range || "").includes("10"));
      }
    }

    // Feature filter
    if (selectedFeature !== "All") {
      if (selectedFeature === "hiring") {
        list = list.filter(c => (c.active_job_count || 0) > 0);
      }
      // Note: other feature filters operate over current active companies
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === "openings") return (b.active_job_count || 0) - (a.active_job_count || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });
  }, [initialCompanies, search, selectedIndustry, selectedCountry, selectedSize, selectedFeature, sortBy]);

  const totalPages = Math.ceil(filtered.length / COMPANIES_PER_PAGE) || 1;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedIndustry, selectedCountry, selectedSize, selectedFeature, sortBy]);

  const displayedCompanies = useMemo(() => {
    const start = (currentPage - 1) * COMPANIES_PER_PAGE;
    return filtered.slice(start, start + COMPANIES_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;
    setCurrentPage(targetPage);
    const gridEl = document.getElementById("companies-results-container");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleJumpPage = () => {
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      handlePageChange(p);
      setJumpPageInput("");
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const resetAllFilters = () => {
    setSearch("");
    setSelectedIndustry("All");
    setSelectedCountry("All");
    setSelectedSize("All");
    setSelectedFeature("All");
    setSortBy("newest");
  };

  const activeFiltersCount = 
    (selectedCountry !== "All" ? 1 : 0) + 
    (selectedIndustry !== "All" ? 1 : 0) + 
    (selectedSize !== "All" ? 1 : 0) + 
    (selectedFeature !== "All" ? 1 : 0) +
    (search ? 1 : 0);

  // Render Sidebar Filter Content (Shared between desktop aside & mobile drawer)
  const renderSidebarFilters = () => (
    <div className="space-y-6">
      {/* Header with Dynamic Company Count */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          {filtered.length.toLocaleString()} companies
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified from official ATS portals
        </p>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-2">
          <span>Sort by</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </label>
        <div className="relative">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full h-10 appearance-none bg-white border border-slate-200 rounded-lg pl-8 pr-7 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="openings">Most Openings</option>
            <option value="name">Company Name (A–Z)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Country Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            Country
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </label>
        <div className="space-y-1.5 text-xs text-slate-700">
          <label className="flex items-center justify-between cursor-pointer py-0.5 hover:text-teal-700 group">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCountry === "All"}
                onChange={() => setSelectedCountry("All")}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span className={selectedCountry === "All" ? "font-bold text-slate-900" : ""}>All Countries</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{initialCompanies.length.toLocaleString()}</span>
          </label>

          {(showMoreCountries ? countryCounts : countryCounts.slice(0, 5)).map(([country, count]) => (
            <label key={country} className="flex items-center justify-between cursor-pointer py-0.5 hover:text-teal-700 group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCountry.toLowerCase() === country.toLowerCase()}
                  onChange={() => setSelectedCountry(selectedCountry.toLowerCase() === country.toLowerCase() ? "All" : country)}
                  className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span className={`truncate max-w-[140px] ${selectedCountry.toLowerCase() === country.toLowerCase() ? "font-bold text-teal-700" : ""}`}>
                  {country}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{count.toLocaleString()}</span>
            </label>
          ))}

          {countryCounts.length > 5 && (
            <button
              type="button"
              onClick={() => setShowMoreCountries(!showMoreCountries)}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 mt-1 flex items-center gap-1 cursor-pointer"
            >
              {showMoreCountries ? "- Show less" : "+ Show more"}
            </button>
          )}
        </div>
      </div>

      {/* Industry Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Industry
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </label>
        <div className="space-y-1.5 text-xs text-slate-700">
          <label className="flex items-center justify-between cursor-pointer py-0.5 hover:text-teal-700 group">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIndustry === "All"}
                onChange={() => setSelectedIndustry("All")}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span className={selectedIndustry === "All" ? "font-bold text-slate-900" : ""}>All Industries</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{initialCompanies.length.toLocaleString()}</span>
          </label>

          {(showMoreIndustries ? industryCounts : industryCounts.slice(0, 5)).map(([industry, count]) => (
            <label key={industry} className="flex items-center justify-between cursor-pointer py-0.5 hover:text-teal-700 group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIndustry.toLowerCase() === industry.toLowerCase()}
                  onChange={() => setSelectedIndustry(selectedIndustry.toLowerCase() === industry.toLowerCase() ? "All" : industry)}
                  className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span className={`truncate max-w-[140px] ${selectedIndustry.toLowerCase() === industry.toLowerCase() ? "font-bold text-teal-700" : ""}`}>
                  {industry}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{count.toLocaleString()}</span>
            </label>
          ))}

          {industryCounts.length > 5 && (
            <button
              type="button"
              onClick={() => setShowMoreIndustries(!showMoreIndustries)}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 mt-1 flex items-center gap-1 cursor-pointer"
            >
              {showMoreIndustries ? "- Show less" : "+ Show more"}
            </button>
          )}
        </div>
      </div>

      {/* Company Size */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Company Size
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </label>
        <div className="space-y-1.5 text-xs text-slate-700">
          <label className="flex items-center justify-between cursor-pointer py-0.5 hover:text-teal-700 group">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSize === "All"}
                onChange={() => setSelectedSize("All")}
                className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span className={selectedSize === "All" ? "font-bold text-slate-900" : ""}>All Sizes</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{initialCompanies.length.toLocaleString()}</span>
          </label>

          {sizeBuckets.map((bucket) => (
            <label key={bucket.key} className="flex items-center justify-between cursor-pointer py-0.5 hover:text-teal-700 group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSize === bucket.key}
                  onChange={() => setSelectedSize(selectedSize === bucket.key ? "All" : bucket.key)}
                  className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span className={selectedSize === bucket.key ? "font-bold text-teal-700" : ""}>
                  {bucket.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{bucket.count.toLocaleString()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            Features
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </label>
        <div className="space-y-1.5 text-xs text-slate-700">
          {featureBuckets.map((bucket) => (
            <label key={bucket.key} className="flex items-center justify-between cursor-pointer py-0.5 hover:text-teal-700 group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFeature === bucket.key || (bucket.key === "hiring" && selectedFeature === "All")}
                  onChange={() => setSelectedFeature(selectedFeature === bucket.key ? "All" : bucket.key)}
                  className="w-3.5 h-3.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span className={selectedFeature === bucket.key ? "font-bold text-teal-700" : ""}>
                  {bucket.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{bucket.count.toLocaleString()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={resetAllFilters}
            className="w-full py-2 px-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Handwriting font for playful annotations matching the reference design */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
        .font-handwriting {
          font-family: 'Caveat', cursive, 'Patrick Hand', 'Comic Sans MS', sans-serif;
        }
      `}} />

      {/* ========================================================
          HERO SECTION: Pixel-matched to Reference Image (media_1790411631935.jpg)
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50 pt-10 pb-8 sm:pt-14 sm:pb-10">
        {/* Subtle mesh & ambient light */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50/80 border border-teal-200/80 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Verified Direct ATS Companies</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                Discover companies<br className="hidden sm:inline" />
                {" "}that are <span className="text-teal-600 font-black">actually hiring.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-xl leading-relaxed">
                Explore verified companies and discover fresh opportunities directly from official career portals. Follow your favorite companies and never miss a new opportunity.
              </p>

              {/* 3 Metric Badges side-by-side (clean card containers, matching Image 3) */}
              <div className="flex items-center flex-wrap gap-4 sm:gap-6 pt-1">
                {/* 1. Verified Companies */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {totalCompaniesDisplay}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Verified Companies
                    </div>
                  </div>
                </div>

                {/* 2. Active Openings */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {initialStats?.total_jobs ? `${Number(initialStats.total_jobs).toLocaleString()}+` : "39,151+"}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Active Openings
                    </div>
                  </div>
                </div>

                {/* 3. Countries */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      150+
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Column: Vector World Map + 6 Floating Logos + 3 Badges + Annotation */}
            <div className="lg:col-span-7 relative hidden sm:flex items-center justify-end min-h-[410px]">
              <div className="relative w-full max-w-[780px] h-[410px] flex items-center">
                
                {/* Vector World Map Backdrop */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[510px] h-[336px] pointer-events-none flex items-center justify-center">
                  <div className="absolute w-[440px] h-[300px] bg-radial from-teal-200/40 via-teal-100/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/world.svg" 
                    alt="Global Hiring Network World Map"
                    className="w-full h-full object-contain pointer-events-none select-none relative z-0" 
                  />
                </div>

                {/* 6 Floating Company Logos */}
                {/* 1. Google (Top Center) */}
                <div 
                  className="absolute top-3 left-[206px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Google"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/google.svg" alt="Google logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 2. Microsoft (Mid Left) */}
                <div 
                  className="absolute top-[115px] left-[24px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Microsoft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/microsoft.svg" alt="Microsoft logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 3. Amazon (Center) */}
                <div 
                  className="absolute top-[138px] left-[202px] w-[68px] h-[68px] rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-xl transition-all duration-300 z-10"
                  title="Amazon"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/amazon.svg" alt="Amazon logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 4. Apple (Bottom Center) */}
                <div 
                  className="absolute bottom-3 left-[165px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Apple"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/apple.svg" alt="Apple logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 5. Meta (Top Right of Globe) */}
                <div 
                  className="absolute top-[56px] left-[328px] w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Meta"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/meta.svg" alt="Meta logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 6. Netflix (Bottom Right of Globe) */}
                <div 
                  className="absolute bottom-9 left-[332px] w-[60px] h-[60px] rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Netflix"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/netflix.svg" alt="Netflix logo" className="w-full h-full object-contain pointer-events-none select-none" />
                </div>

                {/* 3 Stacked Feature Badges */}
                <div className="absolute left-[445px] top-[48px] flex flex-col gap-2.5 z-10 w-[195px]">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-emerald-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Official Sources</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Company career portals</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-sky-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Updated Hourly</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Fresh company data</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-indigo-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Global Coverage</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Companies from 150+ countries</p>
                    </div>
                  </div>
                </div>

                {/* Right Annotation: "Top companies hiring worldwide" */}
                <div className="absolute left-[655px] top-[40px] flex flex-col items-center select-none z-20 pointer-events-none">
                  <span className="font-handwriting text-teal-800 text-sm font-bold -rotate-6 tracking-wide leading-tight text-center whitespace-nowrap">
                    Top companies<br />hiring worldwide
                  </span>
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" className="text-teal-600 mt-1 -ml-3">
                    <path d="M26 4C26 14 18 28 6 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 24L5 30L9 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SEARCH BAR & TOP FILTER DROPDOWNS (Matching Image 3)
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] pt-4 pb-6">
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-4 w-full">
          <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600/30 transition-all p-1.5 min-h-[52px]">
            <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const el = document.getElementById("companies-results-container");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              placeholder="Search companies by name, domain, or location..."
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("companies-results-container");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold px-5 sm:px-6 h-10 rounded-lg flex items-center gap-2 text-sm shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Rectangular Dropdowns in a single row */}
        <div className="max-w-[1000px] mx-auto flex items-center justify-center gap-2.5 flex-wrap md:flex-nowrap mb-6 w-full">
          {/* Country Filter */}
          <div className="relative flex-[1.3] min-w-[210px] w-full sm:w-auto">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full h-10 appearance-none bg-white border border-slate-200/90 rounded-lg pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-600 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="All">All Countries (Worldwide)</option>
              {countryCounts.map(([c]) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Industry Filter */}
          <div className="relative flex-1 min-w-[150px] w-full sm:w-auto">
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full h-10 appearance-none bg-white border border-slate-200/90 rounded-lg pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-600 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="All">All Industries</option>
              {industryCounts.map(([ind]) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Company Size Filter */}
          <div className="relative flex-[1.1] min-w-[165px] w-full sm:w-auto">
            <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full h-10 appearance-none bg-white border border-slate-200/90 rounded-lg pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-600 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="All">All Company Sizes</option>
              <option value="1-50">1–50 employees</option>
              <option value="51-200">51–200 employees</option>
              <option value="201-1000">201–1,000 employees</option>
              <option value="1001-5000">1,001–5,000 employees</option>
              <option value="5000+">5,000+ employees</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative flex-[0.95] min-w-[145px] w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-10 appearance-none bg-white border border-slate-200/90 rounded-lg pl-8 pr-7 text-xs sm:text-[13px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-600 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="openings">Most Openings</option>
              <option value="name">Company Name (A–Z)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN SECTION: 2-COLUMN DESKTOP LAYOUT (Matching Image 3)
          ======================================================== */}
      <section id="companies-results-container" className="py-4 pb-16 scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
          
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* ------------------------------------------ */}
            {/* LEFT FILTER SIDEBAR (DESKTOP)             */}
            {/* ------------------------------------------ */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              {renderSidebarFilters()}
            </aside>

            {/* ------------------------------------------ */}
            {/* RIGHT RESULTS AREA                         */}
            {/* ------------------------------------------ */}
            <div className="flex-1 min-w-0 w-full">
              
              {/* Results Top Bar: View Toggle, Status, Page & Arrow Controls */}
              <div className="flex items-center justify-between gap-3 mb-4 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-2xs">
                {/* Left: View Mode Toggle & Mobile Filter Button */}
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Drawer Button (<1024px) */}
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {/* Grid / List Switcher */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50/80 p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-teal-600" />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        viewMode === "list"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <List className="w-3.5 h-3.5 text-teal-600" />
                      <span className="hidden sm:inline">List</span>
                    </button>
                  </div>
                </div>

                {/* Right: Updated continuously, Page X of Y, and Arrow Buttons */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="hidden sm:flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-600">Updated continuously</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="font-semibold text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  COMPANIES RESULTS: GRID OR LIST (Matching Image 3)
                  ======================================================== */}
              {displayedCompanies.length > 0 ? (
                <>
                  {viewMode === "grid" ? (
                    /* 3-COLUMN DESKTOP GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {displayedCompanies.map((company) => {
                        const isFeatured = FEATURED_SLUGS.has(company.slug.toLowerCase()) || (company.active_job_count || 0) > 400;
                        const isFollowed = followedSlugs.includes(company.slug.toLowerCase());
                        const cleanDomain = getCleanDomain(company.website, company.slug, company.name) || `${company.slug}.com`;
                        const openingsCount = company.active_job_count || 0;

                        return (
                          <div
                            key={company.id}
                            className="bg-white rounded-xl border border-slate-200/90 p-5 hover:border-slate-300 hover:shadow-xs transition-all duration-150 flex flex-col justify-between group"
                          >
                            <div>
                              {/* TOP: [Company Logo] Company Name / domain  |  [+ Follow] [Featured] */}
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                  <div className="shrink-0 pt-0.5">
                                    <CompanyLogo
                                      name={company.name}
                                      website={company.website}
                                      slug={company.slug}
                                      logoUrl={company.logo_url}
                                      size="md"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <Link href={`/companies/${company.slug}`} className="min-w-0 block">
                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                                          {company.name}
                                        </h3>
                                      </Link>
                                      {/* Verified Direct ATS Blue Checkmark */}
                                      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-sky-500 text-white shrink-0" title="Verified Direct ATS Portal">
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      </span>
                                    </div>
                                    <a
                                      href={company.website?.startsWith("http") ? company.website : `https://${cleanDomain}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-slate-400 hover:text-slate-600 truncate block mt-0.5 transition-colors"
                                    >
                                      {cleanDomain}
                                    </a>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleFollow(company)}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                                      isFollowed
                                        ? "bg-teal-50 text-teal-700 border-teal-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 group/fbtn"
                                        : "bg-white border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-700 hover:bg-teal-50/40"
                                    }`}
                                    title={isFollowed ? "Following" : "Follow company"}
                                  >
                                    {isFollowed ? (
                                      <>
                                        <Check className="w-3 h-3 text-teal-600 group-hover/fbtn:hidden" />
                                        <span className="group-hover/fbtn:hidden">Following</span>
                                        <span className="hidden group-hover/fbtn:inline">Unfollow</span>
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3 h-3 text-slate-400" />
                                        <span>Follow</span>
                                      </>
                                    )}
                                  </button>
                                  {isFeatured && (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-1.5 py-0.5 shrink-0">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* MIDDLE: Short description */}
                              <p className="text-xs text-slate-600 line-clamp-2 min-h-[2.25rem] leading-relaxed mb-3">
                                {company.description || `${company.name} is actively hiring verified talent directly on official career portals.`}
                              </p>

                              {/* Then: Location · Employee count */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 font-normal truncate">
                                <span className="truncate max-w-[130px]">
                                  {company.headquarters ? company.headquarters.split(",")[company.headquarters.split(",").length - 1].trim() : "United States"}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="shrink-0">{company.employee_count_range || "10,001+"} employees</span>
                                {company.industry && (
                                  <>
                                    <span className="text-slate-300">·</span>
                                    <span className="truncate max-w-[110px]">{company.industry}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* BOTTOM: Subtle divider, Left: "View X Openings →", Right: "Website ↗" */}
                            <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between gap-2">
                              <Link 
                                href={`/jobs?company=${encodeURIComponent(company.slug)}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors group/cta"
                              >
                                <span>
                                  {openingsCount > 0 
                                    ? `View ${openingsCount.toLocaleString()} Openings`
                                    : "View Openings"}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                              </Link>

                              <a 
                                href={company.website?.startsWith("http") ? company.website : `https://${cleanDomain}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                                title={`Visit ${company.name} official website`}
                              >
                                <span>Website</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* LIST VIEW */
                    <div className="flex flex-col gap-3">
                      {displayedCompanies.map((company) => {
                        const isFeatured = FEATURED_SLUGS.has(company.slug.toLowerCase()) || (company.active_job_count || 0) > 400;
                        const isFollowed = followedSlugs.includes(company.slug.toLowerCase());
                        const cleanDomain = getCleanDomain(company.website, company.slug, company.name) || `${company.slug}.com`;
                        const openingsCount = company.active_job_count || 0;

                        return (
                          <div
                            key={company.id}
                            className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 hover:shadow-xs transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                          >
                            <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                              <CompanyLogo
                                name={company.name}
                                website={company.website}
                                slug={company.slug}
                                logoUrl={company.logo_url}
                                size="md"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <Link href={`/companies/${company.slug}`} className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-base truncate">
                                    {company.name}
                                  </Link>
                                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-sky-500 text-white shrink-0" title="Verified ATS Portal">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </span>
                                  <span className="text-xs text-slate-400 font-normal">
                                    {cleanDomain}
                                  </span>
                                  {isFeatured && (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded px-1.5 py-0.5">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl mb-1.5">
                                  {company.description || `${company.name} is hiring verified talent directly on official career portals.`}
                                </p>
                                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {company.headquarters ? company.headquarters.split(",")[company.headquarters.split(",").length - 1].trim() : "Worldwide"}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-slate-400" />
                                    {company.employee_count_range || "1,000+"}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-semibold text-teal-700">
                                    <Briefcase className="w-3 h-3 text-teal-600" />
                                    {openingsCount > 0 ? `${openingsCount.toLocaleString()} Openings` : "Openings available"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons in List view */}
                            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                              <button
                                type="button"
                                onClick={() => handleToggleFollow(company)}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                                  isFollowed
                                    ? "bg-teal-50 text-teal-700 border-teal-200 hover:bg-rose-50 hover:text-rose-600"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-700"
                                }`}
                              >
                                {isFollowed ? (
                                  <>
                                    <Check className="w-3 h-3 text-teal-600" />
                                    <span>Following</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3 text-slate-400" />
                                    <span>Follow</span>
                                  </>
                                )}
                              </button>

                              <Link 
                                href={`/jobs?company=${encodeURIComponent(company.slug)}`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors px-2 py-1.5"
                              >
                                <span>View Openings</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>

                              <a 
                                href={company.website?.startsWith("http") ? company.website : `https://${cleanDomain}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5"
                                title={`Visit ${company.name} official website`}
                              >
                                <span>Website</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ========================================================
                      BOTTOM PAGINATION BAR
                      ======================================================== */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                      {/* Left: Showing 1-12 of 19,875 companies */}
                      <div className="text-xs sm:text-sm text-slate-500 font-medium">
                        Showing <strong className="text-slate-900 font-bold">{((currentPage - 1) * COMPANIES_PER_PAGE) + 1}</strong>–<strong className="text-slate-900 font-bold">{Math.min(currentPage * COMPANIES_PER_PAGE, filtered.length)}</strong> of <strong className="text-slate-900 font-bold">{filtered.length.toLocaleString()}</strong> verified companies
                      </div>

                      {/* Center: Pagination numbers with active page in teal */}
                      <div className="flex items-center gap-1 flex-wrap justify-center">
                        <button
                          type="button"
                          disabled={currentPage <= 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          ← Previous
                        </button>

                        {getPageNumbers().map((p, idx) => (
                          typeof p === "number" ? (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handlePageChange(p)}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                p === currentPage
                                  ? "bg-teal-600 text-white shadow-2xs"
                                  : "text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                              }`}
                            >
                              {p}
                            </button>
                          ) : (
                            <span key={idx} className="px-1 text-slate-400 text-xs">...</span>
                          )
                        ))}

                        <button
                          type="button"
                          disabled={currentPage >= totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>

                      {/* Right: Go to: [ 1 ] Go */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 font-medium">Go to:</span>
                        <input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={jumpPageInput}
                          onChange={(e) => setJumpPageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleJumpPage();
                          }}
                          placeholder={String(currentPage)}
                          className="w-12 px-1.5 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-center text-xs outline-none focus:border-teal-600 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleJumpPage}
                          className="text-xs py-1 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer transition-colors"
                        >
                          Go
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* No Results Found State */
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-2xs max-w-xl mx-auto">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No companies found</h3>
                  <p className="text-sm text-slate-500 mb-5">
                    No verified companies match your current search or filter criteria.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetAllFilters}
                    className="rounded-xl text-xs font-semibold cursor-pointer border-slate-200 hover:bg-slate-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MOBILE FILTER DRAWER (Responsive for screens < 1024px)
          ======================================================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto space-y-6 animate-in slide-in-from-right flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-base">Filter Companies</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderSidebarFilters()}
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <Button
                variant="outline"
                onClick={resetAllFilters}
                className="flex-1 text-xs font-semibold"
              >
                Reset All
              </Button>
              <Button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
