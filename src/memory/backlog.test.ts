import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { backlogItemKey, upsertBacklogItem } from "./backlog.js";

const HEADER = "# Tech Debt Backlog\n\n| Cycle | Investment | Status |\n|-------|-----------|--------|\n";

describe("backlogItemKey", () => {
  it("takes the title before the first separator, without emphasis", () => {
    expect(backlogItemKey("**JSON trainer config extraction**: move data")).toBe("json trainer config extraction");
    expect(backlogItemKey("JSON trainer config extraction — now 12 cycles deferred")).toBe("json trainer config extraction");
    expect(backlogItemKey("Generator --force flag (C292)")).toBe("generator --force flag");
  });
});

describe("upsertBacklogItem", () => {
  let dir: string;
  let file: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "backlog-"));
    file = path.join(dir, "tech-debt-backlog.md");
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("creates the file with its header and appends a pending row", () => {
    upsertBacklogItem(file, HEADER, 305, "Palette helper: recolor CLI");
    expect(fs.readFileSync(file, "utf-8")).toBe(`${HEADER}| 305 | Palette helper: recolor CLI | pending |\n`);
  });

  it("updates the pending row with the same title instead of duplicating it", () => {
    fs.writeFileSync(file, `${HEADER}| 304 | JSON trainer config extraction: first pitch | pending |\n| 300 | Other: thing | done |\n`);
    upsertBacklogItem(file, HEADER, 307, "JSON trainer config extraction — now 3 cycles deferred");

    const content = fs.readFileSync(file, "utf-8");
    expect(content).toContain("| 304-307 | JSON trainer config extraction — now 3 cycles deferred | pending |");
    expect(content).not.toContain("first pitch");
    expect(content).toContain("| 300 | Other: thing | done |");
  });

  it("adds a new row when the matching item is already done", () => {
    fs.writeFileSync(file, `${HEADER}| 287 | Species verification script: shipped | done |\n`);
    upsertBacklogItem(file, HEADER, 308, "Species verification script: extend to learnsets");

    const content = fs.readFileSync(file, "utf-8");
    expect(content).toContain("| 287 | Species verification script: shipped | done |");
    expect(content).toContain("| 308 | Species verification script: extend to learnsets | pending |");
  });

  it("escapes pipes and newlines so the table stays intact", () => {
    upsertBacklogItem(file, HEADER, 310, "A | B\nC");
    expect(fs.readFileSync(file, "utf-8")).toContain("| 310 | A — B C | pending |");
  });
});
