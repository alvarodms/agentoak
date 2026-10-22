import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { beginGameTree } from "./game-tree.js";

// A throwaway repo shaped like the real one: a game tree under pokeemerald/
// whose Makefile fails while a file named `broken` exists.
// Every build appends a line to builds.log, which the game tree ignores.
const MAKEFILE = [
  "all:",
  "\t@echo built >> builds.log",
  "\t@if [ -e broken ]; then echo 'src/broken.c:1:1: error: broken' >&2; exit 1; fi",
  "",
].join("\n");

let repo: string;

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: repo, encoding: "utf-8" });
}

function write(rel: string, content = "x\n"): void {
  const file = path.join(repo, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function exists(rel: string): boolean {
  return fs.existsSync(path.join(repo, rel));
}

function read(rel: string): string {
  return fs.readFileSync(path.join(repo, rel), "utf-8");
}

function remove(rel: string): void {
  fs.rmSync(path.join(repo, rel));
}

function buildCount(): number {
  return exists("pokeemerald/builds.log") ? read("pokeemerald/builds.log").trim().split("\n").length : 0;
}

/** A fixer that records each call and, from the given attempt on, repairs the build. */
function fixerThatRepairsOnAttempt(attempt: number) {
  const calls: { errors: string[]; attempt: number }[] = [];
  const fixer = async (failure: { errors: string[]; stderr: string; attempt: number }) => {
    calls.push({ errors: failure.errors, attempt: failure.attempt });
    if (failure.attempt >= attempt) remove("pokeemerald/broken");
  };
  return { fixer, calls };
}

const neverFixes = () => fixerThatRepairsOnAttempt(Infinity);

beforeEach(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), "game-tree-"));
  git("init", "-q", "-b", "main");
  git("config", "user.name", "Test");
  git("config", "user.email", "test@example.com");
  write("pokeemerald/Makefile", MAKEFILE);
  write("pokeemerald/.gitignore", "*.4bpp\n*.log\n");
  write("pokeemerald/src/main.c", "int main;\n");
  write("memory/notes.md", "notes\n");
  git("add", "-A");
  git("commit", "-q", "-m", "baseline");
});

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

const begin = () => beginGameTree({ repoRoot: repo, label: "cycle 0001" });

describe("beginning a cycle", () => {
  it("sets aside leftovers so the cycle starts from the baseline", async () => {
    write("pokeemerald/src/main.c", "int leftover;\n");
    write("pokeemerald/src/new.c");

    const tree = await begin();

    expect(tree.setAside.sort()).toEqual(["pokeemerald/src/main.c", "pokeemerald/src/new.c"]);
    expect(read("pokeemerald/src/main.c")).toBe("int main;\n");
    expect(exists("pokeemerald/src/new.c")).toBe(false);
    expect(git("stash", "list")).toContain("cycle 0001");
  });

  it("sets nothing aside when the game tree is clean", async () => {
    write("memory/notes.md", "edited outside the game tree\n");

    const tree = await begin();

    expect(tree.setAside).toEqual([]);
    expect(git("stash", "list")).toBe("");
    expect(read("memory/notes.md")).toBe("edited outside the game tree\n");
  });
});

describe("the change set", () => {
  it("is what git sees changed under the game tree, measured from the baseline", async () => {
    const tree = await begin();
    write("pokeemerald/src/main.c", "int main = 1;\n");
    write("pokeemerald/src/added.c", "int added;\n");
    write("pokeemerald/graphics/front.4bpp", "ignored build output");
    write("memory/notes.md", "outside the game tree\n");

    const changes = await tree.changeSet();

    expect(changes.files).toEqual(["pokeemerald/src/added.c", "pokeemerald/src/main.c"]);
    expect(changes.stats.filesChanged).toBe(2);
    expect(changes.stats.insertions).toBe(2);
    expect(changes.stats.deletions).toBe(1);
  });

  it("includes deleted files", async () => {
    const tree = await begin();
    remove("pokeemerald/src/main.c");

    expect((await tree.changeSet()).files).toEqual(["pokeemerald/src/main.c"]);
  });

  it("is empty when nothing changed", async () => {
    const tree = await begin();

    const changes = await tree.changeSet();

    expect(changes.files).toEqual([]);
    expect(changes.stats.filesChanged).toBe(0);
  });
});

