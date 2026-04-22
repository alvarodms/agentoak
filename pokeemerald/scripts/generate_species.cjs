#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function insertBefore(content, marker, insertion) {
  const idx = content.indexOf(marker);
  if (idx === -1) return null;
  return content.slice(0, idx) + insertion + content.slice(idx);
}

function insertAfterLine(content, marker, insertion) {
  const idx = content.indexOf(marker);
  if (idx === -1) return null;
  const eol = content.indexOf('\n', idx);
  if (eol === -1) return content + '\n' + insertion;
  return content.slice(0, eol + 1) + insertion + content.slice(eol + 1);
}

function findClosingBrace(content, afterMarker) {
  const start = content.indexOf(afterMarker);
  if (start === -1) return -1;
  const idx = content.indexOf('\n};', start);
  return idx === -1 ? -1 : idx + 1;
}

function insertBeforeClosingBrace(content, arrayMarker, insertion) {
  const bracePos = findClosingBrace(content, arrayMarker);
  if (bracePos === -1) return null;
  return content.slice(0, bracePos) + insertion + content.slice(bracePos);
}

function padLevel(n) {
  return n < 10 ? ` ${n}` : `${n}`;
}

// ---------------------------------------------------------------------------
// Entry generators — produce the text snippet for each file
// ---------------------------------------------------------------------------

function genSpeciesH(N, name, newId) {
  return `#define SPECIES_${name} ${newId}\n`;
}

function genSpeciesInfo(N, cfg) {
  const s = cfg.stats;
  const ev = cfg.evYield;
  return `\n    [SPECIES_${N.NAME}] =\n` +
    `    {\n` +
    `        .baseHP        = ${s.hp},\n` +
    `        .baseAttack    = ${s.atk},\n` +
    `        .baseDefense   = ${s.def},\n` +
    `        .baseSpeed     = ${s.spe},\n` +
    `        .baseSpAttack  = ${s.spa},\n` +
    `        .baseSpDefense = ${s.spd},\n` +
    `        .types = { ${cfg.types[0]}, ${cfg.types[1]} },\n` +
    `        .catchRate = ${cfg.catchRate},\n` +
    `        .expYield = ${cfg.expYield},\n` +
    `        .evYield_HP        = ${ev.hp},\n` +
    `        .evYield_Attack    = ${ev.atk},\n` +
    `        .evYield_Defense   = ${ev.def},\n` +
    `        .evYield_Speed     = ${ev.spe},\n` +
    `        .evYield_SpAttack  = ${ev.spa},\n` +
    `        .evYield_SpDefense = ${ev.spd},\n` +
    `        .itemCommon = ${cfg.itemCommon},\n` +
    `        .itemRare   = ${cfg.itemRare},\n` +
    `        .genderRatio = ${cfg.genderRatio},\n` +
    `        .eggCycles = ${cfg.eggCycles},\n` +
    `        .friendship = ${cfg.friendship},\n` +
    `        .growthRate = ${cfg.growthRate},\n` +
    `        .eggGroups = { ${cfg.eggGroups[0]}, ${cfg.eggGroups[1]} },\n` +
    `        .abilities = {${cfg.abilities[0]}, ${cfg.abilities[1]}},\n` +
    `        .safariZoneFleeRate = ${cfg.safariZoneFleeRate},\n` +
    `        .bodyColor = ${cfg.bodyColor},\n` +
    `        .noFlip = ${cfg.noFlip ? 'TRUE' : 'FALSE'},\n` +
    `    },\n`;
}

function genLevelUpLearnset(N, cfg) {
  const moves = cfg.levelUpMoves.map(
    ([lvl, move]) => `    LEVEL_UP_MOVE(${padLevel(lvl)}, ${move}),`
  ).join('\n');
  return `\nstatic const u16 s${N.pascal}LevelUpLearnset[] = {\n` +
    moves + '\n' +
    `    LEVEL_UP_END\n};\n`;
}

function genLearnsetPointer(N) {
  return `    [SPECIES_${N.NAME}] = s${N.pascal}LevelUpLearnset,\n`;
}

function genTmhmLearnset(N, cfg) {
  const entries = cfg.tmhm.map(m => `        .${m} = TRUE,`).join('\n');
  return `    [SPECIES_${N.NAME}] = { .learnset = {\n` +
    entries + '\n' +
    `    } },\n`;
}

function genEggMoves(N, cfg) {
  if (!cfg.eggMoves || cfg.eggMoves.length === 0) {
    return `    EGG_MOVES_SPECIES_OFFSET + SPECIES_${N.NAME},\n`;
  }
  const moves = cfg.eggMoves.map(m => `              ${m}`).join(',\n');
  return `\n    egg_moves(${N.NAME},\n${moves}),\n`;
}

