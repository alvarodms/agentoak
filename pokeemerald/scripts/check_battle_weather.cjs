#!/usr/bin/env node
'use strict';

// Battle weather table guard (C385).
//
// include/trainer_battle_weather.h's sTrainerBattleWeather (C384) makes a
// trainer always fight in a set weather. Nothing in the build ties a row to the
// trainer it names, the rematch table, or the playtests that prove it, so this
// lint does. A row's lead is the first mon of the party named by the trainer's
// `.party = MACRO(sParty_X)` in src/data/trainers.h; a playtest COVERS the row
// when a step `expectBattle {opponent: <lead species>, level: <lead lvl>}` is
// followed (before the next expectBattle) by an `expectBattleWeather` whose
// first value equals the row's mapped type.
//
// Fails (exit 1) when:
//   W1. the initializer is non-empty but no `{ TRAINER_X, WEATHER_Y }` row
//       parses, or opponents.h yields fewer than 100 IDs (parse failure);
//   W2. a row's TRAINER_X is not #defined in opponents.h below TRAINERS_COUNT;
//   W3. TRAINER_X is argument 2-5 of a REMATCH(...) row in src/battle_setup.c
//       (argument 1, the base trainer, is fine): rematches fight under
//       ordinary skies (C384);
//   W4. WEATHER_Y has no battle weather mapping (WEATHER_MAP below);
//   W5. the row's lead cannot be found, no playtest covers the row, or a
//       playtest that fights the lead asserts a different weather (or none)
//       before its next expectBattle.
//
// Usage: node scripts/check_battle_weather.cjs [--selftest]
//        (run by `make check_battle_weather`, part of `make check_all`)

const fs = require('fs');
const path = require('path');

const { parseIds } = require('./check_trainer_slots.cjs');

const ROOT = path.join(__dirname, '..');
const WEATHER_H = path.join(ROOT, 'include/trainer_battle_weather.h');
const OPPONENTS_H = path.join(ROOT, 'include/constants/opponents.h');
const BATTLE_SETUP_C = path.join(ROOT, 'src/battle_setup.c');
const TRAINERS_H = path.join(ROOT, 'src/data/trainers.h');
const PARTIES_H = path.join(ROOT, 'src/data/trainer_parties.h');
const PLAYTESTS_DIR = path.join(ROOT, 'playtests');
const MIN_IDS = 100;

// Overworld WEATHER_* -> expectBattleWeather value (GetBattleStartWeather, battle_util.c).
const WEATHER_MAP = {
  WEATHER_DROUGHT: 'sun',
  WEATHER_RAIN: 'rain',
  WEATHER_RAIN_THUNDERSTORM: 'rain',
  WEATHER_DOWNPOUR: 'rain',
  WEATHER_SANDSTORM: 'sandstorm',
};

const TABLE_RE = /sTrainerBattleWeather\s*\[\s*\]\s*=\s*\{([\s\S]*?)\n\s*\};/;
const ROW_RE = /\{\s*(TRAINER_\w+)\s*,\s*(WEATHER_\w+)\s*\}/g;
const REMATCH_RE = /REMATCH\(\s*(TRAINER_\w+)\s*,\s*(TRAINER_\w+)\s*,\s*(TRAINER_\w+)\s*,\s*(TRAINER_\w+)\s*,\s*(TRAINER_\w+)\s*,\s*MAP_\w+\s*\)/g;

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// trainer_battle_weather.h text -> { rows: [{ trainer, weather }], error }
function parseWeatherTable(text) {
  const m = stripComments(text).match(TABLE_RE);
  if (!m) return { rows: [], error: 'W1 parse failure: no sTrainerBattleWeather[] initializer' };
  const rows = [];
  let r;
  ROW_RE.lastIndex = 0;
  while ((r = ROW_RE.exec(m[1])) !== null) rows.push({ trainer: r[1], weather: r[2] });
  if (m[1].trim() !== '' && rows.length === 0) {
    return { rows, error: 'W1 parse failure: sTrainerBattleWeather is non-empty but no { TRAINER_X, WEATHER_Y } row parsed' };
  }
  return { rows, error: null };
}

