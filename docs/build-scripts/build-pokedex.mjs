#!/usr/bin/env node

/**
 * Build script: parses pokeemerald source data files into docs/public/data/pokedex.json
 * Extracts species info, learnsets, evolution, encounters, and move data.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..');
const ROOT = join(DOCS_DIR, '..');
const POKE = join(ROOT, 'pokeemerald');
const OUTPUT_DIR = join(DOCS_DIR, 'public', 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'pokedex.json');

// ── Helpers ──

/** SPECIES_TRAPINCH → Trapinch */
function formatSpecies(raw) {
  return raw
    .replace(/^SPECIES_/, '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** MOVE_ROCK_THROW → Rock Throw */
function formatMove(raw) {
  if (!raw || raw === 'MOVE_NONE') return null;
  return raw
    .replace(/^MOVE_/, '')
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

/** ABILITY_OVERGROW → Overgrow, ABILITY_NONE → null */
function formatAbility(raw) {
  if (!raw || raw === 'ABILITY_NONE') return null;
  return raw
    .replace(/^ABILITY_/, '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** EGG_GROUP_MONSTER → Monster */
function formatEggGroup(raw) {
  if (!raw || raw === 'EGG_GROUP_UNDISCOVERED' || raw === 'EGG_GROUP_NO_EGGS_DISCOVERED') return 'Undiscovered';
  return raw
    .replace(/^EGG_GROUP_/, '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** GROWTH_MEDIUM_SLOW → Medium Slow */
function formatGrowthRate(raw) {
  if (!raw) return 'Medium Fast';
  return raw
    .replace(/^GROWTH_/, '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** TYPE_GRASS → Grass */
function formatType(raw) {
  if (!raw) return 'Normal';
  const t = raw.replace(/^TYPE_/, '');
  return t.charAt(0) + t.slice(1).toLowerCase();
}

/** MAP_ROUTE101 → Route 101 */
function formatMapName(raw) {
  const s = raw.replace(/^MAP_/, '');
  const routeMatch = s.match(/^ROUTE(\d+)$/);
  if (routeMatch) return `Route ${routeMatch[1]}`;
  return s
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

/** Parse gender ratio constant to human-readable string */
function formatGenderRatio(raw) {
  if (!raw) return 'Unknown';
  if (raw.includes('MON_GENDERLESS')) return 'Genderless';
  if (raw.includes('MON_MALE')) return '100% Male';
  if (raw.includes('MON_FEMALE')) return '100% Female';
  const m = raw.match(/PERCENT_FEMALE\(\s*([\d.]+)\s*\)/);
  if (m) {
    const female = parseFloat(m[1]);
    return `${(100 - female).toFixed(1)}% M / ${female.toFixed(1)}% F`;
  }
  return 'Unknown';
}

// ── National Dex Order ──

async function parseNationalDexOrder() {
  const src = await readFile(join(POKE, 'include/constants/pokedex.h'), 'utf-8');
  const order = new Map();
  let idx = 0;
  for (const m of src.matchAll(/NATIONAL_DEX_(\w+)/g)) {
    if (m[1] === 'NONE') { idx++; continue; }
    order.set('SPECIES_' + m[1], idx);
    idx++;
  }
  return order;
}

// ── Species Info ──

async function parseSpeciesInfo() {
  const src = await readFile(join(POKE, 'src/data/pokemon/species_info.h'), 'utf-8');

  const species = [];
  // Match each [SPECIES_X] = { ... } block
  const blockRe = /\[SPECIES_(\w+)\]\s*=\s*\{([\s\S]*?)\},?\s*(?=\[SPECIES_|\z|$)/g;
  // Alternative: split by [SPECIES_ markers
  const parts = src.split(/(?=\[SPECIES_\w+\]\s*=)/);

  for (const part of parts) {
    const headerMatch = part.match(/\[SPECIES_(\w+)\]\s*=/);
    if (!headerMatch) continue;
    const name = headerMatch[1];
    if (name === 'NONE' || name.startsWith('OLD_UNOWN')) continue;
    // Skip Unown forms (UNOWN_B through UNOWN_Z, UNOWN_EMARK, UNOWN_QMARK)
    if (/^UNOWN_[A-Z]$/.test(name) || name === 'UNOWN_EMARK' || name === 'UNOWN_QMARK') continue;

    const specConst = 'SPECIES_' + name;
    const block = part;

    const getField = (field) => {
      const m = block.match(new RegExp(`\\.${field}\\s*=\\s*([^,}]+)`));
      return m ? m[1].trim() : null;
    };

    const getNumField = (field) => {
      const v = getField(field);
      return v ? parseInt(v, 10) : 0;
    };

    const typesMatch = block.match(/\.types\s*=\s*\{\s*(TYPE_\w+)\s*,\s*(TYPE_\w+)\s*\}/);
    const type1 = typesMatch ? formatType(typesMatch[1]) : 'Normal';
    const type2 = typesMatch ? formatType(typesMatch[2]) : type1;

    const eggMatch = block.match(/\.eggGroups\s*=\s*\{\s*(EGG_GROUP_\w+)\s*,\s*(EGG_GROUP_\w+)\s*,?\s*\}/);
    const egg1 = eggMatch ? formatEggGroup(eggMatch[1]) : 'Undiscovered';
    const egg2 = eggMatch ? formatEggGroup(eggMatch[2]) : egg1;

    const abilMatch = block.match(/\.abilities\s*=\s*\{(.*?)\}/s);
    const abilities = [];
    if (abilMatch) {
      for (const am of abilMatch[1].matchAll(/ABILITY_\w+/g)) {
        const a = formatAbility(am[0]);
        if (a && !abilities.includes(a)) abilities.push(a);
      }
    }

    const hp = getNumField('baseHP');
    const atk = getNumField('baseAttack');
    const def = getNumField('baseDefense');
    const spa = getNumField('baseSpAttack');
    const spd = getNumField('baseSpDefense');
    const spe = getNumField('baseSpeed');

    species.push({
      speciesConstant: specConst,
      name: formatSpecies(specConst),
      types: type1 === type2 ? [type1] : [type1, type2],
      stats: { hp, atk, def, spa, spd, spe },
      bst: hp + atk + def + spa + spd + spe,
      abilities,
      catchRate: getNumField('catchRate'),
      genderRatio: formatGenderRatio(getField('genderRatio')),
      eggGroups: egg1 === egg2 ? [egg1] : [egg1, egg2],
      growthRate: formatGrowthRate(getField('growthRate')),
      evYield: {
        hp: getNumField('evYield_HP'),
        atk: getNumField('evYield_Attack'),
        def: getNumField('evYield_Defense'),
        spa: getNumField('evYield_SpAttack'),
        spd: getNumField('evYield_SpDefense'),
        spe: getNumField('evYield_Speed'),
      },
      heldItems: {
        common: formatItem(getField('itemCommon')),
        rare: formatItem(getField('itemRare')),
      },
    });
  }

  return species;
}

// ── Pokedex Entries (category, height, weight) ──

async function parsePokedexEntries() {
  const src = await readFile(join(POKE, 'src/data/pokemon/pokedex_entries.h'), 'utf-8');
  const entries = new Map();
  const parts = src.split(/(?=\[NATIONAL_DEX_\w+\]\s*=)/);

  for (const part of parts) {
    const headerMatch = part.match(/\[NATIONAL_DEX_(\w+)\]\s*=/);
    if (!headerMatch || headerMatch[1] === 'NONE') continue;

    const specConst = 'SPECIES_' + headerMatch[1];
    const catMatch = part.match(/\.categoryName\s*=\s*_\("([^"]+)"\)/);
    const heightMatch = part.match(/\.height\s*=\s*(\d+)/);
    const weightMatch = part.match(/\.weight\s*=\s*(\d+)/);

    entries.set(specConst, {
      category: catMatch ? catMatch[1].charAt(0) + catMatch[1].slice(1).toLowerCase() : 'Unknown',
      height: heightMatch ? parseInt(heightMatch[1], 10) / 10 : 0, // decimeters → meters
      weight: weightMatch ? parseInt(weightMatch[1], 10) / 10 : 0, // hectograms → kg
    });
  }

  return entries;
}

// ── Pokedex Descriptions ──

async function parsePokedexText() {
  const src = await readFile(join(POKE, 'src/data/pokemon/pokedex_text.h'), 'utf-8');
  const descriptions = new Map();

  // Match: const u8 gBulbasaurPokedexText[] = _("...");
  const re = /const\s+u8\s+g(\w+)PokedexText\[\]\s*=\s*_\(\s*([\s\S]*?)\);/g;
  for (const m of src.matchAll(re)) {
    const name = m[1]; // e.g. "Bulbasaur"
    // Extract text from _("...") with potential multi-line strings
    const text = m[2]
      .replace(/"/g, '')
      .replace(/\n\s*/g, ' ')
      .replace(/\\n/g, ' ')
      .trim();
    // Convert name to SPECIES_ constant
    const specConst = 'SPECIES_' + name.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
    descriptions.set(name.toUpperCase(), text);
  }

  return descriptions;
}

// ── Level-Up Learnsets ──

async function parseLevelUpLearnsets() {
  const src = await readFile(join(POKE, 'src/data/pokemon/level_up_learnsets.h'), 'utf-8');
  const learnsets = new Map();

  // Match each static const u16 sXxxLevelUpLearnset[] = { ... };
  const blockRe = /static\s+const\s+u16\s+s(\w+)LevelUpLearnset\[\]\s*=\s*\{([\s\S]*?)\};/g;
  for (const m of src.matchAll(blockRe)) {
    const varName = m[1]; // e.g. "Bulbasaur"
    const body = m[2];
    const moves = [];

    for (const mm of body.matchAll(/LEVEL_UP_MOVE\(\s*(\d+)\s*,\s*(MOVE_\w+)\s*\)/g)) {
      const level = parseInt(mm[1], 10);
      const move = formatMove(mm[2]);
      if (move) moves.push({ level, move });
    }

    learnsets.set(varName.toUpperCase(), moves);
  }

  return learnsets;
}

// ── TM/HM List ──

async function parseTMHMList() {
  const src = await readFile(join(POKE, 'include/constants/tms_hms.h'), 'utf-8');
  const tms = [];
  const hms = [];

  // Parse FOREACH_TM
  const tmMatch = src.match(/FOREACH_TM\(F\)\s*\\([\s\S]*?)(?=\n\n|#define FOREACH_HM)/);
  if (tmMatch) {
    for (const m of tmMatch[0].matchAll(/F\((\w+)\)/g)) {
      tms.push(m[1]);
    }
  }

  // Parse FOREACH_HM
  const hmMatch = src.match(/FOREACH_HM\(F\)\s*\\([\s\S]*?)(?=\n\n|#define FOREACH_TMHM)/);
  if (hmMatch) {
    for (const m of hmMatch[0].matchAll(/F\((\w+)\)/g)) {
      hms.push(m[1]);
    }
  }

  return { tms, hms };
}

// ── TM/HM Learnsets ──

async function parseTMHMLearnsets() {
  const src = await readFile(join(POKE, 'src/data/pokemon/tmhm_learnsets.h'), 'utf-8');
  const learnsets = new Map();

  const parts = src.split(/(?=\[SPECIES_\w+\]\s*=)/);
  for (const part of parts) {
    const headerMatch = part.match(/\[SPECIES_(\w+)\]\s*=/);
    if (!headerMatch || headerMatch[1] === 'NONE') continue;

    const specName = headerMatch[1];
    const learned = [];

    // Match .MOVE_NAME = TRUE patterns
    for (const m of part.matchAll(/\.(\w+)\s*=\s*TRUE/g)) {
      learned.push(m[1]);
    }

    learnsets.set(specName, learned);
  }

  return learnsets;
}

// ── Tutor Learnsets ──

async function parseTutorLearnsets() {
  const src = await readFile(join(POKE, 'src/data/pokemon/tutor_learnsets.h'), 'utf-8');
  const learnsets = new Map();

  const parts = src.split(/(?=\[SPECIES_\w+\]\s*=)/);
  for (const part of parts) {
    const headerMatch = part.match(/\[SPECIES_(\w+)\]\s*=/);
    if (!headerMatch || headerMatch[1] === 'NONE') continue;

    const specName = headerMatch[1];
    const moves = [];

    for (const m of part.matchAll(/TUTOR\(MOVE_(\w+)\)/g)) {
      const moveName = m[1].split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
      moves.push(moveName);
    }

    learnsets.set(specName, moves);
  }

  return learnsets;
}

// ── Egg Moves ──

async function parseEggMoves() {
  const src = await readFile(join(POKE, 'src/data/pokemon/egg_moves.h'), 'utf-8');
  const eggMoves = new Map();

  // Pattern: egg_moves(SPECIES_NAME, MOVE_X, MOVE_Y, ...)
  const re = /egg_moves\(\s*(\w+)\s*,([\s\S]*?)(?=egg_moves\(|$)/g;
  for (const m of src.matchAll(re)) {
    const specName = m[1];
    const moves = [];
    for (const mm of m[2].matchAll(/MOVE_(\w+)/g)) {
      const moveName = mm[1].split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
      moves.push(moveName);
    }
    eggMoves.set(specName, moves);
  }

  return eggMoves;
}

// ── Evolution Data ──

async function parseEvolution() {
  const src = await readFile(join(POKE, 'src/data/pokemon/evolution.h'), 'utf-8');
  const evolutions = new Map(); // species → [{method, param, target}]

  const parts = src.split(/(?=\[SPECIES_\w+\]\s*=)/);
  for (const part of parts) {
    const headerMatch = part.match(/\[SPECIES_(\w+)\]\s*=/);
    if (!headerMatch) continue;

    const specConst = 'SPECIES_' + headerMatch[1];
    const evos = [];

    // Match {EVO_METHOD, PARAM, SPECIES_TARGET}
    for (const m of part.matchAll(/\{\s*(EVO_\w+)\s*,\s*(\w+)\s*,\s*(SPECIES_\w+)\s*\}/g)) {
      const method = m[1];
      const param = m[2];
      const target = m[3];

      let methodStr;
      switch (method) {
        case 'EVO_LEVEL':
          methodStr = `Level ${param}`;
          break;
        case 'EVO_ITEM':
          methodStr = formatItem(param) || param;
          break;
        case 'EVO_TRADE':
          methodStr = 'Trade';
          break;
        case 'EVO_TRADE_ITEM':
          methodStr = `Trade holding ${formatItem(param) || param}`;
          break;
        case 'EVO_FRIENDSHIP':
          methodStr = 'Friendship';
          break;
        case 'EVO_FRIENDSHIP_DAY':
          methodStr = 'Friendship (Day)';
          break;
        case 'EVO_FRIENDSHIP_NIGHT':
          methodStr = 'Friendship (Night)';
          break;
        case 'EVO_LEVEL_ATK_GT_DEF':
          methodStr = `Level ${param} (Atk > Def)`;
          break;
        case 'EVO_LEVEL_DEF_GT_ATK':
          methodStr = `Level ${param} (Def > Atk)`;
          break;
        case 'EVO_LEVEL_ATK_EQ_DEF':
          methodStr = `Level ${param} (Atk = Def)`;
          break;
        case 'EVO_BEAUTY':
          methodStr = `Beauty (${param}+)`;
          break;
        default:
          methodStr = method.replace('EVO_', '');
      }

      evos.push({ method: methodStr, target: formatSpecies(target), targetConst: target });
    }

    if (evos.length > 0) {
      evolutions.set(specConst, evos);
    }
  }

  return evolutions;
}

// ── Wild Encounters ──

async function parseEncounters() {
  const src = await readFile(join(POKE, 'src/data/wild_encounters.json'), 'utf-8');
  const data = JSON.parse(src);

  const LAND_RATES = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];
  const WATER_RATES = [60, 30, 5, 4, 1];
  const ROCK_SMASH_RATES = [60, 30, 5, 4, 1];
  const FISHING_RATES = [70, 30, 60, 20, 20, 40, 40, 15, 4, 1];

  // species → [{map, method, minLevel, maxLevel, rate}]
  const encounters = new Map();

  function addEncounter(specConst, map, method, minLevel, maxLevel, rate) {
    const name = formatSpecies(specConst);
    if (!encounters.has(name)) encounters.set(name, []);
    // Avoid duplicates
    const existing = encounters.get(name);
    const dup = existing.find(e => e.map === map && e.method === method && e.minLevel === minLevel && e.maxLevel === maxLevel);
    if (!dup) {
      existing.push({ map, method, minLevel, maxLevel, rate });
    }
  }

  for (const group of (data.wild_encounter_groups || [])) {
    for (const entry of (group.encounters || [])) {
      if (!entry.map) continue;
      const mapName = formatMapName(entry.map);

      if (entry.land_mons) {
        entry.land_mons.mons.forEach((mon, i) => {
          addEncounter(mon.species, mapName, 'Grass', mon.min_level, mon.max_level, LAND_RATES[i] || 0);
        });
      }
      if (entry.water_mons) {
        entry.water_mons.mons.forEach((mon, i) => {
          addEncounter(mon.species, mapName, 'Surfing', mon.min_level, mon.max_level, WATER_RATES[i] || 0);
        });
      }
      if (entry.rock_smash_mons) {
        entry.rock_smash_mons.mons.forEach((mon, i) => {
          addEncounter(mon.species, mapName, 'Rock Smash', mon.min_level, mon.max_level, ROCK_SMASH_RATES[i] || 0);
        });
      }
      if (entry.fishing_mons) {
        entry.fishing_mons.mons.forEach((mon, i) => {
          let method = 'Fishing';
          if (i < 2) method = 'Old Rod';
          else if (i < 5) method = 'Good Rod';
          else method = 'Super Rod';
          addEncounter(mon.species, mapName, method, mon.min_level, mon.max_level, FISHING_RATES[i] || 0);
        });
      }
    }
  }

  return encounters;
}

// ── Battle Moves ──

async function parseBattleMoves() {
  const src = await readFile(join(POKE, 'src/data/battle_moves.h'), 'utf-8');
  const moves = {};

  const parts = src.split(/(?=\[MOVE_\w+\]\s*=)/);
  for (const part of parts) {
    const headerMatch = part.match(/\[MOVE_(\w+)\]\s*=/);
    if (!headerMatch || headerMatch[1] === 'NONE') continue;

    const moveName = headerMatch[1].split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

    const getField = (field) => {
      const m = part.match(new RegExp(`\\.${field}\\s*=\\s*([^,}\\n]+)`));
      return m ? m[1].trim() : null;
    };

    const typeRaw = getField('type');
    const categoryRaw = getField('category');

    moves[moveName] = {
      type: typeRaw ? formatType(typeRaw) : 'Normal',
      power: parseInt(getField('power') || '0', 10),
      accuracy: parseInt(getField('accuracy') || '0', 10),
      pp: parseInt(getField('pp') || '0', 10),
      category: categoryRaw
        ? categoryRaw.replace('MOVE_CATEGORY_', '').charAt(0) + categoryRaw.replace('MOVE_CATEGORY_', '').slice(1).toLowerCase()
        : 'Status',
    };
  }

  return moves;
}

// ── Learnset Pointer Mapping ──
// Maps variable name (e.g. "BULBASAUR") used in learnsets to SPECIES_ constant

async function parseLearnsetPointers() {
  const src = await readFile(join(POKE, 'src/data/pokemon/level_up_learnset_pointers.h'), 'utf-8');
  const map = new Map();

  // [SPECIES_BULBASAUR] = sBulbasaurLevelUpLearnset,
  for (const m of src.matchAll(/\[SPECIES_(\w+)\]\s*=\s*s(\w+)LevelUpLearnset/g)) {
    map.set(m[2].toUpperCase(), 'SPECIES_' + m[1]);
  }

  return map;
}

// ── Main ──

async function main() {
  console.log('Building pokedex.json...');

  const [
    speciesList,
    dexEntries,
    dexTexts,
    levelUpLearnsets,
    { tms, hms },
    tmhmLearnsets,
    tutorLearnsets,
    eggMoves,
    evolutionData,
    encounterData,
    battleMoves,
    nationalDexOrder,
    learnsetPointers,
  ] = await Promise.all([
    parseSpeciesInfo(),
    parsePokedexEntries(),
    parsePokedexText(),
    parseLevelUpLearnsets(),
    parseTMHMList(),
    parseTMHMLearnsets(),
    parseTutorLearnsets(),
    parseEggMoves(),
    parseEvolution(),
    parseEncounters(),
    parseBattleMoves(),
    parseNationalDexOrder(),
    parseLearnsetPointers(),
  ]);

  // Build TM/HM move name mapping
  const tmhmMoveNames = [...tms, ...hms].map(id =>
    id.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')
  );

  // Build TM number labels
  const tmLabels = {};
  tms.forEach((id, i) => {
    const moveName = id.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    tmLabels[id] = `TM${String(i + 1).padStart(2, '0')}`;
  });
  hms.forEach((id, i) => {
    const moveName = id.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    tmLabels[id] = `HM${String(i + 1).padStart(2, '0')}`;
  });

  // Build reverse evolution map (who evolves INTO this species)
  const evolvesFromMap = new Map();
  for (const [fromConst, evos] of evolutionData.entries()) {
    for (const evo of evos) {
      evolvesFromMap.set(evo.targetConst, { from: formatSpecies(fromConst), method: evo.method });
    }
  }

  // Assemble pokemon entries
  const pokemon = [];

  for (const sp of speciesList) {
    const specConst = sp.speciesConstant;
    const specName = specConst.replace('SPECIES_', '');

    // National dex ID
    const dexId = nationalDexOrder.get(specConst) || 0;
    if (dexId === 0) continue; // Skip if not in national dex

    // Pokedex entry data
    const dexEntry = dexEntries.get(specConst) || {};

    // Description text - try matching by species name
    const nameUpper = sp.name.replace(/\s/g, '').toUpperCase();
    let description = dexTexts.get(nameUpper) || dexTexts.get(specName) || '';

    // Level-up learnset - find via pointer mapping or direct name match
    let levelUp = [];
    // Try direct match first
    if (levelUpLearnsets.has(specName)) {
      levelUp = levelUpLearnsets.get(specName);
    } else {
      // Try via pointer mapping
      for (const [varName, mappedConst] of learnsetPointers.entries()) {
        if (mappedConst === specConst && levelUpLearnsets.has(varName)) {
          levelUp = levelUpLearnsets.get(varName);
          break;
        }
      }
    }

    // TM/HM learnset
    const tmhmLearned = tmhmLearnsets.get(specName) || [];
    const tmhmMoves = tmhmLearned.map(id => {
      const moveName = id.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
      const label = tmLabels[id] || '';
      return { label, move: moveName };
    });

    // Tutor learnset
    const tutorMoves = tutorLearnsets.get(specName) || [];

    // Egg moves
    const eggs = eggMoves.get(specName) || [];

    // Evolution
    const evosTo = evolutionData.get(specConst) || [];
    const evoFrom = evolvesFromMap.get(specConst) || null;

    // Locations
    const locations = encounterData.get(sp.name) || [];

    pokemon.push({
      id: dexId,
      name: sp.name,
      types: sp.types,
      stats: sp.stats,
      bst: sp.bst,
      abilities: sp.abilities,
      category: dexEntry.category || 'Unknown',
      height: dexEntry.height || 0,
      weight: dexEntry.weight || 0,
      description,
      catchRate: sp.catchRate,
      genderRatio: sp.genderRatio,
      eggGroups: sp.eggGroups,
      growthRate: sp.growthRate,
      evYield: sp.evYield,
      heldItems: sp.heldItems,
      learnset: {
        levelUp,
        tmhm: tmhmMoves,
        tutor: tutorMoves,
        egg: eggs,
      },
      evolution: {
        evolvesFrom: evoFrom,
        evolvesTo: evosTo.map(e => ({ species: e.target, method: e.method })),
      },
      locations,
    });
  }

  // Sort by national dex number
  pokemon.sort((a, b) => a.id - b.id);

  const output = {
    generatedAt: new Date().toISOString(),
    pokemon,
    moves: battleMoves,
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(output) + '\n');

  console.log(`✔ Generated ${OUTPUT_FILE}`);
  console.log(`  Pokemon: ${pokemon.length}`);
  console.log(`  Moves: ${Object.keys(battleMoves).length}`);
  console.log(`  File size: ${(JSON.stringify(output).length / 1024).toFixed(0)} KB`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
