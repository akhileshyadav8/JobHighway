"use client";

import { useState, useEffect, useCallback } from "react";
import { getPrepRoleById, PrepRole } from "@/lib/preparationData";
import { computeAtsMatch, parseResumeFile } from "@/lib/resumeParser";
import { getCurrentUser, updateUserProfile, User } from "@/lib/auth";

export interface UploadedResumeMeta {
  name: string;
  size: number;
  uploadedAt: string;
  fileType?: string;
  dataUrl?: string;
  rawText?: string;
}

export interface TargetRoleMeta {
  id: string;
  name: string;
}

export interface ResumeAnalysisResult {
  uploadedResume: UploadedResumeMeta;
  targetRole: TargetRoleMeta;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  totalRequiredKeywords: number;
  totalMatchedKeywords: number;
  analysisTimestamp: string;
}

const ANALYSIS_STORAGE_PREFIX = "jobhighway_active_resume_analysis_";
const RAW_TEXT_STORAGE_PREFIX = "jobhighway_resume_text_";
export const RESUME_ANALYSIS_CHANGE_EVENT = "jobhighway_resume_analysis_updated";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getStorageKey(userId?: string): string {
  return `${ANALYSIS_STORAGE_PREFIX}${userId || "guest"}`;
}

function getRawTextStorageKey(userId?: string): string {
  return `${RAW_TEXT_STORAGE_PREFIX}${userId || "guest"}`;
}

/**
 * Stores raw resume text separately in localStorage to ensure it is never stripped
 * if user profile metadata is trimmed.
 */
export function storeResumeRawText(userId: string | undefined, rawText: string): void {
  if (!isBrowser() || !rawText) return;
  try {
    localStorage.setItem(getRawTextStorageKey(userId), rawText);
  } catch (e) {
    console.warn("Storage warning when saving resume rawText:", e);
  }
}

/**
 * Retrieves raw resume text from localStorage.
 */
export function getResumeRawText(userId?: string): string {
  if (!isBrowser()) return "";
  try {
    return localStorage.getItem(getRawTextStorageKey(userId)) || "";
  } catch {
    return "";
  }
}

/**
 * Executes the single, canonical ATS analysis for an uploaded resume and target job role.
 * Both Prepare and Dashboard use this exact function.
 */
export function runSharedResumeAnalysis(
  resumeMeta: UploadedResumeMeta,
  rawText: string,
  skills: string[],
  targetRoleInput: string
): ResumeAnalysisResult {
  const canonicalRole: PrepRole = getPrepRoleById(targetRoleInput);
  const targetKeywords = canonicalRole.resumeGuidance?.atsKeywords || [];

  const effectiveRawText = rawText || resumeMeta.rawText || "";
  const match = computeAtsMatch(effectiveRawText, skills, targetKeywords);

  return {
    uploadedResume: {
      name: resumeMeta.name,
      size: resumeMeta.size,
      uploadedAt: resumeMeta.uploadedAt,
      fileType: resumeMeta.fileType,
      dataUrl: resumeMeta.dataUrl,
      rawText: effectiveRawText
    },
    targetRole: {
      id: canonicalRole.id,
      name: canonicalRole.name
    },
    atsScore: match.atsScore,
    matchedKeywords: match.matchedKeywords,
    missingKeywords: match.missingKeywords,
    totalRequiredKeywords: targetKeywords.length,
    totalMatchedKeywords: match.matchedKeywords.length,
    analysisTimestamp: new Date().toISOString()
  };
}

/**
 * Reads the active shared analysis from localStorage.
 */
export function getStoredResumeAnalysis(userId?: string): ResumeAnalysisResult | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves the active shared analysis to localStorage and dispatches a broadcast event.
 */
export function storeResumeAnalysis(userId: string | undefined, analysis: ResumeAnalysisResult): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(analysis));
  } catch (e) {
    // If quota error, strip rawText from the cached analysis object
    try {
      const stripped = {
        ...analysis,
        uploadedResume: { ...analysis.uploadedResume, rawText: undefined, dataUrl: undefined }
      };
      localStorage.setItem(getStorageKey(userId), JSON.stringify(stripped));
    } catch {
      // ignore
    }
  }

  // Broadcast to all listening tabs/components
  window.dispatchEvent(
    new CustomEvent(RESUME_ANALYSIS_CHANGE_EVENT, { detail: analysis })
  );
}

/**
 * Clears the active shared analysis from localStorage and notifies listeners.
 */
