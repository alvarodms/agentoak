#!/usr/bin/env node
'use strict';

// Den-tour playtest preset guard (C341).
//
// `make playtest` (PLAYTEST=1) runs EventScript_PlaytestDenTour
// (data/scripts/playtest_den_tour.inc, C339) from NewGameInitData through
// RunScriptImmediately, so testers start a badge-8 save at Lilycove and can go
// straight to the README "Five things we most need eyes on". Nothing else
// checks that preset: a missing prerequisite flag silently mutes a beat (the
// Lilycove old woman needs FLAG_RECEIVED_FIELD_NOTES), a pre-set den, doubt,
// chalk or trade flag spoils the very beat the tester is meant to find, a
// msgbox/warp hangs RunScriptImmediately, and a story NPC whose FLAG_HIDE_* the
// preset forgets stands on the tester's route as if the scene never happened.
//
// Fails (exit 1) when:
//   R1. the preset uses any command other than setflag, clearflag, setvar,
//       setrespawn, givemon, setmonmove, additem, end (synchronous only), or the
//       label / closing `end` is missing;
//   R2. a setflag/clearflag name is not #defined in include/constants/flags.h,
//       a setvar name is not in include/constants/vars.h, or either is *_UNUSED_*;
//   R3. a funnel prerequisite (PREREQ_* tables below) is missing;
//   R4. the preset sets a den's caught flag, gives a den species (both derived
//       from every EventMacro_StaticDen line), or sets a NEVER_SET flag / FLAG_TEMP_*;
//   R5. a BEATS row is dead: its object script is not on the map, its label is
//       missing, or it never reads its flag on a goto/call_if_set/unset line
//       (the C320 dead-script trap);
//   R6. on a den-route map (ROUTE_MAP_PREFIXES), a `removeobject` hides an
//       object whose FLAG_HIDE_* is neither set by the preset, nor set by
//       EventScript_ResetAllMapFlags (data/scripts/new_game.inc, which
//       NewGameInitData runs before the preset) and left alone by the preset,
//       nor allowlisted (HIDE_ALLOWLIST, each entry with a reason; a stale
//       entry also fails).
//
// Usage: node scripts/check_playtest.cjs [--selftest]
//        (run by `make check_playtest`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const PRESET_INC = path.join(ROOT, 'data/scripts/playtest_den_tour.inc');
const NEW_GAME_INC = path.join(ROOT, 'data/scripts/new_game.inc');
const RESET_LABEL = 'EventScript_ResetAllMapFlags';
const MIN_RESET_FLAGS = 100; // C341: 159 setflags; fewer means the parser broke
const FLAGS_H = path.join(ROOT, 'include/constants/flags.h');
const VARS_H = path.join(ROOT, 'include/constants/vars.h');
const LABEL = 'EventScript_PlaytestDenTour';

const ALLOWED_COMMANDS = new Set(['setflag', 'clearflag', 'setvar', 'setrespawn', 'givemon', 'setmonmove', 'additem', 'end']);

// R3: [name, why] pairs; the reason names the README "eyes on" item it breaks.
const PREREQ_FLAGS = [
  ['FLAG_SYS_POKEMON_GET', 'party menu (every item)'],
  ['FLAG_SYS_POKEDEX_GET', 'Pokedex / page inking (items 2, 3, 5)'],
  ['FLAG_SYS_POKENAV_GET', 'PokeNav for the Birch call (item 3)'],
  ['FLAG_ENABLE_PROF_BIRCH_MATCH_CALL', 'Birch in the PokeNav call list (item 3)'],
  ['FLAG_RECEIVED_FIELD_NOTES', 'item 5: without it the Lilycove old woman never speaks'],
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`FLAG_BADGE0${n}_GET`, 'den pages 5/6/7 open on badges 5/6/8 (items 1, 2, 4)']),
];
const PREREQ_ITEMS = [['ITEM_FIELD_NOTES', 'FIELD NOTES pages (items 2, 5)']];
const PREREQ_SPECIES = [
  ['SPECIES_LOTAD_HOENN', 'page 1 inked (item 5 needs the doubt page context; item 3)'],
  ['SPECIES_SHROOMISH_HOENN', 'page 2 inked (item 5; item 3)'],
  ['SPECIES_GLIGAR_HOENN', 'item 5: the old woman only doubts once GLIGAR_HOENN is inked'],
  ['SPECIES_VULPIX_HOENN', 'pages 1-4 inked (item 3)'],
];
const PREREQ_MOVES = [
  ['MOVE_FLY', 'den routes need Fly'],
  ['MOVE_SURF', 'den routes need Surf'],
  ['MOVE_STRENGTH', 'den routes need Strength'],
  ['MOVE_ROCK_SMASH', 'den routes need Rock Smash'],
  ['MOVE_WATERFALL', 'Meteor Falls B1F needs Waterfall'],
];

