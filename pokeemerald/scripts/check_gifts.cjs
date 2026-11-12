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
//     C329: an `EventMacro_DexBelieverPlace SPECIES_X, ...` line counts as a dex check of its
//     first argument (must be a SPECIES_ constant; same vanilla-twin rule and allowlist).
//     C361: shared scripts in DEX_CHECK_CALLEES take the species in VAR_0x8004 from their
//     caller, so their own ScriptCheckPokedexCaught is skipped and each `call <callee>`
//     is checked against the caller's preceding setvar instead.
//   Rule D (C335, fails unless allowlisted): each sIngameTrades entry in src/data/trade.h; its
//     `.species` (what the player receives) and `.requestedSpecies` (what the NPC asks for) must
//     not be a vanilla SPECIES_X with a SPECIES_X_HOENN twin. Allowlist entries for trades use
//     {"trade": "INGAME_TRADE_X", "field": "species"|"requestedSpecies", "species": "SPECIES_X", "why": "..."}
//     in the same JSON file (same non-empty-why and stale rules).
//
// Usage: node scripts/check_gifts.cjs [--selftest]   (run by `make check_gifts`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const SPECIES_H = path.join(ROOT, 'include/constants/species.h');
const ALLOWLIST = path.join(__dirname, 'check_gifts_allowlist.json');
const TRADE_H = path.join(ROOT, 'src/data/trade.h');

const COMMANDS = ['givemon', 'setwildbattle', 'showmonpic', 'EventMacro_StaticDen'];
const GIFT_COMMANDS = ['givemon', 'setwildbattle', 'EventMacro_StaticDen'];

// Rule C exceptions, as 'data/maps/Foo/scripts.inc:Label' strings. Starts empty.
const DEX_CHECK_ALLOWLIST = [];
// C361: label -> its ScriptCheckPokedexCaught reads the caller's VAR_0x8004 species
const DEX_CHECK_CALLEES = ['FieldNotes_EventScript_ArmFirstInk'];

// Rule D: parse sIngameTrades out of src/data/trade.h text. Returns { trades, errors, used }
// where `used` holds the indexes of the trade allowlist entries that matched.
function scanTrades(text, pairedSet, allow) {
  const out = { trades: [], errors: [], used: new Set() };
  const start = text.indexOf('sIngameTrades[]');
  if (start < 0) {
    out.errors.push('src/data/trade.h: sIngameTrades[] not found (parser broke?)');
    return out;
  }
  const end = text.indexOf('};', start);
  const body = text.slice(start, end < 0 ? undefined : end);
  const parts = body.split(/\[\s*(INGAME_TRADE_\w+)\s*\]\s*=/);
  for (let i = 1; i < parts.length; i += 2) {
    const id = parts[i];
    const entry = parts[i + 1];
    const trade = { id };
    for (const field of ['species', 'requestedSpecies']) {
      const m = new RegExp(`\\.${field}\\s*=\\s*(\\w+)`).exec(entry);
      if (!m) {
        out.errors.push(`src/data/trade.h ${id}: no .${field}`);
        continue;
      }
      const species = m[1];
      trade[field] = species;
      if (!pairedSet.has(species)) continue;
      const ai = allow.findIndex((a) => a && a.trade === id && a.field === field && a.species === species);
      if (ai >= 0) out.used.add(ai);
      else
        out.errors.push(`src/data/trade.h ${id} .${field} = ${species} — vanilla form where ${species}_HOENN exists; use the regional form or allowlist with a "why"`);
    }
    out.trades.push(trade);
  }
  if (out.trades.length === 0) out.errors.push('src/data/trade.h: sIngameTrades has no entries (parser broke?)');
  return out;
}