// battle_setup.c text -> Set of trainers that are argument 2-5 of a REMATCH(...) row
function parseRematchSlots(text) {
  const slots = new Set();
  let m;
  REMATCH_RE.lastIndex = 0;
  while ((m = REMATCH_RE.exec(stripComments(text))) !== null) {
    for (let i = 2; i <= 5; i++) slots.add(m[i]);
  }
  return slots;
}

// trainer -> { species, lvl, partyName } or { error }
function findLead(trainer, trainersText, partiesText) {
  const block = trainersText.match(new RegExp(`\\[${escapeRe(trainer)}\\]\\s*=[^\\n]*\\n\\s*\\{([\\s\\S]*?)\\n\\s*\\},`));
  if (!block) return { error: `W5 ${trainer} has no [${trainer}] entry in trainers.h` };
  const party = block[1].match(/\.party\s*=\s*\w+\(\s*(\w+)\s*\)/);
  if (!party) return { error: `W5 ${trainer} has no .party = MACRO(sParty_X) in trainers.h` };
  const partyName = party[1];
  const arr = partiesText.match(new RegExp(`\\b${escapeRe(partyName)}\\[\\]\\s*=\\s*\\{\\s*\\{([^}]*)\\}`));
  if (!arr) return { error: `W5 ${trainer}: party ${partyName}[] not found in trainer_parties.h` };
  const species = arr[1].match(/\.species\s*=\s*(SPECIES_\w+)/);
  const lvl = arr[1].match(/\.lvl\s*=\s*(\d+)/);
  if (!species || !lvl) return { error: `W5 ${trainer}: cannot read lead .species/.lvl of ${partyName}` };
  return { species: species[1], lvl: Number(lvl[1]), partyName };
}

// playtest steps -> for each expectBattle matching the lead, the first
// expectBattleWeather before the next expectBattle (null when none).
function leadWeathers(steps, species, lvl) {
  const found = [];
  if (!Array.isArray(steps)) return found;
  for (let i = 0; i < steps.length; i++) {
    const eb = steps[i] && steps[i].expectBattle;
    if (!eb || eb.opponent !== species || Number(eb.level) !== lvl) continue;
    let weather = null;
    for (let j = i + 1; j < steps.length; j++) {
      if (steps[j] && steps[j].expectBattle) break;
      if (steps[j] && steps[j].expectBattleWeather !== undefined) {
        weather = steps[j].expectBattleWeather;
        break;
      }
    }
    found.push(weather);
  }
  return found;
}

// All rules. inputs: { weatherText, opponentsText, battleSetupText, trainersText,
// partiesText, playtests: [{ name, steps }], minIds } -> { errors, lines }
function checkAll(inputs) {
  const errors = [];
  const lines = [];
  const { rows, error } = parseWeatherTable(inputs.weatherText);
  if (error) errors.push(error);
  const ids = parseIds(inputs.opponentsText);
  const minIds = inputs.minIds ?? MIN_IDS;
  if (ids.length < minIds) errors.push(`W1 parse failure: ${ids.length} IDs in opponents.h (expected >= ${minIds})`);
  const defined = new Set(ids.map((e) => e.name));
  const rematchSlots = parseRematchSlots(inputs.battleSetupText);

  for (const { trainer, weather } of rows) {
    if (!defined.has(trainer)) errors.push(`W2 ${trainer} is not #defined in opponents.h below TRAINERS_COUNT`);
    if (rematchSlots.has(trainer)) errors.push(`W3 ${trainer} is a rematch slot; rematches fight under ordinary skies (C384)`);
    const type = WEATHER_MAP[weather];
    if (!type) {
      errors.push(`W4 no battle weather mapping for ${weather} (${trainer})`);
      continue;
    }
    const lead = findLead(trainer, inputs.trainersText, inputs.partiesText);
    if (lead.error) {
      errors.push(lead.error);
      continue;
    }
    const covering = [];
    for (const p of inputs.playtests) {
      for (const w of leadWeathers(p.steps, lead.species, lead.lvl)) {
        if (w === type) {
          if (!covering.includes(p.name)) covering.push(p.name);
        } else if (w === null) {
          errors.push(`W5 playtest ${p.name} fights ${trainer} (${lead.species} ${lead.lvl}) but asserts no expectBattleWeather, table says ${type}`);
        } else {
          errors.push(`W5 playtest ${p.name} asserts '${w}' for ${trainer}, table says ${type}`);
        }
      }
    }
    if (covering.length === 0) {
      errors.push(`W5 ${trainer} has no covering playtest (expectBattle ${lead.species} ${lead.lvl} then expectBattleWeather "${type}")`);
    }
    lines.push(`${trainer}  ${weather} → ${type}  lead ${lead.species} ${lead.lvl}  covered by ${covering.length} playtest(s): ${covering.join(', ')}`);
  }
  return { errors, lines, rows };
}