export function clearStoredResumeAnalysis(userId?: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(getStorageKey(userId));
    localStorage.removeItem(getRawTextStorageKey(userId));
  } catch {}

  window.dispatchEvent(
    new CustomEvent(RESUME_ANALYSIS_CHANGE_EVENT, { detail: null })
  );
}

/**
 * Re-reads current resume from user profile or dedicated storage and re-analyzes from scratch.
 * Updates both Prepare and Dashboard immediately.
 */
export function refreshResumeAnalysis(
  userId: string | undefined,
  targetRoleInput?: string
): ResumeAnalysisResult | null {
  if (!isBrowser()) return null;

  const user = getCurrentUser();
  const effectiveUserId = userId || user?.id;
  const resumeFile = user?.resumeFile;

  if (!resumeFile) {
    clearStoredResumeAnalysis(effectiveUserId);
    return null;
  }

  const rawText = resumeFile.rawText || getResumeRawText(effectiveUserId);
  const skills = user?.skills || [];
  const targetRole = targetRoleInput || user?.targetRole || "Data Analyst";

  const analysis = runSharedResumeAnalysis(
    {
      name: resumeFile.name,
      size: resumeFile.size,
      uploadedAt: resumeFile.uploadedAt,
      fileType: resumeFile.fileType,
      dataUrl: resumeFile.dataUrl,
      rawText
    },
    rawText,
    skills,
    targetRole
  );

  // Store in dedicated key
  storeResumeAnalysis(effectiveUserId, analysis);
  if (rawText) storeResumeRawText(effectiveUserId, rawText);

  // Update user profile record with synchronized ATS values
  if (effectiveUserId) {
    updateUserProfile(effectiveUserId, {
      resumeFile: {
        ...resumeFile,
        rawText,
        atsScore: analysis.atsScore,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords
      }
    });
  }

  return analysis;
}

/**
 * Handles uploading or replacing a resume from any page.
 * Completely invalidates stale analysis, extracts text, computes new analysis,
 * and updates user profile and shared analysis store.
 */
export async function processResumeUpload(
  file: File,
  userId: string | undefined,
  targetRoleInput?: string
): Promise<{ user: User | null; analysis: ResumeAnalysisResult }> {
  // 1. Invalidate previous analysis immediately
  clearStoredResumeAnalysis(userId);

  // 2. Parse file and extract content
  const extracted = await parseResumeFile(file);
  const rawText = extracted.rawText || "";

  // 3. Read dataUrl for download/preview
  let dataUrl: string | undefined;
  try {
    dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  } catch {
    dataUrl = undefined;
  }

  const fileExt = file.name.substring(file.name.lastIndexOf(".")).replace(".", "").toUpperCase() || "PDF";
  const user = getCurrentUser();
  const effectiveUserId = userId || user?.id;

  const currentSkills = user?.skills || [];
  const currentLowerSet = new Set(currentSkills.map((s) => s.toLowerCase().trim()));
  const uniqueNewSkills = (extracted.skills || []).filter(
    (s) => !currentLowerSet.has(s.toLowerCase().trim())
  );
  const mergedSkills = [...currentSkills, ...uniqueNewSkills];

  const targetRole = targetRoleInput || user?.targetRole || extracted.targetRole || "Data Analyst";

  // 4. Compute single source of truth analysis
  const resumeMeta: UploadedResumeMeta = {
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    fileType: fileExt,
    dataUrl,
    rawText
  };

  const analysis = runSharedResumeAnalysis(resumeMeta, rawText, mergedSkills, targetRole);

  // 5. Store dedicated rawText and analysis
  if (rawText) storeResumeRawText(effectiveUserId, rawText);
  storeResumeAnalysis(effectiveUserId, analysis);

  // 6. Update user profile
  let updatedUser: User | null = null;
  if (effectiveUserId) {
    const profileUpdates: Partial<User> = {
      resumeFile: {
        name: file.name,
        size: file.size,
        uploadedAt: resumeMeta.uploadedAt,
        dataUrl,
        fileType: fileExt,
        status: "Active ATS Resume",
        atsScore: analysis.atsScore,
        rawText,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords
      },
      skills: mergedSkills,
      resumeExtractedNotice: true
    };

    if (!user?.name && extracted.name) profileUpdates.name = extracted.name;
    if (!user?.phone && extracted.phone) profileUpdates.phone = extracted.phone;
    if (!user?.targetRole && targetRole) profileUpdates.targetRole = targetRole;
    if (!user?.currentRole && extracted.currentRole) profileUpdates.currentRole = extracted.currentRole;
    if (!user?.preferredLocation && extracted.preferredLocation) profileUpdates.preferredLocation = extracted.preferredLocation;
    if (!user?.yearsExperience && extracted.yearsExperience) profileUpdates.yearsExperience = extracted.yearsExperience;
    if (!user?.education && extracted.education) profileUpdates.education = extracted.education;
    if (!user?.graduationYear && extracted.graduationYear) profileUpdates.graduationYear = extracted.graduationYear;
    if (!user?.linkedinUrl && extracted.linkedinUrl) profileUpdates.linkedinUrl = extracted.linkedinUrl;
    if (!user?.githubUrl && extracted.githubUrl) profileUpdates.githubUrl = extracted.githubUrl;

    updatedUser = updateUserProfile(effectiveUserId, profileUpdates);
  }

  return { user: updatedUser, analysis };
}

