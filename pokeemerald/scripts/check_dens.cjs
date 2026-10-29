#!/usr/bin/env node
'use strict';

// Static den wiring guard (C319).
//
// A StaticDen (asm/macros/event_macros.inc, C315) is spread over three places:
// the interaction script, the ON_TRANSITION/ON_RESUME map scripts that hide the
// doll once caught, and a map.json object whose visibility flag is a FLAG_TEMP_*.
// No headless emulator exists in the pipeline, so this lint checks the wiring
// statically instead.
//
// Fails (exit 1) when:
//   1. any map.json has two or more object_events sharing the same FLAG_TEMP_* flag;
//   2. a scripts.inc with `EventMacro_StaticDen <species>, <lvl>, <item>, <caughtFlag>, ...`
//      lacks `EventMacro_StaticDenTransition <caughtFlag>, <tempFlag>` or
//      `EventMacro_StaticDenTryRemove`, lacks MAP_SCRIPT_ON_TRANSITION or
//      MAP_SCRIPT_ON_RESUME, or its map.json doesn't have exactly one object
//      whose flag is <tempFlag>;
//   3. a <caughtFlag> is used by more than one den, or isn't #defined exactly
//      once in include/constants/flags.h with a hex value no other define shares.
//
// Usage: node scripts/check_dens.cjs   (run by `make check_dens`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const FLAGS_H = path.join(ROOT, 'include/constants/flags.h');

// Maps allowed to share a FLAG_TEMP_* across several objects (genuine vanilla
// patterns only, each with a reason). Empty unless a vanilla map needs it.
const TEMP_FLAG_SHARE_ALLOWLIST = {};

const errors = [];

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

function splitArgs(rest) {
  return rest.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

function readMapJson(mapName) {
  const file = path.join(MAPS_DIR, mapName, 'map.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const mapNames = fs.readdirSync(MAPS_DIR)
  .filter((d) => fs.statSync(path.join(MAPS_DIR, d)).isDirectory())
  .sort();

// Rule 1: no FLAG_TEMP_* shared by two objects on one map
for (const mapName of mapNames) {
  const map = readMapJson(mapName);
  if (!map || !Array.isArray(map.object_events)) continue;
  const counts = {};
  for (const obj of map.object_events) {
    if (typeof obj.flag === 'string' && /^FLAG_TEMP_/.test(obj.flag))
      counts[obj.flag] = (counts[obj.flag] || 0) + 1;
  }
  for (const [flag, n] of Object.entries(counts)) {
    if (n < 2) continue;
    const allowed = TEMP_FLAG_SHARE_ALLOWLIST[mapName];
    if (allowed && allowed.flags.includes(flag)) continue;
    errors.push(`${mapName}: ${n} object_events share ${flag} (a den doll's temp flag must be unique on its map)`);
  }
}

// Rule 2: every den is fully wired on its own map
const dens = [];
for (const mapName of mapNames) {
  const scriptFile = path.join(MAPS_DIR, mapName, 'scripts.inc');
  if (!fs.existsSync(scriptFile)) continue;
  const lines = fs.readFileSync(scriptFile, 'utf8').split('\n').map(stripComment);

  const denLines = [];
  const transitions = [];
  let hasTryRemove = false;
  let hasOnTransition = false;
  let hasOnResume = false;
  for (const raw of lines) {
    const line = raw.trim();
    let m;
    if ((m = /^EventMacro_StaticDenTransition\s+(.*)$/.exec(line))) {
      const args = splitArgs(m[1]);
      transitions.push({ caughtFlag: args[0], tempFlag: args[1] });
    } else if (/^EventMacro_StaticDenTryRemove\b/.test(line)) {
      hasTryRemove = true;
    } else if ((m = /^EventMacro_StaticDen\s+(.*)$/.exec(line))) {
      denLines.push(splitArgs(m[1]));
    } else if (/^map_script\s+MAP_SCRIPT_ON_TRANSITION\b/.test(line)) {
      hasOnTransition = true;
    } else if (/^map_script\s+MAP_SCRIPT_ON_RESUME\b/.test(line)) {
      hasOnResume = true;
    }
  }

  for (const args of denLines) {
    const [species, level, , caughtFlag] = args;
    const where = `${mapName} (${species} Lv${level})`;
    if (!caughtFlag) {
      errors.push(`${where}: EventMacro_StaticDen has fewer than 4 arguments`);
      continue;
    }
    dens.push({ mapName, species, caughtFlag });

    const transition = transitions.find((t) => t.caughtFlag === caughtFlag);
    if (!transition || !transition.tempFlag)
      errors.push(`${where}: missing EventMacro_StaticDenTransition ${caughtFlag}, FLAG_TEMP_*`);
    if (!hasTryRemove)
      errors.push(`${where}: missing EventMacro_StaticDenTryRemove (ON_RESUME removal subroutine)`);
    if (!hasOnTransition)
      errors.push(`${where}: map has no map_script MAP_SCRIPT_ON_TRANSITION`);
    if (!hasOnResume)
      errors.push(`${where}: map has no map_script MAP_SCRIPT_ON_RESUME`);

    if (transition && transition.tempFlag) {
      const map = readMapJson(mapName);
      if (!map) {
        errors.push(`${where}: no map.json`);
      } else {
        const holders = (map.object_events || []).filter((o) => o.flag === transition.tempFlag);
        if (holders.length !== 1)
          errors.push(`${where}: map.json has ${holders.length} object_events with flag ${transition.tempFlag} (expected exactly 1)`);
      }
    }
  }
}

// Rule 3: one den per caught flag, and the flag is uniquely defined
const flagDefs = [];
for (const line of fs.readFileSync(FLAGS_H, 'utf8').split('\n')) {
  const m = /^\s*#define\s+(\w+)\s+(0x[0-9A-Fa-f]+)\b/.exec(line);
  if (m) flagDefs.push({ name: m[1], value: parseInt(m[2], 16) });
}
const definedCount = (name) => fs.readFileSync(FLAGS_H, 'utf8')
  .split('\n')
  .filter((l) => new RegExp(`^\\s*#define\\s+${name}\\b`).test(l)).length;

const byFlag = {};
for (const den of dens) (byFlag[den.caughtFlag] = byFlag[den.caughtFlag] || []).push(den);
for (const [flag, users] of Object.entries(byFlag)) {
  if (users.length > 1)
    errors.push(`${flag}: used by ${users.length} dens (${users.map((d) => d.mapName).join(', ')})`);

  const n = definedCount(flag);
  if (n !== 1) {
    errors.push(`${flag}: #defined ${n} times in include/constants/flags.h (expected 1)`);
    continue;
  }
  const def = flagDefs.find((d) => d.name === flag);
  if (!def) {
    errors.push(`${flag}: not #defined to a hex literal in include/constants/flags.h`);
    continue;
  }
  const clashes = flagDefs.filter((d) => d.name !== flag && d.value === def.value);
  if (clashes.length > 0)
    errors.push(`${flag}: value 0x${def.value.toString(16).toUpperCase()} also used by ${clashes.map((d) => d.name).join(', ')}`);
}

if (errors.length > 0) {
  console.error(`check_dens: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`check_dens: ${dens.length} dens OK (${dens.map((d) => d.mapName).join(', ')})`);
