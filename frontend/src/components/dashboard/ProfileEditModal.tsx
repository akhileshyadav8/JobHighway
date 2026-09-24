"use client";

import React, { useState, useEffect } from "react";
import { X, Save, User as UserIcon, Phone, Globe, GraduationCap, Briefcase, CheckCircle2, Sparkles } from "lucide-react";
import { User, updateUserProfile } from "@/lib/auth";

export interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onProfileUpdated: (updatedUser: User) => void;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  user,
  onProfileUpdated
}: ProfileEditModalProps) {
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
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setLinkedinUrl(user.linkedinUrl || "");
      setGithubUrl(user.githubUrl || "");
      setPortfolioUrl(user.portfolioUrl || "");
      setCurrentRole(user.currentRole || "");
      setYearsExperience(user.yearsExperience || "");
      education !== undefined && setEducation(user.education || "");
      setGraduationYear(user.graduationYear || "");
      setTargetCtc(user.targetCtc || "");
      setPreferredLocation(user.preferredLocation || "");
      setTargetRole(user.targetRole || "");
      setSkillsStr((user.skills || []).join(", "));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const skills = skillsStr
      .split(",")
      .map((s) => s.trim())
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
      skills
    });

    if (updated) {
      onProfileUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit Candidate Profile
            </h2>
            <p className="text-xs text-slate-500">
              Update your personal details, target role, and career preferences.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        {user?.resumeFile && (
          <div className="mb-4 p-3 rounded-xl bg-teal-50/80 border border-teal-200 text-teal-800 text-xs flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Profile information detected from your resume (<strong>{user.resumeFile.name}</strong>). You can review, edit, or customize any field below before saving.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Portfolio Website
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Career & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Role / Title
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="e.g. Data Scientist, Analyst"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Years of Experience
              </label>
              <input
                type="text"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g. 2 Years, 3+ Years"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Education & Graduation Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Highest Education
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. M.Sc Data Science, B.Tech Computer Science"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Target Role & Preferred Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Data Scientist"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Locations
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Remote"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Core Skills (comma separated)
            </label>
            <textarea
              rows={2}
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="e.g. Python, SQL, Machine Learning, Power BI, Deep Learning"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-teal-500 focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
