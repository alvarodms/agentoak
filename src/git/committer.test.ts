import { describe, it, expect } from "vitest";
import { buildDiffStats } from "./committer.js";

const TRACKED_DIFF = ` pokeemerald/src/main.c | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)`;

const TRACKED_DIFF_MULTI = ` pokeemerald/src/a.c | 4 ++--
 pokeemerald/src/b.c | 6 ++++--
 2 files changed, 6 insertions(+), 4 deletions(-)`;

describe("buildDiffStats", () => {
  it("parses a tracked-only diff with no untracked files", () => {
    const stats = buildDiffStats(TRACKED_DIFF, []);
    expect(stats.filesChanged).toBe(1);
    expect(stats.insertions).toBe(2);
    expect(stats.deletions).toBe(2);
    expect(stats.summary).toContain("1 file changed");
    expect(stats.summary).not.toContain("untracked");
  });

  it("parses a multi-file tracked diff", () => {
    const stats = buildDiffStats(TRACKED_DIFF_MULTI, []);
    expect(stats.filesChanged).toBe(2);
    expect(stats.insertions).toBe(6);
    expect(stats.deletions).toBe(4);
  });

  it("returns zero stats when both tracked and untracked are empty", () => {
    const stats = buildDiffStats("", []);
    expect(stats.filesChanged).toBe(0);
    expect(stats.insertions).toBe(0);
    expect(stats.deletions).toBe(0);
    expect(stats.summary).toBe("No changes in pokeemerald/");
  });

  it("counts untracked files toward filesChanged when tracked diff is empty", () => {
    // This is the cycle 202 false-negative case: a refactor cycle whose
    // only output is brand-new scripts. git diff shows nothing, but the
    // work is real.
    const stats = buildDiffStats("", [
      "pokeemerald/scripts/add_regional_form.cjs",
      "pokeemerald/scripts/check_quest_flags.sh",
      "pokeemerald/scripts/configs/corsola_hoenn.json",
    ]);
    expect(stats.filesChanged).toBe(3);
    expect(stats.insertions).toBe(0);
    expect(stats.deletions).toBe(0);
    expect(stats.summary).toContain("3 untracked file(s)");
    expect(stats.summary).toContain("add_regional_form.cjs");
  });

  it("sums tracked and untracked counts when both exist", () => {
    const stats = buildDiffStats(TRACKED_DIFF_MULTI, [
      "pokeemerald/data/new_table.h",
    ]);
    expect(stats.filesChanged).toBe(3); // 2 tracked + 1 untracked
    expect(stats.insertions).toBe(6); // tracked-only
    expect(stats.deletions).toBe(4); // tracked-only
    expect(stats.summary).toContain("2 files changed");
    expect(stats.summary).toContain("1 untracked file(s)");
    expect(stats.summary).toContain("new_table.h");
  });

  it("truncates the untracked preview when more than 5 files exist", () => {
    const untracked = Array.from({ length: 8 }, (_, i) => `pokeemerald/f${i}.c`);
    const stats = buildDiffStats("", untracked);
    expect(stats.filesChanged).toBe(8);
    expect(stats.summary).toContain("8 untracked file(s)");
    expect(stats.summary).toContain("+3 more");
    expect(stats.summary).toContain("pokeemerald/f0.c");
    expect(stats.summary).not.toContain("pokeemerald/f6.c");
  });
});
