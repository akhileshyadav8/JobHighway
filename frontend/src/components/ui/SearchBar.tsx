"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
  buttonText?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
  buttonText = "Search",
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200/90 p-1.5 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all ${className}`}
    >
      <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg mr-1 transition-colors cursor-pointer"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-2xs cursor-pointer hover:shadow-xs"
      >
        <Search className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>
    </form>
  );
}
