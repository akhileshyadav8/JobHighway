"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Settings, 
  Bell, 
  Shield, 
  Briefcase, 
  Key, 
  Check, 
  Save, 
  Lock, 
  Eye, 
  Mail, 
  Globe 
} from "lucide-react";
import { User } from "@/lib/auth";

export interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export interface UserSettingsState {
  instantEmailAlerts: boolean;
  dailyDigest: boolean;
  applicationUpdates: boolean;
  weeklyInsights: boolean;
  recruiterVisibility: boolean;
  stealthMode: boolean;
  preferredWorkMode: {
    remote: boolean;
    hybrid: boolean;
    onsite: boolean;
  };
  targetDomain: string;
  minMatchScore: number;
}

const DEFAULT_SETTINGS: UserSettingsState = {
  instantEmailAlerts: true,
  dailyDigest: true,
  applicationUpdates: true,
  weeklyInsights: false,
  recruiterVisibility: true,
  stealthMode: false,
  preferredWorkMode: {
    remote: true,
    hybrid: true,
    onsite: false
  },
  targetDomain: "Data Science & AI",
  minMatchScore: 80
};

export function AccountSettingsModal({
  isOpen,
  onClose,
  user
}: AccountSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"notifications" | "preferences" | "privacy" | "security">("notifications");
  const [settings, setSettings] = useState<UserSettingsState>(DEFAULT_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const savedKey = `jobpulse_user_settings_${user.id}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
        } catch (e) {}
      }
    }
  }, [user?.id, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (user?.id) {
      const savedKey = `jobpulse_user_settings_${user.id}`;
      localStorage.setItem(savedKey, JSON.stringify(settings));
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Account & Platform Settings
              </h2>
              <p className="text-xs text-slate-500">
                Configure your notification alerts, job matching criteria, and recruiter privacy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 overflow-x-auto">
          {[
            { id: "notifications", label: "Alerts & Notifications", icon: Bell },
            { id: "preferences", label: "Job Search Criteria", icon: Briefcase },
            { id: "privacy", label: "Privacy & Recruiter", icon: Shield },
            { id: "security", label: "Security & Login", icon: Key }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "notifications" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant Role Match Email Alerts</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Receive an immediate email alert when an official career posting matches your skills by 85%+.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, instantEmailAlerts: !settings.instantEmailAlerts })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.instantEmailAlerts ? "bg-teal-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition mt-0.5 ${
                      settings.instantEmailAlerts ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Daily Morning Job Digest</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    A curated briefing delivered to your inbox at 9:00 AM with fresh openings from followed companies.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, dailyDigest: !settings.dailyDigest })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.dailyDigest ? "bg-teal-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition mt-0.5 ${
                      settings.dailyDigest ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Application Status Alerts</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Notifications when an active application's status is updated or the company closes the requisition.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, applicationUpdates: !settings.applicationUpdates })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.applicationUpdates ? "bg-teal-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition mt-0.5 ${
                      settings.applicationUpdates ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Weekly Tech Hiring Market Insights</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Comprehensive breakdown of trending tech stacks, hiring volume, and compensation shifts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, weeklyInsights: !settings.weeklyInsights })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.weeklyInsights ? "bg-teal-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition mt-0.5 ${
                      settings.weeklyInsights ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Primary Target Domain
                </label>
                <select
                  value={settings.targetDomain}
                  onChange={(e) => setSettings({ ...settings, targetDomain: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="Data Science & AI">Data Science & Artificial Intelligence</option>
                  <option value="Machine Learning & MLOps">Machine Learning & MLOps Engineering</option>
                  <option value="Software Engineering">Full Stack & Backend Software Engineering</option>
                  <option value="Product & Business Intelligence">Product & Business Intelligence Analytics</option>
                  <option value="Cloud & DevOps">Cloud Infrastructure & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Preferred Work Modes
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { key: "remote", label: "Remote" },
                    { key: "hybrid", label: "Hybrid" },
                    { key: "onsite", label: "On-site" }
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          preferredWorkMode: {
                            ...settings.preferredWorkMode,
                            [mode.key]: !(settings.preferredWorkMode as any)[mode.key]
                          }
                        })
                      }
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        (settings.preferredWorkMode as any)[mode.key]
                          ? "bg-teal-50 border-teal-300 text-teal-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {(settings.preferredWorkMode as any)[mode.key] && "✓ "}
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Minimum Auto-Match Score
                  </label>
                  <span className="text-xs font-bold text-teal-700">{settings.minMatchScore}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={settings.minMatchScore}
                  onChange={(e) => setSettings({ ...settings, minMatchScore: Number(e.target.value) })}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>60% (Broad)</span>
                  <span>80% (Recommended)</span>
                  <span>95% (Exact)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Verified Recruiter Visibility</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Allow verified talent partners at hiring companies to discover your profile and invite you to interview.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, recruiterVisibility: !settings.recruiterVisibility })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.recruiterVisibility ? "bg-teal-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition mt-0.5 ${
                      settings.recruiterVisibility ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Stealth Mode (Employer Privacy)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically hides your profile, activity, and applications from recruiters affiliated with your current employer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, stealthMode: !settings.stealthMode })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                    settings.stealthMode ? "bg-teal-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition mt-0.5 ${
                      settings.stealthMode ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Connected Account Email
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-800">
                    {user?.email || "candidate@jobpulse.ai"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Change Account Password</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Update your password to keep your job search data secure.
                  </p>
                </div>
                <a
                  href="/reset-password"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Update
                </a>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Active Login Sessions</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Currently signed in on this Windows device.
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Current Session
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
