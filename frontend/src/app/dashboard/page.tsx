"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  Shield, 
  ExternalLink,
  Briefcase
} from "lucide-react";

import { 
  getCurrentUser, 
  getAppliedJobs, 
  getBookmarks, 
  toggleBookmark, 
  updateAppliedStatus, 
  removeAppliedJob, 
  markJobApplied,
  updateUserProfile,
  ApplicationStatus,
  AppliedJob,
  BookmarkItem,
  User 
} from "@/lib/auth";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { RecommendedJobsSection, RecommendedJobItem } from "@/components/dashboard/RecommendedJobsSection";
import { RecentAlertsSection, AlertItem } from "@/components/dashboard/RecentAlertsSection";
import { FollowedCompaniesSection, FollowedCompanyItem } from "@/components/dashboard/FollowedCompaniesSection";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { UserSkillsCard } from "@/components/dashboard/UserSkillsCard";
import { ApplicationTrackerCard, ApplicationTrackerMetrics } from "@/components/dashboard/ApplicationTrackerCard";
import { MarketInsightsCard } from "@/components/dashboard/MarketInsightsCard";
import { ResumeAnalysisSection, ResumeData } from "@/components/dashboard/ResumeAnalysisSection";
import { SkillGapSection } from "@/components/dashboard/SkillGapSection";
import { ProfileEditModal } from "@/components/dashboard/ProfileEditModal";
import { ApplicationsModal } from "@/components/dashboard/ApplicationsModal";
import { UpgradeProModal } from "@/components/dashboard/UpgradeProModal";
import { JobDetailModal } from "@/components/dashboard/JobDetailModal";

// Default Candidate Fallback if no user is signed in
const DEFAULT_CANDIDATE: User = {
  id: "candidate_akhilesh",
  name: "Akhilesh",
  email: "akhilesh@jobpulse.io",
  role: "user",
  createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  targetRole: "Data Scientist",
  preferredLocation: "Bengaluru, India • Remote",
  currentRole: "Data Scientist",
  yearsExperience: "3+ Years",
  skills: [
    "Python",
    "SQL",
    "Machine Learning",
    "Data Analysis",
    "Power BI",
    "NLP",
    "Deep Learning",
    "Pandas"
  ],
  resumeFile: {
    name: "Akhilesh_Yadav_Resume.pdf",
    size: 245 * 1024,
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  }
};

