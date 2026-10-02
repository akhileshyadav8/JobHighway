import { NextRequest, NextResponse } from "next/server";
import { ALL_CODING_PROBLEMS } from "@/lib/codingProblemsData";

/**
 * POST /api/prepare/execute
 * Executes user code against problem test cases via the Piston API.
 * Currently supports Python (real execution). C/C++/Java return a
 * "coming soon" message until driver-wrapping logic is implemented.
 */
export async function POST(req: NextRequest) {
  try {
    const { language, code, problemId, runPublicOnly } = await req.json();

    const problem = ALL_CODING_PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const testCases = runPublicOnly
      ? problem.testCases.filter((t) => !t.isHidden)
      : problem.testCases;

    // --- Non-Python languages: sandbox coming soon ---
    if (language === "c" || language === "cpp" || language === "java") {
      const langLabel = language === "cpp" ? "C++" : language.toUpperCase();
      return NextResponse.json({
        status: "Runtime Error",
        passedTestCases: 0,
        totalTestCases: testCases.length,
        totalRuntimeMs: 0,
        errorMessage: `${langLabel} execution sandbox coming soon. Python is fully supported for local testing.`,
        results: []
      });
    }

    // --- Python: execute via Piston API ---
    const results: {
      caseNumber: number;
      passed: boolean;
      inputStr: string;
      expectedStr: string;
      actualStr: string;
      error?: string;
      executionTimeMs: number;
      isHidden?: boolean;
    }[] = [];
    let passedCount = 0;

    for (const tc of testCases) {
      // Build a Python driver that calls the user's function with the test
      // input args and prints JSON-serialised output.
      const wrappedCode = [
        code,
        "",
        "import json as _json",
        `_result = ${problem.functionName}(*_json.loads(${JSON.stringify(JSON.stringify(tc.input))}))`,
        "print(_json.dumps(_result))"
      ].join("\n");

      try {
        const { execFile } = await import("child_process");
        const { promisify } = await import("util");
        const execFileAsync = promisify(execFile);

        // Security check: block dangerous calls
        if (
          /import\s+(os|subprocess|sys|shutil|socket|requests|urllib|http|pty)/i.test(code) ||
          /__import__|eval\(|exec\(|open\(|globals\(\)|compile\(/i.test(code)
        ) {
          results.push({
            caseNumber: results.length + 1,
            passed: false,
            inputStr: JSON.stringify(tc.input),
            expectedStr: JSON.stringify(tc.expected),
            actualStr: "Error",
            error: "Security Policy Violation: Network, file system, and system calls are restricted in this sandbox.",
            executionTimeMs: 0,
            isHidden: tc.isHidden
          });
          continue;
        }

        const startTime = Date.now();
        const { stdout, stderr } = await execFileAsync(
          "python",
          ["-c", wrappedCode],
          { timeout: 4000, maxBuffer: 1024 * 512 }
        );
        const execTime = Date.now() - startTime;
        const cleanStdout = (stdout ?? "").trim();
        const cleanStderr = (stderr ?? "").trim();

        if (cleanStderr) {
          results.push({
            caseNumber: results.length + 1,
            passed: false,
            inputStr: JSON.stringify(tc.input),
            expectedStr: JSON.stringify(tc.expected),
            actualStr: "Error",
            error: cleanStderr,
            executionTimeMs: execTime,
            isHidden: tc.isHidden
          });
        } else {
          let actual: unknown;
          try {
            actual = JSON.parse(cleanStdout);
          } catch {
            actual = cleanStdout;
          }

          const passed =
            JSON.stringify(actual) === JSON.stringify(tc.expected);
          if (passed) passedCount++;

          results.push({
            caseNumber: results.length + 1,
            passed,
            inputStr: JSON.stringify(tc.input),
            expectedStr: JSON.stringify(tc.expected),
            actualStr: cleanStdout,
            executionTimeMs: execTime,
            isHidden: tc.isHidden
          });
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? (err as any).killed
              ? "Time Limit Exceeded (4.0s)"
              : err.message
            : "Runtime Error";
        results.push({
          caseNumber: results.length + 1,
          passed: false,
          inputStr: JSON.stringify(tc.input),
          expectedStr: JSON.stringify(tc.expected),
          actualStr: "Error",
          error: message,
          executionTimeMs: 0,
          isHidden: tc.isHidden
        });
      }
    }


    const hasErrors = results.some((r) => r.error);
    const status =
      passedCount === testCases.length
        ? "Accepted"
        : hasErrors
        ? "Runtime Error"
        : "Wrong Answer";

    return NextResponse.json({
      status,
      passedTestCases: passedCount,
      totalTestCases: testCases.length,
      totalRuntimeMs: results.reduce((sum, r) => sum + (r.executionTimeMs || 0), 0),
      results
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
