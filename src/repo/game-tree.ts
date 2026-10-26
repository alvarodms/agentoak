import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { simpleGit, type SimpleGit } from "simple-git";
import { logger } from "../utils/logger.js";
import { runBuild, type BuildResult } from "./build.js";

const MAX_FIX_ATTEMPTS = 3;

/**
 * The game tree (`pokeemerald/`) as one cycle works on it.
 *
 * Owns the cycle's baseline and change set, and how both are measured. See
 * GLOSSARY.md for the terms and docs/adr/0001 for why a cycle commits only
 * its verified change set.
 */
export interface GameTree {
  /** Leftover game-tree paths stashed away before the cycle began. */
  readonly setAside: string[];
  /** Everything in the game tree that differs from the baseline, as git sees it. */
  changeSet(): Promise<ChangeSet>;
  /**
   * Build the game tree. On failure, hand the errors to the fixer and rebuild,
   * up to 3 times. If it still fails, roll back to the last verified change
   * set (or the baseline). Skips the build when nothing changed since the
   * last verification.
   */
  verify(fixer: BuildFixer): Promise<VerifyOutcome>;
  /**
   * Restore the game tree to the verified change set (or the baseline, if
   * nothing was verified) and stage it in the real index. Edits made after
   * verification are discarded and listed.
   */
  stage(): Promise<{ staged: string[]; discarded: string[] }>;
  /** Roll the game tree back to the baseline, verified or not. For crashed cycles. */
  discard(): Promise<void>;
}

/** Tries to repair a failed build by editing the game tree. */
export type BuildFixer = (failure: { errors: string[]; stderr: string; attempt: number }) => Promise<void>;

export type VerifyOutcome =
  | { status: "unchanged" }
  | { status: "verified"; build: BuildResult; fixAttempts: number }
  | { status: "failed"; build: BuildResult; fixAttempts: number; rolledBackTo: "verified" | "baseline" };

export interface ChangeSet {
  /** Repo-relative paths: edited, added and deleted files. Ignored files never appear. */
  files: string[];
  stats: DiffStats;
}

export interface DiffStats {
  filesChanged: number;
  insertions: number;
  deletions: number;
  /** `git diff --stat` text, for prompts and journals. */
  summary: string;
}

export async function beginGameTree(options: {
  repoRoot: string;
  gameDir?: string;
  /** Names the stash that holds leftovers, e.g. "cycle 0042". */
  label: string;
}): Promise<GameTree> {
  const gameDir = options.gameDir ?? "pokeemerald";
  const git = simpleGit(options.repoRoot);
  const root = (await git.revparse(["--show-toplevel"])).trim();
  const baseline = (await git.revparse(["HEAD"])).trim();
  /** Snapshot of the game tree when it last built, if it ever has this cycle. */
  let verified: string | null = null;

  const setAside = await changedPaths(git, baseline, await snapshot(git, gameDir), gameDir);
  if (setAside.length > 0) {
    await git.raw([
      "stash", "push", "--include-untracked",
      "-m", `agent-oak: leftovers before ${options.label}`,
      "--", gameDir,
    ]);
    logger.warn(`Game tree: set aside ${setAside.length} leftover path(s) in a git stash before ${options.label}`);
  }

  return {
    setAside,
    async changeSet() {
      const current = await snapshot(git, gameDir);
      return {
        files: await changedPaths(git, baseline, current, gameDir),
        stats: await diffStats(git, baseline, current, gameDir),
      };
    },

    async verify(fixer) {
      const lastGood = verified ?? baseline;
      if ((await changedPaths(git, lastGood, await snapshot(git, gameDir), gameDir)).length === 0) {
        return { status: "unchanged" };
      }

      const buildDir = path.join(root, gameDir);
      let build = await runBuild(buildDir);
      let fixAttempts = 0;
      while (!build.success && fixAttempts < MAX_FIX_ATTEMPTS) {
        fixAttempts++;
        await fixer({ errors: build.errors, stderr: build.stderr, attempt: fixAttempts });
        build = await runBuild(buildDir);
      }

      if (build.success) {
        verified = await snapshot(git, gameDir);
        return { status: "verified", build, fixAttempts };
      }

      await restore(git, root, lastGood, gameDir);
      return { status: "failed", build, fixAttempts, rolledBackTo: verified ? "verified" : "baseline" };
    },

    async stage() {
      const target = verified ?? baseline;
      const discarded = await changedPaths(git, target, await snapshot(git, gameDir), gameDir);
      if (discarded.length > 0) {
        await restore(git, root, target, gameDir);
        logger.warn(`Game tree: discarded ${discarded.length} unverified change(s): ${discarded.join(", ")}`);
      }
      await git.raw(["add", "--all", "--", gameDir]);
      return { staged: await changedPaths(git, baseline, target, gameDir), discarded };
    },

    async discard() {
      await restore(git, root, baseline, gameDir);
      verified = null;
    },
  };
}

/**
 * Tree object for the working state of the game tree, untracked files
 * included and ignored files excluded. Built in a throwaway copy of the
 * index so the real index is never touched.
 */
async function snapshot(git: SimpleGit, gameDir: string): Promise<string> {
  const root = (await git.revparse(["--show-toplevel"])).trim();
  const realIndex = path.resolve(root, (await git.revparse(["--git-path", "index"])).trim());
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "game-tree-index-"));
  const tmpIndex = path.join(tmpDir, "index");
  try {
    // Copying the real index keeps git's stat cache, so unchanged files aren't re-hashed.
    if (fs.existsSync(realIndex)) fs.copyFileSync(realIndex, tmpIndex);
    // A separate instance: simple-git's env() sticks to the instance it is called on.
    const scoped = simpleGit(root).env({ ...process.env, GIT_INDEX_FILE: tmpIndex });
    await scoped.raw(["add", "--all", "--", gameDir]);
    return (await scoped.raw(["write-tree"])).trim();
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/**
 * Make the game tree match a snapshot (or commit): files added since are
 * deleted, everything else is checked out. Ignored files are left alone.
 */
async function restore(git: SimpleGit, root: string, target: string, gameDir: string): Promise<void> {
  const added = await git.raw([
    "diff", "--name-only", "--no-renames", "--diff-filter=A",
    target, await snapshot(git, gameDir), "--", gameDir,
  ]);
  for (const file of added.split("\n").filter((line) => line.length > 0)) {
    fs.rmSync(path.join(root, file), { force: true });
  }
  await git.raw(["checkout", target, "--", gameDir]);
  // checkout also staged the target; leave the real index as HEAD has it.
  await git.raw(["reset", "-q", "HEAD", "--", gameDir]);
}

async function changedPaths(git: SimpleGit, from: string, to: string, gameDir: string): Promise<string[]> {
  const out = await git.raw(["diff", "--name-only", "--no-renames", from, to, "--", gameDir]);
  return out.split("\n").filter((line) => line.length > 0);
}

async function diffStats(git: SimpleGit, from: string, to: string, gameDir: string): Promise<DiffStats> {
  const stat = (await git.raw(["diff", "--stat", "--no-renames", from, to, "--", gameDir])).trim();
  const totals = stat.split("\n").at(-1) ?? "";
  const count = (pattern: RegExp) => Number(totals.match(pattern)?.[1] ?? 0);
  return {
    filesChanged: count(/(\d+) files? changed/),
    insertions: count(/(\d+) insertions?\(\+\)/),
    deletions: count(/(\d+) deletions?\(-\)/),
    summary: stat || `No changes in ${gameDir}/`,
  };
}
