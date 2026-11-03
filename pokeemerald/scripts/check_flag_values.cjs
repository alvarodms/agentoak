#!/usr/bin/env node
'use strict';

// Flag value ledger (C334).
//
// New flags are spent by renaming a FLAG_UNUSED_0xNNN define in place (same value),
// so the risks are a typo that lands two names on one bit, or a script that sets a
// FLAG_UNUSED_* name directly (it would collide the day that slot is renamed).
// This script evaluates every `#define FLAG_*` and `*_FLAGS_*` in
// include/constants/flags.h, resolving `(BASE + 0xN)` forms, named bases
// (TEMP_FLAGS_START, SYSTEM_FLAGS, DAILY_FLAGS_START...), MAX_TRAINERS_COUNT
// (opponents.h) and the REMATCH_* enum (rematches.h).
//
// Fails (exit 1) when:
//   F1. fewer than 1000 flags parse (parser broke), or a define does not evaluate;
//   F2. two FLAG_* names share a value, unless the pair is in ALIASES with a reason
//       (range markers ending in _START/_END are bases, not flags, and are skipped);
//   F3. a FLAG_UNUSED_0x* / FLAG_SPECIAL_FLAG_UNUSED_0x* name is referenced outside
//       flags.h (src/, include/, data/ incl. map.json, asm/; comment-only lines skipped);
//   F4. TRAINER_REGISTERED_FLAGS_START + REMATCH_TABLE_ENTRIES > 0x1AA (a new rematch
//       entry would spill its Match Call registered flag into 0x1AA/0x1AB);
//   F5. a named flag sits in a reserved slot (RESERVED below).
//
// Prints `flags: N parsed, 0 duplicates, free pool P`, where P counts FLAG_UNUSED_0x*
// slots outside the excluded ranges (memory/strategy-notes.md "Flag space").
//
// Usage: node scripts/check_flag_values.cjs [--selftest]
//        (run by `make check_flag_values`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FLAGS_H = path.join(ROOT, 'include/constants/flags.h');
const OPPONENTS_H = path.join(ROOT, 'include/constants/opponents.h');
const REMATCHES_H = path.join(ROOT, 'include/constants/rematches.h');
const SCAN_DIRS = ['src', 'include', 'data', 'asm'].map((d) => path.join(ROOT, d));
const EXTENSIONS = new Set(['.c', '.h', '.inc', '.s', '.json']);
const MIN_FLAGS = 1000;
const REGISTERED_LIMIT = 0x1aa;

// Vanilla pairs that share a value on purpose. Key = names sorted and joined by '='.
const ALIASES = {
  'FLAG_TEMP_1=FLAG_TEMP_SKIP_GABBY_INTERVIEW': 'vanilla temp-flag alias (flags.h "Temp flag aliases")',
  'FLAG_TEMP_2=FLAG_TEMP_REGICE_PUZZLE_STARTED': 'vanilla temp-flag alias (flags.h "Temp flag aliases")',
  'FLAG_TEMP_3=FLAG_TEMP_REGICE_PUZZLE_FAILED': 'vanilla temp-flag alias (flags.h "Temp flag aliases")',
  'FLAG_TEMP_11=FLAG_TEMP_HIDE_MIRAGE_ISLAND_BERRY_TREE': 'vanilla temp-flag alias (flags.h "Temp flag aliases")',
};

// Slots kept free for a planned beat: only the listed name may take them.
const RESERVED = {
  0x1aa: { allow: [], why: 'Match Call registered block tail (next REMATCH_ entry lands here)' },
  0x1ab: { allow: [], why: 'Match Call registered block tail' },
  0x2bb: { allow: ['FLAG_DEN_METEOR_STEVEN_CHALK'], why: 'reserved C333 for the Meteor Falls Steven chalk (C336)' },
};

// Ranges a FLAG_UNUSED_0x* slot must avoid to count as free pool (strategy-notes "Flag space").
const EXCLUDED = [
  [0x00, 0x1f, 'temp flags (cleared on every map load)'],
  [0x1aa, 0x1ab, 'after the Match Call registered block'],
  [0x1f4, 0x263, 'hidden items'],
  [0x500, 0xffff, 'trainer flags (0x500 + MAX_TRAINERS_COUNT), then system/daily/special'],
];

const UNUSED_RE = /^FLAG_(SPECIAL_FLAG_)?UNUSED_0x[0-9A-Fa-f]+$/;
const UNUSED_TOKEN_RE = /\bFLAG_(?:SPECIAL_FLAG_)?UNUSED_0x[0-9A-Fa-f]+\b/g;
const COMMENT_LINE_RE = /^\s*(@|\/\/|\*|\/\*)/;
const DEFINE_RE = /^\s*#define\s+(\w+)\s+(.+?)\s*$/;

function stripComment(expr) {
  return expr.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '').trim();
}

