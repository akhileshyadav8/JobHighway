"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Bookmark, 
  Bell, 
  FileText, 
  Users, 
  Building2, 
  FileCheck2, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Crown, 
  ArrowRight,
  Search,
  History,
  GraduationCap
} from "lucide-react";

export interface DashboardSidebarProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  counts?: {
    saved?: number;
    alerts?: number;
    applications?: number;
    following?: number;
  };
  onOpenUpgrade?: () => void;
  onOpenProfile?: () => void;
  className?: string;
}

export function DashboardSidebar({
  activeTab = "dashboard",
  onSelectTab,
  counts = {},
  onOpenUpgrade,
  onOpenProfile,
  className = ""
}: DashboardSidebarProps) {

  // Real navigation items (Find Jobs removed per request as Browse Jobs serves this purpose)
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", isDashboard: true },
    { id: "profile", label: "My Profile", icon: User, onClick: onOpenProfile },
    { id: "browse_jobs", label: "Browse Jobs", icon: Briefcase, href: "/jobs" },
    { 
      id: "saved_jobs", 
      label: "Saved Jobs", 
      icon: Bookmark, 
      badge: counts.saved && counts.saved > 0 ? counts.saved : undefined, 
      onClick: () => onSelectTab?.("saved_jobs") 
    },
    { 
      id: "saved_searches", 
      label: "Saved Searches", 
      icon: Search, 
      onClick: () => onSelectTab?.("saved_searches") 
    },
    { 
      id: "recent_views", 
      label: "Recently Viewed", 
      icon: History, 
      onClick: () => onSelectTab?.("recent_views") 
    },
    { 
      id: "job_alerts", 
      label: "Job Alerts", 
      icon: Bell, 
      badge: counts.alerts && counts.alerts > 0 ? counts.alerts : undefined, 
      onClick: () => onSelectTab?.("job_alerts") 
    },
    { 
      id: "applications", 
      label: "Applications", 
      icon: FileText, 
      badge: counts.applications && counts.applications > 0 ? counts.applications : undefined, 
      onClick: () => onSelectTab?.("applications") 
    },
    { 
      id: "following", 
      label: "Following", 
      icon: Users, 
      badge: counts.following && counts.following > 0 ? counts.following : undefined, 
      onClick: () => onSelectTab?.("following") 
    },
    { id: "career_prep", label: "Career Preparation", icon: GraduationCap, href: "/prepare" },
    { id: "find_companies", label: "Find Companies", icon: Building2, href: "/companies" },
    { id: "resume_analyzer", label: "Resume Analyzer", icon: FileCheck2, onClick: () => onSelectTab?.("resume_analyzer") },
    { id: "skill_gap", label: "Skill Gap Analysis", icon: BarChart3, onClick: () => onSelectTab?.("skill_gap") },
    { id: "job_insights", label: "Job Insights", icon: TrendingUp, onClick: () => onSelectTab?.("job_insights") },
    { id: "settings", label: "Settings", icon: Settings, onClick: () => onSelectTab?.("settings") },
  ];

  return (
    <aside className={`w-48 xl:w-52 shrink-0 flex flex-col justify-between select-none ${className}`}>
      {/* Top Nav items */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const content = (
            <div
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-teal-50 text-teal-700 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                    isActive
                      ? "bg-teal-100 text-teal-800"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );

          if (item.href && !item.onClick) {
            return (
              <Link key={item.id} href={item.href} className="block cursor-pointer">
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (onSelectTab) {
                  onSelectTab(item.id);
                }
              }}
              className="w-full text-left cursor-pointer"
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* Bottom Promo Card: JobHighway Pro */}
      <div className="pt-6 pb-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs relative overflow-hidden group">
          <div className="flex items-start gap-3 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Get More with JobHighway Pro
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Advanced insights, AI tools and priority alerts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenUpgrade}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
