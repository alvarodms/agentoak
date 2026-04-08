import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for pure/near-pure functions in the issues module.
 * We mock fs and the GitHub client to avoid I/O.
 */

// The BACKLOG_LINE_RE regex is not exported, so we test it indirectly through
// parseBacklogEntries (which reads from fs). We also test formatIssuesForPrompt.

const mockFs = {
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
};

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
});

async function importIssuesModule() {
  vi.doMock("fs", () => ({ default: mockFs }));
  vi.doMock("../utils/logger.js", () => ({
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  }));
  vi.doMock("../utils/paths.js", () => ({
    MEMORY_DIR: "/tmp/test-memory",
  }));
  // Mock the GitHub client module to avoid Octokit initialization
  vi.doMock("./client.js", () => ({
    fetchOpenIssues: vi.fn().mockResolvedValue([]),
    commentOnIssue: vi.fn().mockResolvedValue(undefined),
    addLabelsToIssue: vi.fn().mockResolvedValue(undefined),
    closeIssue: vi.fn().mockResolvedValue(undefined),
    createIssue: vi.fn().mockResolvedValue(undefined),
    getGitHubClient: vi.fn().mockReturnValue(null),
    AGENT_LABELS: {
      reviewed: "agent-reviewed",
      accepted: "agent-accepted",
      deferred: "agent-deferred",
      rejected: "agent-rejected",
      needsInfo: "agent-needs-info",
      helpRequest: "agent-help-request",
    },
    COMMUNITY_LABELS: ["suggestion", "trainer-tip", "bug-report", "idea"],
  }));
  return import("./issues.js");
}

describe("parseBacklogEntries", () => {
  it("returns empty array when backlog file does not exist", async () => {
    mockFs.existsSync.mockReturnValue(false);
    const { parseBacklogEntries } = await importIssuesModule();
    expect(parseBacklogEntries()).toEqual([]);
  });

  it("parses basic backlog entries", async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      "- #42: Add Riolu encounters (deferred: cycle 10)\n- #7: Fix trainer levels (deferred: cycle 5)\n",
    );
    const { parseBacklogEntries } = await importIssuesModule();
    const entries = parseBacklogEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({
      issueNumber: 42,
      title: "Add Riolu encounters",
      deferredAtCycle: 10,
      deferralCount: 1,
      pendingItems: undefined,
    });
    expect(entries[1].issueNumber).toBe(7);
    expect(entries[1].deferredAtCycle).toBe(5);
    expect(entries[1].deferralCount).toBe(1);
  });

  it("parses entries with pending items", async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      "- #42: Multi-item issue (deferred: cycle 10) | pending: Bug A; Feature B\n",
    );
    const { parseBacklogEntries } = await importIssuesModule();
    const entries = parseBacklogEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].pendingItems).toEqual(["Bug A", "Feature B"]);
  });

  it("handles legacy entries without cycle number", async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue("- #99: Legacy issue\n");
    const { parseBacklogEntries } = await importIssuesModule();
    const entries = parseBacklogEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].deferredAtCycle).toBe(0);
  });

  it("skips non-matching lines", async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      "# Backlog\n\nSome random text\n- #42: Valid entry (deferred: cycle 5)\n\n",
    );
    const { parseBacklogEntries } = await importIssuesModule();
    const entries = parseBacklogEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].issueNumber).toBe(42);
  });
});

describe("getStaleBacklogIssues", () => {
  it("returns entries deferred for >= threshold cycles", async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(
      [
        "- #1: Old issue (deferred: cycle 5)",
        "- #2: Recent issue (deferred: cycle 18)",
        "- #3: Edge case (deferred: cycle 10)",
      ].join("\n"),
    );
    const { getStaleBacklogIssues } = await importIssuesModule();
    const stale = getStaleBacklogIssues(20, 10);
    // #1: 20-5=15 >= 10 ✓, #2: 20-18=2 < 10 ✗, #3: 20-10=10 >= 10 ✓
    expect(stale).toHaveLength(2);
    expect(stale.map((e) => e.issueNumber)).toEqual([1, 3]);
  });

  it("returns empty array when no entries are stale", async () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue("- #1: Fresh issue (deferred: cycle 18)\n");
    const { getStaleBacklogIssues } = await importIssuesModule();
    expect(getStaleBacklogIssues(20, 10)).toEqual([]);
  });
});

describe("formatIssuesForPrompt", () => {
  it("returns empty string for no issues", async () => {
    const { formatIssuesForPrompt } = await importIssuesModule();
    expect(formatIssuesForPrompt([])).toBe("");
  });

  it("formats issues with all fields", async () => {
    const { formatIssuesForPrompt } = await importIssuesModule();
    const result = formatIssuesForPrompt([
      {
        number: 42,
        title: "Add Riolu",
        body: "Please add Riolu to the game!",
        labels: ["suggestion"],
        state: "open" as const,
        author: "trainer123",
        createdAt: "2025-01-15",
        upvotes: 5,
      },
    ]);
    expect(result).toContain("Issue #42: Add Riolu");
    expect(result).toContain("[suggestion]");
    expect(result).toContain("trainer123");
    expect(result).toContain("Upvotes**: 5");
    expect(result).toContain("Please add Riolu");
    expect(result).toContain("1 new community issue");
  });

  it("truncates long issue bodies", async () => {
    const { formatIssuesForPrompt } = await importIssuesModule();
    const longBody = "x".repeat(3000);
    const result = formatIssuesForPrompt([
      {
        number: 1,
        title: "Test",
        body: longBody,
        labels: [],
        state: "open" as const,
        author: "user",
        createdAt: "2025-01-01",
        upvotes: 0,
      },
    ]);
    expect(result).toContain("...(truncated)");
    // Body is truncated to 2000 chars, so the full 3000-char body should not appear
    expect(result).not.toContain(longBody);
  });

  it("hides upvotes when zero", async () => {
    const { formatIssuesForPrompt } = await importIssuesModule();
    const result = formatIssuesForPrompt([
      {
        number: 1,
        title: "Test",
        body: "body",
        labels: [],
        state: "open" as const,
        author: "user",
        createdAt: "2025-01-01",
        upvotes: 0,
      },
    ]);
    expect(result).not.toContain("Upvotes");
  });
});
