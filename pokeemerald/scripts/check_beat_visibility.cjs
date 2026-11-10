#!/usr/bin/env node
'use strict';

// Postgame beat visibility guard (C354).
//
// Each v3.1 "Taken at Their Word" beat is a FLAG_HIDE_* object that a map-load
// setup label shows (clears the flag) or hides (sets it) once the credits have
// rolled and the page species is caught. A beat that is wired wrong does not
// crash; it simply never appears, and nobody playing would know it was there.
//
// Fails (exit 1) when:
//   V1. wiring: the map has no object with the beat's local_id and hide flag;
//       the object's script has no label; the setup label is missing or is not
//       the ON_TRANSITION map script (or called / gone to from it); or the
//       setup body lacks the default-state flag command before its first
//       goto_if/call_if, the opposite command after a
//       `goto_if_unset FLAG_SYS_GAME_CLEAR`, or `setvar VAR_0x8004, <species>`;
//   V2. same-visit change: the beat's species is in the map's own wild tables
//       (land/water/rock smash/fishing), so the catch can happen mid-visit, and
//       the map has no ON_RESUME path to the setup and no ALLOWLIST reason
//       (a stale ALLOWLIST entry also fails);
//   V3. tile: the object's start tile has a collision/elevation/behaviour
//       problem (check_object_tiles rules), is the start tile of another
//       always-present object, or is a warp tile.
//
// This is a static stand-in until a tester plays: passing it means the beat is wired and standing on a sane tile, not that a player notices it.
//
// Usage: node scripts/check_beat_visibility.cjs [--selftest]
//        (run by `make check_beat_visibility`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const WILD_JSON = path.join(ROOT, 'src/data/wild_encounters.json');
const WILD_GROUP = 'gWildMonHeaders';
const WILD_TABLES = ['land_mons', 'water_mons', 'rock_smash_mons', 'fishing_mons'];
const MIN_WILD_MAPS = 100; // C354: 119 maps; fewer means the parser broke

// shows: true = the setup CLEARS the flag under the condition; false = it SETS it.
// The v3.0 Route 104 coda is not listed: check_playtest R5 covers it.
const BEATS = [
  { beat: 'A tide hiker',     map: 'Route106',        localid: 'LOCALID_ROUTE106_TIDE_HIKER',    hideFlag: 'FLAG_HIDE_ROUTE106_TIDE_HIKER',    setup: 'Route106_OnTransition',                       species: 'SPECIES_GLIGAR_HOENN', shows: true },
  { beat: 'A empty B1F spot', map: 'GraniteCave_B1F', localid: 'LOCALID_GRANITE_CAVE_B1F_HIKER', hideFlag: 'FLAG_HIDE_GRANITE_CAVE_B1F_HIKER', setup: 'GraniteCave_B1F_EventScript_SetupHikerLeft', species: 'SPECIES_GLIGAR_HOENN', shows: false },
  { beat: 'B TESSA',          map: 'Route119',        localid: 'LOCALID_ROUTE119_STORM_CHASER',  hideFlag: 'FLAG_HIDE_ROUTE119_STORM_CHASER',  setup: 'Route119_EventScript_SetupStormChaser',       species: 'SPECIES_LOTAD_HOENN',  shows: true },
  { beat: 'C ELLIS',          map: 'Route113',        localid: 'LOCALID_ROUTE113_ASH_CAMPER',    hideFlag: 'FLAG_HIDE_ROUTE113_ASH_CAMPER',    setup: 'Route113_EventScript_SetupAshCamper',         species: 'SPECIES_VULPIX_HOENN', shows: true },
];

// '<Map>:<localid>': why a same-map catch may change the beat only on re-entry (V2).
const ALLOWLIST = {
  'Route113:LOCALID_ROUTE113_ASH_CAMPER': 'D3 (C353): a player who catches VULPIX on Route 113 sees ELLIS only after leaving and coming back. Accepted because the picnicker\'s 38,8 -> 38,6 move is load-only too; a mid-visit ELLIS would stand facing an empty tile, which reads worse than arriving next visit.',
};

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

