import { spawn } from "child_process";
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

/** Run `make` in the pokeemerald directory, streaming output in real-time */
export async function runBuild(): Promise<BuildResult> {
  fs.mkdirSync(BUILD_LOGS_DIR, { recursive: true });

  const timestamp = new Date().toISOString();
  const start = Date.now();
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  logger.info("Starting ROM build...");

  const exitCode = await new Promise<number>((resolve) => {
    const proc = spawn("make", [], {
      cwd: POKEEMERALD_DIR,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const timeout = setTimeout(() => {
      proc.kill("SIGTERM");
      logger.warn("Build timed out after 5 minutes");
    }, 5 * 60 * 1000);

    proc.stdout.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stdoutChunks.push(text);
      // Stream each line to the logger
      for (const line of text.trimEnd().split("\n")) {
        if (line) logger.info(`  [build] ${line}`);
      }
    });

    proc.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderrChunks.push(text);
      for (const line of text.trimEnd().split("\n")) {
        if (line) logger.warn(`  [build] ${line}`);
      }
    });

    proc.on("close", (code) => {
      clearTimeout(timeout);
      resolve(code ?? 1);
    });

    proc.on("error", (err) => {
      clearTimeout(timeout);
      stderrChunks.push(err.message);
      logger.error(`  [build] spawn error: ${err.message}`);
      resolve(1);
    });
  });

  const stdout = stdoutChunks.join("");
  const stderr = stderrChunks.join("");
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
