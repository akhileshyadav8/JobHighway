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
  BookmarkCheck,
  Check,
  Copy,
  Laptop,
  Play,
  RotateCcw,
  CheckSquare,
  Users,
  PieChart,
  Lightbulb,
  Terminal
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
import { QuizTestModal } from "./QuizTestModal";
import { CodingEnvironmentModal } from "./CodingEnvironmentModal";
import { QuestionVaultModal } from "./QuestionVaultModal";
import { SqlEnvironmentModal } from "./SqlEnvironmentModal";
import { QuizTest, getRandomizedQuiz } from "@/lib/quizData";
import { ALL_CODING_PROBLEMS } from "@/lib/codingProblemsData";
import { parseResumeFile, computeAtsMatch } from "@/lib/resumeParser";
import {
  COMMON_HR_QUESTIONS,
  INTERVIEW_ETIQUETTE_GUIDE,
  COMMON_INTERVIEW_MISTAKES,
  getInterviewAnswer
} from "@/lib/interviewPrepData";



export function CareerPrepHub({ initialRoleId }: { initialRoleId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Role State
  const queryRole = searchParams.get("role") || initialRoleId;
  const [selectedRole, setSelectedRole] = useState<PrepRole>(() => getPrepRoleById(queryRole));
  const [roleSearchOpen, setRoleSearchOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<"fresher" | "experienced">("fresher");

  // 2. Interactive Modals State
  const [selectedCompany, setSelectedCompany] = useState<CompanyPrepItem | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string>("swe-tech-assessment-1");
  const [randomizedQuiz, setRandomizedQuiz] = useState<QuizTest | null>(null);
  const [codingModalOpen, setCodingModalOpen] = useState(false);
  const [activeCodingProblemId, setActiveCodingProblemId] = useState<string | undefined>(undefined);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [activeSqlProblemId, setActiveSqlProblemId] = useState<string | undefined>(undefined);
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [vaultInitialCategory, setVaultInitialCategory] = useState<string>("All");

  // Resume Upload State & Ref
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // 3. User Progress Persistence State (stored in localStorage)
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
  const [showDeepDives, setShowDeepDives] = useState(false);
  const [interviewSubTab, setInterviewSubTab] = useState<"rounds" | "hr" | "etiquette" | "mistakes">("rounds");
  const [expandedHrId, setExpandedHrId] = useState<string | null>("hr-tell-me-about-yourself");

  // 6. Roadmap Stepper View State
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [roadmapViewMode, setRoadmapViewMode] = useState<"stepper" | "all">("stepper");

  // Deep dive container ref for smooth scrolling
  const deepDivesRef = useRef<HTMLDivElement>(null);

  // Load auth state and user preference on mount & keep in sync with app-wide auth/resume changes
  useEffect(() => {
    const syncUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);

      if (!queryRole && user?.targetRole) {
        const matched = getPrepRoleById(user.targetRole);
        setSelectedRole(matched);
      } else if (queryRole) {
        setSelectedRole(getPrepRoleById(queryRole));
      }
    };

    syncUser();
    window.addEventListener("jobhighway_auth_change", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("jobhighway_auth_change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
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
    } catch {
      // ignore
    }
    setActiveStepIndex(0);
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
    } catch {
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
    setActiveStepIndex(0);

    const url = new URL(window.location.href);
    url.searchParams.set("role", role.id);
    window.history.pushState({}, "", url.toString());

    if (currentUser?.id) {
      updateUserProfile(currentUser.id, { targetRole: role.name });
    }
  };

  // Switch tab and smoothly scroll to the section
  const handleSwitchTab = (tab: "roadmap" | "skills" | "interview" | "practice" | "projects" | "resume") => {
    setActiveTab(tab);
    setShowDeepDives(true);
    setTimeout(() => {
      if (deepDivesRef.current) {
        deepDivesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
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

  // Current active step in the stepper
  const currentStepperStep = selectedRole.roadmap[activeStepIndex] || selectedRole.roadmap[0];
  const isCurrentStepDone = currentStepperStep ? completedSteps.has(currentStepperStep.id) : false;

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

  // Role icon helper
  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "software-engineer": return Code2;
      case "frontend-developer": return Laptop;
      case "backend-developer": return Terminal;
      case "ml-engineer": return Sparkles;
      case "qa-engineer": return CheckSquare;
      case "data-analyst": return BarChart3;
      case "data-scientist": return Database;
      case "data-engineer": return Layers;
      case "devops-engineer": return Cloud;
      case "product-manager": return Briefcase;
      default: return Target;
    }
  };

  // Role subtitle helper matching reference UI
  const getRoleSubtitle = (roleId: string) => {
    switch (roleId) {
      case "software-engineer": return "DSA, System Design, Tech Interviews";
      case "backend-developer": return "APIs, PostgreSQL, Redis, Kafka";
      case "ml-engineer": return "PyTorch, Transformers, MLOps";
      case "qa-engineer": return "Playwright, API Testing, CI/CD";
      case "data-analyst": return "SQL, Power BI, Analytics";
      case "data-scientist": return "ML, Statistics, Python";
      case "devops-engineer": return "Cloud, CI/CD, Docker";
      case "product-manager": return "Product Sense, Case Studies";
      case "frontend-developer": return "React, JavaScript, UI/UX";
      case "data-engineer": return "Spark, Pipelines, Warehousing";
      default: return "Core Fundamentals & Interview Prep";
    }
  };

  // Role-aware roadmap topics checklist for the center card
  const roadmapChecklistTopics = useMemo(() => {
    switch (selectedRole.id) {
      case "backend-developer":
        return [
          { name: "APIs, Node.js/Go & Concurrency", total: 20 },
          { name: "PostgreSQL, Indexing & Query Tuning", total: 18 },
          { name: "Redis Caching & Lock Strategies", total: 14 },
          { name: "Kafka Event-Driven Architecture", total: 16 },
          { name: "Microservices & Distributed Systems", total: 12 },
          { name: "System Design & Scalability", total: 8 }
        ];
      case "ml-engineer":
        return [
          { name: "NumPy Vectorization & Math Proofs", total: 16 },
          { name: "PyTorch & Deep Neural Architectures", total: 22 },
          { name: "Transformers, Attention & LoRA", total: 18 },
          { name: "FastAPI / Triton Model Serving", total: 14 },
          { name: "RAG & Vector Search (FAISS)", total: 12 },
          { name: "Machine Learning System Design", total: 10 }
        ];
      case "qa-engineer":
        return [
          { name: "Test Case Design & Boundary Analysis", total: 18 },
          { name: "Playwright / Selenium Automation", total: 22 },
          { name: "REST Assured & API Contract Testing", total: 16 },
          { name: "k6 / JMeter Load & Stress Testing", total: 12 },
          { name: "CI/CD Test Gates (GitHub Actions)", total: 10 },
          { name: "Behavioral & Bug Triaging Scenarios", total: 8 }
        ];
      case "data-analyst":
        return [
          { name: "Advanced SQL & Window Functions", total: 20 },
          { name: "Power BI & Tableau Dashboards", total: 12 },
          { name: "Business Metrics & Cohort Retention", total: 15 },
          { name: "Python for Data Analysis (Pandas)", total: 14 },
          { name: "Product Analytics & A/B Testing", total: 10 },
          { name: "Behavioral & Stakeholder Comms", total: 8 }
        ];
      case "data-scientist":
        return [
          { name: "Probability & Inferential Statistics", total: 16 },
          { name: "Machine Learning Algorithms & Loss", total: 22 },
          { name: "Feature Engineering & Data Cleansing", total: 14 },
          { name: "Deep Learning & Transformer Models", total: 12 },
          { name: "A/B Testing & Causal Inference", total: 10 },
          { name: "ML System Design & Deployment", total: 8 }
        ];
      case "devops-engineer":
        return [
          { name: "Linux Internals & Bash Scripting", total: 18 },
          { name: "Docker & Container Runtime", total: 14 },
          { name: "Kubernetes Cluster Architecture", total: 20 },
          { name: "CI/CD Pipelines (GitHub / Jenkins)", total: 12 },
          { name: "Infrastructure as Code (Terraform)", total: 15 },
          { name: "SRE, Observability & Incident Response", total: 10 }
        ];
      case "product-manager":
        return [
          { name: "Product Sense & User Painpoints", total: 18 },
          { name: "Product Strategy & Market Sizing", total: 15 },
          { name: "Execution, Metrics & Metric Trees", total: 20 },
          { name: "Technical Fluency & Architecture", total: 12 },
          { name: "Behavioral & Cross-Functional Alignment", total: 14 },
          { name: "Go-to-Market (GTM) Strategy", total: 10 }
        ];
      case "frontend-developer":
        return [
          { name: "Core JavaScript Internals & Event Loop", total: 24 },
          { name: "React, Next.js & Server Components", total: 20 },
          { name: "CSS Architecture, Tailwind & Layouts", total: 16 },
          { name: "Web Performance & Core Web Vitals", total: 14 },
          { name: "Frontend System Design & State", total: 12 },
          { name: "Behavioral & Culture Fit", total: 8 }
        ];
      case "data-engineer":
        return [
          { name: "Data Modeling & Normalization", total: 16 },
          { name: "Distributed Computing (Apache Spark)", total: 22 },
          { name: "ETL & Streaming Pipelines (Kafka)", total: 18 },
          { name: "Data Warehousing (Snowflake / BigQuery)", total: 15 },
          { name: "Airflow Orchestration & Idempotency", total: 12 },
          { name: "Behavioral & Problem Solving", total: 8 }
        ];
      default: // software-engineer
        return [
          { name: "Data Structures & Algorithms", total: 24 },
          { name: "Object Oriented Programming", total: 10 },
          { name: "DBMS & Query Optimization", total: 12 },
          { name: "Operating Systems & Concurrency", total: 10 },
          { name: "System Design & Scalability", total: 8 },
          { name: "Behavioral & HR Preparation", total: 6 }
        ];
    }
  }, [selectedRole.id]);


  // Handler for Launching Appropriate Quiz Test
  const handleOpenQuiz = (quizId?: string) => {
    if (quizId) {
      // Specific quiz by ID - open in modal
      setRandomizedQuiz(null);
      setActiveQuizId(quizId);
      setQuizModalOpen(true);
      return;
    }
    // Use role-based randomized quiz - try new tab first
    const randomized = getRandomizedQuiz(selectedRole.id, "all", 30);
    if (randomized) {
      try {
        const sessionPayload = {
          quiz: randomized,
          userAnswers: {},
          markedForReview: [],
          currentQuestionIndex: 0,
          secondsRemaining: randomized.durationMinutes * 60,
          startedAt: new Date().toISOString()
        };
        localStorage.setItem("jobhighway_active_test_session", JSON.stringify(sessionPayload));
        sessionStorage.setItem("jobhighway_active_mock_test", JSON.stringify(randomized));
        window.open(`/prepare/mock-test?role=${selectedRole.id}&category=all`, "_blank");
      } catch {
        setRandomizedQuiz(randomized);
        setQuizModalOpen(true);
      }
    } else {
      // Fallback to first available quiz
      setRandomizedQuiz(null);
      setActiveQuizId("swe-tech-assessment-1");
      setQuizModalOpen(true);
    }
  };

  // Handler for Launching Code Practice
  const handleOpenCoding = (problemId?: string) => {
    setActiveCodingProblemId(problemId);
    setCodingModalOpen(true);
  };

  // Handler for Launching SQL Environment
  const handleOpenSql = (problemId?: string) => {
    setActiveSqlProblemId(problemId);
    setSqlModalOpen(true);
  };

  // Resume Upload & Remove Handlers for ATS Guide Tab
  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    setIsUploadingResume(true);
    try {
      const extracted = await parseResumeFile(file);
      const match = computeAtsMatch(
        extracted.rawText || "",
        extracted.skills || [],
        selectedRole.resumeGuidance.atsKeywords || []
      );
      const fileData = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        fileType: file.type || "application/pdf",
        status: "Parsed",
        atsScore: match.atsScore,
        rawText: extracted.rawText,
        matchedKeywords: match.matchedKeywords,
        missingKeywords: match.missingKeywords
      };
      const updated = updateUserProfile(currentUser.id, {
        resumeFile: fileData,
        skills: Array.from(new Set([...(currentUser.skills || []), ...(extracted.skills || [])])),
        currentRole: extracted.currentRole || currentUser.currentRole,
        yearsExperience: extracted.yearsExperience || currentUser.yearsExperience
      });
      if (updated) setCurrentUser(updated);
    } catch (err) {
      console.error("Resume parse error", err);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleRemoveResume = () => {
    if (!currentUser) return;
    if (confirm("Remove your stored resume?")) {
      const updated = updateUserProfile(currentUser.id, { resumeFile: undefined });
      if (updated) setCurrentUser(updated);
    }
  };

  // Dynamic ATS match calculated live against the currently selected job role
  const atsMatchResult = useMemo(() => {
    if (!currentUser?.resumeFile) {
      return {
        matchedKeywords: [],
        missingKeywords: selectedRole.resumeGuidance.atsKeywords || [],
        score: 0
      };
    }
    const text = currentUser.resumeFile.rawText || "";
    const skills = currentUser.skills || [];
    const res = computeAtsMatch(text, skills, selectedRole.resumeGuidance.atsKeywords || []);
    return {
      matchedKeywords: res.matchedKeywords,
      missingKeywords: res.missingKeywords,
      score: res.atsScore
    };
  }, [currentUser, selectedRole]);


  // Handler for Question Vault
  const handleOpenVault = (cat: string = "All") => {
    setVaultInitialCategory(cat);
    setVaultModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased">
      
      {/* 1. HERO SECTION (Exact Visual Style Matching Reference Image media_1790885455073.png) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-emerald-50/20 to-slate-50 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10 sm:pb-14">
        {/* Subtle background radial pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="container mx-auto max-w-[1360px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-bold tracking-wider uppercase mb-5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>JobHighway Career Preparation Hub</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-slate-900 tracking-tight leading-[1.12] mb-4">
                Prepare Better.<br />
                <span className="text-teal-600">Convert More Interviews.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-xl leading-relaxed">
                Curated interview guides, study resources, and role-wise roadmaps to help you crack technical rounds and land offers from top companies.
              </p>

              {/* Role Search Bar Input */}
              <div className="relative w-full max-w-xl mb-3">
                <div className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-1.5 min-h-[52px]">
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
                    className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                  {roleSearchTerm && (
                    <button
                      onClick={() => setRoleSearchTerm("")}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
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
                    className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold px-5 sm:px-6 h-10 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Search</span>
                  </button>
                </div>

                {/* Autocomplete Dropdown */}
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
                {ALL_PREPARATION_ROLES.slice(0, 6).map((r, idx) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r)}
                    className={`font-medium transition-colors hover:text-teal-700 cursor-pointer ${
                      selectedRole.id === r.id ? "text-teal-700 font-bold underline decoration-teal-500 underline-offset-4" : "text-slate-600"
                    }`}
                  >
                    {r.name}{idx < 5 ? " ·" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Visual Graphic: Developer with Interactive Floating Action Cards matching reference image */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[380px]">
              
              {/* Subtle Ambient Glow */}
              <div className="absolute w-72 h-72 rounded-full bg-teal-400/15 blur-3xl -top-6 -right-6 pointer-events-none" />
              <div className="absolute w-60 h-60 rounded-full bg-emerald-400/15 blur-3xl -bottom-6 -left-6 pointer-events-none" />

              {/* Central Programmer Workspace SVG Graphic */}
              <div className="relative z-10 flex flex-col items-center">
                <svg
                  className="w-72 h-64 drop-shadow-sm select-none"
                  viewBox="0 0 340 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Circular Backdrop */}
                  <circle cx="170" cy="140" r="120" fill="#f0fdfa" stroke="#ccfbf1" strokeWidth="2" strokeDasharray="6 6" />

                  {/* Desk Surface */}
                  <path d="M40 230H300C305 230 310 234 310 238V244H30V238C30 234 35 230 40 230Z" fill="#e2e8f0" />
                  <rect x="35" y="244" width="270" height="4" fill="#cbd5e1" />

                  {/* Potted Plant on Desk */}
                  <path d="M52 230H72L69 214H55L52 230Z" fill="#14b8a6" />
                  <path d="M54 214C54 200 62 190 62 190C62 190 70 200 70 214" fill="#10b981" />
                  <path d="M48 206C52 196 62 196 62 196C62 196 58 206 48 206Z" fill="#059669" />
                  <path d="M76 206C72 196 62 196 62 196C62 196 66 206 76 206Z" fill="#047857" />

                  {/* Coffee Mug */}
                  <rect x="85" y="215" width="14" height="15" rx="3" fill="#0f766e" />
                  <path d="M99 218H103C104.5 218 105 220 105 222C105 224 104.5 226 99 226" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />

                  {/* Person Torso & Neck */}
                  <path d="M125 230C125 180 145 160 170 160C195 160 215 180 215 230H125Z" fill="#0d9488" />
                  {/* Collar */}
                  <path d="M160 160L170 174L180 160" stroke="#f0fdfa" strokeWidth="3" strokeLinecap="round" />
                  {/* Head */}
                  <circle cx="170" cy="132" r="22" fill="#fed7aa" />
                  {/* Hair */}
                  <path d="M148 132C148 116 156 106 170 106C184 106 192 116 192 126C192 130 188 132 184 132C180 132 178 126 172 124C166 122 160 126 156 128C152 130 148 132 148 132Z" fill="#1e293b" />
                  {/* Face details */}
                  <circle cx="177" cy="132" r="2.5" fill="#334155" />
                  <path d="M174 140C176 142 180 142 182 140" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Laptop Base & Screen */}
                  <path d="M130 230L145 195H215L230 230H130Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                  <rect x="145" y="195" width="70" height="35" rx="3" fill="#0f172a" />
                  {/* Screen Content Preview */}
                  <rect x="150" y="200" width="30" height="3" rx="1.5" fill="#14b8a6" />
                  <rect x="150" y="206" width="45" height="2" rx="1" fill="#38bdf8" />
                  <rect x="150" y="211" width="20" height="2" rx="1" fill="#a855f7" />
                  <rect x="150" y="216" width="38" height="2" rx="1" fill="#94a3b8" />
                  {/* Laptop Logo */}
                  <circle cx="202" cy="212" r="3" fill="#14b8a6" opacity="0.8" />
                </svg>
              </div>

              {/* Chip 1: Practice DSA or SQL (Top-Left) */}
              <button
                onClick={() => {
                  if (selectedRole.id === "data-analyst") {
                    handleOpenSql();
                  } else {
                    handleOpenCoding();
                  }
                }}
                className="absolute top-2 left-0 sm:-left-4 bg-white/95 backdrop-blur-xs border border-slate-200/90 hover:border-teal-400 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 text-left group cursor-pointer animate-in fade-in slide-in-from-left-4 duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  {selectedRole.id === "data-analyst" ? (
                    <Database className="w-4 h-4" />
                  ) : (
                    <Code2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    {selectedRole.id === "data-analyst" ? "Practice SQL" : "Practice DSA"}
                  </div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-10 h-full bg-teal-500 rounded-full" />
                  </div>
                </div>
              </button>


              {/* Chip 2: System Design (Top-Right) */}
              <button
                onClick={() => handleOpenVault("System Design")}
                className="absolute top-4 right-0 sm:-right-4 bg-white/95 backdrop-blur-xs border border-slate-200/90 hover:border-teal-400 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 text-left group cursor-pointer animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">System Design</div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-12 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </button>

              {/* Chip 3: Mock Interviews (Mid-Right) */}
              <button
                onClick={() => handleOpenQuiz()}
                className="absolute top-28 right-2 sm:-right-2 bg-white/95 backdrop-blur-xs border border-slate-200/90 hover:border-teal-400 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 text-left group cursor-pointer animate-in fade-in slide-in-from-right-6 duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Mock Interviews</div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-8 h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
              </button>

              {/* Chip 4: Get Hired (Bottom-Right) */}
              <Link
                href={`/?q=${encodeURIComponent(selectedRole.name)}`}
                className="absolute bottom-4 right-6 sm:right-2 bg-white/95 backdrop-blur-xs border border-slate-200/90 hover:border-teal-400 p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 text-left group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Get Hired</div>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-14 h-full bg-amber-500 rounded-full" />
                  </div>
                </div>
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* 2. EXPLORE INTERVIEW PREPARATION BY ROLE (Role Cards Row matching reference UI) */}
      <section className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Explore Interview Preparation by Role
            </h2>
          </div>
          <button
            onClick={() => setRoleSearchOpen(true)}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Roles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {ALL_PREPARATION_ROLES.map((role) => {
            const isSelected = selectedRole.id === role.id;
            const Icon = getRoleIcon(role.id);

            return (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role)}
                className={`p-4 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center justify-between min-h-[140px] ${
                  isSelected
                    ? "bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-2.5 ${
                    isSelected ? "bg-teal-50 text-teal-600" : "bg-slate-50 text-slate-500"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-xs sm:text-sm font-bold mb-1 leading-snug ${
                    isSelected ? "text-teal-900" : "text-slate-900"
                  }`}>
                    {role.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {getRoleSubtitle(role.id)}
                  </p>
                </div>

                {isSelected && (
                  <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full mt-2 border border-teal-200">
                    Selected Role
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN SECTION: COMPLETE LEARNING ROADMAP & TOP COMPANIES GUIDES (Split Layout matching Reference UI) */}
      <section id="learning-roadmap" className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: INTERACTIVE LEARNING ROADMAP */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Section Header */}
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Complete Learning Roadmap
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Step-by-step preparation plan curated for your role
              </p>
            </div>

            {/* Split Stepper (Left 6 Step Rows + Center Role Roadmap Card matching Reference UI) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              
              {/* Left 6 Step Rows */}
              <div className="md:col-span-5 space-y-2">
                {[
                  {
                    stepNum: 1,
                    title: "Core Fundamentals",
                    sub: "Languages, basic concepts, problem solving",
                    action: () => handleSwitchTab("roadmap")
                  },
                  {
                    stepNum: 2,
                    title: "Important Topics",
                    sub: "In-depth concepts with examples",
                    action: () => handleSwitchTab("skills")
                  },
                  {
                    stepNum: 3,
                    title: "Practice Questions",
                    sub: selectedRole.id === "data-analyst"
                      ? "Interactive SQL queries and table schemas"
                      : "Topic-wise and company-wise coding challenges",
                    action: () => {
                      if (selectedRole.id === "data-analyst") {
                        handleOpenVault("SQL");
                      } else {
                        handleOpenVault("DSA");
                      }
                    }
                  },
                  {
                    stepNum: 4,
                    title: "Mock Tests",
                    sub: "Timed tests and detailed solutions",
                    action: () => {
                      const randomized = getRandomizedQuiz(selectedRole.id, "all", 30);
                      if (randomized) {
                        try {
                          const sessionPayload = {
                            quiz: randomized,
                            userAnswers: {},
                            markedForReview: [],
                            currentQuestionIndex: 0,
                            secondsRemaining: randomized.durationMinutes * 60,
                            startedAt: new Date().toISOString()
                          };
                          localStorage.setItem("jobhighway_active_test_session", JSON.stringify(sessionPayload));
                          sessionStorage.setItem("jobhighway_active_mock_test", JSON.stringify(randomized));
                          window.open(`/prepare/mock-test?role=${selectedRole.id}&category=all`, "_blank");
                        } catch {
                          setRandomizedQuiz(randomized);
                          setQuizModalOpen(true);
                        }
                      } else {
                        setActiveQuizId("swe-tech-assessment-1");
                        setQuizModalOpen(true);
                      }
                    }
                  },
                  {
                    stepNum: 5,
                    title: selectedRole.id === "product-manager" ? "Case Studies" : 
                           ["data-analyst", "data-scientist", "data-engineer"].includes(selectedRole.id) ? "SQL Practice & Schemas" : 
                           "System Design",
                    sub: selectedRole.id === "product-manager" ? "Product sense, strategy and metrics" :
                         ["data-analyst", "data-scientist", "data-engineer"].includes(selectedRole.id) ? "Interactive SQL sandbox, tables & queries" :
                         "Design concepts, real-world case studies",
                    action: () => {
                      if (["data-analyst", "data-scientist", "data-engineer"].includes(selectedRole.id)) {
                        handleOpenSql();
                      } else {
                        handleOpenVault("System Design");
                      }
                    }
                  },

                  {
                    stepNum: 6,
                    title: "Interview Tips",
                    sub: "HR questions, behavioral STAR, etiquette and common mistakes",
                    action: () => handleSwitchTab("interview")
                  }
                ].map((item, idx) => {
                  const isCurrent = activeStepIndex === idx;

                  return (
                    <button
                      key={item.stepNum}
                      onClick={() => {
                        setActiveStepIndex(idx);
                        item.action();
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-white border-teal-500 shadow-xs ring-1 ring-teal-500/20"
                          : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          isCurrent
                            ? "bg-teal-600 text-white"
                            : "bg-teal-50 text-teal-700 border border-teal-200"
                        }`}>
                          {item.stepNum}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${
                            isCurrent ? "text-teal-900" : "text-slate-900"
                          }`}>
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.sub}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 ${
                        isCurrent ? "text-teal-600" : "text-slate-400"
                      }`} />
                    </button>
                  );
                })}

              </div>

              {/* Center Roadmap Card (Matching Reference UI active card) */}
              <div className="md:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  {/* Top Role Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        {React.createElement(getRoleIcon(selectedRole.id), { className: "w-4 h-4" })}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900">
                          {selectedRole.name} Roadmap
                        </h3>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Popular
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    A structured {selectedRole.overview.estimatedWeeks} plan to help you crack {selectedRole.name} interviews at top product and service based companies.
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600">Your Progress</span>
                      <span className="font-black text-teal-600">{roadmapPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(5, roadmapPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Topic Checklist */}
                  <div className="space-y-2 mb-6">
                    {roadmapChecklistTopics.map((topic, tIdx) => {
                      const isDone = tIdx === 0 && completedSteps.size > 0;
                      const completedCount = isDone ? Math.round(topic.total / 2) : 0;

                      return (
                        <div key={tIdx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-b-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                              isDone ? "bg-teal-600 text-white" : "border border-slate-300 text-transparent"
                            }`}>
                              {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                            <span className={`font-semibold truncate ${
                              isDone ? "text-slate-900 font-bold" : "text-slate-700"
                            }`}>
                              {topic.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0">
                            {completedCount}/{topic.total} topics completed
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Continue Learning Action Button */}
                <button
                  onClick={() => handleSwitchTab("roadmap")}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT 4 COLUMNS: TOP COMPANIES INTERVIEW GUIDES matching reference UI */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-base text-slate-900">
                    Top Companies Interview Guides
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Role-wise interview experiences and preparation tips
                </p>
              </div>
              <button
                onClick={() => handleOpenVault("Company Specific")}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-0.5 cursor-pointer shrink-0"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of 6 Company Cards with official SVGs matching Reference UI */}
            <div className="space-y-2">
              {PREP_COMPANIES.map((company) => {
                return (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200/90 hover:border-teal-300 hover:bg-teal-50/20 text-left transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Official Vector Logo */}
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/70 p-1 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">
                          {company.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {company.id === "microsoft" ? "SDE, Data, PM, Cloud" :
                           company.id === "netflix" ? "SDE, Data, PM" :
                           company.id === "meta" ? "SDE, Data, Infra" :
                           company.id === "adobe" ? "SDE, Data, Product" :
                           "SDE, Data, PM, DevOps"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                        Interview Guide
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>

                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 4. STUDY SHEETS & PRACTICE RESOURCES (6-Card Grid matching reference UI) */}
      <section className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Study Sheets &amp; Practice Resources
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Handpicked resources to help you learn and practice effectively
            </p>
          </div>
          <button
            onClick={() => handleOpenVault("All")}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Resources</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
            {/* Card 1: DSA Sheets */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                DSA Sheets
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Arrays, Strings, Trees, Graphs and more
              </p>
            </div>
            <button
              onClick={() => handleOpenVault("DSA")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
            >
              <span>{ALL_CODING_PROBLEMS.length}+ problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: System Design */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                System Design
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Design concepts, case studies and examples
              </p>
            </div>
            <button
              onClick={() => handleOpenVault("System Design")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
            >
              <span>View resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: SQL Practice */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                SQL Practice
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Queries, case studies, real-world problems
              </p>
            </div>
            <button
              onClick={() => handleOpenVault("SQL")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
            >
              <span>Practice SQL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* Card 4: Aptitude */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Aptitude
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Quantitative, Logical Reasoning, Verbal
              </p>
            </div>
            <button
              onClick={() => handleOpenQuiz("aptitude-screening-1")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
            >
              <span>Take test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>


          {/* Card 5: Behavioral Questions */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Behavioral Questions
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                HR questions, situational tests, leadership
              </p>
            </div>
            <button
              onClick={() => handleOpenVault("Behavioral")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
            >
              <span>80+ questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Company Specific */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Company Specific
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Questions from top product companies
              </p>
            </div>
            <button
              onClick={() => handleOpenVault("Company Specific")}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
            >
              <span>300+ questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. CAREER GROWTH PATHWAYS & TRACK YOUR PREPARATION (matching reference UI) */}
      <section className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 8 Columns: Career Growth Pathways */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Career Growth Pathways
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Understand career progression and required skills
                </p>
              </div>
              <button
                onClick={() => handleSwitchTab("roadmap")}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All Paths</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4-Tier Horizontal Pathway Cards connected with arrows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
              {selectedRole.careerPathways.map((level, idx) => (
                <div key={idx} className="relative flex items-center">
                  <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[105px]">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {level.stage}
                      </h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {level.experience}
                      </div>
                    </div>
                    {level.compensation && (
                      <div className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/70 mt-2 inline-flex items-center gap-1 self-start">
                        <span>{level.compensation}</span>
                      </div>
                    )}
                  </div>

                  {idx < selectedRole.careerPathways.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center -mr-2 z-10 text-slate-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* For each level metadata bar */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
              <span className="font-bold text-slate-700">For each level, get:</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-teal-600" /> Required Skills
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" /> Key Concepts
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <FileText className="w-3.5 h-3.5 text-teal-600" /> Practice Resources
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Expected Questions
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-teal-600" /> Salary Insights
              </span>
            </div>
          </div>

          {/* Right 4 Columns: Track Your Preparation Widget matching reference UI */}
          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Track Your Preparation
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sign in to track your progress, save resources and get personalized recommendations.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              {[
                "Save study materials",
                "Track topic-wise progress",
                "Get role-based recommendations",
                "Take mock tests",
                "Prepare for your dream company"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TABBED DEEP DIVES (Comprehensive Curricula, Interactive Stepper, Skills, Projects, ATS Guide) */}
      <section ref={deepDivesRef} id="tabbed-deep-dives" className="container mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-t border-slate-200/80">
        
        {/* Deep Dive Header Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowDeepDives(prev => !prev)}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700">
                Detailed Curriculum, Study Guides &amp; ATS Resume Checklist
              </h2>
              <p className="text-xs text-slate-500">
                {showDeepDives ? "Click to collapse detailed study modules" : "Click to explore in-depth syllabus, projects, and interview rounds"}
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowDeepDives(prev => !prev)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>{showDeepDives ? "Collapse" : "Expand All"}</span>
            {showDeepDives ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showDeepDives && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs sm:text-sm font-semibold">
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

            {/* TAB 0: OVERVIEW & ROADMAP STEPPER */}
            {activeTab === "roadmap" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Stepper List */}
                    <div className="md:col-span-5 space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Stages in {selectedRole.name} Track
                      </span>
                      {selectedRole.roadmap.map((step, idx) => {
                        const isCompleted = completedSteps.has(step.id);
                        const isCurrent = activeStepIndex === idx;

                        return (
                          <button
                            key={step.id}
                            onClick={() => setActiveStepIndex(idx)}
                            className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isCurrent
                                ? "bg-teal-50/70 border-teal-500 ring-1 ring-teal-500/20"
                                : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                                isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : isCurrent
                                    ? "bg-teal-600 text-white"
                                    : "bg-slate-200 text-slate-700"
                              }`}>
                                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                              </div>
                              <div className="min-w-0">
                                <div className={`text-xs font-bold truncate ${
                                  isCurrent ? "text-teal-950" : isCompleted ? "text-emerald-900" : "text-slate-800"
                                }`}>
                                  Stage {idx + 1}: {step.title}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {step.focus}
                                </div>
                              </div>
                            </div>

                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                              step.difficulty === "Beginner" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              step.difficulty === "Intermediate" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}>
                              {step.difficulty}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Detail Panel for Active Stage */}
                    {currentStepperStep && (
                      <div className="md:col-span-7 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                                STAGE 0{currentStepperStep.stepNumber}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                currentStepperStep.difficulty === "Beginner" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                currentStepperStep.difficulty === "Intermediate" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}>
                                {currentStepperStep.difficulty}
                              </span>
                            </div>

                            <button
                              onClick={() => toggleStep(currentStepperStep.id)}
                              className={`text-xs font-semibold px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                                isCurrentStepDone
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                                  : "bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700 border border-slate-200"
                              }`}
                            >
                              {isCurrentStepDone ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Completed</span>
                                </>
                              ) : (
                                <span>Mark Stage Done</span>
                              )}
                            </button>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">
                            {currentStepperStep.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                            {currentStepperStep.description}
                          </p>

                          {/* Subtopics Checklist */}
                          <div className="mb-4">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                              Core Subtopics to Master:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {currentStepperStep.subtopics.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                                  <span className="truncate">{sub}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action & Resource Link */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-4">
                            <div className="text-slate-600">
                              <strong className="text-slate-800">Action:</strong> {currentStepperStep.recommendedAction}
                            </div>
                            {currentStepperStep.resourceUrl && (
                              <a
                                href={currentStepperStep.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-700 font-bold inline-flex items-center gap-1 shrink-0 hover:underline"
                              >
                                <span>{currentStepperStep.resourceName || "Study Guide"}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Navigation */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            disabled={activeStepIndex === 0}
                            onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                              activeStepIndex === 0
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                            }`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Previous Stage</span>
                          </button>

                          <button
                            disabled={activeStepIndex === selectedRole.roadmap.length - 1}
                            onClick={() => setActiveStepIndex(prev => Math.min(selectedRole.roadmap.length - 1, prev + 1))}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                              activeStepIndex === selectedRole.roadmap.length - 1
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-teal-700 hover:text-teal-900 hover:bg-teal-50 font-bold cursor-pointer"
                            }`}
                          >
                            <span>Next Stage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: SKILLS CHECKLIST */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {selectedRole.name} Core Skills Checklist
                      </h3>
                      <p className="text-xs text-slate-500">
                        Track which technical skills you have mastered
                      </p>
                    </div>
                    <span className="text-xs font-black text-teal-600">
                      {completedSkillsCount} / {totalSkillsCount} Mastered ({skillsPercent}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
                        Must-Know Core Skills:
                      </h4>
                      <div className="space-y-1.5">
                        {selectedRole.skills.mustKnow.map((sk, idx) => {
                          const isDone = completedSkills.has(sk);
                          return (
                            <button
                              key={idx}
                              onClick={() => toggleSkill(sk)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                isDone
                                  ? "bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold"
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                  isDone ? "bg-emerald-500 text-white" : "border border-slate-300"
                                }`}>
                                  {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </span>
                                <span>{sk}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Required</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Good-to-Know Competencies:
                      </h4>
                      <div className="space-y-1.5">
                        {selectedRole.skills.goodToKnow.map((sk, idx) => {
                          const isDone = completedSkills.has(sk);
                          return (
                            <button
                              key={idx}
                              onClick={() => toggleSkill(sk)}
                              className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                isDone
                                  ? "bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold"
                                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                  isDone ? "bg-emerald-500 text-white" : "border border-slate-300"
                                }`}>
                                  {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </span>
                                <span>{sk}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Bonus</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERVIEW ROUNDS & ASSESSMENT */}
            {activeTab === "interview" && (
              <div className="space-y-6">
                {/* Interview Sub-Navigation */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  {[
                    { id: "rounds", label: `Standard Loop (${selectedRole.interviewRounds.length} Rounds)` },
                    { id: "hr", label: `Common HR Questions (${COMMON_HR_QUESTIONS.length})` },
                    { id: "etiquette", label: "Interview Etiquette & Protocol" },
                    { id: "mistakes", label: "Common Interview Mistakes" }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setInterviewSubTab(st.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        interviewSubTab === st.id
                          ? "bg-white text-teal-800 shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Subtab 1: Standard Interview Loop */}
                {interviewSubTab === "rounds" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Standard Interview Loop for {selectedRole.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Typical stages, technical competencies, and questions evaluated by tier-1 hiring committees.
                      </p>
                    </div>

                    <div className="space-y-3 pt-1">
                      {selectedRole.interviewRounds.map((rnd, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                              {rnd.step}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">{rnd.focus}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1">{rnd.title}</h4>
                          <p className="text-xs text-slate-600 mb-3">{rnd.description}</p>
                          
                          <div className="pt-2 border-t border-slate-200/60 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Key Questions &amp; Preparation Tip:
                            </span>
                            {rnd.keyQuestions.map((kq, kIdx) => (
                              <div key={kIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                                <span className="text-teal-600 font-bold">•</span>
                                <span>{kq}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtab 2: Common HR Questions & Frameworks */}
                {interviewSubTab === "hr" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200/60 mb-2">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Behavioral &amp; HR Excellence</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          Common HR &amp; Role-Specific Interview Questions
                        </h3>
                        <p className="text-xs text-slate-500">
                          Tailored responses dynamically structured for <strong className="text-slate-800">{selectedRole.name}</strong> candidates.
                        </p>
                      </div>

                      {/* Experience Level Selector */}
                      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                        <button
                          onClick={() => setExperienceLevel("fresher")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            experienceLevel === "fresher"
                              ? "bg-teal-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          🎓 Fresher (0–1 yrs)
                        </button>
                        <button
                          onClick={() => setExperienceLevel("experienced")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            experienceLevel === "experienced"
                              ? "bg-teal-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          💼 Experienced (2+ yrs)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {COMMON_HR_QUESTIONS.map((item, idx) => {
                        const isOpen = expandedHrId === item.id;
                        const answerText = getInterviewAnswer(item, selectedRole.id, experienceLevel);

                        return (
                          <div
                            key={item.id}
                            className={`rounded-2xl border transition-all ${
                              isOpen ? "border-teal-400 bg-teal-50/10 shadow-xs" : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                            }`}
                          >
                            <button
                              onClick={() => setExpandedHrId(isOpen ? null : item.id)}
                              className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900">{item.question}</h4>
                                  <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider">{item.category}</span>
                                </div>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isOpen && (
                              <div className="px-5 pb-5 pt-1 space-y-4 text-xs border-t border-slate-100">
                                {/* Evaluator expectations */}
                                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                                  <strong className="text-slate-900 block mb-1">🎯 What the Interviewer is Evaluating:</strong>
                                  <p className="text-slate-700 leading-relaxed">{item.whatEvaluated}</p>
                                </div>

                                {/* Answer structure */}
                                <div>
                                  <strong className="text-slate-900 block mb-1.5">📐 Recommended Answer Structure:</strong>
                                  <div className="space-y-1.5">
                                    {item.howToStructure.map((step, sIdx) => (
                                      <div key={sIdx} className="flex items-start gap-2 text-slate-700">
                                        <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                          {sIdx + 1}
                                        </span>
                                        <span>{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Model Benchmark Answer */}
                                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
                                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                                    <strong className="text-teal-900 flex items-center gap-1.5">
                                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                                      <span>Model Answer ({selectedRole.name} · {experienceLevel === "fresher" ? "Fresher Candidate" : "Experienced Professional"}):</span>
                                    </strong>
                                  </div>
                                  <p className="text-slate-800 leading-relaxed font-sans whitespace-pre-line">&ldquo;{answerText}&rdquo;</p>
                                  <div className="mt-2 pt-2 border-t border-teal-200/60 text-[11px] text-teal-800 font-semibold">
                                    Tone: {item.toneGuidance}
                                  </div>
                                </div>

                                {/* Follow-up questions if available */}
                                {item.followUpQuestions && item.followUpQuestions.length > 0 && (
                                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                                    <strong className="text-slate-900 block mb-1">🔍 Likely Follow-up Questions:</strong>
                                    <ul className="space-y-1">
                                      {item.followUpQuestions.map((fq, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-1.5">
                                          <span className="text-teal-600 font-bold">•</span>
                                          <span>{fq}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Pitfalls to avoid */}
                                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                                  <strong className="text-rose-900 block mb-1">⚠️ What to Avoid Saying:</strong>
                                  <ul className="list-disc list-inside text-rose-800 space-y-1">
                                    {item.whatToAvoid.map((pitfall, pIdx) => (
                                      <li key={pIdx}>{pitfall}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subtab 3: Interview Etiquette & Body Language */}
                {interviewSubTab === "etiquette" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Professional Interview Etiquette &amp; Executive Presence
                      </h3>
                      <p className="text-xs text-slate-500">
                        Behavioral cues, voice pacing, body language, and protocols that distinguish top candidates.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {INTERVIEW_ETIQUETTE_GUIDE.map((eti, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-sm">{eti.topic}</h4>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {eti.category}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{eti.guidance}</p>

                          <div className="pt-2 border-t border-slate-200/60 space-y-2">
                            <div>
                              <strong className="text-emerald-800 font-bold block mb-1">✓ What to Do:</strong>
                              <ul className="space-y-1 text-slate-700">
                                {eti.doList.map((d, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-1.5">
                                    <span className="text-emerald-600 font-bold">•</span>
                                    <span>{d}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <strong className="text-rose-800 font-bold block mb-1">✕ What to Avoid:</strong>
                              <ul className="space-y-1 text-slate-700">
                                {eti.dontList.map((d, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-1.5">
                                    <span className="text-rose-500 font-bold">•</span>
                                    <span>{d}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtab 4: Common Interview Mistakes */}
                {interviewSubTab === "mistakes" && (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Top 5 Fatal Interview Mistakes &amp; How to Prevent Them
                      </h3>
                      <p className="text-xs text-slate-500">
                        Critical behavioral and technical mistakes identified by engineering hiring managers.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {COMMON_INTERVIEW_MISTAKES.map((mst, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">{mst.mistake}</h4>
                          </div>

                          <div className="pl-7 space-y-1.5">
                            <div className="text-slate-600">
                              <strong className="text-rose-700">Why It Hurts: </strong>
                              {mst.impact}
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                              <strong>✓ The High-Impact Fix: </strong>
                              {mst.howToFix}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PRACTICE QUESTIONS */}
            {activeTab === "practice" && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Practice Question Bank
                      </h3>
                      <p className="text-xs text-slate-500">
                        Curated questions tailored for {selectedRole.name} interviews
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenVault("All")}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Full Vault</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedRole.practiceQuestions.map((q) => {
                      const isDone = completedQuestions.has(q.id);

                      return (
                        <div key={q.id} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              onClick={() => toggleQuestion(q.id)}
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 cursor-pointer ${
                                isDone ? "bg-emerald-500 text-white" : "border-2 border-slate-300 hover:border-teal-500"
                              }`}
                            >
                              {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                                  q.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                  q.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                  "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-[10px] text-slate-500 font-semibold">{q.topic}</span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">{q.title}</h4>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{q.questionText}</p>
                              <div className="mt-2 text-xs text-teal-800 bg-teal-50/70 p-2 rounded-lg border border-teal-200/60">
                                <strong>Hint:</strong> {q.solutionHint}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            {q.type === "Coding" && (
                              <button
                                onClick={() => handleOpenCoding()}
                                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                title="Solve in DSA Coding Sandbox (Python, Java, C, C++)"
                              >
                                <Code2 className="w-3 h-3" />
                                <span>Solve (DSA)</span>
                              </button>
                            )}
                            {q.type === "SQL" && (
                              <button
                                onClick={() => handleOpenSql()}
                                className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                title="Solve in SQL Sandbox (MySQL, PostgreSQL, SQL Server)"
                              >
                                <Database className="w-3 h-3" />
                                <span>Solve (SQL)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PORTFOLIO PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    Recommended Capstone &amp; Architecture Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRole.projects.map((proj) => (
                      <div key={proj.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {proj.difficulty}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 mb-1">{proj.title}</h4>
                          <p className="text-xs text-slate-600 mb-3">{proj.whatItDemonstrates}</p>
                          
                          <div className="mb-2">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Recommended Stack:</span>
                            <div className="flex flex-wrap gap-1">
                              {proj.recommendedStack.map((st, sIdx) => (
                                <span key={sIdx} className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">
                                  {st}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-600">
                          <strong>Interview Talking Point:</strong> {proj.talkingPoints[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ATS RESUME GUIDANCE */}
            {activeTab === "resume" && (
              <div className="space-y-4">
                {/* 1. Resume Persistence & Management Card (Requirement 16) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {currentUser?.resumeFile ? (
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-sm">{currentUser.resumeFile.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Resume Uploaded
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                              {atsMatchResult.score}% ATS Match
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Uploaded on {new Date(currentUser.resumeFile.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {(currentUser.resumeFile.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">No Resume Uploaded</div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Upload your resume (PDF/DOCX) to auto-verify keywords against {selectedRole.name} requirements.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleResumeFileChange}
                        className="hidden"
                      />
                      {currentUser?.resumeFile ? (
                        <>
                          <button
                            onClick={() => resumeInputRef.current?.click()}
                            disabled={isUploadingResume}
                            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {isUploadingResume ? "Parsing..." : "Replace Resume"}
                          </button>
                          <button
                            onClick={handleRemoveResume}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                          >
                            Remove Resume
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              window.location.href = "/login";
                            } else {
                              resumeInputRef.current?.click();
                            }
                          }}
                          disabled={isUploadingResume}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isUploadingResume ? "Parsing Resume..." : currentUser ? "Upload Resume" : "Sign In to Upload"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">
                          High-Frequency ATS Keywords for {selectedRole.name}
                        </h4>
                        {currentUser?.resumeFile && (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            atsMatchResult.score >= 70
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : atsMatchResult.score >= 40
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}>
                            {atsMatchResult.score}% Matched
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentUser?.resumeFile 
                          ? `Found ${atsMatchResult.matchedKeywords.length} of ${selectedRole.resumeGuidance.atsKeywords.length} required keywords in your uploaded resume.`
                          : "Ensure these exact terms appear naturally in your resume for optimal ATS parsing."}
                      </p>
                    </div>

                    <button
                      onClick={handleCopyKeywords}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      {copiedKeywords ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKeywords ? "Copied!" : "Copy Keywords"}</span>
                    </button>
                  </div>

                  {/* Keywords with live match badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedRole.resumeGuidance.atsKeywords.map((kw, idx) => {
                      const isMatched = currentUser?.resumeFile 
                        ? atsMatchResult.matchedKeywords.some(m => m.toLowerCase() === kw.toLowerCase().trim())
                        : false;

                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border ${
                            !currentUser?.resumeFile
                              ? "bg-slate-50 text-slate-700 border-slate-200"
                              : isMatched
                              ? "bg-emerald-50/90 text-emerald-800 border-emerald-300 shadow-2xs font-bold"
                              : "bg-rose-50/50 text-rose-700 border-rose-200/80"
                          }`}
                        >
                          {currentUser?.resumeFile && (
                            isMatched ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            )
                          )}
                          <span>{kw}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Bullet Points */}
                  <h4 className="font-bold text-sm text-slate-900 mb-2">Sample High-Impact Bullet Points (XYZ Formula):</h4>
                  <div className="space-y-2">
                    {selectedRole.resumeGuidance.sampleBulletPoints.map((bp, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs text-slate-700 font-sans">
                        &ldquo;{bp}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </section>

      {/* 7. COMPANY INTERVIEW GUIDE MODAL (with official SVG logo) */}
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
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedCompany.logo}
                    alt={`${selectedCompany.name} logo`}
                    className="w-7 h-7 object-contain"
                  />
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
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
                        Reported Questions &amp; Interview Experiences at {selectedCompany.name}:
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

      {/* 8. MODALS CONNECTIVITY */}
      {/* Quiz / Assessment Test Modal */}
      <QuizTestModal
        quiz={randomizedQuiz || undefined}
        isOpen={quizModalOpen}
        onClose={() => { setQuizModalOpen(false); setRandomizedQuiz(null); }}
        initialQuizId={randomizedQuiz ? undefined : activeQuizId}
        onQuizCompleted={() => {
          setQuizModalOpen(false);
          setRandomizedQuiz(null);
        }}
      />


      {/* Coding Environment Modal */}
      <CodingEnvironmentModal
        isOpen={codingModalOpen}
        onClose={() => setCodingModalOpen(false)}
        initialProblemId={activeCodingProblemId}
        selectedRoleId={selectedRole.id}
        onProblemSolved={(probId) => {
          toggleQuestion(probId);
        }}
      />

      {/* SQL Practice Environment Modal */}
      <SqlEnvironmentModal
        isOpen={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
        initialProblemId={activeSqlProblemId}
        onProblemSolved={(probId) => {
          toggleQuestion(probId);
        }}
      />


      {/* Question Vault Modal */}
      <QuestionVaultModal
        isOpen={vaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
        selectedRole={selectedRole}
        initialCategory={vaultInitialCategory}
        onOpenCodingProblem={(probId) => handleOpenCoding(probId)}
        onOpenSqlProblem={(probId) => handleOpenSql(probId)}
        onOpenQuizTest={(quizId) => handleOpenQuiz(quizId)}
      />

    </div>
  );
}
