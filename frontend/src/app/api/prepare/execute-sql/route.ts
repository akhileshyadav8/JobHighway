import { NextRequest, NextResponse } from "next/server";
import { ALL_SQL_PROBLEMS } from "@/lib/sqlProblemsData";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const { problemId, query, dialect } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({
        status: "Syntax Error",
        errorMessage: "Please provide a valid SQL query.",
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: 0
      });
    }

    const problem = ALL_SQL_PROBLEMS.find((p) => p.id === problemId);
    if (!problem) {
      return NextResponse.json({ error: "SQL Problem not found" }, { status: 404 });
    }

    // Security check: block destructive keywords
    const lowerQuery = query.toLowerCase();
    if (
      lowerQuery.includes("drop table") ||
      lowerQuery.includes("drop database") ||
      lowerQuery.includes("truncate") ||
      lowerQuery.includes("alter table") ||
      lowerQuery.includes("pragma") ||
      lowerQuery.includes("attach")
    ) {
      return NextResponse.json({
        status: "Security Error",
        errorMessage: "Destructive operations (DROP, TRUNCATE, ALTER, ATTACH, PRAGMA) are not allowed in this sandbox.",
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: 0
      });
    }

    // Python runner script to execute user query & solution query against in-memory SQLite
    const pythonScript = `
import sqlite3
import json
import sys

create_sql = """${problem.createTableSql.replace(/"/g, '\\"')}"""
seed_sql = """${problem.seedDataSql.replace(/"/g, '\\"')}"""
user_query = """${query.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"')}"""
solution_query = """${problem.solutionQuery.replace(/\\/g, "\\\\").replace(/"""/g, '\\"\\"\\"')}"""

con = sqlite3.connect(':memory:')
cur = con.cursor()

try:
    cur.executescript(create_sql)
    cur.executescript(seed_sql)
except Exception as e:
    print(json.dumps({"error": f"Schema initialization failed: {str(e)}"}))
    sys.exit(0)

# Run expected solution
expected_cols = []
expected_rows = []
try:
    cur.execute(solution_query)
    if cur.description:
        expected_cols = [desc[0] for desc in cur.description]
    expected_rows = cur.fetchall()
except Exception as e:
    pass

# Run user query
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
    print(json.dumps({"error": f"SQL Syntax Error: {str(e)}"}))
except Exception as e:
    print(json.dumps({"error": f"Execution Error: {str(e)}"}))
`;

    const startTime = Date.now();
    const { stdout, stderr } = await execFileAsync("python", ["-c", pythonScript], {
      timeout: 4000,
      maxBuffer: 1024 * 512
    });
    const execTime = Date.now() - startTime;

    if (stderr && stderr.trim()) {
      return NextResponse.json({
        status: "Runtime Error",
        errorMessage: stderr.trim(),
        columns: [],
        rows: [],
        expectedColumns: [],
        expectedRows: [],
        executionTimeMs: execTime
      });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(stdout.trim());
    } catch {
      return NextResponse.json({
        status: "Runtime Error",
        errorMessage: stdout.trim() || "Failed to parse query output",
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

    // Result validation
    const colsMatch =
      userCols.length === expCols.length &&
      userCols.every((col, idx) => col.toLowerCase() === expCols[idx].toLowerCase());

    const rowsCountMatch = userRows.length === expRows.length;

    // Normalised JSON string equality check
    const formatValue = (v: any) => (typeof v === "number" ? Math.round(v * 100) / 100 : v);
    const normUser = userRows.map((r) => r.map(formatValue));
    const normExp = expRows.map((r) => r.map(formatValue));

    const contentMatch = JSON.stringify(normUser) === JSON.stringify(normExp);

    let status = "Wrong Answer";
    if (colsMatch && rowsCountMatch && contentMatch) {
      status = "Accepted";
    }

    return NextResponse.json({
      status,
      columns: userCols,
      rows: userRows,
      expectedColumns: expCols,
      expectedRows: expRows,
      executionTimeMs: execTime,
      dialect: dialect || "mysql"
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message, status: "Runtime Error" }, { status: 500 });
  }
}