describe("verifying the game tree", () => {
  it("does not build when nothing changed", async () => {
    const tree = await begin();
    const { fixer, calls } = neverFixes();

    const outcome = await tree.verify(fixer);

    expect(outcome.status).toBe("unchanged");
    expect(buildCount()).toBe(0);
    expect(calls).toEqual([]);
  });

  it("verifies a change set that builds", async () => {
    const tree = await begin();
    write("pokeemerald/src/added.c");
    const { fixer, calls } = neverFixes();

    const outcome = await tree.verify(fixer);

    expect(outcome).toMatchObject({ status: "verified", fixAttempts: 0 });
    expect(buildCount()).toBe(1);
    expect(calls).toEqual([]);
  });

  it("hands build errors to the fixer until the build passes", async () => {
    const tree = await begin();
    write("pokeemerald/broken");
    const { fixer, calls } = fixerThatRepairsOnAttempt(2);

    const outcome = await tree.verify(fixer);

    expect(outcome).toMatchObject({ status: "verified", fixAttempts: 2 });
    expect(calls.map((c) => c.attempt)).toEqual([1, 2]);
    expect(calls[0].errors).toContain("src/broken.c:1:1: error: broken");
    expect(buildCount()).toBe(3);
  });

  it("rolls back to the baseline when the build can't be fixed", async () => {
    const tree = await begin();
    write("pokeemerald/broken");
    write("pokeemerald/src/main.c", "int main = 1;\n");
    write("pokeemerald/src/added.c");
    const { fixer, calls } = neverFixes();

    const outcome = await tree.verify(fixer);

    expect(outcome).toMatchObject({ status: "failed", rolledBackTo: "baseline" });
    expect(calls).toHaveLength(3);
    expect(read("pokeemerald/src/main.c")).toBe("int main;\n");
    expect(exists("pokeemerald/src/added.c")).toBe(false);
    expect(exists("pokeemerald/broken")).toBe(false);
    expect((await tree.changeSet()).files).toEqual([]);
  });

  it("rolls back to the last verified change set when a later change can't be fixed", async () => {
    const tree = await begin();
    write("pokeemerald/src/good.c");
    await tree.verify(neverFixes().fixer);
    write("pokeemerald/broken");
    write("pokeemerald/src/good.c", "changed after verification\n");

    const outcome = await tree.verify(neverFixes().fixer);

    expect(outcome).toMatchObject({ status: "failed", rolledBackTo: "verified" });
    expect(read("pokeemerald/src/good.c")).toBe("x\n");
    expect(exists("pokeemerald/broken")).toBe(false);
    expect((await tree.changeSet()).files).toEqual(["pokeemerald/src/good.c"]);
  });

  it("does not rebuild when nothing changed since the last verification", async () => {
    const tree = await begin();
    write("pokeemerald/src/added.c");
    await tree.verify(neverFixes().fixer);

    const outcome = await tree.verify(neverFixes().fixer);

    expect(outcome.status).toBe("unchanged");
    expect(buildCount()).toBe(1);
  });
});

describe("staging the cycle's game-tree changes", () => {
  const staged = () => git("diff", "--cached", "--name-only").split("\n").filter(Boolean);

  it("stages exactly the verified change set and discards later edits", async () => {
    const tree = await begin();
    write("pokeemerald/src/added.c");
    await tree.verify(neverFixes().fixer);
    write("pokeemerald/src/main.c", "edited during reflection\n");
    write("pokeemerald/src/late.c");

    const result = await tree.stage();

    expect(result.staged).toEqual(["pokeemerald/src/added.c"]);
    expect(result.discarded).toEqual(["pokeemerald/src/late.c", "pokeemerald/src/main.c"]);
    expect(staged()).toEqual(["pokeemerald/src/added.c"]);
    expect(read("pokeemerald/src/main.c")).toBe("int main;\n");
    expect(exists("pokeemerald/src/late.c")).toBe(false);
  });

  it("stages nothing from the game tree when nothing was verified", async () => {
    const tree = await begin();
    write("pokeemerald/src/unbuilt.c");

    const result = await tree.stage();

    expect(result).toEqual({ staged: [], discarded: ["pokeemerald/src/unbuilt.c"] });
    expect(staged()).toEqual([]);
    expect(exists("pokeemerald/src/unbuilt.c")).toBe(false);
  });

  it("leaves files outside the game tree alone", async () => {
    const tree = await begin();
    write("memory/notes.md", "reflection notes\n");

    await tree.stage();

    expect(staged()).toEqual([]);
    expect(read("memory/notes.md")).toBe("reflection notes\n");
  });
});

describe("discarding the cycle", () => {
  it("rolls back to the baseline even after a verified change set", async () => {
    const tree = await begin();
    write("pokeemerald/src/added.c");
    await tree.verify(neverFixes().fixer);

    await tree.discard();

    expect(exists("pokeemerald/src/added.c")).toBe(false);
    expect((await tree.changeSet()).files).toEqual([]);
  });
});