const scriptLines = (text) => text.split('\n').map((l) => stripComment(l).trim());
const labelIndex = (lines, label) => lines.findIndex((l) => l === `${label}::` || l === `${label}:`);

// Lines after the label up to and including the first `end`/`return`
// (or an unconditional `goto` when stopAtGoto). null if the label is missing.
function labelBody(lines, label, stopAtGoto) {
  const start = labelIndex(lines, label);
  if (start < 0) return null;
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (!l) continue;
    body.push(l);
    if (l === 'end' || l === 'return' || (stopAtGoto && /^goto\s/.test(l))) break;
  }
  return body;
}

function mapScripts(lines) {
  const out = {};
  for (const l of lines) {
    const m = /^map_script\s+(MAP_SCRIPT_\w+)\s*,\s*(\w+)$/.exec(l);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

// True when `label` is `target` or its body calls / goes to it.
function reaches(lines, label, target) {
  if (!label) return false;
  if (label === target) return true;
  const body = labelBody(lines, label, true) || [];
  return body.some((l) => new RegExp(`^(call|goto)\\s+${target}$`).test(l));
}

// Pure. maps[name] = { json, scripts }; wild[mapId] = Set of species;
// tileLookup(map, x, y, elevation) -> problem strings. Returns { errors, allowUsed }.
function check(beats, maps, wild, allowlist, tileLookup) {
  const errors = [];
  const allowUsed = new Set();
  for (const b of beats) {
    const map = maps[b.map];
    if (!map) { errors.push(`${b.beat}: map ${b.map} not loaded`); continue; }
    const lines = scriptLines(map.scripts);
    const objs = map.json.object_events || [];
    const obj = objs.find((o) => o.local_id === b.localid && o.flag === b.hideFlag);

    // V1 wiring
    if (!obj) {
      errors.push(`${b.beat}: no ${b.localid} object with flag ${b.hideFlag} in ${b.map}/map.json — the player would never see him`);
    } else if (labelIndex(lines, obj.script) < 0) {
      errors.push(`${b.beat}: object script ${obj.script} has no label — talking to him would do nothing`);
    }
    const ms = mapScripts(lines);
    const body = labelBody(lines, b.setup, false);
    if (!body || !reaches(lines, ms.MAP_SCRIPT_ON_TRANSITION, b.setup)) {
      errors.push(`${b.beat}: ${b.setup} is not reached from the ON_TRANSITION map script — he would never appear/leave`);
    }
    if (body) {
      const def = b.shows ? 'setflag' : 'clearflag';
      const cond = b.shows ? 'clearflag' : 'setflag';
      const firstIf = body.findIndex((l) => /^(goto_if|call_if)/.test(l));
      const defAt = body.findIndex((l) => l === `${def} ${b.hideFlag}`);
      const clearAt = body.findIndex((l) => /^goto_if_unset\s+FLAG_SYS_GAME_CLEAR\s*,/.test(l));
      const condAt = body.findIndex((l, i) => i > clearAt && l === `${cond} ${b.hideFlag}`);
      if (defAt < 0 || (firstIf >= 0 && defAt > firstIf))
        errors.push(`${b.beat}: no \`${def} ${b.hideFlag}\` before the first condition in ${b.setup} — ` +
          (b.shows ? 'he would stand there before the credits' : 'the hiker would be missing before the beat'));
      if (clearAt < 0)
        errors.push(`${b.beat}: ${b.setup} has no goto_if_unset FLAG_SYS_GAME_CLEAR — the beat would leak into the main story`);
      else if (condAt < 0)
        errors.push(`${b.beat}: ${b.hideFlag} is never ${b.shows ? 'cleared' : 'set'} after the FLAG_SYS_GAME_CLEAR check — ` +
          (b.shows ? 'the beat can never show' : 'he would never leave'));
      if (!body.some((l) => new RegExp(`^setvar\\s+VAR_0x8004\\s*,\\s*${b.species}$`).test(l)))
        errors.push(`${b.beat}: ${b.setup} never does setvar VAR_0x8004, ${b.species} — the beat would ignore the catch`);
    }

    // V2 same-visit change
    const key = `${b.map}:${b.localid}`;
    const species = wild[map.json.id];
    if (species && species.has(b.species) && !reaches(lines, ms.MAP_SCRIPT_ON_RESUME, b.setup)) {
      if (key in allowlist) allowUsed.add(key);
      else errors.push(`${b.beat}: ${b.species} is catchable on ${b.map}, so ${b.beat} would change only after re-entry — ` +
        'the player wins nothing they can see this visit (add an ON_RESUME path or an ALLOWLIST reason)');
    }

    // V3 tile
    if (obj) {
      const x = Number(obj.x);
      const y = Number(obj.y);
      const problems = [...tileLookup(b.map, x, y, Number(obj.elevation) || 0)];
      for (const o of objs)
        if (o !== obj && String(o.flag) === '0' && Number(o.x) === x && Number(o.y) === y)
          problems.push(`start tile of always-present ${o.local_id || o.graphics_id}`);
      if ((map.json.warp_events || []).some((w) => Number(w.x) === x && Number(w.y) === y))
        problems.push('warp tile');
      for (const p of problems)
        errors.push(`${b.beat} at ${x},${y}: ${p} — the player would see him in a wall, the sea or a doorway`);
    }
  }
  return { errors, allowUsed };
}

function loadWild() {
  const json = JSON.parse(fs.readFileSync(WILD_JSON, 'utf8'));
  const group = (json.wild_encounter_groups || []).find((g) => g.label === WILD_GROUP);
  const wild = {};
  for (const e of (group && group.encounters) || []) {
    const set = wild[e.map] || (wild[e.map] = new Set());
    for (const t of WILD_TABLES)
      for (const m of (e[t] && e[t].mons) || []) set.add(m.species);
  }
  return wild;
}

function main() {
  const tiles = require('./check_object_tiles.cjs');
  const layouts = tiles.loadLayouts();
  const attrs = tiles.loadTilesetAttrPaths();
  const names = tiles.loadBehaviorNames();
  const maps = {};
  for (const b of BEATS) {
    const dir = path.join(MAPS_DIR, b.map);
    maps[b.map] = {
      json: JSON.parse(fs.readFileSync(path.join(dir, 'map.json'), 'utf8')),
      scripts: fs.readFileSync(path.join(dir, 'scripts.inc'), 'utf8'),
    };
  }
  const tileOf = (map, x, y) => tiles.tileAt(layouts[maps[map].json.layout], attrs, x, y);
  const tileLookup = (map, x, y, elev) => tiles.tileProblems(tileOf(map, x, y), elev, names);

  const wild = loadWild();
  const { errors, allowUsed } = check(BEATS, maps, wild, ALLOWLIST, tileLookup);
  const wildMaps = Object.keys(wild).length;
  if (wildMaps < MIN_WILD_MAPS)
    errors.push(`only ${wildMaps} wild encounter maps parsed (MIN_WILD_MAPS ${MIN_WILD_MAPS}; parser broke?)`);
  for (const key of Object.keys(ALLOWLIST))
    if (!allowUsed.has(key)) errors.push(`ALLOWLIST ${key}: stale, no same-map catch needs it`);

  if (errors.length) {
    for (const e of errors) console.error(`ERROR: ${e}`);
    process.exit(1);
  }
  console.log(`check_beat_visibility: OK (${BEATS.length} beats, ${allowUsed.size} allowlisted)`);
  for (const b of BEATS) {
    const o = maps[b.map].json.object_events.find((e) => e.local_id === b.localid);
    const t = tileOf(b.map, Number(o.x), Number(o.y));
    console.log(`  ${b.beat} ${b.map} ${o.x},${o.y} metatile 0x${t.metatile.toString(16).toUpperCase()} clean`);
  }
}

// ---- selftest ---------------------------------------------------------------

function selftest() {
  const fail = (msg) => { console.error(`check_beat_visibility selftest FAILED: ${msg}`); process.exit(1); };
  const beat = (o) => ({ beat: 'T', map: 'Fix', localid: 'LOCALID_FIX', hideFlag: 'FLAG_HIDE_FIX', setup: 'Fix_OnTransition', species: 'SPECIES_FIX', shows: true, ...o });
  const npc = (o) => ({ local_id: 'LOCALID_FIX', graphics_id: 'OBJ_EVENT_GFX_HIKER', x: 5, y: 5, elevation: 3, script: 'Fix_EventScript_Npc', flag: 'FLAG_HIDE_FIX', ...o });
  const setup = (label, first, second) => [
    `${label}::`, `\t${first} FLAG_HIDE_FIX`, `\tgoto_if_unset FLAG_SYS_GAME_CLEAR, ${label}End`,
    '\tsetvar VAR_0x8004, SPECIES_FIX', '\tspecialvar VAR_RESULT, ScriptCheckPokedexCaught',
    `\tgoto_if_ne VAR_RESULT, TRUE, ${label}End`, `\t${second} FLAG_HIDE_FIX`, `${label}End:`, '\tend',
  ].join('\n');
  const GOOD = [
    'Fix_MapScripts::', '\tmap_script MAP_SCRIPT_ON_TRANSITION, Fix_OnTransition', '\t.byte 0',
    '@ comment with clearflag FLAG_HIDE_FIX in it', setup('Fix_OnTransition', 'setflag', 'clearflag'),
    'Fix_EventScript_Npc::', '\tlock', '\trelease', '\tend',
  ].join('\n');
  const fixture = (scripts, objects, warps) => ({ Fix: { json: { id: 'MAP_FIX', object_events: objects || [npc()], warp_events: warps || [] }, scripts: scripts || GOOD } });
  const stub = (map, x, y) => (x === 9 && y === 9 ? ['collision 1 (metatile 0x1)'] : []);
  const noWild = { MAP_FIX: new Set(['SPECIES_OTHER']) };
  const withWild = { MAP_FIX: new Set(['SPECIES_FIX']) };
  const run = (b, maps, wild, allow) => check([b], maps, wild || noWild, allow || {}, stub);
  const expect = (name, r, rule) => {
    if (rule === null) { if (r.errors.length) fail(`${name}: expected no errors, got ${r.errors.join(' | ')}`); return; }
    if (!r.errors.length) fail(`${name}: expected a ${rule} error, got none`);
  };

  expect('1 good fixture', run(beat(), fixture()), null);
  expect('2 no clearflag', run(beat(), fixture(GOOD.replace('\tclearflag FLAG_HIDE_FIX', '\tnop'))), 'V1');
  expect('3 script renamed', run(beat(), fixture(null, [npc({ script: 'Fix_EventScript_Gone' })])), 'V1');
  expect('4 ON_TRANSITION does not reach setup',
    run(beat(), fixture(GOOD.replace('MAP_SCRIPT_ON_TRANSITION, Fix_OnTransition', 'MAP_SCRIPT_ON_TRANSITION, Fix_Other') + '\nFix_Other::\n\tend')), 'V1');
  expect('5 same-map catch', run(beat(), fixture(), withWild), 'V2');
  const allowed = run(beat(), fixture(), withWild, { 'Fix:LOCALID_FIX': 'selftest' });
  expect('6 allowlisted', allowed, null);
  if (!allowed.allowUsed.has('Fix:LOCALID_FIX')) fail('6 allowlisted: key not in allowUsed');
  expect('7 wall tile', run(beat(), fixture(null, [npc({ x: 9, y: 9 })])), 'V3');
  expect('8 shared start tile', run(beat(), fixture(null, [npc(), npc({ local_id: 'LOCALID_OTHER', flag: '0' })])), 'V3');
  const INVERTED = [
    'Fix_MapScripts::', '\tmap_script MAP_SCRIPT_ON_TRANSITION, Fix_OnTransition', '\t.byte 0',
    'Fix_OnTransition:', '\tcall Fix_Setup', '\tgoto Fix_Elsewhere',
    setup('Fix_Setup', 'clearflag', 'setflag').replace(/\tend$/, '\treturn'),
    'Fix_EventScript_Npc::', '\tend',
  ].join('\n');
  expect('9 inverted fixture', run(beat({ setup: 'Fix_Setup', shows: false }), fixture(INVERTED)), null);

  console.log('check_beat_visibility: selftest OK (9 cases)');
}

module.exports = { check, BEATS, ALLOWLIST };

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
