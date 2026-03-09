import { spawn } from "child_process";
import { logger } from "../utils/logger.js";
import { PROJECT_ROOT } from "../utils/paths.js";
import { parseClaudeOutput } from "./output-parser.js";
import type { ClaudeCodeResult } from "./output-parser.js";

export interface ClaudeCodeOptions {
  /** Replace the entire system prompt (mutually exclusive with appendSystemPrompt) */
  systemPrompt?: string;
  /** Append to the default system prompt (preserves CLAUDE.md behavior) */
  appendSystemPrompt?: string;
  /** Maximum agentic turns before stopping */
  maxTurns?: number;
  /** Maximum dollar budget for this invocation */
  maxBudgetUsd?: number;
  /** Restrict available tools (e.g. "Bash,Read,Edit,Write,Grep") — empty string disables all */
  tools?: string;
  /** Timeout in milliseconds (default: 10 minutes) */
  timeout?: number;
  /** Working directory (default: PROJECT_ROOT) */
  cwd?: string;
  /** Model override */
  model?: string;
  /** JSON schema for structured output (print mode only) */
  jsonSchema?: Record<string, unknown>;
}

/** Spawn `claude` CLI in print mode and return parsed results */
export async function runClaudeCode(
  prompt: string,
  options: ClaudeCodeOptions = {},
): Promise<ClaudeCodeResult> {
  const {
    systemPrompt,
    appendSystemPrompt,
    maxTurns,
    maxBudgetUsd,
    tools,
    timeout = 10 * 60 * 1000,
    cwd = PROJECT_ROOT,
    model,
    jsonSchema,
  } = options;

  const args = buildArgs({
    systemPrompt,
    appendSystemPrompt,
    maxTurns,
    maxBudgetUsd,
    tools,
    model,
    jsonSchema,
  });

  logger.info(
    `Running claude CLI (maxTurns: ${maxTurns ?? "unlimited"}, tools: ${tools ?? "all"})`,
  );
  logger.debug(`claude CLI args: ${JSON.stringify(args)}`);
  logger.debug(`claude CLI prompt (${prompt.length} chars): ${prompt.slice(0, 300)}${prompt.length > 300 ? "..." : ""}`);
  logger.debug(`claude CLI cwd: ${cwd}, timeout: ${timeout}ms`);

  const startTime = Date.now();
  const stdout = await spawnClaude(prompt, args, { timeout, cwd });
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  logger.debug(`claude CLI finished in ${elapsed}s, output size: ${stdout.length} bytes`);

  return parseClaudeOutput(stdout);
}

function buildArgs(opts: {
  systemPrompt?: string;
  appendSystemPrompt?: string;
  maxTurns?: number;
  maxBudgetUsd?: number;
  tools?: string;
  model?: string;
  jsonSchema?: Record<string, unknown>;
}): string[] {
  const args: string[] = [
    "--print",
    "--output-format", "json",
    "--verbose",
    "--dangerously-skip-permissions",
  ];

  if (opts.systemPrompt != null) {
    args.push("--system-prompt", opts.systemPrompt);
  } else if (opts.appendSystemPrompt != null) {
    args.push("--append-system-prompt", opts.appendSystemPrompt);
  }

  if (opts.maxTurns != null) {
    args.push("--max-turns", String(opts.maxTurns));
  }

  if (opts.maxBudgetUsd != null) {
    args.push("--max-budget-usd", String(opts.maxBudgetUsd));
  }

  if (opts.tools != null) {
    args.push("--tools", opts.tools);
  }

  if (opts.model != null) {
    args.push("--model", opts.model);
  }

  if (opts.jsonSchema != null) {
    args.push("--json-schema", JSON.stringify(opts.jsonSchema));
  }

  return args;
}