export default function DashboardPage() {
  const router = useRouter();

  // User Auth & Profile State
  const [user, setUser] = useState<User | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [applicationsModalTab, setApplicationsModalTab] = useState<"applied" | "saved">("applied");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<RecommendedJobItem | null>(null);

  // Load User Data
  const loadUserData = () => {
    const cur = getCurrentUser();
    if (cur) {
      setUser(cur);
      setAppliedJobs(getAppliedJobs(cur.id));
      setBookmarks(getBookmarks(cur.id));
    } else {
      // Gracefully use default candidate
      setUser(DEFAULT_CANDIDATE);
      setAppliedJobs(getAppliedJobs(DEFAULT_CANDIDATE.id));
      setBookmarks(getBookmarks(DEFAULT_CANDIDATE.id));
    }
  };

  useEffect(() => {
    loadUserData();

    const handleSync = () => {
      loadUserData();
    };

    window.addEventListener("jobpulse_auth_change", handleSync);
    window.addEventListener("jobpulse_applications_change", handleSync);
    window.addEventListener("jobpulse_bookmarks_change", handleSync);

    return () => {
      window.removeEventListener("jobpulse_auth_change", handleSync);
      window.removeEventListener("jobpulse_applications_change", handleSync);
      window.removeEventListener("jobpulse_bookmarks_change", handleSync);
    };
  }, []);

  // Compute User Initials
  const userInitials = useMemo(() => {
    if (!user?.name) return "AK";
    const parts = user.name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }, [user?.name]);

  // Compute Profile Completion Percentage
  const profileCompletionPercentage = useMemo(() => {
    if (!user) return 70;
    let score = 20; // base registered
    if (user.name) score += 10;
    if (user.phone) score += 10;
    if (user.targetRole) score += 10;
    if (user.preferredLocation) score += 10;
    if (user.skills && user.skills.length >= 4) score += 15;
    if (user.resumeFile) score += 15;
    if (user.linkedinUrl || user.githubUrl) score += 10;
    return Math.min(score, 100);
  }, [user]);

  // Handle Bookmarking
  const handleToggleBookmark = (job: RecommendedJobItem) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    toggleBookmark(currentUserId, {
      jobId: String(job.id),
      title: job.title,
      company: job.company,
      location: job.location,
      applyUrl: job.applyUrl
    });
    setBookmarks(getBookmarks(currentUserId));
  };

  // Handle Applying to a Job
  const handleApplyJob = (job: RecommendedJobItem) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    markJobApplied(
      currentUserId,
      {
        jobId: String(job.id),
        title: job.title,
        company: job.company,
        location: job.location,
        applyUrl: job.applyUrl
      },
      "Applied"
    );
    setAppliedJobs(getAppliedJobs(currentUserId));
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
  };

  // Handle Status Update in Applications
  const handleStatusChange = (appId: string, status: ApplicationStatus) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    const updated = updateAppliedStatus(currentUserId, appId, status);
    setAppliedJobs(updated);
  };

  // Handle Delete Application
  const handleDeleteApplied = (appId: string) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    const updated = removeAppliedJob(currentUserId, appId);
    setAppliedJobs(updated);
  };

  // Handle Remove Bookmark
  const handleRemoveBookmark = (item: BookmarkItem) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    toggleBookmark(currentUserId, item);
    setBookmarks(getBookmarks(currentUserId));
  };

  // Handle Resume Upload
  const handleResumeUpload = (file: File) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileData = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        dataUrl,
        atsScore: 92
      };
      const updated = updateUserProfile(currentUserId, { resumeFile: fileData });
      if (updated) setUser(updated);
    };
    reader.readAsDataURL(file);
  };

  // Handle Resume Remove
  const handleResumeRemove = () => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    const updated = updateUserProfile(currentUserId, { resumeFile: undefined });
    if (updated) setUser(updated);
  };

  // Handle Skills Update
  const handleAddSkill = (newSkill: string) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    const currentSkills = user?.skills || [];
    if (!currentSkills.includes(newSkill)) {
      const updatedSkills = [...currentSkills, newSkill];
      const updated = updateUserProfile(currentUserId, { skills: updatedSkills });
      if (updated) setUser(updated);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentUserId = user?.id || DEFAULT_CANDIDATE.id;
    const currentSkills = user?.skills || [];
    const updatedSkills = currentSkills.filter((s) => s !== skillToRemove);
    const updated = updateUserProfile(currentUserId, { skills: updatedSkills });
    if (updated) setUser(updated);
  };

  // Handle Tab Select from Sidebar
  const handleSelectSidebarTab = (tabId: string) => {
    setActiveSidebarTab(tabId);
    setMobileSidebarOpen(false);

    if (tabId === "saved_jobs") {
      setApplicationsModalTab("saved");
      setIsApplicationsModalOpen(true);
    } else if (tabId === "applications") {
      setApplicationsModalTab("applied");
      setIsApplicationsModalOpen(true);
    } else if (tabId === "job_alerts") {
      const alertSection = document.getElementById("recent-alerts-section");
      alertSection?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "following") {
      const followSection = document.getElementById("followed-companies-section");
      followSection?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "resume_analyzer") {
      const resumeSection = document.getElementById("resume-analysis-section");
      resumeSection?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "skill_gap") {
      const skillSection = document.getElementById("skill-gap-section");
      skillSection?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "job_insights") {
      const insightsSection = document.getElementById("job-market-insights-section");
      insightsSection?.scrollIntoView({ behavior: "smooth" });
    } else if (tabId === "profile" || tabId === "settings") {
      setIsProfileModalOpen(true);
    }
  };

  // Calculated Metrics for Tracker
  const trackerMetrics: ApplicationTrackerMetrics = useMemo(() => {
    return {
      saved: bookmarks.length || 12,
      applied: appliedJobs.length || 8,
      interview: appliedJobs.filter((j) => j.status === "Interview").length || 3,
      offer: appliedJobs.filter((j) => j.status === "Offer").length || 1,
      rejected: appliedJobs.filter((j) => j.status === "Rejected").length || 4
    };
  }, [appliedJobs, bookmarks]);

  // Sidebar count badges
  const sidebarCounts = useMemo(() => {
    return {
      saved: bookmarks.length || 12,
      alerts: 6,
      applications: appliedJobs.length || 8,
      following: 4
    };
  }, [bookmarks.length, appliedJobs.length]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px]">
        {/* Mobile Sidebar Toggle Header (Visible only on mobile/tablet) */}
        <div className="lg:hidden mb-4 flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 cursor-pointer"
          >
            <Menu className="w-4 h-4 text-teal-600" />
            <span>Dashboard Menu ({activeSidebarTab})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="flex items-start gap-6 lg:gap-8">
          {/* Left Sidebar (Desktop: Sticky, Mobile: Slide-over Drawer) */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-60 xl:w-64 lg:p-0 lg:shadow-none lg:bg-transparent lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto ${
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Mobile drawer close */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 lg:hidden">
              <span className="font-bold text-sm text-slate-900">Dashboard Navigation</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DashboardSidebar
              activeTab={activeSidebarTab}
              onSelectTab={handleSelectSidebarTab}
              counts={sidebarCounts}
              onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          </div>

          {/* Right Main Content Area */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* 1. Dashboard Hero / Welcome Card */}
            <DashboardHero
              userName={user?.name || "Akhilesh"}
              userInitials={userInitials}
              stats={{
                newJobsSinceVisit: 17,
                newFollowedCompanies: 4,
                matchingJobs: 12,
                totalOpportunities: "56,847"
              }}
            />

            {/* 2. Middle Section (2 Columns: Left ~65%, Right ~35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (8 cols): Recommended Jobs, Alerts, Followed Companies */}
              <div className="lg:col-span-8 space-y-6">
                {/* Recommended Jobs */}
                <div id="recommended-jobs-section">
                  <RecommendedJobsSection
                    onToggleBookmark={handleToggleBookmark}
                    onViewDetails={(job) => setSelectedJobForDetails(job)}
                    onApply={handleApplyJob}
                  />
                </div>

                {/* Recent Job Alerts */}
                <div id="recent-alerts-section">
                  <RecentAlertsSection
                    onViewAll={() => {
                      alert("Opening all active job alert filters.");
                    }}
                  />
                </div>

                {/* Followed Companies */}
                <div id="followed-companies-section">
                  <FollowedCompaniesSection />
                </div>
              </div>

              {/* Right Column (4 cols): Profile Completion, Skills, Application Tracker, Market Insights */}
              <div className="lg:col-span-4 space-y-6">
                {/* Profile Completion */}
                <ProfileCompletionCard
                  percentage={profileCompletionPercentage}
                  onEditProfile={() => setIsProfileModalOpen(true)}
                  onViewProfile={() => setIsProfileModalOpen(true)}
                />

                {/* Your Skills */}
                <UserSkillsCard
                  skills={user?.skills || DEFAULT_CANDIDATE.skills}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                  onManageSkills={() => setIsProfileModalOpen(true)}
                />

                {/* Application Tracker */}
                <ApplicationTrackerCard
                  metrics={trackerMetrics}
                  onViewAll={() => {
                    setApplicationsModalTab("applied");
                    setIsApplicationsModalOpen(true);
                  }}
                  onFilterStatus={(status) => {
                    setApplicationsModalTab(status === "saved" ? "saved" : "applied");
                    setIsApplicationsModalOpen(true);
                  }}
                />

                {/* Job Market Insights */}
                <div id="job-market-insights-section">
                  <MarketInsightsCard
                    onViewFullInsights={() => {
                      router.push("/jobs");
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Bottom Section (2 Columns: Left ~60%, Right ~40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left: Resume Analysis (~60% = 7 cols) */}
              <div id="resume-analysis-section" className="lg:col-span-7">
                <ResumeAnalysisSection
                  resume={user?.resumeFile || DEFAULT_CANDIDATE.resumeFile}
                  onUploadResume={handleResumeUpload}
                  onRemoveResume={handleResumeRemove}
                  onAnalyzeResume={() => {}}
                />
              </div>

              {/* Right: Skill Gap Analysis (~40% = 5 cols) */}
              <div id="skill-gap-section" className="lg:col-span-5">
                <SkillGapSection
                  onViewDetailedAnalysis={() => {
                    setIsUpgradeModalOpen(true);
                  }}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onProfileUpdated={(updated) => setUser(updated)}
      />

      <ApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
        defaultTab={applicationsModalTab}
        appliedJobs={appliedJobs}
        bookmarks={bookmarks}
        onStatusChange={handleStatusChange}
        onDeleteApplied={handleDeleteApplied}
        onRemoveBookmark={handleRemoveBookmark}
      />

      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      <JobDetailModal
        isOpen={!!selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        job={selectedJobForDetails}
        onToggleBookmark={handleToggleBookmark}
        onApplyOfficial={handleApplyJob}
      />
    </div>
  );
}