// R4: flags the tester must trigger personally.
const NEVER_SET = {
  FLAG_LILYCOVE_GLIGAR_DOUBT: 'item 5 beat (the player writes the doubt)',
  FLAG_DEN_SHOAL_TRADE_DONE: 'Shoal Cave den trade beat (item 4)',
  FLAG_DEN_METEOR_STEVEN_CHALK: 'item 1 beat (Steven\'s chalk answer)',
  FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE: 'Granite hiker reward beat',
  FLAG_SYS_GAME_CLEAR: 'postgame branches would contaminate every report',
  FLAG_HIDE_ROUTE104_LOTAD_STUDENT: 'postgame Red Ink coda; Route104 OnTransition owns it',
};
const MIN_DENS = 3;

// R5: beats that must be live in the map data.
const BEATS = [
  { item: 5, map: 'LilycoveCity', script: 'LilycoveCity_EventScript_ExpertF', mustRead: ['FLAG_LILYCOVE_GLIGAR_DOUBT', 'FLAG_RECEIVED_FIELD_NOTES'] },
  { item: 1, map: 'MeteorFalls_B1F_2R', label: 'MeteorFalls_B1F_2R_EventScript_ChalkCopied', mustRead: ['FLAG_DEN_METEOR_STEVEN_CHALK'] },
  // C342 Red Ink coda (postgame; not reachable from the preset, which never sets GAME_CLEAR).
  { item: 'coda', map: 'Route104', label: 'Route104_EventScript_LotadLesson', mustRead: ['FLAG_SYS_GAME_CLEAR', 'FLAG_LILYCOVE_GLIGAR_DOUBT', 'FLAG_HIDE_ROUTE104_LOTAD_STUDENT'] },
  { item: 'coda', map: 'Route104', script: 'Route104_EventScript_LotadStudent', mustRead: [] },
];
const READ_RE = /^(goto_if_set|goto_if_unset|call_if_set|call_if_unset)\s+(\w+)/;

// R6: maps on the den tour (exact name or prefix).
const ROUTE_MAP_PREFIXES = ['LilycoveCity', 'Route121', 'Route122', 'MtPyre_', 'Route114', 'MeteorFalls_', 'MossdeepCity', 'Route125', 'ShoalCave_'];

// '<Map>:<FLAG>': why the preset may leave that FLAG_HIDE_* unset.
const HIDE_ALLOWLIST = {
  'LilycoveCity_LilycoveMuseum_1F:FLAG_HIDE_LILYCOVE_MUSEUM_CURATOR':
    'vanilla minor NPC: removeobject only as he leads the player upstairs (same visit); only the unused ContestLobby SetDebug script sets the flag',
};

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

function splitArgs(rest) {
  return rest.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

// ---- preset parsing ---------------------------------------------------------

// .inc text -> { found, ended, setFlags, clearFlags, setVars, species, items, moves, commands }
function parsePreset(text) {
  const p = { found: false, ended: false, setFlags: [], clearFlags: [], setVars: {}, species: [], items: [], moves: [], commands: [] };
  const lines = text.split('\n').map((l) => stripComment(l).trim());
  const start = lines.findIndex((l) => l === `${LABEL}::`);
  if (start < 0) return p;
  p.found = true;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (/^\w+::?$/.test(line)) break; // next label before `end`: block falls through
    const m = /^(\S+)\s*(.*)$/.exec(line);
    const cmd = m[1];
    const args = splitArgs(m[2]);
    p.commands.push({ cmd, line: i + 1 });
    if (cmd === 'setflag') p.setFlags.push(args[0]);
    else if (cmd === 'clearflag') p.clearFlags.push(args[0]);
    else if (cmd === 'setvar') p.setVars[args[0]] = args[1];
    else if (cmd === 'givemon') p.species.push(args[0]);
    else if (cmd === 'additem') p.items.push(args[0]);
    else if (cmd === 'setmonmove') p.moves.push(args[2]);
    else if (cmd === 'end') {
      p.ended = true;
      break;
    }
  }
  return p;
}

