"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  Search, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  X,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { getCurrentUser, logoutUser, User } from "@/lib/auth";
import { getSystemAlerts, AdminAlert } from "@/lib/adminData";
import { mockJobs, mockCompanies } from "@/lib/mock-data";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({ onOpenMobileSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setAlerts(getSystemAlerts());

    // Click outside listeners
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/mastermindak/login");
  };

  // Build clean breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 1) {
      return [{ label: "Overview", href: "/admin" }];
    }

    const crumbs = [{ label: "Admin", href: "/admin" }];
    let currentPath = "/admin";

    for (let i = 1; i < parts.length; i++) {
      currentPath += `/${parts[i]}`;
      const title = parts[i]
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      crumbs.push({ label: title, href: currentPath });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const unreadAlerts = alerts.filter(a => a.status === "unread");

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? {
        jobs: mockJobs
          .filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 4),
        companies: mockCompanies
          .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 3)
      }
    : null;

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 truncate font-medium">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={crumb.href} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                {isLast ? (
                  <span className="font-bold text-slate-900 truncate">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-slate-900 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: Global Search & Admin Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        
        {/* Global Admin Search Bar */}
        <div ref={searchRef} className="relative hidden md:block w-64 lg:w-80">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search jobs, users, companies..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown Modal */}
          {isSearchFocused && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 space-y-3 z-50 text-xs">
              {searchResults.jobs.length > 0 && (
                <div>
                  <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Matching Jobs
                  </div>
                  {searchResults.jobs.map((j) => (
                    <Link
                      key={j.slug}
                      href={`/jobs/${j.slug}`}
                      target="_blank"
                      onClick={() => setIsSearchFocused(false)}
                      className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="font-semibold text-slate-900 truncate">{j.title}</div>
                      <div className="text-[11px] text-slate-500">{j.company.name}</div>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.companies.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Companies
                  </div>
                  {searchResults.companies.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/companies/${c.slug}`}
                      target="_blank"
                      onClick={() => setIsSearchFocused(false)}
                      className="block px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.industry}</div>
                    </Link>
                  ))}
                </div>
              )}

              {searchResults.jobs.length === 0 && searchResults.companies.length === 0 && (
                <div className="p-3 text-center text-slate-400 text-xs">
                  No matching records found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Icon & Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">System Notifications</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    {unreadAlerts.length} Unread
                  </span>
                </div>
                <Link
                  href="/admin/alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-teal-600 hover:underline font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {alerts.slice(0, 4).map((alt) => (
                  <div key={alt.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        alt.category === "CRITICAL" ? "bg-rose-100 text-rose-700" :
                        alt.category === "WARNING" ? "bg-amber-100 text-amber-700" :
                        "bg-teal-100 text-teal-700"
                      }`}>
                        {alt.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{alt.timestamp}</span>
                    </div>
                    <div className="font-semibold text-slate-800">{alt.title}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{alt.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar & Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              AK
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || "Akhilesh Yadav"}
              </span>
              <span className="text-[10px] text-teal-700 font-semibold leading-none">
                Master Admin
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100 text-xs">
              <div className="p-2 border-b border-slate-100 mb-1">
                <div className="font-bold text-slate-900">{currentUser?.name || "Akhilesh Yadav"}</div>
                <div className="text-slate-400 text-[11px] truncate font-mono">
                  {currentUser?.email || "yadavakhil766@gmail.com"}
                </div>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Settings</span>
              </Link>

              <Link
                href="/"
                target="_blank"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Public Job Board</span>
                </div>
              </Link>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
