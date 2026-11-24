#!/usr/bin/env node
'use strict';

// C394: object graphics id budget (report-only, never fails the build).
//
// graphicsId is a u8 and OBJ_EVENT_GFX_VAR_F = NUM_OBJ_EVENT_GFX + 1 + 15, so
// NUM_OBJ_EVENT_GFX may not pass 239 (include/constants/event_objects.h). A new
// object graphic must reclaim an existing id (v3.11 took 76, UNUSED_NATU_DOLL,
// for OBJ_EVENT_GFX_GRAVE_LANTERN). This prints:
//   (a) NUM_OBJ_EVENT_GFX against the 239 ceiling;
//   (b) the reclaim pool: OBJ_EVENT_GFX_UNUSED_* and *_DOLL ids with zero
//       references outside their wiring (event_objects.h and
//       src/data/object_events/), i.e. no map, script or C code uses them.
//
// Usage:
//   node scripts/check_obj_gfx_slots.cjs              report, exit 0 always
//   node scripts/check_obj_gfx_slots.cjs --selftest   2 planted cases (exit 1 on a miss)
// Make: `make report_obj_gfx_slots` (selftest + report; deliberately NOT in check_all).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CEILING = 239;
const HEADER = 'include/constants/event_objects.h';
const WIRING_DIR = 'src/data/object_events';
const SEARCH_DIRS = ['include', 'src', 'data'];
const EXTS = new Set(['.h', '.c', '.inc', '.s', '.json']);

function parseHeader(text) {
  const ids = [];
  let num = null;
  for (const m of text.matchAll(/^#define\s+(OBJ_EVENT_GFX_\w+|NUM_OBJ_EVENT_GFX)\s+(\d+)\s*$/gm)) {
    if (m[1] === 'NUM_OBJ_EVENT_GFX') num = Number(m[2]);
    else ids.push({ name: m[1], value: Number(m[2]) });
  }
  return { ids, num };
}

const isCandidate = (name) => /^OBJ_EVENT_GFX_(UNUSED_\w+|\w+_DOLL)$/.test(name);

// files: [{ rel, text }]; returns Map name -> [rel paths that mention it]
function countRefs(names, files) {
  const refs = new Map(names.map((n) => [n, []]));
  for (const { rel, text } of files) {
    if (rel === HEADER || rel.startsWith(`${WIRING_DIR}/`)) continue;
    for (const n of names) {
      if (new RegExp(`\\b${n}\\b`).test(text)) refs.get(n).push(rel);
    }
  }
  return refs;
}

function* walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) yield* walk(rel);
    else if (EXTS.has(path.extname(e.name))) yield rel;
  }
}

function report() {
  const { ids, num } = parseHeader(fs.readFileSync(path.join(ROOT, HEADER), 'utf8'));
  console.log(`report_obj_gfx_slots: NUM_OBJ_EVENT_GFX ${num} of ceiling ${CEILING} (${CEILING - num} free; a new id needs a reclaim)`);
  const candidates = ids.filter((i) => isCandidate(i.name));
  const files = [];
  for (const d of SEARCH_DIRS) for (const rel of walk(d)) files.push({ rel, text: fs.readFileSync(path.join(ROOT, rel), 'utf8') });
  const refs = countRefs(candidates.map((c) => c.name), files);
  const pool = candidates.filter((c) => refs.get(c.name).length === 0);
  const used = candidates.filter((c) => refs.get(c.name).length > 0);
  console.log(`report_obj_gfx_slots: reclaim pool ${pool.length} id(s) (no reference outside the wiring):`);
  for (const c of pool) console.log(`  ${c.value}\t${c.name}`);
  console.log(`report_obj_gfx_slots: ${used.length} doll/unused id(s) in use (not reclaimable)`);
}

function selftest() {
  let ok = true;
  const check = (label, cond) => { if (!cond) { ok = false; console.error(`report_obj_gfx_slots selftest FAIL: ${label}`); } };
  // 1: header parse finds NUM and ids, candidate filter keeps only UNUSED_/_DOLL
  const h = parseHeader('#define OBJ_EVENT_GFX_LUCY 75\n#define OBJ_EVENT_GFX_UNUSED_X_DOLL 76\n#define OBJ_EVENT_GFX_PIKA_DOLL 77\n#define NUM_OBJ_EVENT_GFX 239\n');
  check('parse NUM', h.num === 239);
  check('parse ids', h.ids.length === 3);
  check('candidates', h.ids.filter((i) => isCandidate(i.name)).map((i) => i.value).join() === '76,77');
  // 2: wiring files don't count; a map use does, and a longer name is not a match
  const refs = countRefs(['OBJ_EVENT_GFX_UNUSED_X_DOLL', 'OBJ_EVENT_GFX_PIKA_DOLL'], [
    { rel: HEADER, text: 'OBJ_EVENT_GFX_PIKA_DOLL OBJ_EVENT_GFX_UNUSED_X_DOLL' },
    { rel: `${WIRING_DIR}/object_event_graphics_info_pointers.h`, text: '[OBJ_EVENT_GFX_UNUSED_X_DOLL] =' },
    { rel: 'data/maps/X/map.json', text: '"graphics_id": "OBJ_EVENT_GFX_PIKA_DOLL"' },
    { rel: 'data/maps/Y/map.json', text: '"graphics_id": "OBJ_EVENT_GFX_UNUSED_X_DOLL_2"' },
  ]);
  check('wiring ignored', refs.get('OBJ_EVENT_GFX_UNUSED_X_DOLL').length === 0);
  check('map use counted', refs.get('OBJ_EVENT_GFX_PIKA_DOLL').join() === 'data/maps/X/map.json');
  if (!ok) process.exit(1);
  console.log('report_obj_gfx_slots selftest OK (2 cases)');
}

if (process.argv.includes('--selftest')) selftest();
else report();
