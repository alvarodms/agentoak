/** Names of the memory files Agent Oak maintains */
export const MEMORY_FILES = [
  "codebase-facts",
  "failure-patterns",
  "strategy-notes",
  "project-facts",
  "pokemon-knowledge",
] as const;

export type MemoryFileName = (typeof MEMORY_FILES)[number];

/** A section within a memory markdown file */
export interface MemoryEntry {
  heading: string;
  content: string;
}

/** Parsed representation of a memory file */
export interface MemoryFile {
  name: MemoryFileName;
  title: string;
  entries: MemoryEntry[];
  raw: string;
}

/** All loaded memory */
export interface Memory {
  codebaseFacts: MemoryFile;
  failurePatterns: MemoryFile;
  strategyNotes: MemoryFile;
  projectFacts: MemoryFile;
  pokemonKnowledge: MemoryFile;
}

/** Token usage tracking for a cycle */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}
