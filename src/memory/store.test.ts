import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to mock fs and logger before importing the module under test.
// Using vi.doMock for ESM dynamic import pattern (same as version.test.ts).

describe("memory store", () => {
  const mockFs = {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(),
  };

  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  async function importStore() {
    vi.doMock("fs", () => ({ default: mockFs }));
    vi.doMock("../utils/logger.js", () => ({
      logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    }));
    return import("./store.js");
  }

  describe("loadMemory / parseMemoryFile", () => {
    it("creates initial file when memory file does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);
      // After creation, readFileSync returns the initial content
      mockFs.readFileSync.mockReturnValue(
        "# Codebase Facts\n\nDescription\n\n---\n\n*No entries yet.*\n",
      );
      const { loadMemory } = await importStore();
      const memory = loadMemory();
      expect(mockFs.writeFileSync).toHaveBeenCalled();
      expect(memory.codebaseFacts.title).toBe("Codebase Facts");
      expect(memory.codebaseFacts.entries).toHaveLength(0);
    });

    it("parses file with multiple ## headings into entries", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "# Strategy Notes\n\n## Vision\n\nBuild a great hack\n\n## Roadmap\n\nStep 1\nStep 2\n",
      );
      const { loadMemory } = await importStore();
      const memory = loadMemory();
      const notes = memory.strategyNotes;
      expect(notes.title).toBe("Strategy Notes");
      expect(notes.entries).toHaveLength(2);
      expect(notes.entries[0].heading).toBe("Vision");
      expect(notes.entries[0].content).toBe("Build a great hack");
      expect(notes.entries[1].heading).toBe("Roadmap");
      expect(notes.entries[1].content).toBe("Step 1\nStep 2");
    });

    it("parses file with zero ## headings as empty entries", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Title Only\n\nJust some text without headings.\n");
      const { loadMemory } = await importStore();
      const memory = loadMemory();
      expect(memory.codebaseFacts.entries).toHaveLength(0);
    });

    it("treats ### subheadings as content, not new entries", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(
        "# Facts\n\n## Section One\n\nIntro\n\n### Subsection\n\nDetail\n",
      );
      const { loadMemory } = await importStore();
      const memory = loadMemory();
      expect(memory.codebaseFacts.entries).toHaveLength(1);
      expect(memory.codebaseFacts.entries[0].content).toContain("### Subsection");
      expect(memory.codebaseFacts.entries[0].content).toContain("Detail");
    });

    it("preserves raw content on parsed file", async () => {
      const rawContent = "# Test\n\n## Entry\n\nContent here\n";
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(rawContent);
      const { loadMemory } = await importStore();
      const memory = loadMemory();
      expect(memory.codebaseFacts.raw).toBe(rawContent);
    });
  });

  describe("getMemorySummary", () => {
    it("includes entry counts in summary", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Title\n\n## Entry1\n\nContent\n\n## Entry2\n\nMore\n");
      const { loadMemory, getMemorySummary } = await importStore();
      const memory = loadMemory();
      const summary = getMemorySummary(memory);
      expect(summary).toContain("(2 entries)");
    });

    it("truncates files over 2000 chars", async () => {
      mockFs.existsSync.mockReturnValue(true);
      const longContent = "# Title\n\n" + "x".repeat(2500);
      mockFs.readFileSync.mockReturnValue(longContent);
      const { loadMemory, getMemorySummary } = await importStore();
      const memory = loadMemory();
      const summary = getMemorySummary(memory);
      expect(summary).toContain("...(truncated)");
    });

    it("does not truncate files under 2000 chars", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Title\n\nShort content\n");
      const { loadMemory, getMemorySummary } = await importStore();
      const memory = loadMemory();
      const summary = getMemorySummary(memory);
      expect(summary).not.toContain("...(truncated)");
    });
  });

  describe("appendToMemory", () => {
    it("removes 'No entries yet' placeholder when appending", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Title\n\nDescription\n\n---\n\n*No entries yet.*\n");
      const { appendToMemory } = await importStore();
      appendToMemory("codebase-facts", "New Section", "New content");

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).not.toContain("*No entries yet.*");
      expect(written).toContain("## New Section");
      expect(written).toContain("New content");
    });

    it("appends to file with existing entries", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Title\n\n## Existing\n\nOld content\n");
      const { appendToMemory } = await importStore();
      appendToMemory("codebase-facts", "Added", "Fresh content");

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("## Existing");
      expect(written).toContain("## Added");
      expect(written).toContain("Fresh content");
    });
  });

  describe("cycle mode history", () => {
    it("returns empty data when history file does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const { getCycleModeHistorySummary } = await importStore();
      const summary = getCycleModeHistorySummary();
      expect(summary).toBe("No cycle history yet.");
    });

    it("parses well-formed history file", async () => {
      const historyContent = `# Cycle Mode History

## Recent Modes
feature, patch, research

## Mode Counts

| Mode | Count |
|------|-------|
| research | 3 |
| patch | 5 |
| repair | 1 |
| refactor | 0 |
| feature | 8 |
| planning | 2 |
`;
      // First call (existsSync for memory files) returns false so they get created,
      // but we need to handle the mode history path specifically.
      // The store module uses two different paths, so we need nuanced mocking.
      mockFs.existsSync.mockImplementation((p: string) => {
        if (typeof p === "string" && p.includes("cycle-mode-history")) return true;
        return false;
      });
      mockFs.readFileSync.mockImplementation((p: string) => {
        if (typeof p === "string" && p.includes("cycle-mode-history")) return historyContent;
        return "# Title\n\nDescription\n\n---\n\n*No entries yet.*\n";
      });

      const { getCycleModeHistorySummary } = await importStore();
      const summary = getCycleModeHistorySummary();
      expect(summary).toContain("feature, patch, research");
      expect(summary).toContain("feature: 8");
      expect(summary).toContain("patch: 5");
      expect(summary).toContain("research: 3");
      expect(summary).not.toContain("refactor"); // count is 0, should be filtered
    });

    it("updateCycleModeHistory adds mode and increments count", async () => {
      mockFs.existsSync.mockImplementation((p: string) => {
        if (typeof p === "string" && p.includes("cycle-mode-history")) return false;
        return false;
      });
      mockFs.readFileSync.mockReturnValue("# Title\n\nDescription\n\n---\n\n*No entries yet.*\n");

      const { updateCycleModeHistory } = await importStore();
      updateCycleModeHistory("feature");

      // Should have written the history file
      const writeCalls = mockFs.writeFileSync.mock.calls;
      const historyWrite = writeCalls.find(
        (call: unknown[]) => typeof call[0] === "string" && (call[0] as string).includes("cycle-mode-history"),
      );
      expect(historyWrite).toBeDefined();
      const content = historyWrite![1] as string;
      expect(content).toContain("feature");
      expect(content).toContain("| feature | 1 |");
    });

    it("updateCycleModeHistory skips unknown mode", async () => {
      mockFs.existsSync.mockReturnValue(false);
      mockFs.readFileSync.mockReturnValue("# Title\n\nDescription\n\n---\n\n*No entries yet.*\n");

      const { updateCycleModeHistory } = await importStore();
      updateCycleModeHistory("nonexistent");

      // Should NOT have written to the history file
      const writeCalls = mockFs.writeFileSync.mock.calls;
      const historyWrite = writeCalls.find(
        (call: unknown[]) => typeof call[0] === "string" && (call[0] as string).includes("cycle-mode-history"),
      );
      expect(historyWrite).toBeUndefined();
    });
  });
});