// header text -> Map(name -> expression string) for every object-like #define
function parseDefines(text, into = new Map()) {
  for (const line of text.split('\n')) {
    const m = line.match(DEFINE_RE);
    if (!m || m[1].includes('(')) continue;
    if (/^\w+\(/.test(line.replace(/^\s*#define\s+/, ''))) continue; // function-like macro
    const expr = stripComment(m[2]);
    if (expr) into.set(m[1], expr);
  }
  return into;
}

// rematches.h text -> Map(name -> index string) for the anonymous REMATCH_ enum
function parseEnum(text, into = new Map()) {
  const body = text.match(/enum\s*\{([\s\S]*?)\}/);
  if (!body) return into;
  let i = 0;
  for (const raw of body[1].split('\n')) {
    const m = stripComment(raw).match(/^(\w+)\s*(?:=\s*(\d+))?\s*,?$/);
    if (!m) continue;
    if (m[2] !== undefined) i = Number(m[2]);
    into.set(m[1], String(i++));
  }
  return into;
}

function evaluate(name, defs, cache = new Map(), stack = new Set()) {
  if (cache.has(name)) return cache.get(name);
  if (!defs.has(name)) throw new Error(`undefined symbol ${name}`);
  if (stack.has(name)) throw new Error(`recursive define ${name}`);
  stack.add(name);
  const expr = defs.get(name).replace(/\b[A-Za-z_]\w*\b/g, (id) => String(evaluate(id, defs, cache, stack)));
  stack.delete(name);
  if (!/^[\s\d xA-Fa-f+\-*/%()]+$/.test(expr)) throw new Error(`${name}: cannot evaluate "${defs.get(name)}"`);
  const value = Function(`"use strict"; return (${expr});`)();
  if (!Number.isInteger(value)) throw new Error(`${name}: "${defs.get(name)}" is not an integer`);
  cache.set(name, value);
  return value;
}

const isMarker = (name) => /_(START|END)$/.test(name);

// defs -> { flags: [{name, value}], errors, duplicates, pool }
function analyse(flagNames, defs) {
  const errors = [];
  const cache = new Map();
  const flags = [];
  for (const name of flagNames) {
    try {
      flags.push({ name, value: evaluate(name, defs, cache) });
    } catch (e) {
      errors.push(`F1 ${e.message}`);
    }
  }
  if (flags.length < MIN_FLAGS) errors.push(`F1 only ${flags.length} flags parsed (< ${MIN_FLAGS}): parser broke?`);

  const byValue = new Map();
  for (const f of flags) {
    if (!f.name.startsWith('FLAG_') || isMarker(f.name)) continue;
    if (!byValue.has(f.value)) byValue.set(f.value, []);
    byValue.get(f.value).push(f.name);
  }
  let duplicates = 0;
  for (const [value, names] of byValue) {
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const key = [names[i], names[j]].sort().join('=');
        if (ALIASES[key]) continue;
        duplicates++;
        errors.push(`F2 ${names[i]} and ${names[j]} are both 0x${value.toString(16).toUpperCase()}`);
      }
    }
  }

  try {
    const end = evaluate('TRAINER_REGISTERED_FLAGS_START', defs, cache) + evaluate('REMATCH_TABLE_ENTRIES', defs, cache);
    if (end > REGISTERED_LIMIT) {
      errors.push(`F4 TRAINER_REGISTERED_FLAGS_START + REMATCH_TABLE_ENTRIES = 0x${end.toString(16).toUpperCase()} > 0x1AA`);
    }
  } catch (e) {
    errors.push(`F4 ${e.message}`);
  }

  for (const [value, names] of byValue) {
    const slot = RESERVED[value];
    if (!slot) continue;
    for (const n of names) {
      if (!UNUSED_RE.test(n) && !slot.allow.includes(n)) {
        errors.push(`F5 ${n} takes reserved slot 0x${value.toString(16).toUpperCase()} (${slot.why})`);
      }
    }
  }

  const pool = flags.filter(
    (f) => /^FLAG_UNUSED_0x/.test(f.name) && !EXCLUDED.some(([lo, hi]) => f.value >= lo && f.value <= hi) && !RESERVED[f.value]
  ).length;
  return { flags, errors, duplicates, pool };
}

// Adds `file:line name` for each FLAG_UNUSED_* token in text to hits
function findUnusedRefs(text, label, hits) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (COMMENT_LINE_RE.test(lines[i])) continue;
    const tokens = lines[i].match(UNUSED_TOKEN_RE);
    if (tokens) for (const t of tokens) hits.push(`${label}:${i + 1} ${t}`);
  }
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
    } else if (EXTENSIONS.has(path.extname(e.name)) && p !== FLAGS_H) {
      out.push(p);
    }
  }
  return out;
}

function flagNamesOf(text) {
  const names = [];
  for (const line of text.split('\n')) {
    const m = line.match(DEFINE_RE);
    if (m && (/^FLAG_/.test(m[1]) || /_FLAGS_/.test(m[1]))) names.push(m[1]);
  }
  return names;
}

