#!/usr/bin/env node
'use strict';

// Map tile scanner (C357, tech-debt 356).
//
// Prints what is under each tile of a map: metatile id and label, behaviour,
// collision, elevation, and every event or script that puts something there.
// Built on check_object_tiles.cjs (tileAt, layouts, tileset attributes), so a
// tile placement and the lint that later checks it read map.bin the same way.
// Use it before any tile placement instead of ad hoc map.bin reads.
//
// Usage:
//   node scripts/map_scan.cjs <MAP> <x0-x1> <y0-y1> [--behavior MB_X] [--metatile 0xNNN] [--walkable]
//   node scripts/map_scan.cjs <MAP> --at x,y
//   node scripts/map_scan.cjs --selftest       (run by `make check_map_scan`, part of `make check_all`)
// <MAP> is MAP_ROUTE113, ROUTE113 or the directory name Route113.
//
// One line per tile: `x,y  0x20A Fallarbor_AshGrass  MB_ASHGRASS  c0 e3` plus markers
//   [obj LOCALID_X|#index]  map.json object start tile
//   [warp -> MAP_Y] [coord] [bg]  map.json events
//   [runtime LOCALID_X (DexBelieverPlace|InkBelieverPlace|setobjectxyperm|setobjectxy)]  literal script destinations
//   [setmetatile METATILE_X]  setmetatile destinations in scripts.inc
// --walkable keeps collision 0 tiles with no warp/coord event and no warp/water/ledge
// behaviour (the same isBadBehavior rule as check_object_tiles).
//
// tileAt hard-codes the map.bin bit layout; every run first checks the MAPGRID masks
// in include/global.fieldmap.h still match it.

const fs = require('fs');
const path = require('path');
const cot = require('./check_object_tiles.cjs');

const ROOT = path.join(__dirname, '..');
const FIELDMAP_H = path.join(ROOT, 'include/global.fieldmap.h');
const LABELS_H = path.join(ROOT, 'include/constants/metatile_labels.h');
const NUM_METATILES_IN_PRIMARY = 0x200;

const EXPECTED_MASKS = {
  MAPGRID_METATILE_ID_MASK: 0x03FF,
  MAPGRID_COLLISION_MASK: 0x0C00,
  MAPGRID_ELEVATION_MASK: 0xF000,
};

// Pure: returns a list of errors (empty when the masks match tileAt).
function checkMasks(headerText) {
  const errors = [];
  for (const [name, want] of Object.entries(EXPECTED_MASKS)) {
    const m = new RegExp(`#define\\s+${name}\\s+(0x[0-9A-Fa-f]+|\\d+)`).exec(headerText);
    if (!m) errors.push(`${name} not found`);
    else if (Number(m[1]) !== want) errors.push(`${name} is ${m[1]}, tileAt assumes 0x${want.toString(16).toUpperCase()}`);
  }
  return errors;
}

let mapIndex = null;
// MAP_ROUTE113 / ROUTE113 / Route113 -> directory name, or null.
function resolveMap(arg) {
  if (!mapIndex) {
    mapIndex = {};
    for (const dir of fs.readdirSync(cot.MAPS_DIR)) {
      const map = cot.readMapJson(dir);
      if (map && map.id) mapIndex[map.id] = dir;
    }
  }
  if (Object.values(mapIndex).includes(arg)) return arg;
  return mapIndex[arg] || mapIndex[`MAP_${arg}`] || null;
}

function loadMetatileLabels() {
  const byPrefix = {};
  for (const line of fs.readFileSync(LABELS_H, 'utf8').split('\n')) {
    const m = /^#define\s+METATILE_([A-Za-z0-9]+)_(\w+)\s+(0x[0-9A-Fa-f]+)/.exec(line);
    if (!m) continue;
    const table = byPrefix[m[1]] || (byPrefix[m[1]] = {});
    const id = Number(m[3]);
    if (!(id in table)) table[id] = `${m[1]}_${m[2]}`;
  }
  return byPrefix;
}

