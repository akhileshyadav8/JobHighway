"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const FILTERS = {
  "Job Type": ["All", "Full Time", "Internship", "Part Time", "Contract"],
  "Batch": ["All", "2024", "2025", "2026"],
  "Work Mode": ["All", "Remote", "Hybrid", "Onsite"],
  "Location": ["All", "Bangalore", "Hyderabad", "Pune", "Chennai", "Delhi NCR", "Mumbai", "Remote"]
};

export function FilterBar() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    "Job Type": "All",
    "Batch": "All",
    "Work Mode": "All",
    "Location": "All"
  });

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="w-full border-b border-slate-200 bg-white sticky top-16 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {Object.entries(FILTERS).map(([category, options]) => (
            <div key={category} className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                {category}
              </span>
              <div className="flex gap-2">
                {options.map((option) => {
                  const isActive = activeFilters[category] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => toggleFilter(category, option)}
                      className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors border ${
                        isActive 
                          ? "bg-teal-100 border-teal-200 text-teal-800 " 
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 "
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
