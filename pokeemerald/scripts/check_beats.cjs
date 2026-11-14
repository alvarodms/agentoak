#!/usr/bin/env node
'use strict';

// Beat manifest guard (C367, tech-debt 355).
//
// scripts/beats.json lists every shipped discovery beat once: its map, object
// or trainer, gate, labels, playtests and who speaks (see memory/strategy-notes.md
// "C367 refactor spec"). Rows land with their beat; there are no planned rows.
// check_playtest / check_beat_visibility / check_object_tiles still keep their
// own tables until C370 moves them onto this file.
//
// Fails (exit 1) when:
//   B0. the manifest has fewer than MIN_ROWS rows, a row lacks id/arc/map/labels/
//       playtests/speaker, an id repeats, or speaker is not stranger|believer|none;
//   B1. a `playtests` name has no playtests/<name>.json;
//   B2. a gate flag or hideFlag is not #defined in include/constants/flags.h, a
//       hideFlag is not FLAG_TEMP_*, or a trainer (row or gate) is not in
//       include/constants/opponents.h;
//   B3. a row sits on a D1-excluded map (GraniteCave_*, Route106, LilycoveCity*,
//       DewfordTown*) without `d1Exempt`;
//   B4. for speaker "stranger": a start label is missing from the map's
//       scripts.inc, or a text label reached from `labels` (msgbox / message /
//       trainerbattle text args, following goto/call/goto_if_*/call_if_*/case
//       inside that one scripts.inc) contains "…?", "...?", NOTEBOOK, FIELD NOTES,
//       RED INK, BIRCH, wrote, {PLAYER} or the word "pen" (case-insensitive),
//       unless the row's `allow` lists that string with a reason. A command
//       outside the ARG_POSITION table that passes a *_Text_* label also fails,
//       so new text never slips past unread. Text labels defined outside the
//       map (data/text/*.inc, gText_*) are not read.
//
// Usage: node scripts/check_beats.cjs [--selftest]
//        (run by `make check_beats`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MANIFEST = path.join(__dirname, 'beats.json');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const PLAYTESTS_DIR = path.join(ROOT, 'playtests');
const FLAGS_H = path.join(ROOT, 'include/constants/flags.h');
const OPPONENTS_H = path.join(ROOT, 'include/constants/opponents.h');

// C323 rule: a floor equal to what shipped, so a parser or merge that drops
// rows fails loudly. C367 shipped 15 rows (v3.0-v3.3); raise it when a beat lands.
const MIN_ROWS = 15;

const SPEAKERS = ['stranger', 'believer', 'none'];
const D1_MAP = /^(GraniteCave_|Route106$|LilycoveCity|DewfordTown)/;
// Forbidden in a stranger's text (strategy-notes v3.4 rule 3). key = what `allow` names.
const FORBIDDEN = [
  { key: '…?', test: (t) => t.includes('…?') },
  { key: '...?', test: (t) => t.includes('...?') },
  { key: 'NOTEBOOK', test: (t) => /notebook/i.test(t) },
  { key: 'FIELD NOTES', test: (t) => /field notes/i.test(t) },
  { key: 'RED INK', test: (t) => /red ink/i.test(t) },
  { key: 'BIRCH', test: (t) => /birch/i.test(t) },
  { key: 'wrote', test: (t) => /wrote/i.test(t) },
  { key: '{PLAYER}', test: (t) => /\{player\}/i.test(t) },
  { key: 'pen', test: (t) => /\bpen\b/i.test(t) },
];

// 1-based argument positions (the command itself is 0) that hold text labels or
// script labels. Extend it when a stranger uses another variant; an unlisted
// command passing a *_Text_* label fails B4.
const ARG_POSITION = {
  msgbox: { text: [1] },
  message: { text: [1] },
  trainerbattle_single: { text: [2, 3], script: [4] },
  trainerbattle_no_intro: { text: [2] },
  trainerbattle_double: { text: [2, 3, 4], script: [5] },
  trainerbattle_rematch: { text: [2, 3] },
  trainerbattle_rematch_double: { text: [2, 3, 4] },
};
const BRANCH = /^(goto|call|goto_if_\w+|call_if_\w+|case)$/;
const TERMINATORS = new Set(['end', 'return', 'step_end', 'releaseall_end']);

// ---- label walk ---------------------------------------------------------------

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

const LABEL_RE = /^(\w+)::?$/;

