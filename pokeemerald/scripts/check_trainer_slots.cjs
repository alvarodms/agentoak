#!/usr/bin/env node
'use strict';

// Trainer ID budget ledger (C327).
//
// TRAINERS_COUNT is capped by the trainer flag space (include/constants/opponents.h),
// so new trainers must reuse IDs that are never battled. This script finds them:
// every TRAINER_* define below TRAINERS_COUNT is counted by word-boundary
// references across src/, include/, data/ and asm/ (.c/.h/.inc/.s/.json), skipping
// opponents.h, trainers.h, trainer_parties.h, build/ and comment-only lines
// (first non-space chars `@` or `//`). IDs with zero references are printed as
// candidate free slots. Computed or offset IDs (e.g. `TRAINER_X + i`, rematch
// tables walked by index) are invisible to this scan, so verify each by hand.
//
// Fails (exit 1) when:
//   G1. opponents.h yields fewer than 100 IDs (parse failure);
//   G2. a RECLAIMED slot (an ID renamed for a new trainer) has no reference in
//       data/maps/**/scripts.inc, i.e. the slot was reclaimed but nothing battles it.
//
// Usage: node scripts/check_trainer_slots.cjs [--selftest]
//        (run by `make check_trainer_slots`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OPPONENTS_H = path.join(ROOT, 'include/constants/opponents.h');
const TRAINERS_H = path.join(ROOT, 'src/data/trainers.h');
const PARTIES_H = path.join(ROOT, 'src/data/trainer_parties.h');
const SCAN_DIRS = ['src', 'include', 'data', 'asm'].map((d) => path.join(ROOT, d));
const EXTENSIONS = new Set(['.c', '.h', '.inc', '.s', '.json']);
const EXCLUDE = new Set([OPPONENTS_H, TRAINERS_H, PARTIES_H]);
const SKIP_NAMES = new Set(['TRAINERS_COUNT', 'MAX_TRAINERS_COUNT', 'TRAINER_NONE']);

// IDs reclaimed from unused vanilla trainers; each must stay battled by a map script.
const RECLAIMED = ['TRAINER_JUAN_DUET', 'TRAINER_MAXIE_RECKONING', 'TRAINER_ARCHIE_RECKONING', 'TRAINER_PYRE_MOURNER', 'TRAINER_ROUTE119_STORM_CHASER'];

const DEFINE_RE = /^#define\s+(TRAINER_\w+)\s+(\d+)/;
const COUNT_RE = /^#define\s+TRAINERS_COUNT\s+(\d+)/m;
const ENTRY_RE = /^\s*\[(TRAINER_\w+)\]\s*=[^\n]*\n?\s*\{[^}]*?\.trainerName\s*=\s*_\("([^"]*)"\)/gm;
const TOKEN_RE = /\bTRAINER_\w+/g;
const COMMENT_LINE_RE = /^\s*(@|\/\/)/;

// opponents.h text -> [{ name, id }] sorted by id (trailing // comments ignored)
function parseIds(text) {
  const countMatch = text.match(COUNT_RE);
  const count = countMatch ? Number(countMatch[1]) : Infinity;
  const ids = [];
  for (const line of text.split('\n')) {
    const m = line.match(DEFINE_RE);
    if (!m || SKIP_NAMES.has(m[1])) continue;
    const id = Number(m[2]);
    if (id >= count) continue;
    ids.push({ name: m[1], id });
  }
  return ids.sort((a, b) => a.id - b.id);
}

// trainers.h text -> Map(name -> trainerName)
function parseNames(text) {
  const names = new Map();
  let m;
  ENTRY_RE.lastIndex = 0;
  while ((m = ENTRY_RE.exec(text)) !== null) names.set(m[1], m[2]);
  return names;
}

// Adds references to known IDs in one source text to counts (Map name -> n).
function countRefs(text, counts) {
  for (const line of text.split('\n')) {
    if (COMMENT_LINE_RE.test(line)) continue;
    const tokens = line.match(TOKEN_RE);
    if (!tokens) continue;
    for (const t of tokens) if (counts.has(t)) counts.set(t, counts.get(t) + 1);
  }
}

