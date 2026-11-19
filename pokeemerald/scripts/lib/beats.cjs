'use strict';

// Shared beats.json loader (C373, tech-debt 367-370 + 372).
//
// scripts/beats.json lists every shipped discovery beat once (see check_beats.cjs
// for the row fields). Every lint that needs a beat list reads it through this
// file; nothing else requires beats.json directly. Set BEATS_JSON to read a
// scratch copy (the C373 delete-a-row proofs).
//
// loadBeats() throws `beats: <ID>: <row id>: <msg>` on the first shape problem,
// with every problem on err.problems. Shape rules (validateRows, pure):
//   SH-REG      register is place|fight|weather|trace;
//   SH-TILE     each `tiles` entry is [int, int] or [int, int, up|down|left|right];
//   SH-MUSTREAD mustRead, if present, is an object of label -> string[];
//               mustReadScripts, if present, is a string[] of mustRead keys;
//   SH-VIS      visibility, if present, has exactly {name, localid, hideFlag,
//               setup, species, shows:boolean};
//   SH-B5X      b5Exempt, if present, maps a playtest in `playtests` (or "*") to a
//               non-empty reason, and only on rows older than v3.4.
//
// Row fields read by the derived tables:
//   mustRead + mustReadScripts + checklistItem -> check_playtest R5 (mustReadEntries);
//   visibility                                 -> check_beat_visibility V1-V3 (visibilityEntries);
//   metatiles + traceName + labels[0]          -> check_beat_visibility W1-W4 (traceEntries).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const DEFAULT_FILE = path.join(ROOT, 'scripts/beats.json');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const CHECKPOINTS_TS = path.join(ROOT, '../src/emulator/checkpoints.ts');

// C323 rule: a floor equal to what shipped, so a parser or merge that drops rows
// fails loudly. C367 shipped 15 rows (v3.0-v3.3), C368 16, C369 17; raise it when a beat lands.
const MIN_ROWS = 21;

const REGISTERS = ['place', 'fight', 'weather', 'trace'];
const FACINGS = ['up', 'down', 'left', 'right'];
const VISIBILITY_KEYS = ['name', 'localid', 'hideFlag', 'setup', 'species', 'shows'];

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStringArray = (v) => Array.isArray(v) && v.every((s) => typeof s === 'string');

// "v3.4 Word Travels 1 ..." -> [3, 4]; null when the arc has no version prefix.
function arcVersion(row) {
  const m = /^v(\d+)\.(\d+)/.exec((row && row.arc) || '');
  return m ? [Number(m[1]), Number(m[2])] : null;
}

// a < b for [major, minor] pairs.
function versionLess(a, b) {
  return a[0] !== b[0] ? a[0] < b[0] : a[1] < b[1];
}