function genPokedexText(N, cfg) {
  const dex = cfg.pokedex;
  const lines = dex.description.map((line, i) => {
    const sep = i < dex.description.length - 1 ? '\\n"' : '"';
    return `    "${line}${sep}`;
  }).join('\n');
  return `\nconst u8 g${N.pascal}PokedexText[] = _(\n${lines});\n`;
}

function genPokedexEntry(N, cfg) {
  const dex = cfg.pokedex;
  return `\n    [NATIONAL_DEX_${N.NAME}] =\n` +
    `    {\n` +
    `        .categoryName = _("${dex.categoryName}"),\n` +
    `        .height = ${dex.height},\n` +
    `        .weight = ${dex.weight},\n` +
    `        .description = g${N.pascal}PokedexText,\n` +
    `        .pokemonScale = ${dex.pokemonScale},\n` +
    `        .pokemonOffset = ${dex.pokemonOffset},\n` +
    `        .trainerScale = ${dex.trainerScale},\n` +
    `        .trainerOffset = ${dex.trainerOffset},\n` +
    `    },\n`;
}

function genEvolution(N, cfg) {
  if (!cfg.evolution || cfg.evolution.length === 0) {
    return `    // SPECIES_${N.NAME} — standalone form, no evolution chain\n`;
  }
  const evos = cfg.evolution.map(
    e => `{${e.method}, ${e.param}, ${e.target}}`
  ).join(', ');
  return `    [SPECIES_${N.NAME}] = {${evos}},\n`;
}

function genCryId(N, cfg) {
  return `    [SPECIES_${N.NAME} - 277] = ${cfg.baseSpeciesCry},\n`;
}

function genGraphicsIncbin(N) {
  const d = N.dir;
  const p = N.pascal;
  return `const u32 gMonStillFrontPic_${p}[] = INCBIN_U32("graphics/pokemon/${d}/front.4bpp.lz");\n` +
    `const u32 gMonPalette_${p}[] = INCBIN_U32("graphics/pokemon/${d}/normal.gbapal.lz");\n` +
    `const u32 gMonBackPic_${p}[] = INCBIN_U32("graphics/pokemon/${d}/back.4bpp.lz");\n` +
    `const u32 gMonShinyPalette_${p}[] = INCBIN_U32("graphics/pokemon/${d}/shiny.gbapal.lz");\n` +
    `const u8 gMonIcon_${p}[] = INCBIN_U8("graphics/pokemon/${d}/icon.4bpp");\n` +
    `const u8 gMonFootprint_${p}[] = INCBIN_U8("graphics/pokemon/${d}/footprint.1bpp");\n`;
}

function genGraphicsExterns(N) {
  const p = N.pascal;
  return `extern const u32 gMonFrontPic_${p}[];\n` +
    `extern const u32 gMonPalette_${p}[];\n` +
    `extern const u32 gMonBackPic_${p}[];\n` +
    `extern const u32 gMonShinyPalette_${p}[];\n` +
    `extern const u32 gMonStillFrontPic_${p}[];\n` +
    `extern const u8 gMonIcon_${p}[];\n` +
    `extern const u8 gMonFootprint_${p}[];\n`;
}

function genAnimFrontPic(N) {
  return `const u32 gMonFrontPic_${N.pascal}[] = INCBIN_U32("graphics/pokemon/${N.dir}/anim_front.4bpp.lz");\n`;
}

function genFrontPicAnimCmd(N) {
  return `\nstatic const union AnimCmd sAnim_${N.pascal}_1[] =\n` +
    `{\n` +
    `    ANIMCMD_FRAME(0, 15),\n` +
    `    ANIMCMD_FRAME(1, 15),\n` +
    `    ANIMCMD_FRAME(0, 15),\n` +
    `    ANIMCMD_END,\n` +
    `};\n`;
}

function genSingleAnimation(N) {
  return `SINGLE_ANIMATION(${N.pascal});\n`;
}

function genAnimPointerEntry(N) {
  return `    [SPECIES_${N.NAME}] = sAnims_${N.pascal},\n`;
}

function genIconEntry(N) {
  return `    [SPECIES_${N.NAME}] = gMonIcon_${N.pascal},\n`;
}

function genIconPaletteEntry(N, cfg) {
  const idx = cfg.graphics.iconPaletteIndex || 0;
  return `    [SPECIES_${N.NAME}] = ${idx},\n`;
}

// ---------------------------------------------------------------------------
// File handlers — each returns { relPath, content } or throws
// ---------------------------------------------------------------------------

