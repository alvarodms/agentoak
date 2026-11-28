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
// candidate free slots, except DATA_ONLY link-battle placeholders, which are listed
// separately and never renamed (C385). Computed or offset IDs (e.g. `TRAINER_X + i`, rematch
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
const RECLAIMED = ['TRAINER_JUAN_DUET', 'TRAINER_MAXIE_RECKONING', 'TRAINER_ARCHIE_RECKONING', 'TRAINER_PYRE_MOURNER', 'TRAINER_ROUTE119_STORM_CHASER', 'TRAINER_ROUTE113_ASH_CAMPER', 'TRAINER_ROUTE109_STORM_WATCHER', 'TRAINER_MAUVILLE_GYM_HOPEFUL', 'TRAINER_FORTREE_CHARM_KEEPER', 'TRAINER_MOSSDEEP_CHARM_GRUNT'];  // C368: 462 ex-KAYLEE (v3.4 Beat 1 TOBY); C369: 485 ex-AMY_AND_LIV_3 (v3.4 Beat 2 DAX); C375: 486 ex-GINA_AND_MIA_2 (v3.5 Beat 2 WREN)

// Link-battle placeholders (pret wiki 'Repurposing the Link Battle placeholders'):
// keep the define and party names, edit data only. Never rename (C385).
const DATA_ONLY = /^TRAINER_(\w+_PLACEHOLDER|RED|LEAF)$/;

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

// Unreferenced IDs split into renamable free slots and DATA_ONLY placeholders.
function splitUnreferenced(ids, counts) {
  const unused = ids.filter((e) => counts.get(e.name) === 0);
  return {
    free: unused.filter((e) => !DATA_ONLY.test(e.name)),
    dataOnly: unused.filter((e) => DATA_ONLY.test(e.name)),
  };
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
    '#define TRAINER_FAKE_PLACEHOLDER 3',
    '#define TRAINER_FAKE_HIGH 9',
    '#define TRAINERS_COUNT 4  // Count of trainer IDs',
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
  if (names !== 'TRAINER_FAKE_USED,TRAINER_FAKE_FREE,TRAINER_FAKE_PLACEHOLDER') fail(`parsed IDs ${names}`);
  const trainerNames = parseNames(trainers);
  if (trainerNames.get('TRAINER_FAKE_FREE') !== 'FREEBIE') fail('[TRAINER_X] =  // comment entry did not parse');
  const counts = newCounts(ids);
  countRefs(source, counts);
  const { free: freeIds, dataOnly } = splitUnreferenced(ids, counts);
  const free = freeIds.map((e) => e.name);
  if (free.includes('TRAINER_FAKE_PLACEHOLDER')) fail('TRAINER_FAKE_PLACEHOLDER counted as a free slot');
  if (!dataOnly.some((e) => e.name === 'TRAINER_FAKE_PLACEHOLDER')) fail('TRAINER_FAKE_PLACEHOLDER not listed as data-only');
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

  const { free, dataOnly } = splitUnreferenced(ids, counts);
  const row = (e) => `${String(e.id).padEnd(4)} ${e.name.padEnd(36)} ${trainerNames.get(e.name) ?? '-'}`;
  console.log('ID   NAME                                 trainers.h name');
  for (const e of free) console.log(row(e));
  console.log(`${free.length} candidate free slots (verify each by hand: computed/offset IDs are invisible to this scan)`);
  if (dataOnly.length) {
    console.log('data-only placeholder slots (do not rename):');
    for (const e of dataOnly) console.log(row(e));
  }
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

module.exports = { DATA_ONLY, parseIds, parseNames, countRefs, newCounts, walk, SCAN_DIRS, EXCLUDE, RECLAIMED };

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
