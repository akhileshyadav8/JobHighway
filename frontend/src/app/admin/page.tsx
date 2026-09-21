"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Users, 
  Briefcase, 
  Activity, 
  Mail, 
  Smartphone, 
  Monitor, 
  Tablet, 
  TrendingUp, 
  CheckCircle2, 
  Trash2, 
  Search, 
  Eye, 
  MousePointerClick, 
  ExternalLink,
  Lock,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  DollarSign,
  X,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getCurrentUser, 
  logoutUser, 
  getAllUsersForAdmin, 
  adminDeleteUser,
  getAppliedJobs,
  updateAppliedStatus,
  User,
  AppliedJob,
  ApplicationStatus
} from "@/lib/auth";
import { getAnalyticsSummary, clearAnalyticsEvents, AnalyticsSummary } from "@/lib/telemetry";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; border: string }> = {
  "Applied": {
    label: "Applied",
    color: "text-blue-700 ",
    bg: "bg-blue-50 ",
    border: "border-blue-200 "
  },
  "Under Review": {
    label: "Under Review",
    color: "text-amber-700 ",
    bg: "bg-amber-50 ",
    border: "border-amber-200 "
  },
  "Interview": {
    label: "Interviewing",
    color: "text-purple-700 ",
    bg: "bg-purple-50 ",
    border: "border-purple-200 "
  },
  "Offer": {
    label: "Offer Received 🎉",
    color: "text-emerald-700 ",
    bg: "bg-emerald-50 ",
    border: "border-emerald-200 "
  },
  "Rejected": {
    label: "Archived / Rejected",
    color: "text-slate-600 ",
    bg: "bg-slate-100 ",
    border: "border-slate-200 "
  }
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      return getCurrentUser();
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<"telemetry" | "users" | "inquiries">("telemetry");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [inquirySearch, setInquirySearch] = useState("");

  // Log Pagination State
  const [logsPage, setLogsPage] = useState(1);

  // Dynamic Live Jobs Count (persisted in cache to prevent flash of wrong count)
  const [dynamicActiveJobs, setDynamicActiveJobs] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("jobpulse_admin_live_jobs_count");
      if (cached) {
        const n = parseInt(cached, 10);
        if (!isNaN(n)) return n;
      }
    }
    return null;
  });

  // Selected Candidate for Viewing Applied Jobs Modal
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
  const [candidateApplications, setCandidateApplications] = useState<AppliedJob[]>([]);

  const refreshData = () => {
    const cur = getCurrentUser();
    setUser(cur);
    setIsAuthChecking(false);
    setSummary(getAnalyticsSummary());
    
    const allUsers = getAllUsersForAdmin();
    setCandidates(allUsers);

    // Fetch real-time live active jobs count from database API
    fetch("/api/jobs?limit=1")
      .then(res => res.json())
      .then(data => {
        if (typeof data.total === "number") {
          setDynamicActiveJobs(data.total);
          localStorage.setItem("jobpulse_admin_live_jobs_count", String(data.total));
        }
      })
      .catch(err => console.warn("Failed to fetch live job count in admin:", err));

    // If currently viewing a candidate's applications, refresh their live list
    if (selectedCandidate) {
      setCandidateApplications(getAppliedJobs(selectedCandidate.id));
    }

    try {
      const rawInq = localStorage.getItem("jobpulse_contact_inquiries");
      if (rawInq) {
        setInquiries(JSON.parse(rawInq));
      }
    } catch {
      setInquiries([]);
    }
  };

  const handleClearLogs = (olderThanMinutes?: number) => {
    const periodLabel = olderThanMinutes === 60 ? "older than 1 hour" :
                        olderThanMinutes === 1440 ? "older than 24 hours" :
                        olderThanMinutes === 10080 ? "older than 7 days" : "ALL";
    if (!confirm(`Are you sure you want to clear telemetry logs ${periodLabel}?`)) return;
    clearAnalyticsEvents(olderThanMinutes);
    setSummary(getAnalyticsSummary());
    setLogsPage(1);
  };

  useEffect(() => {
    refreshData();

    const handleAppChange = () => refreshData();
    const handleAuthChange = () => refreshData();
    const handleAnalyticsChange = () => setSummary(getAnalyticsSummary());

    window.addEventListener("jobpulse_applications_change", handleAppChange);
    window.addEventListener("jobpulse_auth_change", handleAuthChange);
    window.addEventListener("jobpulse_analytics_update", handleAnalyticsChange);

    return () => {
      window.removeEventListener("jobpulse_applications_change", handleAppChange);
      window.removeEventListener("jobpulse_auth_change", handleAuthChange);
      window.removeEventListener("jobpulse_analytics_update", handleAnalyticsChange);
    };
  }, [selectedCandidate]);

  const handleOpenCandidateApplications = (cand: User) => {
    setSelectedCandidate(cand);
    setCandidateApplications(getAppliedJobs(cand.id));
  };

  const handleUpdateCandidateJobStatus = (appliedId: string, newStatus: ApplicationStatus) => {
    if (!selectedCandidate) return;
    const updated = updateAppliedStatus(selectedCandidate.id, appliedId, newStatus);
    setCandidateApplications(updated);
  };

  const handleDeleteCandidate = (userId: string) => {
    if (confirm("Are you sure you want to remove this candidate account?")) {
      adminDeleteUser(userId);
      setCandidates(getAllUsersForAdmin());
      if (selectedCandidate?.id === userId) {
        setSelectedCandidate(null);
      }
    }
  };

  const handleDeleteInquiry = (id: string) => {
    const next = inquiries.filter(i => i.id !== id);
    setInquiries(next);
    localStorage.setItem("jobpulse_contact_inquiries", JSON.stringify(next));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/admin/login");
  };

  // Strict check: Only role === 'admin'
  const isAdmin = user && user.role === "admin";

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-teal-600 ">
          <Shield className="w-8 h-8 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-500">Verifying Operator Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 border border-slate-200 bg-white rounded-2xl shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Restricted Admin Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Authentication is required. Only authorized administrators with verified credentials can access this panel.
          </p>

          <div className="space-y-3">
            <Link href="/admin/login" className="block w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm cursor-pointer">
                Go to Admin Login (/admin/login)
              </Button>
            </Link>
            <Link href="/" className="block w-full">
              <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer text-xs">
                Back to Public Job Board
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Real Dynamic Numbers
  const totalRegisteredUsers = candidates.length;
  
  // Calculate total applications across all candidates
  const totalApplicationsCount = candidates.reduce((acc, cand) => {
    return acc + getAppliedJobs(cand.id).length;
  }, 0);

  const filteredCandidates = candidates.filter(c => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.targetRole || "").toLowerCase().includes(q);
  });

  const filteredInquiries = inquiries.filter(i => {
    if (!inquirySearch.trim()) return true;
    const q = inquirySearch.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.subject.toLowerCase().includes(q) || i.topic.toLowerCase().includes(q);
  });

  const LOGS_PER_PAGE = 10;
  const allEvents = summary?.recentEvents || [];
  const totalLogsPages = Math.ceil(allEvents.length / LOGS_PER_PAGE) || 1;
  const displayedEvents = allEvents.slice((logsPage - 1) * LOGS_PER_PAGE, logsPage * LOGS_PER_PAGE);

  const getLogsPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalLogsPages <= 7) {
      for (let i = 1; i <= totalLogsPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (logsPage > 3) pages.push("...");
      const start = Math.max(2, logsPage - 1);
      const end = Math.min(totalLogsPages - 1, logsPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (logsPage < totalLogsPages - 2) pages.push("...");
      pages.push(totalLogsPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Admin Header */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-7 mb-8 shadow-xs border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center font-black text-2xl shadow-2xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  JobPulse Master Admin
                </h1>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Operator
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Operator: <strong className="text-slate-800 font-semibold">{user.name}</strong> ({user.email}) • Genuine Origin Telemetry &amp; Live Pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              className="text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer shadow-2xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh Data
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl cursor-pointer font-semibold">
                Candidate Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              size="sm"
              variant="ghost"
              className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl cursor-pointer font-semibold"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Genuine Origin Metrics Overview (Dynamic & Auto-Updating) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Real Dynamic Active Job Postings */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Active Job Postings</span>
              <Briefcase className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-600 ">
              {dynamicActiveJobs !== null ? (
                dynamicActiveJobs.toLocaleString()
              ) : (
                <span className="inline-block w-24 h-7 bg-slate-200 animate-pulse rounded-lg align-middle" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Real-time dynamic count</div>
          </div>

          {/* Card 2: Registered Candidates Count */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Registered Users</span>
              <Users className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 ">
              {totalRegisteredUsers.toLocaleString()}
            </div>
            <div className="text-[11px] text-cyan-600 mt-1 font-semibold">Total candidate accounts</div>
          </div>

          {/* Card 3: Total Tracked Job Applications */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Applications Tracked</span>
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600 ">
              {totalApplicationsCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-purple-500 mt-1">Across all candidates</div>
          </div>

          {/* Card 4: Real Pageviews & Unique Visitors */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Live Pageviews</span>
              <Eye className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 ">
              {(summary?.totalPageviews || 1).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{(summary?.uniqueVisitors || 1).toLocaleString()} unique visitors</div>
          </div>

        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "telemetry"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 "
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Traffic & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 "
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Users & Job Statuses ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 "
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: TELEMETRY & ACTIVITY LOGS WITH VIEW MORE */}
        {activeTab === "telemetry" && (
          <div className="space-y-8">
            
            {/* Real-Time Activity Log Card with View More / Show Less */}
            <Card className="border-slate-200 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
                    Real-Time Applicant Activity Log
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-slate-400 font-medium">
                      Showing {allEvents.length === 0 ? 0 : ((logsPage - 1) * LOGS_PER_PAGE) + 1}–{Math.min(logsPage * LOGS_PER_PAGE, allEvents.length)} of {allEvents.length} events
                    </span>
                    {allEvents.length > 0 && (
                      <div className="flex items-center">
                        <select
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            handleClearLogs(val === "all" ? 0 : parseInt(val, 10));
                            e.target.value = "";
                          }}
                          defaultValue=""
                          className="text-xs bg-slate-100 text-rose-600 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                          title="Selective or Full Telemetry Reset"
                        >
                          <option value="" disabled>🗑️ Clear Logs...</option>
                          <option value="60">Clear Older than 1 Hour</option>
                          <option value="1440">Clear Older than 24 Hours</option>
                          <option value="10080">Clear Older than 7 Days</option>
                          <option value="all">⚠️ Clear All Logs (Reset)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {allEvents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No recorded telemetry in this session yet.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
                    {displayedEvents.map((ev) => (
                      <div key={ev.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                          <span className="font-mono font-bold uppercase text-slate-900 ">
                            {ev.type}
                          </span>
                          <span className="text-slate-500 truncate max-w-[200px] sm:max-w-md">{ev.path}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 shrink-0">
                          <span>{ev.device} ({ev.screen})</span>
                          <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Numbered Log Pagination Controls */}
                {totalLogsPages > 1 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
                    <div className="text-slate-500 font-medium">
                      Page <strong>{logsPage}</strong> of <strong>{totalLogsPages}</strong>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={logsPage <= 1}
                        onClick={() => setLogsPage(prev => Math.max(1, prev - 1))}
                        className="h-7 text-xs px-2.5 rounded-lg cursor-pointer font-semibold"
                      >
                        ← Prev
                      </Button>

                      {getLogsPageNumbers().map((p, idx) => (
                        typeof p === "number" ? (
                          <Button
                            key={idx}
                            variant={p === logsPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLogsPage(p)}
                            className={`w-7 h-7 p-0 text-xs font-bold rounded-lg cursor-pointer ${
                              p === logsPage
                                ? "bg-teal-600 hover:bg-teal-500 text-white border-teal-600 shadow-2xs"
                                : "text-slate-700 hover:text-teal-600 hover:border-teal-500"
                            }`}
                          >
                            {p}
                          </Button>
                        ) : (
                          <span key={idx} className="px-1 text-slate-400 font-bold">...</span>
                        )
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={logsPage >= totalLogsPages}
                        onClick={() => setLogsPage(prev => Math.min(totalLogsPages, prev + 1))}
                        className="h-7 text-xs px-2.5 rounded-lg cursor-pointer font-semibold"
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Visited Routes */}
            <Card className="border-slate-200 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  Most Visited Routes & Conversions
                </h3>

                <div className="space-y-2.5">
                  {(summary?.topPages || []).map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs font-medium">
                      <span className="font-mono text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                        {page.path}
                      </span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {page.count.toLocaleString()} views
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* TAB 2: CANDIDATE USERS & REAL-TIME JOB STATUSES */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search candidates by name, email, or target role..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-teal-500"
                />
              </div>

              <div className="text-xs text-slate-500">
                Total Registered: <strong>{candidates.length}</strong> candidates
              </div>
            </div>

            <Card className="border-slate-200 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Target Role</th>
                      <th className="p-4">Target CTC</th>
                      <th className="p-4">Applications</th>
                      <th className="p-4">Registered</th>
                      <th className="p-4 text-right">Job Tracker</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 ">
                    {filteredCandidates.map((c) => {
                      const userApps = getAppliedJobs(c.id);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{c.name}</span>
                              {c.role === "admin" && (
                                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.2 rounded">
                                  Founder Admin
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 font-mono text-[11px]">{c.email}</div>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {c.targetRole || "Software Engineer"}
                          </td>
                          <td className="p-4 text-emerald-600 font-semibold">
                            {c.targetCtc || "Flexible"}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              userApps.length > 0 
                                ? "bg-teal-50 text-teal-700 border border-teal-200 " 
                                : "bg-slate-100 text-slate-500"
                            }`}>
                              {userApps.length} {userApps.length === 1 ? "Job" : "Jobs"} Applied
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Button
                              onClick={() => handleOpenCandidateApplications(c)}
                              size="sm"
                              className="text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl cursor-pointer"
                            >
                              View Jobs ({userApps.length})
                            </Button>
                            {c.id !== "admin_founder" && (
                              <button
                                onClick={() => handleDeleteCandidate(c.id)}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* CANDIDATE APPLIED JOBS INSPECTION MODAL / DRAWER */}
            {selectedCandidate && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full max-h-[85vh] flex flex-col bg-white border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 ">
                          {selectedCandidate.name}&apos;s Applied Jobs
                        </h3>
                        <span className="text-xs text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                          {candidateApplications.length} total
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {selectedCandidate.email} • Target: {selectedCandidate.targetRole || "Software Engineer"}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
                    {candidateApplications.length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-400">
                        This candidate has not marked any applications yet.
                      </div>
                    ) : (
                      candidateApplications.map((app) => {
                        const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG["Applied"];
                        return (
                          <div key={app.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-xs font-bold text-teal-600 bg-teal-100/70 px-2 py-0.5 rounded">
                                  {app.company}
                                </span>
                                <h4 className="font-bold text-sm text-slate-900 mt-1">
                                  {app.title}
                                </h4>
                                <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1">
                                  <span>{app.location}</span>
                                  {app.salary && <span className="text-emerald-600 font-medium">{app.salary}</span>}
                                  <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {/* Live Status Badge (Read-Only: Controlled by Candidate) */}
                              <div className="shrink-0 text-right">
                                <span className="text-[10px] text-slate-400 block mb-1">Candidate Status:</span>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                  <span>{app.status}</span>
                                </span>
                              </div>
                            </div>

                            {app.notes && (
                              <div className="text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-200/60 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Note: {app.notes}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-100 flex justify-end">
                    <Button
                      onClick={() => setSelectedCandidate(null)}
                      className="text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                    >
                      Close Viewer
                    </Button>
                  </div>
                </Card>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CONTACT FORM INQUIRIES INBOX */}
        {activeTab === "inquiries" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Inquiries List */}
            <div className="md:col-span-1 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  placeholder="Filter messages..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-teal-500"
                />
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 p-4">
                  No messages found.
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedInquiry?.id === inq.id
                        ? "border-teal-500 bg-teal-50/40 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-teal-600 ">{inq.topic}</span>
                      <span className="text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {inq.subject || "No Subject"}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      From: {inq.name} ({inq.email})
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Inquiry Details Viewer */}
            <div className="md:col-span-2">
              {selectedInquiry ? (
                <Card className="border-slate-200 rounded-3xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 ">
                      <div>
                        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-md">
                          {selectedInquiry.topic}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 mt-2">
                          {selectedInquiry.subject}
                        </h2>
                      </div>
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                      <div className="text-slate-500">
                        Sender: <strong className="text-slate-900 ">{selectedInquiry.name}</strong>
                      </div>
                      <div className="text-slate-500">
                        Email: <strong className="text-teal-600 font-mono">{selectedInquiry.email}</strong>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="py-2 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {selectedInquiry.message}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                        className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply to {selectedInquiry.name}</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                  <Mail className="w-10 h-10 text-slate-300 mb-2" />
                  <span>Select any contact inquiry on the left to read full message.</span>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
