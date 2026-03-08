import Anthropic from "@anthropic-ai/sdk";
import { AGENT_TOOLS } from "./tools.js";
import { logger } from "../utils/logger.js";
import * as explorer from "../repo/explorer.js";
import * as editor from "../repo/editor.js";
import { runBuild } from "../repo/build.js";
import { loadMemory, writeMemoryFile, appendToMemory } from "../memory/store.js";
import type { MemoryFileName } from "../memory/types.js";
import type { TokenUsage } from "../memory/types.js";

const VALID_MEMORY_FILES: MemoryFileName[] = [
  "codebase-facts",
  "failure-patterns",
  "strategy-notes",
  "project-facts",
];

function isValidMemoryFile(name: string): name is MemoryFileName {
  return VALID_MEMORY_FILES.includes(name as MemoryFileName);
}

export interface AgentLoopResult {
  actions: ActionRecord[];
  filesModified: string[];
  buildResult: { success: boolean; errors: string[] } | null;
  cycleSummary: string;
  nextSteps: string;
  tokenUsage: TokenUsage;
  toolCallCount: number;
  abortReason?: string;
}

export interface ActionRecord {
  tool: string;
  input: Record<string, unknown>;
  result: string;
  timestamp: string;
}

/** Execute a single tool call and return the result as a string */
function executeTool(name: string, input: Record<string, unknown>): string {
  switch (name) {
    // Exploration
    case "read_file":
      return explorer.readFile(input.path as string);
    case "read_lines":
      return explorer.readLines(input.path as string, input.start_line as number, input.end_line as number);
    case "list_files":
      return explorer.listFiles(input.path as string, input.max_depth as number | undefined).join("\n");
    case "search_code": {
      const results = explorer.searchCode(input.pattern as string, {
        filePattern: input.file_pattern as string | undefined,
        maxResults: input.max_results as number | undefined,
      });
      if (results.length === 0) return "No matches found.";
      return results.map((r) => `${r.file}:${r.line}: ${r.content}`).join("\n");
    }
    case "get_file_info":
      return JSON.stringify(explorer.getFileInfo(input.path as string), null, 2);

    // Editing
    case "write_file":
      editor.writeFile(input.path as string, input.content as string);
      return `File written: ${input.path}`;
    case "edit_file": {
      const result = editor.editFile(input.path as string, input.search as string, input.replace as string);
      return `Replaced ${result.replacements} occurrence(s) in ${input.path}`;
    }
    case "insert_lines":
      editor.insertLines(input.path as string, input.line_number as number, input.text as string);
      return `Lines inserted at line ${input.line_number} in ${input.path}`;
    case "delete_file":
      editor.deleteFile(input.path as string);
      return `File deleted: ${input.path}`;

    // Build
    case "run_build": {
      const buildResult = runBuild();
      const summary = [
        `Build ${buildResult.success ? "SUCCEEDED" : "FAILED"}`,
        `Exit code: ${buildResult.exitCode}`,
        `Duration: ${buildResult.duration}ms`,
      ];
      if (buildResult.errors.length > 0) {
        summary.push("", "Errors:", ...buildResult.errors.slice(0, 20));
      }
      if (buildResult.stderr) {
        const stderrLines = buildResult.stderr.split("\n").slice(0, 30);
        summary.push("", "Stderr (first 30 lines):", ...stderrLines);
      }
      if (buildResult.stdout) {
        const stdoutLines = buildResult.stdout.split("\n").slice(-20);
        summary.push("", "Stdout (last 20 lines):", ...stdoutLines);
      }
      return summary.join("\n");
    }

    // Memory
    case "read_memory": {
      const fileName = input.file as string;
      if (!isValidMemoryFile(fileName)) {
        throw new Error(`Invalid memory file: ${fileName}`);
      }
      const mem = loadMemory();
      const key = fileName.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as keyof typeof mem;
      return mem[key]?.raw ?? "Memory file not found.";
    }
    case "update_memory": {
      const fileName = input.file as string;
      if (!isValidMemoryFile(fileName)) {
        throw new Error(`Invalid memory file: ${fileName}`);
      }
      writeMemoryFile(fileName, input.content as string);
      return `Memory file updated: ${fileName}`;
    }
    case "append_to_memory": {
      const fileName = input.file as string;
      if (!isValidMemoryFile(fileName)) {
        throw new Error(`Invalid memory file: ${fileName}`);
      }
      appendToMemory(fileName, input.heading as string, input.content as string);
      return `Appended to memory: ${fileName} → "${input.heading}"`;
    }

    // Cycle control
    case "complete_cycle":
      return "__CYCLE_COMPLETE__";

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/** Run the agentic loop: send messages to Claude, execute tool calls, repeat */
export async function runAgentLoop(
  systemPrompt: string,
  initialUserMessage: string,
): Promise<AgentLoopResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
  const maxToolCalls = parseInt(process.env.MAX_TOOL_CALLS_PER_CYCLE ?? "50", 10);
  const maxTokensBudget = parseInt(process.env.MAX_TOKENS_PER_CYCLE ?? "200000", 10);

  const client = new Anthropic({ apiKey });

  const messages: Anthropic.MessageParam[] = [{ role: "user", content: initialUserMessage }];

  const actions: ActionRecord[] = [];
  const filesModified = new Set<string>();
  let buildResult: { success: boolean; errors: string[] } | null = null;
  let cycleSummary = "";
  let nextSteps = "";
  let toolCallCount = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  logger.info(`Starting agent loop (model: ${model}, max tools: ${maxToolCalls})`);

  while (toolCallCount < maxToolCalls) {
    // Check token budget
    const totalTokens = totalInputTokens + totalOutputTokens;
    if (totalTokens > maxTokensBudget) {
      logger.warn(`Token budget exceeded (${totalTokens} > ${maxTokensBudget}), ending loop`);
      cycleSummary = cycleSummary || "Cycle ended: token budget exceeded.";
      break;
    }

    const response = await client.messages.create({
      model,
      max_tokens: 8096,
      system: systemPrompt,
      tools: AGENT_TOOLS,
      messages,
    });

    totalInputTokens += response.usage.input_tokens;
    totalOutputTokens += response.usage.output_tokens;

    // Process response blocks
    const assistantContent = response.content;
    messages.push({ role: "assistant", content: assistantContent });

    // Check if the model wants to use tools
    const toolUseBlocks = assistantContent.filter(
      (block): block is Anthropic.ContentBlockParam & { type: "tool_use"; id: string; name: string; input: Record<string, unknown> } =>
        block.type === "tool_use",
    );

    // Log any text blocks
    for (const block of assistantContent) {
      if (block.type === "text") {
        logger.info(`Agent: ${block.text.slice(0, 200)}${block.text.length > 200 ? "..." : ""}`);
      }
    }

    // If no tool calls, the agent is done talking
    if (toolUseBlocks.length === 0) {
      if (response.stop_reason === "end_turn") {
        cycleSummary = cycleSummary || "Cycle ended: agent stopped without calling complete_cycle.";
        break;
      }
      break;
    }

    // Execute each tool call
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    let cycleComplete = false;

    for (const toolBlock of toolUseBlocks) {
      toolCallCount++;
      const { id, name, input } = toolBlock;
      logger.info(`Tool call #${toolCallCount}: ${name}(${JSON.stringify(input).slice(0, 100)})`);

      let resultText: string;
      let isError = false;

      try {
        resultText = executeTool(name, input);
      } catch (err) {
        resultText = `Error: ${err instanceof Error ? err.message : String(err)}`;
        isError = true;
        logger.warn(`Tool error: ${resultText}`);
      }

      // Track file modifications
      if (["write_file", "edit_file", "insert_lines", "delete_file"].includes(name) && !isError) {
        filesModified.add(input.path as string);
      }

      // Track build results
      if (name === "run_build" && !isError) {
        buildResult = {
          success: resultText.startsWith("Build SUCCEEDED"),
          errors: resultText.includes("Errors:") ? resultText.split("Errors:\n")[1]?.split("\n").filter(Boolean) ?? [] : [],
        };
      }

      // Handle cycle completion
      if (name === "complete_cycle" && !isError) {
        cycleSummary = (input.summary as string) ?? "";
        nextSteps = (input.next_steps as string) ?? "";
        cycleComplete = true;
        resultText = "Cycle marked as complete. Wrapping up.";
      }

      actions.push({
        tool: name,
        input,
        result: resultText.length > 500 ? resultText.slice(0, 500) + "...(truncated)" : resultText,
        timestamp: new Date().toISOString(),
      });

      toolResults.push({
        type: "tool_result",
        tool_use_id: id,
        content: resultText.length > 10000 ? resultText.slice(0, 10000) + "\n...(truncated)" : resultText,
        is_error: isError,
      });
    }

    messages.push({ role: "user", content: toolResults });

    if (cycleComplete) break;
  }

  if (toolCallCount >= maxToolCalls) {
    logger.warn("Max tool calls reached, ending loop");
  }

  const tokenUsage: TokenUsage = {
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
  };

  logger.info(
    `Agent loop complete: ${toolCallCount} tool calls, ${actions.length} actions, ${filesModified.size} files modified, ${tokenUsage.totalTokens} tokens used`,
  );

  return {
    actions,
    filesModified: [...filesModified],
    buildResult,
    cycleSummary,
    nextSteps,
    tokenUsage,
    toolCallCount,
  };
}
