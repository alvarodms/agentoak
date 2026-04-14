#!/usr/bin/env node
/* C218: Register three species — Vulpix_Hoenn (426), Ninetales_Hoenn (427), Farigiraf (428).
   Fixes broken build from C217's partial script run.
   Bumps SPECIES_EGG from 426 to 429.
   Also adds missing Froslass/Mamoswine animation entries. */

var fs = require('fs');
var path = require('path');
var root = path.resolve(__dirname, '..');

function readF(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function writeF(rel, data) { fs.writeFileSync(path.join(root, rel), data, 'utf8'); }

function insertBefore(content, anchor, insertion) {
    var idx = content.indexOf(anchor);
    if (idx === -1) return null;
    return content.slice(0, idx) + insertion + content.slice(idx);
}

var errors = [];
var done = [];

/* ================================================================== */
/* 1. include/constants/species.h                                      */
/* ================================================================== */
(function() {
    var rel = 'include/constants/species.h';
    var c = readF(rel);
    var old = '#define SPECIES_EGG 426';
    var replacement =
        '#define SPECIES_VULPIX_HOENN 426\n' +
        '#define SPECIES_NINETALES_HOENN 427\n' +
        '#define SPECIES_FARIGIRAF 428\n' +
        '#define SPECIES_EGG 429';
    if (c.indexOf(old) === -1) { errors.push(rel + ': anchor not found'); return; }
    c = c.replace(old, replacement);
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 2. include/constants/pokedex.h                                      */
/* ================================================================== */
(function() {
    var rel = 'include/constants/pokedex.h';
    var c = readF(rel);

    /* National dex enum: insert after BAGON_HOENN */
    c = c.replace(
        '    NATIONAL_DEX_BAGON_HOENN,\n    // Old Unown',
        '    NATIONAL_DEX_BAGON_HOENN,\n' +
        '    NATIONAL_DEX_VULPIX_HOENN,\n' +
        '    NATIONAL_DEX_NINETALES_HOENN,\n' +
        '    NATIONAL_DEX_FARIGIRAF,\n' +
        '    // Old Unown'
    );

    /* Update national dex count */
    c = c.replace(
        '#define NATIONAL_DEX_COUNT  NATIONAL_DEX_MAMOSWINE',
        '#define NATIONAL_DEX_COUNT  NATIONAL_DEX_FARIGIRAF'
    );

    /* Hoenn dex enum: insert after BAGON_HOENN */
    c = c.replace(
        '    HOENN_DEX_BAGON_HOENN,\n    HOENN_DEX_OLD_UNOWN_B,',
        '    HOENN_DEX_BAGON_HOENN,\n' +
        '    HOENN_DEX_VULPIX_HOENN,\n' +
        '    HOENN_DEX_NINETALES_HOENN,\n' +
        '    HOENN_DEX_FARIGIRAF,\n' +
        '    HOENN_DEX_OLD_UNOWN_B,'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 3. src/data/pokemon/species_info.h                                  */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/species_info.h';
    var c = readF(rel);

    var vulpix =
'\n    [SPECIES_VULPIX_HOENN] =\n' +
'    {\n' +
'        .baseHP        = 38,\n' +
'        .baseAttack    = 36,\n' +
'        .baseDefense   = 40,\n' +
'        .baseSpeed     = 65,\n' +
'        .baseSpAttack  = 55,\n' +
'        .baseSpDefense = 65,\n' +
'        .types = { TYPE_ICE, TYPE_FAIRY },\n' +
'        .catchRate = 190,\n' +
'        .expYield = 63,\n' +
'        .evYield_HP        = 0,\n' +
'        .evYield_Attack    = 0,\n' +
'        .evYield_Defense   = 0,\n' +
'        .evYield_Speed     = 1,\n' +
'        .evYield_SpAttack  = 0,\n' +
'        .evYield_SpDefense = 0,\n' +
'        .itemCommon = ITEM_NONE,\n' +
'        .itemRare   = ITEM_ASPEAR_BERRY,\n' +
'        .genderRatio = PERCENT_FEMALE(75),\n' +
'        .eggCycles = 20,\n' +
'        .friendship = 70,\n' +
'        .growthRate = GROWTH_MEDIUM_FAST,\n' +
'        .eggGroups = { EGG_GROUP_FIELD, EGG_GROUP_FIELD },\n' +
'        .abilities = {ABILITY_INNER_FOCUS, ABILITY_CUTE_CHARM},\n' +
'        .safariZoneFleeRate = 0,\n' +
'        .bodyColor = BODY_COLOR_BLUE,\n' +
'        .noFlip = FALSE,\n' +
'    },\n';

    var ninetales =
'    [SPECIES_NINETALES_HOENN] =\n' +
'    {\n' +
'        .baseHP        = 73,\n' +
'        .baseAttack    = 60,\n' +
'        .baseDefense   = 75,\n' +
'        .baseSpeed     = 107,\n' +
'        .baseSpAttack  = 90,\n' +
'        .baseSpDefense = 100,\n' +
'        .types = { TYPE_ICE, TYPE_FAIRY },\n' +
'        .catchRate = 75,\n' +
'        .expYield = 178,\n' +
'        .evYield_HP        = 0,\n' +
'        .evYield_Attack    = 0,\n' +
'        .evYield_Defense   = 0,\n' +
'        .evYield_Speed     = 0,\n' +
'        .evYield_SpAttack  = 1,\n' +
'        .evYield_SpDefense = 1,\n' +
'        .itemCommon = ITEM_NONE,\n' +
'        .itemRare   = ITEM_NEVER_MELT_ICE,\n' +
'        .genderRatio = PERCENT_FEMALE(75),\n' +
'        .eggCycles = 20,\n' +
'        .friendship = 70,\n' +
'        .growthRate = GROWTH_MEDIUM_FAST,\n' +
'        .eggGroups = { EGG_GROUP_FIELD, EGG_GROUP_FIELD },\n' +
'        .abilities = {ABILITY_INNER_FOCUS, ABILITY_FLASH_FIRE},\n' +
'        .safariZoneFleeRate = 0,\n' +
'        .bodyColor = BODY_COLOR_BLUE,\n' +
'        .noFlip = FALSE,\n' +
'    },\n';

    var farigiraf =
'    [SPECIES_FARIGIRAF] =\n' +
'    {\n' +
'        .baseHP        = 120,\n' +
'        .baseAttack    = 90,\n' +
'        .baseDefense   = 70,\n' +
'        .baseSpeed     = 60,\n' +
'        .baseSpAttack  = 110,\n' +
'        .baseSpDefense = 70,\n' +
'        .types = { TYPE_NORMAL, TYPE_PSYCHIC },\n' +
'        .catchRate = 45,\n' +
'        .expYield = 200,\n' +
'        .evYield_HP        = 3,\n' +
'        .evYield_Attack    = 0,\n' +
'        .evYield_Defense   = 0,\n' +
'        .evYield_Speed     = 0,\n' +
'        .evYield_SpAttack  = 0,\n' +
'        .evYield_SpDefense = 0,\n' +
'        .itemCommon = ITEM_NONE,\n' +
'        .itemRare   = ITEM_NONE,\n' +
'        .genderRatio = PERCENT_FEMALE(50),\n' +
'        .eggCycles = 20,\n' +
'        .friendship = 70,\n' +
'        .growthRate = GROWTH_MEDIUM_FAST,\n' +
'        .eggGroups = { EGG_GROUP_FIELD, EGG_GROUP_FIELD },\n' +
'        .abilities = {ABILITY_INNER_FOCUS, ABILITY_SYNCHRONIZE},\n' +
'        .safariZoneFleeRate = 0,\n' +
'        .bodyColor = BODY_COLOR_YELLOW,\n' +
'        .noFlip = FALSE,\n' +
'    },\n';

    var anchor = '    [SPECIES_BAGON_HOENN] =\n    {\n';
    var idx = c.indexOf(anchor);
    if (idx === -1) { errors.push(rel + ': BAGON_HOENN anchor not found'); return; }

    /* Find the end of BAGON_HOENN entry (closing },\n};) */
    var closingBrace = c.indexOf('\n};', idx);
    if (closingBrace === -1) { errors.push(rel + ': closing }; not found'); return; }

    c = c.slice(0, closingBrace) + vulpix + ninetales + farigiraf + c.slice(closingBrace);
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 4. src/data/pokemon/level_up_learnsets.h                            */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/level_up_learnsets.h';
    var c = readF(rel);

    var newLearnsets =
'\nstatic const u16 sVulpixHoennLevelUpLearnset[] = {\n' +
'    LEVEL_UP_MOVE( 1, MOVE_POWDER_SNOW),\n' +
'    LEVEL_UP_MOVE( 5, MOVE_TAIL_WHIP),\n' +
'    LEVEL_UP_MOVE( 9, MOVE_ROAR),\n' +
'    LEVEL_UP_MOVE(13, MOVE_QUICK_ATTACK),\n' +
'    LEVEL_UP_MOVE(17, MOVE_ICY_WIND),\n' +
'    LEVEL_UP_MOVE(21, MOVE_CONFUSE_RAY),\n' +
'    LEVEL_UP_MOVE(25, MOVE_DAZZLING_GLEAM),\n' +
'    LEVEL_UP_MOVE(29, MOVE_ICE_BEAM),\n' +
'    LEVEL_UP_MOVE(33, MOVE_SAFEGUARD),\n' +
'    LEVEL_UP_MOVE(37, MOVE_GRUDGE),\n' +
'    LEVEL_UP_MOVE(41, MOVE_BLIZZARD),\n' +
'    LEVEL_UP_END\n' +
'};\n' +
'\nstatic const u16 sNinetalesHoennLevelUpLearnset[] = {\n' +
'    LEVEL_UP_MOVE( 1, MOVE_CONFUSE_RAY),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_QUICK_ATTACK),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_MOONBLAST),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_SAFEGUARD),\n' +
'    LEVEL_UP_MOVE(45, MOVE_BLIZZARD),\n' +
'    LEVEL_UP_END\n' +
'};\n' +
'\nstatic const u16 sFarigirafLevelUpLearnset[] = {\n' +
'    LEVEL_UP_MOVE( 1, MOVE_TACKLE),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_GROWL),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_CONFUSION),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_ASTONISH),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_STOMP),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_PSYBEAM),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_AGILITY),\n' +
'    LEVEL_UP_MOVE(40, MOVE_CRUNCH),\n' +
'    LEVEL_UP_MOVE(44, MOVE_BATON_PASS),\n' +
'    LEVEL_UP_MOVE(48, MOVE_CALM_MIND),\n' +
'    LEVEL_UP_MOVE(53, MOVE_PSYCHIC),\n' +
'    LEVEL_UP_MOVE(58, MOVE_DOUBLE_EDGE),\n' +
'    LEVEL_UP_END\n' +
'};\n';

    c = c.trimEnd() + '\n' + newLearnsets;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 5. src/data/pokemon/level_up_learnset_pointers.h                    */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/level_up_learnset_pointers.h';
    var c = readF(rel);
    var anchor = '    [SPECIES_BAGON_HOENN] = sBagonHoennLevelUpLearnset,\n};';
    if (c.indexOf(anchor) === -1) { errors.push(rel + ': anchor not found'); return; }
    c = c.replace(anchor,
        '    [SPECIES_BAGON_HOENN] = sBagonHoennLevelUpLearnset,\n' +
        '    [SPECIES_VULPIX_HOENN] = sVulpixHoennLevelUpLearnset,\n' +
        '    [SPECIES_NINETALES_HOENN] = sNinetalesHoennLevelUpLearnset,\n' +
        '    [SPECIES_FARIGIRAF] = sFarigirafLevelUpLearnset,\n' +
        '};'
    );
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 6. src/data/pokemon/tmhm_learnsets.h                                */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/tmhm_learnsets.h';
    var c = readF(rel);

    var vulpix =
'\n    [SPECIES_VULPIX_HOENN] = { .learnset = {\n' +
'        .CALM_MIND = TRUE,\n' +
'        .ROAR = TRUE,\n' +
'        .TOXIC = TRUE,\n' +
'        .HAIL = TRUE,\n' +
'        .HIDDEN_POWER = TRUE,\n' +
'        .ICE_BEAM = TRUE,\n' +
'        .BLIZZARD = TRUE,\n' +
'        .PROTECT = TRUE,\n' +
'        .SAFEGUARD = TRUE,\n' +
'        .FRUSTRATION = TRUE,\n' +
'        .IRON_TAIL = TRUE,\n' +
'        .RETURN = TRUE,\n' +
'        .DIG = TRUE,\n' +
'        .DOUBLE_TEAM = TRUE,\n' +
'        .FACADE = TRUE,\n' +
'        .SECRET_POWER = TRUE,\n' +
'        .REST = TRUE,\n' +
'        .ATTRACT = TRUE,\n' +
'    } },\n';

    var ninetales =
'    [SPECIES_NINETALES_HOENN] = { .learnset = {\n' +
'        .CALM_MIND = TRUE,\n' +
'        .ROAR = TRUE,\n' +
'        .TOXIC = TRUE,\n' +
'        .HAIL = TRUE,\n' +
'        .HIDDEN_POWER = TRUE,\n' +
'        .ICE_BEAM = TRUE,\n' +
'        .BLIZZARD = TRUE,\n' +
'        .HYPER_BEAM = TRUE,\n' +
'        .PROTECT = TRUE,\n' +
'        .SAFEGUARD = TRUE,\n' +
'        .FRUSTRATION = TRUE,\n' +
'        .IRON_TAIL = TRUE,\n' +
'        .RETURN = TRUE,\n' +
'        .DIG = TRUE,\n' +
'        .PSYCHIC = TRUE,\n' +
'        .SHADOW_BALL = TRUE,\n' +
'        .DOUBLE_TEAM = TRUE,\n' +
'        .FACADE = TRUE,\n' +
'        .SECRET_POWER = TRUE,\n' +
'        .REST = TRUE,\n' +
'        .ATTRACT = TRUE,\n' +
'    } },\n';

    var farigiraf =
'    [SPECIES_FARIGIRAF] = { .learnset = {\n' +
'        .TOXIC = TRUE,\n' +
'        .HIDDEN_POWER = TRUE,\n' +
'        .SUNNY_DAY = TRUE,\n' +
'        .PROTECT = TRUE,\n' +
'        .RAIN_DANCE = TRUE,\n' +
'        .FRUSTRATION = TRUE,\n' +
'        .RETURN = TRUE,\n' +
'        .PSYCHIC = TRUE,\n' +
'        .SHADOW_BALL = TRUE,\n' +
'        .DOUBLE_TEAM = TRUE,\n' +
'        .REFLECT = TRUE,\n' +
'        .SHOCK_WAVE = TRUE,\n' +
'        .THUNDERBOLT = TRUE,\n' +
'        .THUNDER = TRUE,\n' +
'        .EARTHQUAKE = TRUE,\n' +
'        .FACADE = TRUE,\n' +
'        .SECRET_POWER = TRUE,\n' +
'        .REST = TRUE,\n' +
'        .ATTRACT = TRUE,\n' +
'        .SKILL_SWAP = TRUE,\n' +
'        .FLASH = TRUE,\n' +
'        .IRON_TAIL = TRUE,\n' +
'        .CALM_MIND = TRUE,\n' +
'        .LIGHT_SCREEN = TRUE,\n' +
'        .STRENGTH = TRUE,\n' +
'        .ROCK_SMASH = TRUE,\n' +
'    } },\n';

    var anchor = '\n};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': closing }; not found'); return; }
    c = c.slice(0, lastIdx) + vulpix + ninetales + farigiraf + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 7. src/data/pokemon/egg_moves.h                                     */
/*    Vulpix_Hoenn ALREADY EXISTS — only add Farigiraf                 */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/egg_moves.h';
    var c = readF(rel);

    /* Farigiraf egg moves — insert before the terminator */
    var anchor = 'EGG_MOVES_TERMINATOR\n};';
    if (c.indexOf(anchor) === -1) { errors.push(rel + ': terminator anchor not found'); return; }
    c = c.replace(anchor,
        '\n    EGG_MOVES_SPECIES_OFFSET + SPECIES_FARIGIRAF,\n' +
        '    MOVE_WISH,\n' +
        '    MOVE_FUTURE_SIGHT,\n' +
        '    MOVE_TAKE_DOWN,\n' +
        '    MOVE_DOUBLE_EDGE,\n' +
        'EGG_MOVES_TERMINATOR\n};'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 8. src/data/pokemon/pokedex_text.h                                  */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_text.h';
    var c = readF(rel);

    var texts =
'\nconst u8 gVulpixHoennPokedexText[] = _(\n' +
'    "This VULPIX adapted to HOENN\'s\\n"\n' +
'    "ashfall by developing an icy coat.\\n"\n' +
'    "Its six tails leave frost patterns\\n"\n' +
'    "in volcanic ash as it walks.");\n' +
'\nconst u8 gNinetalesHoennPokedexText[] = _(\n' +
'    "NINETALES adapted to HOENN\'s changed\\n"\n' +
'    "climate. Its nine tails radiate cold\\n"\n' +
'    "that freezes ash midair, creating\\n"\n' +
'    "shimmering curtains of ice crystals.");\n' +
'\nconst u8 gFarigirafPokedexText[] = _(\n' +
'    "A POK\\x1Emon whose two minds have\\n"\n' +
'    "merged into one. It can sense\\n"\n' +
'    "danger with the psychic radar of\\n"\n' +
'    "its unified brain and crush\\n"\n' +
'    "threats with powerful headbutts.");\n';

    c = c.trimEnd() + '\n' + texts;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 9. src/data/pokemon/pokedex_entries.h                               */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_entries.h';
    var c = readF(rel);

    var entries =
'\n    [NATIONAL_DEX_VULPIX_HOENN] =\n' +
'    {\n' +
'        .categoryName = _("Fox"),\n' +
'        .height = 6,\n' +
'        .weight = 99,\n' +
'        .description = gVulpixHoennPokedexText,\n' +
'        .pokemonScale = 424,\n' +
'        .pokemonOffset = 17,\n' +
'        .trainerScale = 256,\n' +
'        .trainerOffset = 0,\n' +
'    },\n' +
'\n    [NATIONAL_DEX_NINETALES_HOENN] =\n' +
'    {\n' +
'        .categoryName = _("Fox"),\n' +
'        .height = 11,\n' +
'        .weight = 199,\n' +
'        .description = gNinetalesHoennPokedexText,\n' +
'        .pokemonScale = 339,\n' +
'        .pokemonOffset = 10,\n' +
'        .trainerScale = 256,\n' +
'        .trainerOffset = 0,\n' +
'    },\n' +
'\n    [NATIONAL_DEX_FARIGIRAF] =\n' +
'    {\n' +
'        .categoryName = _("Long Neck"),\n' +
'        .height = 32,\n' +
'        .weight = 1600,\n' +
'        .description = gFarigirafPokedexText,\n' +
'        .pokemonScale = 256,\n' +
'        .pokemonOffset = 0,\n' +
'        .trainerScale = 256,\n' +
'        .trainerOffset = 0,\n' +
'    },\n';

    var anchor = '\n};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': closing }; not found'); return; }
    c = c.slice(0, lastIdx) + entries + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 10. src/data/pokemon/pokedex_orders.h — 3 arrays                    */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_orders.h';
    var c = readF(rel);

    /* Alphabetical array: insert at beginning (F, N, V come early-ish) */
    /* Actually just insert after BAGON_HOENN at top since custom species are grouped there */
    c = c.replace(
        '    NATIONAL_DEX_BAGON_HOENN,\n    NATIONAL_DEX_FROSLASS,',
        '    NATIONAL_DEX_BAGON_HOENN,\n' +
        '    NATIONAL_DEX_FARIGIRAF,\n' +
        '    NATIONAL_DEX_FROSLASS,'
    );
    /* Also add Vulpix/Ninetales to alphabetical — after Mamoswine */
    c = c.replace(
        '    NATIONAL_DEX_MAMOSWINE,\n    NATIONAL_DEX_DUSKNOIR,',
        '    NATIONAL_DEX_MAMOSWINE,\n' +
        '    NATIONAL_DEX_NINETALES_HOENN,\n' +
        '    NATIONAL_DEX_VULPIX_HOENN,\n' +
        '    NATIONAL_DEX_DUSKNOIR,'
    );

    /* Weight array: insert before closing }; — after BAGON_HOENN */
    c = c.replace(
        '    NATIONAL_DEX_BAGON_HOENN,\n};\n\nconst u16 gPokedexOrder_Height',
        '    NATIONAL_DEX_BAGON_HOENN,\n' +
        '    NATIONAL_DEX_VULPIX_HOENN,\n' +
        '    NATIONAL_DEX_NINETALES_HOENN,\n' +
        '    NATIONAL_DEX_FARIGIRAF,\n' +
        '};\n\nconst u16 gPokedexOrder_Height'
    );

    /* Height array: insert before closing }; — after BAGON_HOENN */
    c = c.replace(
        '    NATIONAL_DEX_BAGON_HOENN,\n};',
        '    NATIONAL_DEX_BAGON_HOENN,\n' +
        '    NATIONAL_DEX_VULPIX_HOENN,\n' +
        '    NATIONAL_DEX_NINETALES_HOENN,\n' +
        '    NATIONAL_DEX_FARIGIRAF,\n' +
        '};'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 11. src/data/graphics/pokemon.h — INCBINs                           */
/* ================================================================== */
(function() {
    var rel = 'src/data/graphics/pokemon.h';
    var c = readF(rel);

    var incbins =
'\nconst u32 gMonStillFrontPic_VulpixHoenn[] = INCBIN_U32("graphics/pokemon/vulpix_hoenn/front.4bpp.lz");\n' +
'const u32 gMonPalette_VulpixHoenn[] = INCBIN_U32("graphics/pokemon/vulpix_hoenn/normal.gbapal.lz");\n' +
'const u32 gMonBackPic_VulpixHoenn[] = INCBIN_U32("graphics/pokemon/vulpix_hoenn/back.4bpp.lz");\n' +
'const u32 gMonShinyPalette_VulpixHoenn[] = INCBIN_U32("graphics/pokemon/vulpix_hoenn/shiny.gbapal.lz");\n' +
'const u8 gMonIcon_VulpixHoenn[] = INCBIN_U8("graphics/pokemon/vulpix_hoenn/icon.4bpp");\n' +
'const u8 gMonFootprint_VulpixHoenn[] = INCBIN_U8("graphics/pokemon/vulpix_hoenn/footprint.1bpp");\n' +
'\nconst u32 gMonStillFrontPic_NinetalesHoenn[] = INCBIN_U32("graphics/pokemon/ninetales_hoenn/front.4bpp.lz");\n' +
'const u32 gMonPalette_NinetalesHoenn[] = INCBIN_U32("graphics/pokemon/ninetales_hoenn/normal.gbapal.lz");\n' +
'const u32 gMonBackPic_NinetalesHoenn[] = INCBIN_U32("graphics/pokemon/ninetales_hoenn/back.4bpp.lz");\n' +
'const u32 gMonShinyPalette_NinetalesHoenn[] = INCBIN_U32("graphics/pokemon/ninetales_hoenn/shiny.gbapal.lz");\n' +
'const u8 gMonIcon_NinetalesHoenn[] = INCBIN_U8("graphics/pokemon/ninetales_hoenn/icon.4bpp");\n' +
'const u8 gMonFootprint_NinetalesHoenn[] = INCBIN_U8("graphics/pokemon/ninetales_hoenn/footprint.1bpp");\n' +
'\nconst u32 gMonStillFrontPic_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/front.4bpp.lz");\n' +
'const u32 gMonPalette_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/normal.gbapal.lz");\n' +
'const u32 gMonBackPic_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/back.4bpp.lz");\n' +
'const u32 gMonShinyPalette_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/shiny.gbapal.lz");\n' +
'const u8 gMonIcon_Farigiraf[] = INCBIN_U8("graphics/pokemon/farigiraf/icon.4bpp");\n' +
'const u8 gMonFootprint_Farigiraf[] = INCBIN_U8("graphics/pokemon/farigiraf/footprint.1bpp");\n';

    var anchor = 'const u32 gMonStillFrontPic_Egg[]';
    var result = insertBefore(c, anchor, incbins);
    if (!result) { errors.push(rel + ': Egg anchor not found'); return; }
    writeF(rel, result);
    done.push(rel);
})();

/* ================================================================== */
/* 12. include/graphics.h — extern declarations                        */
/* ================================================================== */
(function() {
    var rel = 'include/graphics.h';
    var c = readF(rel);

    var externs =
'extern const u32 gMonFrontPic_VulpixHoenn[];\n' +
'extern const u32 gMonPalette_VulpixHoenn[];\n' +
'extern const u32 gMonBackPic_VulpixHoenn[];\n' +
'extern const u32 gMonShinyPalette_VulpixHoenn[];\n' +
'extern const u32 gMonStillFrontPic_VulpixHoenn[];\n' +
'extern const u8 gMonIcon_VulpixHoenn[];\n' +
'extern const u8 gMonFootprint_VulpixHoenn[];\n' +
'extern const u32 gMonFrontPic_NinetalesHoenn[];\n' +
'extern const u32 gMonPalette_NinetalesHoenn[];\n' +
'extern const u32 gMonBackPic_NinetalesHoenn[];\n' +
'extern const u32 gMonShinyPalette_NinetalesHoenn[];\n' +
'extern const u32 gMonStillFrontPic_NinetalesHoenn[];\n' +
'extern const u8 gMonIcon_NinetalesHoenn[];\n' +
'extern const u8 gMonFootprint_NinetalesHoenn[];\n' +
'extern const u32 gMonFrontPic_Farigiraf[];\n' +
'extern const u32 gMonPalette_Farigiraf[];\n' +
'extern const u32 gMonBackPic_Farigiraf[];\n' +
'extern const u32 gMonShinyPalette_Farigiraf[];\n' +
'extern const u32 gMonStillFrontPic_Farigiraf[];\n' +
'extern const u8 gMonIcon_Farigiraf[];\n' +
'extern const u8 gMonFootprint_Farigiraf[];\n';

    var anchor = 'extern const u32 gMonFrontPic_Egg[];';
    var result = insertBefore(c, anchor, externs);
    if (!result) { errors.push(rel + ': Egg extern anchor not found'); return; }
    writeF(rel, result);
    done.push(rel);
})();

/* ================================================================== */
/* 13-20. Graphics tables                                              */
/* ================================================================== */
var graphicsTables = [
    {
        rel: 'src/data/pokemon_graphics/front_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: '    SPECIES_SPRITE(VULPIX_HOENN, gMonFrontPic_VulpixHoenn),\n' +
               '    SPECIES_SPRITE(NINETALES_HOENN, gMonFrontPic_NinetalesHoenn),\n' +
               '    SPECIES_SPRITE(FARIGIRAF, gMonFrontPic_Farigiraf),\n'
    },
    {
        rel: 'src/data/pokemon_graphics/back_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: '    SPECIES_SPRITE(VULPIX_HOENN, gMonBackPic_VulpixHoenn),\n' +
               '    SPECIES_SPRITE(NINETALES_HOENN, gMonBackPic_NinetalesHoenn),\n' +
               '    SPECIES_SPRITE(FARIGIRAF, gMonBackPic_Farigiraf),\n'
    },
    {
        rel: 'src/data/pokemon_graphics/still_front_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: '    SPECIES_SPRITE(VULPIX_HOENN, gMonStillFrontPic_VulpixHoenn),\n' +
               '    SPECIES_SPRITE(NINETALES_HOENN, gMonStillFrontPic_NinetalesHoenn),\n' +
               '    SPECIES_SPRITE(FARIGIRAF, gMonStillFrontPic_Farigiraf),\n'
    },
    {
        rel: 'src/data/pokemon_graphics/front_pic_coordinates.h',
        anchor: '    [SPECIES_EGG]',
        lines: '    [SPECIES_VULPIX_HOENN] = { .size = MON_COORDS_SIZE(48, 48), .y_offset = 9 },\n' +
               '    [SPECIES_NINETALES_HOENN] = { .size = MON_COORDS_SIZE(56, 56), .y_offset = 5 },\n' +
               '    [SPECIES_FARIGIRAF] = { .size = MON_COORDS_SIZE(56, 64), .y_offset = 2 },\n'
    },
    {
        rel: 'src/data/pokemon_graphics/back_pic_coordinates.h',
        anchor: '    [SPECIES_EGG]',
        lines: '    [SPECIES_VULPIX_HOENN] = { .size = MON_COORDS_SIZE(56, 48), .y_offset = 9 },\n' +
               '    [SPECIES_NINETALES_HOENN] = { .size = MON_COORDS_SIZE(64, 56), .y_offset = 4 },\n' +
               '    [SPECIES_FARIGIRAF] = { .size = MON_COORDS_SIZE(64, 56), .y_offset = 4 },\n'
    },
    {
        rel: 'src/data/pokemon_graphics/palette_table.h',
        anchor: '    SPECIES_PAL(EGG,',
        lines: '    SPECIES_PAL(VULPIX_HOENN, gMonPalette_VulpixHoenn),\n' +
               '    SPECIES_PAL(NINETALES_HOENN, gMonPalette_NinetalesHoenn),\n' +
               '    SPECIES_PAL(FARIGIRAF, gMonPalette_Farigiraf),\n'
    },
    {
        rel: 'src/data/pokemon_graphics/shiny_palette_table.h',
        anchor: '    SPECIES_SHINY_PAL(EGG,',
        lines: '    SPECIES_SHINY_PAL(VULPIX_HOENN, gMonShinyPalette_VulpixHoenn),\n' +
               '    SPECIES_SHINY_PAL(NINETALES_HOENN, gMonShinyPalette_NinetalesHoenn),\n' +
               '    SPECIES_SHINY_PAL(FARIGIRAF, gMonShinyPalette_Farigiraf),\n'
    },
    {
        rel: 'src/data/pokemon_graphics/footprint_table.h',
        anchor: '    [SPECIES_EGG]',
        lines: '    [SPECIES_VULPIX_HOENN] = gMonFootprint_VulpixHoenn,\n' +
               '    [SPECIES_NINETALES_HOENN] = gMonFootprint_NinetalesHoenn,\n' +
               '    [SPECIES_FARIGIRAF] = gMonFootprint_Farigiraf,\n'
    }
];

graphicsTables.forEach(function(t) {
    var c = readF(t.rel);
    var idx = c.indexOf(t.anchor);
    if (idx === -1) { errors.push(t.rel + ': anchor "' + t.anchor + '" not found'); return; }
    c = c.slice(0, idx) + t.lines + c.slice(idx);
    writeF(t.rel, c);
    done.push(t.rel);
});

/* ================================================================== */
/* 21. src/data/pokemon_graphics/front_pic_anims.h                     */
/*     AnimCmd arrays + SINGLE_ANIMATION macros + table entries         */
/*     Also adds missing Froslass/Mamoswine entries                    */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon_graphics/front_pic_anims.h';
    var c = readF(rel);

    /* Section 1: Add AnimCmd arrays — insert before SINGLE_ANIMATION macro definition */
    var animAnchor = '#define SINGLE_ANIMATION(name)';
    var newAnims =
'\nstatic const union AnimCmd sAnim_Froslass_1[] =\n' +
'{\n' +
'    ANIMCMD_FRAME(0, 20),\n' +
'    ANIMCMD_FRAME(1, 20),\n' +
'    ANIMCMD_FRAME(0, 20),\n' +
'    ANIMCMD_END,\n' +
'};\n' +
'\nstatic const union AnimCmd sAnim_Mamoswine_1[] =\n' +
'{\n' +
'    ANIMCMD_FRAME(0, 15),\n' +
'    ANIMCMD_FRAME(1, 15),\n' +
'    ANIMCMD_FRAME(0, 15),\n' +
'    ANIMCMD_END,\n' +
'};\n' +
'\nstatic const union AnimCmd sAnim_VulpixHoenn_1[] =\n' +
'{\n' +
'    ANIMCMD_FRAME(0, 20),\n' +
'    ANIMCMD_FRAME(1, 20),\n' +
'    ANIMCMD_FRAME(0, 20),\n' +
'    ANIMCMD_END,\n' +
'};\n' +
'\nstatic const union AnimCmd sAnim_NinetalesHoenn_1[] =\n' +
'{\n' +
'    ANIMCMD_FRAME(0, 20),\n' +
'    ANIMCMD_FRAME(1, 20),\n' +
'    ANIMCMD_FRAME(0, 20),\n' +
'    ANIMCMD_END,\n' +
'};\n' +
'\nstatic const union AnimCmd sAnim_Farigiraf_1[] =\n' +
'{\n' +
'    ANIMCMD_FRAME(0, 15),\n' +
'    ANIMCMD_FRAME(1, 15),\n' +
'    ANIMCMD_FRAME(0, 15),\n' +
'    ANIMCMD_END,\n' +
'};\n\n';

    var result = insertBefore(c, animAnchor, newAnims);
    if (!result) { errors.push(rel + ': SINGLE_ANIMATION macro anchor not found'); return; }
    c = result;

    /* Section 2: Add SINGLE_ANIMATION macros — insert before SINGLE_ANIMATION(Egg) */
    c = c.replace(
        'SINGLE_ANIMATION(BagonHoenn);\nSINGLE_ANIMATION(Egg);',
        'SINGLE_ANIMATION(BagonHoenn);\n' +
        'SINGLE_ANIMATION(Froslass);\n' +
        'SINGLE_ANIMATION(Mamoswine);\n' +
        'SINGLE_ANIMATION(VulpixHoenn);\n' +
        'SINGLE_ANIMATION(NinetalesHoenn);\n' +
        'SINGLE_ANIMATION(Farigiraf);\n' +
        'SINGLE_ANIMATION(Egg);'
    );

    /* Section 3: Table entries — insert before [SPECIES_EGG] */
    c = c.replace(
        '    [SPECIES_BAGON_HOENN] = sAnims_BagonHoenn,\n    [SPECIES_EGG]',
        '    [SPECIES_BAGON_HOENN] = sAnims_BagonHoenn,\n' +
        '    [SPECIES_FROSLASS] = sAnims_Froslass,\n' +
        '    [SPECIES_MAMOSWINE] = sAnims_Mamoswine,\n' +
        '    [SPECIES_VULPIX_HOENN] = sAnims_VulpixHoenn,\n' +
        '    [SPECIES_NINETALES_HOENN] = sAnims_NinetalesHoenn,\n' +
        '    [SPECIES_FARIGIRAF] = sAnims_Farigiraf,\n' +
        '    [SPECIES_EGG]'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 22. src/pokemon_icon.c — 2 tables                                   */
/* ================================================================== */
(function() {
    var rel = 'src/pokemon_icon.c';
    var c = readF(rel);

    /* Icon table */
    var anchor1 = '    [SPECIES_EGG] = gMonIcon_Egg,';
    var result = insertBefore(c, anchor1,
        '    [SPECIES_VULPIX_HOENN] = gMonIcon_VulpixHoenn,\n' +
        '    [SPECIES_NINETALES_HOENN] = gMonIcon_NinetalesHoenn,\n' +
        '    [SPECIES_FARIGIRAF] = gMonIcon_Farigiraf,\n');
    if (!result) { errors.push(rel + ': icon table anchor not found'); return; }
    c = result;

    /* Palette index table */
    var anchor2 = '    [SPECIES_EGG] = 1,';
    result = insertBefore(c, anchor2,
        '    [SPECIES_VULPIX_HOENN] = 0,\n' +
        '    [SPECIES_NINETALES_HOENN] = 0,\n' +
        '    [SPECIES_FARIGIRAF] = 0,\n');
    if (!result) { errors.push(rel + ': icon palette anchor not found'); return; }
    c = result;

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 23. src/pokemon.c — 3 mapping arrays                                */
/* ================================================================== */
(function() {
    var rel = 'src/pokemon.c';
    var c = readF(rel);

    /* Hoenn dex mapping — insert before closing }; */
    c = c.replace(
        '    SPECIES_TO_HOENN(BAGON_HOENN),\n};',
        '    SPECIES_TO_HOENN(BAGON_HOENN),\n' +
        '    SPECIES_TO_HOENN(VULPIX_HOENN),\n' +
        '    SPECIES_TO_HOENN(NINETALES_HOENN),\n' +
        '    SPECIES_TO_HOENN(FARIGIRAF),\n};'
    );

    /* National dex mapping — insert before closing }; */
    c = c.replace(
        '    SPECIES_TO_NATIONAL(BAGON_HOENN),\n};',
        '    SPECIES_TO_NATIONAL(BAGON_HOENN),\n' +
        '    SPECIES_TO_NATIONAL(VULPIX_HOENN),\n' +
        '    SPECIES_TO_NATIONAL(NINETALES_HOENN),\n' +
        '    SPECIES_TO_NATIONAL(FARIGIRAF),\n};'
    );

    /* Hoenn to National — insert before OLD_UNOWN_B */
    c = c.replace(
        '    HOENN_TO_NATIONAL(BAGON_HOENN),\n    HOENN_TO_NATIONAL(OLD_UNOWN_B),',
        '    HOENN_TO_NATIONAL(BAGON_HOENN),\n' +
        '    HOENN_TO_NATIONAL(VULPIX_HOENN),\n' +
        '    HOENN_TO_NATIONAL(NINETALES_HOENN),\n' +
        '    HOENN_TO_NATIONAL(FARIGIRAF),\n' +
        '    HOENN_TO_NATIONAL(OLD_UNOWN_B),'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 24. sound/cry_tables.inc — forward + reverse                        */
/* ================================================================== */
(function() {
    var rel = 'sound/cry_tables.inc';
    var c = readF(rel);

    /* Forward table: insert before .align 2 that precedes gCryTable_Reverse */
    /* Current last entries: Cry_Growlithe, Cry_Arcanine, then blank line, then .align 2 */
    var fwdAnchor = '\tcry Cry_Arcanine\n\n\t.align 2\ngCryTable_Reverse::';
    if (c.indexOf(fwdAnchor) === -1) { errors.push(rel + ': forward anchor not found'); return; }
    c = c.replace(fwdAnchor,
        '\tcry Cry_Arcanine\n' +
        '\tcry Cry_Dusclops\n' +
        '\tcry Cry_Murkrow\n' +
        '\tcry Cry_Snorunt\n' +
        '\tcry Cry_Swinub\n' +
        '\tcry Cry_Bagon\n' +
        '\tcry Cry_Vulpix\n' +
        '\tcry Cry_Ninetales\n' +
        '\tcry Cry_Girafarig\n\n' +
        '\t.align 2\n' +
        'gCryTable_Reverse::'
    );

    /* Reverse table: append at end */
    c = c.trimEnd() + '\n' +
        '\tcry_reverse Cry_Snorunt\n' +
        '\tcry_reverse Cry_Swinub\n' +
        '\tcry_reverse Cry_Bagon\n' +
        '\tcry_reverse Cry_Vulpix\n' +
        '\tcry_reverse Cry_Ninetales\n' +
        '\tcry_reverse Cry_Girafarig\n';

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 25. src/data/pokemon/cry_ids.h — map new species to cry indices      */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/cry_ids.h';
    var c = readF(rel);

    /* The cry table maps species to cry indices. Gen 1/2 species use
       their species ID directly. Gen 3+ use this mapping table.
       We need to map our new species to existing cry entries.

       After our additions, the forward cry table has entries:
       0-387: original (Bulbasaur..Chimecho)
       388: Riolu, 389: Lucario, 390: Weavile,
       391: Gible, 392: Gabite, 393: Garchomp,
       394: Corsola, 395: Growlithe, 396: Arcanine,
       397: Dusknoir(Dusclops), 398: Honchkrow(Murkrow),
       399: Froslass(Snorunt), 400: Mamoswine(Swinub),
       401: BagonHoenn(Bagon),
       402: VulpixHoenn(Vulpix), 403: NinetalesHoenn(Ninetales),
       404: Farigiraf(Girafarig)

       But SpeciesToCryId uses gSpeciesIdToCryId[species - 276].
       New species reuse existing base cries, so we map them to
       the same CRY TABLE INDEX as the base species.
       Vulpix is species 37 -> cry index 37 (Gen 1 direct mapping).
       Ninetales is species 38 -> cry index 38.
       Girafarig is species 203 -> cry index 203.
    */

    var anchor = '};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': closing }; not found'); return; }

    var newEntries =
'    [SPECIES_RIOLU - 277] = 388,\n' +
'    [SPECIES_LUCARIO - 277] = 389,\n' +
'    [SPECIES_WEAVILE - 277] = 390,\n' +
'    [SPECIES_GIBLE - 277] = 391,\n' +
'    [SPECIES_GABITE - 277] = 392,\n' +
'    [SPECIES_GARCHOMP - 277] = 393,\n' +
'    [SPECIES_CORSOLA_HOENN - 277] = 394,\n' +
'    [SPECIES_GROWLITHE_HOENN - 277] = 395,\n' +
'    [SPECIES_ARCANINE_HOENN - 277] = 396,\n' +
'    [SPECIES_DUSKNOIR - 277] = 397,\n' +
'    [SPECIES_HONCHKROW - 277] = 398,\n' +
'    [SPECIES_FROSLASS - 277] = 399,\n' +
'    [SPECIES_MAMOSWINE - 277] = 400,\n' +
'    [SPECIES_BAGON_HOENN - 277] = 401,\n' +
'    [SPECIES_VULPIX_HOENN - 277] = 402,\n' +
'    [SPECIES_NINETALES_HOENN - 277] = 403,\n' +
'    [SPECIES_FARIGIRAF - 277] = 404,\n';

    c = c.slice(0, lastIdx) + newEntries + c.slice(lastIdx);
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 26. src/data/pokemon/evolution.h                                     */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/evolution.h';
    var c = readF(rel);

    /* Add Vulpix_Hoenn -> Ninetales_Hoenn evolution */
    /* Insert after GROWLITHE_HOENN line */
    c = c.replace(
        '    [SPECIES_GROWLITHE_HOENN] = {{EVO_ITEM, ITEM_WATER_STONE, SPECIES_ARCANINE_HOENN}},',
        '    [SPECIES_GROWLITHE_HOENN] = {{EVO_ITEM, ITEM_WATER_STONE, SPECIES_ARCANINE_HOENN}},\n' +
        '    [SPECIES_VULPIX_HOENN] = {{EVO_ITEM, ITEM_MOON_STONE, SPECIES_NINETALES_HOENN}},'
    );

    /* Add Girafarig -> Farigiraf evolution */
    /* Insert before the closing }; */
    var anchor = '    [SPECIES_METANG]     = {{EVO_LEVEL, 45, SPECIES_METAGROSS}},\n};';
    if (c.indexOf(anchor) === -1) { errors.push(rel + ': METANG anchor not found'); return; }
    c = c.replace(anchor,
        '    [SPECIES_METANG]     = {{EVO_LEVEL, 45, SPECIES_METAGROSS}},\n' +
        '    [SPECIES_GIRAFARIG]  = {{EVO_LEVEL, 32, SPECIES_FARIGIRAF}},\n' +
        '};'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 27. src/anim_mon_front_pics.c — animated front pic INCBINs          */
/* ================================================================== */
(function() {
    var rel = 'src/anim_mon_front_pics.c';
    var c = readF(rel);

    var anchor = 'const u32 gMonFrontPic_Egg[]';
    var newEntries =
'const u32 gMonFrontPic_VulpixHoenn[] = INCBIN_U32("graphics/pokemon/vulpix_hoenn/anim_front.4bpp.lz");\n' +
'const u32 gMonFrontPic_NinetalesHoenn[] = INCBIN_U32("graphics/pokemon/ninetales_hoenn/anim_front.4bpp.lz");\n' +
'const u32 gMonFrontPic_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/anim_front.4bpp.lz");\n';

    var result = insertBefore(c, anchor, newEntries);
    if (!result) { errors.push(rel + ': Egg anchor not found'); return; }
    writeF(rel, result);
    done.push(rel);
})();

/* ================================================================== */
/* Report                                                              */
/* ================================================================== */
console.log('=== C218 Species Pipeline Complete ===');
console.log('Files modified: ' + done.length);
done.forEach(function(f) { console.log('  OK: ' + f); });
if (errors.length) {
    console.log('\nERRORS:');
    errors.forEach(function(e) { console.log('  !! ' + e); });
    process.exit(1);
} else {
    console.log('\nAll files modified successfully.');
    console.log('Species IDs: VULPIX_HOENN=426, NINETALES_HOENN=427, FARIGIRAF=428, EGG=429');
}
