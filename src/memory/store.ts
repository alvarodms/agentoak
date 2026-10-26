import fs from "fs";
import path from "path";
import { MEMORY_DIR } from "../utils/paths.js";
import { logger } from "../utils/logger.js";
import type { Memory, MemoryEntry, MemoryFile, MemoryFileName } from "./types.js";

const INITIAL_CONTENT: Record<MemoryFileName, { title: string; description: string }> = {
  "codebase-facts": {
    title: "Codebase Facts",
    description:
      "Discovered facts about the pokeemerald codebase — file relationships, data structures, how systems connect.",
  },
  "failure-patterns": {
    title: "Failure Patterns",
    description:
      "Build failures and errors encountered, their causes, and how they were (or could be) resolved.",
  },
  "strategy-notes": {
    title: "Strategy Notes",
    description:
      "High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.",
  },
  "project-facts": {
    title: "Project Facts",
    description:
      "General project information — build system details, tool versions, configuration notes.",
  },
  "pokemon-knowledge": {
    title: "Pokémon Knowledge Base",
    description:
      "Research findings about ROM hacks, community expectations, and design patterns — gathered via web search by the ROM Hack Researcher advisor.",
  },
};

function memoryPath(name: MemoryFileName): string {
  return path.join(MEMORY_DIR, `${name}.md`);
}

function ensureMemoryFile(name: MemoryFileName): void {
  const filePath = memoryPath(name);
  if (!fs.existsSync(filePath)) {
    const { title, description } = INITIAL_CONTENT[name];
    const content = `# ${title}\n\n${description}\n\n---\n\n*No entries yet.*\n`;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf-8");
    logger.info(`Created initial memory file: ${name}.md`);
  }
}

