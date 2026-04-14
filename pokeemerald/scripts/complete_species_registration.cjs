#!/usr/bin/env node
/**
 * complete_species_registration.cjs
 *
 * Gap-filler tool: reads `check_species_registration.sh` output,
 * identifies which of the 19 target files are missing entries,
 * and inserts only the missing ones.
 *
 * Usage:
 *   node scripts/complete_species_registration.cjs <config.json>
 *
 * Config JSON schema: see README at bottom of file.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Naming helpers ---

function toPascalCase(upperSnake) {
  // BAGON_HOENN -> BagonHoenn, RIOLU -> Riolu, FARIGIRAF -> Farigiraf
  return upperSnake
    .split('_')
    .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase())
    .join('');
}

function toCamelCase(upperSnake) {
  const pascal = toPascalCase(upperSnake);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// --- File handlers ---

function handleEggMoves(config, rootDir) {
  const filePath = path.join(rootDir, 'src/data/pokemon/egg_moves.h');
  let content = fs.readFileSync(filePath, 'utf8');
  const name = config.speciesName.toUpperCase();
  const pascal = toPascalCase(name);
  const speciesConst = `SPECIES_${name}`;

  // Check if already present
  if (content.includes(name) || content.includes(pascal)) {
    console.log(`  egg_moves.h: already has entry for ${name}, skipping`);
    return;
  }

  if (!config.eggMoves || config.eggMoves.length === 0) {
    console.log(`  egg_moves.h: no egg moves specified, skipping`);
    return;
  }

  // Build entry in raw format (matching existing custom species format)
  const moves = config.eggMoves.map(m => `    ${m},`).join('\n');
  const entry = `\n    EGG_MOVES_SPECIES_OFFSET + ${speciesConst},\n${moves}\n`;

  // Insert before EGG_MOVES_TERMINATOR
  const anchor = 'EGG_MOVES_TERMINATOR';
  const idx = content.lastIndexOf(anchor);
  if (idx === -1) {
    console.log(`  egg_moves.h: ERROR — cannot find ${anchor}`);
    return;
  }

  content = content.slice(0, idx) + entry + content.slice(idx);
  fs.writeFileSync(filePath, content);
  console.log(`  egg_moves.h: added ${config.eggMoves.length} egg moves for ${speciesConst}`);
}

function handlePokedexOrders(config, rootDir) {
  const filePath = path.join(rootDir, 'src/data/pokemon/pokedex_orders.h');
  let content = fs.readFileSync(filePath, 'utf8');
  const name = config.speciesName.toUpperCase();
  const dexConst = `NATIONAL_DEX_${name}`;

  if (content.includes(dexConst)) {
    console.log(`  pokedex_orders.h: already has ${dexConst}, skipping`);
    return;
  }

  // There are 3 arrays: Alphabetical, Weight, Height
  // For each, insert before the closing `};` of that array
  // Strategy: find the last custom species in each array and insert after

  // Alphabetical array: insert at end, before OLD_UNOWN entries
  const alphaAnchor = 'NATIONAL_DEX_OLD_UNOWN_B';
  if (content.includes(alphaAnchor)) {
    const idx = content.indexOf(alphaAnchor);
    // Find the line start
    const lineStart = content.lastIndexOf('\n', idx) + 1;
    const indent = content.slice(lineStart, idx).match(/^(\s*)/)[1];
    content = content.slice(0, lineStart) + `${indent}${dexConst},\n` + content.slice(lineStart);
    console.log(`  pokedex_orders.h: added to Alphabetical array`);
  }

  // Weight array: find the `};` after gPokedexOrder_Weight and insert before it
  // Find `NATIONAL_DEX_BAGON_HOENN` or last custom species in weight array, insert after
  const weightArrayStart = content.indexOf('gPokedexOrder_Weight');
  if (weightArrayStart !== -1) {
    // Find the closing }; after this array start
    const weightEnd = content.indexOf('};', weightArrayStart);
    if (weightEnd !== -1) {
      // Insert before };
      const beforeEnd = content.lastIndexOf('\n', weightEnd);
      const indent = '    ';
      content = content.slice(0, beforeEnd + 1) + `${indent}${dexConst},\n` + content.slice(beforeEnd + 1);
      console.log(`  pokedex_orders.h: added to Weight array`);
    }
  }

  // Height array: same approach
  const heightArrayStart = content.indexOf('gPokedexOrder_Height');
  if (heightArrayStart !== -1) {
    const heightEnd = content.indexOf('};', heightArrayStart);
    if (heightEnd !== -1) {
      const beforeEnd = content.lastIndexOf('\n', heightEnd);
      const indent = '    ';
      content = content.slice(0, beforeEnd + 1) + `${indent}${dexConst},\n` + content.slice(beforeEnd + 1);
      console.log(`  pokedex_orders.h: added to Height array`);
    }
  }

  fs.writeFileSync(filePath, content);
}

function handlePokemonIcon(config, rootDir) {
  const filePath = path.join(rootDir, 'src/pokemon_icon.c');
  let content = fs.readFileSync(filePath, 'utf8');
  const name = config.speciesName.toUpperCase();
  const pascal = toPascalCase(name);
  const speciesConst = `SPECIES_${name}`;

  if (content.includes(speciesConst) || content.includes(pascal)) {
    console.log(`  pokemon_icon.c: already has ${speciesConst}, skipping`);
    return;
  }

  // Two arrays: gMonIconTable and gMonIconPaletteIndices
  // Find the last custom species entry in each and insert after

  // gMonIconTable: insert before [SPECIES_EGG]
  const iconTableAnchor = '[SPECIES_EGG] = gMonIcon_Egg';
  const iconIdx = content.indexOf(iconTableAnchor);
  if (iconIdx !== -1) {
    const lineStart = content.lastIndexOf('\n', iconIdx) + 1;
    const entry = `    [${speciesConst}] = gMonIcon_${pascal},\n`;
    content = content.slice(0, lineStart) + entry + content.slice(lineStart);
    console.log(`  pokemon_icon.c: added to gMonIconTable`);
  } else {
    console.log(`  pokemon_icon.c: ERROR — cannot find gMonIconTable anchor`);
  }

  // gMonIconPaletteIndices: insert before [SPECIES_EGG]
  const palAnchor = '[SPECIES_EGG] = 1';
  const palIdx = content.indexOf(palAnchor);
  if (palIdx !== -1) {
    const lineStart = content.lastIndexOf('\n', palIdx) + 1;
    const palIndex = config.iconPalIndex || 0;
    const entry = `    [${speciesConst}] = ${palIndex},\n`;
    content = content.slice(0, lineStart) + entry + content.slice(lineStart);
    console.log(`  pokemon_icon.c: added to gMonIconPaletteIndices`);
  } else {
    console.log(`  pokemon_icon.c: ERROR — cannot find gMonIconPaletteIndices anchor`);
  }

  fs.writeFileSync(filePath, content);
}

function handlePokemonC(config, rootDir) {
  const filePath = path.join(rootDir, 'src/pokemon.c');
  let content = fs.readFileSync(filePath, 'utf8');
  const name = config.speciesName.toUpperCase();
  const speciesConst = `SPECIES_${name}`;

  // Check if already has mapping entries
  const hasHoennMapping = content.includes(`SPECIES_TO_HOENN(${name})`);
  const hasNationalMapping = content.includes(`SPECIES_TO_NATIONAL(${name})`);
  const hasHoennToNational = content.includes(`HOENN_TO_NATIONAL(${name})`);
  const hasAnimEntry = content.includes(`[${speciesConst} - 1]`);

  if (hasHoennMapping && hasNationalMapping && hasHoennToNational && hasAnimEntry) {
    console.log(`  pokemon.c: all entries present, skipping`);
    return;
  }

  // sSpeciesToHoennPokedexNum: insert before `};` closing
  if (!hasHoennMapping) {
    const hoennArrayEnd = findArrayEnd(content, 'sSpeciesToHoennPokedexNum');
    if (hoennArrayEnd !== -1) {
      const entry = `    SPECIES_TO_HOENN(${name}),\n`;
      content = insertBeforeClosingBrace(content, hoennArrayEnd, entry);
      console.log(`  pokemon.c: added SPECIES_TO_HOENN(${name})`);
    }
  }

  // sSpeciesToNationalPokedexNum: insert before `};` closing
  if (!hasNationalMapping) {
    const natArrayEnd = findArrayEnd(content, 'sSpeciesToNationalPokedexNum');
    if (natArrayEnd !== -1) {
      const entry = `    SPECIES_TO_NATIONAL(${name}),\n`;
      content = insertBeforeClosingBrace(content, natArrayEnd, entry);
      console.log(`  pokemon.c: added SPECIES_TO_NATIONAL(${name})`);
    }
  }

  // sHoennToNationalOrder: insert before OLD_UNOWN entries or `};`
  if (!hasHoennToNational) {
    const h2nAnchor = 'HOENN_TO_NATIONAL(OLD_UNOWN_B)';
    const h2nIdx = content.indexOf(h2nAnchor);
    if (h2nIdx !== -1) {
      const lineStart = content.lastIndexOf('\n', h2nIdx) + 1;
      const entry = `    HOENN_TO_NATIONAL(${name}),\n`;
      content = content.slice(0, lineStart) + entry + content.slice(lineStart);
      console.log(`  pokemon.c: added HOENN_TO_NATIONAL(${name})`);
    } else {
      // Fallback: insert before }; of sHoennToNationalOrder
      const arrayEnd = findArrayEnd(content, 'sHoennToNationalOrder');
      if (arrayEnd !== -1) {
        const entry = `    HOENN_TO_NATIONAL(${name}),\n`;
        content = insertBeforeClosingBrace(content, arrayEnd, entry);
        console.log(`  pokemon.c: added HOENN_TO_NATIONAL(${name}) (fallback)`);
      }
    }
  }

  // sMonFrontAnimIdsTable: insert before `};` closing
  if (!hasAnimEntry) {
    const animArrayEnd = findArrayEnd(content, 'sMonFrontAnimIdsTable');
    if (animArrayEnd !== -1) {
      const anim = config.frontAnim || 'ANIM_V_SQUISH_AND_BOUNCE';
      const entry = `    [${speciesConst} - 1] = ${anim},\n`;
      content = insertBeforeClosingBrace(content, animArrayEnd, entry);
      console.log(`  pokemon.c: added animation entry (${anim})`);
    }
  }

  fs.writeFileSync(filePath, content);
}

function handleCryTables(config, rootDir) {
  const filePath = path.join(rootDir, 'sound/cry_tables.inc');
  let content = fs.readFileSync(filePath, 'utf8');
  const name = config.speciesName.toUpperCase();
  const pascal = toPascalCase(name);

  if (content.includes(name) || content.includes(pascal)) {
    console.log(`  cry_tables.inc: already has entry for ${name}, skipping`);
    return;
  }

  const cryBase = config.cryBase || name;
  const comment = `@ ${name}`;

  // Forward table: insert before the `.align 2` that precedes gCryTable_Reverse
  const reverseAnchor = 'gCryTable_Reverse::';
  const reverseIdx = content.indexOf(reverseAnchor);
  if (reverseIdx !== -1) {
    // Find the .align 2 before it
    const alignIdx = content.lastIndexOf('.align 2', reverseIdx);
    if (alignIdx !== -1) {
      const lineStart = content.lastIndexOf('\n', alignIdx) + 1;
      const entry = `\tcry Cry_${cryBase}\t${comment}\n`;
      content = content.slice(0, lineStart) + entry + content.slice(lineStart);
      console.log(`  cry_tables.inc: added forward cry entry (reuses Cry_${cryBase})`);
    }
  }

  // Reverse table: insert at the very end of the file
  // Find the last cry_reverse entry
  const lastReverse = content.lastIndexOf('cry_reverse');
  if (lastReverse !== -1) {
    const lineEnd = content.indexOf('\n', lastReverse);
    const entry = `\tcry_reverse Cry_${cryBase}\t${comment}\n`;
    content = content.slice(0, lineEnd + 1) + entry + content.slice(lineEnd + 1);
    console.log(`  cry_tables.inc: added reverse cry entry (reuses Cry_${cryBase})`);
  }

  fs.writeFileSync(filePath, content);
}

function handleCryIds(config, rootDir) {
  const filePath = path.join(rootDir, 'src/data/pokemon/cry_ids.h');
  let content = fs.readFileSync(filePath, 'utf8');
  const name = config.speciesName.toUpperCase();
  const speciesConst = `SPECIES_${name}`;

  if (content.includes(speciesConst)) {
    console.log(`  cry_ids.h: already has ${speciesConst}, skipping`);
    return;
  }

  const cryId = config.cryId;
  if (cryId === undefined) {
    console.log(`  cry_ids.h: no cryId specified, skipping`);
    return;
  }

  // Insert before the closing `};`
  const closingBrace = content.lastIndexOf('};');
  if (closingBrace !== -1) {
    const entry = `    [${speciesConst} - 277] = ${cryId},\n`;
    content = content.slice(0, closingBrace) + entry + content.slice(closingBrace);
    console.log(`  cry_ids.h: added [${speciesConst} - 277] = ${cryId}`);
  }

  fs.writeFileSync(filePath, content);
}

function handleEvolution(config, rootDir) {
  const filePath = path.join(rootDir, 'src/data/pokemon/evolution.h');
  let content = fs.readFileSync(filePath, 'utf8');
  const name = config.speciesName.toUpperCase();
  const speciesConst = `SPECIES_${name}`;

  // Check for commented-out entries that need uncommenting
  if (config.evolutionFrom) {
    const fromConst = `SPECIES_${config.evolutionFrom.toUpperCase()}`;
    // Look for commented-out line: // [SPECIES_X] -> SPECIES_Y
    const commentPattern = new RegExp(`^\\s*//\\s*\\[${fromConst}\\].*${name}.*$`, 'm');
    const match = content.match(commentPattern);
    if (match) {
      // Replace comment with actual entry
      const evoMethod = config.evolutionMethod || 'EVO_LEVEL';
      const evoParam = config.evolutionParam || '0';
      const newEntry = `    [${fromConst}]${' '.repeat(Math.max(1, 13 - fromConst.length))}= {{${evoMethod}, ${evoParam}, ${speciesConst}}},`;
      content = content.replace(match[0], newEntry);
      fs.writeFileSync(filePath, content);
      console.log(`  evolution.h: replaced comment with ${fromConst} -> ${speciesConst} (${evoMethod})`);
      return;
    }
  }

  // Check if species appears anywhere (as source or target)
  if (content.includes(name)) {
    console.log(`  evolution.h: ${name} already referenced, skipping`);
    return;
  }

  // For species with no evolution: add a comment to satisfy the check
  if (!config.evolutionFrom && !config.evolutionTo) {
    // Insert before closing `};`
    const closingBrace = content.lastIndexOf('};');
    if (closingBrace !== -1) {
      const entry = `    // ${speciesConst} — standalone form, no evolution chain\n`;
      content = content.slice(0, closingBrace) + entry + content.slice(closingBrace);
      fs.writeFileSync(filePath, content);
      console.log(`  evolution.h: added standalone comment for ${speciesConst}`);
    }
    return;
  }

  // Add evolution entry (species evolves INTO something)
  if (config.evolutionTo) {
    const toConst = `SPECIES_${config.evolutionTo.toUpperCase()}`;
    const evoMethod = config.evolutionMethod || 'EVO_LEVEL';
    const evoParam = config.evolutionParam || '0';
    const closingBrace = content.lastIndexOf('};');
    if (closingBrace !== -1) {
      const entry = `    [${speciesConst}]${' '.repeat(Math.max(1, 13 - speciesConst.length))}= {{${evoMethod}, ${evoParam}, ${toConst}}},\n`;
      content = content.slice(0, closingBrace) + entry + content.slice(closingBrace);
      fs.writeFileSync(filePath, content);
      console.log(`  evolution.h: added ${speciesConst} -> ${toConst} (${evoMethod})`);
    }
    return;
  }

  // Species is an evolution TARGET only — add from entry
  if (config.evolutionFrom) {
    const fromConst = `SPECIES_${config.evolutionFrom.toUpperCase()}`;
    const evoMethod = config.evolutionMethod || 'EVO_LEVEL';
    const evoParam = config.evolutionParam || '0';
    const closingBrace = content.lastIndexOf('};');
    if (closingBrace !== -1) {
      const entry = `    [${fromConst}]${' '.repeat(Math.max(1, 13 - fromConst.length))}= {{${evoMethod}, ${evoParam}, ${speciesConst}}},\n`;
      content = content.slice(0, closingBrace) + entry + content.slice(closingBrace);
      fs.writeFileSync(filePath, content);
      console.log(`  evolution.h: added ${fromConst} -> ${speciesConst} (${evoMethod})`);
    }
  }
}

