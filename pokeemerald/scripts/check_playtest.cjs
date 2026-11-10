#!/usr/bin/env node
'use strict';

// Playtest preset guard (C341; table-driven since C343).
//
// Two presets run from NewGameInitData through RunScriptImmediately:
//   den  `make playtest` (PLAYTEST=1): EventScript_PlaytestDenTour
//        (data/scripts/playtest_den_tour.inc, C339), a badge-8 save at Lilycove
//        for the README "Five things we most need eyes on";
//   coda `make playtest_coda` (PLAYTEST=2): EventScript_PlaytestCoda
//        (data/scripts/playtest_coda.inc, C343), a cleared save at Petalburg for
//        the C342 Red Ink coda on Route 104, Lilycove doubt not yet written.
// Each preset is one PRESETS row; every rule below runs per preset and errors
// are prefixed [<name>]. Nothing else checks the presets: a missing prerequisite flag silently mutes a beat (the
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
//   R3. a funnel prerequisite (the preset's prereq* tables) is missing, or a
//       prereqVars var is not `setvar`ed to exactly its listed value;
//   R4. the preset sets a den's caught flag, gives a den species (both derived
//       from every EventMacro_StaticDen line; both presets), or sets one of its
//       neverSet flags / any FLAG_TEMP_*;
//   R5. a BEATS row is dead: its object script is not on the map, its label is
//       missing, or it never reads its flag on a goto/call_if_set/unset line
//       (the C320 dead-script trap);
//   R6. on a route map (the preset's routeMaps prefixes/exact), a `removeobject` hides an
//       object whose FLAG_HIDE_* is neither set by the preset, nor set by
//       EventScript_ResetAllMapFlags (data/scripts/new_game.inc, which
//       NewGameInitData runs before the preset) and left alone by the preset,
//       nor allowlisted (the preset's hideAllowlist, each entry with a reason;
//       a stale entry also fails).
//
// Adding a preset = new .inc + PRESETS row here + new_game.c branch + Makefile target.
//
// Usage: node scripts/check_playtest.cjs [--selftest]
//        (run by `make check_playtest`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const NEW_GAME_INC = path.join(ROOT, 'data/scripts/new_game.inc');
const RESET_LABEL = 'EventScript_ResetAllMapFlags';
const MIN_RESET_FLAGS = 100; // C341: 159 setflags; fewer means the parser broke
const FLAGS_H = path.join(ROOT, 'include/constants/flags.h');
const VARS_H = path.join(ROOT, 'include/constants/vars.h');

const ALLOWED_COMMANDS = new Set(['setflag', 'clearflag', 'setvar', 'setrespawn', 'givemon', 'setmonmove', 'additem', 'end']);

const BADGES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `FLAG_BADGE0${n}_GET`);
const LILYCOVE_CURATOR_ALLOW = {
  'LilycoveCity_LilycoveMuseum_1F:FLAG_HIDE_LILYCOVE_MUSEUM_CURATOR':
    'vanilla minor NPC: removeobject only as he leads the player upstairs (same visit); only the unused ContestLobby SetDebug script sets the flag',
};

