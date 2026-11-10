//
// --selftest runs check() on in-memory copies of the real inputs: unmodified
// (pass), a second object on the first den map reusing its doll's FLAG_TEMP_*
// (Rule 1, fail), that den's EventMacro_StaticDenTransition line removed
// (Rule 2, fail), and a new flags.h #define sharing its FLAG_CAUGHT_* value
// (Rule 3, fail). It exits 1 if any planted case fails to fail (C352).
//
// Usage: node scripts/check_dens.cjs [--selftest]
//   (`make check_dens` runs --selftest, then the real check; part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const FLAGS_H = path.join(ROOT, 'include/constants/flags.h');

// Maps allowed to share a FLAG_TEMP_* across several objects (genuine vanilla
// patterns only, each with a reason). Empty unless a vanilla map needs it.
const TEMP_FLAG_SHARE_ALLOWLIST = {};

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

function splitArgs(rest) {
  return rest.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

// inputs = { mapNames: [sorted names], maps: { <name>: { json: parsed map.json | null,
// script: scripts.inc text | null } }, flagsH: flags.h text }.
// Pure: returns { errors, dens }.
function check(inputs) {
  const errors = [];
  const { mapNames, maps, flagsH } = inputs;
  const readMapJson = (mapName) => (maps[mapName] ? maps[mapName].json : null);

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
    const script = maps[mapName] ? maps[mapName].script : null;
    if (script === null || script === undefined) continue;
    const lines = script.split('\n').map(stripComment);

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
  for (const line of flagsH.split('\n')) {
    const m = /^\s*#define\s+(\w+)\s+(0x[0-9A-Fa-f]+)\b/.exec(line);
    if (m) flagDefs.push({ name: m[1], value: parseInt(m[2], 16) });
  }
  const definedCount = (name) => flagsH
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

  return { errors, dens };
}

function readInputs() {
  const mapNames = fs.readdirSync(MAPS_DIR)
    .filter((d) => fs.statSync(path.join(MAPS_DIR, d)).isDirectory())
    .sort();
  const maps = {};
  for (const mapName of mapNames) {
    const jsonFile = path.join(MAPS_DIR, mapName, 'map.json');
    const scriptFile = path.join(MAPS_DIR, mapName, 'scripts.inc');
    maps[mapName] = {
      json: fs.existsSync(jsonFile) ? JSON.parse(fs.readFileSync(jsonFile, 'utf8')) : null,
      script: fs.existsSync(scriptFile) ? fs.readFileSync(scriptFile, 'utf8') : null,
    };
  }
  return { mapNames, maps, flagsH: fs.readFileSync(FLAGS_H, 'utf8') };
}

// Copies only the den maps' entries that a case mutates; the rest are shared read-only.
function cloneInputs(inputs, mapName) {
  const maps = { ...inputs.maps };
  if (mapName) maps[mapName] = JSON.parse(JSON.stringify(inputs.maps[mapName]));
  return { mapNames: inputs.mapNames, maps, flagsH: inputs.flagsH };
}

function selftest(inputs) {
  const base = check(inputs);
  if (base.dens.length === 0) {
    console.error('check_dens selftest FAILED: no StaticDen found in the real tree, nothing to mutate');
    process.exit(1);
  }
  const den = base.dens[0];
  const cases = [];

  cases.push({ name: 'unmodified', inputs, pass: true });

  {
    // Rule 1 (+ Rule 2 holder count): a second object on the den map reuses the doll's FLAG_TEMP_*
    const j = cloneInputs(inputs, den.mapName);
    const objs = j.maps[den.mapName].json.object_events;
    const doll = objs.find((o) => typeof o.flag === 'string' && /^FLAG_TEMP_/.test(o.flag));
    if (!doll) throw new Error(`selftest: no FLAG_TEMP_* object on ${den.mapName}`);
    objs.push({ ...doll, x: doll.x + 1 });
    cases.push({ name: `duplicate ${doll.flag} object on ${den.mapName}`, inputs: j, pass: false, mention: `share ${doll.flag}` });
  }

  {
    // Rule 2: the den's EventMacro_StaticDenTransition line is removed
    const j = cloneInputs(inputs, den.mapName);
    const before = j.maps[den.mapName].script;
    j.maps[den.mapName].script = before
      .split('\n')
      .filter((l) => !/^\s*EventMacro_StaticDenTransition\b/.test(stripComment(l)))
      .join('\n');
    if (j.maps[den.mapName].script === before) throw new Error(`selftest: no StaticDenTransition on ${den.mapName}`);
    cases.push({ name: `StaticDenTransition removed on ${den.mapName}`, inputs: j, pass: false, mention: `missing EventMacro_StaticDenTransition ${den.caughtFlag}` });
  }

  {
    // Rule 3: another flag #defined to the den's FLAG_CAUGHT_* value
    const j = cloneInputs(inputs, null);
    const m = new RegExp(`^\\s*#define\\s+${den.caughtFlag}\\s+(0x[0-9A-Fa-f]+)`, 'm').exec(inputs.flagsH);
    if (!m) throw new Error(`selftest: ${den.caughtFlag} has no hex #define`);
    j.flagsH = `${inputs.flagsH}\n#define FLAG_SELFTEST_CLASH ${m[1]}\n`;
    cases.push({ name: `${den.caughtFlag} value shared`, inputs: j, pass: false, mention: 'also used by FLAG_SELFTEST_CLASH' });
  }

  let bad = 0;
  for (const c of cases) {
    const { errors } = check(c.inputs);
    const ok = c.pass
      ? errors.length === 0
      : errors.length > 0 && errors.some((e) => e.includes(c.mention));
    if (!ok) {
      bad++;
      console.error(`check_dens selftest FAILED: ${c.name} (expected ${c.pass ? 'pass' : 'fail'}${c.mention ? ` naming "${c.mention}"` : ''}); errors: ${JSON.stringify(errors)}`);
    }
  }
  if (bad) process.exit(1);
  console.log(`check_dens selftest OK (${cases.length} cases)`);
}

function main() {
  const inputs = readInputs();
  if (process.argv.includes('--selftest')) {
    selftest(inputs);
    return;
  }
  const { errors, dens } = check(inputs);
  if (errors.length > 0) {
    console.error(`check_dens: ${errors.length} problem(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`check_dens: ${dens.length} dens OK (${dens.map((d) => d.mapName).join(', ')})`);
}

main();
