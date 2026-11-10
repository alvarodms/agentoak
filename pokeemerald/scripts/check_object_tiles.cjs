#!/usr/bin/env node
'use strict';

// Scripted NPC destination tile guard (C338, tech-debt 329 walkability half).
//
// Several Red Ink believers are relocated by script (`setobjectxyperm` in
// ON_TRANSITION, `EventMacro_DexBelieverPlace`, `EventMacro_InkBelieverPlace`). A typo in x/y puts an NPC in a
// wall, in water, on a warp or on another NPC, and nothing in the build notices.
// This lint resolves every literal destination against the layout's map.bin and
// the tilesets' metatile_attributes.bin.
//
// Destinations: in every data/maps/<Map>/scripts.inc,
//   setobjectxyperm <localid>, <x>, <y>
//   setobjectxy <localid>, <x>, <y>
//   EventMacro_DexBelieverPlace <species>, <localid>, <x>, <y>, <movement>
//   EventMacro_InkBelieverPlace <min_pages>, <localid>, <x>, <y>, <movement>
// with numeric x/y (VAR_ arguments are skipped and counted). The map is the
// directory the script lives in. LOCALID_PLAYER and ids not on the map are
// skipped too (counted separately).
//
// Fails (exit 1) when a destination tile
//   (a) has collision != 0;
//   (b) has elevation not in {0, 15, the object's map.json elevation};
//   (c) has a warp / water / ledge behaviour (WARP|DOOR|LADDER|_WATER|WATERFALL|JUMP_
//       in include/constants/metatile_behaviors.h, except MB_SHALLOW_WATER/MB_PUDDLE);
//   (d) is the map.json start tile of a different object whose flag is "0"
//       (always present). A flagged object there is only a WARNING (e.g. MARLOW
//       on the TEMP_12 Mudkip doll's tile, intended: the doll is gone by then).
// Also checks (a)-(c) for the map.json start tile of every object with a
// `local_id` on a map that has at least one destination.
// Genuine vanilla exceptions go in ALLOWLIST ('Map:x,y': 'reason'); known
// Agent Oak problems awaiting a fix go in KNOWN_ISSUES (warning only). An entry
// in either that matches no problem tile is stale and fails.
//
// Usage: node scripts/check_object_tiles.cjs [--selftest]
//   (run by `make check_object_tiles`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const LAYOUTS_JSON = path.join(ROOT, 'data/layouts/layouts.json');
const HEADERS_H = path.join(ROOT, 'src/data/tilesets/headers.h');
const METATILES_H = path.join(ROOT, 'src/data/tilesets/metatiles.h');
const BEHAVIORS_H = path.join(ROOT, 'include/constants/metatile_behaviors.h');

const NUM_METATILES_IN_PRIMARY = 0x200;

// Parser-broke guard: first real run (C338) resolved 175 literal destinations.
const MIN_DESTINATIONS = 157;

