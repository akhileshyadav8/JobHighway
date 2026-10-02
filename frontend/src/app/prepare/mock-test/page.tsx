"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart2,
  RotateCcw,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  Sparkles,
  Award,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { ALL_PREPARATION_ROLES, getPrepRoleById } from "@/lib/preparationData";
import { getRandomizedQuiz, QuizTest, QuizAttemptRecord } from "@/lib/quizData";
import { getCurrentUser } from "@/lib/auth";

const ACTIVE_TEST_STORAGE_KEY = "jobhighway_active_test_session";

interface ActiveTestSession {
  quiz: QuizTest;
  userAnswers: Record<string, number>;
  markedForReview: string[];
  currentQuestionIndex: number;
  secondsRemaining: number;
  startedAt: string;
}

function MockTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = searchParams.get("role") || "";
  const queryCategory = searchParams.get("category") || "all";

  // Active Test State
  const [session, setSession] = useState<ActiveTestSession | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptRecord, setAttemptRecord] = useState<QuizAttemptRecord | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [loading, setLoading] = useState(true);

  // Setup / Recovery Portal State (when no active test is running)
  const [selectedRole, setSelectedRole] = useState(queryRole || "software-engineer");
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);

  // 1. Initial Load: Check for existing session or initialize from query params
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_TEST_STORAGE_KEY);
      if (stored) {
        const parsed: ActiveTestSession = JSON.parse(stored);
        if (parsed.quiz && parsed.quiz.questions && parsed.quiz.questions.length > 0) {
          setSession(parsed);
          setLoading(false);
          return;
        }
      }

      // Check legacy sessionStorage fallback
      const sessionFallback = sessionStorage.getItem("jobhighway_active_mock_test");
      if (sessionFallback) {
        const parsedQuiz = JSON.parse(sessionFallback);
        sessionStorage.removeItem("jobhighway_active_mock_test");
        const newSession: ActiveTestSession = {
          quiz: parsedQuiz,
          userAnswers: {},
          markedForReview: [],
          currentQuestionIndex: 0,
          secondsRemaining: parsedQuiz.durationMinutes * 60,
          startedAt: new Date().toISOString()
        };
        localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(newSession));
        setSession(newSession);
        setLoading(false);
        return;
      }

      // If URL params were provided, auto-start that test
      if (queryRole) {
        const generated = getRandomizedQuiz(queryRole, queryCategory, 30);
        if (generated) {
          const newSession: ActiveTestSession = {
            quiz: generated,
            userAnswers: {},
            markedForReview: [],
            currentQuestionIndex: 0,
            secondsRemaining: generated.durationMinutes * 60,
            startedAt: new Date().toISOString()
          };
          localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(newSession));
          setSession(newSession);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Error loading test session:", e);
    } finally {
      setLoading(false);
    }
  }, [queryRole, queryCategory]);

  // 2. Countdown Timer Effect
  useEffect(() => {
    if (!session || isSubmitted) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev) return null;
        if (prev.secondsRemaining <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          setTimeout(() => handleSubmitTest(), 100);
          return { ...prev, secondsRemaining: 0 };
        }
        const updated = { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
        // Sync to localStorage
        try {
          localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.quiz?.id, isSubmitted]);

  // 3. User interaction handlers
  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isSubmitted || !session) return;
    setSession((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        userAnswers: { ...prev.userAnswers, [qId]: optIndex }
      };
      try {
        localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleMarkForReview = (qId: string) => {
    if (isSubmitted || !session) return;
    setSession((prev) => {
      if (!prev) return null;
      const set = new Set(prev.markedForReview);
      if (set.has(qId)) set.delete(qId);
      else set.add(qId);
      const updated = { ...prev, markedForReview: Array.from(set) };
      try {
        localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleNavigateQuestion = (index: number) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, currentQuestionIndex: index };
      try {
        localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 4. Start New Test from Launcher
  const handleStartTest = (roleId: string, category: string) => {
    const generated = getRandomizedQuiz(roleId, category, 30);
    if (!generated) return;
    const newSession: ActiveTestSession = {
      quiz: generated,
      userAnswers: {},
      markedForReview: [],
      currentQuestionIndex: 0,
      secondsRemaining: generated.durationMinutes * 60,
      startedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(newSession));
    } catch {}
    setSession(newSession);
    setIsSubmitted(false);
    setAttemptRecord(null);
  };

  // 5. Submit Test & Persist Results
  const handleSubmitTest = async () => {
    if (!session) return;
    setShowConfirmSubmit(false);
    setIsSubmitted(true);

    const { quiz, userAnswers, secondsRemaining } = session;
    const totalQuestions = quiz.questions.length;
    let correctCount = 0;

    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScorePercent;
    const timeSpent = quiz.durationMinutes * 60 - secondsRemaining;

    // Calculate topic performance
    const topicMap: Record<string, { total: number; correct: number }> = {};
    quiz.questions.forEach((q) => {
      if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, correct: 0 };
      topicMap[q.topic].total++;
      if (userAnswers[q.id] === q.correctAnswer) {
        topicMap[q.topic].correct++;
      }
    });

    const topicPerformance = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      total: data.total,
      correct: data.correct,
      pct: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }));

    const user = getCurrentUser();
    const record: QuizAttemptRecord = {
      id: "attempt_" + Date.now(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      roleId: quiz.roleId,
      category: quiz.category,
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      timeSpentSeconds: Math.max(1, timeSpent),
      completedAt: new Date().toISOString(),
      userAnswers
    };

    setAttemptRecord(record);

    // Clean up active session from storage
    try {
      localStorage.removeItem(ACTIVE_TEST_STORAGE_KEY);
    } catch {}

    // Save in user local history
    try {
      const userPrefix = user?.id ? `user_${user.id}_` : "guest_";
      const key = `jobhighway_quiz_history_${userPrefix}`;
      const saved = localStorage.getItem(key);
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(record);
      localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
    } catch {}

    // Persist to backend API
    try {
      await fetch("/api/prepare/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "guest",
          userEmail: user?.email || "guest@jobhighway.com",
          userName: user?.name || "Guest Candidate",
          quizId: quiz.id,
          quizTitle: quiz.title,
          roleId: quiz.roleId,
          category: quiz.category,
          score: correctCount,
          totalQuestions,
          percentage,
          passed,
          timeSpentSeconds: Math.max(1, timeSpent),
          userAnswers,
          topicPerformance
        })
      });
    } catch (e) {
      console.warn("Failed to persist attempt to backend:", e);
    }
  };

  const handleExitTest = () => {
    if (window.confirm("Are you sure you want to exit? Your current test session will be cancelled.")) {
      try {
        localStorage.removeItem(ACTIVE_TEST_STORAGE_KEY);
      } catch {}
      setSession(null);
      setIsSubmitted(false);
      setAttemptRecord(null);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-medium text-sm">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: TEST LAUNCHER & SETUP PORTAL (Shown when no active test running)
  // =========================================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-black text-xl text-teal-800 tracking-tight">JobHighway</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Examination Center</span>
          </div>
          <Link
            href="/prepare"
            className="text-xs font-semibold text-slate-600 hover:text-teal-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Prepare Hub</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30-Question Timed Assessment</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Launch Candidate Mock Examination
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Experience realistic interview questions with a live timer, detailed performance diagnostics, and official explanations.
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. Select Target Job Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ALL_PREPARATION_ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer text-xs font-bold ${
                      selectedRole === role.id
                        ? "bg-teal-50 border-teal-500 text-teal-900 shadow-xs ring-1 ring-teal-500/30"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Select Assessment Round
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  { id: "all", title: "Comprehensive Round", desc: "30 questions balanced across all topics" },
                  { id: "Technical Round", title: "Technical Core Round", desc: "Architecture, algorithms & concepts" },
                  { id: "Aptitude Round", title: "Quantitative & Logic", desc: "Mathematical reasoning & data interpretation" },
                  { id: "HR & Behavioral Round", title: "HR & Behavioral Round", desc: "STAR framework & cultural fit" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-teal-50 border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500/30"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold mb-0.5">{cat.title}</div>
                    <div className="text-[11px] text-slate-500">{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Assessment Rules Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
              <div>
                <div className="text-slate-400 font-semibold text-[11px]">Questions</div>
                <div className="text-base font-black text-slate-900 mt-0.5">30 MCQs</div>
              </div>
              <div>
                <div className="text-slate-400 font-semibold text-[11px]">Duration</div>
                <div className="text-base font-black text-slate-900 mt-0.5">45 Minutes</div>
              </div>
              <div>
                <div className="text-slate-400 font-semibold text-[11px]">Passing Score</div>
                <div className="text-base font-black text-teal-700 mt-0.5">70% Threshold</div>
              </div>
              <div>
                <div className="text-slate-400 font-semibold text-[11px]">Review Format</div>
                <div className="text-base font-black text-slate-900 mt-0.5">Full Solutions</div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <Link
                href="/prepare"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={() => handleStartTest(selectedRole, selectedCategory)}
                className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Start 30-Question Assessment</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { quiz, userAnswers, markedForReview, currentQuestionIndex, secondsRemaining } = session;
  const currentQ = quiz.questions[currentQuestionIndex] || quiz.questions[0];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const markedSet = new Set(markedForReview);

  // =========================================================================
  // VIEW 2: POST-SUBMISSION DETAILED SCORECARD & QUESTION REVIEW
  // =========================================================================
  if (isSubmitted && attemptRecord) {
    // Topic performance breakdown
    const topicMap: Record<string, { total: number; correct: number }> = {};
    quiz.questions.forEach((q) => {
      if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, correct: 0 };
      topicMap[q.topic].total++;
      if (userAnswers[q.id] === q.correctAnswer) {
        topicMap[q.topic].correct++;
      }
    });

    const topicPerformance = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      total: data.total,
      correct: data.correct,
      pct: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }));

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl text-teal-800 tracking-tight">JobHighway</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment Report</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>View Dashboard</span>
            </Link>
            <Link
              href="/prepare"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Return to Prepare</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 space-y-6">
          {/* Summary Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
            attemptRecord.passed
              ? "bg-gradient-to-br from-emerald-500/10 via-white to-white border-emerald-200"
              : "bg-gradient-to-br from-amber-500/10 via-white to-white border-amber-200"
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black ${
                  attemptRecord.passed ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {attemptRecord.passed ? "✓" : "!"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      attemptRecord.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {attemptRecord.passed ? "PASSED ASSESSMENT" : "NEEDS IMPROVEMENT"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Passing Threshold: {quiz.passingScorePercent}%</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Your Score: {attemptRecord.score} / {attemptRecord.totalQuestions} ({attemptRecord.percentage}%)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Completed in {Math.floor(attemptRecord.timeSpentSeconds / 60)}m {attemptRecord.timeSpentSeconds % 60}s · {quiz.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartTest(quiz.roleId, quiz.category)}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Another Test</span>
                </button>
              </div>
            </div>
          </div>

          {/* Topic Performance Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-teal-600" />
              <span>Topic-wise Performance Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {topicPerformance.map((tp, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 truncate pr-2">{tp.topic}</span>
                    <span className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                      tp.pct >= 70 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {tp.pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tp.pct >= 70 ? "bg-emerald-500" : "bg-rose-500"}`}
                      style={{ width: `${tp.pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{tp.correct} of {tp.total} correct</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Question Review &amp; Official Solutions ({totalQuestions} Questions)
            </h3>

            {quiz.questions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctAnswer;
              const isUnanswered = selectedOpt === undefined;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? "bg-white border-emerald-200"
                      : isUnanswered
                      ? "bg-white border-amber-200"
                      : "bg-white border-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                        isCorrect ? "bg-emerald-600" : isUnanswered ? "bg-amber-500" : "bg-rose-500"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase font-mono">{q.topic}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      isCorrect
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : isUnanswered
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}>
                      {isCorrect ? "Correct ✓" : isUnanswered ? "Unanswered" : "Incorrect ✕"}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mb-3 leading-relaxed">{q.question}</p>

                  <div className="space-y-1.5 text-xs mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isActualCorrect = q.correctAnswer === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isActualCorrect
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                              : isChosen && !isCorrect
                              ? "bg-rose-50 border-rose-300 text-rose-950 line-through"
                              : "bg-slate-50/60 border-slate-100 text-slate-600"
                          }`}
                        >
                          <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                          {isActualCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                              Correct Answer
                            </span>
                          )}
                          {isChosen && !isCorrect && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded">
                              Your Selection
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-teal-50/60 border border-teal-200/80 rounded-xl text-xs text-slate-700 leading-relaxed">
                    <strong className="text-teal-900 block mb-0.5">💡 Expert Explanation:</strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: LIVE ACTIVE EXAMINATION INTERFACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Examination Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="font-black text-lg sm:text-xl text-teal-800 tracking-tight">JobHighway</span>
          <span className="text-slate-300">|</span>
          <div className="truncate max-w-[180px] sm:max-w-md">
            <span className="text-xs font-bold text-slate-900 block truncate">{quiz.title}</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{quiz.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs sm:text-sm font-bold ${
            secondsRemaining < 180
              ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
              : "bg-slate-100 border-slate-200 text-slate-800"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            <span className="hidden sm:inline">Finish &amp; Submit</span>
            <span className="sm:hidden">Submit</span>
          </button>

          <button
            onClick={handleExitTest}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Examination Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Question */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-5">
            {/* Question Meta Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60 font-mono">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  {currentQ.topic}
                </span>
              </div>

              <button
                onClick={() => toggleMarkForReview(currentQ.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  markedSet.has(currentQ.id)
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <Flag className="w-3 h-3" />
                <span>{markedSet.has(currentQ.id) ? "Marked" : "Mark for Review"}</span>
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-sans">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? "bg-teal-50/80 border-teal-600 text-teal-950 font-semibold shadow-xs ring-1 ring-teal-500/20"
                        : "bg-slate-50/70 border-slate-200 text-slate-800 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected ? "bg-teal-600 text-white" : "bg-white border border-slate-300 text-slate-700"
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => handleNavigateQuestion(currentQuestionIndex - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-400 font-mono">
                Answered: <strong className="text-slate-800">{answeredCount}</strong> / {totalQuestions}
              </div>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => handleNavigateQuestion(currentQuestionIndex + 1)}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Review &amp; Submit</span>
                  <Send className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Question Palette</h3>
              <span className="text-xs text-slate-400 font-mono">{answeredCount} answered</span>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600 shrink-0" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 shrink-0" />
                <span>Unanswered</span>
              </div>
            </div>

            {/* Grid of 30 question pills */}
            <div className="grid grid-cols-6 gap-2 pt-2">
              {quiz.questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isMarked = markedSet.has(q.id);
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleNavigateQuestion(idx)}
                    className={`h-9 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer relative flex items-center justify-center ${
                      isCurrent
                        ? "ring-2 ring-teal-500 ring-offset-2 scale-105 z-10"
                        : ""
                    } ${
                      isMarked
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : isAnswered
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {idx + 1}
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal before Submit */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Submit Your Examination?</h3>
                <p className="text-xs text-slate-500">You will receive your score breakdown immediately.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Questions:</span>
                <span className="font-bold text-slate-900 font-mono">{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Answered:</span>
                <span className="font-bold text-emerald-600 font-mono">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Unanswered:</span>
                <span className="font-bold text-rose-500 font-mono">{totalQuestions - answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Marked for Review:</span>
                <span className="font-bold text-amber-600 font-mono">{markedForReview.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Back to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MockTestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MockTestContent />
    </Suspense>
  );
}