// Markers keyed 'x,y' from map.json events and the map's scripts.inc.
function collectMarkers(dir, map) {
  const markers = {};
  const add = (x, y, text) => (markers[`${x},${y}`] = markers[`${x},${y}`] || []).push(text);
  (map.object_events || []).forEach((o, i) => add(o.x, o.y, `[obj ${o.local_id || `#${i + 1}`}]`));
  for (const w of map.warp_events || []) add(w.x, w.y, `[warp -> ${w.dest_map}]`);
  for (const c of map.coord_events || []) add(c.x, c.y, '[coord]');
  for (const b of map.bg_events || []) add(b.x, b.y, '[bg]');
  const scriptFile = path.join(cot.MAPS_DIR, dir, 'scripts.inc');
  if (fs.existsSync(scriptFile)) {
    const text = fs.readFileSync(scriptFile, 'utf8');
    for (const d of cot.collectDestinations(dir, text).dests)
      add(d.x, d.y, `[runtime ${d.localid} (${d.cmd.replace(/^EventMacro_/, '')})]`);
    for (const raw of text.split('\n')) {
      const m = /^\s*setmetatile\s+(\d+)\s*,\s*(\d+)\s*,\s*(\w+)/.exec(raw.replace(/@.*$/, ''));
      if (m) add(Number(m[1]), Number(m[2]), `[setmetatile ${m[3]}]`);
    }
  }
  return markers;
}

let ctx = null;
function context() {
  if (!ctx) ctx = { behaviorNames: cot.loadBehaviorNames(), tilesetToBin: cot.loadTilesetAttrPaths(),
    layouts: cot.loadLayouts(), labels: loadMetatileLabels() };
  return ctx;
}

// Returns { rows: [{ x, y, tile, behavior, markers, line }] } or { error }.
function scan(mapArg, x0, x1, y0, y1, opts = {}) {
  const { behaviorNames, tilesetToBin, layouts, labels } = context();
  const dir = resolveMap(mapArg);
  if (!dir) return { error: `unknown map ${mapArg}` };
  const map = cot.readMapJson(dir);
  const layout = layouts[map.layout];
  if (!layout) return { error: `${dir}: no layout ${map.layout}` };
  const markers = collectMarkers(dir, map);
  const rows = [];
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const tile = cot.tileAt(layout, tilesetToBin, x, y);
      if (tile.error) return { error: `${dir} ${x},${y}: ${tile.error}` };
      const behavior = behaviorNames[tile.behavior] || `0x${tile.behavior.toString(16)}`;
      const here = markers[`${x},${y}`] || [];
      if (opts.behavior && behavior !== opts.behavior) continue;
      if (opts.metatile !== undefined && tile.metatile !== opts.metatile) continue;
      if (opts.walkable && (tile.collision !== 0 || cot.isBadBehavior(behavior) ||
          here.some((m) => m.startsWith('[warp') || m === '[coord]'))) continue;
      const secondary = tile.metatile >= NUM_METATILES_IN_PRIMARY;
      const prefix = (secondary ? layout.secondary_tileset : layout.primary_tileset).replace(/^gTileset_/, '');
      const label = (labels[prefix] || {})[tile.metatile] || '?';
      const hex = `0x${tile.metatile.toString(16).toUpperCase().padStart(3, '0')}`;
      const line = `${x},${y}  ${hex} ${label}  ${behavior}  c${tile.collision} e${tile.elevation}` +
        (here.length ? `  ${here.join(' ')}` : '');
      rows.push({ x, y, tile, behavior, label, markers: here, line });
    }
  return { rows };
}

function parseRange(s) {
  const m = /^(\d+)(?:-(\d+))?$/.exec(s || '');
  if (!m) return null;
  const a = Number(m[1]), b = m[2] === undefined ? a : Number(m[2]);
  return a <= b ? [a, b] : null;
}

// ---- selftest ---------------------------------------------------------------

function selftest() {
  let passed = 0;
  const failures = [];
  const check = (name, ok) => (ok ? passed++ : failures.push(name));
  const at = (map, x, y) => {
    const r = scan(map, x, x, y, y);
    return r.error ? { error: r.error } : r.rows[0];
  };

  check('real fieldmap masks match tileAt', checkMasks(fs.readFileSync(FIELDMAP_H, 'utf8')).length === 0);
  const ash = at('ROUTE113', 38, 4);
  check('ROUTE113 38,4 is 0x20A MB_ASHGRASS c0 e3', ash && ash.tile && ash.tile.metatile === 0x20A &&
    ash.behavior === 'MB_ASHGRASS' && ash.tile.collision === 0 && ash.tile.elevation === 3);
  const rocks = at('MAP_ROUTE113', 38, 8);
  check('ROUTE113 38,8 is 0x218 MB_NORMAL', rocks && rocks.tile && rocks.tile.metatile === 0x218 && rocks.behavior === 'MB_NORMAL');
  const sand = at('Route106', 54, 15);
  check('ROUTE106 54,15 is 0x124 MB_SAND c0 e3', sand && sand.tile && sand.tile.metatile === 0x124 &&
    sand.behavior === 'MB_SAND' && sand.tile.collision === 0 && sand.tile.elevation === 3);
  const grass = scan('ROUTE113', 35, 41, 3, 8, { behavior: 'MB_ASHGRASS' });
  check('ROUTE113 x35-41 y3-8 has exactly 24 MB_ASHGRASS tiles (C353 list: y4 x38-41, y5 x37-41, y6 x36-41, y7 x35-41, y8 x35-36)', !grass.error && grass.rows.length === 24);
  check('...none of them on row 3', !grass.error && grass.rows.every((r) => r.y !== 3));
  const has = (row, text) => !!row && !row.error && row.markers.some((m) => m.includes(text));
  check('38,5 obj LOCALID_ROUTE113_ASH_CAMPER', has(at('ROUTE113', 38, 5), '[obj LOCALID_ROUTE113_ASH_CAMPER]'));
  check('38,6 runtime picnicker DexBelieverPlace',
    has(at('ROUTE113', 38, 6), '[runtime LOCALID_ROUTE113_ASH_PICNICKER (DexBelieverPlace)]'));
  check('38,7 setmetatile NormalGrass', has(at('ROUTE113', 38, 7), '[setmetatile METATILE_Fallarbor_NormalGrass]'));
  check('33,5 warp marker', has(at('ROUTE113', 33, 5), '[warp -> '));

  // Must-fail cases: the tool has to reject each of these.
  const warpWalk = scan('ROUTE113', 33, 33, 5, 5, { walkable: true });
  check('MUST-FAIL --walkable drops the 33,5 warp', !warpWalk.error && warpWalk.rows.length === 0);
  const { tilesetToBin, layouts } = context();
  const layout = layouts[cot.readMapJson('Route113').layout];
  let wall = null;
  for (let y = 0; y < layout.height && !wall; y++)
    for (let x = 0; x < layout.width && !wall; x++) {
      const t = cot.tileAt(layout, tilesetToBin, x, y);
      if (!t.error && t.collision !== 0) wall = { x, y };
    }
  check('ROUTE113 has a collision!=0 tile (map.bin parse sane)', !!wall);
  const wallWalk = wall && scan('ROUTE113', wall.x, wall.x, wall.y, wall.y, { walkable: true });
  check('MUST-FAIL --walkable drops the first wall tile', !!wallWalk && !wallWalk.error && wallWalk.rows.length === 0);
  check('MUST-FAIL checkMasks rejects METATILE_ID_MASK 0x07FF',
    checkMasks('#define MAPGRID_METATILE_ID_MASK 0x07FF\n#define MAPGRID_COLLISION_MASK 0x0C00\n' +
      '#define MAPGRID_ELEVATION_MASK 0xF000\n').length > 0);
  check('MUST-FAIL unknown map ROUTE999', !!scan('ROUTE999', 0, 0, 0, 0).error);
  check('MUST-FAIL out-of-bounds tile', !!scan('ROUTE113', layout.width, layout.width, 0, 0).error);

  const total = passed + failures.length;
  for (const f of failures) console.error(`map_scan selftest FAILED: ${f}`);
  console.log(`map_scan selftest: ${passed}/${total} passed`);
  process.exit(failures.length ? 1 : 0);
}

// ---- main -----------------------------------------------------------------

function usage(msg) {
  console.error(`map_scan: ${msg}\nusage: node scripts/map_scan.cjs <MAP> <x0-x1> <y0-y1> ` +
    '[--behavior MB_X] [--metatile 0xNNN] [--walkable] | <MAP> --at x,y | --selftest');
  process.exit(1);
}

function main(argv) {
  const maskErrors = checkMasks(fs.readFileSync(FIELDMAP_H, 'utf8'));
  if (maskErrors.length) {
    for (const e of maskErrors) console.error(`map_scan: ${e}`);
    console.error('map_scan: map.bin layout changed; update tileAt');
    process.exit(1);
  }
  if (argv.includes('--selftest')) return selftest();

  const opts = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--walkable') opts.walkable = true;
    else if (a === '--behavior') opts.behavior = argv[++i] || usage('--behavior needs MB_X');
    else if (a === '--metatile') {
      if (!/^(0x[0-9A-Fa-f]+|\d+)$/.test(argv[i + 1] || '')) usage('--metatile needs 0xNNN');
      opts.metatile = Number(argv[++i]);
    } else if (a === '--at') opts.at = argv[++i] || usage('--at needs x,y');
    else if (a.startsWith('--')) usage(`unknown option ${a}`);
    else pos.push(a);
  }
  let xr, yr;
  if (opts.at) {
    const m = /^(\d+),(\d+)$/.exec(opts.at);
    if (!m || pos.length !== 1) usage('--at takes one map and x,y');
    xr = [Number(m[1]), Number(m[1])];
    yr = [Number(m[2]), Number(m[2])];
  } else {
    if (pos.length !== 3) usage('expected <MAP> <x0-x1> <y0-y1>');
    xr = parseRange(pos[1]);
    yr = parseRange(pos[2]);
    if (!xr || !yr) usage('ranges look like 35-41 or 7');
  }
  if (opts.behavior && !context().behaviorNames.includes(opts.behavior)) usage(`unknown behaviour ${opts.behavior}`);
  const result = scan(pos[0], xr[0], xr[1], yr[0], yr[1], opts);
  if (result.error) {
    console.error(`map_scan: ${result.error}`);
    process.exit(1);
  }
  for (const r of result.rows) console.log(r.line);
  console.log(`${result.rows.length} tiles matched`);
}

module.exports = { checkMasks, resolveMap, scan };

if (require.main === module) main(process.argv.slice(2));
