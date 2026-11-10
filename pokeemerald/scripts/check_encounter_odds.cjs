#!/usr/bin/env node
'use strict';

// Red Ink reachability floors (C348).
//
// Every v3.0/v3.1 beat needs its FIELD NOTES page species caught: page 1
// LOTAD_HOENN, page 2 SHROOMISH_HOENN, page 3 GLIGAR_HOENN, page 4 VULPIX_HOENN.
// This hack has no DexNav, so these floors stand in for one: each species keeps
// at least FLOORS[].min percent of its home map's land slots, summed over every
// slot it occupies (duplicate slots add up). C346 set the rates and C348 locked
// them; lowering a floor is a design change, not tuning.
//
// Reads src/data/wild_encounters.json (group gWildMonHeaders) and fails (exit 1) when:
//   - the land_mons slot percentages are not exactly LAND_RATES (parser drift);
//   - a floor's map or its land_mons table is missing;
//   - a floor species' summed slot percentage is below its floor;
//   - fewer than MIN_LAND_TABLES encounter entries have land_mons (parser drift).
// The map's own encounter_rate is printed for information only; it never fails.
//
// --selftest runs check() on in-memory copies of the JSON: unmodified (pass),
// GLIGAR_HOENN planted in a 4% slot on B2F (fail), LOTAD_HOENN removed from
// Route 102 (fail), SHROOMISH_HOENN split over two 5% slots (exactly 10%, pass).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_FILE = path.join(ROOT, 'src', 'data', 'wild_encounters.json');
const GROUP = 'gWildMonHeaders';
const LAND_RATES = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];
const MIN_LAND_TABLES = 50;

const FLOORS = [
  { species: 'SPECIES_LOTAD_HOENN', map: 'MAP_ROUTE102', table: 'land_mons', min: 20, page: 1 },
  { species: 'SPECIES_SHROOMISH_HOENN', map: 'MAP_PETALBURG_WOODS', table: 'land_mons', min: 10, page: 2 },
  { species: 'SPECIES_GLIGAR_HOENN', map: 'MAP_GRANITE_CAVE_B2F', table: 'land_mons', min: 10, page: 3 },
  { species: 'SPECIES_VULPIX_HOENN', map: 'MAP_ROUTE113', table: 'land_mons', min: 10, page: 4 },
];

function findGroup(json) {
  return (json.wild_encounter_groups || []).find((g) => g.label === GROUP) || null;
}

function findEncounter(group, map, table) {
  return (group.encounters || []).find((e) => e.map === map && e[table]) || null;
}

// Pure: returns { errors, info, landTables }.
function check(json) {
  const errors = [];
  const info = [];
  const group = findGroup(json);
  if (!group) return { errors: [`no ${GROUP} group in wild_encounters.json`], info, landTables: 0 };

  const field = (group.fields || []).find((f) => f.type === 'land_mons');
  const rates = field ? field.encounter_rates : null;
  if (!Array.isArray(rates) || rates.length !== LAND_RATES.length || rates.some((r, i) => r !== LAND_RATES[i])) {
    errors.push(`land_mons encounter_rates are ${JSON.stringify(rates)}, expected ${JSON.stringify(LAND_RATES)} (parser drift?)`);
    return { errors, info, landTables: 0 };
  }

  for (const f of FLOORS) {
    const enc = (group.encounters || []).find((e) => e.map === f.map);
    if (!enc) {
      errors.push(`page ${f.page} ${f.species}: no encounter entry for ${f.map}`);
      continue;
    }
    const tbl = enc[f.table];
    if (!tbl || !Array.isArray(tbl.mons)) {
      errors.push(`page ${f.page} ${f.species}: ${f.map} has no ${f.table} table`);
      continue;
    }
    let sum = 0;
    tbl.mons.forEach((m, i) => {
      if (m && m.species === f.species) sum += rates[i] || 0;
    });
    info.push(`${f.species} on ${f.map}: ${sum}% of land slots (floor ${f.min}%), map encounter_rate ${tbl.encounter_rate}`);
    if (sum < f.min)
      errors.push(`page ${f.page} ${f.species} on ${f.map}: ${sum}% of land slots, below the ${f.min}% floor`);
  }

  const landTables = (group.encounters || []).filter((e) => e.land_mons).length;
  if (landTables < MIN_LAND_TABLES)
    errors.push(`parser found only ${landTables} land tables (expected at least ${MIN_LAND_TABLES})`);

  return { errors, info, landTables };
}

function landMons(json, map) {
  return findEncounter(findGroup(json), map, 'land_mons').land_mons.mons;
}

function selftest(json) {
  const copy = () => JSON.parse(JSON.stringify(json));
  const cases = [];

  cases.push({ name: 'unmodified', json: copy(), pass: true });

  {
    const j = copy();
    const mons = landMons(j, 'MAP_GRANITE_CAVE_B2F');
    const i = mons.findIndex((m) => m.species === 'SPECIES_GLIGAR_HOENN');
    if (i < 0) throw new Error('selftest: GLIGAR_HOENN not on GRANITE_CAVE_B2F');
    [mons[i].species, mons[8].species] = [mons[8].species, mons[i].species];
    cases.push({ name: 'planted 4% GLIGAR_HOENN', json: j, pass: false, mention: 'SPECIES_GLIGAR_HOENN' });
  }

  {
    const j = copy();
    for (const m of landMons(j, 'MAP_ROUTE102'))
      if (m.species === 'SPECIES_LOTAD_HOENN') m.species = 'SPECIES_ZIGZAGOON';
    cases.push({ name: 'LOTAD_HOENN removed from Route 102', json: j, pass: false, mention: 'SPECIES_LOTAD_HOENN' });
  }

  {
    const j = copy();
    const mons = landMons(j, 'MAP_PETALBURG_WOODS');
    for (const m of mons)
      if (m.species === 'SPECIES_SHROOMISH_HOENN') m.species = 'SPECIES_WURMPLE';
    mons[6].species = 'SPECIES_SHROOMISH_HOENN';
    mons[7].species = 'SPECIES_SHROOMISH_HOENN';
    cases.push({ name: 'SHROOMISH_HOENN in two 5% slots (10%)', json: j, pass: true });
  }

  let bad = 0;
  for (const c of cases) {
    const { errors } = check(c.json);
    const ok = c.pass
      ? errors.length === 0
      : errors.length > 0 && errors.some((e) => e.includes(c.mention));
    if (!ok) {
      bad++;
      console.error(`check_encounter_odds selftest FAILED: ${c.name} (expected ${c.pass ? 'pass' : 'fail'}${c.mention ? ` naming ${c.mention}` : ''}); errors: ${JSON.stringify(errors)}`);
    }
  }
  if (bad) process.exit(1);
  console.log(`check_encounter_odds selftest: OK (${cases.length} cases)`);
}

function main() {
  const json = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  if (process.argv.includes('--selftest')) {
    selftest(json);
    return;
  }
  const { errors, info, landTables } = check(json);
  for (const line of info) console.log(`  ${line}`);
  if (errors.length) {
    for (const e of errors) console.error(`check_encounter_odds: ${e}`);
    process.exit(1);
  }
  console.log(`check_encounter_odds: OK (${landTables} land tables, ${FLOORS.length} floors)`);
}

main();