function selftest() {
  const fail = (msg) => {
    console.error(`check_flag_values: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const base = [
    '#define TEMP_FLAGS_START 0x0',
    '#define TRAINER_REGISTERED_FLAGS_START 0x15C',
    '#define FLAG_A_REGISTERED (TRAINER_REGISTERED_FLAGS_START + REMATCH_B)',
    '#define FLAG_TEMP_1 (TEMP_FLAGS_START + 0x1) // comment',
    '#define FLAG_TEMP_SKIP_GABBY_INTERVIEW FLAG_TEMP_1',
    '#define SYSTEM_FLAGS (TRAINER_FLAGS_END + 1) // 0x860',
    '#define TRAINER_FLAGS_START 0x500',
    '#define TRAINER_FLAGS_END (TRAINER_FLAGS_START + MAX_TRAINERS_COUNT - 1)',
    '#define FLAG_SYS_X (SYSTEM_FLAGS + 0x2)',
    '#define FLAG_UNUSED_0x91F (SYSTEM_FLAGS + 0xBF)',
    '#define DAILY_FLAGS_START (FLAG_UNUSED_0x91F + (8 - FLAG_UNUSED_0x91F % 8))',
    '#define FLAG_UNUSED_0x02E 0x2E // Unused Flag',
  ];
  for (let i = 0; i < MIN_FLAGS; i++) base.push(`#define FLAG_FILL_${i} ${0x2000 + i}`);
  const build = (lines, rematches = 78) => {
    const defs = parseDefines(lines.join('\n'));
    parseDefines('#define MAX_TRAINERS_COUNT 864', defs);
    const e = ['enum {', '    REMATCH_A,', '    REMATCH_B, // comment'];
    for (let i = 2; i < rematches; i++) e.push(`    REMATCH_X${i},`);
    e.push('    REMATCH_TABLE_ENTRIES', '};');
    parseEnum(e.join('\n'), defs);
    return analyse(flagNamesOf(lines.join('\n')), defs);
  };

  const ok = build(base);
  if (ok.errors.length) fail(`clean fixture reported: ${ok.errors.join('; ')}`);
  const v = new Map(ok.flags.map((f) => [f.name, f.value]));
  if (v.get('FLAG_A_REGISTERED') !== 0x15d) fail('REMATCH_ enum offset not resolved');
  if (v.get('FLAG_SYS_X') !== 0x862) fail('SYSTEM_FLAGS chain not resolved');
  if (v.get('DAILY_FLAGS_START') !== 0x920) fail('DAILY_FLAGS_START % expression not resolved');
  if (ok.pool !== 1) fail(`free pool ${ok.pool}, expected 1 (0x2E)`);

  const dup = build([...base, '#define FLAG_NEW_THING 0x2E']);
  if (!dup.errors.some((e) => e.startsWith('F2'))) fail('planted duplicate value was not reported');
  const reserved = build([...base, '#define FLAG_STEAL 0x2BB']);
  if (!reserved.errors.some((e) => e.startsWith('F5'))) fail('named flag in reserved 0x2BB was not reported');
  const spill = build(base, 79);
  if (!spill.errors.some((e) => e.startsWith('F4'))) fail('79 rematch entries (0x15C + 79 > 0x1AA) not reported');
  const thin = analyse(['FLAG_TEMP_1'], parseDefines(base.join('\n')));
  if (!thin.errors.some((e) => e.includes('parser broke'))) fail('< 1000 flags not reported');

  const hits = [];
  findUnusedRefs(
    ['\tsetflag FLAG_UNUSED_0x02E', '@ FLAG_UNUSED_0x02F in a comment', '\tsetflag FLAG_UNUSED_0x02EX'].join('\n'),
    't',
    hits
  );
  if (hits.length !== 1 || !hits[0].includes('FLAG_UNUSED_0x02E')) fail(`unused-ref scan returned ${JSON.stringify(hits)}`);
  console.log('check_flag_values: selftest OK');
}

function main() {
  const flagsText = fs.readFileSync(FLAGS_H, 'utf8');
  const defs = parseDefines(flagsText);
  parseDefines(fs.readFileSync(OPPONENTS_H, 'utf8'), defs);
  parseEnum(fs.readFileSync(REMATCHES_H, 'utf8'), defs);
  const result = analyse(flagNamesOf(flagsText), defs);

  const hits = [];
  let files = 0;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir, [])) {
      files++;
      findUnusedRefs(fs.readFileSync(file, 'utf8'), path.relative(ROOT, file), hits);
    }
  }
  for (const h of hits) result.errors.push(`F3 FLAG_UNUSED name referenced outside flags.h: ${h}`);

  console.log(`flags: ${result.flags.length} parsed, ${result.duplicates} duplicates, free pool ${result.pool}`);
  console.log(`(${Object.keys(ALIASES).length} allowlisted aliases; ${files} files scanned for FLAG_UNUSED references)`);
  if (result.errors.length) {
    console.error(`check_flag_values: ${result.errors.length} failure(s):`);
    for (const e of result.errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log('check_flag_values: OK');
}

if (process.argv.includes('--selftest')) selftest();
else main();