// Pure. Returns [{ id, row, msg }], one per shape problem.
function validateRows(rows) {
  const out = [];
  const add = (id, row, msg) => out.push({ id, row: (row && row.id) || '(no id)', msg });
  for (const r of rows) {
    if (!REGISTERS.includes(r.register)) add('SH-REG', r, `register ${JSON.stringify(r.register)} is not ${REGISTERS.join('|')}`);

    if (r.tiles !== undefined) {
      if (!Array.isArray(r.tiles)) add('SH-TILE', r, 'tiles must be an array');
      else
        for (const t of r.tiles) {
          const ok = Array.isArray(t) && (t.length === 2 || t.length === 3) &&
            Number.isInteger(t[0]) && Number.isInteger(t[1]) && (t.length === 2 || FACINGS.includes(t[2]));
          if (!ok) add('SH-TILE', r, `tile ${JSON.stringify(t)} is not [x, y] or [x, y, ${FACINGS.join('|')}]`);
        }
    }

    if (r.mustRead !== undefined) {
      if (!isObject(r.mustRead)) add('SH-MUSTREAD', r, 'mustRead must be an object of label -> [flags]');
      else
        for (const [label, flags] of Object.entries(r.mustRead))
          if (!isStringArray(flags)) add('SH-MUSTREAD', r, `mustRead.${label} must be an array of flag names`);
    }
    if (r.mustReadScripts !== undefined) {
      const keys = isObject(r.mustRead) ? Object.keys(r.mustRead) : [];
      if (!isStringArray(r.mustReadScripts)) add('SH-MUSTREAD', r, 'mustReadScripts must be an array of mustRead keys');
      else
        for (const s of r.mustReadScripts)
          if (!keys.includes(s)) add('SH-MUSTREAD', r, `mustReadScripts names ${s}, which is not a mustRead key`);
    }

    if (r.visibility !== undefined) {
      const v = r.visibility;
      const keys = isObject(v) ? Object.keys(v).sort() : null;
      if (!keys || keys.join() !== [...VISIBILITY_KEYS].sort().join()) {
        add('SH-VIS', r, `visibility must have exactly {${VISIBILITY_KEYS.join(', ')}}`);
      } else {
        for (const k of VISIBILITY_KEYS.filter((k) => k !== 'shows'))
          if (typeof v[k] !== 'string' || !v[k]) add('SH-VIS', r, `visibility.${k} must be a non-empty string`);
        if (typeof v.shows !== 'boolean') add('SH-VIS', r, 'visibility.shows must be true or false');
      }
    }

    if (r.b5Exempt !== undefined) {
      const ver = arcVersion(r);
      if (!ver || !versionLess(ver, [3, 4])) add('SH-B5X', r, 'b5Exempt is only for legacy rows (arc older than v3.4)');
      if (!isObject(r.b5Exempt)) add('SH-B5X', r, 'b5Exempt must be an object of playtest name or "*" -> reason');
      else
        for (const [k, reason] of Object.entries(r.b5Exempt)) {
          if (k !== '*' && !(r.playtests || []).includes(k)) add('SH-B5X', r, `b5Exempt names ${k}, which is not in playtests`);
          if (typeof reason !== 'string' || !reason.trim()) add('SH-B5X', r, `b5Exempt.${k} needs a reason`);
        }
    }
  }
  return out;
}

const cache = new Map();

// Reads, validates and caches the manifest. Throws on a shape problem or a row-count drop.
function loadBeats(file = process.env.BEATS_JSON || DEFAULT_FILE) {
  if (cache.has(file)) return cache.get(file);
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(rows)) throw new Error(`beats: SH-ROWS: ${file}: must be an array of rows`);
  if (rows.length < MIN_ROWS)
    throw new Error(`beats: SH-ROWS: ${path.basename(file)}: only ${rows.length} rows, expected at least ${MIN_ROWS} (MIN_ROWS); did a row get dropped?`);
  const problems = validateRows(rows);
  if (problems.length) {
    const p = problems[0];
    const err = new Error(`beats: ${p.id}: ${p.row}: ${p.msg}` + (problems.length > 1 ? ` (+${problems.length - 1} more)` : ''));
    err.problems = problems;
    throw err;
  }
  cache.set(file, rows);
  return rows;
}

function rowsForMap(map, rows = loadBeats()) {
  return rows.filter((r) => r.map === map);
}

// Rows whose speaker is a believer -> [{ id, map, x, y, facing }] (facing null for [x, y] tiles).
function believerTiles(rows = loadBeats()) {
  const out = [];
  for (const r of rows.filter((r) => r.speaker === 'believer'))
    for (const [x, y, facing] of r.tiles || []) out.push({ id: r.id, map: r.map, x, y, facing: facing || null });
  return out;
}

// check_playtest R5: one entry per mustRead key, in row order then key order.
function mustReadEntries(rows = loadBeats()) {
  const out = [];
  for (const r of rows.filter((r) => r.mustRead))
    for (const [key, flags] of Object.entries(r.mustRead)) {
      const kind = (r.mustReadScripts || []).includes(key) ? 'script' : 'label';
      out.push({ item: r.checklistItem, map: r.map, [kind]: key, mustRead: flags });
    }
  return out;
}

