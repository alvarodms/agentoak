#!/usr/bin/env node
'use strict';

// Boss species ownership audit (#193 "one owner per signature species").
//
// Parses src/data/trainer_parties.h, groups party arrays by boss, and reports
// every species fielded by two or more bosses. Grunts and route trainers are
// not audited (faction uniforms / filler are exempt by design).
//
// Usage: node scripts/audit_boss_species.cjs [--strict]
//   --strict  exit 1 when any unaccepted collision exists (default: always 0)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PARTIES = path.join(ROOT, 'src/data/trainer_parties.h');

// Boss name -> array-name patterns (all tiers / rematches of that boss).
const BOSS_GROUPS = {
  Roxanne: [/^sParty_Roxanne\d$/],
  Brawly: [/^sParty_Brawly\d$/],
  Wattson: [/^sParty_Wattson\d$/],
  Flannery: [/^sParty_Flannery\d$/],
  Norman: [/^sParty_Norman\d$/],
  Winona: [/^sParty_Winona\d$/],
  TateAndLiza: [/^sParty_TateAndLiza\d$/],
  Wallace: [/^sParty_WallaceGym\d$/],
  Sidney: [/^sParty_Sidney(Rematch\d)?$/],
  Phoebe: [/^sParty_Phoebe(Rematch\d)?$/],
  Glacia: [/^sParty_Glacia(Rematch\d)?$/],
  Drake: [/^sParty_Drake(Rematch\d)?$/],
  Steven: [/^sParty_Steven(Champion|Rematch\d)?$/],
  Maxie: [/^sParty_Maxie/],
  Tabitha: [/^sParty_Tabitha/],
  Archie: [/^sParty_Archie$/],
  Shelly: [/^sParty_Shelly/],
  Matt: [/^sParty_Matt$/],
};

// Deliberate shared species. Each entry lists the boss pairs it is allowed
// for; the same species on any other pair still counts as a collision.
const ACCEPTED_OVERLAPS = {
  SKARMORY: { pairs: [['Winona', 'Steven']], why: 'vanilla on both; kept per #194' },
  MIGHTYENA: { pairs: [], why: 'Sidney vanilla lead; villain bosses must not field it' },
  CORSOLA_HOENN: { pairs: [['Phoebe', 'Shelly']], why: 'Phoebe R1 rematch; Shelly = Aqua adopted migrant' },
  GLISCOR_HOENN: { pairs: [['Brawly', 'Archie']], why: 'Brawly rematch-only; Archie adopted migrant' },
};

function parseParties(text) {
  const parties = new Map();
  const re = /static const struct \w+ (sParty_\w+)\[\] = \{([\s\S]*?)\n\};/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const species = [...m[2].matchAll(/\.species\s*=\s*SPECIES_(\w+)/g)].map(s => s[1]);
    parties.set(m[1], species);
  }
  return parties;
}

function pairAccepted(species, a, b) {
  const entry = ACCEPTED_OVERLAPS[species];
  if (!entry) return false;
  return entry.pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function main() {
  const strict = process.argv.includes('--strict');
  const parties = parseParties(fs.readFileSync(PARTIES, 'utf8'));

  // boss -> { arrays: [...], species: Set }
  const bosses = {};
  for (const [boss, patterns] of Object.entries(BOSS_GROUPS)) {
    const arrays = [...parties.keys()].filter(name => patterns.some(p => p.test(name)));
    const species = new Set(arrays.flatMap(name => parties.get(name)));
    bosses[boss] = { arrays, species };
  }

  console.log('== Species per boss ==');
  for (const [boss, { arrays, species }] of Object.entries(bosses)) {
    if (arrays.length === 0) {
      console.log(`${boss}: (no arrays matched -- check BOSS_GROUPS)`);
      continue;
    }
    console.log(`${boss} [${arrays.length} arrays]: ${[...species].sort().join(', ')}`);
  }

  // species -> [boss, ...]
  const owners = new Map();
  for (const [boss, { species }] of Object.entries(bosses)) {
    for (const s of species) {
      if (!owners.has(s)) owners.set(s, []);
      owners.get(s).push(boss);
    }
  }

  const accepted = [];
  const collisions = [];
  for (const [species, list] of [...owners.entries()].sort()) {
    if (list.length < 2) continue;
    const bad = [];
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++)
        if (!pairAccepted(species, list[i], list[j])) bad.push(`${list[i]}+${list[j]}`);
    if (bad.length === 0) accepted.push({ species, list });
    else collisions.push({ species, list, bad });
  }

  console.log('\n== Accepted overlaps ==');
  if (accepted.length === 0) console.log('(none)');
  for (const { species, list } of accepted)
    console.log(`${species}: ${list.join(', ')} -- ${ACCEPTED_OVERLAPS[species].why}`);

  console.log('\n== Collisions ==');
  if (collisions.length === 0) console.log('(none)');
  for (const { species, list, bad } of collisions)
    console.log(`${species}: ${list.join(', ')} (unaccepted: ${bad.join(', ')})`);

  console.log(`\nCOLLISIONS: ${collisions.length}`);
  process.exit(strict && collisions.length > 0 ? 1 : 0);
}

main();