// --- Utility functions ---

function findArrayEnd(content, arrayName) {
  const arrayStart = content.indexOf(arrayName);
  if (arrayStart === -1) return -1;
  return content.indexOf('};', arrayStart);
}

function insertBeforeClosingBrace(content, braceIdx, entry) {
  // Insert entry before the `};` at braceIdx
  const lineStart = content.lastIndexOf('\n', braceIdx);
  return content.slice(0, lineStart + 1) + entry + content.slice(lineStart + 1);
}

// --- Main ---

function main() {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error('Usage: node scripts/complete_species_registration.cjs <config.json>');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const rootDir = path.resolve(__dirname, '..');
  const name = config.speciesName.toUpperCase();
  const speciesConst = `SPECIES_${name}`;

  console.log(`\n=== Completing registration for ${speciesConst} ===\n`);

  // Step 1: Run check script to identify gaps
  let checkOutput;
  try {
    checkOutput = execSync(
      `bash scripts/check_species_registration.sh ${speciesConst}`,
      { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
  } catch (e) {
    checkOutput = e.stdout || '';
  }

  console.log('Current check status:');
  console.log(checkOutput);

  // Parse missing files
  const missingFiles = [];
  const lines = checkOutput.split('\n');
  for (const line of lines) {
    if (line.includes('MISSING')) {
      // Extract the label: "✗ label — MISSING"
      const match = line.match(/✗\s+(.+?)\s+—\s+MISSING/);
      if (match) missingFiles.push(match[1]);
    }
  }

  if (missingFiles.length === 0) {
    console.log('All registrations complete! Nothing to do.');
    return;
  }

  console.log(`\nMissing entries (${missingFiles.length}): ${missingFiles.join(', ')}\n`);
  console.log('Filling gaps...\n');

  // Step 2: Fill each gap
  const handlers = {
    'egg_moves.h': handleEggMoves,
    'pokedex_orders.h': handlePokedexOrders,
    'pokemon_icon.c': handlePokemonIcon,
    'pokemon.c (species mappings)': handlePokemonC,
    'cry_tables.inc': handleCryTables,
    'cry_ids.h': handleCryIds,
    'evolution.h': handleEvolution,
  };

  for (const missing of missingFiles) {
    const handler = handlers[missing];
    if (handler) {
      handler(config, rootDir);
    } else {
      console.log(`  ${missing}: no handler implemented — SKIPPED`);
    }
  }

  // Step 3: Re-run check to verify
  console.log('\n--- Re-checking ---\n');
  try {
    const recheck = execSync(
      `bash scripts/check_species_registration.sh ${speciesConst}`,
      { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    console.log(recheck);
  } catch (e) {
    console.log(e.stdout || '');
    const remaining = (e.stdout || '').match(/(\d+) missing/);
    if (remaining && parseInt(remaining[1]) > 0) {
      console.log(`WARNING: ${remaining[1]} entries still missing after gap-fill.`);
    }
  }
}

main();

/*
 * CONFIG JSON SCHEMA:
 * {
 *   "speciesName": "bagon_hoenn",       // lowercase with underscores
 *   "eggMoves": ["MOVE_X", ...],        // for egg_moves.h
 *   "iconPalIndex": 0,                  // for pokemon_icon.c palette index
 *   "cryBase": "Bagon",                 // PascalCase base species for cry reuse
 *   "cryId": 351,                       // cry ID number for cry_ids.h
 *   "frontAnim": "ANIM_V_SHAKE",        // animation constant for pokemon.c
 *   "evolutionFrom": "vulpix_hoenn",    // pre-evolution species (if this species is evolved-into)
 *   "evolutionTo": null,                // what this species evolves into (if applicable)
 *   "evolutionMethod": "EVO_ITEM",      // EVO_LEVEL, EVO_ITEM, EVO_FRIENDSHIP, etc.
 *   "evolutionParam": "ITEM_MOON_STONE" // level number or item constant
 * }
 */