// Genuine vanilla exceptions, 'Map:x,y': 'reason'.
const DOOR = 'vanilla: NPC walks in/out through this door or exit mat in a cutscene';
const COUNTER = 'vanilla: attendant stands behind the counter';
const TRICK = 'vanilla: Trick Master hiding spot (behind furniture by design)';
const ALLOWLIST = {
  'BattleFrontier_BattlePalaceBattleRoom:13,1': 'vanilla: opponent walks in over the hidden attendant Pokemon tile',
  'BattleFrontier_BattlePalaceBattleRoom:15,1': 'vanilla: opponent parked off the right edge before walking in',
  'LavaridgeTown:12,15': DOOR,
  'LittlerootTown:14,8': DOOR,
  'LittlerootTown:5,8': DOOR,
  'LittlerootTown_BrendansHouse_1F:8,8': DOOR,
  'LittlerootTown_BrendansHouse_1F:9,8': DOOR,
  'LittlerootTown_BrendansHouse_2F:7,1': DOOR,
  'LittlerootTown_MaysHouse_1F:1,8': DOOR,
  'LittlerootTown_MaysHouse_1F:2,8': DOOR,
  'LittlerootTown_MaysHouse_2F:1,1': DOOR,
  'LittlerootTown_ProfessorBirchsLab:9,4': 'vanilla: postgame starter ball on the table',
  'LittlerootTown_ProfessorBirchsLab:10,4': 'vanilla: postgame starter ball on the table',
  'MossdeepCity_StevensHouse:4,3': 'vanilla: Beldum ball on the table',
  'MtChimney_CableCarStation:5,4': COUNTER,
  'PetalburgCity_Gym:4,111': DOOR,
  'Route101:0,16': 'vanilla: Zigzagoon chase parks off-screen at the map edge',
  'Route101:9,13': 'vanilla: Birch chase start on the ledge row',
  'Route101:10,13': 'vanilla: Zigzagoon chase start on the ledge row',
  'Route104:12,54': 'vanilla: Mr. Briney boat object on the water',
  'Route104:17,50': DOOR,
  'Route110_TrickHouseEntrance:0,5': TRICK,
  'Route110_TrickHouseEntrance:11,1': TRICK,
  'Route110_TrickHouseEntrance:11,5': TRICK,
  'Route110_TrickHouseEntrance:3,1': TRICK,
  'Route110_TrickHouseEntrance:6,3': TRICK,
  'Route110_TrickHouseEntrance:8,1': TRICK,
  'Route110_TrickHouseEntrance:9,1': TRICK,
  'Route112_CableCarStation:7,4': COUNTER,
  'Route119:25,32': 'vanilla: rival rides in on the bike path (elevation 4 object on 3 ground)',
  'Route119:26,32': 'vanilla: rival rides in on the bike path (elevation 4 object on 3 ground)',
  'RustboroCity:11,15': DOOR,
  'RustboroCity:12,15': DOOR,
  'SafariZone_South:31,34': 'vanilla: exit attendant template elevation 4 on elevation 3 ground',
  'SafariZone_South:32,34': 'vanilla: exit attendant template elevation 4 on elevation 3 ground',
  'SlateportCity:10,12': DOOR,
  'SlateportCity_BattleTentBattleRoom:4,8': DOOR,
  'SlateportCity_Harbor:7,9': 'vanilla: submarine object docked on the water',
  'SlateportCity_Harbor:8,9': 'vanilla: S.S. Tidal object docked on the water',
  'SootopolisCity:28,44': 'vanilla: Groudon in the crater lake',
  'SootopolisCity:31,41': 'vanilla: Rayquaza over the crater lake',
  'SootopolisCity:34,44': 'vanilla: Kyogre in the crater lake',
  'SootopolisCity:31,18': 'vanilla: Wallace and the Expert swap this tile; FLAG_HIDE_SOOTOPOLIS_CITY_WALLACE scenes',
  'SootopolisCity_MysteryEventsHouse_1F:2,2': COUNTER,
  'SootopolisCity_MysteryEventsHouse_1F:3,2': COUNTER,
  // Not vanilla, but intended: hidden by FLAG_HIDE_MIGRATION_PIKACHU_WOODS, shown only while it dashes out of the trees
  'PetalburgWoods:12,28': 'Agent Oak migration cutscene: Pikachu bursts out of the south tree line',
};

// NOT vanilla: Agent Oak NPCs that stand on a bad tile and are awaiting a fix,
// 'Map:x,y': 'reason' (warning only). C338 found two NPCs in walls; both were
// moved in C339 (Granite B1F hiker 28,19 -> 26,20, Pyre summit keeper 20,25 -> 21,25).
// Remove an entry once the NPC is moved (a stale entry fails).
const KNOWN_ISSUES = {
};

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

function splitArgs(rest) {
  return rest.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

const isLiteral = (s) => /^(0x[0-9A-Fa-f]+|\d+)$/.test(s);

// ---- tileset / behaviour tables -------------------------------------------

function loadBehaviorNames() {
  const text = fs.readFileSync(BEHAVIORS_H, 'utf8');
  const body = /enum\s*\{([\s\S]*?)\}/.exec(text);
  if (!body) throw new Error('include/constants/metatile_behaviors.h: no enum (parser broke?)');
  const names = [];
  let value = 0;
  for (const raw of body[1].split('\n')) {
    const line = raw.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '').trim();
    const m = /^(MB_\w+)\s*(?:=\s*(0x[0-9A-Fa-f]+|\d+))?\s*,?$/.exec(line);
    if (!m) continue;
    if (m[2] !== undefined) value = Number(m[2]);
    names[value++] = m[1];
  }
  return names;
}