function spawnClaude(
  prompt: string,
  args: string[],
  opts: { timeout: number; cwd: string },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const spawnStart = Date.now();
    logger.debug(`Spawning: claude ${args.join(" ")} <prompt>`);

    const child = spawn("claude", [...args, prompt], {
      cwd: opts.cwd,
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    let toolCallsSeen = 0;

    // Stream stdout and parse JSON messages in real-time for live logging
    let stdoutLineBuffer = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdoutChunks.push(chunk);
      stdoutLineBuffer += chunk.toString();

      const lines = stdoutLineBuffer.split("\n");
      stdoutLineBuffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const msg = JSON.parse(trimmed) as Record<string, unknown>;
          logStreamedMessage(msg, ++toolCallsSeen);
        } catch {
          // Not a JSON line — skip
        }
      }
    });

    // Stream stderr lines for real-time visibility (progress, status)
    let stderrBuffer = "";
    let stderrFull = "";
    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderrFull += text;
      stderrBuffer += text;
      const lines = stderrBuffer.split("\n");
      stderrBuffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.trim()) {
          logger.info(`  [claude] ${line.trim()}`);
        }
      }
    });

    // Log periodic heartbeat so we know the process is still alive
    const heartbeat = setInterval(() => {
      const elapsed = ((Date.now() - spawnStart) / 1000).toFixed(0);
      logger.info(`  [claude] still running... (${elapsed}s elapsed, pid: ${child.pid})`);
    }, 30_000);

    // Timeout handling
    const timer = opts.timeout > 0
      ? setTimeout(() => {
          child.kill("SIGTERM");
          clearInterval(heartbeat);
          reject(new Error(`claude CLI timed out after ${opts.timeout}ms`));
        }, opts.timeout)
      : null;

    child.on("close", (code) => {
      clearInterval(heartbeat);
      if (timer) clearTimeout(timer);

      const elapsed = ((Date.now() - spawnStart) / 1000).toFixed(1);
      const stdout = Buffer.concat(stdoutChunks).toString();

      if (stderrFull) {
        logger.debug(`claude stderr total (${stderrFull.length} bytes, after ${elapsed}s): ${stderrFull.slice(0, 1000)}`);
      }

      if (code !== 0) {
        logger.debug(`claude process exited with code ${code} after ${elapsed}s`);
        // Claude CLI exits non-zero when --max-turns is exhausted.
        // If we got stdout, still try to parse it.
        if (stdout.length > 0) {
          logger.warn(`claude exited with code ${code} but produced output (${stdout.length} bytes)`);
          resolve(stdout);
          return;
        }
        reject(new Error(`claude CLI failed with code ${code} after ${elapsed}s`));
        return;
      }

      logger.debug(`claude process completed successfully in ${elapsed}s, stdout: ${stdout.length} bytes`);
      resolve(stdout);
    });

    child.on("error", (err) => {
      clearInterval(heartbeat);
      if (timer) clearTimeout(timer);
      reject(new Error(`claude CLI spawn error: ${err.message}`));
    });

    child.stdin?.end();
  });
}

/** Log a streamed JSON message from Claude CLI stdout in real-time */
function logStreamedMessage(msg: Record<string, unknown>, _toolCallsSeen: number): void {
  const content = msg.content;
  if (!Array.isArray(content)) return;

  for (const block of content as Array<Record<string, unknown>>) {
    if (block.type === "tool_use" && block.name) {
      const input = block.input as Record<string, unknown> | undefined;
      const inputPreview = input ? JSON.stringify(input).slice(0, 120) : "";
      logger.info(`  [claude] tool: ${block.name as string}(${inputPreview})`);
    }

    if (block.type === "text" && block.text) {
      const text = block.text as string;
      // Show a short preview of assistant text
      const preview = text.replace(/\n/g, " ").slice(0, 150);
      if (preview.trim()) {
        logger.info(`  [claude] ${preview}${text.length > 150 ? "..." : ""}`);
      }
    }

    if (block.type === "tool_result") {
      const resultContent = block.content as string | undefined;
      if (resultContent && typeof resultContent === "string") {
        const preview = resultContent.replace(/\n/g, " ").slice(0, 100);
        logger.debug(`  [claude] result: ${preview}${resultContent.length > 100 ? "..." : ""}`);
      }
    }
  }
}
