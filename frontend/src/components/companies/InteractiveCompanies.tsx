"use client";

import { useState, useMemo } from "react";
import { Company } from "@/lib/api";
import Link from "next/link";
import { Search, ExternalLink, MapPin, Building2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InteractiveCompaniesProps {
  initialCompanies: Company[];
}

export function InteractiveCompanies({ initialCompanies }: InteractiveCompaniesProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return initialCompanies;
    const q = search.toLowerCase().trim();
    return initialCompanies.filter(
      c => c.name.toLowerCase().includes(q) || (c.industry || "").toLowerCase().includes(q) || (c.headquarters || "").toLowerCase().includes(q)
    );
  }, [initialCompanies, search]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Discover Top Hiring Companies
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Explore {initialCompanies.length} official career portals with verified openings posted in the last 1 month.
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5 pointer-events-none" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name, domain, or location..." 
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 outline-none text-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-all dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-2xl flex-shrink-0 shadow-inner">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <Link href={`/companies/${company.slug}`} className="group">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {company.name}
                        </h2>
                      </Link>
                      <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">{company.industry}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 h-10 leading-relaxed">
                    {company.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{company.headquarters || 'Multiple Locations'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <Link 
                      href={`/jobs?company=${encodeURIComponent(company.slug)}`}
                      className="inline-flex items-center text-teal-600 dark:text-teal-400 font-semibold text-xs hover:underline"
                    >
                      View {company.active_job_count} Openings →
                    </Link>
                    {company.website && (
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center gap-1"
                        title="Official Company Website"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No companies found</h3>
            <p className="text-sm text-slate-500">No company matches &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
