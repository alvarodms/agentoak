import { describe, it, expect, vi, beforeEach } from "vitest";

describe("journal writer", () => {
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

  async function importWriter() {
    vi.doMock("fs", () => ({ default: mockFs }));
    vi.doMock("../utils/logger.js", () => ({
      logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    }));
    return import("./writer.js");
  }

  function makeJournalData(overrides: Record<string, unknown> = {}) {
    return {
      cycleNumber: 1,
      mode: "feature" as const,
      objective: "Add encounters",
      reasoning: "Game needs variety",
      actions: [],
      filesModified: [],
      buildResult: null,
      cycleSummary: "",
      nextSteps: "",
      reflectionText: "",
      tokenUsage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      toolCallCount: 5,
      ...overrides,
    };
  }

  describe("writeJournalEntry", () => {
    it("writes file with zero-padded cycle number", async () => {
      const { writeJournalEntry } = await importWriter();
      const filename = writeJournalEntry(makeJournalData({ cycleNumber: 7 }));
      expect(filename).toBe("cycle-0007.md");
    });

    it("includes mode and objective in output", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData());

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("**Mode**: feature");
      expect(written).toContain("**Objective**: Add encounters");
    });

    it("lists modified files", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        filesModified: ["pokeemerald/src/data.c", "pokeemerald/include/data.h"],
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("- pokeemerald/src/data.c");
      expect(written).toContain("- pokeemerald/include/data.h");
    });

    it("shows 'No files modified' when filesModified is empty", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData());

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("No files modified.");
    });

    it("includes successful build result", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        buildResult: { success: true, errors: [] },
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("SUCCESS");
      expect(written).toContain("No errors.");
    });

    it("includes failed build result with errors", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        buildResult: { success: false, errors: ["undefined reference to foo"] },
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("FAILED");
      expect(written).toContain("undefined reference to foo");
    });

    it("shows 'No build was attempted' when buildResult is null", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData());

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("No build was attempted this cycle.");
    });

    it("includes issue actions when present", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        issueActions: [{ issueNumber: 42, action: "accept", response: "Will implement this!" }],
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("Community Issues");
      expect(written).toContain("#42");
      expect(written).toContain("accept");
    });

    it("includes help requests when present", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        helpRequests: [{ title: "Need sprite help", body: "Can someone provide Lucario sprites?" }],
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("Help Requests Created");
      expect(written).toContain("Need sprite help");
    });

    it("includes validation warnings when present", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        validationWarnings: ["Claimed 5 files but diff shows 2"],
        validationStatus: "unsubstantiated",
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("Validation Warnings");
      expect(written).toContain("UNSUBSTANTIATED");
      expect(written).toContain("Claimed 5 files but diff shows 2");
    });

    it("includes plan output section when present", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        planOutput: "## Game Design Vision\n\nCreate unique encounters",
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("## Plan Output");
      expect(written).toContain("Create unique encounters");
    });

    it("includes token usage stats", async () => {
      const { writeJournalEntry } = await importWriter();
      writeJournalEntry(makeJournalData({
        tokenUsage: { inputTokens: 10000, outputTokens: 5000, totalTokens: 15000 },
        toolCallCount: 42,
      }));

      const written = mockFs.writeFileSync.mock.calls[0][1] as string;
      expect(written).toContain("Tool calls: 42");
      expect(written).toContain("15,000");
    });
  });

  describe("getNextCycleNumber", () => {
    it("returns 1 when journal directory does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const { getNextCycleNumber } = await importWriter();
      expect(getNextCycleNumber()).toBe(1);
    });

    it("returns count + 1 of matching files", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "cycle-0001.md",
        "cycle-0002.md",
        "cycle-0003.md",
      ]);
      const { getNextCycleNumber } = await importWriter();
      expect(getNextCycleNumber()).toBe(4);
    });

    it("ignores non-matching filenames", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "cycle-0001.md",
        "readme.md",
        "notes.txt",
        "cycle-0002.md",
      ]);
      const { getNextCycleNumber } = await importWriter();
      expect(getNextCycleNumber()).toBe(3);
    });
  });

  describe("getRecentJournalSummaries", () => {
    it("returns empty array when journal directory does not exist", async () => {
      mockFs.existsSync.mockReturnValue(false);
      const { getRecentJournalSummaries } = await importWriter();
      expect(getRecentJournalSummaries(5)).toEqual([]);
    });

    it("returns last N entries sorted", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue([
        "cycle-0001.md",
        "cycle-0002.md",
        "cycle-0003.md",
      ]);
      mockFs.readFileSync.mockImplementation((p: string) => {
        if (typeof p === "string" && p.includes("0002")) return "Content of cycle 2";
        if (typeof p === "string" && p.includes("0003")) return "Content of cycle 3";
        return "Content of cycle 1";
      });

      const { getRecentJournalSummaries } = await importWriter();
      const summaries = getRecentJournalSummaries(2);
      expect(summaries).toHaveLength(2);
    });

    it("truncates entries over 3000 chars", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["cycle-0001.md"]);
      mockFs.readFileSync.mockReturnValue("x".repeat(4000));

      const { getRecentJournalSummaries } = await importWriter();
      const summaries = getRecentJournalSummaries(1);
      expect(summaries[0]).toContain("...(truncated)");
      expect(summaries[0].length).toBeLessThan(4000);
    });

    it("does not truncate entries under 3000 chars", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(["cycle-0001.md"]);
      mockFs.readFileSync.mockReturnValue("Short content");

      const { getRecentJournalSummaries } = await importWriter();
      const summaries = getRecentJournalSummaries(1);
      expect(summaries[0]).toBe("Short content");
    });
  });
});