function selftest() {
  const fail = (msg) => {
    console.error(`check_battle_weather: selftest FAILED: ${msg}`);
    process.exit(1);
  };
  const opponents = [
    '#define TRAINER_NONE 0',
    '#define TRAINER_SUNNY 1',
    '#define TRAINER_A_1 2',
    '#define TRAINER_A_2 3',
    '#define TRAINERS_COUNT 4',
  ].join('\n');
  const battleSetup = [
    '#define REMATCH(trainer1, trainer2, trainer3, trainer4, trainer5, map)  \\',
    '    [REMATCH_A] = REMATCH(TRAINER_A_1, TRAINER_A_2, TRAINER_A_2, TRAINER_A_2, TRAINER_A_2, MAP_ROUTE101),',
  ].join('\n');
  const trainerEntry = (id, party) => [
    `    [${id}] =`,
    '    {',
    `        .trainerName = _("X"),`,
    `        .party = NO_ITEM_DEFAULT_MOVES(${party}),`,
    '    },',
    '',
  ].join('\n');
  const trainers = trainerEntry('TRAINER_SUNNY', 'sParty_Sunny') + trainerEntry('TRAINER_A_1', 'sParty_A1') + trainerEntry('TRAINER_A_2', 'sParty_A2');
  const partyArr = (name, species, lvl) => [
    `static const struct TrainerMonNoItemDefaultMoves ${name}[] = {`,
    '    {',
    '    .iv = 0,',
    `    .lvl = ${lvl},`,
    `    .species = ${species},`,
    '    }',
    '};',
    '',
  ].join('\n');
  const parties = partyArr('sParty_Sunny', 'SPECIES_TROPIUS', 31) + partyArr('sParty_A1', 'SPECIES_ZUBAT', 5) + partyArr('sParty_A2', 'SPECIES_GOLBAT', 25);
  const table = (rows) => `static const struct TrainerBattleWeather sTrainerBattleWeather[] =\n{\n${rows}\n};\n`;
  const pt = (name, weather, species = 'SPECIES_TROPIUS', level = 31) => ({
    name,
    steps: [{ wait: 1 }, { expectBattle: { opponent: species, level } }, { comment: 'x' }, { expectBattleWeather: weather }],
  });
  const base = { opponentsText: opponents, battleSetupText: battleSetup, trainersText: trainers, partiesText: parties, minIds: 1 };
  const run = (rows, playtests) => checkAll({ ...base, weatherText: table(rows), playtests });
  const expectFail = (label, res, rule) => {
    if (!res.errors.some((e) => e.startsWith(rule))) fail(`${label}: expected a ${rule} failure, got ${JSON.stringify(res.errors)}`);
  };

  // (a) valid row + covering playtest passes
  const a = run('    { TRAINER_SUNNY, WEATHER_DROUGHT },', [pt('sunny-ok', 'sun')]);
  if (a.errors.length) fail(`(a) valid row failed: ${a.errors.join('; ')}`);
  if (!a.lines[0] || !a.lines[0].includes('covered by 1 playtest(s): sunny-ok')) fail(`(a) bad line ${a.lines[0]}`);
  // base trainer (argument 1) of a REMATCH row is allowed
  const a1 = run('    { TRAINER_A_1, WEATHER_RAIN },', [pt('a1-rain', 'rain', 'SPECIES_ZUBAT', 5)]);
  if (a1.errors.length) fail(`(a) base rematch trainer failed: ${a1.errors.join('; ')}`);
  // (b) rematch slot fails W3
  expectFail('(b) rematch slot', run('    { TRAINER_A_2, WEATHER_RAIN },', [pt('a2-rain', 'rain', 'SPECIES_GOLBAT', 25)]), 'W3');
  // (c) WEATHER_FOG fails W4
  expectFail('(c) fog', run('    { TRAINER_SUNNY, WEATHER_FOG_HORIZONTAL },', [pt('sunny-ok', 'sun')]), 'W4');
  // (d) a playtest asserting rain for the sun row fails W5
  const d = run('    { TRAINER_SUNNY, WEATHER_DROUGHT },', [pt('sunny-ok', 'sun'), pt('sunny-wrong', 'rain')]);
  expectFail('(d) wrong weather', d, 'W5');
  if (!d.errors.some((e) => e.includes("sunny-wrong asserts 'rain'"))) fail(`(d) message ${d.errors}`);
  // (e) no covering playtest fails W5
  expectFail('(e) uncovered', run('    { TRAINER_SUNNY, WEATHER_DROUGHT },', [pt('other', 'sun', 'SPECIES_ZUBAT', 5)]), 'W5');
  // (f) undefined trainer fails W2
  expectFail('(f) undefined', run('    { TRAINER_GHOST, WEATHER_DROUGHT },', []), 'W2');
  // W1: non-empty but unparseable initializer
  expectFail('W1 garbage', run('    { 12, 3 },', []), 'W1');
  // W1: too few opponents.h IDs
  expectFail('W1 ids', checkAll({ ...base, minIds: 100, weatherText: table('    { TRAINER_SUNNY, WEATHER_DROUGHT },'), playtests: [pt('sunny-ok', 'sun')] }), 'W1');
  // weather after a second expectBattle does not count for the first
  const twoBattles = { name: 'two', steps: [{ expectBattle: { opponent: 'SPECIES_TROPIUS', level: 31 } }, { expectBattle: { opponent: 'SPECIES_ZUBAT', level: 5 } }, { expectBattleWeather: 'sun' }] };
  expectFail('unbounded weather', run('    { TRAINER_SUNNY, WEATHER_DROUGHT },', [twoBattles]), 'W5');
  console.log('check_battle_weather: selftest ok');
}

