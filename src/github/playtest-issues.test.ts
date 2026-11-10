import { describe, expect, it } from "vitest";
import type { PlaytestResult } from "../emulator/playtest.js";
import type { GitHubIssue } from "./client.js";
import {
  PLAYTEST_LABEL,
  failureSignature,
  planPlaytestIssueSync,
  playtestIssueTitle,
  playtestNameFromTitle,
} from "./playtest-issues.js";

const pass = (name: string): PlaytestResult => ({
  name, checks: `checks ${name}`, passed: true, transcripts: [], screenshots: [], frames: 1, ms: 1,
});
const fail = (name: string, error = "text missing", step = 3): PlaytestResult => ({
  ...pass(name), passed: false, failedStep: step, error, file: `pokeemerald/playtests/${name}.json`, transcripts: [["Hello\nthere"]],
});
const issue = (number: number, name: string, body: string, labels = [PLAYTEST_LABEL, "bug-report"]): GitHubIssue => ({
  number, title: playtestIssueTitle(name), body, labels, state: "open", author: "bot", createdAt: "", upvotes: 0,
} as GitHubIssue);
const ctx = { cycleNumber: 360, runUrl: "https://github.com/o/r/actions/runs/1" };

describe("playtestNameFromTitle", () => {
  it("round-trips the title and ignores other issues", () => {
    expect(playtestNameFromTitle(playtestIssueTitle("tessa-battle"))).toBe("tessa-battle");
    expect(playtestNameFromTitle("Playtest suggestions")).toBeNull();
  });
});

describe("planPlaytestIssueSync", () => {
  it("opens one labelled issue for a new failure, with the error, dialogue and run link", () => {
    const [action] = planPlaytestIssueSync([fail("den-x")], [], ctx);
    expect(action.kind).toBe("open");
    if (action.kind !== "open") throw new Error();
    expect(action.title).toBe("Playtest failing: den-x");
    expect(action.labels).toEqual([PLAYTEST_LABEL, "bug-report"]);
    expect(action.body).toContain("text missing");
    expect(action.body).toContain("Hello / there");
    expect(action.body).toContain(ctx.runUrl);
    expect(action.body).toContain("first failed in cycle 360");
    expect(action.body).toContain(`sig=${failureSignature(fail("den-x"))}`);
  });

  it("stays silent when an open issue already reports the same failure", () => {
    const [opened] = planPlaytestIssueSync([fail("den-x")], [], { cycleNumber: 350 });
    if (opened.kind !== "open") throw new Error();
    expect(planPlaytestIssueSync([fail("den-x")], [issue(7, "den-x", opened.body)], ctx)).toEqual([
      { kind: "known", name: "den-x", issueNumber: 7 },
    ]);
  });

  it("comments and refreshes the body when the failure changes, keeping the first cycle", () => {
    const [opened] = planPlaytestIssueSync([fail("den-x")], [], { cycleNumber: 350 });
    if (opened.kind !== "open") throw new Error();
    const [action] = planPlaytestIssueSync([fail("den-x", "opponent is SPECIES_NONE", 5)], [issue(7, "den-x", opened.body)], ctx);
    expect(action.kind).toBe("update");
    if (action.kind !== "update") throw new Error();
    expect(action.comment).toContain("changed in cycle 360");
    expect(action.body).toContain("first failed in cycle 350");
    expect(action.body).toContain("as of cycle 360");
  });

  it("closes an issue when its playtest passes again, and leaves passing tests without issues alone", () => {
    expect(planPlaytestIssueSync([pass("den-x"), pass("other")], [issue(7, "den-x", "...")], ctx)).toEqual([
      expect.objectContaining({ kind: "close", issueNumber: 7, reason: "completed" }),
    ]);
  });

  it("closes an issue as not planned when its playtest was removed", () => {
    const [action] = planPlaytestIssueSync([pass("other")], [issue(9, "gone", "...")], ctx);
    expect(action).toMatchObject({ kind: "close", name: "gone", issueNumber: 9, reason: "not_planned" });
    if (action.kind !== "close") throw new Error();
    expect(action.comment).toContain("reopen");
  });

  it("ignores issues that only look like ours (no label)", () => {
    expect(planPlaytestIssueSync([pass("den-x")], [issue(7, "den-x", "...", ["bug-report"])], ctx)).toEqual([]);
  });
});
