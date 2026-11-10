import { describe, expect, it } from "vitest";
import type { PlaytestResult } from "../emulator/playtest.js";
import { ciRunUrl, formatPlaytestSection } from "./playtest-gate.js";

const result = (name: string, passed: boolean): PlaytestResult => ({
  name, checks: `checks ${name}`, passed, failedStep: passed ? undefined : 2, error: passed ? undefined : "boom",
  transcripts: [], screenshots: [], frames: 1, ms: 1,
});

describe("formatPlaytestSection", () => {
  it("says why the suite was skipped", () => {
    expect(formatPlaytestSection({ status: "skipped", reason: "no ROM", results: [], issues: [] })).toContain("did not run this cycle: no ROM");
  });

  it("is one line when everything passes", () => {
    const text = formatPlaytestSection({ status: "ran", results: [result("a", true), result("b", true)], issues: [] });
    expect(text).toContain("2/2 passed");
    expect(text).not.toContain("Failing");
  });

  it("separates new failures from already-reported ones and says what to do", () => {
    const text = formatPlaytestSection({
      status: "ran",
      results: [result("ok", true), result("new-one", false), result("old-one", false), result("flood", false)],
      issues: [
        { name: "new-one", issueNumber: 12, status: "opened" },
        { name: "old-one", issueNumber: 4, status: "known" },
        { name: "flood", issueNumber: null, status: "suppressed" },
      ],
    });
    expect(text).toContain("1/4 passed");
    expect(text).toContain("`new-one` — NEW this cycle, issue #12");
    expect(text).toContain("`old-one` — already reported (#4)");
    expect(text).toContain("`flood` — NEW this cycle (no issue opened");
    expect(text).toContain("Step 2: boom");
    expect(text).toContain("next_steps");
  });
});

describe("ciRunUrl", () => {
  it("builds the run link from the Actions environment, or nothing locally", () => {
    expect(ciRunUrl({ GITHUB_SERVER_URL: "https://github.com", GITHUB_REPOSITORY: "o/r", GITHUB_RUN_ID: "42" })).toBe(
      "https://github.com/o/r/actions/runs/42",
    );
    expect(ciRunUrl({})).toBeUndefined();
  });
});