// TODO(C370+): move to the planned scripts/lib/script_graph.cjs and share it
// with check_beat_visibility (reaches/labelBody) and check_playtest.
//
// Pure. scriptsIncText: one map's scripts.inc; startLabels: labels to start from.
// Returns { textLabels: Set, edges: [[from, to]], missing: [label], problems: [string] }.
// A label's body runs to `end`/`return`/an unconditional `goto`; falling into the
// next label counts as an edge to it. Only labels defined in this text are followed.
function walkLabels(scriptsIncText, startLabels) {
  const lines = scriptsIncText.split('\n').map((l) => stripComment(l).trim());
  const index = new Map();
  lines.forEach((l, i) => {
    const m = LABEL_RE.exec(l);
    if (m) index.set(m[1], i);
  });
  const textLabels = new Set();
  const edges = [];
  const missing = [];
  const problems = [];
  const seen = new Set();
  const queue = [];
  for (const s of startLabels) {
    if (!index.has(s)) missing.push(s);
    else queue.push(s);
  }
  while (queue.length) {
    const label = queue.shift();
    if (seen.has(label)) continue;
    seen.add(label);
    const follow = (to) => {
      edges.push([label, to]);
      if (index.has(to) && !seen.has(to)) queue.push(to);
    };
    for (let i = index.get(label) + 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const lm = LABEL_RE.exec(line);
      if (lm) {
        follow(lm[1]); // fall-through
        break;
      }
      const m = /^(\S+)\s*(.*)$/.exec(line);
      const cmd = m[1];
      const args = m[2].split(',').map((s) => s.trim()).filter(Boolean);
      const pos = ARG_POSITION[cmd];
      if (pos) {
        for (const p of pos.text || []) if (args[p - 1]) textLabels.add(args[p - 1]);
        for (const p of pos.script || []) if (args[p - 1] && index.has(args[p - 1])) follow(args[p - 1]);
      } else if (/^trainerbattle/.test(cmd)) {
        problems.push(`${label}: ${cmd} is not in ARG_POSITION; add its text/script argument positions`);
      } else if (BRANCH.test(cmd)) {
        const target = args[args.length - 1];
        if (target && index.has(target)) follow(target);
      } else {
        const textArg = args.find((a) => /_Text_\w+$/.test(a));
        if (textArg) problems.push(`${label}: ${cmd} passes ${textArg} but is not in ARG_POSITION; add it`);
      }
      if (TERMINATORS.has(cmd) || cmd === 'goto') break;
    }
  }
  return { textLabels, edges, missing, problems };
}

// The concatenated .string contents of `label` in `text`, or null if it is not defined there.
function readString(text, label) {
  const lines = text.split('\n').map((l) => stripComment(l).trim());
  const start = lines.findIndex((l) => l === `${label}:` || l === `${label}::`);
  if (start < 0) return null;
  let out = '';
  for (let i = start + 1; i < lines.length; i++) {
    const m = /^\.string\s+"(.*)"$/.exec(lines[i]);
    if (!m) {
      if (!lines[i]) continue;
      break;
    }
    out += m[1];
  }
  // \n \l \p are line/page breaks: read them as spaces so word checks see word edges.
  return out.replace(/\\[nlp]/g, ' ');
}

// ---- rules --------------------------------------------------------------------

