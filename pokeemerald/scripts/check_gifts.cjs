#!/usr/bin/env node
'use strict';

// Gift / static species guard (C320).
//
// Several species exist twice: vanilla SPECIES_X and the regional SPECIES_X_HOENN.
// A script that shows one form and gives the other, or that still gives the
// vanilla form where the story is about the Hoenn one, compiles fine and is only
// caught by a player (the C279-C319 Mudkip gift bug). This lint checks the
// script commands that pick a species for the player.
//
// For every base name X with both SPECIES_X and SPECIES_X_HOENN in
// include/constants/species.h, scan data/**/*.inc split into blocks at labels:
//   Rule A (always fails): one block names both SPECIES_X and SPECIES_X_HOENN in
//     givemon / setwildbattle / EventMacro_StaticDen / showmonpic (pic/gift mismatch).
//   Rule B (fails unless allowlisted): a givemon / setwildbattle / EventMacro_StaticDen
//     of vanilla SPECIES_X. Allowlist: scripts/check_gifts_allowlist.json,
//     [{"label": "...", "species": "SPECIES_X", "why": "..."}]. An entry needs a
//     non-empty `why`; an entry that matches nothing is stale and fails.
//   Rule C (C328, fails unless in DEX_CHECK_ALLOWLIST): a `specialvar ..., ScriptCheckPokedexCaught`
//     whose nearest preceding `setvar VAR_0x8004, SPECIES_X` in the same label block names a
//     vanilla SPECIES_X that has a SPECIES_X_HOENN twin (Red Ink world reactions must test the
//     regional form the inked page is about). Also fails when no species setvar precedes it.
//
// Usage: node scripts/check_gifts.cjs   (run by `make check_gifts`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const SPECIES_H = path.join(ROOT, 'include/constants/species.h');
const ALLOWLIST = path.join(__dirname, 'check_gifts_allowlist.json');

const COMMANDS = ['givemon', 'setwildbattle', 'showmonpic', 'EventMacro_StaticDen'];
const GIFT_COMMANDS = ['givemon', 'setwildbattle', 'EventMacro_StaticDen'];

// Rule C exceptions, as 'data/maps/Foo/scripts.inc:Label' strings. Starts empty.
const DEX_CHECK_ALLOWLIST = [];

const errors = [];

function stripComment(line) {
  const at = line.indexOf('@');
  return at >= 0 ? line.slice(0, at) : line;
}

function listIncFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listIncFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.inc')) out.push(full);
  }
  return out;
}

// Base names X with both SPECIES_X and SPECIES_X_HOENN defined
const defined = new Set();
for (const line of fs.readFileSync(SPECIES_H, 'utf8').split('\n')) {
  const m = /^\s*#define\s+(SPECIES_\w+)\s/.exec(line);
  if (m) defined.add(m[1]);
}
const paired = new Set();
for (const name of defined) {
  if (name.endsWith('_HOENN')) continue;
  if (defined.has(`${name}_HOENN`)) paired.add(name);
}

let allowlist = [];
if (fs.existsSync(ALLOWLIST)) {
  try {
    allowlist = JSON.parse(fs.readFileSync(ALLOWLIST, 'utf8'));
  } catch (e) {
    errors.push(`${path.relative(ROOT, ALLOWLIST)}: invalid JSON (${e.message})`);
  }
}
if (!Array.isArray(allowlist)) {
  errors.push(`${path.relative(ROOT, ALLOWLIST)}: must be a JSON array`);
  allowlist = [];
}
allowlist.forEach((entry, i) => {
  if (!entry || typeof entry.why !== 'string' || entry.why.trim() === '')
    errors.push(`allowlist entry ${i} (${entry && entry.label} ${entry && entry.species}): missing a non-empty "why"`);
});
const allowUsed = new Array(allowlist.length).fill(false);

let sites = 0;
let allowlisted = 0;
const vanillaHits = [];
let dexChecks = 0;
const dexAllowUsed = new Set();

