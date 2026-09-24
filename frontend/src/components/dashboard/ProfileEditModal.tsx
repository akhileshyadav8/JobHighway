"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Save, 
  User as UserIcon, 
  Phone, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  Upload,
  RefreshCw,
  Trash2,
  FileCheck2,
  Loader2
} from "lucide-react";
import { User, updateUserProfile } from "@/lib/auth";
import { parseResumeFile } from "@/lib/resumeParser";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeNotice, setResumeNotice] = useState("");

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

  // Handler for uploading & parsing resume to auto-fill profile fields
  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsParsingResume(true);
    setResumeNotice("");

    try {
      // 1. Parse text & extract structured profile metadata
      const extracted = await parseResumeFile(file);

      // 2. Pre-fill state text fields immediately
      if (extracted.name) setName(extracted.name);
      if (extracted.phone) setPhone(extracted.phone);
      if (extracted.targetRole) setTargetRole(extracted.targetRole);
      if (extracted.currentRole) setCurrentRole(extracted.currentRole);
      if (extracted.preferredLocation) setPreferredLocation(extracted.preferredLocation);
      if (extracted.yearsExperience) setYearsExperience(extracted.yearsExperience);
      if (extracted.education) setEducation(extracted.education);
      if (extracted.graduationYear) setGraduationYear(extracted.graduationYear);
      if (extracted.linkedinUrl) setLinkedinUrl(extracted.linkedinUrl);
      if (extracted.githubUrl) setGithubUrl(extracted.githubUrl);

      // 3. Merge skills
      const existingSkills = skillsStr ? skillsStr.split(",").map((s) => s.trim()).filter(Boolean) : (user.skills || []);
      const existingLower = new Set(existingSkills.map((s) => s.toLowerCase()));
      const newSkills = (extracted.skills || []).filter((s) => !existingLower.has(s.toLowerCase()));
      const combined = [...existingSkills, ...newSkills];
      setSkillsStr(combined.join(", "));

      // 4. Save file data to localStorage
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const fileExt = file.name.substring(file.name.lastIndexOf(".")).replace(".", "").toUpperCase() || "PDF";
        const fileData = {
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          dataUrl,
          fileType: fileExt,
          status: "Active ATS Resume",
          atsScore: 94
        };

        const updated = updateUserProfile(user.id, {
          resumeFile: fileData,
          skills: combined,
          name: extracted.name || name,
          phone: extracted.phone || phone,
          targetRole: extracted.targetRole || targetRole,
          currentRole: extracted.currentRole || currentRole,
          preferredLocation: extracted.preferredLocation || preferredLocation,
          yearsExperience: extracted.yearsExperience || yearsExperience,
          education: extracted.education || education,
          graduationYear: extracted.graduationYear || graduationYear,
          linkedinUrl: extracted.linkedinUrl || linkedinUrl,
          githubUrl: extracted.githubUrl || githubUrl
        });

        if (updated) onProfileUpdated(updated);
        setIsParsingResume(false);
        setResumeNotice(`Resume parsed! Profile fields have been auto-populated from "${file.name}". You can review or edit any fields below.`);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Resume parsing error:", err);
      setIsParsingResume(false);
    }
  };

  const handleRemoveResume = () => {
    if (!user) return;
    const updated = updateUserProfile(user.id, { resumeFile: undefined });
    if (updated) onProfileUpdated(updated);
    setResumeNotice("");
  };

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

        {/* Dedicated Resume Upload & Auto-fill Section */}
        <div className="mb-6 p-4 rounded-2xl border border-teal-200/90 bg-gradient-to-r from-teal-50/60 via-emerald-50/30 to-teal-50/50">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Resume & Auto-Fill Profile
              </h3>
            </div>
            {user?.resumeFile && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ATS Score: {user.resumeFile.atsScore || 94}%
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 mb-3">
            Upload your resume (.PDF, .DOCX) to automatically parse your skills, experience, and contact details directly into the fields below.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleResumeFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          {user?.resumeFile ? (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-teal-200 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate" title={user.resumeFile.name}>
                    {user.resumeFile.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {(user.resumeFile.size / 1024).toFixed(0)} KB · Uploaded {new Date(user.resumeFile.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isParsingResume}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isParsingResume ? "animate-spin" : ""}`} />
                  <span>{isParsingResume ? "Parsing..." : "Replace"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs transition-colors cursor-pointer shadow-2xs"
                  title="Remove stored resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsingResume}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-teal-300 hover:border-teal-500 bg-white/80 hover:bg-white text-teal-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              {isParsingResume ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span>Extracting resume data and auto-filling profile...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-teal-600" />
                  <span>Upload Resume to Auto-Fill Profile Fields</span>
                </>
              )}
            </button>
          )}

          {resumeNotice && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resumeNotice}</span>
            </div>
          )}
        </div>

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