const BAD_BEHAVIOR_RE = /WARP|DOOR|LADDER|_WATER|WATERFALL|JUMP_/;
const BAD_BEHAVIOR_EXEMPT = new Set(['MB_SHALLOW_WATER', 'MB_PUDDLE']);
const isBadBehavior = (name) => !!name && BAD_BEHAVIOR_RE.test(name) && !BAD_BEHAVIOR_EXEMPT.has(name);

function loadTilesetAttrPaths() {
  const attrToBin = {};
  for (const line of fs.readFileSync(METATILES_H, 'utf8').split('\n')) {
    const m = /(gMetatileAttributes_\w+)\s*\[\]\s*=\s*INCBIN_U16\("([^"]+)"\)/.exec(line);
    if (m) attrToBin[m[1]] = m[2];
  }
  const tilesetToBin = {};
  const re = /const\s+struct\s+Tileset\s+(gTileset_\w+)\s*=\s*\{([\s\S]*?)\};/g;
  const text = fs.readFileSync(HEADERS_H, 'utf8');
  let m;
  while ((m = re.exec(text))) {
    const attr = /\.metatileAttributes\s*=\s*(\w+)/.exec(m[2]);
    if (attr && attrToBin[attr[1]]) tilesetToBin[m[1]] = attrToBin[attr[1]];
  }
  return tilesetToBin;
}

const binCache = {};
function readBin(rel) {
  if (!(rel in binCache)) {
    const file = path.join(ROOT, rel);
    binCache[rel] = fs.existsSync(file) ? fs.readFileSync(file) : null;
  }
  return binCache[rel];
}

// ---- tile lookup ----------------------------------------------------------

// Returns { collision, elevation, metatile, behavior } or { error }.
function tileAt(layout, tilesetToBin, x, y) {
  if (x < 0 || y < 0 || x >= layout.width || y >= layout.height)
    return { error: `out of bounds (layout ${layout.width}x${layout.height})` };
  const blocks = readBin(layout.blockdata_filepath);
  if (!blocks) return { error: `missing ${layout.blockdata_filepath}` };
  const v = blocks.readUInt16LE((y * layout.width + x) * 2);
  const metatile = v & 0x3FF;
  const collision = (v >> 10) & 3;
  const elevation = v >> 12;
  const secondary = metatile >= NUM_METATILES_IN_PRIMARY;
  const tileset = secondary ? layout.secondary_tileset : layout.primary_tileset;
  const binPath = tilesetToBin[tileset];
  const attrs = binPath && readBin(binPath);
  if (!attrs) return { error: `no metatile_attributes.bin for ${tileset}` };
  const index = secondary ? metatile - NUM_METATILES_IN_PRIMARY : metatile;
  const behavior = index * 2 + 1 < attrs.length ? attrs.readUInt16LE(index * 2) & 0xFF : 0xFF;
  return { collision, elevation, metatile, behavior };
}

// Rules (a)-(c). Returns a list of problem strings.
function tileProblems(tile, objElevation, behaviorNames) {
  if (tile.error) return [tile.error];
  const out = [];
  const mt = `metatile 0x${tile.metatile.toString(16).toUpperCase()}`;
  if (tile.collision !== 0) out.push(`collision ${tile.collision} (${mt})`);
  // Object elevation 0 (ELEVATION_TRANSITION) / 15 is compatible with any tile (AreElevationsCompatible)
  if (objElevation !== 0 && objElevation !== 15 &&
      tile.elevation !== 0 && tile.elevation !== 15 && tile.elevation !== objElevation)
    out.push(`tile elevation ${tile.elevation} != object elevation ${objElevation} (${mt})`);
  const name = behaviorNames[tile.behavior];
  if (isBadBehavior(name)) out.push(`behaviour ${name} (${mt})`);
  return out;
}

// ---- map data -------------------------------------------------------------

