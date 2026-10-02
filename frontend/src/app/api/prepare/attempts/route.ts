import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ATTEMPTS_FILE = path.join(DATA_DIR, "mock_test_attempts.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ATTEMPTS_FILE)) {
    fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify([]), "utf-8");
  }
}

function readAttempts(): any[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(ATTEMPTS_FILE, "utf-8");
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

function writeAttempts(attempts: any[]) {
  try {
    ensureFile();
    fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(attempts, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write mock test attempts:", err);
  }
}

// GET /api/prepare/attempts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const roleId = searchParams.get("roleId");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let list = readAttempts();

    if (userId) {
      list = list.filter((a) => a.userId === userId || a.userId === "guest" || a.userId === `user_${userId}`);
    }
    if (roleId && roleId !== "all") {
      list = list.filter((a) => a.roleId === roleId);
    }

    // Sort by completedAt descending
    list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    // Analytics computation
    const totalAttempts = list.length;
    const passedAttempts = list.filter((a) => a.passed).length;
    const totalPercentage = list.reduce((sum, a) => sum + (a.percentage || 0), 0);
    const averagePercentage = totalAttempts > 0 ? Math.round(totalPercentage / totalAttempts) : 0;
    const bestScore = list.reduce((max, a) => Math.max(max, a.percentage || 0), 0);
    const latestScore = list.length > 0 ? list[0].percentage : 0;

    // Aggregate topic performance across attempts
    const topicAgg: Record<string, { total: number; correct: number }> = {};
    for (const a of list) {
      if (Array.isArray(a.topicPerformance)) {
        for (const tp of a.topicPerformance) {
          if (!topicAgg[tp.topic]) topicAgg[tp.topic] = { total: 0, correct: 0 };
          topicAgg[tp.topic].total += tp.total || 0;
          topicAgg[tp.topic].correct += tp.correct || 0;
        }
      }
    }

    const topicsRanked = Object.entries(topicAgg)
      .map(([topic, data]) => ({
        topic,
        pct: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        total: data.total,
        correct: data.correct
      }))
      .sort((a, b) => b.pct - a.pct);

    const strongestTopics = topicsRanked.filter((t) => t.pct >= 70).slice(0, 3);
    const weakestTopics = [...topicsRanked].reverse().filter((t) => t.pct < 70).slice(0, 3);

    return NextResponse.json({
      attempts: list.slice(0, limit),
      analytics: {
        totalAttempts,
        passedAttempts,
        passRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
        averagePercentage,
        bestScore,
        latestScore,
        strongestTopics,
        weakestTopics
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch attempts" }, { status: 500 });
  }
}

// POST /api/prepare/attempts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      userEmail,
      userName,
      quizId,
      quizTitle,
      roleId,
      category,
      score,
      totalQuestions,
      percentage,
      passed,
      timeSpentSeconds,
      userAnswers,
      topicPerformance,
      difficultyPerformance
    } = body;

    if (!quizTitle || totalQuestions === undefined) {
      return NextResponse.json({ error: "Missing required attempt fields" }, { status: 400 });
    }

    const attempt = {
      id: "attempt_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      userId: userId || "guest",
      userEmail: userEmail || "Anonymous Candidate",
      userName: userName || "Anonymous Candidate",
      quizId: quizId || "custom_quiz",
      quizTitle,
      roleId: roleId || "software-engineer",
      category: category || "Technical Round",
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 30,
      percentage: Number(percentage) || 0,
      passed: Boolean(passed),
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      userAnswers: userAnswers || {},
      topicPerformance: topicPerformance || [],
      difficultyPerformance: difficultyPerformance || {},
      completedAt: new Date().toISOString()
    };

    const current = readAttempts();
    current.unshift(attempt);
    // Keep last 1,000 attempts in store
    writeAttempts(current.slice(0, 1000));

    return NextResponse.json({ success: true, attempt });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save attempt" }, { status: 500 });
  }
}