// new_game.inc text -> setflag names in EventScript_ResetAllMapFlags (up to its `end`)
function parseResetFlags(text) {
  const flags = new Set();
  const lines = text.split('\n').map((l) => stripComment(l).trim());
  const start = lines.findIndex((l) => l === `${RESET_LABEL}::`);
  if (start < 0) return flags;
  for (let i = start + 1; i < lines.length && lines[i] !== 'end'; i++) {
    const m = /^setflag\s+(\w+)/.exec(lines[i]);
    if (m) flags.add(m[1]);
  }
  return flags;
}

// ---- rules ------------------------------------------------------------------

function checkSync(p, errors) {
  if (!p.found) {
    errors.push(`R1 label ${LABEL}:: not found`);
    return;
  }
  if (!p.ended) errors.push(`R1 ${LABEL} does not end with \`end\` (falls through)`);
  for (const c of p.commands) {
    if (!ALLOWED_COMMANDS.has(c.cmd))
      errors.push(`R1 line ${c.line}: \`${c.cmd}\` is not allowed; RunScriptImmediately cannot run msgbox/delay/warp/waitstate/call/goto`);
  }
}

function checkNames(p, flagNames, varNames, errors) {
  for (const f of [...p.setFlags, ...p.clearFlags]) {
    if (!flagNames.has(f)) errors.push(`R2 ${f} is not #defined in include/constants/flags.h`);
    if (/^FLAG_UNUSED_/.test(f)) errors.push(`R2 ${f} is an unused slot; rename it in flags.h first`);
  }
  for (const v of Object.keys(p.setVars)) {
    if (!varNames.has(v)) errors.push(`R2 ${v} is not #defined in include/constants/vars.h`);
    if (/^VAR_UNUSED_/.test(v)) errors.push(`R2 ${v} is an unused slot; rename it in vars.h first`);
  }
}

function checkPrereqs(p, errors) {
  const need = (list, have, verb) => {
    for (const [name, why] of list)
      if (!have.includes(name)) errors.push(`R3 missing \`${verb} ${name}\` (${why})`);
  };
  need(PREREQ_FLAGS, p.setFlags, 'setflag');
  need(PREREQ_ITEMS, p.items, 'additem');
  need(PREREQ_SPECIES, p.species, 'givemon');
  need(PREREQ_MOVES, p.moves, 'setmonmove');
}

// scripts.inc text -> [{ species, caughtFlag }]
function parseDens(text) {
  const dens = [];
  for (const raw of text.split('\n')) {
    const m = /^EventMacro_StaticDen\s+(.*)$/.exec(stripComment(raw).trim());
    if (!m) continue;
    const args = splitArgs(m[1]);
    if (args.length >= 4) dens.push({ species: args[0], caughtFlag: args[3] });
  }
  return dens;
}

function checkNothingPreTriggered(p, dens, errors) {
  if (dens.length < MIN_DENS) errors.push(`R4 only ${dens.length} EventMacro_StaticDen lines found (< ${MIN_DENS}; parser drift?)`);
  for (const d of dens) {
    if (p.setFlags.includes(d.caughtFlag)) errors.push(`R4 sets den caught flag ${d.caughtFlag}: the tester must catch it`);
    if (p.species.includes(d.species)) errors.push(`R4 gives den species ${d.species}: the tester must catch it in its den`);
  }
  for (const f of p.setFlags) {
    if (NEVER_SET[f]) errors.push(`R4 sets ${f} ahead of the player (${NEVER_SET[f]})`);
    if (/^FLAG_TEMP_/.test(f)) errors.push(`R4 sets ${f}: temp flags are cleared on map load and mean nothing here`);
  }
}

// ---- map data -----------------------------------------------------------------

const isLiteral = (s) => /^(0x[0-9A-Fa-f]+|\d+)$/.test(s);

