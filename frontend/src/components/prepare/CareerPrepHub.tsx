"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  Layers,
  Code2,
  Database,
  Cloud,
  BrainCircuit,
  FileText,
  Award,
  Zap,
  Target,
  Compass,
  ShieldCheck,
  Briefcase,
  Search,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  X,
  TrendingUp,
  Building2,
  BarChart3,
  HelpCircle,
  SlidersHorizontal,
  BookmarkCheck,
  Check,
  Copy,
  Info,
  Laptop
} from "lucide-react";
import {
  PrepRole,
  ALL_PREPARATION_ROLES,
  getPrepRoleById,
  PREP_COMPANIES,
  CompanyPrepItem,
  RoadmapStep,
  PracticeQuestion
} from "@/lib/preparationData";
import { getCurrentUser, updateUserProfile, User } from "@/lib/auth";

export function CareerPrepHub({ initialRoleId }: { initialRoleId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Role State
  const queryRole = searchParams.get("role") || initialRoleId;
  const [selectedRole, setSelectedRole] = useState<PrepRole>(() => getPrepRoleById(queryRole));
  const [roleSearchOpen, setRoleSearchOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 2. Interactive Company Modal State
  const [selectedCompany, setSelectedCompany] = useState<CompanyPrepItem | null>(null);

  // 3. User Progress Persistence State (stored in localStorage)
  // Stored format: { [roleId]: { completedRoadmap: string[], completedSkills: string[], completedQuestions: string[] } }
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set());
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  // 4. Practice Questions Filter State
  const [questionDifficultyFilter, setQuestionDifficultyFilter] = useState<string>("All");
  const [questionTopicFilter, setQuestionTopicFilter] = useState<string>("All");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // 5. Active Tab for Deep Dives
  const [activeTab, setActiveTab] = useState<"roadmap" | "skills" | "interview" | "practice" | "projects" | "resume">("roadmap");

  // Load auth state and user preference on mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    // If query has no role but user has a targetRole in their profile
    if (!queryRole && user?.targetRole) {
      const matched = getPrepRoleById(user.targetRole);
      setSelectedRole(matched);
    } else if (queryRole) {
      setSelectedRole(getPrepRoleById(queryRole));
    }
  }, [queryRole]);

  // Load progress from localStorage for this specific role and user
  useEffect(() => {
    try {
      const userPrefix = currentUser?.id ? `user_${currentUser.id}_` : "guest_";
      const key = `jobhighway_prep_${userPrefix}${selectedRole.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedSteps(new Set(data.completedSteps || []));
        setCompletedSkills(new Set(data.completedSkills || []));
        setCompletedQuestions(new Set(data.completedQuestions || []));
      } else {
        setCompletedSteps(new Set());
        setCompletedSkills(new Set());
        setCompletedQuestions(new Set());
      }
    } catch (e) {
      // ignore
    }
  }, [selectedRole.id, currentUser?.id]);

  // Save progress changes
  const saveProgress = (
    newSteps: Set<string>,
    newSkills: Set<string>,
    newQuestions: Set<string>
  ) => {
    try {
      const userPrefix = currentUser?.id ? `user_${currentUser.id}_` : "guest_";
      const key = `jobhighway_prep_${userPrefix}${selectedRole.id}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          completedSteps: Array.from(newSteps),
          completedSkills: Array.from(newSkills),
          completedQuestions: Array.from(newQuestions)
        })
      );
    } catch (e) {
      // ignore
    }
  };

  // Toggle roadmap step completion
  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      saveProgress(next, completedSkills, completedQuestions);
      return next;
    });
  };

  // Toggle skill completion
  const toggleSkill = (skill: string) => {
    setCompletedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      saveProgress(completedSteps, next, completedQuestions);
      return next;
    });
  };

  // Toggle practice question completion
  const toggleQuestion = (questionId: string) => {
    setCompletedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      saveProgress(completedSteps, completedSkills, next);
      return next;
    });
  };

  // Switch Role
  const handleSelectRole = (role: PrepRole) => {
    setSelectedRole(role);
    setRoleSearchOpen(false);
    setRoleSearchTerm("");
    setExpandedQuestionId(null);

    // Update URL cleanly
    const url = new URL(window.location.href);
    url.searchParams.set("role", role.id);
    window.history.pushState({}, "", url.toString());

    // If user is logged in, optionally update their preferred target role
    if (currentUser?.id) {
      updateUserProfile(currentUser.id, { targetRole: role.name });
    }
  };

  // Progress metrics calculations
  const totalRoadmapSteps = selectedRole.roadmap.length;
  const completedRoadmapCount = completedSteps.size;
  const roadmapPercent = totalRoadmapSteps > 0 ? Math.round((completedRoadmapCount / totalRoadmapSteps) * 100) : 0;

  const totalSkillsCount = selectedRole.skills.mustKnow.length + selectedRole.skills.goodToKnow.length;
  const completedSkillsCount = completedSkills.size;
  const skillsPercent = totalSkillsCount > 0 ? Math.round((completedSkillsCount / totalSkillsCount) * 100) : 0;

  const totalQuestionsCount = selectedRole.practiceQuestions.length;
  const completedQuestionsCount = completedQuestions.size;
  const questionsPercent = totalQuestionsCount > 0 ? Math.round((completedQuestionsCount / totalQuestionsCount) * 100) : 0;

  const overallScore = Math.round(roadmapPercent * 0.45 + skillsPercent * 0.35 + questionsPercent * 0.2);

  // Dynamic next recommended topic
  const nextRecommendedStep = useMemo(() => {
    for (const step of selectedRole.roadmap) {
      if (!completedSteps.has(step.id)) {
        return step;
      }
    }
    return selectedRole.roadmap[0];
  }, [selectedRole.roadmap, completedSteps]);

  // Filtered practice questions
  const filteredQuestions = useMemo(() => {
    return selectedRole.practiceQuestions.filter(q => {
      const diffMatch = questionDifficultyFilter === "All" || q.difficulty === questionDifficultyFilter;
      const topicMatch = questionTopicFilter === "All" || q.topic === questionTopicFilter;
      return diffMatch && topicMatch;
    });
  }, [selectedRole.practiceQuestions, questionDifficultyFilter, questionTopicFilter]);

  // Unique topics for questions filter
  const questionTopics = useMemo(() => {
    const set = new Set<string>();
    selectedRole.practiceQuestions.forEach(q => set.add(q.topic));
    return Array.from(set);
  }, [selectedRole.practiceQuestions]);

  // Copy ATS keywords to clipboard
  const handleCopyKeywords = () => {
    const text = selectedRole.resumeGuidance.atsKeywords.join(", ");
    navigator.clipboard.writeText(text);
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  // Filter roles in search dropdown
  const searchedRoles = useMemo(() => {
    if (!roleSearchTerm.trim()) return ALL_PREPARATION_ROLES;
    const q = roleSearchTerm.toLowerCase();
    return ALL_PREPARATION_ROLES.filter(r => 
      r.name.toLowerCase().includes(q) || 
      r.category.toLowerCase().includes(q) ||
      r.tagline.toLowerCase().includes(q)
    );
  }, [roleSearchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. HERO SECTION WITH ROLE SEARCH & QUICK ROLES (Matches Reference Image) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/80 via-emerald-50/20 to-slate-50 border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-16">
        {/* World map background */}
        <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full overflow-hidden pointer-events-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/world.svg"
            alt="Global Career Network World Map"
            className="w-full h-full object-contain object-right pointer-events-none select-none relative z-0 opacity-40 sm:opacity-45"
          />
        </div>

        <div className="container mx-auto max-w-[1360px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-teal-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <GraduationCap className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>JobHighway Career Preparation Hub</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                Prepare Better.<br />
                <span className="text-teal-600 font-black">Convert More Interviews.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-xl leading-relaxed">
                Curated interview guides, study resources, and role-wise roadmaps to help you crack technical rounds and land offers from top companies.
              </p>

              {/* Role Search Bar Input */}
              <div className="relative w-full max-w-2xl mb-3">
                <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-1.5 min-h-[54px]">
                  <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={roleSearchTerm}
                    onChange={(e) => {
                      setRoleSearchTerm(e.target.value);
                      setRoleSearchOpen(true);
                    }}
                    onFocus={() => setRoleSearchOpen(true)}
                    placeholder="Search for a role (e.g. Software Engineer, Data Analyst, Product Manager...)"
                    className="w-full bg-transparent px-3 py-1.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                  {roleSearchTerm && (
                    <button
                      onClick={() => setRoleSearchTerm("")}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 mr-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (searchedRoles.length > 0) {
                        handleSelectRole(searchedRoles[0]);
                      }
                    }}
                    className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold px-5 sm:px-6 h-10 rounded-lg flex items-center gap-2 text-sm shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Search</span>
                  </button>
                </div>

                {/* Search Autocomplete Dropdown */}
                {roleSearchOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setRoleSearchOpen(false)} 
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-30 overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      <div className="px-3 py-2 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Available Job Roles ({searchedRoles.length})
                      </div>
                      {searchedRoles.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => handleSelectRole(role)}
                          className="w-full px-4 py-2.5 text-left hover:bg-teal-50/70 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-teal-700">
                              {role.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {role.tagline}
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {role.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Popular Roles Quick Links */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Popular roles:</span>
                {ALL_PREPARATION_ROLES.map((r, idx) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r)}
                    className={`font-medium transition-colors hover:text-teal-700 cursor-pointer ${
                      selectedRole.id === r.id ? "text-teal-700 font-bold underline decoration-teal-500 underline-offset-4" : "text-slate-600"
                    }`}
                  >
                    {r.name}{idx < ALL_PREPARATION_ROLES.length - 1 ? " ·" : ""}
                  </button>
                ))}
              </div>

              {/* Active Role Announcement Pill */}
              <div className="mt-4 px-3.5 py-1.5 rounded-lg bg-white/80 border border-teal-200/80 shadow-2xs inline-flex items-center gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-slate-600">
                  Your preparation path is customized for <strong className="text-slate-900 font-bold">{selectedRole.name}</strong> roles.
                </span>
              </div>
            </div>

            {/* Right Visual Illustration Cards (Matching Reference Image) */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Active Target Role</span>
                    <h3 className="text-xl font-black text-slate-900">{selectedRole.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Readiness</span>
                    <span className="text-lg font-black text-teal-600">{overallScore}%</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">Roadmap Progress</span>
                    <span className="font-bold text-slate-900">{completedRoadmapCount} of {totalRoadmapSteps} topics</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">Core Skills Mastered</span>
                    <span className="font-bold text-slate-900">{completedSkillsCount} of {totalSkillsCount} skills</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-medium">Practice Solved</span>
                    <span className="font-bold text-slate-900">{completedQuestionsCount} of {totalQuestionsCount} questions</span>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#learning-roadmap"
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <span>Continue Preparation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. EXPLORE INTERVIEW PREPARATION BY ROLE (Role Cards Carousel / Grid) */}
      <section className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Explore Interview Preparation by Role
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Select any role to adapt roadmap, rounds &amp; practice
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {ALL_PREPARATION_ROLES.map((role) => {
            const isSelected = selectedRole.id === role.id;
            const Icon = 
              role.id === "software-engineer" ? Code2 :
              role.id === "data-analyst" ? Database :
              role.id === "data-scientist" ? BrainCircuit :
              role.id === "data-engineer" ? Layers : Briefcase;

            return (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm font-bold mb-1 ${
                    isSelected ? "text-teal-900" : "text-slate-900"
                  }`}>
                    {role.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                    {role.overview.coreSkills.slice(0, 3).join(", ")}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">{role.overview.estimatedWeeks}</span>
                  <span className={`font-semibold ${isSelected ? "text-teal-600" : "text-slate-500"}`}>
                    {isSelected ? "Active Path" : "Switch Path →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN SECTION: COMPLETE LEARNING ROADMAP & TOP COMPANIES GUIDES */}
      <section id="learning-roadmap" className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: INTERACTIVE LEARNING ROADMAP */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header + Progress Bar */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-teal-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {selectedRole.name} Learning Roadmap
                    </h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      Curated Order
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Step-by-step master plan with subtopics, recommended actions, and progress tracking
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-500">Your Progress</div>
                  <div className="text-xl font-black text-teal-600">{roadmapPercent}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${roadmapPercent}%` }}
                />
              </div>

              {/* Dynamic Next Topic Banner */}
              <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-slate-700">
                    Next recommended focus: <strong className="text-teal-900 font-bold">{nextRecommendedStep.title}</strong>
                  </span>
                </div>
                <a
                  href={`#step-${nextRecommendedStep.id}`}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                >
                  <span>Jump to Topic</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Roadmap Steps Accordion / Cards */}
            <div className="space-y-4">
              {selectedRole.roadmap.map((step, idx) => {
                const isCompleted = completedSteps.has(step.id);

                return (
                  <div
                    key={step.id}
                    id={`step-${step.id}`}
                    className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all shadow-xs ${
                      isCompleted 
                        ? "border-emerald-200/80 bg-emerald-50/15" 
                        : "border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Step Number + Title */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <button
                          onClick={() => toggleStep(step.id)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-500 text-white shadow-2xs"
                              : "border-2 border-slate-300 text-slate-400 hover:border-teal-500 hover:text-teal-600"
                          }`}
                          title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="text-xs font-bold font-mono">{idx + 1}</span>
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                              STAGE 0{step.stepNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {step.focus}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                              step.difficulty === "Beginner" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              step.difficulty === "Intermediate" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}>
                              {step.difficulty}
                            </span>
                          </div>

                          <h3 className={`text-base sm:text-lg font-bold ${
                            isCompleted ? "text-emerald-950 line-through decoration-emerald-500/60" : "text-slate-900"
                          }`}>
                            {step.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Subtopics Checklist */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                              Core Subtopics to Master:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {step.subtopics.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                                  <span className="truncate">{sub}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action & Resource Link */}
                          <div className="mt-3.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="text-slate-600">
                              <strong className="text-slate-800">Action:</strong> {step.recommendedAction}
                            </div>
                            {step.resourceUrl && (
                              <a
                                href={step.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-700 font-bold inline-flex items-center gap-1 shrink-0 hover:underline"
                              >
                                <span>{step.resourceName || "Study Guide"}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Checkbox Action Button */}
                      <button
                        onClick={() => toggleStep(step.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 transition-colors cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 border border-slate-200"
                        }`}
                      >
                        {isCompleted ? "Completed ✓" : "Mark Done"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: TOP COMPANIES INTERVIEW GUIDES (Specific to Selected Role) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Top Companies Box */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <h3 className="font-bold text-base text-slate-900">
                      Company Interview Guides
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Questions for <strong className="text-slate-800">{selectedRole.name}</strong>
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {PREP_COMPANIES.length} Companies
                </span>
              </div>

              <div className="space-y-2">
                {PREP_COMPANIES.map((company) => {
                  const roleData = company.roleQuestions[selectedRole.id] || company.roleQuestions["software-engineer"];
                  const questionCount = roleData?.frequentlyAsked.length || 4;

                  return (
                    <button
                      key={company.id}
                      onClick={() => setSelectedCompany(company)}
                      className="w-full p-3 rounded-xl border border-slate-200/80 hover:border-teal-200 hover:bg-teal-50/40 text-left transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                          {company.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">
                            {company.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {roleData.focusAreas.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {company.totalQuestions}+ Questions
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-500">
                  Click any company to view round-by-round strategy for {selectedRole.name}
                </span>
              </div>
            </div>

            {/* Preparation Checklist Summary Widget */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  Track Your Preparation
                </h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Roadmap topics completed: <strong>{completedRoadmapCount}/{totalRoadmapSteps}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Core skills mastered: <strong>{completedSkillsCount}/{totalSkillsCount}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Practice questions solved: <strong>{completedQuestionsCount}/{totalQuestionsCount}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs text-center transition-colors"
                >
                  View in User Dashboard →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. TABBED DEEP DIVES: SKILLS, INTERVIEW ROUNDS, PRACTICE, PROJECTS & RESUME */}
      <section className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-8 overflow-x-auto text-xs sm:text-sm font-semibold">
          {[
            { id: "roadmap", label: "Overview & Roadmap", icon: Layers },
            { id: "skills", label: "Skills Checklist", icon: BookmarkCheck },
            { id: "interview", label: "Interview Rounds & Assessment", icon: Target },
            { id: "practice", label: "Practice Questions", icon: HelpCircle },
            { id: "projects", label: "Portfolio Projects", icon: Laptop },
            { id: "resume", label: "ATS Resume Guide", icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-teal-600 text-white shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SKILLS CHECKLIST */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-teal-600" />
                  <span>{selectedRole.name} Skill Inventory</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check off skills as you learn them to track your technical proficiency
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md border border-teal-200">
                {completedSkillsCount} / {totalSkillsCount} Mastered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Must Know */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                    1. Must Know (Mandatory)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    High Priority
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedRole.skills.mustKnow.map((skill, idx) => {
                    const isDone = completedSkills.has(skill);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSkill(skill)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isDone
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className={isDone ? "line-through font-medium" : "font-semibold"}>{skill}</span>
                        <span className={`w-4 h-4 rounded flex items-center justify-center ${
                          isDone ? "bg-emerald-600 text-white" : "border border-slate-300"
                        }`}>
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Good to Know */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    2. Good to Know (Competitive)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Mid Priority
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedRole.skills.goodToKnow.map((skill, idx) => {
                    const isDone = completedSkills.has(skill);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSkill(skill)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isDone
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className={isDone ? "line-through font-medium" : "font-semibold"}>{skill}</span>
                        <span className={`w-4 h-4 rounded flex items-center justify-center ${
                          isDone ? "bg-emerald-600 text-white" : "border border-slate-300"
                        }`}>
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced & Tools */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    3. Advanced &amp; Industry Tools
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    Differentiators
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedRole.skills.advanced.concat(selectedRole.skills.toolsAndTech.slice(0, 3)).map((skill, idx) => {
                    const isDone = completedSkills.has(skill);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleSkill(skill)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isDone
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className={isDone ? "line-through font-medium" : "font-semibold"}>{skill}</span>
                        <span className={`w-4 h-4 rounded flex items-center justify-center ${
                          isDone ? "bg-emerald-600 text-white" : "border border-slate-300"
                        }`}>
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERVIEW ROUNDS & ASSESSMENT */}
        {activeTab === "interview" && (
          <div className="space-y-8">
            {/* Rounds Sequence */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-teal-600" />
                    <span>Typical {selectedRole.name} Interview Process</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Standard hiring stages and expectations used by verified tech employers
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                  {selectedRole.interviewRounds.length} Stages
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRole.interviewRounds.map((round) => (
                  <div key={round.step} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                          ROUND {round.step}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{round.focus}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">{round.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{round.description}</p>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 mb-3">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">Key Strategies:</span>
                        {round.tips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <strong>Sample Prompts:</strong> {round.keyQuestions.join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Breakdown */}
            <div>
              <div className="pb-3 border-b border-slate-200 mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-teal-600" />
                  <span>Aptitude &amp; Technical Assessment Structure</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  How Round 1 Online Assessments (HackerRank, CodeSignal, TestGorilla) are weighted for {selectedRole.name}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedRole.assessmentPrep.map((section, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-teal-700 block mb-1">{section.weightage}</span>
                      <h4 className="font-bold text-sm text-slate-900 mb-1.5">{section.title}</h4>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{section.description}</p>
                      
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-600 mb-3">
                        <strong className="text-slate-800 block mb-0.5">Sample Question:</strong>
                        &ldquo;{section.sampleQuestion}&rdquo;
                      </div>
                    </div>

                    <div className="text-[11px] text-teal-800 bg-teal-50/70 p-2 rounded-lg border border-teal-100 font-medium">
                      💡 {section.preparationTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRACTICE QUESTIONS */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-teal-600" />
                  <span>Interactive Practice Questions</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hand-picked technical interview questions calibrated for {selectedRole.name}
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <select
                  value={questionTopicFilter}
                  onChange={(e) => setQuestionTopicFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none"
                >
                  <option value="All">All Topics</option>
                  {questionTopics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select
                  value={questionDifficultyFilter}
                  onChange={(e) => setQuestionDifficultyFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-none"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((q) => {
                const isCompleted = completedQuestions.has(q.id);
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
                      isCompleted ? "border-emerald-200/80 bg-emerald-50/10" : "border-slate-200/90"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => toggleQuestion(q.id)}
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 cursor-pointer ${
                            isCompleted ? "bg-emerald-600 text-white" : "border border-slate-300 text-slate-400 hover:border-teal-500"
                          }`}
                          title={isCompleted ? "Mark as unpracticed" : "Mark as practiced"}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {q.topic}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                              q.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              q.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}>
                              {q.difficulty}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Type: {q.type}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
                            {q.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {q.questionText}
                          </p>

                          {/* Company Tags */}
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-medium">Asked at:</span>
                            {q.companyTags.map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? "Hide Solution" : "View Solution"}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {/* Expandable Solution / Hint */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-3.5 rounded-xl border">
                        <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">
                          Expected Solution / Approach:
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                          {q.solutionHint}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PORTFOLIO PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-teal-600" />
                <span>Recommended Portfolio Projects for {selectedRole.name}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Stand out to ATS scanners and engineering managers with real-world architecture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedRole.projects.map((proj) => (
                <div key={proj.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        proj.difficulty === "Intermediate" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}>
                        {proj.difficulty} Project
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                      {proj.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {proj.whatItDemonstrates}
                    </p>

                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Recommended Stack:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.recommendedStack.map((tech, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                        Key Interview Talking Points:
                      </span>
                      {proj.talkingPoints.map((tp, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{tp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ATS RESUME GUIDANCE */}
        {activeTab === "resume" && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>ATS Resume Guidance for {selectedRole.name}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Optimize your resume for Greenhouse, Lever, and Ashby applicant tracking systems
              </p>
            </div>

            {/* Keywords Box */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    High-Frequency ATS Keywords
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ensure these exact terms appear naturally in your project descriptions and skills section
                  </p>
                </div>
                <button
                  onClick={handleCopyKeywords}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKeywords ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKeywords ? "Copied!" : "Copy All Keywords"}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedRole.resumeGuidance.atsKeywords.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Bullet Points & Mistakes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample High-Impact Bullet Points */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>High-Impact Sample Bullet Points (Use XYZ Formula)</span>
                </h4>
                <div className="space-y-3">
                  {selectedRole.resumeGuidance.sampleBulletPoints.map((bp, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs text-slate-700 leading-relaxed font-sans">
                      &ldquo;{bp}&rdquo;
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                <h4 className="font-bold text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Common Red Flags &amp; Mistakes to Avoid</span>
                </h4>
                <div className="space-y-3">
                  {selectedRole.resumeGuidance.commonMistakes.map((mis, idx) => (
                    <div key={idx} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{mis}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* 5. CAREER GROWTH PATHWAYS (Career Ladder for Selected Role) */}
      <section className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-slate-200">
        <div className="pb-3 border-b border-slate-200 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-teal-600" />
            <span>{selectedRole.name} Career Growth &amp; Salary Ladder</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Typical progression timeline, responsibilities, and market compensation expectations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedRole.careerPathways.map((level, idx) => (
            <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                    STAGE {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{level.experience}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-1">
                  {level.stage}
                </h3>

                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-3">
                  {level.compensation}
                </div>

                <p className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
                  Core Focus: {level.focus}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {level.responsibilities}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Key Competencies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {level.requiredSkills.map((sk, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. COMPANY + ROLE MODAL */}
      {selectedCompany && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedCompany(null)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm">
                  {selectedCompany.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {selectedCompany.name} · {selectedRole.name} Guide
                  </h3>
                  <p className="text-xs text-slate-500">
                    ATS Portal: <strong className="text-slate-800">{selectedCompany.atsUsed}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Hiring Philosophy */}
              <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-200/80">
                <span className="font-bold text-teal-900 block mb-1 text-xs">Hiring Philosophy &amp; Culture:</span>
                <p className="text-slate-700 leading-relaxed">{selectedCompany.hiringPhilosophy}</p>
              </div>

              {/* Rounds for this Role */}
              {(() => {
                const roleData = selectedCompany.roleQuestions[selectedRole.id] || selectedCompany.roleQuestions["software-engineer"];
                return (
                  <>
                    <div>
                      <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
                        Interview Stages for {selectedRole.name}:
                      </span>
                      <div className="space-y-1.5">
                        {roleData.rounds.map((rnd, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-800">{rnd}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
                        Frequently Asked Questions at {selectedCompany.name}:
                      </span>
                      <div className="space-y-2">
                        {roleData.frequentlyAsked.map((faq, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                            • &ldquo;{faq}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                      <strong className="block mb-0.5">💡 Insider Tip:</strong>
                      {roleData.insiderTip}
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <Link
                href={`/companies/${selectedCompany.id}`}
                className="font-bold text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-1"
              >
                <span>View {selectedCompany.name} Profile &amp; Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM CTA SECTION */}
      <section className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to apply for {selectedRole.name} openings?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Discover verified {selectedRole.name} jobs discovered directly from employer applicant tracking systems (Greenhouse, Lever, Ashby, Workday) every hour.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/?q=${encodeURIComponent(selectedRole.name)}`}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Browse {selectedRole.name} Openings
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Check My Resume ATS Fit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
