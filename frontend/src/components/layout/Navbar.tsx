'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  Briefcase, 
  Building2, 
  BookOpen, 
  Info, 
  Mail, 
  User as UserIcon, 
  Shield, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard, 
  Bell,
  CheckCheck,
  Zap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getCurrentUser, 
  logoutUser, 
  getFollowedCompanies, 
  getAppliedJobs, 
  getBookmarks, 
  User 
} from '@/lib/auth';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "sync" | "job" | "ats";
  link?: string;
}

function buildDynamicNotifications(user: User): NotificationItem[] {
  const items: NotificationItem[] = [];

  // 1. Dynamic Notification: Personalized AI Recommendations based on Resume
  if (user.resumeFile) {
    const role = user.targetRole || "Your Tech Profile";
    const topSkills = (user.skills || []).slice(0, 3).join(", ");
    items.push({
      id: "notif_rec_" + role.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      title: `✨ Fresh Direct ATS Matches for ${role}`,
      description: `Requisitions synchronized matching your resume skills ${topSkills ? `(${topSkills})` : ""}. Click to review match scores.`,
      timestamp: "12m ago",
      read: false,
      type: "job",
      link: "/dashboard#recommended-jobs-section"
    });
  } else {
    items.push({
      id: "notif_upload_resume",
      title: "📄 Upload Resume for Smart Recommendations",
      description: "Upload your resume (PDF/DOCX) to let our AI calculate real-time match percentages for 60,000+ verified jobs.",
      timestamp: "15m ago",
      read: false,
      type: "ats",
      link: "/dashboard"
    });
  }

  // 2. Dynamic Notification: Followed Companies
  const followed = getFollowedCompanies(user.id);
  if (followed.length > 0) {
    const names = followed.slice(0, 2).map((c) => c.name).join(" & ");
    items.push({
      id: "notif_comp_" + followed.length,
      title: `🏢 Openings from Followed Companies (${names}${followed.length > 2 ? ` +${followed.length - 2}` : ""})`,
      description: `${followed.length} companies in your tracked list have live Direct ATS feeds connected.`,
      timestamp: "1h ago",
      read: false,
      type: "sync",
      link: "/dashboard#followed-companies-section"
    });
  } else {
    items.push({
      id: "notif_track_companies",
      title: "🏢 Track Top Tech & Product Companies",
      description: "Follow Netflix, Amazon, Google, and 500+ top employers to get notified the second jobs open.",
      timestamp: "2h ago",
      read: true,
      type: "sync",
      link: "/companies"
    });
  }

  // 3. Dynamic Notification: Skill Gap Analysis
  if (user.targetRole) {
    items.push({
      id: "notif_gap_" + user.targetRole.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      title: `🎯 Skill Gap Readiness: ${user.targetRole}`,
      description: `Review your profile readiness and acquired vs missing industry skills for ${user.targetRole}.`,
      timestamp: "3h ago",
      read: false,
      type: "ats",
      link: "/dashboard#skill-gap-section"
    });
  }

  // 4. Dynamic Notification: Application Tracker
  const applied = getAppliedJobs(user.id);
  const saved = getBookmarks(user.id);
  if (applied.length > 0 || saved.length > 0) {
    items.push({
      id: "notif_tracker_" + applied.length + "_" + saved.length,
      title: `📋 Application Tracker (${applied.length} applied, ${saved.length} saved)`,
      description: "Your direct zero-broker application statuses and interviews are actively monitored.",
      timestamp: "5h ago",
      read: true,
      type: "job",
      link: "/dashboard"
    });
  }

  // 5. Dynamic Notification: Hourly ATS Ingestion
  items.push({
    id: "notif_hourly_sync",
    title: "⚡ Hourly Direct ATS Sync Active",
    description: "Multi-channel crawlers verified 60,000+ active requisitions from Greenhouse, Lever, and Workday.",
    timestamp: "6h ago",
    read: true,
    type: "sync",
    link: "/jobs"
  });

  return items;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync auth state & build dynamic notifications
  const refreshNotifications = () => {
    const cur = getCurrentUser();
    setUser(cur);
    if (!cur?.id) {
      setNotifications([]);
      return;
    }

    const readKey = "jobhighway_read_notifs_" + cur.id;
    let readIds: Set<string>;
    try {
      readIds = new Set(JSON.parse(localStorage.getItem(readKey) || "[]"));
    } catch {
      readIds = new Set();
    }

    const dynamicItems = buildDynamicNotifications(cur).map(item => ({
      ...item,
      read: readIds.has(item.id) ? true : item.read
    }));

    setNotifications(dynamicItems);
  };

  useEffect(() => {
    refreshNotifications();

    const handleSync = () => {
      refreshNotifications();
    };

    window.addEventListener("jobhighway_auth_change", handleSync);
    window.addEventListener("jobhighway_applications_change", handleSync);
    window.addEventListener("jobhighway_bookmarks_change", handleSync);
    window.addEventListener("jobhighway_following_change", handleSync);
    window.addEventListener("jobhighway_alerts_change", handleSync);

    return () => {
      window.removeEventListener("jobhighway_auth_change", handleSync);
      window.removeEventListener("jobhighway_applications_change", handleSync);
      window.removeEventListener("jobhighway_bookmarks_change", handleSync);
      window.removeEventListener("jobhighway_following_change", handleSync);
      window.removeEventListener("jobhighway_alerts_change", handleSync);
    };
  }, []);

  const handleMarkAllRead = () => {
    if (!user?.id) return;
    const readKey = "jobhighway_read_notifs_" + user.id;
    const allIds = notifications.map(n => n.id);
    localStorage.setItem(readKey, JSON.stringify(allIds));
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (user?.id) {
      const readKey = "jobhighway_read_notifs_" + user.id;
      let readIds: Set<string>;
      try {
        readIds = new Set(JSON.parse(localStorage.getItem(readKey) || "[]"));
      } catch {
        readIds = new Set();
      }
      readIds.add(item.id);
      localStorage.setItem(readKey, JSON.stringify(Array.from(readIds)));
    }
    setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n));
    setNotificationsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push("/login");
  };

  const navItems = [
    {
      label: 'Jobs',
      href: '/',
      icon: Briefcase,
      isActive: pathname === '/' || pathname === '/jobs',
    },
    {
      label: 'Companies',
      href: '/companies',
      icon: Building2,
      isActive: pathname.startsWith('/companies'),
    },
    ...(user && user.role !== "admin" ? [{
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname.startsWith('/dashboard'),
    }] : []),
    {
      label: 'Blog',
      href: '/blog',
      icon: BookOpen,
      isActive: pathname.startsWith('/blog'),
    },
    {
      label: 'About',
      href: '/about',
      icon: Info,
      isActive: pathname.startsWith('/about'),
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: Mail,
      isActive: pathname.startsWith('/contact'),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="JobHighway Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-teal-700 group-hover:opacity-90 transition-opacity">
              JobHighway
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center h-full gap-6 lg:gap-8">
          {navItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-full flex items-center text-sm transition-colors relative border-b-2 ${
                  item.isActive
                    ? 'border-teal-600 text-teal-800 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" ? (
                <>
                  <Link
                    href="/mastermindak"
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-100/70 rounded-md transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                    <span>Admin Console</span>
                  </Link>
                  <span className="hidden sm:inline text-slate-300 text-xs select-none">|</span>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Notification Bell with Interactive Popover */}
                  <div ref={notifRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                      title={unreadCount > 0 ? `${unreadCount} new notifications` : "Notifications"}
                      aria-label="View notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown Popover */}
                    {notificationsOpen && (
                      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-slate-50/70">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">Notifications</span>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllRead}
                              className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCheck className="w-3 h-3" />
                              <span>Mark all read</span>
                            </button>
                          )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleNotificationClick(item)}
                                className={`p-3 text-left transition-colors cursor-pointer flex items-start gap-3 ${
                                  !item.read ? "bg-teal-50/30 hover:bg-teal-50/60" : "hover:bg-slate-50"
                                }`}
                              >
                                <div className="w-7 h-7 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                                  {item.type === "sync" ? (
                                    <Zap className="w-3.5 h-3.5 text-teal-600 fill-teal-600/30" />
                                  ) : item.type === "job" ? (
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4 className={`text-xs ${!item.read ? "font-bold text-slate-900" : "font-medium text-slate-700"} truncate`}>
                                      {item.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                                      {item.timestamp}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                                    {item.description}
                                  </p>
                                </div>
                                {!item.read && (
                                  <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-2" />
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Footer */}
                        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Hourly direct ATS sync active
                          </span>
                          <Link
                            href="/dashboard"
                            onClick={() => setNotificationsOpen(false)}
                            className="text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                          >
                            View Dashboard
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Candidate Avatar */}
                  <Link href="/dashboard" className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors group cursor-pointer" title="Dashboard">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-teal-800 border border-emerald-200 font-extrabold text-xs flex items-center justify-center shadow-2xs transition-colors">
                      {user.name ? user.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() : "AK"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex items-center">
              <span className="text-xs font-semibold text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-md border border-slate-300 hover:border-slate-400 bg-white transition-colors cursor-pointer shadow-2xs">
                Sign In
              </span>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors border-l-2 ${
                  item.isActive
                    ? 'border-teal-600 text-teal-800 font-semibold pl-2.5'
                    : 'border-transparent text-slate-700 hover:text-slate-900 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
            {user ? (
              user.role === "admin" ? (
                <>
                  <Link
                    href="/mastermindak"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span>Admin Console</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 text-left cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold bg-teal-600 text-white"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user.name}&apos;s Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-xs font-semibold text-center border border-slate-300 text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-xs font-semibold text-center bg-teal-600 text-white"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
