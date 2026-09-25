"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ExternalLink 
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: "Jobs" | "Companies" | "Prepare" | "Blog";
  subtitle: string;
  href: string;
}

const PREPARE_ITEMS: SearchItem[] = [
  { id: "prep_1", title: "Online Assessment (OA) Aptitude Strategies", category: "Prepare", subtitle: "Round 1 Elimination Prep · Math & Speed Coding", href: "/prepare#selection-process" },
  { id: "prep_2", title: "Core Technical & Data Structures (DSA) Round", category: "Prepare", subtitle: "Round 2 Coding Prep · Optimal Space & Time Complexity", href: "/prepare#selection-process" },
  { id: "prep_3", title: "Machine Coding & System Architecture (HLD/LLD)", category: "Prepare", subtitle: "Round 3 Design Prep · Scalability & DB Trade-offs", href: "/prepare#selection-process" },
  { id: "prep_4", title: "Leadership Principles & STAR Behavioral Method", category: "Prepare", subtitle: "Round 4 Fit Prep · Engineering Culture & Situation Stories", href: "/prepare#selection-process" },
  { id: "prep_5", title: "Striver's A2Z DSA Sheet", category: "Prepare", subtitle: "Curated Study Sheet · 450+ Step-by-Step DSA Problems", href: "/prepare#study-sheets" },
  { id: "prep_6", title: "LeetCode Top SQL 50 Study Plan", category: "Prepare", subtitle: "Curated Study Sheet · Window Functions & Joins", href: "/prepare#study-sheets" },
  { id: "prep_7", title: "Engineering Career Ladder & Salary Growth", category: "Prepare", subtitle: "Career Pathway · Fresher to Principal Engineer Bands", href: "/prepare#career-pathways" }
];

const STATIC_TOP_COMPANIES: SearchItem[] = [
  { id: "comp_1", title: "Google", category: "Companies", subtitle: "Official Greenhouse ATS · Tech & Cloud", href: "/companies/google" },
  { id: "comp_2", title: "Microsoft", category: "Companies", subtitle: "Official Career Portal · Software & AI", href: "/companies/microsoft" },
  { id: "comp_3", title: "Amazon", category: "Companies", subtitle: "Official Career Portal · Cloud & E-commerce", href: "/companies/amazon" },
  { id: "comp_4", title: "Meta", category: "Companies", subtitle: "Official Lever ATS · Social & Distributed Systems", href: "/companies/meta" },
  { id: "comp_5", title: "Airbnb", category: "Companies", subtitle: "Official Greenhouse ATS · Travel & Platform", href: "/companies/airbnb" }
];

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const qLower = query.toLowerCase().trim();

  const results: SearchItem[] = [];

  if (qLower) {
    // 1. Direct Job Search query shortcut
    results.push({
      id: "job_search_" + qLower,
      title: `Search live jobs for "${query}"`,
      category: "Jobs",
      subtitle: "Hourly Direct ATS sync matching this keyword",
      href: `/?q=${encodeURIComponent(query)}`
    });

    // 2. Prepare items matching
    PREPARE_ITEMS.forEach(item => {
      if (item.title.toLowerCase().includes(qLower) || item.subtitle.toLowerCase().includes(qLower)) {
        results.push(item);
      }
    });

    // 3. Top Companies matching
    STATIC_TOP_COMPANIES.forEach(item => {
      if (item.title.toLowerCase().includes(qLower) || item.subtitle.toLowerCase().includes(qLower)) {
        results.push(item);
      }
    });

    // 4. Fallback search companies
    results.push({
      id: "comp_search_" + qLower,
      title: `Search companies matching "${query}"`,
      category: "Companies",
      subtitle: "Filter 17,500+ verified corporate career boards",
      href: `/companies?q=${encodeURIComponent(query)}`
    });
  }

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSelect(`/?q=${encodeURIComponent(query.trim())}`);
              }
            }}
            placeholder="Search verified jobs, companies, interview prep, or study sheets..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 bg-slate-200/70 border border-slate-300">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-1">
          {query.trim() === "" ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Quick Jump Suggestions
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                {[
                  { label: "Software Engineer", href: "/?q=Software%20Engineer" },
                  { label: "Data Analyst", href: "/?q=Data%20Analyst" },
                  { label: "Interview Prep", href: "/prepare" },
                  { label: "DSA Study Sheet", href: "/prepare#study-sheets" },
                  { label: "Top Tech Companies", href: "/companies" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.href)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            results.map((item) => {
              const Icon = 
                item.category === "Jobs" ? Briefcase :
                item.category === "Companies" ? Building2 :
                item.category === "Prepare" ? GraduationCap : BookOpen;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No results found for &ldquo;{query}&rdquo;. Press Enter to search live jobs feed.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">Ctrl</kbd> + <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">K</kbd> anywhere to open search</span>
          <span className="text-teal-700 font-medium">JobHighway Omni-Search</span>
        </div>
      </div>
    </div>
  );
}
