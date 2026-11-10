#!/usr/bin/env node
'use strict';

// Flag pairing lint (C336). Replaces scripts/check_flags.sh, which only looked at
// data/maps and allowlisted most prefixes.
//
// Every custom flag (a slot we renamed out of the FLAG_UNUSED pool) must be both
// READ somewhere and SET somewhere, or the beat it guards can never fire (read but
// never set) or the work that sets it is invisible (set but never read).
//
// CUSTOM = flags.h names whose value is in 0x264-0x2BB (the vanilla unused block we
// spend first) or in the C333 free-pool tiers below, minus FLAG_UNUSED_* / FLAG_TEMP_*.
//
// Each non-comment occurrence of a CUSTOM name is classified:
//   READ: goto_if_set/goto_if_unset/goto_if_not_set/call_if_set/call_if_unset/checkflag
//         script lines; C `FlagGet(FLAG_X`; map.json object_events "flag" (visibility).
//   SET:  setflag/clearflag script lines; C `FlagSet(` / `FlagClear(` / `FlagToggle(`.
//   BOTH: anything else (macro-invocation args such as EventMacro_StaticDen, C tables,
//         struct initializers, #define aliases, hidden_item flags). Ambiguous, so it
//         counts as either side.
//
// Fails (exit 1) when a CUSTOM flag is READ with no SET/BOTH, or SET with no READ/BOTH,
// unless it is in ALLOWLIST with a reason. Unreferenced CUSTOM flags print as INFO.
//
// Usage: node scripts/check_flag_pairs.cjs [--selftest]
//        (run by `make check_flags`, part of `make check_all`)

const fs = require('fs');
const path = require('path');
const { parseDefines, parseEnum, evaluate, flagNamesOf, isMarker, ROOT, FLAGS_H, OPPONENTS_H, REMATCHES_H } =
  require('./check_flag_values.cjs');

const MIN_DEFINES = 1000;
// 89 custom flags at C336; the floor catches a parser or range regression, not growth
const MIN_CUSTOM = 60;

const CUSTOM_BLOCK = [0x264, 0x2bb];
// Free-pool tiers (C333 "Flag space", memory/strategy-notes.md). Keep in sync with
// check_flag_values.cjs (its EXCLUDED ranges are the complement of these tiers).
const POOL_TIERS = [
  [0x2d, 0x4f], // Tier A
  [0x54, 0x54], [0x55, 0x55], [0x68, 0x68], [0xe9, 0xe9], [0x1da, 0x1da], [0x1de, 0x1e3], [0x2d9, 0x2d9], // Tier B
  [0x470, 0x470], [0x472, 0x472], [0x479, 0x479], [0x493, 0x4ef], [0x4f9, 0x4f9], [0x4fa, 0x4fa], [0x4ff, 0x4ff], // Tier C
];

// flag name -> reason. Only for flags whose read or set side is invisible to a text scan.
const ALLOWLIST = {};

const SCAN = [
  { dir: 'data', exts: ['.inc', '.s', '.json'] },
  { dir: 'src', exts: ['.c', '.h'] },
  { dir: 'include', exts: ['.h'] },
  { dir: 'asm/macros', exts: ['.inc'] },
];

const READ_CMDS = new Set(['goto_if_set', 'goto_if_unset', 'goto_if_not_set', 'call_if_set', 'call_if_unset', 'checkflag']);
const SET_CMDS = new Set(['setflag', 'clearflag']);
const C_READ_RE = /\bFlagGet\s*\(\s*$/;
const C_SET_RE = /\b(FlagSet|FlagClear|FlagToggle)\s*\(\s*$/;
const TOKEN_RE = /\bFLAG_\w+\b/g;

const isCustomValue = (v) =>
  (v >= CUSTOM_BLOCK[0] && v <= CUSTOM_BLOCK[1]) || POOL_TIERS.some(([lo, hi]) => v >= lo && v <= hi);
const isCustomName = (n) => n.startsWith('FLAG_') && !/^FLAG_(UNUSED_|TEMP_)/.test(n) && !isMarker(n);

// Removes C comments, keeping line count (block comments may span lines)
function stripCComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/.*$/gm, '')
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""');
}

