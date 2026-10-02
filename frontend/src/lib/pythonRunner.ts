import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/**
 * Resolves the absolute path to a working Python executable,
 * avoiding the Windows App Execution Alias stub (Microsoft Store redirect).
 */
export function getPythonExecutable(): string {
  // 1. Explicit environment override
  if (process.env.PYTHON_PATH && fs.existsSync(process.env.PYTHON_PATH)) {
    return process.env.PYTHON_PATH;
  }

  // 2. Common Windows Anaconda / Miniconda / standard Python installations
  const userProfile = process.env.USERPROFILE || "C:\\Users\\Akhilesh";
  const potentialPaths = [
    path.join(userProfile, "miniconda3", "python.exe"),
    path.join(userProfile, "anaconda3", "python.exe"),
    path.join(userProfile, "AppData", "Local", "Programs", "Python", "Python313", "python.exe"),
    path.join(userProfile, "AppData", "Local", "Programs", "Python", "Python312", "python.exe"),
    path.join(userProfile, "AppData", "Local", "Programs", "Python", "Python311", "python.exe"),
    path.join(userProfile, "AppData", "Local", "Programs", "Python", "Python310", "python.exe"),
    "C:\\Python313\\python.exe",
    "C:\\Python312\\python.exe",
    "C:\\Python311\\python.exe",
    "C:\\Program Files\\Python313\\python.exe",
    "C:\\Program Files\\Python312\\python.exe",
    "C:\\Program Files\\Python311\\python.exe"
  ];

  for (const candidate of potentialPaths) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // Continue searching
    }
  }

  // Fallback to standard binary name
  return process.platform === "win32" ? "python" : "python3";
}

export interface PythonExecutionResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}

/**
 * Executes a Python script via stdin to prevent command-line length limits
 * and argument escaping bugs on Windows.
 */
export function runPythonScript(
  scriptContent: string,
  timeoutMs: number = 4000
): Promise<PythonExecutionResult> {
  return new Promise((resolve) => {
    const pythonBin = getPythonExecutable();
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const child = spawn(pythonBin, ["-"], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PYTHONIOENCODING: "utf-8" }
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill();
      } catch {}
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf-8");
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf-8");
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        code: 1,
        stdout,
        stderr: err.message || "Failed to spawn Python process",
        timedOut: false
      });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        timedOut
      });
    });

    try {
      child.stdin.write(scriptContent);
      child.stdin.end();
    } catch (writeErr: any) {
      clearTimeout(timer);
      resolve({
        code: 1,
        stdout,
        stderr: writeErr?.message || "Failed to write to Python stdin",
        timedOut: false
      });
    }
  });
}
