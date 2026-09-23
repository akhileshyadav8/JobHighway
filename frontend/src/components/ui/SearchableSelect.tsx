"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { CountryFlag } from "@/components/ui/CountryFlag";

export interface SearchableOption {
  label: string;
  value: string;
  code?: string;
}

export function getCleanLabel(label: string, code?: string): string {
  if (!code) return label;
  // If label starts with emoji sequences or flag characters, strip them cleanly
  return label.replace(/^[\p{Extended_Pictographic}\uD83C\uDDE6-\uD83C\uDDFF\uFE0F\s]+/u, "").trim() || label;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  icon,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  ariaLabel,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [alignRight, setAlignRight] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Check viewport bounds to prevent dropdown from spilling off right screen edge on mobile
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.left + 220 > window.innerWidth - 12) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }
    }
  }, [isOpen]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    const query = searchQuery.toLowerCase().trim();
    
    // Sort: items starting with query first, then items containing query
    const startsWith: SearchableOption[] = [];
    const contains: SearchableOption[] = [];

    options.forEach((opt) => {
      const clean = getCleanLabel(opt.label, opt.code).toLowerCase();
      const raw = opt.label.toLowerCase();
      const val = opt.value.toLowerCase();
      const code = (opt.code || "").toLowerCase();
      if (clean.startsWith(query) || raw.startsWith(query) || val.startsWith(query) || code.startsWith(query)) {
        startsWith.push(opt);
      } else if (clean.includes(query) || raw.includes(query) || val.includes(query) || code.includes(query)) {
        contains.push(opt);
      }
    });

    return [...startsWith, ...contains];
  }, [options, searchQuery]);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Auto focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeElement = listRef.current.children[highlightedIndex] as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        onChange(filteredOptions[highlightedIndex].value);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        aria-label={ariaLabel || placeholder}
        aria-expanded={isOpen}
        disabled={disabled || loading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between pl-8 pr-2.5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border rounded-xl shadow-2xs transition-all text-left outline-none cursor-pointer ${
          disabled || loading
            ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
            : isOpen
            ? "bg-white border-teal-500 ring-2 ring-teal-500/20 text-slate-900"
            : "bg-white border-slate-200/90 text-slate-800 hover:border-slate-300"
        }`}
      >
        {/* Leading Icon */}
        {icon && (
          <span className="absolute left-2 sm:left-2.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </span>
        )}

        {/* Selected Label */}
        <span className="truncate flex-1 pr-1.5 sm:pr-2 flex items-center gap-1.5 min-w-0">
          {loading ? (
            loadingText
          ) : selectedOption ? (
            <>
              {selectedOption.code && (
                <CountryFlag countryCode={selectedOption.code} size="sm" />
              )}
              <span className="truncate">{getCleanLabel(selectedOption.label, selectedOption.code)}</span>
            </>
          ) : (
            placeholder
          )}
        </span>

        {/* Trailing Down Chevron */}
        <ChevronDown
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-slate-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className={`absolute ${alignRight ? "right-0" : "left-0"} top-full mt-1.5 w-full min-w-[200px] sm:min-w-[220px] max-w-[calc(100vw-24px)] sm:max-w-sm bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden`}>
          {/* Search Input Bar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => {
                const isSelected = option.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={`${option.value}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded text-left transition-colors cursor-pointer ${
                      isHighlighted
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50"
                    } ${isSelected ? "font-semibold text-slate-900 bg-slate-50" : ""}`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2 min-w-0">
                      {option.code && (
                        <CountryFlag countryCode={option.code} size="sm" />
                      )}
                      <span className="truncate">{getCleanLabel(option.label, option.code)}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                No results found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