function handleSpeciesH(cfg, N) {
  const relPath = 'include/constants/species.h';
  let content = readFile(relPath);

  const eggRe = /^#define SPECIES_EGG\s+(\d+)/m;
  const m = content.match(eggRe);
  if (!m) throw new Error(`${relPath}: cannot find SPECIES_EGG`);
  const oldEggId = parseInt(m[1]);
  const newId = oldEggId;
  const newEggId = oldEggId + 1;

  content = insertBefore(content, m[0], genSpeciesH(N, N.NAME, newId));
  if (!content) throw new Error(`${relPath}: insertBefore failed`);
  content = content.replace(m[0], `#define SPECIES_EGG ${newEggId}`);

  return { relPath, content, newId, newEggId };
}

function handlePokedexH(cfg, N) {
  const relPath = 'include/constants/pokedex.h';
  let content = readFile(relPath);

  // National Dex enum — before the Old Unown block
  const natAnchor = '    NATIONAL_DEX_OLD_UNOWN_B,';
  content = insertBefore(content, natAnchor, `    NATIONAL_DEX_${N.NAME},\n`);
  if (!content) throw new Error(`${relPath}: cannot find NATIONAL_DEX_OLD_UNOWN_B`);

  // Hoenn Dex enum — before Old Unown
  const hoennAnchor = '    HOENN_DEX_OLD_UNOWN_B,';
  content = insertBefore(content, hoennAnchor, `    HOENN_DEX_${N.NAME},\n`);
  if (!content) throw new Error(`${relPath}: cannot find HOENN_DEX_OLD_UNOWN_B`);

  // Update NATIONAL_DEX_COUNT
  const countRe = /^#define NATIONAL_DEX_COUNT\s+\S+/m;
  content = content.replace(countRe, `#define NATIONAL_DEX_COUNT  NATIONAL_DEX_${N.NAME}`);

  return { relPath, content };
}

function handleSpeciesInfo(cfg, N) {
  const relPath = 'src/data/pokemon/species_info.h';
  let content = readFile(relPath);
  const entry = genSpeciesInfo(N, cfg);

  // Find the last closing }; of the main array
  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${relPath}: cannot find closing };`);
  content = content.slice(0, lastClose) + entry + content.slice(lastClose);
  return { relPath, content };
}

function handleLevelUpLearnsets(cfg, N) {
  const relPath = 'src/data/pokemon/level_up_learnsets.h';
  let content = readFile(relPath);
  const entry = genLevelUpLearnset(N, cfg);

  // Append before EOF (no outer array structure)
  content = content.trimEnd() + '\n' + entry;
  return { relPath, content };
}

function handleLearnsetPointers(cfg, N) {
  const relPath = 'src/data/pokemon/level_up_learnset_pointers.h';
  let content = readFile(relPath);

  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${relPath}: cannot find closing };`);
  content = content.slice(0, lastClose) + genLearnsetPointer(N) + content.slice(lastClose);
  return { relPath, content };
}

function handleTmhmLearnsets(cfg, N) {
  const relPath = 'src/data/pokemon/tmhm_learnsets.h';
  let content = readFile(relPath);
  const entry = genTmhmLearnset(N, cfg);

  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${relPath}: cannot find closing };`);
  content = content.slice(0, lastClose) + entry + content.slice(lastClose);
  return { relPath, content };
}

function handleEggMoves(cfg, N) {
  const relPath = 'src/data/pokemon/egg_moves.h';
  let content = readFile(relPath);
  const entry = genEggMoves(N, cfg);

  const anchor = 'EGG_MOVES_TERMINATOR\n};';
  content = insertBefore(content, anchor, entry);
  if (!content) throw new Error(`${relPath}: cannot find EGG_MOVES_TERMINATOR`);
  return { relPath, content };
}

function handlePokedexText(cfg, N) {
  const relPath = 'src/data/pokemon/pokedex_text.h';
  let content = readFile(relPath);
  const entry = genPokedexText(N, cfg);

  content = content.trimEnd() + '\n' + entry;
  return { relPath, content };
}

function handlePokedexEntries(cfg, N) {
  const relPath = 'src/data/pokemon/pokedex_entries.h';
  let content = readFile(relPath);
  const entry = genPokedexEntry(N, cfg);

  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${relPath}: cannot find closing };`);
  content = content.slice(0, lastClose) + entry + content.slice(lastClose);
  return { relPath, content };
}

