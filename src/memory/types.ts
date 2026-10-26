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

/**
 * Token usage tracking for a cycle. Input is split the way it is billed:
 * uncached input, prompt-cache writes and prompt-cache reads (the cheapest,
 * and by far the largest share of an agent run's input).
 */
export interface TokenUsage {
  inputTokens: number;
  cacheWriteTokens: number;
  cacheReadTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export const EMPTY_TOKEN_USAGE: TokenUsage = {
  inputTokens: 0,
  cacheWriteTokens: 0,
  cacheReadTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
};

/** Aggregate token usage from multiple phases */
export function mergeTokenUsage(...usages: TokenUsage[]): TokenUsage {
  return usages.reduce(
    (acc, u) => ({
      inputTokens: acc.inputTokens + u.inputTokens,
      cacheWriteTokens: acc.cacheWriteTokens + u.cacheWriteTokens,
      cacheReadTokens: acc.cacheReadTokens + u.cacheReadTokens,
      outputTokens: acc.outputTokens + u.outputTokens,
      totalTokens: acc.totalTokens + u.totalTokens,
    }),
    EMPTY_TOKEN_USAGE,
  );
}
