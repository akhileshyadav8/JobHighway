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
  FileText,
  Upload,
  Download,
  Phone,
  Globe,
  GraduationCap,
  AlertCircle
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
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200"
  },
  "Under Review": {
    label: "Under Review",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  "Interview": {
    label: "Interviewing",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200"
  },
  "Offer": {
    label: "Offer Received 🎉",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  },
  "Rejected": {
    label: "Archived / Rejected",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200"
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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [education, setEducation] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [targetCtc, setTargetCtc] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [resumeFile, setResumeFile] = useState<User["resumeFile"] | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const loadData = () => {
    const curUser = getCurrentUser();
    setUser(curUser);
    if (curUser) {
      setAppliedJobs(getAppliedJobs(curUser.id));
      setBookmarks(getBookmarks(curUser.id));
      setName(curUser.name || "");
      setPhone(curUser.phone || "");
      setLinkedinUrl(curUser.linkedinUrl || "");
      setGithubUrl(curUser.githubUrl || "");
      setPortfolioUrl(curUser.portfolioUrl || "");
      setCurrentRole(curUser.currentRole || "");
      setYearsExperience(curUser.yearsExperience || "");
      setEducation(curUser.education || "");
      setGraduationYear(curUser.graduationYear || "");
      setTargetCtc(curUser.targetCtc || "");
      setPreferredLocation(curUser.preferredLocation || "");
      setTargetRole(curUser.targetRole || "");
      setSkillsStr((curUser.skills || []).join(", "));
      setResumeFile(curUser.resumeFile || null);
    }
  };

  useEffect(() => {
    const curUser = getCurrentUser();
    if (curUser && curUser.role === "admin") {
      router.replace("/admin");
      return;
    }
    loadData();

    const handleAuth = () => {
      const u = getCurrentUser();
      if (u && u.role === "admin") {
        router.replace("/admin");
        return;
      }
      loadData();
    };
    window.addEventListener("jobpulse_auth_change", handleAuth);
    window.addEventListener("jobpulse_applications_change", handleAuth);
    window.addEventListener("jobpulse_bookmarks_change", handleAuth);

    return () => {
      window.removeEventListener("jobpulse_auth_change", handleAuth);
      window.removeEventListener("jobpulse_applications_change", handleAuth);
      window.removeEventListener("jobpulse_bookmarks_change", handleAuth);
    };
  }, [router]);

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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setResumeError("Please upload a valid PDF document (.pdf).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size exceeds 5MB limit. Please upload a smaller PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileData = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        dataUrl
      };
      setResumeFile(fileData);
      if (user) {
        const updated = updateUserProfile(user.id, { resumeFile: fileData });
        if (updated) setUser(updated);
      }
    };
    reader.onerror = () => {
      setResumeError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    if (!user) return;
    setResumeFile(null);
    const updated = updateUserProfile(user.id, { resumeFile: undefined });
    if (updated) setUser(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const skills = skillsStr
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const updated = updateUserProfile(user.id, {
      name,
      phone,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      currentRole,
      yearsExperience,
      education,
      graduationYear,
      targetCtc,
      preferredLocation,
      targetRole,
      skills,
      resumeFile: resumeFile || undefined
    });

    if (updated) {
      setUser(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  if (user?.role === "admin") {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-6 border-slate-200 bg-white rounded-xl shadow-sm">
          <Shield className="w-8 h-8 text-teal-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Administrative Console Only
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Administrator accounts have access restricted to system administration and cannot be used for candidate application tracking.
          </p>
          <Link href="/admin">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg cursor-pointer">
              Go to Admin Console
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-16 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-6 border-slate-200 bg-white rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <UserIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Candidate Dashboard
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Sign in to track your job applications, view saved roles, and customize preferences.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg cursor-pointer">
                Sign In to View Dashboard
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full rounded-lg cursor-pointer">
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
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* User Top Profile Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {user.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.email} • Candidate Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link href="/">
              <Button className="text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg cursor-pointer">
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                Find New Openings
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-xs text-slate-600 hover:text-slate-900 border-slate-200 rounded-lg cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">Total Applied</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 ">
              {counts.total}
            </div>
            <div className="text-[11px] text-teal-600 mt-1">Official Submissions</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">In Review</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 ">
              {counts.underReview}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Screening Pipeline</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">Interviews</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600 ">
              {counts.interview}
            </div>
            <div className="text-[11px] text-purple-500 mt-1">Technical / HR</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-semibold mb-1">Offers Received</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 ">
              {counts.offer}
            </div>
            <div className="text-[11px] text-emerald-500 mt-1">Final Packages</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("applied")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "applied"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 "
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
                : "text-slate-600 hover:bg-slate-100 "
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
                : "text-slate-600 hover:bg-slate-100 "
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
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 "
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
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
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
                    <Card key={item.id} className="border-slate-200 hover:shadow-md transition-all rounded-2xl overflow-hidden">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-md">
                                {item.company}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Applied {new Date(item.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                              {item.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {item.location}
                              </span>
                              {item.salary && (
                                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                  <DollarSign className="w-3.5 h-3.5" />
                                  {item.salary}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Dropdown & Actions */}
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 ">
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
                              className="text-xs font-semibold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
                              title="Official Application Link"
                            >
                              <span>Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => handleDeleteApplied(item.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Remove from tracker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Optional notes section */}
                        {item.notes && (
                          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl flex items-start gap-2">
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
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
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
                  <Card key={b.jobId} className="border-slate-200 rounded-2xl hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-md">
                            {b.company}
                          </span>
                          <button
                            onClick={() => handleRemoveBookmark(b)}
                            className="text-xs text-rose-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mb-1">
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

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
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
          <div className="max-w-3xl mx-auto space-y-6">
            {profileSaved && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Your profile and career preferences have been saved successfully!</span>
              </div>
            )}

            {/* Section 1: Resume Document */}
            <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-center gap-2.5 mb-4">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Resume / Curriculum Vitae
                  </h3>
                </div>

                {resumeError && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resumeError}</span>
                  </div>
                )}

                {resumeFile ? (
                  <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-900 truncate">
                          {resumeFile.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {(resumeFile.size / 1024).toFixed(0)} KB · Uploaded {new Date(resumeFile.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      {resumeFile.dataUrl && (
                        <a
                          href={resumeFile.dataUrl}
                          download={resumeFile.name}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal-400 transition-colors bg-slate-50/50">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      Upload your latest resume (PDF)
                    </p>
                    <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                      Used to match with official career requisitions. Max file size: 5MB.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select PDF File</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2: Contact & Personal Details */}
            <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
              <CardContent className="p-6 sm:p-7">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Contact &amp; Identification
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Akhilesh Yadav"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address (Registered)
                        </label>
                        <input
                          type="email"
                          disabled
                          value={user?.email || ""}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210 or +1 (555) 000-0000"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Online Profiles & Links */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <Globe className="w-4 h-4 text-teal-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Online Profiles &amp; Portfolio
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Portfolio / Website
                        </label>
                        <input
                          type="url"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          placeholder="https://yourportfolio.dev"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Career & Education */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <GraduationCap className="w-4 h-4 text-teal-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Career Background &amp; Education
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Current Role / Title
                        </label>
                        <input
                          type="text"
                          value={currentRole}
                          onChange={(e) => setCurrentRole(e.target.value)}
                          placeholder="e.g. Software Engineer, Student, Analyst"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Total Years of Experience
                        </label>
                        <input
                          type="text"
                          value={yearsExperience}
                          onChange={(e) => setYearsExperience(e.target.value)}
                          placeholder="e.g. 0 (Fresher), 2 Years, 4+ Years"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Highest Degree / Education
                        </label>
                        <input
                          type="text"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          placeholder="e.g. B.Tech in Computer Science, MCA, BS"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Graduation Year / Batch
                        </label>
                        <input
                          type="text"
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value)}
                          placeholder="e.g. 2024, 2025, 2026"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Target Preferences */}
                  <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <Briefcase className="w-4 h-4 text-teal-600" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Target Role &amp; Preferences
                      </h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Target Role / Job Title
                        </label>
                        <input
                          type="text"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder="e.g. Full Stack Engineer, SDE-2, Data Analyst"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Target CTC / Expected Compensation
                          </label>
                          <input
                            type="text"
                            value={targetCtc}
                            onChange={(e) => setTargetCtc(e.target.value)}
                            placeholder="e.g. ₹15,00,000 - ₹25,00,000 or $95,000+"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Preferred Locations
                          </label>
                          <input
                            type="text"
                            value={preferredLocation}
                            onChange={(e) => setPreferredLocation(e.target.value)}
                            placeholder="e.g. Bengaluru, Remote, Hyderabad"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Core Skills &amp; Technologies (Comma-separated)
                        </label>
                        <textarea
                          rows={2}
                          value={skillsStr}
                          onChange={(e) => setSkillsStr(e.target.value)}
                          placeholder="e.g. React, TypeScript, Python, PostgreSQL, Next.js, Docker"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:border-teal-500 focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Complete Profile</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