// Pure. env: { flags: Set, trainers: Set, playtestExists(name), readMap(map) -> { scripts, text } | null }.
// Returns error strings, each starting with its rule id.
function check(rows, env) {
  const errors = [];
  if (!Array.isArray(rows)) return ['B0 beats.json must be an array of rows'];
  if (rows.length < MIN_ROWS) errors.push(`B0 only ${rows.length} rows, expected at least ${MIN_ROWS} (MIN_ROWS); did a row get dropped?`);
  const ids = new Set();
  for (const r of rows) {
    const id = r.id || '(no id)';
    for (const k of ['id', 'arc', 'map', 'speaker']) if (typeof r[k] !== 'string' || !r[k]) errors.push(`B0 ${id}: missing ${k}`);
    for (const k of ['labels', 'playtests']) if (!Array.isArray(r[k])) errors.push(`B0 ${id}: ${k} must be an array`);
    if (r.speaker && !SPEAKERS.includes(r.speaker)) errors.push(`B0 ${id}: speaker ${r.speaker} is not one of ${SPEAKERS.join('|')}`);
    if (ids.has(r.id)) errors.push(`B0 ${id}: duplicate id`);
    ids.add(r.id);

    // B1
    for (const p of r.playtests || []) if (!env.playtestExists(p)) errors.push(`B1 ${id}: playtest ${p} has no playtests/${p}.json`);

    // B2
    const gate = r.gate || {};
    if (gate.flag && !env.flags.has(gate.flag)) errors.push(`B2 ${id}: gate flag ${gate.flag} is not in flags.h`);
    if (r.hideFlag) {
      if (!env.flags.has(r.hideFlag)) errors.push(`B2 ${id}: hideFlag ${r.hideFlag} is not in flags.h`);
      if (!/^FLAG_TEMP_/.test(r.hideFlag)) errors.push(`B2 ${id}: hideFlag ${r.hideFlag} must be a FLAG_TEMP_* (new beats spend no flag)`);
    }
    for (const t of [r.trainer, gate.trainer].filter(Boolean)) {
      if (!env.trainers.has(t)) errors.push(`B2 ${id}: trainer ${t} is not in opponents.h`);
    }

    // B3
    if (r.map && D1_MAP.test(r.map) && !r.d1Exempt) errors.push(`B3 ${id}: ${r.map} is a D1-excluded map and the row has no d1Exempt`);

    // B4
    if (r.speaker !== 'stranger') continue;
    const map = env.readMap(r.map);
    if (!map) {
      errors.push(`B4 ${id}: data/maps/${r.map}/scripts.inc not found`);
      continue;
    }
    const walk = walkLabels(map.scripts, r.labels || []);
    for (const l of walk.missing) errors.push(`B4 ${id}: label ${l} is not in ${r.map}/scripts.inc`);
    for (const p of walk.problems) errors.push(`B4 ${id}: ${p}`);
    const allowed = new Set((r.allow || []).map((a) => a.string));
    for (const label of walk.textLabels) {
      let text = readString(map.scripts, label);
      if (text === null && map.text) text = readString(map.text, label);
      if (text === null) continue; // defined outside the map (data/text, gText_*): not ours to read
      for (const f of FORBIDDEN) {
        if (f.test(text) && !allowed.has(f.key)) errors.push(`B4 ${id}: ${label} says ${JSON.stringify(f.key)}: "${text}"`);
      }
    }
  }
  return errors;
}

// ---- I/O ------------------------------------------------------------------------

function defines(file, prefix) {
  const names = new Set();
  for (const m of fs.readFileSync(file, 'utf8').matchAll(new RegExp(`^#define\\s+(${prefix}\\w+)`, 'gm'))) names.add(m[1]);
  return names;
}

function realEnv() {
  return {
    flags: defines(FLAGS_H, 'FLAG_'),
    trainers: defines(OPPONENTS_H, 'TRAINER_'),
    playtestExists: (name) => fs.existsSync(path.join(PLAYTESTS_DIR, `${name}.json`)),
    readMap: (map) => {
      const dir = path.join(MAPS_DIR, map);
      const scripts = path.join(dir, 'scripts.inc');
      if (!fs.existsSync(scripts)) return null;
      const text = path.join(dir, 'text.inc');
      return { scripts: fs.readFileSync(scripts, 'utf8'), text: fs.existsSync(text) ? fs.readFileSync(text, 'utf8') : null };
    },
  };
}

const loadManifest = () => JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

// ---- selftest ---------------------------------------------------------------------

