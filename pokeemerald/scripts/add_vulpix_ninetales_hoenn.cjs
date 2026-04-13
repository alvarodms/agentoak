#!/usr/bin/env node
/**
 * add_vulpix_ninetales_hoenn.cjs
 * One-off script to register SPECIES_VULPIX_HOENN (426) and SPECIES_NINETALES_HOENN (427)
 * across all required pokeemerald source files.
 *
 * Reads config from configs/vulpix_hoenn.json and configs/ninetales_hoenn.json.
 * Uses BAGON_HOENN as insertion anchor in every file.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const results = [];

function readConfig(name) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'configs', `${name}.json`), 'utf8'));
}

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function writeFile(relPath, content) {
  fs.writeFileSync(path.join(ROOT, relPath), content, 'utf8');
}

function report(file, success, note = '') {
  results.push({ file, success, note });
}

function insertAfter(content, anchor, insertion) {
  const idx = content.indexOf(anchor);
  if (idx === -1) return null;
  const end = idx + anchor.length;
  return content.slice(0, end) + insertion + content.slice(end);
}

function insertBefore(content, anchor, insertion) {
  const idx = content.indexOf(anchor);
  if (idx === -1) return null;
  return content.slice(0, idx) + insertion + content.slice(idx);
}

const vulpix = readConfig('vulpix_hoenn');
const ninetales = readConfig('ninetales_hoenn');

// ============================================================
// 1. include/constants/species.h
// ============================================================
{
  const f = 'include/constants/species.h';
  let c = readFile(f);
  // Insert VULPIX_HOENN and NINETALES_HOENN after BAGON_HOENN, before EGG
  const anchor = '#define SPECIES_BAGON_HOENN 425';
  const ins = `\n#define SPECIES_VULPIX_HOENN 426\n#define SPECIES_NINETALES_HOENN 427`;
  c = insertAfter(c, anchor, ins);
  // Update EGG from 426 to 428
  c = c.replace('#define SPECIES_EGG 426', '#define SPECIES_EGG 428');
  if (c && c.includes('SPECIES_VULPIX_HOENN 426') && c.includes('SPECIES_EGG 428')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed to insert species defines');
  }
}

// ============================================================
// 2. include/constants/pokedex.h
// ============================================================
{
  const f = 'include/constants/pokedex.h';
  let c = readFile(f);

  // National dex: insert after NATIONAL_DEX_BAGON_HOENN, before Old Unown comment
  const natAnchor = '    NATIONAL_DEX_BAGON_HOENN,';
  c = insertAfter(c, natAnchor, '\n    NATIONAL_DEX_VULPIX_HOENN,\n    NATIONAL_DEX_NINETALES_HOENN,');

  // Update NATIONAL_DEX_COUNT to include new species
  c = c.replace(
    '#define NATIONAL_DEX_COUNT  NATIONAL_DEX_MAMOSWINE',
    '#define NATIONAL_DEX_COUNT  NATIONAL_DEX_NINETALES_HOENN'
  );

  // Hoenn dex: insert after HOENN_DEX_BAGON_HOENN (which is in the post-Deoxys section)
  const hoennAnchor = '    HOENN_DEX_BAGON_HOENN,';
  c = insertAfter(c, hoennAnchor, '\n    HOENN_DEX_VULPIX_HOENN,\n    HOENN_DEX_NINETALES_HOENN,');

  if (c.includes('NATIONAL_DEX_VULPIX_HOENN') && c.includes('HOENN_DEX_VULPIX_HOENN') &&
      c.includes('NATIONAL_DEX_COUNT  NATIONAL_DEX_NINETALES_HOENN')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed to insert pokedex entries');
  }
}

// ============================================================
// 3. src/data/pokemon/species_info.h
// ============================================================
{
  const f = 'src/data/pokemon/species_info.h';
  let c = readFile(f);

  function makeSpeciesInfo(cfg) {
    return `
    [SPECIES_${cfg.name}] =
    {
        .baseHP        = ${cfg.stats.hp},
        .baseAttack    = ${cfg.stats.atk},
        .baseDefense   = ${cfg.stats.def},
        .baseSpeed     = ${cfg.stats.speed},
        .baseSpAttack  = ${cfg.stats.spAtk},
        .baseSpDefense = ${cfg.stats.spDef},
        .types = { ${cfg.types[0]}, ${cfg.types[1]} },
        .catchRate = ${cfg.catchRate},
        .expYield = ${cfg.expYield},
        .evYield_HP        = ${cfg.evYield.hp},
        .evYield_Attack    = ${cfg.evYield.atk},
        .evYield_Defense   = ${cfg.evYield.def},
        .evYield_Speed     = ${cfg.evYield.speed},
        .evYield_SpAttack  = ${cfg.evYield.spAtk},
        .evYield_SpDefense = ${cfg.evYield.spDef},
        .itemCommon = ${cfg.items[0]},
        .itemRare   = ${cfg.items[1]},
        .genderRatio = ${cfg.genderRatio},
        .eggCycles = ${cfg.eggCycles},
        .friendship = ${cfg.happiness},
        .growthRate = ${cfg.growthRate},
        .eggGroups = { ${cfg.eggGroups[0]}, ${cfg.eggGroups[1]} },
        .abilities = {${cfg.abilities[0]}, ${cfg.abilities[1]}},
        .safariZoneFleeRate = ${cfg.safariZoneFleeRate},
        .bodyColor = ${cfg.bodyColor},
        .noFlip = ${cfg.noFlip ? 'TRUE' : 'FALSE'},
    },
`;
  }

  // Insert before the closing }; of the array (after BAGON_HOENN entry)
  const anchor = '        .noFlip = FALSE,\n    },\n};';
  const ins = '        .noFlip = FALSE,\n    },\n' + makeSpeciesInfo(vulpix) + makeSpeciesInfo(ninetales) + '};';
  c = c.replace(anchor, ins);

  if (c.includes(`[SPECIES_VULPIX_HOENN]`) && c.includes(`[SPECIES_NINETALES_HOENN]`)) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed to insert species info');
  }
}

// ============================================================
// 4. src/data/graphics/pokemon.h — INCBIN declarations
// ============================================================
{
  const f = 'src/data/graphics/pokemon.h';
  let c = readFile(f);

  function makeGraphicsIncludes(cfg) {
    const n = cfg.capitalName;
    const p = cfg.lowerName;
    return `const u32 gMonStillFrontPic_${n}[] = INCBIN_U32("graphics/pokemon/${p}/front.4bpp.lz");
const u32 gMonPalette_${n}[] = INCBIN_U32("graphics/pokemon/${p}/normal.gbapal.lz");
const u32 gMonBackPic_${n}[] = INCBIN_U32("graphics/pokemon/${p}/back.4bpp.lz");
const u32 gMonShinyPalette_${n}[] = INCBIN_U32("graphics/pokemon/${p}/shiny.gbapal.lz");
const u8 gMonIcon_${n}[] = INCBIN_U8("graphics/pokemon/${p}/icon.4bpp");
const u8 gMonFootprint_${n}[] = INCBIN_U8("graphics/pokemon/${p}/footprint.1bpp");
`;
  }

  const anchor = `const u8 gMonFootprint_BagonHoenn[] = INCBIN_U8("graphics/pokemon/bagon_hoenn/footprint.1bpp");`;
  c = insertAfter(c, anchor, '\n' + makeGraphicsIncludes(vulpix) + makeGraphicsIncludes(ninetales));

  if (c.includes('gMonStillFrontPic_VulpixHoenn') && c.includes('gMonStillFrontPic_NinetalesHoenn')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed to insert graphics includes');
  }
}

// ============================================================
// 5. include/graphics.h — extern declarations
// ============================================================
{
  const f = 'include/graphics.h';
  let c = readFile(f);

  function makeExternDecls(cfg) {
    const n = cfg.capitalName;
    return `extern const u32 gMonPalette_${n}[];
extern const u32 gMonBackPic_${n}[];
extern const u32 gMonShinyPalette_${n}[];
extern const u32 gMonStillFrontPic_${n}[];
extern const u8 gMonIcon_${n}[];
extern const u8 gMonFootprint_${n}[];
`;
  }

  const anchor = 'extern const u8 gMonFootprint_BagonHoenn[];';
  c = insertAfter(c, anchor, '\n' + makeExternDecls(vulpix) + makeExternDecls(ninetales));

  if (c.includes('gMonPalette_VulpixHoenn') && c.includes('gMonPalette_NinetalesHoenn')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed to insert extern declarations');
  }
}

// ============================================================
// 6. src/data/pokemon_graphics/front_pic_coordinates.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/front_pic_coordinates.h';
  let c = readFile(f);
  const anchor = `[SPECIES_BAGON_HOENN] = { .size = MON_COORDS_SIZE(32, 40), .y_offset = 13 },`;
  const ins = `\n    [SPECIES_VULPIX_HOENN] = { .size = ${vulpix.frontPicSize}, .y_offset = ${vulpix.frontPicYOffset} },` +
              `\n    [SPECIES_NINETALES_HOENN] = { .size = ${ninetales.frontPicSize}, .y_offset = ${ninetales.frontPicYOffset} },`;
  c = insertAfter(c, anchor, ins);
  if (c.includes('SPECIES_VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 7. src/data/pokemon_graphics/back_pic_coordinates.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/back_pic_coordinates.h';
  let c = readFile(f);
  const anchor = `[SPECIES_BAGON_HOENN] = { .size = MON_COORDS_SIZE(48, 48), .y_offset = 11 },`;
  const ins = `\n    [SPECIES_VULPIX_HOENN] = { .size = ${vulpix.backPicSize}, .y_offset = ${vulpix.backPicYOffset} },` +
              `\n    [SPECIES_NINETALES_HOENN] = { .size = ${ninetales.backPicSize}, .y_offset = ${ninetales.backPicYOffset} },`;
  c = insertAfter(c, anchor, ins);
  if (c.includes('SPECIES_VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 8. src/data/pokemon_graphics/front_pic_table.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/front_pic_table.h';
  let c = readFile(f);
  const anchor = '    SPECIES_SPRITE(BAGON_HOENN, gMonFrontPic_BagonHoenn),';
  const ins = '\n    SPECIES_SPRITE(VULPIX_HOENN, gMonFrontPic_VulpixHoenn),' +
              '\n    SPECIES_SPRITE(NINETALES_HOENN, gMonFrontPic_NinetalesHoenn),';
  c = insertAfter(c, anchor, ins);
  if (c.includes('VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 9. src/data/pokemon_graphics/back_pic_table.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/back_pic_table.h';
  let c = readFile(f);
  const anchor = '    SPECIES_SPRITE(BAGON_HOENN, gMonBackPic_BagonHoenn),';
  const ins = '\n    SPECIES_SPRITE(VULPIX_HOENN, gMonBackPic_VulpixHoenn),' +
              '\n    SPECIES_SPRITE(NINETALES_HOENN, gMonBackPic_NinetalesHoenn),';
  c = insertAfter(c, anchor, ins);
  if (c.includes('VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 10. src/data/pokemon_graphics/still_front_pic_table.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/still_front_pic_table.h';
  let c = readFile(f);
  const anchor = '    SPECIES_SPRITE(BAGON_HOENN, gMonStillFrontPic_BagonHoenn),';
  const ins = '\n    SPECIES_SPRITE(VULPIX_HOENN, gMonStillFrontPic_VulpixHoenn),' +
              '\n    SPECIES_SPRITE(NINETALES_HOENN, gMonStillFrontPic_NinetalesHoenn),';
  c = insertAfter(c, anchor, ins);
  if (c.includes('VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 11. src/data/pokemon_graphics/palette_table.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/palette_table.h';
  let c = readFile(f);
  const anchor = '    SPECIES_PAL(BAGON_HOENN, gMonPalette_BagonHoenn),';
  const ins = '\n    SPECIES_PAL(VULPIX_HOENN, gMonPalette_VulpixHoenn),' +
              '\n    SPECIES_PAL(NINETALES_HOENN, gMonPalette_NinetalesHoenn),';
  c = insertAfter(c, anchor, ins);
  if (c.includes('VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 12. src/data/pokemon_graphics/shiny_palette_table.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/shiny_palette_table.h';
  let c = readFile(f);
  const anchor = '    SPECIES_SHINY_PAL(BAGON_HOENN, gMonShinyPalette_BagonHoenn),';
  const ins = '\n    SPECIES_SHINY_PAL(VULPIX_HOENN, gMonShinyPalette_VulpixHoenn),' +
              '\n    SPECIES_SHINY_PAL(NINETALES_HOENN, gMonShinyPalette_NinetalesHoenn),';
  c = insertAfter(c, anchor, ins);
  if (c.includes('VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 13. src/data/pokemon_graphics/footprint_table.h
// ============================================================
{
  const f = 'src/data/pokemon_graphics/footprint_table.h';
  let c = readFile(f);
  const anchor = '    [SPECIES_BAGON_HOENN] = gMonFootprint_BagonHoenn,';
  const ins = '\n    [SPECIES_VULPIX_HOENN] = gMonFootprint_VulpixHoenn,' +
              '\n    [SPECIES_NINETALES_HOENN] = gMonFootprint_NinetalesHoenn,';
  c = insertAfter(c, anchor, ins);
  if (c.includes('VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 14. src/pokemon_icon.c — icon table + palette index table
// ============================================================
{
  const f = 'src/pokemon_icon.c';
  let c = readFile(f);

  // Icon table
  const iconAnchor = '    [SPECIES_BAGON_HOENN] = gMonIcon_BagonHoenn,';
  c = insertAfter(c, iconAnchor,
    '\n    [SPECIES_VULPIX_HOENN] = gMonIcon_VulpixHoenn,' +
    '\n    [SPECIES_NINETALES_HOENN] = gMonIcon_NinetalesHoenn,');

  // Palette index table
  const palAnchor = '    [SPECIES_BAGON_HOENN] = 0,';
  c = insertAfter(c, palAnchor,
    `\n    [SPECIES_VULPIX_HOENN] = ${vulpix.iconPaletteIndex},` +
    `\n    [SPECIES_NINETALES_HOENN] = ${ninetales.iconPaletteIndex},`);

  if (c.includes('gMonIcon_VulpixHoenn') && c.match(/SPECIES_VULPIX_HOENN\] = \d/)) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed icon/palette insertion');
  }
}

// ============================================================
// 15. src/data/pokemon_graphics/front_pic_anims.h — THREE insertion points
// ============================================================
{
  const f = 'src/data/pokemon_graphics/front_pic_anims.h';
  let c = readFile(f);

  // (a) sAnim_ definition near top — insert after BagonHoenn's anim definition
  function makeAnimDef(cfg) {
    return `
static const union AnimCmd sAnim_${cfg.capitalName}_1[] =
{
    ANIMCMD_FRAME(0, ${cfg.animFrames}),
    ANIMCMD_FRAME(1, ${cfg.animDelay}),
    ANIMCMD_FRAME(0, ${cfg.animFrames}),
    ANIMCMD_END,
};
`;
  }

  const animAnchor = `static const union AnimCmd sAnim_BagonHoenn_1[] =
{
    ANIMCMD_FRAME(0, 20),
    ANIMCMD_FRAME(1, 10),
    ANIMCMD_FRAME(0, 20),
    ANIMCMD_END,
};`;
  c = insertAfter(c, animAnchor, makeAnimDef(vulpix) + makeAnimDef(ninetales));

  // (b) SINGLE_ANIMATION macro — insert after BagonHoenn
  const singleAnimAnchor = 'SINGLE_ANIMATION(BagonHoenn);';
  c = insertAfter(c, singleAnimAnchor,
    '\nSINGLE_ANIMATION(VulpixHoenn);\nSINGLE_ANIMATION(NinetalesHoenn);');

  // (c) Pointer table — insert after BagonHoenn entry, before EGG
  const ptrAnchor = '    [SPECIES_BAGON_HOENN] = sAnims_BagonHoenn,';
  c = insertAfter(c, ptrAnchor,
    '\n    [SPECIES_VULPIX_HOENN] = sAnims_VulpixHoenn,' +
    '\n    [SPECIES_NINETALES_HOENN] = sAnims_NinetalesHoenn,');

  if (c.includes('sAnim_VulpixHoenn_1') && c.includes('SINGLE_ANIMATION(VulpixHoenn)') &&
      c.includes('sAnims_VulpixHoenn')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed front_pic_anims insertion');
  }
}

// ============================================================
// 16. src/data/pokemon/pokedex_text.h
// ============================================================
{
  const f = 'src/data/pokemon/pokedex_text.h';
  let c = readFile(f);

  function makeDexText(cfg) {
    // Convert description text: the config has \n which we need to keep as literal \n in the C string
    const text = cfg.dexEntry.descriptionText;
    return `\nconst u8 g${cfg.capitalName}PokedexText[] = _(\n    "${text.replace(/\n/g, '\\n"\n    "')}");\n`;
  }

  const anchor = 'const u8 gBagonHoennPokedexText[] = _(';
  // Find the end of BagonHoenn's text entry
  const anchorIdx = c.indexOf(anchor);
  const endOfEntry = c.indexOf(');', anchorIdx) + 2;
  const insertion = makeDexText(vulpix) + makeDexText(ninetales);
  c = c.slice(0, endOfEntry) + insertion + c.slice(endOfEntry);

  if (c.includes('gVulpixHoennPokedexText') && c.includes('gNinetalesHoennPokedexText')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed pokedex text insertion');
  }
}

// ============================================================
// 17. src/data/pokemon/pokedex_entries.h
// ============================================================
{
  const f = 'src/data/pokemon/pokedex_entries.h';
  let c = readFile(f);

  function makeDexEntry(cfg) {
    const d = cfg.dexEntry;
    return `
    [NATIONAL_DEX_${cfg.name}] =
    {
        .categoryName = _("${d.categoryName}"),
        .height = ${d.height},
        .weight = ${d.weight},
        .description = g${cfg.capitalName}PokedexText,
        .pokemonScale = ${d.pokemonScale},
        .pokemonOffset = ${d.pokemonOffset},
        .trainerScale = ${d.trainerScale},
        .trainerOffset = ${d.trainerOffset},
    },
`;
  }

  // Insert after BAGON_HOENN's entry. Find its closing },
  const anchor = '[NATIONAL_DEX_BAGON_HOENN] =';
  const anchorIdx = c.indexOf(anchor);
  // Find the closing }, of BagonHoenn's entry
  let braceCount = 0;
  let pos = c.indexOf('{', anchorIdx);
  for (let i = pos; i < c.length; i++) {
    if (c[i] === '{') braceCount++;
    if (c[i] === '}') braceCount--;
    if (braceCount === 0) {
      pos = c.indexOf(',', i) + 1;
      break;
    }
  }
  c = c.slice(0, pos) + makeDexEntry(vulpix) + makeDexEntry(ninetales) + c.slice(pos);

  if (c.includes('NATIONAL_DEX_VULPIX_HOENN') && c.includes('NATIONAL_DEX_NINETALES_HOENN')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed pokedex entries insertion');
  }
}

// ============================================================
// 18. src/data/pokemon/level_up_learnsets.h
// ============================================================
{
  const f = 'src/data/pokemon/level_up_learnsets.h';
  let c = readFile(f);

  function makeLearnset(cfg) {
    const moves = cfg.levelUpMoves.map(([level, move]) =>
      `    LEVEL_UP_MOVE(${String(level).padStart(2)}, ${move}),`
    ).join('\n');
    return `\nstatic const u16 s${cfg.capitalName}LevelUpLearnset[] = {\n${moves}\n    LEVEL_UP_END\n};\n`;
  }

  // Insert after BagonHoenn's learnset (find LEVEL_UP_END after sBagonHoennLevelUpLearnset)
  const anchor = 'static const u16 sBagonHoennLevelUpLearnset[]';
  const anchorIdx = c.indexOf(anchor);
  const endIdx = c.indexOf('};', anchorIdx) + 2;
  c = c.slice(0, endIdx) + makeLearnset(vulpix) + makeLearnset(ninetales) + c.slice(endIdx);

  if (c.includes('sVulpixHoennLevelUpLearnset') && c.includes('sNinetalesHoennLevelUpLearnset')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed learnset insertion');
  }
}

// ============================================================
// 19. src/data/pokemon/level_up_learnset_pointers.h
// ============================================================
{
  const f = 'src/data/pokemon/level_up_learnset_pointers.h';
  let c = readFile(f);
  const anchor = '    [SPECIES_BAGON_HOENN] = sBagonHoennLevelUpLearnset,';
  c = insertAfter(c, anchor,
    '\n    [SPECIES_VULPIX_HOENN] = sVulpixHoennLevelUpLearnset,' +
    '\n    [SPECIES_NINETALES_HOENN] = sNinetalesHoennLevelUpLearnset,');
  if (c.includes('SPECIES_VULPIX_HOENN')) { writeFile(f, c); report(f, true); }
  else { report(f, false, 'Anchor not found'); }
}

// ============================================================
// 20. src/data/pokemon/tmhm_learnsets.h
// ============================================================
{
  const f = 'src/data/pokemon/tmhm_learnsets.h';
  let c = readFile(f);

  function makeTmhmEntry(cfg) {
    // Convert move names to TM field names (e.g., MOVE_ICE_BEAM -> .ICE_BEAM = TRUE)
    const fields = cfg.tmhm.map(move => {
      const fieldName = move.replace('MOVE_', '');
      return `        .${fieldName} = TRUE,`;
    }).join('\n');
    return `\n    [SPECIES_${cfg.name}] = { .learnset = {\n${fields}\n    } },\n`;
  }

  // Insert before the closing }; of the array (after BAGON_HOENN entry)
  const anchor = '    [SPECIES_BAGON_HOENN] = { .learnset = {';
  const anchorIdx = c.indexOf(anchor);
  // Find closing } }, of the BAGON_HOENN entry
  const closingPattern = '    } },';
  let searchFrom = anchorIdx;
  let entryEnd = c.indexOf(closingPattern, searchFrom) + closingPattern.length;

  // Find the array closing };
  const arrayEnd = c.indexOf('\n};', entryEnd);
  c = c.slice(0, arrayEnd) + makeTmhmEntry(vulpix) + makeTmhmEntry(ninetales) + c.slice(arrayEnd);

  if (c.includes(`[SPECIES_VULPIX_HOENN]`) && c.includes(`[SPECIES_NINETALES_HOENN]`)) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed TM/HM insertion');
  }
}

// ============================================================
// 21. src/data/pokemon/egg_moves.h
// ============================================================
{
  const f = 'src/data/pokemon/egg_moves.h';
  let c = readFile(f);

  // Vulpix_Hoenn has egg moves, Ninetales_Hoenn does not
  function makeEggMoves(cfg) {
    if (!cfg.eggMoves || cfg.eggMoves.length === 0) return '';
    const moves = cfg.eggMoves.map(m => `    ${m},`).join('\n');
    return `\n    EGG_MOVES_SPECIES_OFFSET + SPECIES_${cfg.name},\n${moves}\n`;
  }

  // Insert before EGG_MOVES_TERMINATOR
  const anchor = 'EGG_MOVES_TERMINATOR';
  const anchorIdx = c.indexOf(anchor);
  const vulpixEggs = makeEggMoves(vulpix);
  c = c.slice(0, anchorIdx) + vulpixEggs + anchor + c.slice(anchorIdx + anchor.length);

  if (vulpix.eggMoves.length > 0 && c.includes(`SPECIES_VULPIX_HOENN`)) {
    writeFile(f, c);
    report(f, true);
  } else if (vulpix.eggMoves.length === 0) {
    report(f, true, 'No egg moves to add');
  } else {
    report(f, false, 'Failed egg moves insertion');
  }
}

// ============================================================
// 22. src/data/pokemon/pokedex_orders.h — 3 arrays
// ============================================================
{
  const f = 'src/data/pokemon/pokedex_orders.h';
  let c = readFile(f);

  // Alphabetical: custom species are at the top. Insert after BAGON_HOENN
  const alphaAnchor = '    NATIONAL_DEX_BAGON_HOENN,\n    NATIONAL_DEX_FROSLASS,';
  c = c.replace(alphaAnchor,
    '    NATIONAL_DEX_BAGON_HOENN,\n    NATIONAL_DEX_NINETALES_HOENN,\n    NATIONAL_DEX_VULPIX_HOENN,\n    NATIONAL_DEX_FROSLASS,');

  // Weight: insert at end (after BAGON_HOENN, before };)
  const weightAnchor = '    NATIONAL_DEX_BAGON_HOENN,\n};';
  // There are two instances of this pattern (weight and height arrays end the same way)
  // Weight array: Vulpix=9.9kg, Ninetales=19.9kg — insert before }; in second array
  // Height array: Vulpix=0.6m, Ninetales=1.1m — insert before }; in third array

  // For weight and height, just append before the closing }; of each array
  // The second array (weight) ends with BAGON_HOENN,\n};
  // The third array (height) also ends with BAGON_HOENN,\n};
  // We need to replace BOTH occurrences

  // Find the weight array (gPokedexOrder_Weight)
  const weightArrayStart = c.indexOf('gPokedexOrder_Weight');
  const weightEnd = c.indexOf('    NATIONAL_DEX_BAGON_HOENN,\n};', weightArrayStart);
  if (weightEnd !== -1) {
    const replacement = '    NATIONAL_DEX_BAGON_HOENN,\n    NATIONAL_DEX_VULPIX_HOENN,\n    NATIONAL_DEX_NINETALES_HOENN,\n};';
    c = c.slice(0, weightEnd) + replacement + c.slice(weightEnd + '    NATIONAL_DEX_BAGON_HOENN,\n};'.length);
  }

  // Find the height array (gPokedexOrder_Height)
  const heightArrayStart = c.indexOf('gPokedexOrder_Height');
  const heightEnd = c.indexOf('    NATIONAL_DEX_BAGON_HOENN,\n};', heightArrayStart);
  if (heightEnd !== -1) {
    const replacement = '    NATIONAL_DEX_BAGON_HOENN,\n    NATIONAL_DEX_VULPIX_HOENN,\n    NATIONAL_DEX_NINETALES_HOENN,\n};';
    c = c.slice(0, heightEnd) + replacement + c.slice(heightEnd + '    NATIONAL_DEX_BAGON_HOENN,\n};'.length);
  }

  const count = (c.match(/NATIONAL_DEX_VULPIX_HOENN/g) || []).length;
  if (count === 3) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, `Expected 3 occurrences, found ${count}`);
  }
}

// ============================================================
// 23. src/pokemon.c — 3 mapping arrays
// ============================================================
{
  const f = 'src/pokemon.c';
  let c = readFile(f);

  // Array 1: sSpeciesToHoennPokedexNum (SPECIES_TO_HOENN)
  const hoennAnchor = '    SPECIES_TO_HOENN(BAGON_HOENN),\n};';
  c = c.replace(hoennAnchor,
    '    SPECIES_TO_HOENN(BAGON_HOENN),\n    SPECIES_TO_HOENN(VULPIX_HOENN),\n    SPECIES_TO_HOENN(NINETALES_HOENN),\n};');

  // Array 2: sSpeciesToNationalPokedexNum (SPECIES_TO_NATIONAL)
  const natAnchor = '    SPECIES_TO_NATIONAL(BAGON_HOENN),\n};';
  c = c.replace(natAnchor,
    '    SPECIES_TO_NATIONAL(BAGON_HOENN),\n    SPECIES_TO_NATIONAL(VULPIX_HOENN),\n    SPECIES_TO_NATIONAL(NINETALES_HOENN),\n};');

  // Array 3: sHoennToNationalOrder (HOENN_TO_NATIONAL)
  // Insert after BAGON_HOENN, before OLD_UNOWN_B
  const hoennNatAnchor = '    HOENN_TO_NATIONAL(BAGON_HOENN),\n    HOENN_TO_NATIONAL(OLD_UNOWN_B),';
  c = c.replace(hoennNatAnchor,
    '    HOENN_TO_NATIONAL(BAGON_HOENN),\n    HOENN_TO_NATIONAL(VULPIX_HOENN),\n    HOENN_TO_NATIONAL(NINETALES_HOENN),\n    HOENN_TO_NATIONAL(OLD_UNOWN_B),');

  const count = (c.match(/VULPIX_HOENN/g) || []).length;
  if (count >= 3) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, `Expected >=3 occurrences, found ${count}`);
  }
}

// ============================================================
// 24. src/anim_mon_front_pics.c — front pic INCBIN
// ============================================================
{
  const f = 'src/anim_mon_front_pics.c';
  let c = readFile(f);

  function makeFrontPicIncbin(cfg) {
    return `const u32 gMonFrontPic_${cfg.capitalName}[] = INCBIN_U32("graphics/pokemon/${cfg.lowerName}/anim_front.4bpp.lz");\n`;
  }

  const anchor = `const u32 gMonFrontPic_BagonHoenn[] = INCBIN_U32("graphics/pokemon/bagon_hoenn/anim_front.4bpp.lz");`;
  c = insertAfter(c, anchor, '\n' + makeFrontPicIncbin(vulpix) + makeFrontPicIncbin(ninetales));

  if (c.includes('gMonFrontPic_VulpixHoenn') && c.includes('gMonFrontPic_NinetalesHoenn')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed front pic INCBIN insertion');
  }
}

// ============================================================
// 25. sound/cry_tables.inc — 2 sections
// ============================================================
{
  const f = 'sound/cry_tables.inc';
  let c = readFile(f);

  // Forward table: insert after last cry entry before .align 2
  // Current last entry is "cry Cry_Arcanine" then blank line then ".align 2"
  const fwdAnchor = '\tcry Cry_Arcanine\n';
  c = c.replace(fwdAnchor,
    '\tcry Cry_Arcanine\n' +
    '\tcry Cry_Dusknoir\n' +
    '\tcry Cry_Murkrow\n' +
    '\tcry Cry_Snorunt\n' +
    '\tcry Cry_Swinub\n' +
    '\tcry Cry_Bagon\n' +
    '\tcry Cry_Vulpix\n' +
    '\tcry Cry_Ninetales\n');

  // Reverse table: insert at end
  const revAnchor = '\tcry_reverse Cry_Murkrow';
  // Check if this is the last line in reverse table
  c = insertAfter(c, revAnchor,
    '\n\tcry_reverse Cry_Snorunt' +
    '\n\tcry_reverse Cry_Swinub' +
    '\n\tcry_reverse Cry_Bagon' +
    '\n\tcry_reverse Cry_Vulpix' +
    '\n\tcry_reverse Cry_Ninetales');

  if (c.includes('cry Cry_Vulpix') && c.includes('cry_reverse Cry_Vulpix')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed cry table insertion');
  }
}

// ============================================================
// 26. src/data/pokemon/evolution.h
// ============================================================
{
  const f = 'src/data/pokemon/evolution.h';
  let c = readFile(f);

  // Evolution table uses [NUM_SPECIES] as size, which will auto-adjust
  // Find last entry and add Vulpix_Hoenn evolution
  // Insert before the closing };
  const anchor = '};';
  const lastClose = c.lastIndexOf(anchor);
  const evoEntry = `    [SPECIES_VULPIX_HOENN]  = {{EVO_ITEM, ITEM_MOON_STONE, SPECIES_NINETALES_HOENN}},\n`;
  c = c.slice(0, lastClose) + evoEntry + c.slice(lastClose);

  if (c.includes('SPECIES_VULPIX_HOENN') && c.includes('ITEM_MOON_STONE')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed evolution insertion');
  }
}

// ============================================================
// 27. src/data/pokemon/cry_ids.h — cry ID mappings
// ============================================================
{
  const f = 'src/data/pokemon/cry_ids.h';
  let c = readFile(f);

  // Add cry ID mappings for custom species that reuse base species cries
  const anchor = '    [SPECIES_CHIMECHO - 277] = 387,\n};';
  const ins = '    [SPECIES_CHIMECHO - 277] = 387,\n' +
    '    [SPECIES_VULPIX_HOENN - 277] = 37,\n' +
    '    [SPECIES_NINETALES_HOENN - 277] = 38,\n};';
  c = c.replace(anchor, ins);

  if (c.includes('SPECIES_VULPIX_HOENN - 277') && c.includes('SPECIES_NINETALES_HOENN - 277')) {
    writeFile(f, c);
    report(f, true);
  } else {
    report(f, false, 'Failed cry_ids insertion');
  }
}

// ============================================================
// Print verification report
// ============================================================
console.log('\n=== REGISTRATION REPORT ===\n');
let failCount = 0;
for (const r of results) {
  const status = r.success ? 'SUCCESS' : 'FAIL';
  const note = r.note ? ` (${r.note})` : '';
  console.log(`  [${status}] ${r.file}${note}`);
  if (!r.success) failCount++;
}
console.log(`\n${results.length} files processed, ${failCount} failures.`);
if (failCount > 0) {
  process.exit(1);
}
