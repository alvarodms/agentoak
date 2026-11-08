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
// --selftest runs check() on in-memory copies of the real inputs: unmodified
// (pass), the first trainerbattle_double target set to .doubleBattle = FALSE
// (R1, fail), tier 2 of the first trainerbattle_rematch_double row set to FALSE
// (R1 rematch path, fail), and a doubleBattle trainer pointed at a one-mon
// party (R2, fail). It exits 1 if any planted case fails to fail (C352).
//
// Usage: node scripts/check_doubles.cjs [--selftest]
//   (`make check_doubles` runs --selftest, then the real check; part of `make check_all`)

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

const rel = (p) => path.relative(ROOT, p);
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// [TRAINER_X] = { ... } blocks from trainers.h
function parseTrainers(trainersText) {
  const trainers = new Map();
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
  return trainers;
}

// sParty_X[] = { ... }; arrays from trainer_parties.h -> mon count
function parsePartySizes(partiesText) {
  const partySizes = new Map();
  const re = /(sParty_\w+)\[\]\s*=\s*\{([\s\S]*?)\n\};/g;
  let m;
  while ((m = re.exec(partiesText)) !== null) {
    partySizes.set(m[1], (m[2].match(/\.species\s*=/g) || []).length);
  }
  return partySizes;
}

