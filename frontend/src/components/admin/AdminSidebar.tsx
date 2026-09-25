"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Clock, 
  Copy, 
  CheckCircle, 
  Radio, 
  RefreshCw, 
  HeartPulse, 
  Building2, 
  Users, 
  FileText, 
  BarChart3, 
  Search, 
  PieChart, 
  Bell, 
  Activity, 
  Cpu, 
  Mail, 
  Settings,
  X,
  ExternalLink,
  GraduationCap
} from "lucide-react";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/mastermindak", icon: LayoutDashboard }
    ]
  },
  {
    title: "JOBS",
    items: [
      { name: "All Jobs", href: "/mastermindak/jobs", icon: Briefcase },
      { name: "Expired Jobs", href: "/mastermindak/jobs/expired", icon: Clock },
      { name: "Duplicates", href: "/mastermindak/jobs/duplicates", icon: Copy },
      { name: "Data Quality", href: "/mastermindak/jobs/data-quality", icon: CheckCircle }
    ]
  },
  {
    title: "SOURCES",
    items: [
      { name: "ATS Sources", href: "/mastermindak/sources", icon: Radio },
      { name: "Sync Center", href: "/mastermindak/sync", icon: RefreshCw },
      { name: "Link Health", href: "/mastermindak/link-health", icon: HeartPulse }
    ]
  },
  {
    title: "COMPANIES",
    items: [
      { name: "Companies", href: "/mastermindak/companies", icon: Building2 }
    ]
  },
  {
    title: "USERS",
    items: [
      { name: "Registered Users", href: "/mastermindak/users", icon: Users },
      { name: "Applications", href: "/mastermindak/applications", icon: FileText }
    ]
  },
  {
    title: "PREPARATION",
    items: [
      { name: "Preparation Hub", href: "/prepare", icon: GraduationCap }
    ]
  },
  {
    title: "ANALYTICS",
    items: [
      { name: "Traffic & Analytics", href: "/mastermindak/analytics/traffic", icon: BarChart3 },
      { name: "Search Analytics", href: "/mastermindak/analytics/search", icon: Search },
      { name: "Job Analytics", href: "/mastermindak/analytics/jobs", icon: PieChart }
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Alerts", href: "/mastermindak/alerts", icon: Bell },
      { name: "Activity Logs", href: "/mastermindak/activity", icon: Activity },
      { name: "System Health", href: "/mastermindak/system", icon: Cpu }
    ]
  },
  {
    title: "SUPPORT",
    items: [
      { name: "Contact Inquiries", href: "/mastermindak/inquiries", icon: Mail }
    ]
  },
  {
    title: "SETTINGS",
    items: [
      { name: "Settings", href: "/mastermindak/settings", icon: Settings }
    ]
  }
];

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/mastermindak") {
      return pathname === "/mastermindak";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 h-full flex flex-col select-none shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200/90 flex items-center justify-between">
        <Link 
          href="/mastermindak" 
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <img src="/logo.png" alt="JobHighway" className="w-8 h-8 object-contain" />
          <div className="flex flex-col">
            <span className="font-black text-lg text-slate-900 tracking-tight leading-none">
              JobHighway
            </span>
            <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase mt-0.5">
              Master Admin
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5 mt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? "bg-teal-50 text-teal-700 font-semibold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-teal-600 stroke-[2.2]" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Public Board Quick Link */}
      <div className="p-3 border-t border-slate-200/90 bg-slate-50/60">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Public Job Board</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </aside>
  );
}
