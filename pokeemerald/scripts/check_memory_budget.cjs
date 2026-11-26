#!/usr/bin/env node
'use strict';

// Memory budget report (C400, report-only, NOT in check_all).
//
// Memory files describe current state and carry line budgets (strategy-notes
// "Keep under ~200 lines", the tenth-cycle tidy caps). Every tidy so far found
// the overruns by hand. This report lists them from memory/memory-budgets.json:
//   OVER  <file> <lines>/<cap>        file longer than its cap (files{} or globs{})
//   LONG  <file>:<line> <n> words     one line/bullet/table row over maxBulletWords
//                                     (artifact comments not counted)
//   STALE <file>:<line> verified C<n> a "verified C<n>" stamp older than
//                                     (current cycle - staleVerifiedCycles)
// LONG and STALE only scan files that have a cap; archives (`exempt`) are skipped.
// Current cycle = --cycle N, else the highest DONE row in the strategy-notes
// roadmap table (planned rows run ahead of the real cycle), else its highest row.
//
// Always exits 0 on a real run. `--selftest` exits 1 if an assertion fails.
//
// Usage: node scripts/check_memory_budget.cjs [--selftest] [--cycle N]
//        (run by `make report_memory_budget`)

const fs = require('fs');
const path = require('path');

const MEMORY = path.resolve(__dirname, '../../memory');
const CONFIG = path.join(MEMORY, 'memory-budgets.json');

// 'pokemon-knowledge/*.md' -> RegExp over memory-relative paths ('*' = no '/')
function globToRegExp(glob) {
  const body = glob.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*');
  return new RegExp(`^${body}$`);
}

function lineCount(text) {
  if (text === '') return 0;
  const n = text.split('\n').length;
  return text.endsWith('\n') ? n - 1 : n;
}