// REMATCH(t1, t2, t3, t4, t5, map) rows from battle_setup.c
function parseRematchRows(battleSetupText) {
  const rematchRows = new Map();
  const re = /=\s*REMATCH\(\s*(TRAINER_\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*,/g;
  let m;
  while ((m = re.exec(battleSetupText)) !== null) rematchRows.set(m[1], [m[2], m[3], m[4], m[5]]);
  return rematchRows;
}

// inputs = { scripts: [{ file: repo-relative path, text }], trainersText, partiesText, battleSetupText }.
// Pure: returns { errors, parserError, targets, doubles, trainerCount, partyCount }.
// parserError is set (and nothing else checked) when the parse is too small to trust.
function check(inputs) {
  const errors = [];
  const trainers = parseTrainers(inputs.trainersText);
  const partySizes = parsePartySizes(inputs.partiesText);
  const rematchRows = parseRematchRows(inputs.battleSetupText);
  const result = { errors, parserError: null, targets: 0, doubles: 0, trainerCount: trainers.size, partyCount: partySizes.size };

  // Parser sanity: an empty parse would let R2 pass vacuously
  if (trainers.size < 100 || partySizes.size < 100) {
    result.parserError = `check_doubles: parsed only ${trainers.size} trainers / ${partySizes.size} parties; parser out of date?`;
    return result;
  }

  function fail(where, trainer, reason) {
    if (ALLOW.includes(trainer)) return;
    errors.push(`${where} ${trainer}: ${reason}`);
  }

  // R1: script double-battle targets
  for (const { file, text } of inputs.scripts) {
    const lines = text.split('\n');
    lines.forEach((raw, i) => {
      const line = raw.replace(/@.*$/, '');
      const m = line.match(/^\s*trainerbattle_(rematch_)?double\s+(TRAINER_\w+)/);
      if (!m) return;
      result.targets++;
      const where = `${file}:${i + 1}`;
      const ids = m[1] ? (rematchRows.get(m[2]) || [m[2]]) : [m[2]];
      for (const id of ids) {
        const t = trainers.get(id);
        if (!t) fail(where, id, 'no entry in src/data/trainers.h');
        else if (!t.double) fail(where, id, `.doubleBattle is not TRUE (trainers.h:${t.line})`);
      }
    });
  }

  // R2: doubleBattle trainers need >= 2 mons
  for (const [id, t] of trainers) {
    if (!t.double) continue;
    result.doubles++;
    const where = `${rel(TRAINERS_H)}:${t.line}`;
    if (!t.party) { fail(where, id, 'no sParty_* found in .party'); continue; }
    const size = partySizes.get(t.party);
    if (size === undefined) fail(where, id, `${t.party} not found in trainer_parties.h`);
    else if (size < 2) fail(where, id, `.doubleBattle = TRUE but ${t.party} has ${size} mon(s)`);
  }

  return result;
}

function readInputs() {
  const files = [];
  for (const dir of fs.readdirSync(MAPS_DIR)) {
    const f = path.join(MAPS_DIR, dir, 'scripts.inc');
    if (fs.existsSync(f)) files.push(f);
  }
  for (const f of fs.readdirSync(SCRIPTS_DIR)) {
    if (f.endsWith('.inc')) files.push(path.join(SCRIPTS_DIR, f));
  }
  return {
    scripts: files.map((f) => ({ file: rel(f), text: fs.readFileSync(f, 'utf8') })),
    trainersText: fs.readFileSync(TRAINERS_H, 'utf8'),
    partiesText: fs.readFileSync(PARTIES_H, 'utf8'),
    battleSetupText: fs.readFileSync(BATTLE_SETUP_C, 'utf8'),
  };
}

// Rewrites the first `.doubleBattle = TRUE` inside trainers.h's [id] block to FALSE.
function unsetDouble(trainersText, id) {
  const start = trainersText.indexOf(`[${id}]`);
  if (start < 0) throw new Error(`selftest: [${id}] not in trainers.h`);
  const end = trainersText.indexOf('\n    },', start);
  const block = trainersText.slice(start, end);
  const flipped = block.replace(/\.doubleBattle\s*=\s*TRUE/, '.doubleBattle = FALSE');
  if (flipped === block) throw new Error(`selftest: ${id} is not .doubleBattle = TRUE`);
  return trainersText.slice(0, start) + flipped + trainersText.slice(end);
}

function selftest(inputs) {
  const trainers = parseTrainers(inputs.trainersText);
  const partySizes = parsePartySizes(inputs.partiesText);
  const rematchRows = parseRematchRows(inputs.battleSetupText);
  const firstTarget = (rematch) => {
    for (const { text } of inputs.scripts) {
      const re = rematch ? /^\s*trainerbattle_rematch_double\s+(TRAINER_\w+)/m : /^\s*trainerbattle_double\s+(TRAINER_\w+)/m;
      const m = re.exec(text);
      if (m) return m[1];
    }
    throw new Error(`selftest: no trainerbattle_${rematch ? 'rematch_' : ''}double in the scripts`);
  };
  const cases = [];

  cases.push({ name: 'unmodified', inputs, pass: true });

  {
    // R1: a trainerbattle_double target loses .doubleBattle = TRUE
    const id = firstTarget(false);
    cases.push({ name: `${id} .doubleBattle = FALSE`, inputs: { ...inputs, trainersText: unsetDouble(inputs.trainersText, id) }, pass: false, mention: `${id}: .doubleBattle is not TRUE` });
  }

  {
    // R1 rematch path: tier 2 of a trainerbattle_rematch_double row loses .doubleBattle = TRUE
    const base = firstTarget(true);
    const row = rematchRows.get(base);
    if (!row) throw new Error(`selftest: ${base} has no REMATCH row`);
    const tier2 = row[0];
    cases.push({ name: `rematch tier 2 ${tier2} .doubleBattle = FALSE`, inputs: { ...inputs, trainersText: unsetDouble(inputs.trainersText, tier2) }, pass: false, mention: `${tier2}: .doubleBattle is not TRUE` });
  }

  {
    // R2: a doubleBattle trainer is pointed at a one-mon party
    const id = [...trainers.keys()].find((k) => trainers.get(k).double && trainers.get(k).party);
    const solo = [...partySizes.keys()].find((p) => partySizes.get(p) === 1);
    if (!id || !solo) throw new Error('selftest: no doubleBattle trainer or no one-mon party to plant');
    const start = inputs.trainersText.indexOf(`[${id}]`);
    const end = inputs.trainersText.indexOf('\n    },', start);
    const block = inputs.trainersText.slice(start, end);
    const planted = block.replace(trainers.get(id).party, solo);
    const trainersText = inputs.trainersText.slice(0, start) + planted + inputs.trainersText.slice(end);
    cases.push({ name: `${id} given one-mon ${solo}`, inputs: { ...inputs, trainersText }, pass: false, mention: `${id}: .doubleBattle = TRUE but ${solo} has 1 mon(s)` });
  }

  let bad = 0;
  for (const c of cases) {
    const { errors, parserError } = check(c.inputs);
    const all = parserError ? [parserError, ...errors] : errors;
    const ok = c.pass
      ? all.length === 0
      : errors.length > 0 && errors.some((e) => e.includes(c.mention));
    if (!ok) {
      bad++;
      console.error(`check_doubles selftest FAILED: ${c.name} (expected ${c.pass ? 'pass' : 'fail'}${c.mention ? ` naming "${c.mention}"` : ''}); errors: ${JSON.stringify(all)}`);
    }
  }
  if (bad) process.exit(1);
  console.log(`check_doubles selftest OK (${cases.length} cases)`);
}

function main() {
  const inputs = readInputs();
  if (process.argv.includes('--selftest')) {
    selftest(inputs);
    return;
  }
  const r = check(inputs);
  if (r.parserError) {
    console.error(r.parserError);
    process.exit(1);
  }
  if (r.errors.length) {
    console.error(`check_doubles: ${r.errors.length} failure(s):`);
    for (const e of r.errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(`check_doubles: OK (${r.targets} double-battle script call(s), ${r.doubles}/${r.trainerCount} trainers doubleBattle, ${r.partyCount} parties parsed)`);
}

main();
