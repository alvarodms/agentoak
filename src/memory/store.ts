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

/** Get a summary of all memory for inclusion in prompts */
export function getMemorySummary(memory: Memory): string {
  const sections = [memory.codebaseFacts, memory.failurePatterns, memory.strategyNotes, memory.projectFacts];

  return sections
    .map((file) => {
      const entryCount = file.entries.length;
      const preview = file.raw.length > 2000 ? file.raw.slice(0, 2000) + "\n\n...(truncated)" : file.raw;
      return `### ${file.title} (${entryCount} entries)\n\n${preview}`;
    })
    .join("\n\n---\n\n");
}
