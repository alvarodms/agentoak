#!/usr/bin/env node
'use strict';

// Beat manifest guard (C367, tech-debt 355).
//
// scripts/beats.json lists every shipped discovery beat once: its map, object
// or trainer, gate, labels, playtests and who speaks (see memory/strategy-notes.md
// "beats.json tooling (C373)"). Rows land with their beat; there are no planned rows.
// Every reader goes through scripts/lib/beats.cjs (loadBeats validates the SH-*
// shapes and the MIN_ROWS floor); check_playtest R5 and check_beat_visibility
// derive their tables from it. check_object_tiles needs none (it parses the
// believer place scripts).
//
// Fails (exit 1) when:
//   SH-*. scripts/lib/beats.cjs rejects a row shape (register, tiles, mustRead,
//       visibility, b5Exempt; see that file);
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
// Cross-reference pass, after B0-B4 (C373):
//   B5a. a row has no playtests (legacy rows may carry b5Exempt {"*": reason});
//   B5b. a named playtest has no playtests/<name>.json, or neither boots on the
//       row's map (scenario.map, or scenario.checkpoint resolved through
//       src/emulator/checkpoints.ts) nor has a `warp` step to it, unless the
//       row's b5Exempt names it (legacy rows only, each with a reason);
//   B5c. checkpoints.ts does not parse: a CHECKPOINT_NAMES entry has no
//       `const <NAME>: Checkpoint = {` block with a map, or fewer than 3 resolve
//       (B5b is skipped: it cannot be trusted without the checkpoint maps);
//   RM.  register mix, per version (v3.4, v3.5, ...) from v3.4 on: no row may be
//       register weather, and a version with >= 2 rows needs >= 1 fight and
//       >= 1 place|trace (a version with 1 row prints "RM pending" and passes);
//   SF.  a v3.4+ row has no seeFirst (one plain sentence: what the player sees
//       change before any text);
//   SFV. a seeFirst uses a speech verb (says|tells|explains|reads).
// Warns (exit stays 0):
//   W-ORPHAN. a playtest boots on a beat row's map but no row names it.
//
// Usage: node scripts/check_beats.cjs [--selftest]
//        (run by `make check_beats`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const PLAYTESTS_DIR = path.join(ROOT, 'playtests');
const FLAGS_H = path.join(ROOT, 'include/constants/flags.h');
const OPPONENTS_H = path.join(ROOT, 'include/constants/opponents.h');
const CHECKPOINTS_TS = path.join(ROOT, '../src/emulator/checkpoints.ts');

const { MIN_ROWS, loadBeats, validateRows, mapId, arcVersion, versionLess, checkpointMaps } = require('./lib/beats.cjs');

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

// ---- cross-reference pass: B5, RM, SF, SFV, W-ORPHAN (C373) ----------------------

const SPEECH_VERB = /\b(says|tells|explains|reads)\b/i;
// Every id this pass or the loader's validateRows can fire; the selftest plants each one.
const NEW_RULES = ['SH-REG', 'SH-TILE', 'SH-MUSTREAD', 'SH-VIS', 'SH-B5X', 'B5a', 'B5b', 'B5c', 'RM', 'SF', 'SFV', 'W-ORPHAN'];

