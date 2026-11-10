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

import fs from "node:fs";
import path from "node:path";
import { ARTIFACTS_DIR, POKEEMERALD_DIR } from "../utils/paths.js";
import { loadPlaytests, runPlaytest, type PlaytestResult } from "./playtest.js";
import { defaultBuild } from "./session.js";
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
      `- **Failed at:** ${r.failedStep === -1 ? "boot" : `step ${r.failedStep}`}`,
      `- **Error:** ${r.error}`,
    );
    if (r.transcripts.length) {
      lines.push("", "Dialogue seen:", "", "```text", ...r.transcripts.flat().map((t) => t.replace(/\n/g, " / ")), "```");
    }
  }
  return lines.join("\n") + "\n";
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let filter: string | undefined;
  const inputs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--filter") filter = args[++i];
    else inputs.push(args[i]);
  }

  const tests = loadPlaytests(inputs.length ? inputs : [PLAYTESTS_DIR]).filter(
    ({ test }) => !filter || test.name.includes(filter),
  );
  if (tests.length === 0) {
    console.log("No playtests to run.");
    return;
  }

  const build = defaultBuild();
  const symbols = SymbolTable.load(build.elf, build.map);
  fs.rmSync(PLAYTEST_OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(PLAYTEST_OUT_DIR, { recursive: true });

  const results: PlaytestResult[] = [];
  for (const { file, test } of tests) {
    const result = await runPlaytest(test, build, { symbols, outDir: path.join(PLAYTEST_OUT_DIR, test.name) });
    result.file = path.relative(process.cwd(), file);
    results.push(result);
    const where = result.passed ? "" : ` — step ${result.failedStep}: ${result.error}`;
    console.log(`${result.passed ? "✓" : "✗"} ${test.name} (${result.frames} frames, ${result.ms} ms)${where}`);
  }

  fs.writeFileSync(path.join(PLAYTEST_OUT_DIR, "report.json"), JSON.stringify(results, null, 2));
  fs.writeFileSync(path.join(PLAYTEST_OUT_DIR, "report.md"), formatReport(results));
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
