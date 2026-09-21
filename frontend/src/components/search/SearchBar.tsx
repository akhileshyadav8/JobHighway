"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <Input
        type="text"
        placeholder="Search by title, company, skills, or location..."
        className="block w-full pl-10 pr-3 py-6 border-slate-200 rounded-xl leading-5 bg-white shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-base transition-shadow"
      />
    </div>
  );
}