// One row per preset. prereq*: [name, why] pairs (R3; den reasons name the README
// "eyes on" item they break). prereqVars: [VAR, value, why] (R3, exact setvar).
// neverSet: flags the tester must trigger personally (R4). routeMaps: maps the
// tester walks (R6, prefix or exact name). hideAllowlist: '<Map>:<FLAG>': why the
// preset may leave that FLAG_HIDE_* unset (R6).
const PRESETS = [
  {
    name: 'den',
    file: 'data/scripts/playtest_den_tour.inc',
    label: 'EventScript_PlaytestDenTour',
    prereqFlags: [
      ['FLAG_SYS_POKEMON_GET', 'party menu (every item)'],
      ['FLAG_SYS_POKEDEX_GET', 'Pokedex / page inking (items 2, 3, 5)'],
      ['FLAG_SYS_POKENAV_GET', 'PokeNav for the Birch call (item 3)'],
      ['FLAG_ENABLE_PROF_BIRCH_MATCH_CALL', 'Birch in the PokeNav call list (item 3)'],
      ['FLAG_RECEIVED_FIELD_NOTES', 'item 5: without it the Lilycove old woman never speaks'],
      ...BADGES.map((f) => [f, 'den pages 5/6/7 open on badges 5/6/8 (items 1, 2, 4)']),
    ],
    prereqItems: [['ITEM_FIELD_NOTES', 'FIELD NOTES pages (items 2, 5)']],
    prereqSpecies: [
      ['SPECIES_LOTAD_HOENN', 'page 1 inked (item 5 needs the doubt page context; item 3)'],
      ['SPECIES_SHROOMISH_HOENN', 'page 2 inked (item 5; item 3)'],
      ['SPECIES_GLIGAR_HOENN', 'item 5: the old woman only doubts once GLIGAR_HOENN is inked'],
      ['SPECIES_VULPIX_HOENN', 'pages 1-4 inked (item 3)'],
    ],
    prereqMoves: [
      ['MOVE_FLY', 'den routes need Fly'],
      ['MOVE_SURF', 'den routes need Surf'],
      ['MOVE_STRENGTH', 'den routes need Strength'],
      ['MOVE_ROCK_SMASH', 'den routes need Rock Smash'],
      ['MOVE_WATERFALL', 'Meteor Falls B1F needs Waterfall'],
    ],
    prereqVars: [],
    neverSet: {
      FLAG_LILYCOVE_GLIGAR_DOUBT: 'item 5 beat (the player writes the doubt)',
      FLAG_DEN_SHOAL_TRADE_DONE: 'Shoal Cave den trade beat (item 4)',
      FLAG_DEN_METEOR_STEVEN_CHALK: 'item 1 beat (Steven\'s chalk answer)',
      FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE: 'Granite hiker reward beat',
      FLAG_SYS_GAME_CLEAR: 'postgame branches would contaminate every report',
      FLAG_HIDE_ROUTE104_LOTAD_STUDENT: 'postgame Red Ink coda; Route104 OnTransition owns it',
      FLAG_HIDE_ROUTE106_TIDE_HIKER: 'postgame v3.1 Beat A; Route106 OnTransition owns it',
      FLAG_HIDE_ROUTE119_STORM_CHASER: 'postgame v3.1 Beat B; Route119 OnTransition owns it',
      FLAG_HIDE_ROUTE113_ASH_CAMPER: 'postgame v3.1 Beat C; Route113 OnTransition owns it',
      FLAG_HIDE_GRANITE_CAVE_B1F_HIKER: 'postgame v3.1 Beat A; GraniteCave_B1F OnTransition owns it',
    },
    routeMaps: {
      prefixes: ['LilycoveCity', 'Route121', 'Route122', 'MtPyre_', 'Route114', 'MeteorFalls_', 'MossdeepCity', 'Route125', 'ShoalCave_'],
      exact: [],
    },
    hideAllowlist: { ...LILYCOVE_CURATOR_ALLOW },
  },
  {
    name: 'coda',
    file: 'data/scripts/playtest_coda.inc',
    label: 'EventScript_PlaytestCoda',
    prereqFlags: [
      ['FLAG_SYS_POKEMON_GET', 'party menu'],
      ['FLAG_SYS_POKEDEX_GET', 'page inking'],
      ['FLAG_RECEIVED_FIELD_NOTES', 'the Lilycove old woman only speaks with FIELD NOTES; page 3 shows the doubt'],
      ['FLAG_SYS_GAME_CLEAR', 'Route104 SetupLotadLesson needs it: no girl, no class'],
      ['FLAG_VISITED_LILYCOVE_CITY', 'Fly to Lilycove to write the doubt'],
      ['FLAG_VISITED_PETALBURG_CITY', 'Fly back to Petalburg'],
      ['FLAG_VISITED_DEWFORD_TOWN', 'v3.1 Beat A: Fly to Dewford for the Route 106 tide hiker'],
      ['FLAG_VISITED_MAUVILLE_CITY', 'v3.1 Beat B: Fly to Mauville, Route 118 -> Route 119 TESSA (20,110)'],
      ['FLAG_VISITED_FALLARBOR_TOWN', 'v3.1 Beat C: Fly to Fallarbor for Route 113 ELLIS'],
      ['FLAG_VISITED_FORTREE_CITY', 'v3.1 Beat B: alternate way down Route 119'],
      ...BADGES.map((f) => [f, 'Fly and Surf in the field']),
    ],
    prereqItems: [['ITEM_FIELD_NOTES', 'FIELD NOTES page 3 shows the doubt']],
    prereqSpecies: [
      ['SPECIES_LOTAD_HOENN', 'page 1 inked: the lesson recites it; v3.1 Beat B (TESSA) needs it caught'],
      ['SPECIES_GLIGAR_HOENN', 'page 3 inked: the doubt and the lesson page 3 need it; v3.1 Beat A needs it caught'],
      ['SPECIES_VULPIX_HOENN', 'v3.1 Beat C: ELLIS appears only with VULPIX_HOENN caught'],
    ],
    prereqMoves: [
      ['MOVE_FLY', 'Fly between Petalburg and Lilycove'],
      ['MOVE_SURF', 'Surf in the field'],
    ],
    prereqVars: [
      ['VAR_ROUTE104_STATE', '2', 'VAR 0 fires the Migration glimpse coord events, 1 the rival'],
      ['VAR_PETALBURG_CITY_STATE', '5', 'state 0 runs the gym-guide coord scenes on the walk to Route 104'],
    ],
    neverSet: {
      FLAG_LILYCOVE_GLIGAR_DOUBT: 'the tester writes the doubt between the two Route 104 visits',
      FLAG_HIDE_ROUTE104_LOTAD_STUDENT: 'Route104 OnTransition owns it',
      FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE: 'v3.1 Beat A HARD_STONE fallback: the tide hiker must give it on first talk',
      FLAG_HIDE_ROUTE106_TIDE_HIKER: 'postgame v3.1 Beat A; Route106 OnTransition owns it',
      FLAG_HIDE_ROUTE119_STORM_CHASER: 'postgame v3.1 Beat B; Route119 OnTransition owns it',
      FLAG_HIDE_ROUTE113_ASH_CAMPER: 'postgame v3.1 Beat C; Route113 OnTransition owns it',
      FLAG_HIDE_GRANITE_CAVE_B1F_HIKER: 'postgame v3.1 Beat A; GraniteCave_B1F OnTransition owns it',
    },
    routeMaps: {
      prefixes: ['Route104', 'LilycoveCity'],
      exact: ['PetalburgCity', 'PetalburgCity_PokemonCenter_1F'],
    },
    hideAllowlist: { ...LILYCOVE_CURATOR_ALLOW },
  },
];
const MIN_DENS = 3;

