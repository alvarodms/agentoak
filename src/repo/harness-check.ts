import { spawnSync } from "node:child_process";
import { PROJECT_ROOT } from "../utils/paths.js";
import type { BuildResult } from "./build.js";

/** The playtest harness: the one part of the runner the agent may change. */
export const HARNESS_DIR = "src/emulator";

const TIMEOUT_MS = 5 * 60 * 1000;

/**
 * How the harness tree is verified: the whole project typechecks and the
 * whole test suite passes (which also re-parses every playtest file against
 * the harness's schema). It lives outside src/emulator so the agent cannot
 * weaken its own check.
 */
export async function runHarnessCheck(): Promise<BuildResult> {
  const timestamp = new Date().toISOString();
  const start = Date.now();
  const steps: [string, string[]][] = [
    ["typecheck", ["tsc", "--noEmit"]],
    ["tests", ["vitest", "run"]],
  ];
  let stdout = "";
  let stderr = "";
  for (const [label, args] of steps) {
    const run = spawnSync("npx", args, {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
      timeout: TIMEOUT_MS,
      maxBuffer: 64 * 1024 * 1024,
    });
    stdout += run.stdout ?? "";
    stderr += run.stderr ?? "";
    if (run.status !== 0) {
      const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`;
      const errors = output
        .split("\n")
        .filter((line) => /error TS\d+|FAIL|✗|×|AssertionError|Error:/.test(line))
        .map((line) => line.trim())
        .slice(0, 30);
      return {
        success: false,
        exitCode: run.status ?? 1,
        stdout,
        stderr,
        duration: Date.now() - start,
        timestamp,
        errors: [`harness ${label} failed (npx ${args.join(" ")})`, ...errors],
      };
    }
  }
  return { success: true, exitCode: 0, stdout, stderr, duration: Date.now() - start, timestamp, errors: [] };
}
