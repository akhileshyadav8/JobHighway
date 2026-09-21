"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        placeholder="Search by title, company, skills, or location..."
        className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white shadow-md border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 outline-none text-sm transition-all"
      />
    </div>
  );
}