function newCounts(ids) {
  return new Map(ids.map((e) => [e.name, 0]));
}

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'build') walk(p, out);
    } else if (EXTENSIONS.has(path.extname(e.name)) && !EXCLUDE.has(p)) {
      out.push(p);
    }
  }
  return out;
}

function selftest() {
  const fail = (msg) => {
    console.error(`check_trainer_slots: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const opponents = [
    '#define TRAINER_NONE 0',
    '#define TRAINER_FAKE_USED 1',
    '#define TRAINER_FAKE_FREE 2  // C327: trailing comment',
    '#define TRAINER_FAKE_HIGH 9',
    '#define TRAINERS_COUNT 3  // Count of trainer IDs',
  ].join('\n');
  const trainers = [
    '    [TRAINER_FAKE_FREE] =  // comment',
    '    {',
    '        .trainerName = _("FREEBIE"),',
    '    },',
  ].join('\n');
  const source = [
    '\ttrainerbattle_single TRAINER_FAKE_USED, Text_Intro, Text_Defeat',
    '@ TRAINER_FAKE_FREE only in an asm comment',
    '    // TRAINER_FAKE_FREE only in a C comment',
    '\t.2byte TRAINER_FAKE_FREEDOM',
  ].join('\n');

  const ids = parseIds(opponents);
  const names = ids.map((e) => e.name).join(',');
  if (names !== 'TRAINER_FAKE_USED,TRAINER_FAKE_FREE') fail(`parsed IDs ${names}`);
  const trainerNames = parseNames(trainers);
  if (trainerNames.get('TRAINER_FAKE_FREE') !== 'FREEBIE') fail('[TRAINER_X] =  // comment entry did not parse');
  const counts = newCounts(ids);
  countRefs(source, counts);
  const free = ids.filter((e) => counts.get(e.name) === 0).map((e) => e.name);
  if (!free.includes('TRAINER_FAKE_FREE')) fail('unreferenced TRAINER_FAKE_FREE not reported');
  if (free.includes('TRAINER_FAKE_USED')) fail('referenced TRAINER_FAKE_USED reported as free');
  console.log('check_trainer_slots: selftest ok');
}

function main() {
  const ids = parseIds(fs.readFileSync(OPPONENTS_H, 'utf8'));
  if (ids.length < 100) {
    console.error(`check_trainer_slots: parse failure (${ids.length} IDs in ${path.relative(ROOT, OPPONENTS_H)})`);
    process.exit(1);
  }
  const trainerNames = parseNames(fs.readFileSync(TRAINERS_H, 'utf8'));

  const counts = newCounts(ids);
  const reclaimedCounts = new Map(RECLAIMED.map((n) => [n, 0]));
  const mapsDir = path.join(ROOT, 'data/maps') + path.sep;
  let files = 0;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir, [])) {
      const text = fs.readFileSync(file, 'utf8');
      files++;
      countRefs(text, counts);
      if (file.startsWith(mapsDir) && path.basename(file) === 'scripts.inc') countRefs(text, reclaimedCounts);
    }
  }

  const free = ids.filter((e) => counts.get(e.name) === 0);
  console.log('ID   NAME                                 trainers.h name');
  for (const e of free) {
    console.log(`${String(e.id).padEnd(4)} ${e.name.padEnd(36)} ${trainerNames.get(e.name) ?? '-'}`);
  }
  console.log(`${free.length} candidate free slots (verify each by hand: computed/offset IDs are invisible to this scan)`);
  console.log(`${ids.length} trainer IDs scanned across ${files} files`);

  const errors = [];
  for (const name of RECLAIMED) {
    if (!counts.has(name)) errors.push(`reclaimed slot ${name} is not defined in opponents.h`);
    else if (reclaimedCounts.get(name) === 0) errors.push(`reclaimed slot ${name} has no script reference`);
  }
  if (errors.length) {
    console.error(`check_trainer_slots: ${errors.length} failure(s):`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(`check_trainer_slots: OK (${RECLAIMED.length} reclaimed slots battled in map scripts)`);
}

if (process.argv.includes('--selftest')) selftest();
else main();
