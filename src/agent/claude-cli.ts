import { spawn } from "child_process";
import { logger } from "../utils/logger.js";
import { PROJECT_ROOT } from "../utils/paths.js";
import { parseClaudeOutput } from "./output-parser.js";
import type { ClaudeCodeResult } from "./output-parser.js";

/** Prefix used by Claude Code for MCP tool names: mcp__<server>__<tool> */
const MCP_TOOL_PREFIX = "mcp__";

/**
 * Extract MCP tool names from a comma-separated tools string.
 * Returns only the entries that start with "mcp__".
 */
export function extractMcpTools(tools: string): string[] {
  return tools
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.startsWith(MCP_TOOL_PREFIX));
}

export interface ClaudeCodeOptions {
  /** Replace the entire system prompt (mutually exclusive with appendSystemPrompt) */
  systemPrompt?: string;
  /** Append to the default system prompt (preserves CLAUDE.md behavior) */
  appendSystemPrompt?: string;
  /** Maximum agentic turns before stopping */
  maxTurns?: number;
  /** Maximum dollar budget for this invocation */
  maxBudgetUsd?: number;
  /**
   * Restrict available tools.
   *
   * Built-in tool names (e.g. "Bash,Read,Edit") are enforced via --tools.
   * MCP tool names (e.g. "mcp__pokedex__smogon_sets") are included for
   * declaration purposes — they control which tools appear in the agent's
   * prompt documentation. The --tools CLI flag only filters built-in tools;
   * MCP tools cannot be restricted via CLI flags.
   */
  tools?: string;
  /** Timeout in milliseconds (default: 10 minutes) */
  timeout?: number;
  /** Working directory (default: PROJECT_ROOT) */
  cwd?: string;
  /** Model override */
  model?: string;
  /** JSON schema for structured output (print mode only) */
  jsonSchema?: Record<string, unknown>;
  /** Environment variable overrides injected into the child process env.
   * Use to redirect the CLI to a different API provider (e.g. DeepSeek)
   * without affecting the current process environment. Undefined values
   * are filtered out so they don't shadow existing vars.
   */
  envOverrides?: Record<string, string | undefined>;
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
    timeout = 30 * 60 * 1000,
    cwd = PROJECT_ROOT,
    model,
    jsonSchema,
    envOverrides,
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
  const stdout = await spawnClaude(prompt, args, { timeout, cwd, envOverrides });
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
    "--output-format", "stream-json",
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
    // --tools only accepts built-in tool names; filter out MCP entries
    const builtinTools = opts.tools
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !t.startsWith(MCP_TOOL_PREFIX))
      .join(",");
    args.push("--tools", builtinTools);
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
  opts: { timeout: number; cwd: string; envOverrides?: Record<string, string | undefined> },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const spawnStart = Date.now();
    logger.debug(`Spawning: claude ${args.join(" ")} <prompt>`);

    // Filter undefined values so we don't shadow existing env vars with undefined
    const filteredOverrides = opts.envOverrides
      ? Object.fromEntries(
          Object.entries(opts.envOverrides).filter(([, v]) => v !== undefined)
        ) as Record<string, string>
      : {};

    const child = spawn("claude", [...args, prompt], {
      cwd: opts.cwd,
      env: { ...process.env, ...filteredOverrides },
      stdio: ["pipe", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    const streamState = new StreamState();

    // Stream stdout — parse NDJSON messages in real-time for live logging
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
          streamState.handleMessage(msg);
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
      const stats = streamState.getStats();
      logger.info(
        `  [claude] still running... (${elapsed}s, ` +
        `${stats.turns} turns, ${stats.toolCalls} tool calls, ` +
        `${stats.filesModified} files modified)`,
      );
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
      const stats = streamState.getStats();

      // Log completion summary
      logger.info(
        `  [claude] finished in ${elapsed}s — ` +
        `${stats.turns} turns, ${stats.toolCalls} tool calls, ` +
        `${stats.filesModified} files modified` +
        (stats.costUsd > 0 ? `, $${stats.costUsd.toFixed(4)}` : ""),
      );

      if (stderrFull) {
        logger.debug(`claude stderr total (${stderrFull.length} bytes): ${stderrFull.slice(0, 1000)}`);
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

/**
 * Tracks streaming state and logs real-time feedback from Claude Code CLI.
 *
 * The stream-json format emits NDJSON messages. Each message has a `type`
 * field: "system", "assistant", "user", "result". Content blocks within
 * messages follow the Anthropic API format (text, tool_use, tool_result).
 */
class StreamState {
  private turns = 0;
  private toolCalls = 0;
  private filesModified = new Set<string>();
  private costUsd = 0;
  private lastToolName = "";

  handleMessage(msg: Record<string, unknown>): void {
    // Normalize stream-json format: content is nested under msg.message
    const inner = msg.message as Record<string, unknown> | undefined;
    if (inner && typeof inner === "object") {
      if (inner.content && !msg.content) msg.content = inner.content;
    }

    const msgType = msg.type as string | undefined;
    const role = msg.role as string | undefined;

    // Track cost from usage/cost fields
    if (typeof msg.total_cost_usd === "number") {
      this.costUsd = msg.total_cost_usd;
    } else if (typeof msg.cost_usd === "number") {
      this.costUsd = msg.cost_usd;
    }

    // Track turns (each assistant message = a turn)
    if (msgType === "assistant" || role === "assistant") {
      this.turns++;
      logger.info(`  [claude] ── Turn ${this.turns} ──`);
    }

    // Handle "result" type (final output from stream-json)
    if (msgType === "result") {
      if (typeof msg.total_cost_usd === "number") {
        this.costUsd = msg.total_cost_usd;
      } else if (typeof msg.cost_usd === "number") {
        this.costUsd = msg.cost_usd;
      }
      const result = msg.result as string | undefined;
      if (result) {
        const preview = result.replace(/\n/g, " ").slice(0, 200);
        logger.info(`  [claude] result: ${preview}${result.length > 200 ? "..." : ""}`);
      }
      return;
    }

    // Parse content blocks
    const content = msg.content;
    if (!Array.isArray(content)) return;

    for (const block of content as Array<Record<string, unknown>>) {
      this.handleContentBlock(block);
    }
  }

  private handleContentBlock(block: Record<string, unknown>): void {
    switch (block.type) {
      case "tool_use":
        this.handleToolUse(block);
        break;
      case "tool_result":
        this.handleToolResult(block);
        break;
      case "text":
        this.handleText(block);
        break;
    }
  }

  private handleToolUse(block: Record<string, unknown>): void {
    this.toolCalls++;
    const name = block.name as string;
    const input = block.input as Record<string, unknown> | undefined;
    this.lastToolName = name;

    // Build a human-readable description of the tool call
    const description = this.describeToolCall(name, input);
    logger.info(`  [claude] 🔧 ${description}`);
  }

  private handleToolResult(block: Record<string, unknown>): void {
    const content = block.content as string | undefined;
    if (!content || typeof content !== "string") return;

    // For file-modifying tools, track success
    if (["Write", "Edit", "MultiEdit"].includes(this.lastToolName)) {
      if (!content.toLowerCase().includes("error")) {
        logger.info(`  [claude]    ✓ done`);
      } else {
        const preview = content.replace(/\n/g, " ").slice(0, 120);
        logger.warn(`  [claude]    ✗ ${preview}`);
      }
      return;
    }

    // For Bash (build), show relevant output
    if (this.lastToolName === "Bash") {
      const lines = content.split("\n").filter(Boolean);
      if (content.toLowerCase().includes("error")) {
        const errorLines = lines.filter((l) => /error/i.test(l)).slice(0, 5);
        for (const line of errorLines) {
          logger.warn(`  [claude]    ${line.trim()}`);
        }
      } else {
        // Show last few lines as a summary
        const tail = lines.slice(-3);
        for (const line of tail) {
          logger.info(`  [claude]    ${line.trim()}`);
        }
      }
      return;
    }

    // For Read/Grep/Glob, show just a brief confirmation
    if (["Read", "Grep", "Glob", "LS"].includes(this.lastToolName)) {
      const lineCount = content.split("\n").length;
      logger.debug(`  [claude]    → ${lineCount} lines`);
      return;
    }

    // Generic result preview
    const preview = content.replace(/\n/g, " ").slice(0, 100);
    logger.debug(`  [claude]    → ${preview}${content.length > 100 ? "..." : ""}`);
  }

  private handleText(block: Record<string, unknown>): void {
    const text = block.text as string | undefined;
    if (!text?.trim()) return;

    // Check for CYCLE_COMPLETE marker
    if (text.includes("CYCLE_COMPLETE")) {
      const match = text.match(/<!--\s*CYCLE_COMPLETE:\s*(\{.*?\})\s*-->/s);
      if (match) {
        try {
          const parsed = JSON.parse(match[1]) as { summary?: string };
          if (parsed.summary) {
            logger.info(`  [claude] ✅ Cycle complete: ${parsed.summary}`);
            return;
          }
        } catch {
          // ignore
        }
      }
      logger.info(`  [claude] ✅ Cycle complete`);
      return;
    }

    // Show assistant thinking/text as a preview
    const lines = text.trim().split("\n");
    // Show first meaningful line(s), skip very short fragments
    const meaningful = lines.filter((l) => l.trim().length > 5).slice(0, 3);
    for (const line of meaningful) {
      const preview = line.trim().slice(0, 150);
      logger.info(`  [claude] 💬 ${preview}${line.length > 150 ? "..." : ""}`);
    }
  }

  /** Build a human-readable description for a tool call */
  private describeToolCall(name: string, input?: Record<string, unknown>): string {
    if (!input) return name;

    switch (name) {
      case "Read": {
        const filePath = (input.file_path as string) ?? "";
        return `Read ${this.shortenPath(filePath)}`;
      }
      case "Write": {
        const filePath = (input.file_path as string) ?? "";
        this.filesModified.add(filePath);
        return `Write ${this.shortenPath(filePath)}`;
      }
      case "Edit": {
        const filePath = (input.file_path as string) ?? "";
        this.filesModified.add(filePath);
        return `Edit ${this.shortenPath(filePath)}`;
      }
      case "MultiEdit": {
        const filePath = (input.file_path as string) ?? "";
        this.filesModified.add(filePath);
        return `MultiEdit ${this.shortenPath(filePath)}`;
      }
      case "Bash": {
        const cmd = (input.command as string) ?? "";
        const preview = cmd.length > 80 ? cmd.slice(0, 80) + "..." : cmd;
        return `Bash: ${preview}`;
      }
      case "Grep": {
        const pattern = (input.pattern as string) ?? "";
        const path = (input.path as string) ?? "";
        return `Grep "${pattern}" in ${this.shortenPath(path)}`;
      }
      case "Glob": {
        const pattern = (input.pattern as string) ?? "";
        return `Glob ${pattern}`;
      }
      case "LS": {
        const path = (input.path as string) ?? ".";
        return `LS ${this.shortenPath(path)}`;
      }
      case "fetch_pokemon_sprites": {
        const spriteName = ((input.name as string) ?? "")
          .toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
        if (spriteName) {
          this.filesModified.add(`pokeemerald/graphics/pokemon/${spriteName}/`);
        }
        return `Fetch sprites: ${spriteName}`;
      }
      default: {
        const preview = JSON.stringify(input).slice(0, 80);
        return `${name}(${preview})`;
      }
    }
  }

  /** Shorten a file path for display — show only the last 2-3 segments */
  private shortenPath(filePath: string): string {
    if (!filePath) return "(unknown)";
    const parts = filePath.split("/");
    if (parts.length <= 3) return filePath;
    return ".../" + parts.slice(-3).join("/");
  }

  getStats() {
    return {
      turns: this.turns,
      toolCalls: this.toolCalls,
      filesModified: this.filesModified.size,
      costUsd: this.costUsd,
    };
  }
}
