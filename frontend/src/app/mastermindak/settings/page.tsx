"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, 
  RefreshCw, 
  Radio, 
  Bell, 
  Lock, 
  Sliders, 
  Check, 
  Save,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<"general" | "pipeline" | "sources" | "notifications" | "security">("general");

  // General settings state
  const [siteName, setSiteName] = useState("JobHighway");
  const [siteDescription, setSiteDescription] = useState("World's Fastest Official Job Engine • Official ATS Stream Synced Hourly");
  const [adminEmail, setAdminEmail] = useState("yadavakhil766@gmail.com");
  const [timezone, setTimezone] = useState("Asia/Kolkata (UTC+05:30)");

  // Pipeline settings
  const [syncInterval, setSyncInterval] = useState("30");
  const [autoExpireDays, setAutoExpireDays] = useState("30");
  const [linkVerificationRate, setLinkVerificationRate] = useState("15");

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [failureThreshold, setFailureThreshold] = useState("5");

  // Save state
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("jobhighway_admin_settings");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.siteName) setSiteName(s.siteName);
        if (s.siteDescription) setSiteDescription(s.siteDescription);
        if (s.adminEmail) setAdminEmail(s.adminEmail);
        if (s.timezone) setTimezone(s.timezone);
        if (s.syncInterval) setSyncInterval(s.syncInterval);
        if (s.autoExpireDays) setAutoExpireDays(s.autoExpireDays);
        if (s.linkVerificationRate) setLinkVerificationRate(s.linkVerificationRate);
        if (typeof s.emailAlerts === "boolean") setEmailAlerts(s.emailAlerts);
        if (s.failureThreshold) setFailureThreshold(s.failureThreshold);
      }
    } catch {}
  }, []);

  const handleSave = () => {
    const settings = {
      siteName,
      siteDescription,
      adminEmail,
      timezone,
      syncInterval,
      autoExpireDays,
      linkVerificationRate,
      emailAlerts,
      failureThreshold
    };
    try {
      localStorage.setItem("jobhighway_admin_settings", JSON.stringify(settings));
      const { logAdminActivity } = require("@/lib/adminData");
      logAdminActivity("Settings Updated", "Admin updated pipeline cadences and system parameters", "system");
    } catch {}
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/mastermindak" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600" />
            <span>Admin Operations Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage platform configuration, sync schedules, alert triggers, and administrator preferences.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-2xs gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? "Saved Successfully!" : "Save Changes"}</span>
        </Button>
      </div>

      {/* Settings Container with Secondary Sidebar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left Secondary Settings Nav */}
        <div className="md:col-span-3 border-r border-slate-200/90 p-4 space-y-1 bg-slate-50/50">
          <button
            onClick={() => setActiveSection("general")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === "general"
                ? "bg-teal-50 text-teal-700 shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>General</span>
          </button>

          <button
            onClick={() => setActiveSection("pipeline")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === "pipeline"
                ? "bg-teal-50 text-teal-700 shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <RefreshCw className="w-4 h-4 text-teal-600" />
            <span>Job Pipeline</span>
          </button>

          <button
            onClick={() => setActiveSection("sources")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === "sources"
                ? "bg-teal-50 text-teal-700 shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Radio className="w-4 h-4 text-teal-600" />
            <span>ATS Sources</span>
          </button>

          <button
            onClick={() => setActiveSection("notifications")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === "notifications"
                ? "bg-teal-50 text-teal-700 shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Bell className="w-4 h-4 text-teal-600" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveSection("security")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === "security"
                ? "bg-teal-50 text-teal-700 shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Lock className="w-4 h-4 text-teal-600" />
            <span>Security</span>
          </button>
        </div>

        {/* Right Settings Body */}
        <div className="md:col-span-9 p-6 sm:p-8 space-y-6">
          {activeSection === "general" && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">General Operations Settings</h3>
                <p className="text-xs text-slate-400">Basic site metadata, time zone, and primary contact address.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Site Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Site Description Tagline</label>
                  <input
                    type="text"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Administrator Notification Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">System Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-2">
                  <label className="font-semibold text-slate-700 block mb-2">JobHighway Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                      <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-xs text-slate-500 font-mono">/logo.png (JobHighway High-Res SVG/PNG)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "pipeline" && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Job Ingestion Pipeline</h3>
                <p className="text-xs text-slate-400">Configure crawler cadence, automatic de-indexing, and rate limits.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">ATS Polling Cadence (Minutes)</label>
                  <input
                    type="number"
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Default: 30 minutes between automated crawls.</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Automatic Expiration Threshold (Days)</label>
                  <input
                    type="number"
                    value={autoExpireDays}
                    onChange={(e) => setAutoExpireDays(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Jobs unrefreshed after 30 days are automatically archived.</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === "sources" && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Supported ATS Platforms</h3>
                <p className="text-xs text-slate-400">Enable or disable individual source adapters.</p>
              </div>

              <div className="space-y-2.5 text-xs">
                {["Greenhouse", "Lever", "Workday", "Ashby", "SmartRecruiters", "iCIMS", "Taleo", "Official Domains"].map((s) => (
                  <div key={s} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <span className="font-bold text-slate-800">{s} Adapter</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Enabled</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Operational Alerts</h3>
                <p className="text-xs text-slate-400">Set threshold triggers for crawler alerts and broken link warnings.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Critical Pipeline Failure Alerts</span>
                    <span className="text-slate-400 text-[11px]">Notify operator via email when a source encounters 3 consecutive timeouts.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">Security &amp; Master Credentials</h3>
                <p className="text-xs text-slate-400">Founder session security and administrator credentials.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2">
                <div>
                  <span className="text-slate-500">Master Admin:</span>
                  <span className="font-bold text-slate-900 ml-2 font-mono">yadavakhil766@gmail.com</span>
                </div>
                <div>
                  <span className="text-slate-500">Role:</span>
                  <span className="font-bold text-teal-700 ml-2">Verified Founder Operator</span>
                </div>
                <div>
                  <span className="text-slate-500">Session Security:</span>
                  <span className="font-bold text-slate-800 ml-2">256-bit encrypted token session</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