// Pure. env: { checkpointsTs: text of checkpoints.ts, mapId(folder) -> MAP_* | null,
// playtest(name) -> parsed playtests/<name>.json | null, playtestNames() -> [name] }.
// Returns { errors, warnings, stats }; errors/warnings are [{ id, row, msg }].
function crossCheck(rows, env) {
  const errors = [];
  const warnings = [];
  const add = (list, id, row, msg) => list.push({ id, row, msg });
  const stats = { reached: 0, exemptPlaytests: 0, exemptRows: 0, rm: [], seeFirst: 0, orphans: 0 };

  // B5
  let checkpoints = null;
  try {
    checkpoints = checkpointMaps(env.checkpointsTs);
  } catch (e) {
    if (e.id !== 'B5c') throw e;
    add(errors, 'B5c', 'checkpoints.ts', `${e.message.replace(/^beats: B5c: checkpoints\.ts: /, '')}; B5b skipped`);
  }
  const bootMap = (pt) => {
    const s = pt.scenario || {};
    return s.map || checkpoints[s.checkpoint] || null;
  };
  for (const r of rows) {
    const exempt = r.b5Exempt || {};
    if (exempt['*']) {
      stats.exemptRows++;
      continue;
    }
    if (!(r.playtests || []).length) {
      add(errors, 'B5a', r.id, `no playtests: name one that boots on or warps to ${r.map}`);
      continue;
    }
    if (!checkpoints) continue;
    const target = env.mapId(r.map);
    for (const name of r.playtests) {
      if (exempt[name]) {
        stats.exemptPlaytests++;
        continue;
      }
      const pt = env.playtest(name);
      if (!pt) {
        add(errors, 'B5b', r.id, `playtest ${name} has no playtests/${name}.json`);
        continue;
      }
      const boot = bootMap(pt);
      const warps = (pt.steps || []).some((st) => st && st.warp && st.warp.map === target);
      if (target && (boot === target || warps)) stats.reached++;
      else add(errors, 'B5b', r.id, `playtest ${name} boots on ${boot || '(no map)'} and has no warp step to ${target || `${r.map} (no map.json id)`}`);
    }
  }

  // W-ORPHAN
  if (checkpoints) {
    const named = new Set(rows.flatMap((r) => r.playtests || []));
    const rowMaps = new Set(rows.map((r) => env.mapId(r.map)).filter(Boolean));
    for (const name of env.playtestNames()) {
      if (named.has(name)) continue;
      const pt = env.playtest(name);
      const boot = pt && bootMap(pt);
      if (boot && rowMaps.has(boot)) add(warnings, 'W-ORPHAN', name, `boots on ${boot}, a beat map, but no beats.json row names it`);
    }
    stats.orphans = warnings.length;
  }

  // RM
  const groups = new Map();
  for (const r of rows) {
    const v = arcVersion(r);
    if (!v || versionLess(v, [3, 4])) continue;
    const key = `v${v[0]}.${v[1]}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  for (const [key, group] of groups) {
    for (const r of group.filter((g) => g.register === 'weather'))
      add(errors, 'RM', r.id, `${key} row is register weather (no weather beats from v3.4 on)`);
    if (group.length === 1) {
      stats.rm.push(`RM pending: ${key} has 1 row`);
      continue;
    }
    const fights = group.filter((g) => g.register === 'fight').length;
    const places = group.filter((g) => g.register === 'place' || g.register === 'trace').length;
    if (!fights || !places) add(errors, 'RM', key, `${group.length} rows with ${fights} fight and ${places} place|trace; a version needs >= 1 of each`);
    else stats.rm.push(`RM OK ${key}: ${fights} fight, ${places} place|trace`);
  }

  // SF, SFV
  for (const r of rows) {
    const v = arcVersion(r);
    const sf = r.seeFirst;
    if (v && !versionLess(v, [3, 4])) {
      if (typeof sf !== 'string' || !sf.trim()) add(errors, 'SF', r.id, 'v3.4+ row needs seeFirst: one plain sentence of what the player sees change before any text');
      else stats.seeFirst++;
    }
    const verb = typeof sf === 'string' && SPEECH_VERB.exec(sf);
    if (verb) add(errors, 'SFV', r.id, `seeFirst uses the speech verb "${verb[1]}": describe what is seen, not said: "${sf}"`);
  }
  return { errors, warnings, stats };
}

// ---- I/O ------------------------------------------------------------------------

function defines(file, prefix) {
  const names = new Set();
  for (const m of fs.readFileSync(file, 'utf8').matchAll(new RegExp(`^#define\\s+(${prefix}\\w+)`, 'gm'))) names.add(m[1]);
  return names;
}

function realEnv() {
  const playtestCache = new Map();
  const mapIdCache = new Map();
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
    // crossCheck
    checkpointsTs: fs.readFileSync(CHECKPOINTS_TS, 'utf8'),
    mapId: (folder) => {
      if (!mapIdCache.has(folder)) mapIdCache.set(folder, mapId(folder));
      return mapIdCache.get(folder);
    },
    playtest: (name) => {
      if (!playtestCache.has(name)) {
        const file = path.join(PLAYTESTS_DIR, `${name}.json`);
        playtestCache.set(name, fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null);
      }
      return playtestCache.get(name);
    },
    playtestNames: () => fs.readdirSync(PLAYTESTS_DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort(),
  };
}

// ---- selftest ---------------------------------------------------------------------

function selftest() {
  const fail = (msg) => {
    console.error(`check_beats: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  let plants = 0;
  const env = realEnv();
  const rows = loadBeats();
  const clean = check(rows, env);
  if (clean.length) fail(`the real manifest should pass:\n  ${clean.join('\n  ')}`);
  const realCross = crossCheck(rows, env);
  if (realCross.errors.length) fail(`the real manifest should pass B5/RM/SF/SFV:\n  ${realCross.errors.map((e) => `${e.id} ${e.row}: ${e.msg}`).join('\n  ')}`);

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
    plants++;
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

  // ---- C373: shapes, B5, RM, SF, SFV, W-ORPHAN on in-memory fixtures ----
  // The two v3.5 draft rows (memory/strategy-notes.md) must pass as written. Their
  // labels, flags, trainer and playtests do not exist yet, so B1-B4 (file lookups,
  // the B4 text walk) cannot see them: they go through validateRows + crossCheck
  // (B5, RM, SF, SFV) with a fake env, as does every plant below.
  const STORM_CHARMS = {"id":"v35-storm-charms","arc":"v3.5 Taken North 1, storm charms (C375)","register":"place","map":"FortreeCity","object":"LOCALID_FORTREE_LOTAD_DOLL_1","gate":{"flag":"FLAG_ROUTE104_SKEPTIC_TURNED"},"hideFlag":"FLAG_TEMP_5","tiles":[[1,7,"left"],[2,7,"left"],[4,7,"left"]],"labels":["FortreeCity_OnTransition","FortreeCity_EventScript_LotadDoll"],"playtests":["fortree-storm-charms-turned","fortree-storm-charms-not-turned","taken-north-in-order"],"speaker":"none","seeFirst":"Three LOTAD DOLLs stand in the meadow facing back down Route 119 toward the storms, a woman among them."};
  const CHARM_KEEPER = {"id":"v35-charm-keeper","arc":"v3.5 Taken North 2, the charm-keeper (C374)","register":"fight","map":"FortreeCity","object":"LOCALID_FORTREE_CHARM_KEEPER","trainer":"TRAINER_FORTREE_CHARM_KEEPER","gate":{"none":true},"tiles":[[3,7,"down"]],"labels":["FortreeCity_EventScript_CharmKeeper","FortreeCity_EventScript_CharmKeeperTurned"],"playtests":["fortree-charm-keeper-spots-player","fortree-charm-keeper-ungated","fortree-kecleon-unblocked","taken-north-in-order"],"speaker":"believer","seeFirst":"Three LOTAD DOLLs face the storm; the woman standing among them sees you pass them and comes for you."};
  // A legacy row carrying every optional shape, so the SH-* plants have something to break.
  const LEGACY = {
    id: 'fixture-legacy', arc: 'v3.1 selftest legacy', register: 'place', map: 'Route104', speaker: 'none',
    tiles: [[1, 2], [3, 4, 'up']], labels: ['Fixture_EventScript_Legacy'], playtests: ['legacy-on-map'],
    mustRead: { Fixture_EventScript_Legacy: ['FLAG_FIXTURE'] }, mustReadScripts: ['Fixture_EventScript_Legacy'],
    visibility: { name: 'fixture', localid: 'LOCALID_FIXTURE', hideFlag: 'FLAG_HIDE_FIXTURE', setup: 'Fixture_OnTransition', species: 'SPECIES_FIXTURE', shows: true },
  };
  const CHECKPOINTS_FIXTURE = [
    'export const CHECKPOINT_NAMES = ["slateport_arrival", "mauville_pre_wattson", "fortree_arrival"] as const;',
    'const SLATEPORT_ARRIVAL: Checkpoint = {', '  flags: [],', '  map: "MAP_ROUTE109",', '};',
    'const MAUVILLE_PRE_WATTSON: Checkpoint = {', '  map: "MAP_MAUVILLE_CITY",', '};',
    'const FORTREE_ARRIVAL: Checkpoint = {', '  vars: { VAR_X: 1 },', '  map: "MAP_FORTREE_CITY",', '};',
    'const union = (a, b) => a;',
  ].join('\n');
  const FIXTURE_PLAYTESTS = {
    'legacy-on-map': { scenario: { map: 'MAP_ROUTE104' }, steps: [] },
    'boots-elsewhere': { scenario: { map: 'MAP_DEWFORD_TOWN' }, steps: [{ walk: 'up' }, { warp: { map: 'MAP_ROUTE106', x: 1, y: 1 } }] },
    'fortree-orphan': { scenario: { checkpoint: 'fortree_arrival' }, steps: [] },
  };
  for (const name of new Set([...STORM_CHARMS.playtests, ...CHARM_KEEPER.playtests]))
    FIXTURE_PLAYTESTS[name] = { scenario: { checkpoint: 'fortree_arrival' }, steps: [] };
  const FIXTURE_MAPS = { FortreeCity: 'MAP_FORTREE_CITY', Route104: 'MAP_ROUTE104', GraniteCave_B1F: 'MAP_GRANITE_CAVE_B1F' };
  // opts.checkpointsTs replaces the checkpoints.ts fixture; opts.extraPlaytests are on "disk" but named by no row.
  const fixtureEnv = (opts = {}) => ({
    checkpointsTs: opts.checkpointsTs || CHECKPOINTS_FIXTURE,
    mapId: (folder) => FIXTURE_MAPS[folder] || null,
    playtest: (name) => FIXTURE_PLAYTESTS[name] || null,
    playtestNames: () => ['legacy-on-map', 'boots-elsewhere', ...STORM_CHARMS.playtests, ...CHARM_KEEPER.playtests, ...(opts.extraPlaytests || [])],
  });
  const runNew = (fixtureRows, opts) => {
    const cross = crossCheck(fixtureRows, fixtureEnv(opts));
    return { errors: [...validateRows(fixtureRows), ...cross.errors], warnings: cross.warnings, stats: cross.stats };
  };
  const show = (list) => list.map((e) => `${e.id} ${e.row}: ${e.msg}`).join(' | ') || 'none';
  const expectClean = (what, r) => {
    if (r.errors.length || r.warnings.length) fail(`${what} should pass: ${show([...r.errors, ...r.warnings])}`);
  };

  expectClean('the v3.5 draft rows', runNew([STORM_CHARMS, CHARM_KEEPER]));
  const base = () => JSON.parse(JSON.stringify([LEGACY, STORM_CHARMS, CHARM_KEEPER]));
  expectClean('the base fixture (legacy + v3.5 rows)', runNew(base()));
  // Alone, the keeper row leaves the storm-charms playtests orphaned (W-ORPHAN): only errors count here.
  const keeperOnly = runNew([CHARM_KEEPER]);
  if (keeperOnly.errors.length) fail(`one v3.5 row alone should pass as RM pending: ${show(keeperOnly.errors)}`);
  if (!keeperOnly.stats.rm.includes('RM pending: v3.5 has 1 row')) fail(`a 1-row version should print "RM pending: v3.5 has 1 row", got ${keeperOnly.stats.rm}`);

  // Each plant: [name, rule id, mutate(base rows), env opts]. The ids it fires
  // (errors and warnings) must be exactly { rule id }.
  const PLANTS = [
    ['SH-REG', 'SH-REG', (r) => { r[0].register = 'smell'; }],
    ['SH-TILE', 'SH-TILE', (r) => { r[0].tiles.push([5, 6, 'north']); }],
    ['SH-MUSTREAD', 'SH-MUSTREAD', (r) => { r[0].mustRead.Fixture_EventScript_Legacy = 'FLAG_FIXTURE'; }],
    ['SH-VIS', 'SH-VIS', (r) => { delete r[0].visibility.shows; }],
    ['SH-B5X', 'SH-B5X', (r) => { r[2].b5Exempt = { '*': 'a v3.5 row may not be exempt' }; }],
    ['B5a', 'B5a', (r) => { r.push({ ...r[0], id: 'fixture-no-playtests', map: 'GraniteCave_B1F', playtests: [] }); }],
    ['B5b', 'B5b', (r) => { r[0].playtests.push('boots-elsewhere'); }],
    ['B5c', 'B5c', () => {}, { checkpointsTs: CHECKPOINTS_FIXTURE.replace('"mauville_pre_wattson", ', '') }],
    ['RM-weather', 'RM', (r) => { r[1].register = 'weather'; }],
    ['RM-mix', 'RM', (r) => { r.push({ ...r[2], id: 'v39-a', arc: 'v3.9 selftest A' }, { ...r[2], id: 'v39-b', arc: 'v3.9 selftest B' }); }],
    ['SF', 'SF', (r) => { r[2].seeFirst = '  '; }],
    ['SFV', 'SFV', (r) => { r[2].seeFirst = 'A woman by the dolls says the storms are coming.'; }],
    ['W-ORPHAN', 'W-ORPHAN', () => {}, { extraPlaytests: ['fortree-orphan'] }],
  ];
  const seenFixtures = new Set();
  let ran = 0;
  for (const [name, id, mutate, opts] of PLANTS) {
    const fixture = base();
    mutate(fixture);
    const key = JSON.stringify([fixture, opts || {}]);
    if (seenFixtures.has(key)) fail(`plant ${name} duplicates another plant's fixture`);
    seenFixtures.add(key);
    const r = runNew(fixture, opts);
    const fired = [...new Set([...r.errors, ...r.warnings].map((e) => e.id))].sort();
    if (fired.join() !== id) fail(`plant ${name}: expected exactly {${id}}, got {${fired.join(', ')}}: ${show([...r.errors, ...r.warnings])}`);
    if (id === 'W-ORPHAN' && r.errors.length) fail('plant W-ORPHAN must warn, not fail');
    ran++;
  }
  // .only guard: every plant ran, and the plants cover NEW_RULES exactly.
  if (ran !== PLANTS.length) fail(`ran ${ran} of ${PLANTS.length} plants`);
  const planted = new Set(PLANTS.map((p) => p[1]));
  const unplanted = NEW_RULES.filter((id) => !planted.has(id));
  const unknown = [...planted].filter((id) => !NEW_RULES.includes(id));
  if (unplanted.length || unknown.length) fail(`plants must cover NEW_RULES exactly: unplanted ${unplanted.join(', ') || '-'}; unknown ${unknown.join(', ') || '-'}`);
  plants += ran;

  console.log(`check_beats selftest: OK (${plants} plants)`);
}

function main() {
  let rows;
  try {
    rows = loadBeats();
  } catch (e) {
    console.error(`check_beats: ${e.message}`);
    for (const p of (e.problems || []).slice(1)) console.error(`check_beats: ${p.id} ${p.row}: ${p.msg}`);
    console.error('check_beats: FAILED (scripts/lib/beats.cjs rejected beats.json)');
    process.exit(1);
  }
  const env = realEnv();
  const errors = check(rows, env);
  const cross = crossCheck(rows, env);
  errors.push(...cross.errors.map((e) => `${e.id} ${e.row}: ${e.msg}`));
  if (errors.length) {
    for (const e of errors) console.error(`check_beats: ${e}`);
    console.error(`check_beats: FAILED (${errors.length} problem(s))`);
    process.exit(1);
  }
  const strangers = rows.filter((r) => r.speaker === 'stranger');
  const allows = rows.reduce((n, r) => n + (r.allow || []).length, 0);
  console.log(`check_beats: OK (${rows.length} rows, ${strangers.length} strangers text-walked, ${allows} allow entries)`);
  const s = cross.stats;
  console.log(`check_beats: B5 OK (${s.reached} playtest(s) reach their row's map; legacy b5Exempt: ${s.exemptRows} whole row(s), ${s.exemptPlaytests} playtest(s))`);
  for (const line of s.rm) console.log(`check_beats: ${line}`);
  console.log(`check_beats: SF OK (${s.seeFirst} v3.4+ row(s) with seeFirst, no speech verbs)`);
  for (const w of cross.warnings) console.log(`check_beats: W-ORPHAN ${w.row}: ${w.msg}`);
  console.log(`check_beats: W-ORPHAN ${s.orphans} orphan playtest(s) (warning only)`);
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}

module.exports = { walkLabels, readString, check, crossCheck, MIN_ROWS };