function loadLayouts() {
  const byId = {};
  for (const l of JSON.parse(fs.readFileSync(LAYOUTS_JSON, 'utf8')).layouts)
    if (l && l.id) byId[l.id] = l;
  return byId;
}

function readMapJson(mapName) {
  const file = path.join(MAPS_DIR, mapName, 'map.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

// 1-based index for numeric ids, else match the `local_id` key.
function findObject(map, localid) {
  const objs = map.object_events || [];
  if (isLiteral(localid)) {
    const i = Number(localid);
    return i >= 1 && i <= objs.length ? { obj: objs[i - 1], index: i - 1 } : null;
  }
  const index = objs.findIndex((o) => o.local_id === localid);
  return index >= 0 ? { obj: objs[index], index } : null;
}

function collectDestinations(mapName, text) {
  const dests = [];
  let skipped = 0;
  text.split('\n').forEach((raw, idx) => {
    const line = stripComment(raw).trim();
    let m;
    let localid, x, y, cmd;
    if ((m = /^(setobjectxyperm|setobjectxy)\s+(.*)$/.exec(line))) {
      [localid, x, y] = splitArgs(m[2]);
      cmd = m[1];
    } else if ((m = /^EventMacro_DexBelieverPlace\s+(.*)$/.exec(line))) {
      [, localid, x, y] = splitArgs(m[1]);
      cmd = 'EventMacro_DexBelieverPlace';
    } else if ((m = /^EventMacro_InkBelieverPlace\s+(.*)$/.exec(line))) {
      [, localid, x, y] = splitArgs(m[1]);
      cmd = 'EventMacro_InkBelieverPlace';
    } else {
      return;
    }
    if (!isLiteral(x || '') || !isLiteral(y || '')) {
      skipped++;
      return;
    }
    dests.push({ mapName, line: idx + 1, cmd, localid, x: Number(x), y: Number(y) });
  });
  return { dests, skipped };
}

// ---- selftest ---------------------------------------------------------------

function selftest() {
  const fail = (msg) => {
    console.error(`check_object_tiles: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const behaviorNames = loadBehaviorNames();
  if (behaviorNames[0] !== 'MB_NORMAL') fail(`behaviour 0 is ${behaviorNames[0]}, expected MB_NORMAL`);
  if (!isBadBehavior('MB_DEEP_WATER') || !isBadBehavior('MB_JUMP_SOUTH') || !isBadBehavior('MB_NON_ANIMATED_DOOR'))
    fail('water/ledge/door behaviours not flagged');
  if (isBadBehavior('MB_SHALLOW_WATER') || isBadBehavior('MB_PUDDLE') || isBadBehavior('MB_NORMAL'))
    fail('shallow water / puddle / normal flagged');

  const tilesetToBin = loadTilesetAttrPaths();
  const layouts = loadLayouts();
  const map = readMapJson('MtPyre_Exterior');
  if (!map) fail('no MtPyre_Exterior map.json');
  const layout = layouts[map.layout];
  if (!layout) fail(`no layout ${map.layout}`);

  let wall = null;
  for (let y = 0; y < layout.height && !wall; y++)
    for (let x = 0; x < layout.width && !wall; x++) {
      const t = tileAt(layout, tilesetToBin, x, y);
      if (!t.error && t.collision === 1) wall = { x, y, t };
    }
  if (!wall) fail('MtPyre_Exterior map.bin has no collision-1 tile (map.bin parse broke?)');
  if (!tileProblems(wall.t, 3, behaviorNames).some((p) => p.startsWith('collision')))
    fail(`wall tile ${wall.x},${wall.y} was not reported`);

  const isolde = tileAt(layout, tilesetToBin, 17, 11);
  const p = tileProblems(isolde, 3, behaviorNames);
  if (p.length) fail(`ISOLDE's 17,11 reported: ${p.join('; ')}`);
  if (!tileProblems({ error: 'x' }, 3, behaviorNames).length) fail('lookup error not reported');

  console.log(`check_object_tiles: selftest OK (wall ${wall.x},${wall.y} caught, ISOLDE 17,11 clean)`);
  process.exit(0);
}

// ---- main -----------------------------------------------------------------

function main() {
  const behaviorNames = loadBehaviorNames();
  const tilesetToBin = loadTilesetAttrPaths();
  const layouts = loadLayouts();
  const errors = [];
  const warnings = [];
  const allowUsed = new Set();
  let skipped = 0;
  let unresolved = 0;
  let destCount = 0;
  let startCount = 0;

  const report = (mapName, x, y, what, problems) => {
    if (problems.length === 0) return;
    const key = `${mapName}:${x},${y}`;
    if (key in ALLOWLIST) {
      allowUsed.add(key);
      return;
    }
    if (key in KNOWN_ISSUES) {
      allowUsed.add(key);
      for (const p of problems) warnings.push(`${what} -> ${x},${y}: ${p} [known issue: ${KNOWN_ISSUES[key]}]`);
      return;
    }
    for (const p of problems) errors.push(`${what} -> ${x},${y}: ${p}`);
  };

  const mapNames = fs.readdirSync(MAPS_DIR)
    .filter((d) => fs.statSync(path.join(MAPS_DIR, d)).isDirectory())
    .sort();

  for (const mapName of mapNames) {
    const scriptFile = path.join(MAPS_DIR, mapName, 'scripts.inc');
    if (!fs.existsSync(scriptFile)) continue;
    const found = collectDestinations(mapName, fs.readFileSync(scriptFile, 'utf8'));
    skipped += found.skipped;
    if (found.dests.length === 0) continue;

    const map = readMapJson(mapName);
    const layout = map && layouts[map.layout];
    if (!layout) {
      errors.push(`${mapName}: no map.json or layout ${map && map.layout}`);
      continue;
    }
    const objs = map.object_events || [];
    let mapHasDest = false;

    for (const d of found.dests) {
      const where = `data/maps/${mapName}/scripts.inc:${d.line} ${d.cmd} ${d.localid}`;
      const hit = d.localid === 'LOCALID_PLAYER' ? null : findObject(map, d.localid);
      if (!hit) {
        unresolved++;
        continue;
      }
      destCount++;
      mapHasDest = true;
      const elev = Number(hit.obj.elevation) || 0;
      const problems = tileProblems(tileAt(layout, tilesetToBin, d.x, d.y), elev, behaviorNames);
      objs.forEach((o, i) => {
        if (i === hit.index || o.x !== d.x || o.y !== d.y) return;
        const name = o.local_id || `object ${i + 1} (${o.graphics_id})`;
        if (String(o.flag) === '0') problems.push(`start tile of always-present ${name}`);
        else warnings.push(`${where} -> ${d.x},${d.y}: start tile of ${name} (flag ${o.flag}; OK if it is hidden by then)`);
      });
      report(mapName, d.x, d.y, where, problems);
    }

    if (!mapHasDest) continue;
    objs.forEach((o, i) => {
      if (!o.local_id) return;
      startCount++;
      const where = `data/maps/${mapName}/map.json object ${i + 1} ${o.local_id} start`;
      const problems = tileProblems(tileAt(layout, tilesetToBin, o.x, o.y), Number(o.elevation) || 0, behaviorNames);
      report(mapName, o.x, o.y, where, problems);
    });
  }

  for (const [name, list] of [['ALLOWLIST', ALLOWLIST], ['KNOWN_ISSUES', KNOWN_ISSUES]])
    for (const key of Object.keys(list))
      if (!allowUsed.has(key)) errors.push(`${name} ${key}: stale, matches no checked tile with a problem`);
  if (destCount < MIN_DESTINATIONS)
    errors.push(`only ${destCount} destinations parsed (MIN_DESTINATIONS ${MIN_DESTINATIONS}; parser broke?)`);

  for (const w of warnings) console.warn(`WARNING: ${w}`);
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.log(`check_object_tiles: ${destCount} destinations, ${startCount} start tiles, ` +
    `${skipped + unresolved} skipped (${skipped} non-literal, ${unresolved} player/unresolved id), ` +
    `${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}

module.exports = { tileAt, tileProblems, loadBehaviorNames, loadTilesetAttrPaths, loadLayouts, readMapJson, readBin, isBadBehavior, collectDestinations, MAPS_DIR };

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