/**
 * React Hook for pages and components to consume the shared single-source-of-truth analysis.
 * Reacts automatically to updates from other pages, role switches, and file changes.
 */
export function useSharedResumeAnalysis(
  targetRole: string = "Data Analyst",
  userId?: string
) {
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(() => {
    return getStoredResumeAnalysis(userId);
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync state with shared store
  const syncAnalysis = useCallback(() => {
    const user = getCurrentUser();
    const effectiveUserId = userId || user?.id;

    if (!user?.resumeFile) {
      setAnalysis(null);
      return;
    }

    const stored = getStoredResumeAnalysis(effectiveUserId);
    const canonicalRole = getPrepRoleById(targetRole);

    // If stored analysis exists and matches the target role, use it
    if (stored && stored.targetRole?.id === canonicalRole.id && stored.uploadedResume?.name === user.resumeFile.name) {
      setAnalysis(stored);
      return;
    }

    // Otherwise, calculate dynamically using the canonical keywords and save to keep in sync
    const rawText = user.resumeFile.rawText || getResumeRawText(effectiveUserId);
    const skills = user.skills || [];
    const fresh = runSharedResumeAnalysis(
      {
        name: user.resumeFile.name,
        size: user.resumeFile.size,
        uploadedAt: user.resumeFile.uploadedAt,
        fileType: user.resumeFile.fileType,
        dataUrl: user.resumeFile.dataUrl,
        rawText
      },
      rawText,
      skills,
      targetRole
    );

    storeResumeAnalysis(effectiveUserId, fresh);
    setAnalysis(fresh);
  }, [targetRole, userId]);

  useEffect(() => {
    syncAnalysis();

    const handleAnalysisChange = (e: any) => {
      const detail = e.detail as ResumeAnalysisResult | null;
      if (detail) {
        const canonicalRole = getPrepRoleById(targetRole);
        if (detail.targetRole?.id === canonicalRole.id) {
          setAnalysis(detail);
        } else {
          // Re-sync for this component's active role
          syncAnalysis();
        }
      } else {
        setAnalysis(null);
      }
    };

    const handleAuthChange = () => {
      syncAnalysis();
    };

    window.addEventListener(RESUME_ANALYSIS_CHANGE_EVENT, handleAnalysisChange);
    window.addEventListener("jobhighway_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(RESUME_ANALYSIS_CHANGE_EVENT, handleAnalysisChange);
      window.removeEventListener("jobhighway_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [syncAnalysis, targetRole]);

  const handleRefresh = useCallback(async (): Promise<ResumeAnalysisResult | null> => {
    setIsAnalyzing(true);
    try {
      // Simulate brief parsing transition for authentic feedback
      await new Promise((resolve) => setTimeout(resolve, 350));
      const res = refreshResumeAnalysis(userId, targetRole);
      setAnalysis(res);
      return res;
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId, targetRole]);

  const handleUpload = useCallback(
    async (file: File): Promise<ResumeAnalysisResult | null> => {
      setIsAnalyzing(true);
      try {
        const res = await processResumeUpload(file, userId, targetRole);
        setAnalysis(res.analysis);
        return res.analysis;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [userId, targetRole]
  );

  const handleRemove = useCallback(() => {
    const user = getCurrentUser();
    const effectiveUserId = userId || user?.id;
    if (effectiveUserId) {
      updateUserProfile(effectiveUserId, { resumeFile: undefined, resumeExtractedNotice: false });
    }
    clearStoredResumeAnalysis(effectiveUserId);
    setAnalysis(null);
  }, [userId]);

  return {
    analysis,
    isAnalyzing,
    refreshAnalysis: handleRefresh,
    uploadResume: handleUpload,
    removeResume: handleRemove
  };
}
