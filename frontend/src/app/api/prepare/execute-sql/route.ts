import { NextRequest, NextResponse } from "next/server";
import { ALL_SQL_PROBLEMS } from "@/lib/sqlProblemsData";
import { runPythonScript } from "@/lib/pythonRunner";

export async function POST(req: NextRequest) {
  try {
    const { problemId, query, dialect, isSubmit } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({
        status: "Syntax Error",
        errorMessage: "Please enter a valid SQL query.",
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: 0
      });
    }

    const problem = ALL_SQL_PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return NextResponse.json({ 
        status: "Runtime Error",
        errorMessage: "SQL Problem not found",
        columns: [],
        rows: []
      }, { status: 404 });
    }

    // Security check: prevent destructive operations in sandbox
    const lowerQuery = query.toLowerCase();
    const forbidden = ["drop table", "drop database", "truncate", "alter table", "pragma", "attach", "detach", "vacuum"];
    for (const f of forbidden) {
      if (lowerQuery.includes(f)) {
        return NextResponse.json({
          status: "Security Error",
          errorMessage: `Forbidden operation: "${f.toUpperCase()}" is not permitted in this sandbox.`,
          columns: [],
          rows: [],
          expectedColumns: [],
          expectedRows: [],
          executionTimeMs: 0
        });
      }
    }

    // Prepare Python script that sets up in-memory SQLite schema, seeds data, and runs query
    const pythonScript = `
import sqlite3
import json
import sys

create_sql = ${JSON.stringify(problem.createTableSql)}
seed_sql = ${JSON.stringify(problem.seedDataSql)}
user_query = ${JSON.stringify(query)}
solution_query = ${JSON.stringify(problem.solutionQuery)}
is_submit = ${isSubmit ? "True" : "False"}

con = sqlite3.connect(':memory:')
cur = con.cursor()

try:
    cur.executescript(create_sql)
    cur.executescript(seed_sql)
except Exception as e:
    print(json.dumps({"error": f"Schema Setup Failed: {str(e)}"}))
    sys.exit(0)

expected_cols = []
expected_rows = []

if is_submit:
    try:
        cur.execute(solution_query)
        if cur.description:
            expected_cols = [desc[0] for desc in cur.description]
        expected_rows = cur.fetchall()
    except Exception as e:
        print(json.dumps({"error": f"Solution Evaluation Error: {str(e)}"}))
        sys.exit(0)

user_cols = []
user_rows = []
try:
    cur.execute(user_query)
    if cur.description:
        user_cols = [desc[0] for desc in cur.description]
    user_rows = cur.fetchall()
    print(json.dumps({
        "success": True,
        "user_cols": user_cols,
        "user_rows": user_rows,
        "expected_cols": expected_cols,
        "expected_rows": expected_rows
    }))
except sqlite3.OperationalError as e:
    print(json.dumps({"error": f"SQL Syntax/Operational Error: {str(e)}"}))
except Exception as e:
    print(json.dumps({"error": f"Query Execution Error: {str(e)}"}))
`;

    const startTime = Date.now();
    const result = await runPythonScript(pythonScript, 5000);
    const execTime = Date.now() - startTime;

    if (result.timedOut) {
      return NextResponse.json({
        status: "Time Limit Exceeded",
        errorMessage: "Query execution timed out after 5.0 seconds.",
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: execTime
      });
    }

    if (result.stderr && !result.stdout) {
      return NextResponse.json({
        status: "Runtime Error",
        errorMessage: result.stderr,
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: execTime
      });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(result.stdout);
    } catch {
      return NextResponse.json({
        status: "Runtime Error",
        errorMessage: result.stderr || result.stdout || "Failed to parse SQL engine output.",
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: execTime
      });
    }

    if (parsed.error) {
      return NextResponse.json({
        status: "Syntax Error",
        errorMessage: parsed.error,
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: execTime
      });
    }

    const userCols: string[] = parsed.user_cols || [];
    const userRows: any[][] = parsed.user_rows || [];
    const expCols: string[] = parsed.expected_cols || [];
    const expRows: any[][] = parsed.expected_rows || [];

    // Distinct logic:
    // If NOT isSubmit: user is simply running query for exploration (e.g. SELECT * FROM employees)
    if (!isSubmit) {
      return NextResponse.json({
        status: "Success",
        columns: userCols,
        rows: userRows,
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: execTime,
        dialect: dialect || "mysql"
      });
    }

    // If isSubmit: validate against expected solution
    const colsMatch =
      userCols.length === expCols.length &&
      userCols.every((col, idx) => col.toLowerCase() === expCols[idx].toLowerCase());

    const rowsCountMatch = userRows.length === expRows.length;

    // Normalize float numbers for comparison
    const formatValue = (v: any) => {
      if (typeof v === "number") return Math.round(v * 100) / 100;
      if (v === null || v === undefined) return null;
      return String(v).trim().toLowerCase();
    };

    const normUser = userRows.map((r) => r.map(formatValue));
    const normExp = expRows.map((r) => r.map(formatValue));

    const contentMatch = JSON.stringify(normUser) === JSON.stringify(normExp);

    const isAccepted = colsMatch && rowsCountMatch && contentMatch;

    return NextResponse.json({
      status: isAccepted ? "Accepted" : "Wrong Answer",
      columns: userCols,
      rows: userRows,
      expectedColumns: expCols,
      expectedRows: expRows,
      executionTimeMs: execTime,
      dialect: dialect || "mysql"
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ 
      status: "Runtime Error",
      errorMessage: message,
      columns: [],
      rows: []
    }, { status: 500 });
  }
}