function handlePokedexOrders(cfg, N) {
  const relPath = 'src/data/pokemon/pokedex_orders.h';
  let content = readFile(relPath);
  const entry = `    NATIONAL_DEX_${N.NAME},\n`;

  // Three arrays: Alphabetical, Weight, Height
  // Insert before }; of each array
  const arrays = ['gPokedexOrder_Alphabetical', 'gPokedexOrder_Weight', 'gPokedexOrder_Height'];
  for (const arrName of arrays) {
    const bracePos = findClosingBrace(content, arrName);
    if (bracePos === -1) throw new Error(`${relPath}: cannot find closing }; for ${arrName}`);
    content = content.slice(0, bracePos) + entry + content.slice(bracePos);
  }

  return { relPath, content };
}

function handleGraphicsPokemonH(cfg, N) {
  const relPath = 'src/data/graphics/pokemon.h';
  let content = readFile(relPath);
  const entry = genGraphicsIncbin(N);

  const anchor = 'const u32 gMonStillFrontPic_Egg[]';
  content = insertBefore(content, anchor, entry);
  if (!content) throw new Error(`${relPath}: cannot find gMonStillFrontPic_Egg`);
  return { relPath, content };
}

function handleGraphicsH(cfg, N) {
  const relPath = 'include/graphics.h';
  let content = readFile(relPath);
  const entry = genGraphicsExterns(N);

  const anchor = 'extern const u32 gMonFrontPic_Egg[]';
  content = insertBefore(content, anchor, entry);
  if (!content) throw new Error(`${relPath}: cannot find gMonFrontPic_Egg extern`);
  return { relPath, content };
}

function handleFrontPicAnims(cfg, N) {
  const relPath = 'src/data/pokemon_graphics/front_pic_anims.h';
  let content = readFile(relPath);

  // 1. AnimCmd array — insert before SINGLE_ANIMATION(Egg)
  const singleAnimEgg = 'SINGLE_ANIMATION(Egg)';
  const animCmd = genFrontPicAnimCmd(N);
  content = insertBefore(content, singleAnimEgg, animCmd);
  if (!content) throw new Error(`${relPath}: cannot find SINGLE_ANIMATION(Egg)`);

  // 2. SINGLE_ANIMATION macro — insert before SINGLE_ANIMATION(Egg)
  content = insertBefore(content, singleAnimEgg, genSingleAnimation(N));
  if (!content) throw new Error(`${relPath}: SINGLE_ANIMATION(Egg) anchor lost`);

  // 3. Pointer table entry — insert before [SPECIES_EGG]
  const eggAnchor = '    [SPECIES_EGG]';
  content = insertBefore(content, eggAnchor, genAnimPointerEntry(N));
  if (!content) throw new Error(`${relPath}: cannot find [SPECIES_EGG] in anim table`);

  return { relPath, content };
}

function handlePokemonIcon(cfg, N) {
  const relPath = 'src/pokemon_icon.c';
  let content = readFile(relPath);

  // Two tables: icon array and palette index array
  // Both have [SPECIES_EGG] entries as anchors
  const eggIcon = '    [SPECIES_EGG] = gMonIcon_Egg,';
  content = insertBefore(content, eggIcon, genIconEntry(N));
  if (!content) throw new Error(`${relPath}: cannot find [SPECIES_EGG] = gMonIcon_Egg`);

  // Second table: palette indices — find second [SPECIES_EGG]
  const eggPal = '    [SPECIES_EGG] = 1,';
  content = insertBefore(content, eggPal, genIconPaletteEntry(N, cfg));
  if (!content) throw new Error(`${relPath}: cannot find [SPECIES_EGG] = 1 (palette index)`);

  return { relPath, content };
}

function handlePokemonC(cfg, N) {
  const relPath = 'src/pokemon.c';
  let content = readFile(relPath);
  const animId = cfg.graphics.frontAnimId || 'ANIM_V_SQUISH_AND_BOUNCE';

  // 1. sSpeciesToHoennPokedexNum — insert before };
  content = insertBeforeClosingBrace(content, 'sSpeciesToHoennPokedexNum',
    `    SPECIES_TO_HOENN(${N.NAME}),\n`);
  if (!content) throw new Error(`${relPath}: cannot find sSpeciesToHoennPokedexNum };`);

  // 2. sSpeciesToNationalPokedexNum — insert before };
  content = insertBeforeClosingBrace(content, 'sSpeciesToNationalPokedexNum',
    `    SPECIES_TO_NATIONAL(${N.NAME}),\n`);
  if (!content) throw new Error(`${relPath}: cannot find sSpeciesToNationalPokedexNum };`);

  // 3. sHoennToNationalOrder — insert before OLD_UNOWN_B
  const unownAnchor = '    HOENN_TO_NATIONAL(OLD_UNOWN_B),';
  content = insertBefore(content, unownAnchor,
    `    HOENN_TO_NATIONAL(${N.NAME}),\n`);
  if (!content) throw new Error(`${relPath}: cannot find HOENN_TO_NATIONAL(OLD_UNOWN_B)`);

  // 4. sMonFrontAnimIdsTable — insert before };
  content = insertBeforeClosingBrace(content, 'sMonFrontAnimIdsTable',
    `    [SPECIES_${N.NAME} - 1] = ${animId},\n`);
  if (!content) throw new Error(`${relPath}: cannot find sMonFrontAnimIdsTable };`);

  return { relPath, content };
}

