#!/usr/bin/env node

/**
 * Build script: parses pokeemerald source data files into docs/data/game-guide.json
 * Extracts starters, wild encounters, gym leaders, Elite Four, Champion, and rival teams.
 * Run: node docs/build-game-guide.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POKE = join(ROOT, 'pokeemerald');
const OUTPUT_DIR = join(__dirname, 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'game-guide.json');

// ── Encounter slot rates (from wild_encounters.json header) ──
const LAND_RATES = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];
const WATER_RATES = [60, 30, 5, 4, 1];
const ROCK_SMASH_RATES = [60, 30, 5, 4, 1];
const FISHING_RATES = [70, 30, 60, 20, 20, 40, 40, 15, 4, 1];

// ── Helpers ──

/** SPECIES_TRAPINCH → Trapinch */
function formatSpecies(raw) {
  return raw
    .replace(/^SPECIES_/, '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** ITEM_ORAN_BERRY → Oran Berry, ITEM_NONE → null */
function formatItem(raw) {
  if (!raw || raw === 'ITEM_NONE') return null;
  return raw
    .replace(/^ITEM_/, '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** MOVE_ROCK_THROW → Rock Throw, MOVE_NONE → null */
function formatMove(raw) {
  if (!raw || raw === 'MOVE_NONE') return null;
  return raw
    .replace(/^MOVE_/, '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** MAP_ROUTE101 → Route 101, MAP_METEOR_FALLS_1F_1R → Meteor Falls 1F 1R, etc. */
function formatMapName(raw) {
  const s = raw.replace(/^MAP_/, '');
  // Routes: ROUTE101 → Route 101
  const routeMatch = s.match(/^ROUTE(\d+)$/);
  if (routeMatch) return `Route ${routeMatch[1]}`;
  // Otherwise: title-case with spaces
  return s
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

function rarityTier(percent) {
  if (percent >= 20) return 'Common';
  if (percent >= 10) return 'Uncommon';
  if (percent >= 4) return 'Rare';
  return 'Ultra-Rare';
}

// ── Starters ──

async function parseStarters() {
  const src = await readFile(join(POKE, 'src/starter_choose.c'), 'utf-8');
  const match = src.match(/sStarterMon\[.*?\]\s*=\s*\{([^}]+)\}/s);
  if (!match) return [];
  const species = [...match[1].matchAll(/SPECIES_(\w+)/g)].map((m, i) => ({
    species: formatSpecies('SPECIES_' + m[1]),
    speciesConst: 'SPECIES_' + m[1],
    position: i,
  }));
  return species;
}

// ── Wild Encounters ──

async function parseWildEncounters() {
  const raw = await readFile(join(POKE, 'src/data/wild_encounters.json'), 'utf-8');
  const data = JSON.parse(raw);
  const encounterGroup = data.wild_encounter_groups.find(g => g.for_maps);
  if (!encounterGroup) return {};

  const routes = {};

  for (const enc of encounterGroup.encounters) {
    const name = formatMapName(enc.map);
    const entry = { mapConst: enc.map };

    if (enc.land_mons) {
      entry.land = enc.land_mons.mons.map((m, i) => ({
        species: formatSpecies(m.species),
        minLevel: m.min_level,
        maxLevel: m.max_level,
        rate: LAND_RATES[i],
        rarity: rarityTier(LAND_RATES[i]),
      }));
      entry.landEncounterRate = enc.land_mons.encounter_rate;
    }

    if (enc.water_mons) {
      entry.water = enc.water_mons.mons.map((m, i) => ({
        species: formatSpecies(m.species),
        minLevel: m.min_level,
        maxLevel: m.max_level,
        rate: WATER_RATES[i],
        rarity: rarityTier(WATER_RATES[i]),
      }));
    }

    if (enc.fishing_mons) {
      const mons = enc.fishing_mons.mons;
      entry.fishing = {
        oldRod: mons.slice(0, 2).map((m, i) => ({
          species: formatSpecies(m.species),
          minLevel: m.min_level,
          maxLevel: m.max_level,
          rate: FISHING_RATES[i],
          rarity: rarityTier(FISHING_RATES[i]),
        })),
        goodRod: mons.slice(2, 5).map((m, i) => ({
          species: formatSpecies(m.species),
          minLevel: m.min_level,
          maxLevel: m.max_level,
          rate: FISHING_RATES[i + 2],
          rarity: rarityTier(FISHING_RATES[i + 2]),
        })),
        superRod: mons.slice(5, 10).map((m, i) => ({
          species: formatSpecies(m.species),
          minLevel: m.min_level,
          maxLevel: m.max_level,
          rate: FISHING_RATES[i + 5],
          rarity: rarityTier(FISHING_RATES[i + 5]),
        })),
      };
    }

    if (enc.rock_smash_mons) {
      entry.rockSmash = enc.rock_smash_mons.mons.map((m, i) => ({
        species: formatSpecies(m.species),
        minLevel: m.min_level,
        maxLevel: m.max_level,
        rate: ROCK_SMASH_RATES[i],
        rarity: rarityTier(ROCK_SMASH_RATES[i]),
      }));
    }

    routes[name] = entry;
  }

  return routes;
}

// ── Trainer Parties ──

/**
 * Parse all trainer party arrays from trainer_parties.h
 * Returns Map<partyName, MonData[]>
 */
async function parseTrainerParties() {
  const src = await readFile(join(POKE, 'src/data/trainer_parties.h'), 'utf-8');
  const parties = new Map();

  // Match each party array declaration, handling all 4 struct types
  const partyRegex = /static\s+const\s+struct\s+TrainerMon(\w+)\s+(sParty_\w+)\[\]\s*=\s*\{([\s\S]*?)\n\};/g;
  let match;

  while ((match = partyRegex.exec(src)) !== null) {
    const structType = match[1]; // e.g. "NoItemDefaultMoves", "ItemCustomMoves"
    const partyName = match[2];  // e.g. "sParty_Roxanne1"
    const body = match[3];

    const hasItem = structType.includes('Item') && !structType.startsWith('NoItem');
    const hasMoves = structType.includes('CustomMoves');

    const mons = [];
    // Match each mon block within the party — use [\s\S] to handle nested {} in .moves
    const monRegex = /\{([\s\S]*?\.species\s*=\s*\w+[\s\S]*?)\n\s{4}\}/g;
    let monMatch;
    while ((monMatch = monRegex.exec(body)) !== null) {
      const block = monMatch[1];
      const mon = {};

      const sp = block.match(/\.species\s*=\s*(SPECIES_\w+)/);
      if (sp) mon.species = formatSpecies(sp[1]);

      const lvl = block.match(/\.lvl\s*=\s*(\d+)/);
      if (lvl) mon.level = parseInt(lvl[1], 10);

      const iv = block.match(/\.iv\s*=\s*(\d+)/);
      if (iv) mon.iv = parseInt(iv[1], 10);

      if (hasItem) {
        const item = block.match(/\.heldItem\s*=\s*(ITEM_\w+)/);
        mon.heldItem = item ? formatItem(item[1]) : null;
      }

      if (hasMoves) {
        const movesMatch = block.match(/\.moves\s*=\s*\{([^}]+)\}/);
        if (movesMatch) {
          mon.moves = movesMatch[1]
            .split(',')
            .map(m => formatMove(m.trim()))
            .filter(Boolean);
        }
      }

      mons.push(mon);
    }

    parties.set(partyName, mons);
  }

  return parties;
}

// ── Trainers ──

/**
 * Parse all trainer entries from trainers.h
 * Returns array of trainer objects with id, name, class, partyRef, doubleBattle
 */
async function parseTrainers() {
  const src = await readFile(join(POKE, 'src/data/trainers.h'), 'utf-8');
  const trainers = [];

  // Match each trainer block: [TRAINER_ID] = { ... }
  const trainerRegex = /\[(TRAINER_\w+)\]\s*=\s*\{([\s\S]*?)\n\s{4}\},/g;
  let match;

  while ((match = trainerRegex.exec(src)) !== null) {
    const trainerId = match[1];
    const body = match[2];

    const name = body.match(/\.trainerName\s*=\s*_\("([^"]+)"\)/);
    const cls = body.match(/\.trainerClass\s*=\s*(TRAINER_CLASS_\w+)/);
    const dbl = body.match(/\.doubleBattle\s*=\s*(TRUE|FALSE)/);
    const partyRef = body.match(/(?:NO_ITEM_DEFAULT_MOVES|NO_ITEM_CUSTOM_MOVES|ITEM_DEFAULT_MOVES|ITEM_CUSTOM_MOVES)\((sParty_\w+)\)/);

    if (!name || !partyRef) continue;

    trainers.push({
      id: trainerId,
      name: name[1],
      trainerClass: cls ? cls[1] : null,
      doubleBattle: dbl ? dbl[1] === 'TRUE' : false,
      partyRef: partyRef[1],
    });
  }

  return trainers;
}

// ── Assemble Key Trainers ──

function assembleGymLeaders(trainers, parties) {
  // Gym leaders use TRAINER_CLASS_LEADER and have _1 suffix for main battle
  const gymOrder = [
    { pattern: /^TRAINER_ROXANNE_1$/, name: 'Roxanne', gym: 1, type: 'Rock', location: 'Rustboro City' },
    { pattern: /^TRAINER_BRAWLY_1$/, name: 'Brawly', gym: 2, type: 'Fighting', location: 'Dewford Town' },
    { pattern: /^TRAINER_WATTSON_1$/, name: 'Wattson', gym: 3, type: 'Electric', location: 'Mauville City' },
    { pattern: /^TRAINER_FLANNERY_1$/, name: 'Flannery', gym: 4, type: 'Fire', location: 'Lavaridge Town' },
    { pattern: /^TRAINER_NORMAN_1$/, name: 'Norman', gym: 5, type: 'Normal', location: 'Petalburg City' },
    { pattern: /^TRAINER_WINONA_1$/, name: 'Winona', gym: 6, type: 'Flying', location: 'Fortree City' },
    { pattern: /^TRAINER_TATE_AND_LIZA_1$/, name: 'Tate & Liza', gym: 7, type: 'Psychic', location: 'Mossdeep City' },
    { pattern: /^TRAINER_JUAN_1$/, name: 'Juan', gym: 8, type: 'Water', location: 'Sootopolis City' },
  ];

  return gymOrder.map(def => {
    const trainer = trainers.find(t => def.pattern.test(t.id));
    if (!trainer) return { ...def, party: [], pattern: undefined };
    const party = parties.get(trainer.partyRef) || [];
    return {
      name: def.name,
      gym: def.gym,
      type: def.type,
      location: def.location,
      doubleBattle: trainer.doubleBattle,
      party,
    };
  });
}

function assembleEliteFour(trainers, parties) {
  const e4Order = [
    { pattern: /^TRAINER_SIDNEY$/, name: 'Sidney', type: 'Dark' },
    { pattern: /^TRAINER_PHOEBE$/, name: 'Phoebe', type: 'Ghost' },
    { pattern: /^TRAINER_GLACIA$/, name: 'Glacia', type: 'Ice' },
    { pattern: /^TRAINER_DRAKE$/, name: 'Drake', type: 'Dragon' },
  ];

  return e4Order.map(def => {
    const trainer = trainers.find(t => def.pattern.test(t.id));
    if (!trainer) return { ...def, party: [], pattern: undefined };
    return {
      name: def.name,
      type: def.type,
      party: parties.get(trainer.partyRef) || [],
    };
  });
}

function assembleChampion(trainers, parties) {
  const trainer = trainers.find(t => t.trainerClass === 'TRAINER_CLASS_CHAMPION');
  if (!trainer) return null;
  return {
    name: trainer.name,
    party: parties.get(trainer.partyRef) || [],
  };
}

function assembleRivals(trainers, parties) {
  // Rival trainers: TRAINER_BRENDAN_* and TRAINER_MAY_*
  // Group by location for a progression view
  const rivalTrainers = trainers.filter(t =>
    /^TRAINER_(BRENDAN|MAY)_/.test(t.id) && !/PLACEHOLDER/.test(t.id)
  );

  return rivalTrainers.map(t => {
    // Extract location from trainer ID: TRAINER_BRENDAN_ROUTE_103_MUDKIP → Route 103
    const idPart = t.id.replace(/^TRAINER_(BRENDAN|MAY)_/, '');
    // Remove starter suffix
    const locPart = idPart.replace(/_(MUDKIP|TREECKO|TORCHIC)$/, '');
    const starterMatch = idPart.match(/(MUDKIP|TREECKO|TORCHIC)$/);
    const location = locPart
      .split('_')
      .map(w => w.charAt(0) + w.slice(1).toLowerCase())
      .join(' ')
      .replace(/(\d)/, ' $1')
      .replace(/  +/g, ' ')
      .trim();

    return {
      trainerId: t.id,
      rival: t.id.startsWith('TRAINER_BRENDAN') ? 'Brendan' : 'May',
      name: t.name,
      location,
      starterMatchup: starterMatch ? formatSpecies('SPECIES_' + starterMatch[1]) : null,
      doubleBattle: t.doubleBattle,
      party: parties.get(t.partyRef) || [],
    };
  });
}

// ── Main ──

async function main() {
  console.log('Parsing pokeemerald data...');

  const [starters, routes, parties, trainers] = await Promise.all([
    parseStarters(),
    parseWildEncounters(),
    parseTrainerParties(),
    parseTrainers(),
  ]);

  console.log(`  Starters: ${starters.length}`);
  console.log(`  Routes: ${Object.keys(routes).length}`);
  console.log(`  Trainer parties: ${parties.size}`);
  console.log(`  Trainers: ${trainers.length}`);

  const gymLeaders = assembleGymLeaders(trainers, parties);
  const eliteFour = assembleEliteFour(trainers, parties);
  const champion = assembleChampion(trainers, parties);
  const rivals = assembleRivals(trainers, parties);

  const guide = {
    generatedAt: new Date().toISOString(),
    starters,
    routes,
    gymLeaders,
    eliteFour,
    champion,
    rivals,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(guide, null, 2) + '\n');
  console.log(`✔ Generated ${OUTPUT_FILE}`);
  console.log(`  Gym leaders: ${gymLeaders.length}`);
  console.log(`  Elite Four: ${eliteFour.length}`);
  console.log(`  Champion: ${champion ? champion.name : 'not found'}`);
  console.log(`  Rival battles: ${rivals.length}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