function readMapJson(mapName) {
  const file = path.join(MAPS_DIR, mapName, 'map.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function readScripts(mapName) {
  const file = path.join(MAPS_DIR, mapName, 'scripts.inc');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

// Same resolution as check_object_tiles.cjs: 1-based index for numeric ids, else `local_id`.
function findObject(map, localid) {
  const objs = map.object_events || [];
  if (isLiteral(localid)) {
    const i = Number(localid);
    return i >= 1 && i <= objs.length ? objs[i - 1] : null;
  }
  return objs.find((o) => o.local_id === localid) || null;
}

function definedNames(file) {
  const names = new Set();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = /^\s*#define\s+(\w+)\b/.exec(line);
    if (m) names.add(m[1]);
  }
  return names;
}

function flagsRead(text) {
  const read = new Set();
  for (const raw of text.split('\n')) {
    const m = READ_RE.exec(stripComment(raw).trim());
    if (m) read.add(m[2]);
  }
  return read;
}

function checkBeats(errors) {
  for (const b of BEATS) {
    const where = `R5 item ${b.item} (${b.map})`;
    const text = readScripts(b.map);
    if (text === null) {
      errors.push(`${where}: no data/maps/${b.map}/scripts.inc`);
      continue;
    }
    const label = b.script || b.label;
    const hasLabel = text.split('\n').some((l) => stripComment(l).trim() === `${label}::`);
    if (!hasLabel) errors.push(`${where}: label ${label}:: not found in scripts.inc`);
    if (b.script) {
      const map = readMapJson(b.map);
      if (!map || !(map.object_events || []).some((o) => o.script === b.script))
        errors.push(`${where}: no object_event in map.json runs ${b.script} (dead script)`);
    }
    const read = flagsRead(text);
    for (const f of b.mustRead)
      if (!read.has(f)) errors.push(`${where}: ${f} is never read by goto_if_set/unset or call_if_set/unset`);
  }
}

function checkRouteHides(p, resetFlags, errors) {
  const stats = { checked: 0, unresolved: 0, allowlisted: 0, reset: 0 };
  if (resetFlags.size < MIN_RESET_FLAGS)
    errors.push(`R6 only ${resetFlags.size} setflags parsed from ${RESET_LABEL} (< ${MIN_RESET_FLAGS}; parser broke?)`);
  const allowUsed = new Set();
  const seen = new Set();
  const mapNames = fs.readdirSync(MAPS_DIR)
    .filter((d) => fs.statSync(path.join(MAPS_DIR, d)).isDirectory())
    .filter((d) => ROUTE_MAP_PREFIXES.some((pre) => d === pre || d.startsWith(pre)))
    .sort();
  for (const mapName of mapNames) {
    const text = readScripts(mapName);
    if (text === null) continue;
    const map = readMapJson(mapName);
    for (const raw of text.split('\n')) {
      const m = /^removeobject\s+(\S+)/.exec(stripComment(raw).trim());
      if (!m) continue;
      const arg = m[1].replace(/,$/, '');
      const obj = !map || /^VAR_/.test(arg) ? null : findObject(map, arg);
      if (!obj) {
        stats.unresolved++;
        continue;
      }
      const flag = String(obj.flag);
      if (!flag.startsWith('FLAG_HIDE_')) continue;
      const key = `${mapName}:${flag}`;
      if (seen.has(`${key}:${arg}`)) continue;
      seen.add(`${key}:${arg}`);
      stats.checked++;
      if (p.setFlags.includes(flag)) continue;
      if (resetFlags.has(flag) && !p.clearFlags.includes(flag)) {
        stats.reset++;
        continue;
      }
      if (key in HIDE_ALLOWLIST) {
        allowUsed.add(key);
        stats.allowlisted++;
        continue;
      }
      errors.push(`R6 ${mapName}: removeobject ${arg} hides with ${flag}, which the den tour neither sets nor allowlists`);
    }
  }
  for (const key of Object.keys(HIDE_ALLOWLIST))
    if (!allowUsed.has(key)) errors.push(`R6 HIDE_ALLOWLIST ${key}: stale (no unset removeobject hide matches it)`);
  return stats;
}

// ---- selftest -----------------------------------------------------------------

function selftest() {
  const fail = (msg) => {
    console.error(`check_playtest: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const good = [
    `${LABEL}::`,
    ...PREREQ_FLAGS.map(([f]) => `\tsetflag ${f}`),
    '\tsetvar VAR_ROUTE121_STATE, 1 @ comment',
    '\tsetrespawn HEAL_LOCATION_LILYCOVE_CITY',
    '\tgivemon SPECIES_SWELLOW, 42',
    ...PREREQ_MOVES.map(([mv], i) => `\tsetmonmove 0, ${i % 4}, ${mv}`),
    ...PREREQ_SPECIES.map(([s]) => `\tgivemon ${s}, 20`),
    ...PREREQ_ITEMS.map(([it]) => `\tadditem ${it}`),
    '\tend',
    'Unrelated::',
    '\tmsgbox X, MSGBOX_DEFAULT',
  ];
  const denFixture = [
    'EventMacro_StaticDen SPECIES_TREECKO_HOENN, 40, ITEM_MOON_STONE, FLAG_CAUGHT_A, T1, T2, T3',
    '\tEventMacro_StaticDen SPECIES_TORCHIC_HOENN, 30, ITEM_STAR_PIECE, FLAG_CAUGHT_B, T1, T2, T3, S',
    'EventMacro_StaticDen SPECIES_MUDKIP_HOENN, 38, ITEM_SHELL_BELL, FLAG_CAUGHT_C, T1, T2, T3, S',
  ].join('\n');
  const dens = parseDens(denFixture);
  if (dens.length !== 3 || dens[2].species !== 'SPECIES_MUDKIP_HOENN' || dens[1].caughtFlag !== 'FLAG_CAUGHT_B')
    fail(`den fixture parsed as ${JSON.stringify(dens)}`);

  const run = (lines) => {
    const p = parsePreset(lines.join('\n'));
    const errors = [];
    checkSync(p, errors);
    checkPrereqs(p, errors);
    checkNothingPreTriggered(p, dens, errors);
    return errors;
  };
  const withLine = (line) => {
    const out = good.slice();
    out.splice(out.indexOf('\tend'), 0, line);
    return out;
  };

  const ok = run(good);
  if (ok.length) fail(`good block reported: ${ok.join('; ')}`);
  if (!run(withLine('\tmsgbox X, MSGBOX_DEFAULT')).some((e) => e.startsWith('R1'))) fail('msgbox not reported (R1)');
  if (!run(good.filter((l) => l !== '\tsetflag FLAG_RECEIVED_FIELD_NOTES')).some((e) => e.startsWith('R3') && e.includes('FLAG_RECEIVED_FIELD_NOTES')))
    fail('missing FLAG_RECEIVED_FIELD_NOTES not reported (R3)');
  if (!run(withLine('\tsetflag FLAG_LILYCOVE_GLIGAR_DOUBT')).some((e) => e.startsWith('R4') && e.includes('FLAG_LILYCOVE_GLIGAR_DOUBT')))
    fail('pre-set FLAG_LILYCOVE_GLIGAR_DOUBT not reported (R4)');
  if (!run(withLine('\tsetflag FLAG_HIDE_ROUTE104_LOTAD_STUDENT')).some((e) => e.startsWith('R4') && e.includes('FLAG_HIDE_ROUTE104_LOTAD_STUDENT')))
    fail('pre-set FLAG_HIDE_ROUTE104_LOTAD_STUDENT not reported (R4)');
  if (!run(withLine('\tgivemon SPECIES_MUDKIP_HOENN, 38')).some((e) => e.startsWith('R4') && e.includes('SPECIES_MUDKIP_HOENN')))
    fail('den species givemon not reported (R4)');
  if (!run(good.filter((l) => l !== '\tend')).some((e) => e.startsWith('R1'))) fail('missing end not reported (R1)');
  if (!run(['Other::', '\tend']).some((e) => e.startsWith('R1'))) fail('missing label not reported (R1)');
  console.log('check_playtest selftest: OK');
}

// ---- main -----------------------------------------------------------------

function main() {
  const errors = [];
  const p = parsePreset(fs.readFileSync(PRESET_INC, 'utf8'));
  checkSync(p, errors);
  checkNames(p, definedNames(FLAGS_H), definedNames(VARS_H), errors);
  checkPrereqs(p, errors);

  const dens = [];
  for (const d of fs.readdirSync(MAPS_DIR).sort()) {
    const text = readScripts(d);
    if (text !== null) dens.push(...parseDens(text));
  }
  checkNothingPreTriggered(p, dens, errors);
  checkBeats(errors);
  const hides = checkRouteHides(p, parseResetFlags(fs.readFileSync(NEW_GAME_INC, 'utf8')), errors);

  if (errors.length) {
    console.error(`check_playtest: ${errors.length} problem(s) in data/scripts/playtest_den_tour.inc`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`check_playtest: OK (${p.setFlags.length + p.clearFlags.length} flags, ${Object.keys(p.setVars).length} vars, ` +
    `${p.species.length} mons, ${p.items.length} items checked; ${dens.length} dens, ${BEATS.length} beats, ` +
    `${hides.checked} route hides (${hides.reset} via ${RESET_LABEL}, ${hides.allowlisted} allowlisted), ${hides.unresolved} removeobject unresolved)`);
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