for (const file of listIncFiles(DATA_DIR).sort()) {
  const rel = path.relative(ROOT, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let label = '(file start)';
  let block = [];
  let dexSpecies = null; // last `setvar VAR_0x8004, X` in this label block

  const flush = () => {
    const byBase = {};
    for (const hit of block) {
      const entry = byBase[hit.base] || (byBase[hit.base] = { vanilla: [], hoenn: [] });
      entry[hit.hoenn ? 'hoenn' : 'vanilla'].push(hit);
    }
    for (const [base, entry] of Object.entries(byBase)) {
      if (entry.vanilla.length > 0 && entry.hoenn.length > 0) {
        const at = entry.vanilla.concat(entry.hoenn).map((h) => `${h.cmd}:${h.line}`).join(', ');
        errors.push(`${rel} ${label}: mixes ${base} and ${base}_HOENN (${at}) — pic/gift mismatch`);
      }
    }
    block = [];
  };

  lines.forEach((raw, idx) => {
    const lm = /^(\w+):{1,2}/.exec(raw);
    if (lm) {
      flush();
      label = lm[1];
      dexSpecies = null;
      return;
    }
    const line = stripComment(raw).trim();
    const sv = /^setvar\s+VAR_0x8004\s*,\s*(\w+)/.exec(line);
    if (sv) dexSpecies = sv[1];
    if (/^special(var\s+\w+\s*,)?\s*ScriptCheckPokedexCaught\b/.test(line)) {
      dexChecks++;
      const key = `${rel}:${label}`;
      if (DEX_CHECK_ALLOWLIST.includes(key)) {
        dexAllowUsed.add(key);
      } else if (!dexSpecies || !dexSpecies.startsWith('SPECIES_')) {
        errors.push(`${rel}:${idx + 1} ${label} ScriptCheckPokedexCaught with no preceding \`setvar VAR_0x8004, SPECIES_X\` in the block`);
      } else if (paired.has(dexSpecies)) {
        errors.push(`${rel}:${idx + 1} ${label} dex check of vanilla ${dexSpecies} — ${dexSpecies}_HOENN exists; check the regional form or add to DEX_CHECK_ALLOWLIST`);
      }
      return;
    }
    const cm = /^(\w+)\s+(SPECIES_\w+)/.exec(line);
    if (!cm || !COMMANDS.includes(cm[1])) return;
    const [, cmd, species] = cm;
    const hoenn = species.endsWith('_HOENN');
    const base = hoenn ? species.slice(0, -'_HOENN'.length) : species;
    if (!paired.has(base)) return;
    const hit = { cmd, species, base, hoenn, line: idx + 1 };
    block.push(hit);
    if (!GIFT_COMMANDS.includes(cmd)) return;
    sites++;
    if (hoenn) return;
    const ai = allowlist.findIndex((a) => a && a.label === label && a.species === species);
    if (ai >= 0) {
      allowUsed[ai] = true;
      allowlisted++;
    } else {
      vanillaHits.push(`${rel}:${idx + 1} ${label} ${species} (${cmd}) — vanilla form where ${species}_HOENN exists; fix or allowlist with a story "why"`);
    }
  });
  flush();
}

errors.push(...vanillaHits);
allowlist.forEach((entry, i) => {
  if (!allowUsed[i])
    errors.push(`allowlist entry ${i} (${entry && entry.label} ${entry && entry.species}): stale, matches no givemon/setwildbattle`);
});

for (const key of DEX_CHECK_ALLOWLIST)
  if (!dexAllowUsed.has(key)) errors.push(`DEX_CHECK_ALLOWLIST ${key}: stale, matches no ScriptCheckPokedexCaught call`);

if (errors.length > 0) {
  console.error(`check_gifts: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`check_gifts: ${sites} gift/static sites OK (${allowlisted} allowlisted)`);
console.log(`check_gifts: dex-check species: ${dexChecks} calls OK (${dexAllowUsed.size} allowlisted)`);