// Removes `@` comments and string literals from a script line
function stripScriptLine(line) {
  return line.replace(/"(?:[^"\\]|\\.)*"/g, '""').replace(/@.*$/, '');
}

function addOcc(occ, name, kind, where) {
  if (!occ.has(name)) occ.set(name, { READ: [], SET: [], BOTH: [] });
  occ.get(name)[kind].push(where);
}

// One file's text -> occurrences of names in `custom` (Set), keyed by name
function classifyText(text, type, label, custom, occ) {
  if (type === 'json') return classifyJson(text, label, custom, occ);
  const lines = (type === 'c' ? stripCComments(text) : text).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = type === 'c' ? lines[i] : stripScriptLine(lines[i]);
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(line))) {
      const name = m[0];
      if (!custom.has(name)) continue;
      let kind = 'BOTH';
      if (type === 'c') {
        const before = line.slice(0, m.index);
        if (C_READ_RE.test(before)) kind = 'READ';
        else if (C_SET_RE.test(before)) kind = 'SET';
      } else {
        const cmd = (line.match(/^\s*([A-Za-z_]\w*)/) || [])[1];
        if (READ_CMDS.has(cmd)) kind = 'READ';
        else if (SET_CMDS.has(cmd)) kind = 'SET';
      }
      addOcc(occ, name, kind, `${label}:${i + 1}`);
    }
  }
}

// map.json: object_events "flag" hides the object (READ); any other mention (hidden_item
// bg_events, which the engine sets on pickup, or unknown keys) is BOTH
function classifyJson(text, label, custom, occ) {
  const lines = text.split('\n');
  let section = '';
  for (let i = 0; i < lines.length; i++) {
    const sec = lines[i].match(/^\s*"(\w+)"\s*:\s*\[/);
    if (sec) section = sec[1];
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(lines[i]))) {
      if (!custom.has(m[0])) continue;
      const isObjFlag = section === 'object_events' && /^\s*"flag"\s*:/.test(lines[i]);
      addOcc(occ, m[0], isObjFlag ? 'READ' : 'BOTH', `${label}:${i + 1}`);
    }
  }
}

// custom names + occurrences -> { fails: [msg], info: [name], allowlisted: n }
function findOrphans(customNames, occ, allowlist = ALLOWLIST) {
  const fails = [];
  const info = [];
  let allowlisted = 0;
  for (const name of customNames) {
    const o = occ.get(name);
    if (!o) {
      info.push(name);
      continue;
    }
    const where = [...o.READ.map((w) => `${w} READ`), ...o.SET.map((w) => `${w} SET`), ...o.BOTH.map((w) => `${w} BOTH`)];
    let problem = null;
    if (o.READ.length && !o.SET.length && !o.BOTH.length) problem = 'read but never set';
    else if (o.SET.length && !o.READ.length && !o.BOTH.length) problem = 'set but never read';
    if (!problem) continue;
    if (allowlist[name]) {
      allowlisted++;
      continue;
    }
    fails.push(`${name} is ${problem}:\n      ${where.join('\n      ')}`);
  }
  return { fails, info, allowlisted };
}

function walk(dir, exts, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'build') walk(p, exts, out);
    } else if (exts.includes(path.extname(e.name)) && p !== FLAGS_H) {
      out.push(p);
    }
  }
  return out;
}

function typeOf(file) {
  const ext = path.extname(file);
  if (ext === '.json') return 'json';
  if (ext === '.c' || ext === '.h') return 'c';
  return 'script';
}