function loadPlaytests(errors) {
  const out = [];
  for (const f of fs.readdirSync(PLAYTESTS_DIR).filter((n) => n.endsWith('.json')).sort()) {
    try {
      const json = JSON.parse(fs.readFileSync(path.join(PLAYTESTS_DIR, f), 'utf8'));
      out.push({ name: json.name || f.replace(/\.json$/, ''), steps: json.steps });
    } catch (e) {
      errors.push(`playtests/${f}: ${e.message}`);
    }
  }
  return out;
}

function main() {
  const loadErrors = [];
  const playtests = loadPlaytests(loadErrors);
  const { errors, lines, rows } = checkAll({
    weatherText: fs.readFileSync(WEATHER_H, 'utf8'),
    opponentsText: fs.readFileSync(OPPONENTS_H, 'utf8'),
    battleSetupText: fs.readFileSync(BATTLE_SETUP_C, 'utf8'),
    trainersText: fs.readFileSync(TRAINERS_H, 'utf8'),
    partiesText: fs.readFileSync(PARTIES_H, 'utf8'),
    playtests,
  });
  errors.push(...loadErrors);
  for (const l of lines) console.log(l);
  if (errors.length) {
    console.error(`check_battle_weather: ${errors.length} failure(s):`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log(`check_battle_weather: OK (${rows.length} row${rows.length === 1 ? '' : 's'})`);
}

module.exports = { parseWeatherTable, parseRematchSlots, findLead, leadWeathers, checkAll, WEATHER_MAP };

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else main();
}
