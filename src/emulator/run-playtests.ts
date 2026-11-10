/**
 * Replays scripted playtests against the built ROM.
 *
 *   npm run playtest                          # every file in pokeemerald/playtests/
 *   npm run playtest -- path/a.json dir/      # chosen files or directories
 *   npm run playtest -- --filter skeptic      # names containing "skeptic"
 *
 * Needs a built ROM (make in pokeemerald/) and mgba-driver (on PATH in the
 * runner image, or MGBA_DRIVER=...). Writes report.md, report.json and
 * per-test screenshots to artifacts/playtests/ (gitignored; CI uploads it as
 * a short-lived artifact). Exits 1 if any playtest failed.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ARTIFACTS_DIR, POKEEMERALD_DIR } from "../utils/paths.js";
import { loadPlaytestFiles, runPlaytest, type PlaytestResult } from "./playtest.js";
import { driverBinary } from "./driver.js";
import { defaultBuild, type RomBuild } from "./session.js";
import { SymbolTable } from "./symbols.js";

export const PLAYTESTS_DIR = path.join(POKEEMERALD_DIR, "playtests");
export const PLAYTEST_OUT_DIR = path.join(ARTIFACTS_DIR, "playtests");

export function formatReport(results: PlaytestResult[]): string {
  const failed = results.filter((r) => !r.passed);
  const lines = [
    `# Playtest report`,
    "",
    `${results.length - failed.length}/${results.length} passed.`,
    "",
    "| | Playtest | Checks | Frames |",
    "|---|---|---|---|",
    ...results.map((r) => `| ${r.passed ? "✅" : "❌"} | \`${r.name}\` | ${r.checks.replace(/\|/g, "\\|")} | ${r.frames} |`),
  ];
  for (const r of failed) {
    lines.push(
      "",
      `## ❌ ${r.name}`,
      "",
      `- **Checks:** ${r.checks}`,
      `- **File:** \`${r.file ?? "?"}\``,
      `- **Failed at:** ${r.failedStep === -1 ? "before the first step (boot or invalid file)" : `step ${r.failedStep}`}`,
      `- **Error:** ${r.error}`,
    );
    if (r.transcripts.length) {
      lines.push("", "Dialogue seen:", "", "```text", ...r.transcripts.flat().map((t) => t.replace(/\n/g, " / ")), "```");
    }
  }
  return lines.join("\n") + "\n";
}

/** Problems that stop every playtest, phrased as what to do about them. */
export function preflight(build: RomBuild, driver = driverBinary()): string[] {
  const problems: string[] = [];
  const missing = [build.rom, build.elf, build.map].filter((f) => !fs.existsSync(f));
  if (missing.length) {
    problems.push(
      `No built ROM (missing ${missing.map((f) => path.basename(f)).join(", ")}). ` +
        `Build first: (cd pokeemerald && make -j"$(nproc)")`,
    );
  }
  try {
    execFileSync(driver, [], { input: "quit\n", stdio: ["pipe", "ignore", "ignore"], timeout: 5000 });
  } catch {
    problems.push(`The emulator (${driver}) is not available. It is built into the runner image; locally set MGBA_DRIVER.`);
  }
  return problems;
}

export interface SuiteOptions {
  /** Files or directories. Default: pokeemerald/playtests/. */
  inputs?: string[];
  /** Only playtests whose name contains this. */
  filter?: string;
  outDir?: string;
  build?: RomBuild;
  /** Called as each playtest finishes. */
  onResult?: (result: PlaytestResult) => void;
}

export interface SuiteRun {
  /** Empty when nothing stopped the run. */
  problems: string[];
  results: PlaytestResult[];
}

/**
 * Runs playtests and writes report.md, report.json and screenshots to
 * `outDir`. An invalid playtest file counts as a failed playtest. Problems
 * that stop every playtest (no ROM, no emulator) come back in `problems`.
 */
export async function runSuite(opts: SuiteOptions = {}): Promise<SuiteRun> {
  const outDir = opts.outDir ?? PLAYTEST_OUT_DIR;
  const loaded = loadPlaytestFiles(opts.inputs?.length ? opts.inputs : [PLAYTESTS_DIR]).filter(
    (p) => !opts.filter || p.name.includes(opts.filter),
  );
  if (loaded.length === 0) return { problems: [], results: [] };

  const build = opts.build ?? defaultBuild();
  const problems = preflight(build);
  if (problems.length) return { problems, results: [] };

  const symbols = SymbolTable.load(build.elf, build.map);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const results: PlaytestResult[] = [];
  for (const { file, name, test, error } of loaded) {
    const result: PlaytestResult = test
      ? await runPlaytest(test, build, { symbols, outDir: path.join(outDir, test.name) })
      : { name, checks: "(invalid playtest file)", passed: false, failedStep: -1, error, transcripts: [], screenshots: [], frames: 0, ms: 0 };
    result.file = path.relative(process.cwd(), file);
    results.push(result);
    opts.onResult?.(result);
  }

  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(results, null, 2));
  fs.writeFileSync(path.join(outDir, "report.md"), formatReport(results));
  return { problems: [], results };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let filter: string | undefined;
  const inputs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--filter") filter = args[++i];
    else inputs.push(args[i]);
  }

  const { problems, results } = await runSuite({
    inputs,
    filter,
    onResult: (r) => {
      const where = r.passed ? "" : ` — step ${r.failedStep}: ${r.error}`;
      console.log(`${r.passed ? "✓" : "✗"} ${r.name} (${r.frames} frames, ${r.ms} ms)${where}`);
    },
  });
  if (problems.length) {
    for (const p of problems) console.error(p);
    process.exitCode = 2;
    return;
  }
  if (results.length === 0) {
    console.log("No playtests to run.");
    return;
  }
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n${results.length - failed}/${results.length} passed. Report: ${path.relative(process.cwd(), PLAYTEST_OUT_DIR)}/report.md`);
  process.exitCode = failed ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 2;
  });
}
