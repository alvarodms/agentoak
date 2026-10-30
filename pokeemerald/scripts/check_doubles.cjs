#!/usr/bin/env node
'use strict';

// Doubles wiring guard (C323).
//
// A double battle is wired in three places: the `trainerbattle_double` /
// `trainerbattle_rematch_double` macro in a script, the trainer's
// `.doubleBattle` field in src/data/trainers.h, and its party array in
// src/data/trainer_parties.h. A mismatch builds fine but breaks in game
// (a single battle where a duet was written, or a double with one foe).
//
// Fails (exit 1) when:
//   R1. a `trainerbattle_double TRAINER_X` target lacks `.doubleBattle = TRUE`.
//       For `trainerbattle_rematch_double TRAINER_X`, the battle actually fought
//       is a later rematch tier from gRematchTable (src/battle_setup.c), so
//       tiers 2-5 of X's REMATCH(...) row are checked instead of X itself
//       (vanilla gym leaders fight their first battle as singles);
//   R2. a trainer with `.doubleBattle = TRUE` has a party with fewer than 2 mons.
//
// Usage: node scripts/check_doubles.cjs   (run by `make check_doubles`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAPS_DIR = path.join(ROOT, 'data/maps');
const SCRIPTS_DIR = path.join(ROOT, 'data/scripts');
const TRAINERS_H = path.join(ROOT, 'src/data/trainers.h');
const PARTIES_H = path.join(ROOT, 'src/data/trainer_parties.h');
const BATTLE_SETUP_C = path.join(ROOT, 'src/battle_setup.c');

// Trainers exempt from a rule, each with a reason. Empty unless vanilla needs it.
const ALLOW = [];

const errors = [];
const rel = (p) => path.relative(ROOT, p);
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// [TRAINER_X] = { ... } blocks from trainers.h
const trainersText = fs.readFileSync(TRAINERS_H, 'utf8');
const trainers = new Map();
{
  const re = /^\s*\[(TRAINER_\w+)\]\s*=[^\n{]*\n?\s*\{([\s\S]*?)^\s*\},/gm;
  let m;
  while ((m = re.exec(trainersText)) !== null) {
    const body = m[2];
    const party = body.match(/\.party\s*=[^\n]*?(sParty_\w+)/);
    trainers.set(m[1], {
      line: lineOf(trainersText, m.index + m[0].indexOf('[')),
      double: /\.doubleBattle\s*=\s*TRUE/.test(body),
      party: party ? party[1] : null,
    });
  }
}

// sParty_X[] = { ... }; arrays from trainer_parties.h -> mon count
const partiesText = fs.readFileSync(PARTIES_H, 'utf8');
const partySizes = new Map();
{
  const re = /(sParty_\w+)\[\]\s*=\s*\{([\s\S]*?)\n\};/g;
  let m;
  while ((m = re.exec(partiesText)) !== null) {
    partySizes.set(m[1], (m[2].match(/\.species\s*=/g) || []).length);
  }
}

// REMATCH(t1, t2, t3, t4, t5, map) rows from battle_setup.c
const rematchRows = new Map();
{
  const text = fs.readFileSync(BATTLE_SETUP_C, 'utf8');
  const re = /=\s*REMATCH\(\s*(TRAINER_\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*,/g;
  let m;
  while ((m = re.exec(text)) !== null) rematchRows.set(m[1], [m[2], m[3], m[4], m[5]]);
}

// Parser sanity: an empty parse would let R2 pass vacuously
if (trainers.size < 100 || partySizes.size < 100) {
  console.error(`check_doubles: parsed only ${trainers.size} trainers / ${partySizes.size} parties; parser out of date?`);
  process.exit(1);
}

function fail(where, trainer, reason) {
  if (ALLOW.includes(trainer)) return;
  errors.push(`${where} ${trainer}: ${reason}`);
}

// R1: script double-battle targets
const scriptFiles = [];
for (const dir of fs.readdirSync(MAPS_DIR)) {
  const f = path.join(MAPS_DIR, dir, 'scripts.inc');
  if (fs.existsSync(f)) scriptFiles.push(f);
}
for (const f of fs.readdirSync(SCRIPTS_DIR)) {
  if (f.endsWith('.inc')) scriptFiles.push(path.join(SCRIPTS_DIR, f));
}
let targets = 0;
for (const file of scriptFiles) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((raw, i) => {
    const line = raw.replace(/@.*$/, '');
    const m = line.match(/^\s*trainerbattle_(rematch_)?double\s+(TRAINER_\w+)/);
    if (!m) return;
    targets++;
    const where = `${rel(file)}:${i + 1}`;
    const ids = m[1] ? (rematchRows.get(m[2]) || [m[2]]) : [m[2]];
    for (const id of ids) {
      const t = trainers.get(id);
      if (!t) fail(where, id, 'no entry in src/data/trainers.h');
      else if (!t.double) fail(where, id, `.doubleBattle is not TRUE (trainers.h:${t.line})`);
    }
  });
}

// R2: doubleBattle trainers need >= 2 mons
let doubles = 0;
for (const [id, t] of trainers) {
  if (!t.double) continue;
  doubles++;
  const where = `${rel(TRAINERS_H)}:${t.line}`;
  if (!t.party) { fail(where, id, 'no sParty_* found in .party'); continue; }
  const size = partySizes.get(t.party);
  if (size === undefined) fail(where, id, `${t.party} not found in trainer_parties.h`);
  else if (size < 2) fail(where, id, `.doubleBattle = TRUE but ${t.party} has ${size} mon(s)`);
}

if (errors.length) {
  console.error(`check_doubles: ${errors.length} failure(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`check_doubles: OK (${targets} double-battle script call(s), ${doubles}/${trainers.size} trainers doubleBattle, ${partySizes.size} parties parsed)`);
