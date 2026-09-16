"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  User as UserIcon, 
  LogOut, 
  ExternalLink, 
  Trash2, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  Save, 
  Shield, 
  Filter,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getCurrentUser, 
  logoutUser, 
  getAppliedJobs, 
  updateAppliedStatus, 
  removeAppliedJob, 
  getBookmarks, 
  toggleBookmark, 
  updateUserProfile,
  ApplicationStatus,
  AppliedJob,
  BookmarkItem,
  User
} from "@/lib/auth";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; border: string }> = {
  "Applied": {
    label: "Applied",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    border: "border-blue-200 dark:border-blue-800"
  },
  "Under Review": {
    label: "Under Review",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-950/50",
    border: "border-amber-200 dark:border-amber-800"
  },
  "Interview": {
    label: "Interviewing",
    color: "text-purple-700 dark:text-purple-300",
    bg: "bg-purple-50 dark:bg-purple-950/50",
    border: "border-purple-200 dark:border-purple-800"
  },
  "Offer": {
    label: "Offer Received 🎉",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    border: "border-emerald-200 dark:border-emerald-800"
  },
  "Rejected": {
    label: "Archived / Rejected",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800/60",
    border: "border-slate-200 dark:border-slate-700"
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [activeTab, setActiveTab] = useState<"applied" | "bookmarks" | "profile">("applied");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Profile form state
  const [targetCtc, setTargetCtc] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const loadData = () => {
    const curUser = getCurrentUser();
    setUser(curUser);
    if (curUser) {
      setAppliedJobs(getAppliedJobs(curUser.id));
      setBookmarks(getBookmarks(curUser.id));
      setTargetCtc(curUser.targetCtc || "");
      setPreferredLocation(curUser.preferredLocation || "");
      setTargetRole(curUser.targetRole || "");
      setSkillsStr((curUser.skills || []).join(", "));
    }
  };

  useEffect(() => {
    loadData();

    const handleAuth = () => loadData();
    window.addEventListener("jobpulse_auth_change", handleAuth);
    window.addEventListener("jobpulse_applications_change", handleAuth);
    window.addEventListener("jobpulse_bookmarks_change", handleAuth);

    return () => {
      window.removeEventListener("jobpulse_auth_change", handleAuth);
      window.removeEventListener("jobpulse_applications_change", handleAuth);
      window.removeEventListener("jobpulse_bookmarks_change", handleAuth);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const handleStatusChange = (appliedId: string, newStatus: ApplicationStatus) => {
    if (!user) return;
    const updated = updateAppliedStatus(user.id, appliedId, newStatus);
    setAppliedJobs(updated);
  };

  const handleDeleteApplied = (appliedId: string) => {
    if (!user) return;
    const updated = removeAppliedJob(user.id, appliedId);
    setAppliedJobs(updated);
  };

  const handleRemoveBookmark = (item: BookmarkItem) => {
    if (!user) return;
    toggleBookmark(user.id, item);
    setBookmarks(getBookmarks(user.id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const skills = skillsStr
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const updated = updateUserProfile(user.id, {
      targetCtc,
      preferredLocation,
      targetRole,
      skills
    });

    if (updated) {
      setUser(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-3xl shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Candidate Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            Sign in to track your job applications, view saved roles, and customize CTC preferences.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link href="/login">
              <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl cursor-pointer">
                Sign In to View Dashboard
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full rounded-xl cursor-pointer">
                Create Free Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Filter applied jobs
  const filteredApplied = appliedJobs.filter(j => {
    if (statusFilter === "All") return true;
    return j.status === statusFilter;
  });

  const counts = {
    total: appliedJobs.length,
    underReview: appliedJobs.filter(j => j.status === "Under Review").length,
    interview: appliedJobs.filter(j => j.status === "Interview").length,
    offer: appliedJobs.filter(j => j.status === "Offer").length,
    saved: bookmarks.length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* User Top Profile Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.role === "admin" && (
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 inline-flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Founder / Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user.email} • Candidate Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {user.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" className="text-xs font-bold border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 rounded-xl cursor-pointer">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button className="text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-xs cursor-pointer">
                <Briefcase className="w-3.5 h-3.5 mr-1" />
                Find New Openings
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">Total Applied</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {counts.total}
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Official Submissions</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">In Review</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {counts.underReview}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Screening Pipeline</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">Interviews</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
              {counts.interview}
            </div>
            <div className="text-[11px] text-purple-500 mt-1">Technical / HR</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">Offers Received</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {counts.offer}
            </div>
            <div className="text-[11px] text-emerald-500 mt-1">Final Packages</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("applied")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "applied"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Applied Jobs Tracker ({appliedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "bookmarks"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Wishlist ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "profile"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & CTC Preferences</span>
          </button>
        </div>

        {/* TAB 1: APPLIED JOBS */}
        {activeTab === "applied" && (
          <div className="space-y-6">
            {/* Filter pills */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {["All", "Applied", "Under Review", "Interview", "Offer", "Rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      statusFilter === status
                        ? "bg-teal-600 text-white"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                Showing {filteredApplied.length} of {appliedJobs.length} applications
              </div>
            </div>

            {filteredApplied.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No applications in this view
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  When you apply to jobs on JobPulse, click the &quot;Mark as Applied&quot; checkmark on any job card to track its progress here.
                </p>
                <Link href="/">
                  <Button className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl cursor-pointer">
                    Browse Verified Openings
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplied.map((item) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG["Applied"];
                  return (
                    <Card key={item.id} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all dark:bg-slate-900 rounded-2xl overflow-hidden">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md">
                                {item.company}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Applied {new Date(item.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                              {item.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {item.location}
                              </span>
                              {item.salary && (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                  <DollarSign className="w-3.5 h-3.5" />
                                  {item.salary}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Dropdown & Actions */}
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                            <div>
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value as ApplicationStatus)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-colors ${cfg.bg} ${cfg.color} ${cfg.border}`}
                              >
                                <option value="Applied">🔵 Applied</option>
                                <option value="Under Review">🟡 Under Review</option>
                                <option value="Interview">🟣 Interview</option>
                                <option value="Offer">🟢 Offer Received</option>
                                <option value="Rejected">⚪ Rejected / Archived</option>
                              </select>
                            </div>

                            <a
                              href={item.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 inline-flex items-center gap-1"
                              title="Official Application Link"
                            >
                              <span>Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => handleDeleteApplied(item.id)}
                              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                              title="Remove from tracker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Optional notes section */}
                        {item.notes && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 p-2.5 rounded-xl flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <span>{item.notes}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKMARKS */}
        {activeTab === "bookmarks" && (
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Save interesting roles while browsing so you can prepare customized resumes and apply when ready.
                </p>
                <Link href="/">
                  <Button className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl cursor-pointer">
                    Explore Openings
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((b) => (
                  <Card key={b.jobId} className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md">
                            {b.company}
                          </span>
                          <button
                            onClick={() => handleRemoveBookmark(b)}
                            className="text-xs text-rose-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                          {b.title}
                        </h4>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {b.location}
                          </span>
                          {b.salary && (
                            <span className="text-emerald-600 font-semibold">{b.salary}</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400">
                          Saved {new Date(b.savedAt).toLocaleDateString()}
                        </span>
                        <a
                          href={b.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Apply Official</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & PREFERENCES */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl shadow-sm">
              <CardContent className="p-7 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <UserIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Candidate Profile & Targeting Preferences
                  </h3>
                </div>

                {profileSaved && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Profile preferences updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Role / Job Title
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Full Stack Engineer, SDE-2, Data Analyst"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target CTC / Compensation Range
                    </label>
                    <input
                      type="text"
                      value={targetCtc}
                      onChange={(e) => setTargetCtc(e.target.value)}
                      placeholder="e.g. ₹20,00,000 - ₹35,00,000 or $90,000+"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Locations
                    </label>
                    <input
                      type="text"
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      placeholder="e.g. Remote, Bengaluru, Hyderabad, Gurgaon"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Core Skills & Technologies (Comma-separated)
                    </label>
                    <textarea
                      rows={3}
                      value={skillsStr}
                      onChange={(e) => setSkillsStr(e.target.value)}
                      placeholder="e.g. React, TypeScript, Python, PostgreSQL, Next.js, Docker"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Career Preferences</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