function wordCount(line) {
  return line.replace(/<!--[\s\S]*?-->/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

// name -> cap or null (exempt or unbudgeted)
function capFor(name, config) {
  // exempt globs match the memory-relative path or the basename (*-archive.md in any folder)
  if ((config.exempt || []).some((g) => globToRegExp(g).test(name) || globToRegExp(g).test(path.basename(name)))) return null;
  if (config.files && Object.prototype.hasOwnProperty.call(config.files, name)) return config.files[name];
  for (const [glob, cap] of Object.entries(config.globs || {})) {
    if (globToRegExp(glob).test(name)) return cap;
  }
  return null;
}

// strategy-notes text -> current cycle (highest DONE roadmap row, else highest row) or null
function roadmapCycle(text) {
  const at = text.indexOf('## Roadmap');
  if (at < 0) return null;
  let done = null;
  let any = null;
  for (const line of text.slice(at).split('\n')) {
    const m = line.match(/^\|\s*(\d+)(?:\s*-\s*(\d+))?\s*\|/);
    if (!m) continue;
    const n = Math.max(Number(m[1]), m[2] ? Number(m[2]) : 0);
    any = any === null ? n : Math.max(any, n);
    if (/\bDONE\b/.test(line)) done = done === null ? n : Math.max(done, n);
  }
  return done !== null ? done : any;
}

// Pure. files [{ name (memory-relative), text }], config (memory-budgets.json
// shape plus `cycle`) -> findings [{ kind, file, line?, text }]
function check(files, config) {
  const findings = [];
  const maxWords = config.maxBulletWords || Infinity;
  const staleBefore = config.cycle && config.staleVerifiedCycles ? config.cycle - config.staleVerifiedCycles : null;
  for (const { name, text } of files) {
    const cap = capFor(name, config);
    if (cap === null) continue;
    const n = lineCount(text);
    if (n > cap) findings.push({ kind: 'OVER', file: name, text: `OVER ${name} ${n}/${cap}` });
    text.split('\n').forEach((line, i) => {
      const words = wordCount(line);
      if (words > maxWords) findings.push({ kind: 'LONG', file: name, line: i + 1, text: `LONG ${name}:${i + 1} ${words} words` });
      if (staleBefore === null) return;
      for (const m of line.matchAll(/\bverified C(\d+)/gi)) {
        if (Number(m[1]) < staleBefore) findings.push({ kind: 'STALE', file: name, line: i + 1, text: `STALE ${name}:${i + 1} verified C${m[1]}` });
      }
    });
  }
  return findings;
}

function summary(findings, cycle, fileCount) {
  const count = (k) => findings.filter((f) => f.kind === k).length;
  return `report_memory_budget: cycle ${cycle}, ${fileCount} budgeted files, ${count('OVER')} OVER, ${count('LONG')} LONG, ${count('STALE')} STALE (report-only)`;
}

// ---------- selftest ----------

function selftest() {
  let passed = 0;
  let total = 0;
  const expect = (label, ok) => {
    total++;
    if (ok) passed++;
    else console.error(`check_memory_budget selftest FAILED: ${label}`);
  };
  const config = { files: { 'notes.md': 2 }, globs: { 'topic/*.md': 5 }, exempt: ['*-archive.md'], maxBulletWords: 120, staleVerifiedCycles: 30, cycle: 400 };
  const words = (n) => Array.from({ length: n }, () => 'word').join(' ');

  const dirty = check([
    { name: 'notes.md', text: 'one\ntwo\nthree\n' },
    { name: 'topic/a.md', text: `- ${words(130)}\n` },
    { name: 'topic/b.md', text: 'Flag pool (verified C100).\n' },
  ], config);
  expect('3-line file over cap 2 is OVER', dirty.some((f) => f.text === 'OVER notes.md 3/2'));
  expect('130-word bullet is LONG', dirty.some((f) => f.kind === 'LONG' && f.file === 'topic/a.md' && f.line === 1));
  expect('verified C100 at cycle 400 is STALE', dirty.some((f) => f.text === 'STALE topic/b.md:1 verified C100'));
  expect('exactly 3 findings', dirty.length === 3);

  const clean = check([
    { name: 'notes.md', text: 'one\ntwo\n' },
    { name: 'topic/a.md', text: `- ${words(119)} <!-- artifact: ${words(20)} -->\n` },
    { name: 'topic/b.md', text: 'Flag pool (verified C370).\n' },
    { name: 'topic/big-archive.md', text: `${words(200)}\n`.repeat(10) },
    { name: 'unbudgeted.md', text: 'x\n'.repeat(500) },
  ], config);
  expect('clean fixture yields 0 findings', clean.length === 0);
  expect('roadmap cycle = highest DONE row', roadmapCycle('## Roadmap\n| 389-395 | **DONE** |\n| 400 | **DONE** x |\n| 401 | next | — |\n') === 400);

  console.log(`check_memory_budget selftest: ${passed}/${total}`);
  if (passed !== total) process.exit(1);
}

// ---------- real run ----------

function walkMd(dir, rel = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...walkMd(path.join(dir, e.name), r));
    else if (e.name.endsWith('.md')) out.push(r);
  }
  return out.sort();
}

function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  const argAt = process.argv.indexOf('--cycle');
  const strategy = path.join(MEMORY, 'strategy-notes.md');
  const cycle = argAt > 0 ? Number(process.argv[argAt + 1])
    : (fs.existsSync(strategy) ? roadmapCycle(fs.readFileSync(strategy, 'utf8')) : null);
  const files = walkMd(MEMORY).map((name) => ({ name, text: fs.readFileSync(path.join(MEMORY, name), 'utf8') }));
  const findings = check(files, { ...config, cycle });
  for (const f of findings) console.log(f.text);
  console.log(summary(findings, cycle, files.filter((f) => capFor(f.name, config) !== null).length));
}

module.exports = { check, capFor, roadmapCycle, lineCount, wordCount, globToRegExp };

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