// R5: beats that must be live in the map data (shared by every preset).
const BEATS = [
  { item: 5, map: 'LilycoveCity', script: 'LilycoveCity_EventScript_ExpertF', mustRead: ['FLAG_LILYCOVE_GLIGAR_DOUBT', 'FLAG_RECEIVED_FIELD_NOTES'] },
  { item: 1, map: 'MeteorFalls_B1F_2R', label: 'MeteorFalls_B1F_2R_EventScript_ChalkCopied', mustRead: ['FLAG_DEN_METEOR_STEVEN_CHALK'] },
  // C342 Red Ink coda (postgame): reachable via `make playtest_coda` (C343), not from the den tour.
  { item: 'coda', map: 'Route104', label: 'Route104_EventScript_LotadLesson', mustRead: ['FLAG_SYS_GAME_CLEAR', 'FLAG_LILYCOVE_GLIGAR_DOUBT', 'FLAG_HIDE_ROUTE104_LOTAD_STUDENT'] },
  { item: 'coda', map: 'Route104', script: 'Route104_EventScript_LotadStudent', mustRead: [] },
  // C348 v3.1 Beat A (postgame): reachable via make playtest_coda (GAME_CLEAR + GLIGAR_HOENN) (C351: preset sets VISITED_DEWFORD_TOWN, R3).
  { item: 'coda', map: 'Route106', label: 'Route106_OnTransition', mustRead: ['FLAG_SYS_GAME_CLEAR'] },
  { item: 'coda', map: 'Route106', script: 'Route106_EventScript_TideHiker', mustRead: ['FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE'] },
  { item: 'coda', map: 'GraniteCave_B1F', label: 'GraniteCave_B1F_EventScript_SetupHikerLeft', mustRead: ['FLAG_SYS_GAME_CLEAR'] },
  // C349 v3.1 Beat B (postgame): reachable via make playtest_coda (GAME_CLEAR + LOTAD_HOENN) (C351: preset sets VISITED_MAUVILLE_CITY + VISITED_FORTREE_CITY, R3).
  { item: 'coda', map: 'Route119', label: 'Route119_EventScript_SetupStormChaser', mustRead: ['FLAG_SYS_GAME_CLEAR'] },
  { item: 'coda', map: 'Route119', script: 'Route119_EventScript_StormChaser', mustRead: [] },
  // C350 v3.1 Beat C (postgame): reachable via make playtest_coda (GAME_CLEAR + VULPIX_HOENN) (C351: preset sets VISITED_FALLARBOR_TOWN, R3).
  { item: 'coda', map: 'Route113', label: 'Route113_EventScript_SetupAshCamper', mustRead: ['FLAG_SYS_GAME_CLEAR'] },
  { item: 'coda', map: 'Route113', script: 'Route113_EventScript_AshCamper', mustRead: [] },
];
const READ_RE = /^(goto_if_set|goto_if_unset|call_if_set|call_if_unset)\s+(\w+)/;

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

