import { CodingProblem, CodingTestCase } from "./codingProblemsData";

export interface TestCaseResult {
  caseNumber: number;
  passed: boolean;
  inputStr: string;
  expectedStr: string;
  actualStr: string;
  error?: string;
  executionTimeMs: number;
  isHidden?: boolean;
}

export interface CodeExecutionReport {
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded";
  passedTestCases: number;
  totalTestCases: number;
  totalRuntimeMs: number;
  errorMessage?: string;
  results: TestCaseResult[];
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

export function executeJavascriptCode(
  userCode: string,
  problem: CodingProblem,
  runOnlyPublic: boolean = false
): CodeExecutionReport {
  const targetCases = runOnlyPublic 
    ? problem.testCases.filter(t => !t.isHidden) 
    : problem.testCases;

  const results: TestCaseResult[] = [];
  let allPassed = true;
  let hasRuntimeError = false;
  let firstErrorMessage = "";
  let totalRuntime = 0;

  try {
    // 1. Wrap user code to isolate globals and extract the function
    const wrappedCode = `
      ${userCode};
      if (typeof ${problem.functionName} !== 'function') {
        throw new Error("Function '${problem.functionName}' was not defined. Please implement '${problem.functionName}'.");
      }
      return ${problem.functionName};
    `;

    // Safe constructor evaluation
    const fn = new Function(wrappedCode)();

    // 2. Run each test case
    for (let i = 0; i < targetCases.length; i++) {
      const tc = targetCases[i];
      const start = performance.now();
      let actual: any;
      let passed = false;
      let error: string | undefined;

      try {
        // Deep clone input to prevent in-place mutation side effects across test cases
        const clonedInput = JSON.parse(JSON.stringify(tc.input));
        actual = fn(...clonedInput);
        passed = deepEqual(actual, tc.expected);
      } catch (err: any) {
        passed = false;
        error = err?.message || String(err);
        hasRuntimeError = true;
        if (!firstErrorMessage && error) firstErrorMessage = error;
      }

      const elapsed = Math.round((performance.now() - start) * 100) / 100;
      totalRuntime += elapsed;

      if (!passed) allPassed = false;

      results.push({
        caseNumber: i + 1,
        passed,
        inputStr: JSON.stringify(tc.input),
        expectedStr: JSON.stringify(tc.expected),
        actualStr: actual !== undefined ? JSON.stringify(actual) : "undefined",
        error,
        executionTimeMs: elapsed,
        isHidden: tc.isHidden
      });
    }
  } catch (compilationErr: any) {
    return {
      status: "Runtime Error",
      passedTestCases: 0,
      totalTestCases: targetCases.length,
      totalRuntimeMs: 0,
      errorMessage: compilationErr?.message || "Syntax or compilation error in code.",
      results: []
    };
  }

  const passedCount = results.filter(r => r.passed).length;
  let status: CodeExecutionReport["status"] = "Accepted";
  if (hasRuntimeError) status = "Runtime Error";
  else if (!allPassed) status = "Wrong Answer";

  return {
    status,
    passedTestCases: passedCount,
    totalTestCases: targetCases.length,
    totalRuntimeMs: Math.round(totalRuntime * 100) / 100,
    errorMessage: firstErrorMessage,
    results
  };
}
