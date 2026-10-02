"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  RotateCcw,
  Award,
  ChevronRight,
  TrendingUp,
  BarChart2
} from "lucide-react";
import { QuizTest, QuizAttemptRecord, ALL_ASSESSMENT_QUIZZES } from "@/lib/quizData";
import { User, getCurrentUser } from "@/lib/auth";

interface QuizTestModalProps {
  quiz?: QuizTest | null;
  isOpen?: boolean;
  initialQuizId?: string;
  currentUser?: User | null;
  onClose: () => void;
  onAttemptCompleted?: (record: QuizAttemptRecord) => void;
  onQuizCompleted?: (record?: QuizAttemptRecord) => void;
  fullPage?: boolean; // When true, renders without modal overlay (for new-tab experience)
}

export function QuizTestModal({
  quiz: propQuiz,
  isOpen = true,
  initialQuizId,
  currentUser: propUser,
  onClose,
  onAttemptCompleted,
  onQuizCompleted,
  fullPage = false
}: QuizTestModalProps) {
  const quiz: QuizTest = useMemo(() => {
    if (propQuiz) return propQuiz;
    if (initialQuizId) {
      return ALL_ASSESSMENT_QUIZZES.find((q: QuizTest) => q.id === initialQuizId) || ALL_ASSESSMENT_QUIZZES[0];
    }
    return ALL_ASSESSMENT_QUIZZES[0];
  }, [propQuiz, initialQuizId]);

  const currentUser = useMemo(() => {
    return propUser || (typeof window !== "undefined" ? getCurrentUser() : null);
  }, [propUser]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [attemptRecord, setAttemptRecord] = useState<QuizAttemptRecord | null>(null);

  // Initialize timer on modal open
  useEffect(() => {
    if (quiz) {
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setMarkedForReview(new Set());
      setSecondsRemaining(quiz.durationMinutes * 60);
      setIsSubmitted(false);
      setShowConfirmSubmit(false);
      setAttemptRecord(null);
    }
  }, [quiz]);

  // Countdown Timer
  useEffect(() => {
    if (!quiz || isSubmitted || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, isSubmitted, secondsRemaining]);

  if (!quiz) return null;

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const handleSubmitTest = () => {
    setShowConfirmSubmit(false);
    setIsSubmitted(true);

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScorePercent;
    const timeSpent = quiz.durationMinutes * 60 - secondsRemaining;

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
    if (onAttemptCompleted) onAttemptCompleted(record);
    if (onQuizCompleted) onQuizCompleted(record);

    // Save in user's permanent attempt history
    try {
      const userPrefix = currentUser?.id ? `user_${currentUser.id}_` : "guest_";
      const key = `jobhighway_quiz_history_${userPrefix}`;
      const saved = localStorage.getItem(key);
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(record);
      localStorage.setItem(key, JSON.stringify(list.slice(0, 30)));
    } catch (e) {}
  };

  // Performance breakdown by topic for completed test
  const topicPerformance = useMemo(() => {
    if (!isSubmitted) return [];
    const topicsMap: Record<string, { total: number; correct: number }> = {};
    quiz.questions.forEach((q) => {
      if (!topicsMap[q.topic]) {
        topicsMap[q.topic] = { total: 0, correct: 0 };
      }
      topicsMap[q.topic].total++;
      if (userAnswers[q.id] === q.correctAnswer) {
        topicsMap[q.topic].correct++;
      }
    });

    return Object.entries(topicsMap).map(([topic, data]) => ({
      topic,
      ...data,
      pct: Math.round((data.correct / data.total) * 100)
    }));
  }, [isSubmitted, quiz, userAnswers]);

  if (!isOpen || !quiz) return null;

  const content = (
    <div
      className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      onClick={(e) => e.stopPropagation()}
    >
        {/* Header Bar */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {quiz.category}
              </span>
              <span className="text-xs text-slate-400">· {quiz.difficulty}</span>
              {quiz.companyTag && (
                <span className="text-xs text-slate-400 font-medium">· {quiz.companyTag}</span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold truncate max-w-lg">{quiz.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs sm:text-sm font-bold ${
                secondsRemaining < 120 
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse" 
                  : "bg-slate-800 border-slate-700 text-teal-300"
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Question Details and Options */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-700">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Topic: {currentQ.topic}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-5">
                  {currentQ.question}
                </h3>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQ.id] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? "border-teal-500 bg-teal-50/70 text-slate-900 font-semibold ring-2 ring-teal-500/20 shadow-xs"
                            : "border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? "bg-teal-600 text-white" : "border border-slate-300 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleMarkForReview}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg border inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    markedForReview.has(currentQ.id)
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{markedForReview.has(currentQ.id) ? "Marked for Review" : "Mark for Review"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 ${
                      currentQuestionIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Submit Test</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Question Palette & Overview */}
            <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  Question Palette
                </span>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  {quiz.questions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isMarked = markedForReview.has(q.id);
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-slate-900 text-white ring-2 ring-teal-500"
                            : isMarked
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : isAnswered
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-emerald-600 shrink-0" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300 shrink-0" />
                    <span>Marked for Review ({markedForReview.size})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-white border border-slate-200 shrink-0" />
                    <span>Unanswered ({totalQuestions - answeredCount})</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Submit Assessment ({answeredCount}/{totalQuestions} Answered)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* RESULT SCREEN (SCORECARD & COMPREHENSIVE EXPLANATION REVIEW) */
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Scorecard Hero Banner */}
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              attemptRecord?.passed
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                : "bg-amber-50/70 border-amber-200 text-amber-950"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                  attemptRecord?.passed ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                }`}>
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      attemptRecord?.passed ? "bg-emerald-200/60 text-emerald-900" : "bg-amber-200/60 text-amber-900"
                    }`}>
                      {attemptRecord?.passed ? "PASSED ASSESSMENT" : "NEEDS IMPROVEMENT"}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Passing Bar: {quiz.passingScorePercent}%
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mt-1">
                    Your Score: {attemptRecord?.score} / {attemptRecord?.totalQuestions} ({attemptRecord?.percentage}%)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Completed in {Math.floor((attemptRecord?.timeSpentSeconds || 0) / 60)}m {((attemptRecord?.timeSpentSeconds || 0) % 60)}s
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setUserAnswers({});
                    setMarkedForReview(new Set());
                    setSecondsRemaining(quiz.durationMinutes * 60);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Topic Performance Grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                <span>Topic-wise Performance Breakdown</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topicPerformance.map((tp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{tp.topic}</div>
                      <div className="text-[11px] text-slate-500">{tp.correct} of {tp.total} correct</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      tp.pct >= 70 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {tp.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Question Review with Explanations */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Question Review &amp; Official Solutions
              </h4>

              {quiz.questions.map((q, idx) => {
                const userSelected = userAnswers[q.id];
                const isCorrect = userSelected === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isCorrect ? "bg-white border-emerald-200" : "bg-white border-rose-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                          isCorrect ? "bg-emerald-600" : "bg-rose-500"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500 uppercase font-mono">
                          {q.topic}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isCorrect ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}>
                        {isCorrect ? "Correct ✓" : "Incorrect ✕"}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 mb-3">{q.question}</p>

                    <div className="space-y-1.5 text-xs mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userSelected === optIdx;
                        const isActualCorrect = q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between ${
                              isActualCorrect
                                ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                                : isChosen && !isCorrect
                                  ? "bg-rose-50 border-rose-300 text-rose-950 line-through"
                                  : "bg-slate-50/60 border-slate-100 text-slate-600"
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isActualCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700">Correct Answer</span>
                            )}
                            {isChosen && !isCorrect && (
                              <span className="text-[10px] font-bold text-rose-700">Your Selection</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-slate-700 leading-relaxed">
                      <strong className="text-teal-900 block mb-0.5">💡 Expert Rationale:</strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirmation Modal before Submit */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Confirm Test Submission</h4>
                  <p className="text-xs text-slate-500">Are you sure you want to finish your assessment?</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div>• Total Questions: <strong>{totalQuestions}</strong></div>
                <div>• Answered Questions: <strong className="text-emerald-700">{answeredCount}</strong></div>
                <div>• Unanswered: <strong className="text-rose-700">{totalQuestions - answeredCount}</strong></div>
                {markedForReview.size > 0 && (
                  <div>• Marked for Review: <strong className="text-amber-700">{markedForReview.size}</strong></div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Keep Reviewing
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm &amp; Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl">
        {content}
      </div>
    </div>
  );
}
