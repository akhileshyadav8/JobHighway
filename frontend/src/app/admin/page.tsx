"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  XCircle, 
  Trash2, 
  Search, 
  Eye, 
  MousePointerClick, 
  ExternalLink,
  Lock,
  RefreshCw,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getCurrentUser, 
  loginUser, 
  getAllUsersForAdmin, 
  adminDeleteUser,
  User 
} from "@/lib/auth";
import { getAnalyticsSummary, AnalyticsSummary } from "@/lib/telemetry";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"telemetry" | "users" | "inquiries">("telemetry");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [inquirySearch, setInquirySearch] = useState("");

  const refreshData = () => {
    const cur = getCurrentUser();
    setUser(cur);
    setSummary(getAnalyticsSummary());
    setCandidates(getAllUsersForAdmin());

    try {
      const rawInq = localStorage.getItem("jobpulse_contact_inquiries");
      if (rawInq) {
        setInquiries(JSON.parse(rawInq));
      } else {
        const sample: ContactInquiry[] = [
          {
            id: "inq_sample_1",
            name: "Rahul Verma",
            email: "rahul.v@techcorp.com",
            topic: "Job Indexing Request",
            subject: "Request to add Stripe Careers RSS Feed",
            message: "Hi JobPulse Team, could you index the official Stripe Greenhouse board? They recently posted 45 new backend roles.",
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: "inq_sample_2",
            name: "Ananya Iyer",
            email: "ananya.i@gmail.com",
            topic: "Career Query",
            subject: "Feedback on System Design Playbook",
            message: "Loved the LLD strategy pattern article! Would love a follow-up on Kafka event driven architectures.",
            createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
          }
        ];
        localStorage.setItem("jobpulse_contact_inquiries", JSON.stringify(sample));
        setInquiries(sample);
      }
    } catch {
      setInquiries([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAdminQuickLogin = () => {
    const res = loginUser("yadavakhil766@gmail.com");
    if (res.user) {
      setUser(res.user);
      refreshData();
    }
  };

  const handleDeleteCandidate = (userId: string) => {
    if (confirm("Are you sure you want to remove this candidate account?")) {
      adminDeleteUser(userId);
      setCandidates(getAllUsersForAdmin());
    }
  };

  const handleDeleteInquiry = (id: string) => {
    const next = inquiries.filter(i => i.id !== id);
    setInquiries(next);
    localStorage.setItem("jobpulse_contact_inquiries", JSON.stringify(next));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
  };

  const isAdmin = user && (user.role === "admin" || user.email === "yadavakhil766@gmail.com");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Restricted Admin Area
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            This console is reserved for JobPulse platform operators, founders, and site administrators.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleAdminQuickLogin}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Authenticate as Founder Admin</span>
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full rounded-xl cursor-pointer text-xs">
                Back to Public Job Board
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

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

  const totalDeviceClicks = (summary?.deviceBreakdown.desktop || 1) + (summary?.deviceBreakdown.mobile || 1) + (summary?.deviceBreakdown.tablet || 1);
  const desktopPct = Math.round(((summary?.deviceBreakdown.desktop || 0) / totalDeviceClicks) * 100);
  const mobilePct = Math.round(((summary?.deviceBreakdown.mobile || 0) / totalDeviceClicks) * 100);
  const tabletPct = Math.max(0, 100 - desktopPct - mobilePct);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  JobPulse Master Admin
                </h1>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950 border border-teal-800 px-2.5 py-0.5 rounded-full uppercase">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Signed in as {user.name} ({user.email}) • Real-time traffic, candidate directory, & feedback inbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Refresh Feed
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl cursor-pointer">
                Candidate View
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "telemetry"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Users ({candidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: TELEMETRY & LIVE TRAFFIC */}
        {activeTab === "telemetry" && (
          <div className="space-y-8">
            {/* Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                  <span>Total Pageviews</span>
                  <Eye className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {(summary?.totalPageviews || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4% this week
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                  <span>Unique Visitors</span>
                  <Users className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {(summary?.uniqueVisitors || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-teal-600 mt-1 font-medium">Verified Applicant Devices</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                  <span>Apply Clicks</span>
                  <MousePointerClick className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {(summary?.totalApplyClicks || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Direct ATS Conversions</div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                  <span>Active Jobs Indexed</span>
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  5,670+
                </div>
                <div className="text-[11px] text-emerald-500 font-medium mt-1">0 Delays • Real-Time</div>
              </div>
            </div>

            {/* Device Distribution & Top Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Device Split */}
              <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-teal-600" />
                    Device Breakdown (Mobile vs Desktop)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-slate-400" /> Desktop Web
                        </span>
                        <span>{desktopPct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: `${desktopPct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Mobile Devices
                        </span>
                        <span>{mobilePct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${mobilePct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Tablet className="w-3.5 h-3.5 text-slate-400" /> Tablet & Others
                        </span>
                        <span>{tabletPct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full" style={{ width: `${tabletPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    💡 JobPulse is fully responsive and optimized for both desktop and mobile viewports.
                  </div>
                </CardContent>
              </Card>

              {/* Top Pages */}
              <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    Most Visited Routes
                  </h3>

                  <div className="space-y-2.5">
                    {(summary?.topPages || []).map((page, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-medium">
                        <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-xs">
                          {page.path}
                        </span>
                        <span className="font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                          {page.count.toLocaleString()} views
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Recent Live Events Stream */}
            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
                  Real-Time Applicant Activity Log
                </h3>

                {(summary?.recentEvents || []).length === 0 ? (
                  <p className="text-xs text-slate-400">No recorded telemetry in this local session yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(summary?.recentEvents || []).map((ev) => (
                      <div key={ev.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-teal-500" />
                          <span className="font-mono font-bold uppercase text-slate-900 dark:text-white">
                            {ev.type}
                          </span>
                          <span className="text-slate-500 truncate max-w-[250px]">{ev.path}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <span>{ev.device} ({ev.screen})</span>
                          <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: CANDIDATE DIRECTORY */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search candidates by name, email, or role..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="text-xs text-slate-500">
                Total Registered: <strong>{candidates.length}</strong>
              </div>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Role / Target</th>
                      <th className="p-4">Target CTC</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Registered</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{c.name}</span>
                            {c.role === "admin" && (
                              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.2 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">{c.email}</div>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                          {c.targetRole || "Software Engineer"}
                        </td>
                        <td className="p-4 text-emerald-600 font-semibold">
                          {c.targetCtc || "Flexible"}
                        </td>
                        <td className="p-4 text-slate-500">
                          {c.preferredLocation || "Worldwide"}
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          {c.id !== "admin_founder" && (
                            <button
                              onClick={() => handleDeleteCandidate(c.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
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
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                  No messages found.
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedInquiry?.id === inq.id
                        ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-teal-600 dark:text-teal-400">{inq.topic}</span>
                      <span className="text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
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
                <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-md">
                          {selectedInquiry.topic}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
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

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs space-y-1">
                      <div className="text-slate-500">
                        Sender: <strong className="text-slate-900 dark:text-white">{selectedInquiry.name}</strong>
                      </div>
                      <div className="text-slate-500">
                        Email: <strong className="text-teal-600 dark:text-teal-400 font-mono">{selectedInquiry.email}</strong>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="py-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selectedInquiry.message}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
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
                <div className="h-64 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
                  <Mail className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
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