// check_beat_visibility V1-V3: one entry per row with `visibility`, in row order.
function visibilityEntries(rows = loadBeats()) {
  return rows.filter((r) => r.visibility).map((r) => {
    const v = r.visibility;
    return { beat: v.name, map: r.map, localid: v.localid, hideFlag: v.hideFlag, setup: v.setup, species: v.species, shows: v.shows };
  });
}

// check_beat_visibility W1-W4: one trace per row with `metatiles`; every tile of
// a trace must share one metatile and one `from` (hex string in beats.json).
function traceEntries(rows = loadBeats()) {
  return rows.filter((r) => r.metatiles).map((r) => {
    const m = r.metatiles;
    if (!Array.isArray(m) || !m.length) throw new Error(`beats: SH-TRACE: ${r.id}: metatiles must be a non-empty array`);
    if (!r.traceName) throw new Error(`beats: SH-TRACE: ${r.id}: a row with metatiles needs traceName`);
    if (m.some((t) => t.metatile !== m[0].metatile || t.from !== m[0].from))
      throw new Error(`beats: SH-TRACE: ${r.id}: every metatiles entry must share one metatile and from`);
    return { map: r.map, label: r.labels[0], name: r.traceName, metatile: m[0].metatile, from: parseInt(m[0].from, 16), tiles: m.map((t) => [t.x, t.y]) };
  });
}

// data/maps/<folder>/map.json `id`, e.g. Route109 -> MAP_ROUTE109; null if there is no such map.
function mapId(folder) {
  const file = path.join(MAPS_DIR, folder, 'map.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8')).id || null;
}

// Checkpoint name -> start map, read from src/emulator/checkpoints.ts as text
// (read-only; tech-debt "checkpoints.json single source" would replace this).
// For each name in `CHECKPOINT_NAMES = [...]`, the first `map: "MAP_..."` after
// `const <NAME_UPPER>: Checkpoint = {` and before the next top-level `const `.
// Throws B5c when a listed name does not resolve or fewer than 3 resolve.
function checkpointMaps(text = fs.readFileSync(CHECKPOINTS_TS, 'utf8')) {
  const fail = (msg) => {
    const err = new Error(`beats: B5c: checkpoints.ts: ${msg}`);
    err.id = 'B5c';
    throw err;
  };
  const list = /CHECKPOINT_NAMES\s*=\s*\[([^\]]*)\]/.exec(text);
  if (!list) fail('no CHECKPOINT_NAMES = [...] array');
  const names = [...list[1].matchAll(/["'](\w+)["']/g)].map((m) => m[1]);
  const lines = text.split('\n');
  const out = {};
  const unresolved = [];
  for (const name of names) {
    const start = lines.findIndex((l) => l.startsWith(`const ${name.toUpperCase()}: Checkpoint = {`));
    let map = null;
    if (start >= 0)
      for (let i = start + 1; i < lines.length && !/^const /.test(lines[i]); i++) {
        const m = /\bmap:\s*"(MAP_\w+)"/.exec(lines[i]);
        if (m) {
          map = m[1];
          break;
        }
      }
    if (map) out[name] = map;
    else unresolved.push(name);
  }
  if (unresolved.length) fail(`checkpoint(s) ${unresolved.join(', ')} have no const <NAME>: Checkpoint block with a map: "MAP_..."`);
  if (Object.keys(out).length < 3) fail(`only ${Object.keys(out).length} checkpoint(s) resolved, expected at least 3 (parser broke?)`);
  return out;
}

module.exports = {
  MIN_ROWS,
  REGISTERS,
  loadBeats,
  validateRows,
  rowsForMap,
  believerTiles,
  mustReadEntries,
  visibilityEntries,
  traceEntries,
  mapId,
  arcVersion,
  versionLess,
  checkpointMaps,
};
