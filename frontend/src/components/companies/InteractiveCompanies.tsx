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
  Search,
  ArrowUpDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo, getCleanDomain } from "@/components/ui/CompanyLogo";

interface InteractiveCompaniesProps {
  initialCompanies: Company[];
  initialStats?: OverviewStats | null;
}

const COMPANIES_PER_PAGE = 12;

export function InteractiveCompanies({ initialCompanies, initialStats }: InteractiveCompaniesProps) {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "openings", "name"
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("");

  const totalCompaniesCount = initialStats?.total_companies || initialCompanies.length || 17584;

  // Extract unique industries for filter dropdown
  const industries = useMemo(() => {
    const set = new Set<string>();
    initialCompanies.forEach(c => {
      if (c.industry && c.industry.trim()) set.add(c.industry.trim());
    });
    return Array.from(set).sort();
  }, [initialCompanies]);

  // Extract unique countries / primary locations
  const countries = useMemo(() => {
    const set = new Set<string>();
    initialCompanies.forEach(c => {
      if (c.headquarters && c.headquarters.trim()) {
        const parts = c.headquarters.split(",");
        const lastPart = parts[parts.length - 1].trim();
        if (lastPart && lastPart.length > 1) {
          set.add(lastPart);
        }
      }
    });
    return Array.from(set).sort();
  }, [initialCompanies]);

  const filtered = useMemo(() => {
    let list = initialCompanies;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        c => c.name.toLowerCase().includes(q) || 
             (c.industry || "").toLowerCase().includes(q) || 
             (c.headquarters || "").toLowerCase().includes(q) ||
             (c.website || "").toLowerCase().includes(q)
      );
    }

    // Industry filter
    if (selectedIndustry !== "All") {
      list = list.filter(c => (c.industry || "").toLowerCase() === selectedIndustry.toLowerCase());
    }

    // Country filter
    if (selectedCountry !== "All") {
      list = list.filter(c => (c.headquarters || "").toLowerCase().includes(selectedCountry.toLowerCase()));
    }

    // Size filter
    if (selectedSize !== "All") {
      if (selectedSize === "10k+") {
        list = list.filter(c => (c.employee_count_range || "").includes("10k") || (c.employee_count_range || "").includes("10K"));
      } else if (selectedSize === "1k-10k") {
        list = list.filter(c => (c.employee_count_range || "").includes("1k") || (c.employee_count_range || "").includes("5k"));
      } else if (selectedSize === "<1k") {
        list = list.filter(c => !((c.employee_count_range || "").includes("10k")) && !((c.employee_count_range || "").includes("10K")));
      }
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === "openings") return (b.active_job_count || 0) - (a.active_job_count || 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });
  }, [initialCompanies, search, selectedIndustry, selectedCountry, selectedSize, sortBy]);

  const totalPages = Math.ceil(filtered.length / COMPANIES_PER_PAGE) || 1;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedIndustry, selectedCountry, selectedSize, sortBy]);

  const displayedCompanies = useMemo(() => {
    const start = (currentPage - 1) * COMPANIES_PER_PAGE;
    return filtered.slice(start, start + COMPANIES_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;
    setCurrentPage(targetPage);
    const gridEl = document.getElementById("companies-results-grid");
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
          HERO SECTION: Pixel-matched to Reference Image
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50 pt-10 pb-8 sm:pt-14 sm:pb-10">
        {/* Subtle mesh & ambient light */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-1/4 -translate-y-12 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>VERIFIED COMPANIES</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-black text-slate-900 tracking-tight leading-[1.12] mb-4">
                Discover companies that are{" "}
                <span className="text-teal-600 underline decoration-teal-300 decoration-wavy decoration-2 underline-offset-4">
                  actually hiring
                </span>.
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-600 mb-7 max-w-xl leading-relaxed">
                Explore verified companies and discover fresh opportunities directly from official career portals. Follow your favorite companies and never miss a new opportunity.
              </p>

              {/* 3 Metric Badges side-by-side */}
              <div className="grid grid-cols-3 gap-3 sm:gap-3.5 w-full max-w-lg">
                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {totalCompaniesCount.toLocaleString()}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Verified Companies
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {initialStats?.total_jobs ? `${Number(initialStats.total_jobs).toLocaleString()}+` : "1.2M+"}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Active Openings
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                      150+
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                      Countries
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Column: Network Globe with 6 Floating Logos + Annotations + 3 Feature Badges */}
            <div className="lg:col-span-6 xl:col-span-6 relative hidden sm:flex items-center justify-center min-h-[380px] lg:min-h-[400px]">
              <div className="relative w-full h-[380px] lg:h-[400px] max-w-[580px]">
                
                {/* Subtle Central Network Globe SVG */}
                <svg className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[330px] sm:h-[330px] pointer-events-none" viewBox="0 0 360 360" fill="none">
                  <defs>
                    <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.45"/>
                      <stop offset="65%" stopColor="#ccfbf1" stopOpacity="0.15"/>
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  
                  {/* Globe radial soft glow */}
                  <circle cx="180" cy="180" r="140" fill="url(#globe-glow)"/>
                  
                  {/* Concentric latitude & meridian rings */}
                  <circle cx="180" cy="180" r="135" stroke="#0d9488" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.3" />
                  <ellipse cx="180" cy="180" rx="135" ry="50" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
                  <ellipse cx="180" cy="180" rx="135" ry="95" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
                  <ellipse cx="180" cy="180" rx="55" ry="135" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
                  <ellipse cx="180" cy="180" rx="100" ry="135" stroke="#0d9488" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
                  
                  {/* Subtle node dots at intersections */}
                  <circle cx="140" cy="130" r="2.5" fill="#0d9488" opacity="0.6"/>
                  <circle cx="225" cy="155" r="2.5" fill="#0d9488" opacity="0.6"/>
                  <circle cx="170" cy="235" r="2.5" fill="#0d9488" opacity="0.5"/>
                  <circle cx="250" cy="210" r="2" fill="#0d9488" opacity="0.5"/>
                  <circle cx="110" cy="165" r="2" fill="#0d9488" opacity="0.5"/>
                  <circle cx="190" cy="100" r="2.5" fill="#0d9488" opacity="0.6"/>
                </svg>

                {/* Left Annotation: "Top companies hiring worldwide" */}
                <div className="absolute top-2 left-0 sm:left-2 z-20 pointer-events-none flex flex-col items-start select-none">
                  <span className="font-handwriting text-teal-800 text-sm sm:text-base font-bold -rotate-6 tracking-wide leading-tight">
                    Top companies<br />hiring worldwide
                  </span>
                  <svg width="44" height="34" viewBox="0 0 44 34" fill="none" className="text-teal-600 ml-5 mt-0.5">
                    <path d="M4 4C6 14 16 26 30 24C34 23 37 20 39 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M33 16L39 15L40 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* 6 Floating Company Logos */}
                {/* 1. Google (Top Center) */}
                <div 
                  className="absolute top-4 left-[165px] sm:left-[190px] w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Google"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.44 7.35 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.1z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.56 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z" />
                  </svg>
                </div>

                {/* 2. Microsoft (Mid Left) */}
                <div 
                  className="absolute top-[125px] left-[15px] sm:left-[35px] w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Microsoft"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <rect x="1.5" y="1.5" width="9.5" height="9.5" fill="#F25022" rx="0.5" />
                    <rect x="13" y="1.5" width="9.5" height="9.5" fill="#7FBA00" rx="0.5" />
                    <rect x="1.5" y="13" width="9.5" height="9.5" fill="#00A4EF" rx="0.5" />
                    <rect x="13" y="13" width="9.5" height="9.5" fill="#FFB900" rx="0.5" />
                  </svg>
                </div>

                {/* 3. Meta (Top Right) */}
                <div 
                  className="absolute top-[75px] left-[275px] sm:left-[315px] w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Meta"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#0081FB">
                    <path d="M16.974 6.242c-1.928 0-3.328 1.096-4.974 3.01-1.646-1.914-3.046-3.01-4.974-3.01-3.642 0-6.026 2.875-6.026 6.84 0 4.152 2.566 7.214 6.136 7.214 2.193 0 3.646-1.096 4.864-2.825 1.218 1.729 2.671 2.825 4.864 2.825 3.57 0 6.136-3.062 6.136-7.214 0-3.965-2.384-6.84-6.026-6.84zm-4.974 7.247c-.886 1.488-1.996 2.738-3.676 2.738-2.128 0-3.69-1.942-3.69-4.819 0-2.738 1.507-4.764 3.635-4.764 1.625 0 2.793 1.151 3.731 2.738v4.107zm6.65 2.738c-1.68 0-2.79-1.25-3.676-2.738V9.382c.938-1.587 2.106-2.738 3.731-2.738 2.128 0 3.635 2.026 3.635 4.764 0 2.877-1.562 4.819-3.69 4.819z" />
                  </svg>
                </div>

                {/* 4. Amazon (Center Right, slightly larger) */}
                <div 
                  className="absolute top-[165px] left-[220px] sm:left-[245px] w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-xl transition-all duration-300 z-10"
                  title="Amazon"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7">
                    <path fill="#111827" d="M13.62 14.16c-.66.52-1.57.82-2.58.82-1.94 0-3.06-1.12-3.06-3.03 0-2.34 1.78-3.4 4.82-3.4.74 0 1.27.05 1.58.12v.94c-.26-.06-.69-.1-1.3-.1-1.89 0-3.03.62-3.03 1.93 0 1.09.68 1.74 1.83 1.74.84 0 1.55-.38 2.02-.97v1.95zm-3.05-8.73c2.93 0 4.87 1.43 4.87 4.54v4.75c0 .69.04 1.34.1 1.84h-1.82c-.08-.28-.12-.76-.14-1.14-.6.76-1.55 1.35-2.79 1.35-2.07 0-3.6-1.42-3.6-3.47 0-2.28 1.63-3.5 4.41-3.5.76 0 1.44.07 1.97.18v-.76c0-1.74-1.07-2.61-2.88-2.61-1.19 0-2.45.41-3.23.95l-.7-1.63c1.07-.68 2.59-1.15 4.01-1.15z"/>
                    <path fill="#FF9900" d="M19.8 19.34c-3.13 2.19-7.39 3.09-11.45 2.12-2.42-.58-4.66-1.73-6.52-3.34-.23-.2-.04-.54.24-.41 4.56 2.09 9.94 2.14 14.77-.38.41-.21.78.26.36.61zM20.73 17.8c.24-.31 1.54-.15 2.17-.07.21.03.25.26.06.39-1.2 1.02-2.58 1.48-3.04 1.25-.33-.16-.25-1.09.81-1.57z"/>
                  </svg>
                </div>

                {/* 5. Apple (Bottom Center-Left) */}
                <div 
                  className="absolute bottom-4 left-[145px] sm:left-[170px] w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Apple"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#111827">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77.99.08 2.06-.52 2.68-1.27z"/>
                  </svg>
                </div>

                {/* 6. Netflix (Bottom Right) */}
                <div 
                  className="absolute bottom-10 left-[280px] sm:left-[320px] w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-2.5 hover:scale-110 hover:shadow-lg transition-all duration-300 z-10"
                  title="Netflix"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#E50914">
                    <path d="M5.398 0v24c1.196-.27 2.417-.504 3.656-.696V0H5.398zm9.546 0v17.484c1.239-.12 2.464-.204 3.656-.252V0h-3.656zm-4.773 0l4.82 23.016c-1.127.132-2.265.288-3.41.468L6.82 5.04V0h3.351z"/>
                  </svg>
                </div>

                {/* Right Annotation: "Verified from official career portals" */}
                <div className="absolute top-1 right-0 sm:right-2 z-20 pointer-events-none flex items-center gap-1 select-none">
                  <svg width="36" height="30" viewBox="0 0 36 30" fill="none" className="text-teal-600 shrink-0">
                    <path d="M30 4C22 6 10 13 6 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M4 15L6 24L14 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-handwriting text-teal-800 text-xs sm:text-sm font-bold -rotate-3 tracking-wide whitespace-nowrap leading-tight">
                    Verified from<br />official career portals
                  </span>
                </div>

                {/* 3 Stacked Feature Badges on Far Right */}
                <div className="absolute right-0 sm:right-1 top-[56px] flex flex-col gap-2.5 z-10 w-[185px] sm:w-[195px]">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5 hover:border-emerald-300 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">Official Sources</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">Company career portals only</p>
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

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          SEARCH BAR & FILTER CONTROLS: FULL CONTAINER WIDTH
          ======================================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-4 pb-12">
        
        {/* Full-width Search Bar */}
        <div className="w-full mb-4">
          <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-1.5 sm:p-2">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const gridEl = document.getElementById("companies-results-grid");
                  if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              placeholder="Search companies by name, domain, or location..."
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mr-2 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Button
              onClick={() => {
                const gridEl = document.getElementById("companies-results-grid");
                if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 sm:px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>
          </div>
        </div>

        {/* Filter & Sort Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Country Filter */}
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
              >
                <option value="All">All Countries (Worldwide)</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Industry Filter */}
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
              >
                <option value="All">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Company Size Filter */}
            <div className="relative">
              <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
              >
                <option value="All">All Company Sizes</option>
                <option value="10k+">10K+ employees</option>
                <option value="1k-10k">1K–10K employees</option>
                <option value="<1k">Under 1K employees</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="openings">Most Openings</option>
                <option value="name">Company Name (A–Z)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dynamic Company Counter */}
          <div className="text-xs sm:text-sm font-semibold text-slate-600">
            <span className="text-slate-900 font-bold">{filtered.length.toLocaleString()}</span> companies
          </div>
        </div>

        {/* ========================================================
            COMPANIES GRID: STRICTLY 3 columns on desktop, 2 on tablet, 1 on mobile
            ======================================================== */}
        <div id="companies-results-grid" className="scroll-mt-24">
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:border-teal-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Top Header: Logo, Name, Domain & Featured Tag */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <CompanyLogo
                            name={company.name}
                            website={company.website}
                            slug={company.slug}
                            logoUrl={company.logo_url}
                            size="md"
                          />
                          <div className="min-w-0">
                            <Link href={`/companies/${company.slug}`} className="group/link block">
                              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover/link:text-teal-600 transition-colors truncate">
                                {company.name}
                              </h2>
                            </Link>
                            <span className="text-xs text-slate-400 font-medium truncate block mt-0.5">
                              {getCleanDomain(company.website, company.slug, company.name) || (company.industry || "Official ATS")}
                            </span>
                          </div>
                        </div>

                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                          Featured
                        </span>
                      </div>

                      {/* Description: 2-line clamp */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 min-h-[2.5rem] leading-relaxed mb-4">
                        {company.description || `${company.name} is hiring verified talent directly on official career portals.`}
                      </p>

                      {/* Metadata Row: Location & Employees */}
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-5">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[140px] sm:max-w-[160px]">
                            {company.headquarters || 'Worldwide / Remote'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{company.employee_count_range || '1K+'} employees</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                      <Link 
                        href={`/jobs?company=${encodeURIComponent(company.slug)}`}
                        className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold text-xs sm:text-sm group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>View {company.active_job_count?.toLocaleString() || "Verified"} Openings</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>

                      {company.website && (
                        <a 
                          href={company.website.startsWith("http") ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 transition-colors"
                          title={`Visit ${company.name} official site`}
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ========================================================
                  PAGINATION BAR: Clean, Numbered, Responsive
                  ======================================================== */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                  <div className="text-xs sm:text-sm text-slate-500 font-medium">
                    Showing <strong className="text-slate-900 font-bold">{((currentPage - 1) * COMPANIES_PER_PAGE) + 1}</strong>–<strong className="text-slate-900 font-bold">{Math.min(currentPage * COMPANIES_PER_PAGE, filtered.length)}</strong> of <strong className="text-slate-900 font-bold">{filtered.length.toLocaleString()}</strong> companies (Page {currentPage} of {totalPages})
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="rounded-xl text-xs font-semibold px-3 h-8 cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    >
                      ← Previous
                    </Button>

                    {getPageNumbers().map((p, idx) => (
                      typeof p === "number" ? (
                        <Button
                          key={idx}
                          variant={p === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 p-0 rounded-full text-xs font-bold cursor-pointer transition-all ${
                            p === currentPage
                              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-xs border-teal-600"
                              : "text-slate-700 border-transparent hover:bg-slate-100 hover:text-teal-600 bg-transparent"
                          }`}
                        >
                          {p}
                        </Button>
                      ) : (
                        <span key={idx} className="px-1 text-slate-400 text-xs font-bold">...</span>
                      )
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="rounded-xl text-xs font-semibold px-3 h-8 cursor-pointer border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    >
                      Next →
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
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
                      className="w-14 px-2 py-1 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-center text-xs outline-none focus:border-teal-500 focus:bg-white"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleJumpPage}
                      className="text-xs h-7 px-3 rounded-lg cursor-pointer border-slate-200 hover:bg-slate-50"
                    >
                      Go
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No companies found</h3>
              <p className="text-sm text-slate-500 mb-4">
                No company matches your search {search ? `"${search}"` : ""} or selected filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedIndustry("All");
                  setSelectedCountry("All");
                  setSelectedSize("All");
                }}
                className="rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
