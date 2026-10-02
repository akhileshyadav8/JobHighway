"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { QuizTestModal } from "@/components/prepare/QuizTestModal";
import { QuizTest } from "@/lib/quizData";

export default function MockTestPage() {
  const [quiz, setQuiz] = useState<QuizTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("jobhighway_active_mock_test");
      if (stored) {
        const parsed = JSON.parse(stored);
        setQuiz(parsed);
        // Clean up so refresh doesn't re-use stale data
        sessionStorage.removeItem("jobhighway_active_mock_test");
      } else {
        setError("No mock test data found. Please go back to Prepare and start a new test.");
      }
    } catch (e) {
      setError("Failed to load mock test. Please go back to Prepare and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your mock test…</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-rose-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Mock Test Not Found</h1>
        <p className="text-slate-500 max-w-md">{error || "No test data available."}</p>
        <Link
          href="/prepare"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prepare
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
          <span className="text-3xl">🎉</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Test Completed!</h1>
        <p className="text-slate-500 max-w-md">Your results have been saved. Return to the Prepare page to start another test or review your progress.</p>
        <div className="flex items-center gap-3">
          <Link
            href="/prepare"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prepare
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal top bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-teal-700 font-black text-lg tracking-tight">JobHighway</div>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-semibold text-slate-600">Mock Test</span>
        </div>
        <Link
          href="/prepare"
          className="text-xs font-semibold text-slate-500 hover:text-teal-600 inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit Test
        </Link>
      </div>

      {/* Full quiz content - rendered inline (not as a modal overlay) */}
      <QuizTestModal
        quiz={quiz}
        isOpen={true}
        onClose={() => setCompleted(true)}
        onQuizCompleted={() => setCompleted(true)}
        onAttemptCompleted={() => {}}
        fullPage={true}
      />
    </div>
  );
}