function splitArgs(rest) {
  return rest.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

// ---- preset parsing ---------------------------------------------------------

// .inc text -> { found, ended, setFlags, clearFlags, setVars, species, items, moves, commands }
function parsePreset(text, label) {
  const p = { found: false, ended: false, setFlags: [], clearFlags: [], setVars: {}, species: [], items: [], moves: [], commands: [] };
  const lines = text.split('\n').map((l) => stripComment(l).trim());
  const start = lines.findIndex((l) => l === `${label}::`);
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

function checkSync(p, preset, errors) {
  if (!p.found) {
    errors.push(`R1 label ${preset.label}:: not found`);
    return;
  }
  if (!p.ended) errors.push(`R1 ${preset.label} does not end with \`end\` (falls through)`);
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

function checkPrereqs(p, preset, errors) {
  const need = (list, have, verb) => {
    for (const [name, why] of list)
      if (!have.includes(name)) errors.push(`R3 missing \`${verb} ${name}\` (${why})`);
  };
  need(preset.prereqFlags, p.setFlags, 'setflag');
  need(preset.prereqItems, p.items, 'additem');
  need(preset.prereqSpecies, p.species, 'givemon');
  need(preset.prereqMoves, p.moves, 'setmonmove');
  for (const [v, value, why] of preset.prereqVars) {
    if (!(v in p.setVars)) errors.push(`R3 missing \`setvar ${v}, ${value}\` (${why})`);
    else if (p.setVars[v] !== value) errors.push(`R3 \`setvar ${v}, ${p.setVars[v]}\` must be ${value} (${why})`);
  }
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

function checkNothingPreTriggered(p, preset, dens, errors) {
  if (dens.length < MIN_DENS) errors.push(`R4 only ${dens.length} EventMacro_StaticDen lines found (< ${MIN_DENS}; parser drift?)`);
  for (const d of dens) {
    if (p.setFlags.includes(d.caughtFlag)) errors.push(`R4 sets den caught flag ${d.caughtFlag}: the tester must catch it`);
    if (p.species.includes(d.species)) errors.push(`R4 gives den species ${d.species}: the tester must catch it in its den`);
  }
  for (const f of p.setFlags) {
    if (preset.neverSet[f]) errors.push(`R4 sets ${f} ahead of the player (${preset.neverSet[f]})`);
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

function checkRouteHides(p, preset, resetFlags, errors) {
  const { prefixes, exact } = preset.routeMaps;
  const allow = preset.hideAllowlist;
  const stats = { checked: 0, unresolved: 0, allowlisted: 0, reset: 0 };
  if (resetFlags.size < MIN_RESET_FLAGS)
    errors.push(`R6 only ${resetFlags.size} setflags parsed from ${RESET_LABEL} (< ${MIN_RESET_FLAGS}; parser broke?)`);
  const allowUsed = new Set();
  const seen = new Set();
  const mapNames = fs.readdirSync(MAPS_DIR)
    .filter((d) => fs.statSync(path.join(MAPS_DIR, d)).isDirectory())
    .filter((d) => exact.includes(d) || prefixes.some((pre) => d.startsWith(pre)))
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
      if (key in allow) {
        allowUsed.add(key);
        stats.allowlisted++;
        continue;
      }
      errors.push(`R6 ${mapName}: removeobject ${arg} hides with ${flag}, which the preset neither sets nor allowlists`);
    }
  }
  for (const key of Object.keys(allow))
    if (!allowUsed.has(key)) errors.push(`R6 hideAllowlist ${key}: stale (no unset removeobject hide matches it)`);
  return stats;
}

// ---- selftest -----------------------------------------------------------------

// A minimal block that satisfies every prereq table of `preset`.
function goodBlock(preset) {
  return [
    `${preset.label}::`,
    ...preset.prereqFlags.map(([f]) => `\tsetflag ${f}`),
    '\tsetvar VAR_ROUTE121_STATE, 1 @ comment',
    ...preset.prereqVars.map(([v, value]) => `\tsetvar ${v}, ${value}`),
    '\tsetrespawn HEAL_LOCATION_LILYCOVE_CITY',
    '\tgivemon SPECIES_SWELLOW, 42',
    ...preset.prereqMoves.map(([mv], i) => `\tsetmonmove 0, ${i % 4}, ${mv}`),
    ...preset.prereqSpecies.map(([s]) => `\tgivemon ${s}, 20`),
    ...preset.prereqItems.map(([it]) => `\tadditem ${it}`),
    '\tend',
    'Unrelated::',
    '\tmsgbox X, MSGBOX_DEFAULT',
  ];
}

function selftest() {
  const fail = (msg) => {
    console.error(`check_playtest: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const den = PRESETS.find((pr) => pr.name === 'den');
  const coda = PRESETS.find((pr) => pr.name === 'coda');
  if (!den || !coda) fail('PRESETS must contain den and coda');
  const denFixture = [
    'EventMacro_StaticDen SPECIES_TREECKO_HOENN, 40, ITEM_MOON_STONE, FLAG_CAUGHT_A, T1, T2, T3',
    '\tEventMacro_StaticDen SPECIES_TORCHIC_HOENN, 30, ITEM_STAR_PIECE, FLAG_CAUGHT_B, T1, T2, T3, S',
    'EventMacro_StaticDen SPECIES_MUDKIP_HOENN, 38, ITEM_SHELL_BELL, FLAG_CAUGHT_C, T1, T2, T3, S',
  ].join('\n');
  const dens = parseDens(denFixture);
  if (dens.length !== 3 || dens[2].species !== 'SPECIES_MUDKIP_HOENN' || dens[1].caughtFlag !== 'FLAG_CAUGHT_B')
    fail(`den fixture parsed as ${JSON.stringify(dens)}`);

  const run = (preset, lines) => {
    const p = parsePreset(lines.join('\n'), preset.label);
    const errors = [];
    checkSync(p, preset, errors);
    checkPrereqs(p, preset, errors);
    checkNothingPreTriggered(p, preset, dens, errors);
    return errors;
  };
  const withLine = (lines, line) => {
    const out = lines.slice();
    out.splice(out.indexOf('\tend'), 0, line);
    return out;
  };
  const has = (errors, rule, name) => errors.some((e) => e.startsWith(rule) && e.includes(name));

  // den tour (C341 cases)
  const good = goodBlock(den);
  const ok = run(den, good);
  if (ok.length) fail(`good den block reported: ${ok.join('; ')}`);
  if (!run(den, withLine(good, '\tmsgbox X, MSGBOX_DEFAULT')).some((e) => e.startsWith('R1'))) fail('msgbox not reported (R1)');
  if (!has(run(den, good.filter((l) => l !== '\tsetflag FLAG_RECEIVED_FIELD_NOTES')), 'R3', 'FLAG_RECEIVED_FIELD_NOTES'))
    fail('missing FLAG_RECEIVED_FIELD_NOTES not reported (R3)');
  if (!has(run(den, withLine(good, '\tsetflag FLAG_LILYCOVE_GLIGAR_DOUBT')), 'R4', 'FLAG_LILYCOVE_GLIGAR_DOUBT'))
    fail('pre-set FLAG_LILYCOVE_GLIGAR_DOUBT not reported (R4)');
  if (!has(run(den, withLine(good, '\tsetflag FLAG_HIDE_ROUTE104_LOTAD_STUDENT')), 'R4', 'FLAG_HIDE_ROUTE104_LOTAD_STUDENT'))
    fail('pre-set FLAG_HIDE_ROUTE104_LOTAD_STUDENT not reported (R4)');
  if (!has(run(den, withLine(good, '\tgivemon SPECIES_MUDKIP_HOENN, 38')), 'R4', 'SPECIES_MUDKIP_HOENN'))
    fail('den species givemon not reported (R4)');
  if (!run(den, good.filter((l) => l !== '\tend')).some((e) => e.startsWith('R1'))) fail('missing end not reported (R1)');
  if (!run(den, ['Other::', '\tend']).some((e) => e.startsWith('R1'))) fail('missing label not reported (R1)');
  // (e) the den tour still rejects GAME_CLEAR
  if (!has(run(den, withLine(good, '\tsetflag FLAG_SYS_GAME_CLEAR')), 'R4', 'FLAG_SYS_GAME_CLEAR'))
    fail('den: pre-set FLAG_SYS_GAME_CLEAR not reported (R4)');

  // coda (C343 cases)
  const goodCoda = goodBlock(coda);
  const okCoda = run(coda, goodCoda); // (a)
  if (okCoda.length) fail(`good coda block reported: ${okCoda.join('; ')}`);
  if (!has(run(coda, goodCoda.filter((l) => l !== '\tsetflag FLAG_SYS_GAME_CLEAR')), 'R3', 'FLAG_SYS_GAME_CLEAR')) // (b)
    fail('coda: missing FLAG_SYS_GAME_CLEAR not reported (R3)');
  if (!has(run(coda, withLine(goodCoda, '\tsetflag FLAG_LILYCOVE_GLIGAR_DOUBT')), 'R4', 'FLAG_LILYCOVE_GLIGAR_DOUBT')) // (c)
    fail('coda: pre-set FLAG_LILYCOVE_GLIGAR_DOUBT not reported (R4)');
  const wrongVar = goodCoda.map((l) => (l === '\tsetvar VAR_ROUTE104_STATE, 2' ? '\tsetvar VAR_ROUTE104_STATE, 0' : l));
  if (wrongVar.join() === goodCoda.join()) fail('coda fixture lacks setvar VAR_ROUTE104_STATE, 2');
  if (!has(run(coda, wrongVar), 'R3', 'VAR_ROUTE104_STATE')) // (d)
    fail('coda: VAR_ROUTE104_STATE 0 not reported (R3)');
  if (!has(run(coda, goodCoda.filter((l) => l !== '\tsetvar VAR_PETALBURG_CITY_STATE, 5')), 'R3', 'VAR_PETALBURG_CITY_STATE'))
    fail('coda: missing VAR_PETALBURG_CITY_STATE not reported (R3)');
  if (!has(run(coda, withLine(goodCoda, '\tgivemon SPECIES_MUDKIP_HOENN, 38')), 'R4', 'SPECIES_MUDKIP_HOENN'))
    fail('coda: den species givemon not reported (R4)');
  // v3.1 beats (C351 cases)
  if (!has(run(coda, goodCoda.filter((l) => l !== '\tsetflag FLAG_VISITED_DEWFORD_TOWN')), 'R3', 'FLAG_VISITED_DEWFORD_TOWN')) // (f)
    fail('coda: missing FLAG_VISITED_DEWFORD_TOWN not reported (R3)');
  if (!has(run(coda, goodCoda.filter((l) => l !== '\tgivemon SPECIES_VULPIX_HOENN, 20')), 'R3', 'SPECIES_VULPIX_HOENN')) // (g)
    fail('coda: missing SPECIES_VULPIX_HOENN not reported (R3)');
  if (!has(run(coda, withLine(goodCoda, '\tsetflag FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE')), 'R4', 'FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE')) // (h)
    fail('coda: pre-set FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE not reported (R4)');
  console.log('check_playtest selftest: OK');
}

// ---- main -----------------------------------------------------------------

function main() {
  const flagNames = definedNames(FLAGS_H);
  const varNames = definedNames(VARS_H);
  const resetFlags = parseResetFlags(fs.readFileSync(NEW_GAME_INC, 'utf8'));
  const dens = [];
  for (const d of fs.readdirSync(MAPS_DIR).sort()) {
    const text = readScripts(d);
    if (text !== null) dens.push(...parseDens(text));
  }

  const errors = [];
  const beatErrors = [];
  checkBeats(beatErrors);
  errors.push(...beatErrors.map((e) => `[beats] ${e}`));
  const oks = [];
  for (const preset of PRESETS) {
    const errs = [];
    const file = path.join(ROOT, preset.file);
    if (!fs.existsSync(file)) {
      errors.push(`[${preset.name}] R1 ${preset.file} does not exist`);
      continue;
    }
    const p = parsePreset(fs.readFileSync(file, 'utf8'), preset.label);
    checkSync(p, preset, errs);
    checkNames(p, flagNames, varNames, errs);
    checkPrereqs(p, preset, errs);
    checkNothingPreTriggered(p, preset, dens, errs);
    const hides = checkRouteHides(p, preset, resetFlags, errs);
    errors.push(...errs.map((e) => `[${preset.name}] ${e}`));
    oks.push(`check_playtest: OK [${preset.name}] ${preset.file} (${p.setFlags.length + p.clearFlags.length} flags, ${Object.keys(p.setVars).length} vars, ` +
      `${p.species.length} mons, ${p.items.length} items checked; ${dens.length} dens, ` +
      `${hides.checked} route hides (${hides.reset} via ${RESET_LABEL}, ${hides.allowlisted} allowlisted), ${hides.unresolved} removeobject unresolved)`);
  }

  if (errors.length) {
    console.error(`check_playtest: ${errors.length} problem(s) in the playtest presets`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  for (const line of oks) console.log(line);
  console.log(`check_playtest: OK (${PRESETS.length} presets, ${BEATS.length} beats)`);
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