function selftest() {
  const fail = (msg) => {
    console.error(`check_flag_pairs: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const custom = new Set(['FLAG_READ_ONLY', 'FLAG_SET_ONLY', 'FLAG_PAIRED', 'FLAG_MACRO_ARG', 'FLAG_OBJ', 'FLAG_NOBODY']);
  const occ = new Map();
  classifyText(
    [
      '\tgoto_if_set FLAG_READ_ONLY, Somewhere',
      '@ setflag FLAG_READ_ONLY in a comment does not count',
      '\tmsgbox Text, MSGBOX_SIGN @ setflag FLAG_READ_ONLY trailing comment',
      '\t.string "setflag FLAG_READ_ONLY in text$"',
      '\tsetflag FLAG_PAIRED',
      '\tEventMacro_StaticDen SPECIES_X, 40, ITEM_NONE, FLAG_MACRO_ARG, A, B, C',
      '\tcall_if_unset FLAG_MACRO_ARG, Elsewhere',
      '\tsetflag FLAG_OBJ',
    ].join('\n'),
    'script', 'fixture.inc', custom, occ
  );
  classifyText(
    [
      'if (FlagGet(FLAG_PAIRED))',
      '    FlagSet( FLAG_SET_ONLY);',
      '    return FALSE; // FlagSet(FLAG_READ_ONLY)',
      '/* FlagClear(FLAG_READ_ONLY)',
      '   FlagSet(FLAG_READ_ONLY) */',
    ].join('\n'),
    'c', 'fixture.c', custom, occ
  );
  classifyText(
    ['{', '  "object_events": [', '    {', '      "flag": "FLAG_OBJ"', '    }', '  ]', '}'].join('\n'),
    'json', 'map.json', custom, occ
  );
  const r = findOrphans([...custom], occ, {});
  const names = r.fails.map((f) => f.split(' ')[0]).sort();
  if (names.join(',') !== 'FLAG_READ_ONLY,FLAG_SET_ONLY') fail(`expected exactly FLAG_READ_ONLY and FLAG_SET_ONLY, got [${names}]`);
  if (!r.fails[names.indexOf('FLAG_READ_ONLY')].includes('read but never set')) fail('read-only orphan mislabelled');
  if (occ.get('FLAG_READ_ONLY').READ.length !== 1) fail('comment/string mentions were counted');
  if (occ.get('FLAG_MACRO_ARG').BOTH.length !== 1) fail('macro argument not classified BOTH');
  if (occ.get('FLAG_OBJ').READ.length !== 1) fail('map.json object flag not classified READ');
  if (r.info.join() !== 'FLAG_NOBODY') fail(`unreferenced flag not reported as INFO: [${r.info}]`);
  if (findOrphans([...custom], occ, { FLAG_READ_ONLY: 'x', FLAG_SET_ONLY: 'y' }).fails.length) fail('ALLOWLIST ignored');
  console.log('check_flag_pairs: selftest OK');
}

function main() {
  const flagsText = fs.readFileSync(FLAGS_H, 'utf8');
  const defs = parseDefines(flagsText);
  parseDefines(fs.readFileSync(OPPONENTS_H, 'utf8'), defs);
  parseEnum(fs.readFileSync(REMATCHES_H, 'utf8'), defs);
  const names = flagNamesOf(flagsText);
  const errors = [];
  if (names.length < MIN_DEFINES) errors.push(`only ${names.length} flag defines parsed (< ${MIN_DEFINES}): parser broke?`);

  const cache = new Map();
  const customNames = [];
  for (const name of names) {
    if (!isCustomName(name)) continue;
    let value;
    try {
      value = evaluate(name, defs, cache);
    } catch {
      continue; // check_flag_values reports unevaluable defines
    }
    if (isCustomValue(value)) customNames.push(name);
  }
  if (customNames.length < MIN_CUSTOM) errors.push(`only ${customNames.length} custom flags found (< ${MIN_CUSTOM}): range or parser broke?`);

  for (const name of Object.keys(ALLOWLIST)) {
    if (!customNames.includes(name)) errors.push(`ALLOWLIST entry ${name} is not a custom flag (stale?)`);
  }

  const custom = new Set(customNames);
  const occ = new Map();
  for (const { dir, exts } of SCAN) {
    for (const file of walk(path.join(ROOT, dir), exts, [])) {
      classifyText(fs.readFileSync(file, 'utf8'), typeOf(file), path.relative(ROOT, file), custom, occ);
    }
  }
  const r = findOrphans(customNames, occ);
  for (const name of r.info) console.log(`INFO ${name} is never referenced outside flags.h`);
  errors.push(...r.fails);

  if (errors.length) {
    console.error(`check_flag_pairs: ${errors.length} failure(s):`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(
    `check_flag_pairs: ${customNames.length} custom flags, all read+set (${r.allowlisted} allowlisted, ${r.info.length} unreferenced)`
  );
}

if (process.argv.includes('--selftest')) selftest();
else main();
