import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { POKEEMERALD_DIR, BUILD_LOGS_DIR } from "../utils/paths.js";
import { logger } from "../utils/logger.js";

export interface BuildResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
  timestamp: string;
  errors: string[];
}

/** Run `make` in the pokeemerald directory and capture results */
export function runBuild(): BuildResult {
  fs.mkdirSync(BUILD_LOGS_DIR, { recursive: true });

  const timestamp = new Date().toISOString();
  const start = Date.now();
  let stdout = "";
  let stderr = "";
  let exitCode = 0;

  logger.info("Starting ROM build...");

  try {
    stdout = execSync("make", {
      cwd: POKEEMERALD_DIR,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
      timeout: 5 * 60 * 1000, // 5 minute timeout
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err) {
      const execErr = err as { status: number; stdout?: string; stderr?: string };
      exitCode = execErr.status ?? 1;
      stdout = execErr.stdout ?? "";
      stderr = execErr.stderr ?? "";
    } else {
      exitCode = 1;
      stderr = err instanceof Error ? err.message : String(err);
    }
  }

  const duration = Date.now() - start;
  const success = exitCode === 0;
  const errors = parseErrors(stderr + "\n" + stdout);

  logger.info(`Build ${success ? "succeeded" : "failed"} in ${duration}ms (exit code ${exitCode})`);
  if (errors.length > 0) {
    logger.info(`Found ${errors.length} error(s) in build output`);
  }

  return { success, exitCode, stdout, stderr, duration, timestamp, errors };
}

/** Save build output to a log file */
export function saveBuildLog(cycleNumber: number, result: BuildResult): string {
  fs.mkdirSync(BUILD_LOGS_DIR, { recursive: true });
  const filename = `cycle-${String(cycleNumber).padStart(4, "0")}.log`;
  const logPath = path.join(BUILD_LOGS_DIR, filename);

  const content = [
    `Build Log — Cycle ${cycleNumber}`,
    `Timestamp: ${result.timestamp}`,
    `Exit Code: ${result.exitCode}`,
    `Duration: ${result.duration}ms`,
    `Success: ${result.success}`,
    "",
    "=== STDOUT ===",
    result.stdout,
    "",
    "=== STDERR ===",
    result.stderr,
    "",
    "=== PARSED ERRORS ===",
    result.errors.length > 0 ? result.errors.join("\n") : "(none)",
  ].join("\n");

  fs.writeFileSync(logPath, content, "utf-8");
  return filename;
}

/** Extract error messages from build output */
function parseErrors(output: string): string[] {
  const errors: string[] = [];
  const patterns = [
    /^(.+?):(\d+):\d+: error: (.+)$/gm,       // gcc-style errors
    /^(.+?):(\d+): error: (.+)$/gm,            // simpler error format
    /^(.+?)\((\d+)\): error (.+)$/gm,           // MSVC-style
    /^make\[\d+\]: \*\*\* (.+)$/gm,            // make errors
    /^Error: (.+)$/gm,                          // generic errors
    /^undefined reference to `(.+)'$/gm,        // linker errors
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(output)) !== null) {
      errors.push(match[0]);
    }
  }

  return [...new Set(errors)]; // deduplicate
}