/** Parse a memory markdown file into structured entries */
function parseMemoryFile(name: MemoryFileName): MemoryFile {
  ensureMemoryFile(name);
  const raw = fs.readFileSync(memoryPath(name), "utf-8");

  const lines = raw.split("\n");
  const title = lines[0]?.replace(/^#\s+/, "") ?? name;

  const entries: MemoryEntry[] = [];
  let currentHeading = "";
  let currentContent: string[] = [];

  for (const line of lines.slice(1)) {
    if (line.startsWith("## ")) {
      if (currentHeading) {
        entries.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
      }
      currentHeading = line.replace(/^##\s+/, "");
      currentContent = [];
    } else if (currentHeading) {
      currentContent.push(line);
    }
  }

  if (currentHeading) {
    entries.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
  }

  return { name, title, entries, raw };
}

/** Load all memory files */
export function loadMemory(): Memory {
  logger.info("Loading memory files...");
  return {
    codebaseFacts: parseMemoryFile("codebase-facts"),
    failurePatterns: parseMemoryFile("failure-patterns"),
    strategyNotes: parseMemoryFile("strategy-notes"),
    projectFacts: parseMemoryFile("project-facts"),
    pokemonKnowledge: parseMemoryFile("pokemon-knowledge"),
  };
}

/** Write raw markdown content to a memory file */
export function writeMemoryFile(name: MemoryFileName, content: string): void {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
  fs.writeFileSync(memoryPath(name), content, "utf-8");
  logger.info(`Updated memory file: ${name}.md`);
}

/** Append a new section to a memory file */
export function appendToMemory(name: MemoryFileName, heading: string, content: string): void {
  ensureMemoryFile(name);
  const existing = fs.readFileSync(memoryPath(name), "utf-8");

  // Remove the "No entries yet" placeholder if present
  const cleaned = existing.replace(/\n\*No entries yet\.\*\n?/, "\n");

  const entry = `\n## ${heading}\n\n${content}\n`;
  fs.writeFileSync(memoryPath(name), cleaned.trimEnd() + "\n" + entry, "utf-8");
  logger.info(`Appended to memory: ${name}.md → "${heading}"`);
}

/** Line budgets for memory files, from the memory maintenance rules */
const MEMORY_LINE_BUDGETS: Record<string, number> = {
  "completed-work.md": 50,
  "strategy-notes.md": 200,
  "codebase-facts.md": 150,
  "failure-patterns.md": 100,
  "project-facts.md": 80,
  "pokemon-knowledge.md": 30,
  "tech-debt-backlog.md": 50,
  "creative-backlog.md": 50,
  "player-journey-map.md": 100,
  "sprite-knowledge.md": 60,
  "sprite-iterations.md": 50,
};
/** Budgets for each file inside a memory subdirectory */
const MEMORY_DIR_LINE_BUDGETS: Record<string, number> = {
  "completed-work": 80,
  "pokemon-knowledge": 60,
};

function lineCount(filePath: string): number {
  return fs.readFileSync(filePath, "utf-8").split("\n").length;
}

/** Memory files and directories with their line counts, flagging what is over budget. */
export function getMemoryBudgetReport(): string {
  if (!fs.existsSync(MEMORY_DIR)) return "No memory files yet.";
  const rows: string[] = [];
  for (const entry of fs.readdirSync(MEMORY_DIR).sort()) {
    const full = path.join(MEMORY_DIR, entry);
    if (fs.statSync(full).isDirectory()) {
      const budget = MEMORY_DIR_LINE_BUDGETS[entry];
      const files = fs.readdirSync(full).filter((f) => f.endsWith(".md"));
      const over = budget ? files.filter((f) => lineCount(path.join(full, f)) > budget) : [];
      const note = over.length > 0 ? ` — **over budget (${budget})**: ${over.join(", ")}` : "";
      rows.push(`- \`${entry}/\` — ${files.length} files${note}`);
    } else if (entry.endsWith(".md")) {
      const lines = lineCount(full);
      const budget = MEMORY_LINE_BUDGETS[entry];
      const status = budget ? (lines > budget ? ` / ${budget} — **over budget**` : ` / ${budget}`) : "";
      rows.push(`- \`${entry}\` — ${lines} lines${status}`);
    }
  }
  return rows.join("\n");
}

/**
 * Memory overview for prompts: the strategy notes in full (the current vision
 * and roadmap) plus every memory file's size against its budget. Other files
 * are read on demand — a fixed-length head of each was mostly noise.
 */
export function getMemorySummary(memory: Memory): string {
  return `### Strategy Notes (\`memory/strategy-notes.md\`)

${memory.strategyNotes.raw.trim()}

### Memory Files (line counts vs. budget)

Read any of these on demand from \`memory/\`.

${getMemoryBudgetReport()}`;
}

// ── Cycle Mode History ──────────────────────────────────────────────────────

const ALL_MODES = ["research", "patch", "repair", "refactor", "feature", "planning"] as const;
type ModeType = (typeof ALL_MODES)[number];

interface CycleModeHistoryData {
  recentModes: ModeType[];
  counts: Record<ModeType, number>;
}

const MODE_HISTORY_PATH = path.join(MEMORY_DIR, "cycle-mode-history.md");
/** Recent modes kept in the history file (totals are kept separately) */
const MODE_HISTORY_FILE_LIMIT = 50;
/** Recent modes shown to the planner */
const MODE_HISTORY_PROMPT_LIMIT = 15;

function parseCycleModeHistory(): CycleModeHistoryData {
  const zeroCounts = Object.fromEntries(ALL_MODES.map((m) => [m, 0])) as Record<ModeType, number>;

  if (!fs.existsSync(MODE_HISTORY_PATH)) {
    return { recentModes: [], counts: zeroCounts };
  }

  const raw = fs.readFileSync(MODE_HISTORY_PATH, "utf-8");

  const recentMatch = raw.match(/## Recent Modes\s*\n([^\n]+)/);
  const recentModes: ModeType[] = recentMatch
    ? (recentMatch[1]
        .split(",")
        .map((m) => m.trim())
        .filter((m) => (ALL_MODES as readonly string[]).includes(m)) as ModeType[])
    : [];

  const counts = { ...zeroCounts };
  const tableRowRegex = /\|\s*(\w+)\s*\|\s*(\d+)\s*\|/g;
  let match: RegExpExecArray | null;
  while ((match = tableRowRegex.exec(raw)) !== null) {
    const mode = match[1] as ModeType;
    if ((ALL_MODES as readonly string[]).includes(mode)) {
      counts[mode] = parseInt(match[2], 10);
    }
  }

  return { recentModes, counts };
}

function writeCycleModeHistory(data: CycleModeHistoryData): void {
  const recentLine = data.recentModes.length > 0 ? data.recentModes.join(", ") : "(none yet)";
  const countRows = ALL_MODES.map((m) => `| ${m} | ${data.counts[m]} |`).join("\n");

  const content = `# Cycle Mode History\n\n## Recent Modes\n${recentLine}\n\n## Mode Counts\n\n| Mode | Count |\n|------|-------|\n${countRows}\n`;

  fs.mkdirSync(MEMORY_DIR, { recursive: true });
  fs.writeFileSync(MODE_HISTORY_PATH, content, "utf-8");
}

/** Record the mode chosen for the current cycle (call once per cycle, after planning). */
export function updateCycleModeHistory(mode: string): void {
  const data = parseCycleModeHistory();
  const typedMode = (ALL_MODES as readonly string[]).includes(mode) ? (mode as ModeType) : null;
  if (!typedMode) {
    logger.warn(`updateCycleModeHistory: unknown mode "${mode}", skipping`);
    return;
  }
  data.recentModes.unshift(typedMode);
  data.recentModes = data.recentModes.slice(0, MODE_HISTORY_FILE_LIMIT);
  data.counts[typedMode] = (data.counts[typedMode] ?? 0) + 1;
  writeCycleModeHistory(data);
  logger.info(`Updated cycle mode history: added "${typedMode}"`);
}

/** Return a compact summary of cycle mode history for inclusion in the planner prompt. */
export function getCycleModeHistorySummary(): string {
  const data = parseCycleModeHistory();
  if (data.recentModes.length === 0) {
    return "No cycle history yet.";
  }

  const recentLine = data.recentModes.slice(0, MODE_HISTORY_PROMPT_LIMIT).join(", ");
  const countsLines = ALL_MODES.filter((m) => data.counts[m] > 0)
    .map((m) => `  - ${m}: ${data.counts[m]}`)
    .join("\n");

  return `Last ${Math.min(data.recentModes.length, MODE_HISTORY_PROMPT_LIMIT)} cycle modes (most recent first): ${recentLine}\n\nMode totals across all cycles:\n${countsLines}`;
}