function selftest() {
  const fail = (msg) => {
    console.error(`check_gifts: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const pairedSet = new Set(['SPECIES_BAGON', 'SPECIES_CORSOLA']);
  const entry = (id, species, requested) =>
    `    [${id}] =\n    {\n        .nickname = _("X"),\n        .species = ${species},\n        .mailNum = -1,\n        .requestedSpecies = ${requested}\n    },\n`;
  const table = (...entries) => `static const struct InGameTrade sIngameTrades[] =\n{\n${entries.join('')}};\n\nstatic const u16 sOther[] = {SPECIES_CORSOLA};\n`;
  const allow = [{ trade: 'INGAME_TRADE_HORSEA', field: 'requestedSpecies', species: 'SPECIES_BAGON', why: 't' }];

  const ok = scanTrades(
    table(entry('INGAME_TRADE_HORSEA', 'SPECIES_HORSEA', 'SPECIES_BAGON'), entry('INGAME_TRADE_C', 'SPECIES_CORSOLA_HOENN', 'SPECIES_BARBOACH')),
    pairedSet,
    allow
  );
  if (ok.errors.length) fail(`clean fixture reported: ${ok.errors.join('; ')}`);
  if (ok.trades.length !== 2) fail(`parsed ${ok.trades.length} trades, expected 2`);
  if (ok.trades[1].requestedSpecies !== 'SPECIES_BARBOACH') fail('.requestedSpecies not read separately from .species');
  if (!ok.used.has(0)) fail('allowlisted Bagon request not marked used');

  const given = scanTrades(table(entry('INGAME_TRADE_C', 'SPECIES_CORSOLA', 'SPECIES_BARBOACH')), pairedSet, allow);
  if (!given.errors.some((e) => e.includes('.species = SPECIES_CORSOLA'))) fail('planted vanilla .species was not reported');
  const asked = scanTrades(table(entry('INGAME_TRADE_C', 'SPECIES_CORSOLA_HOENN', 'SPECIES_BAGON')), pairedSet, allow);
  if (!asked.errors.some((e) => e.includes('.requestedSpecies = SPECIES_BAGON'))) fail('allowlist matched the wrong trade id');
  const broken = scanTrades('static const u16 sNothing[] = {};', pairedSet, allow);
  if (!broken.errors.some((e) => e.includes('parser broke'))) fail('missing sIngameTrades was not reported');
  console.log('check_gifts: selftest OK');
  process.exit(0);
}

if (process.argv.includes('--selftest')) selftest();

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
    const bm = /^EventMacro_DexBelieverPlace\b\s*([^,]*)/.exec(line);
    if (bm) {
      dexChecks++;
      const species = bm[1].trim();
      const key = `${rel}:${label}`;
      if (DEX_CHECK_ALLOWLIST.includes(key)) {
        dexAllowUsed.add(key);
      } else if (!/^SPECIES_\w+$/.test(species)) {
        errors.push(`${rel}:${idx + 1} ${label} EventMacro_DexBelieverPlace needs a SPECIES_X_HOENN first argument`);
      } else if (paired.has(species)) {
        errors.push(`${rel}:${idx + 1} ${label} dex check of vanilla ${species} — ${species}_HOENN exists; check the regional form or add to DEX_CHECK_ALLOWLIST`);
      }
      return;
    }
    const calleeCall = /^call\s+(\w+)/.exec(line);
    const isCalleeCall = calleeCall && DEX_CHECK_CALLEES.includes(calleeCall[1]);
    if (isCalleeCall || /^special(var\s+\w+\s*,)?\s*ScriptCheckPokedexCaught\b/.test(line)) {
      if (!isCalleeCall && DEX_CHECK_CALLEES.includes(label)) return; // checked at each call site
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
    const ai = allowlist.findIndex((a) => a && !a.trade && a.label === label && a.species === species);
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

const tradeScan = scanTrades(fs.readFileSync(TRADE_H, 'utf8'), paired, allowlist);
errors.push(...tradeScan.errors);
allowlist.forEach((entry, i) => {
  if (entry && entry.trade) {
    if (!tradeScan.used.has(i))
      errors.push(`allowlist entry ${i} (${entry.trade} .${entry.field} ${entry.species}): stale, matches no sIngameTrades field`);
  } else if (!allowUsed[i])
    errors.push(`allowlist entry ${i} (${entry && entry.label} ${entry && entry.species}): stale, matches no givemon/setwildbattle`);
});

for (const key of DEX_CHECK_ALLOWLIST)
  if (!dexAllowUsed.has(key)) errors.push(`DEX_CHECK_ALLOWLIST ${key}: stale, matches no ScriptCheckPokedexCaught call or EventMacro_DexBelieverPlace`);

if (errors.length > 0) {
  console.error(`check_gifts: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`check_gifts: ${sites} gift/static sites OK (${allowlisted} allowlisted)`);
console.log(`check_gifts: dex-check species: ${dexChecks} calls OK (${dexAllowUsed.size} allowlisted)`);
console.log(`check_gifts: in-game trades: ${tradeScan.trades.length} OK (${tradeScan.used.size} allowlisted)`);