function handleCryIds(cfg, N) {
  const relPath = 'src/data/pokemon/cry_ids.h';
  let content = readFile(relPath);
  const entry = genCryId(N, cfg);

  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${relPath}: cannot find closing };`);
  content = content.slice(0, lastClose) + entry + content.slice(lastClose);
  return { relPath, content };
}

function handleEvolution(cfg, N) {
  const relPath = 'src/data/pokemon/evolution.h';
  let content = readFile(relPath);
  const entry = genEvolution(N, cfg);

  const lastClose = content.lastIndexOf('\n};');
  if (lastClose === -1) throw new Error(`${relPath}: cannot find closing };`);
  content = content.slice(0, lastClose) + entry + content.slice(lastClose);
  return { relPath, content };
}

function handleAnimMonFrontPics(cfg, N) {
  const relPath = 'src/anim_mon_front_pics.c';
  let content = readFile(relPath);
  const entry = genAnimFrontPic(N);

  const anchor = 'const u32 gMonFrontPic_Egg[]';
  content = insertBefore(content, anchor, entry);
  if (!content) throw new Error(`${relPath}: cannot find gMonFrontPic_Egg`);
  return { relPath, content };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const configPath = args.find(a => !a.startsWith('--'));

  if (!configPath) {
    console.error('Usage: node scripts/generate_species.cjs <config.json> [--dry-run]');
    process.exit(1);
  }

  const fullConfigPath = path.isAbsolute(configPath)
    ? configPath
    : path.join(process.cwd(), configPath);
  const cfg = JSON.parse(fs.readFileSync(fullConfigPath, 'utf8'));

  const N = {
    NAME: cfg.name,
    SPECIES: `SPECIES_${cfg.name}`,
    NATDEX: `NATIONAL_DEX_${cfg.name}`,
    HOENNDEX: `HOENN_DEX_${cfg.name}`,
    pascal: cfg.pascalName,
    dir: cfg.graphicsDir,
  };

  // Idempotency check
  const speciesH = readFile('include/constants/species.h');
  if (speciesH.includes(`#define ${N.SPECIES} `)) {
    console.log(`⚠ ${N.SPECIES} already exists in species.h — nothing to do.`);
    process.exit(0);
  }

  const handlers = [
    handleSpeciesH,
    handlePokedexH,
    handleSpeciesInfo,
    handleLevelUpLearnsets,
    handleLearnsetPointers,
    handleTmhmLearnsets,
    handleEggMoves,
    handlePokedexText,
    handlePokedexEntries,
    handlePokedexOrders,
    handleGraphicsPokemonH,
    handleGraphicsH,
    handleFrontPicAnims,
    handlePokemonIcon,
    handlePokemonC,
    handleCryIds,
    handleEvolution,
    handleAnimMonFrontPics,
  ];

  const results = [];
  let failed = 0;

  for (const handler of handlers) {
    try {
      const result = handler(cfg, N);
      results.push(result);
    } catch (err) {
      console.error(`✗ ${handler.name}: ${err.message}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} file(s) failed — aborting without writing.`);
    process.exit(1);
  }

  console.log(`\nSpecies: ${N.SPECIES} (${N.pascal})`);
  console.log(`Files:   ${results.length}/18`);
  console.log(`Note:    cry_tables.inc skipped (cry_ids.h handles base cry mapping)\n`);

  if (dryRun) {
    for (const r of results) {
      console.log(`  [dry-run] ${r.relPath}`);
    }
    console.log('\nDry run complete — no files modified.');
  } else {
    for (const r of results) {
      fs.writeFileSync(path.join(ROOT, r.relPath), r.content, 'utf8');
      console.log(`  ✓ ${r.relPath}`);
    }
    if (results[0].newId) {
      console.log(`\nNew species ID: ${results[0].newId}`);
      console.log(`Updated SPECIES_EGG: ${results[0].newEggId}`);
    }
    console.log('\nDone. Run `make check_species` then `make` to validate.');
  }
}

main();