function selftest() {
  const fail = (msg) => {
    console.error(`check_beats: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const env = realEnv();
  const rows = loadManifest();
  const clean = check(rows, env);
  if (clean.length) fail(`the real manifest should pass:\n  ${clean.join('\n  ')}`);

  // A fake stranger map: reached text through goto/call/trainerbattle, plus one unreached label
  // whose forbidden word must NOT count (proves the walk, not a whole-file regex).
  const FAKE = [
    'Fake_EventScript_Stranger::',
    '\tlock',
    '\tgoto_if_set FLAG_TEMP_1, Fake_EventScript_After  @ comment',
    '\tmsgbox Fake_Text_Hello, MSGBOX_DEFAULT',
    '\ttrainerbattle_single TRAINER_IVAN, Fake_Text_Intro, Fake_Text_Defeat',
    '\tgoto Fake_EventScript_After',
    '\tend',
    'Fake_EventScript_After::',
    '\tmsgbox Fake_Text_After, MSGBOX_DEFAULT',
    '\trelease',
    '\tend',
    'Fake_EventScript_Unreached::',
    '\tmsgbox Fake_Text_Unreached, MSGBOX_DEFAULT',
    '\tend',
    'Fake_Text_Hello:',
    '\t.string "Storms come.$"',
    'Fake_Text_Intro:',
    '\t.string "Battle!$"',
    'Fake_Text_Defeat:',
    '\t.string "Fine.$"',
    'Fake_Text_After:',
    '\t.string "Bye.$"',
    'Fake_Text_Unreached:',
    '\t.string "PROF. BIRCH wrote it.$"',
  ].join('\n');
  const fakeEnv = (scripts) => ({ ...env, readMap: (m) => (m === 'FakeMap' ? { scripts, text: null } : env.readMap(m)) });
  const fakeRow = { id: 'fake', arc: 'selftest', map: 'FakeMap', speaker: 'stranger', labels: ['Fake_EventScript_Stranger'], playtests: [] };
  const withFake = (scripts, row = fakeRow) => check([...rows, row], fakeEnv(scripts));

  const walk = walkLabels(FAKE, ['Fake_EventScript_Stranger']);
  const want = ['Fake_Text_Hello', 'Fake_Text_Intro', 'Fake_Text_Defeat', 'Fake_Text_After'];
  if (want.some((l) => !walk.textLabels.has(l)) || walk.textLabels.has('Fake_Text_Unreached')) {
    fail(`walkLabels found ${[...walk.textLabels].join(', ')}`);
  }
  if (withFake(FAKE).length) fail(`the fake stranger should pass (its BIRCH line is unreached): ${withFake(FAKE).join('; ')}`);

  const expectRule = (rule, errors, what) => {
    if (!errors.some((e) => e.startsWith(`${rule} `))) fail(`planted ${what} was not caught as ${rule}; got ${JSON.stringify(errors)}`);
  };
  const clone = () => JSON.parse(JSON.stringify(rows));

  expectRule('B0', check(rows.slice(0, MIN_ROWS - 1), env), 'row-count drop');
  const noSpeaker = clone();
  noSpeaker[0].speaker = 'narrator';
  expectRule('B0', check(noSpeaker, env), 'bad speaker');

  const b1 = clone();
  b1[0].playtests.push('no-such-playtest');
  expectRule('B1', check(b1, env), 'missing playtest');

  const b2 = clone();
  b2[0].gate = { flag: 'FLAG_NOT_A_REAL_FLAG' };
  expectRule('B2', check(b2, env), 'undefined gate flag');
  const b2hide = clone();
  b2hide[0].hideFlag = 'FLAG_RECEIVED_FIELD_NOTES';
  expectRule('B2', check(b2hide, env), 'non-temp hideFlag');
  const b2trainer = clone();
  b2trainer[0].trainer = 'TRAINER_NOBODY_AT_ALL';
  expectRule('B2', check(b2trainer, env), 'undefined trainer');

  const b3 = clone();
  const idx = b3.findIndex((r) => !r.d1Exempt);
  b3[idx].map = 'DewfordTown_Gym';
  expectRule('B3', check(b3, env), 'D1 map without d1Exempt');

  expectRule('B4', withFake(FAKE.replace('Storms come.', 'PROF. BIRCH said so.')), 'BIRCH in reached text');
  expectRule('B4', withFake(FAKE.replace('Fine.', 'Thanks, {PLAYER}.')), '{PLAYER} in a trainerbattle defeat text');
  expectRule('B4', withFake(FAKE.replace('Bye.', 'Got a pen?')), '"pen" behind a goto');
  expectRule('B4', withFake(FAKE.replace('Battle!', 'Really…?')), '"…?" in an intro');
  expectRule('B4', withFake(FAKE.replace('trainerbattle_single', 'trainerbattle_mystery')), 'unknown trainerbattle variant');
  expectRule('B4', withFake(FAKE, { ...fakeRow, labels: ['Fake_EventScript_Missing'] }), 'missing start label');
  const allowed = withFake(FAKE.replace('Storms come.', 'PROF. BIRCH said so.'), {
    ...fakeRow,
    allow: [{ string: 'BIRCH', reason: 'selftest' }],
  });
  if (allowed.length) fail(`an allow entry should silence its string: ${allowed.join('; ')}`);
  if (walkLabels(FAKE, ['Fake_EventScript_Unreached']).textLabels.size !== 1) fail('walkLabels from a second start label');

  console.log('check_beats selftest: OK');
}

function main() {
  const rows = loadManifest();
  const errors = check(rows, realEnv());
  if (errors.length) {
    for (const e of errors) console.error(`check_beats: ${e}`);
    console.error(`check_beats: FAILED (${errors.length} problem(s))`);
    process.exit(1);
  }
  const strangers = rows.filter((r) => r.speaker === 'stranger');
  const allows = rows.reduce((n, r) => n + (r.allow || []).length, 0);
  console.log(`check_beats: OK (${rows.length} rows, ${strangers.length} strangers text-walked, ${allows} allow entries)`);
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}

module.exports = { walkLabels, readString, check, MIN_ROWS };
