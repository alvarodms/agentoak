#!/usr/bin/env node
/* C213: Add Froslass (423) and Mamoswine (424) species data.
   Inserts entries into ~22 data files following C212 Dusknoir/Honchkrow pattern. */

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

function insertAfter(content, anchor, insertion) {
    var idx = content.indexOf(anchor);
    if (idx === -1) return null;
    var end = idx + anchor.length;
    return content.slice(0, end) + insertion + content.slice(end);
}

var errors = [];
var done = [];

/* ================================================================== */
/* 1. species_info.h                                                   */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/species_info.h';
    var c = readF(rel);
    var anchor = '\n};\n';
    /* Find the LAST }; which closes the array */
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }

    var froslass = '\n' +
'    [SPECIES_FROSLASS] =\n' +
'    {\n' +
'        .baseHP        = 70,\n' +
'        .baseAttack    = 80,\n' +
'        .baseDefense   = 70,\n' +
'        .baseSpeed     = 110,\n' +
'        .baseSpAttack  = 80,\n' +
'        .baseSpDefense = 70,\n' +
'        .types = { TYPE_ICE, TYPE_GHOST },\n' +
'        .catchRate = 75,\n' +
'        .expYield = 168,\n' +
'        .evYield_HP        = 0,\n' +
'        .evYield_Attack    = 0,\n' +
'        .evYield_Defense   = 0,\n' +
'        .evYield_Speed     = 2,\n' +
'        .evYield_SpAttack  = 0,\n' +
'        .evYield_SpDefense = 0,\n' +
'        .itemCommon = ITEM_NONE,\n' +
'        .itemRare   = ITEM_NONE,\n' +
'        .genderRatio = PERCENT_FEMALE(50),\n' +
'        .eggCycles = 20,\n' +
'        .friendship = 70,\n' +
'        .growthRate = GROWTH_MEDIUM_FAST,\n' +
'        .eggGroups = { EGG_GROUP_FAIRY, EGG_GROUP_MINERAL },\n' +
'        .abilities = {ABILITY_INNER_FOCUS, ABILITY_PRESSURE},\n' +
'        .safariZoneFleeRate = 0,\n' +
'        .bodyColor = BODY_COLOR_WHITE,\n' +
'        .noFlip = FALSE,\n' +
'    },\n';

    var mamoswine = '\n' +
'    [SPECIES_MAMOSWINE] =\n' +
'    {\n' +
'        .baseHP        = 110,\n' +
'        .baseAttack    = 130,\n' +
'        .baseDefense   = 80,\n' +
'        .baseSpeed     = 80,\n' +
'        .baseSpAttack  = 70,\n' +
'        .baseSpDefense = 60,\n' +
'        .types = { TYPE_ICE, TYPE_GROUND },\n' +
'        .catchRate = 50,\n' +
'        .expYield = 207,\n' +
'        .evYield_HP        = 0,\n' +
'        .evYield_Attack    = 3,\n' +
'        .evYield_Defense   = 0,\n' +
'        .evYield_Speed     = 0,\n' +
'        .evYield_SpAttack  = 0,\n' +
'        .evYield_SpDefense = 0,\n' +
'        .itemCommon = ITEM_NONE,\n' +
'        .itemRare   = ITEM_NONE,\n' +
'        .genderRatio = PERCENT_FEMALE(50),\n' +
'        .eggCycles = 20,\n' +
'        .friendship = 70,\n' +
'        .growthRate = GROWTH_SLOW,\n' +
'        .eggGroups = { EGG_GROUP_FIELD, EGG_GROUP_FIELD },\n' +
'        .abilities = {ABILITY_OBLIVIOUS, ABILITY_THICK_FAT},\n' +
'        .safariZoneFleeRate = 0,\n' +
'        .bodyColor = BODY_COLOR_BROWN,\n' +
'        .noFlip = FALSE,\n' +
'    },\n';

    c = c.slice(0, lastIdx) + froslass + mamoswine + c.slice(lastIdx);
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 2. level_up_learnsets.h                                             */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/level_up_learnsets.h';
    var c = readF(rel);

    var froslass =
'\nstatic const u16 sFroslassLevelUpLearnset[] = {\n' +
'    LEVEL_UP_MOVE( 1, MOVE_POWDER_SNOW),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_LEER),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_ASTONISH),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_DOUBLE_TEAM),\n' +
'    LEVEL_UP_MOVE(13, MOVE_ICY_WIND),\n' +
'    LEVEL_UP_MOVE(19, MOVE_CONFUSE_RAY),\n' +
'    LEVEL_UP_MOVE(22, MOVE_SPITE),\n' +
'    LEVEL_UP_MOVE(28, MOVE_HAIL),\n' +
'    LEVEL_UP_MOVE(31, MOVE_ICE_SHARD),\n' +
'    LEVEL_UP_MOVE(38, MOVE_SHADOW_BALL),\n' +
'    LEVEL_UP_MOVE(43, MOVE_BLIZZARD),\n' +
'    LEVEL_UP_MOVE(51, MOVE_DESTINY_BOND),\n' +
'    LEVEL_UP_END\n' +
'};\n';

    var mamoswine =
'\nstatic const u16 sMamoswineLevelUpLearnset[] = {\n' +
'    LEVEL_UP_MOVE( 1, MOVE_ANCIENT_POWER),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_HORN_ATTACK),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_ODOR_SLEUTH),\n' +
'    LEVEL_UP_MOVE( 1, MOVE_POWDER_SNOW),\n' +
'    LEVEL_UP_MOVE(13, MOVE_MUD_SLAP),\n' +
'    LEVEL_UP_MOVE(16, MOVE_ENDURE),\n' +
'    LEVEL_UP_MOVE(20, MOVE_ICE_SHARD),\n' +
'    LEVEL_UP_MOVE(25, MOVE_TAKE_DOWN),\n' +
'    LEVEL_UP_MOVE(28, MOVE_SCARY_FACE),\n' +
'    LEVEL_UP_MOVE(33, MOVE_EARTHQUAKE),\n' +
'    LEVEL_UP_MOVE(40, MOVE_ROCK_SLIDE),\n' +
'    LEVEL_UP_MOVE(45, MOVE_THRASH),\n' +
'    LEVEL_UP_MOVE(56, MOVE_BLIZZARD),\n' +
'    LEVEL_UP_MOVE(65, MOVE_AMNESIA),\n' +
'    LEVEL_UP_END\n' +
'};\n';

    /* Insert after the last }; in the file (end of Honchkrow's learnset) */
    c = c.trimEnd() + '\n' + froslass + mamoswine;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 3. level_up_learnset_pointers.h                                     */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/level_up_learnset_pointers.h';
    var c = readF(rel);
    var anchor = '    [SPECIES_HONCHKROW] = sHonchkrowLevelUpLearnset,\n};';
    var replacement =
'    [SPECIES_HONCHKROW] = sHonchkrowLevelUpLearnset,\n' +
'    [SPECIES_FROSLASS] = sFroslassLevelUpLearnset,\n' +
'    [SPECIES_MAMOSWINE] = sMamoswineLevelUpLearnset,\n' +
'};';
    c = c.replace(anchor, replacement);
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 4. tmhm_learnsets.h                                                 */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/tmhm_learnsets.h';
    var c = readF(rel);

    var froslass =
'\n    [SPECIES_FROSLASS] = { .learnset = {\n' +
'        .TOXIC = TRUE,\n' +
'        .HAIL = TRUE,\n' +
'        .HIDDEN_POWER = TRUE,\n' +
'        .ICE_BEAM = TRUE,\n' +
'        .BLIZZARD = TRUE,\n' +
'        .LIGHT_SCREEN = TRUE,\n' +
'        .PROTECT = TRUE,\n' +
'        .RAIN_DANCE = TRUE,\n' +
'        .SAFEGUARD = TRUE,\n' +
'        .FRUSTRATION = TRUE,\n' +
'        .THUNDERBOLT = TRUE,\n' +
'        .RETURN = TRUE,\n' +
'        .PSYCHIC = TRUE,\n' +
'        .SHADOW_BALL = TRUE,\n' +
'        .DOUBLE_TEAM = TRUE,\n' +
'        .TORMENT = TRUE,\n' +
'        .FACADE = TRUE,\n' +
'        .SECRET_POWER = TRUE,\n' +
'        .REST = TRUE,\n' +
'        .ATTRACT = TRUE,\n' +
'        .TAUNT = TRUE,\n' +
'        .FLASH = TRUE,\n' +
'    } },\n';

    var mamoswine =
'\n    [SPECIES_MAMOSWINE] = { .learnset = {\n' +
'        .TOXIC = TRUE,\n' +
'        .HAIL = TRUE,\n' +
'        .HIDDEN_POWER = TRUE,\n' +
'        .ICE_BEAM = TRUE,\n' +
'        .BLIZZARD = TRUE,\n' +
'        .HYPER_BEAM = TRUE,\n' +
'        .PROTECT = TRUE,\n' +
'        .RAIN_DANCE = TRUE,\n' +
'        .FRUSTRATION = TRUE,\n' +
'        .EARTHQUAKE = TRUE,\n' +
'        .RETURN = TRUE,\n' +
'        .DOUBLE_TEAM = TRUE,\n' +
'        .SANDSTORM = TRUE,\n' +
'        .ROCK_TOMB = TRUE,\n' +
'        .FACADE = TRUE,\n' +
'        .SECRET_POWER = TRUE,\n' +
'        .REST = TRUE,\n' +
'        .ATTRACT = TRUE,\n' +
'        .STRENGTH = TRUE,\n' +
'        .ROCK_SMASH = TRUE,\n' +
'    } },\n';

    /* Insert before the final }; */
    var anchor = '\n};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }
    c = c.slice(0, lastIdx) + froslass + mamoswine + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 5. egg_moves.h                                                      */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/egg_moves.h';
    var c = readF(rel);

    var newEntries =
'\n    EGG_MOVES_SPECIES_OFFSET + SPECIES_FROSLASS,\n' +
'    MOVE_DESTINY_BOND,\n' +
'    MOVE_SPITE,\n' +
'    MOVE_DISABLE,\n' +
'    MOVE_WEATHER_BALL,\n' +
'\n' +
'    EGG_MOVES_SPECIES_OFFSET + SPECIES_MAMOSWINE,\n' +
'    MOVE_ANCIENT_POWER,\n' +
'    MOVE_ICICLE_SPEAR,\n' +
'    MOVE_BODY_SLAM,\n' +
'    MOVE_TAKE_DOWN,\n';

    /* Append before final }; */
    var anchor = '\n};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }
    c = c.slice(0, lastIdx) + newEntries + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 6. pokedex_text.h                                                   */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_text.h';
    var c = readF(rel);

    var froslass =
'\nconst u8 gFroslassPokedexText[] = _(\n' +
'    "FROSLASS is born when migration\\n"\n' +
'    "energy awakens a spectral path\\n"\n' +
'    "in SNORUNT. It drifts through\\n"\n' +
'    "walls of ice without a sound.\\n"\n' +
'    "It is said to freeze prey solid\\n"\n' +
'    "with its icy breath, then display\\n"\n' +
'    "them like sculptures.");\n';

    var mamoswine =
'\nconst u8 gMamoswinePokedexText[] = _(\n' +
'    "MAMOSWINE is an ancient power\\n"\n' +
'    "reawakened. The migration\'s\\n"\n' +
'    "energy unlocked strength that\\n"\n' +
'    "had lain dormant in PILOSWINE.\\n"\n' +
'    "Its massive tusks are made of\\n"\n' +
'    "solid ice. A charging MAMOSWINE\\n"\n' +
'    "can shatter boulders with ease.");\n';

    c = c.trimEnd() + '\n' + froslass + mamoswine;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 7. pokedex_entries.h                                                */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_entries.h';
    var c = readF(rel);

    var froslass =
'\n    [NATIONAL_DEX_FROSLASS] =\n' +
'    {\n' +
'        .categoryName = _("Snow Land"),\n' +
'        .height = 13,\n' +
'        .weight = 266,\n' +
'        .description = gFroslassPokedexText,\n' +
'        .pokemonScale = 290,\n' +
'        .pokemonOffset = 5,\n' +
'        .trainerScale = 256,\n' +
'        .trainerOffset = 0,\n' +
'    },\n';

    var mamoswine =
'\n    [NATIONAL_DEX_MAMOSWINE] =\n' +
'    {\n' +
'        .categoryName = _("Twin Tusk"),\n' +
'        .height = 25,\n' +
'        .weight = 2910,\n' +
'        .description = gMamoswinePokedexText,\n' +
'        .pokemonScale = 256,\n' +
'        .pokemonOffset = 0,\n' +
'        .trainerScale = 256,\n' +
'        .trainerOffset = 0,\n' +
'    },\n';

    var anchor = '\n};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }
    c = c.slice(0, lastIdx) + froslass + mamoswine + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 8. pokedex_orders.h — 3 arrays                                     */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_orders.h';
    var c = readF(rel);

    /* Alphabetical: insert at beginning (after opening {) */
    var anchor1 = 'gPokedexOrder_Alphabetical[] =\n{\n';
    c = insertAfter(c, anchor1, '    NATIONAL_DEX_FROSLASS,\n    NATIONAL_DEX_MAMOSWINE,\n');
    if (!c) { errors.push(rel + ': alphabetical anchor missing'); return; }

    /* Weight: insert before closing }; of weight array — append at end since these are heavy */
    var anchor2 = '    NATIONAL_DEX_HONCHKROW,\n};';
    var idx2 = c.indexOf(anchor2);
    if (idx2 === -1) {
        /* Try alternate: just before last }; */
        errors.push(rel + ': weight/height anchor issue, appending to end of each');
    }
    /* Simple approach: replace the last HONCHKROW,\n}; in each array context */
    /* Weight array — Mamoswine is very heavy (291kg), Froslass is light (26.6kg) */
    c = c.replace(
        '    NATIONAL_DEX_DUSKNOIR,\n    NATIONAL_DEX_HONCHKROW,\n};',
        '    NATIONAL_DEX_FROSLASS,\n    NATIONAL_DEX_DUSKNOIR,\n    NATIONAL_DEX_HONCHKROW,\n    NATIONAL_DEX_MAMOSWINE,\n};'
    );

    /* Height array — last occurrence of DUSKNOIR+HONCHKROW pattern */
    /* Froslass 1.3m, Mamoswine 2.5m, Dusknoir 2.2m */
    var heightAnchor = '    NATIONAL_DEX_DUSKNOIR,\n    NATIONAL_DEX_HONCHKROW,\n};';
    c = c.replace(
        heightAnchor,
        '    NATIONAL_DEX_FROSLASS,\n    NATIONAL_DEX_DUSKNOIR,\n    NATIONAL_DEX_MAMOSWINE,\n    NATIONAL_DEX_HONCHKROW,\n};'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 9. graphics/pokemon.h — INCBINs                                     */
/* ================================================================== */
(function() {
    var rel = 'src/data/graphics/pokemon.h';
    var c = readF(rel);

    var froslass =
'\nconst u32 gMonStillFrontPic_Froslass[] = INCBIN_U32("graphics/pokemon/froslass/front.4bpp.lz");\n' +
'const u32 gMonPalette_Froslass[] = INCBIN_U32("graphics/pokemon/froslass/normal.gbapal.lz");\n' +
'const u32 gMonBackPic_Froslass[] = INCBIN_U32("graphics/pokemon/froslass/back.4bpp.lz");\n' +
'const u32 gMonShinyPalette_Froslass[] = INCBIN_U32("graphics/pokemon/froslass/shiny.gbapal.lz");\n' +
'const u8 gMonIcon_Froslass[] = INCBIN_U8("graphics/pokemon/froslass/icon.4bpp");\n' +
'const u8 gMonFootprint_Froslass[] = INCBIN_U8("graphics/pokemon/froslass/footprint.1bpp");\n';

    var mamoswine =
'\nconst u32 gMonStillFrontPic_Mamoswine[] = INCBIN_U32("graphics/pokemon/mamoswine/front.4bpp.lz");\n' +
'const u32 gMonPalette_Mamoswine[] = INCBIN_U32("graphics/pokemon/mamoswine/normal.gbapal.lz");\n' +
'const u32 gMonBackPic_Mamoswine[] = INCBIN_U32("graphics/pokemon/mamoswine/back.4bpp.lz");\n' +
'const u32 gMonShinyPalette_Mamoswine[] = INCBIN_U32("graphics/pokemon/mamoswine/shiny.gbapal.lz");\n' +
'const u8 gMonIcon_Mamoswine[] = INCBIN_U8("graphics/pokemon/mamoswine/icon.4bpp");\n' +
'const u8 gMonFootprint_Mamoswine[] = INCBIN_U8("graphics/pokemon/mamoswine/footprint.1bpp");\n';

    /* Insert before gMonStillFrontPic_Egg */
    var anchor = 'const u32 gMonStillFrontPic_Egg[]';
    c = insertBefore(c, anchor, froslass + mamoswine);
    if (!c) { errors.push(rel + ': Egg anchor missing'); return; }
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 10. include/graphics.h — extern declarations                        */
/* ================================================================== */
(function() {
    var rel = 'include/graphics.h';
    var c = readF(rel);

    var froslass =
'extern const u32 gMonFrontPic_Froslass[];\n' +
'extern const u32 gMonPalette_Froslass[];\n' +
'extern const u32 gMonBackPic_Froslass[];\n' +
'extern const u32 gMonShinyPalette_Froslass[];\n' +
'extern const u32 gMonStillFrontPic_Froslass[];\n' +
'extern const u8 gMonIcon_Froslass[];\n' +
'extern const u8 gMonFootprint_Froslass[];\n';

    var mamoswine =
'extern const u32 gMonFrontPic_Mamoswine[];\n' +
'extern const u32 gMonPalette_Mamoswine[];\n' +
'extern const u32 gMonBackPic_Mamoswine[];\n' +
'extern const u32 gMonShinyPalette_Mamoswine[];\n' +
'extern const u32 gMonStillFrontPic_Mamoswine[];\n' +
'extern const u8 gMonIcon_Mamoswine[];\n' +
'extern const u8 gMonFootprint_Mamoswine[];\n';

    var anchor = 'extern const u32 gMonFrontPic_Egg[];\n';
    c = insertBefore(c, anchor, froslass + mamoswine);
    if (!c) { errors.push(rel + ': Egg extern anchor missing'); return; }
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 11-18. Graphics tables — all insert before [SPECIES_EGG] entries   */
/* ================================================================== */
var graphicsTables = [
    {
        rel: 'src/data/pokemon_graphics/front_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: [
            '    SPECIES_SPRITE(FROSLASS, gMonFrontPic_Froslass),',
            '    SPECIES_SPRITE(MAMOSWINE, gMonFrontPic_Mamoswine),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/back_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: [
            '    SPECIES_SPRITE(FROSLASS, gMonBackPic_Froslass),',
            '    SPECIES_SPRITE(MAMOSWINE, gMonBackPic_Mamoswine),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/still_front_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: [
            '    SPECIES_SPRITE(FROSLASS, gMonStillFrontPic_Froslass),',
            '    SPECIES_SPRITE(MAMOSWINE, gMonStillFrontPic_Mamoswine),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/front_pic_coordinates.h',
        anchor: '    [SPECIES_EGG]',
        lines: [
            '    [SPECIES_FROSLASS] = { .size = MON_COORDS_SIZE(48, 56), .y_offset = 5 },',
            '    [SPECIES_MAMOSWINE] = { .size = MON_COORDS_SIZE(64, 56), .y_offset = 4 },'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/back_pic_coordinates.h',
        anchor: '    [SPECIES_EGG]',
        lines: [
            '    [SPECIES_FROSLASS] = { .size = MON_COORDS_SIZE(56, 48), .y_offset = 8 },',
            '    [SPECIES_MAMOSWINE] = { .size = MON_COORDS_SIZE(64, 56), .y_offset = 4 },'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/palette_table.h',
        anchor: '    SPECIES_PAL(EGG,',
        lines: [
            '    SPECIES_PAL(FROSLASS, gMonPalette_Froslass),',
            '    SPECIES_PAL(MAMOSWINE, gMonPalette_Mamoswine),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/shiny_palette_table.h',
        anchor: '    SPECIES_SHINY_PAL(EGG,',
        lines: [
            '    SPECIES_SHINY_PAL(FROSLASS, gMonShinyPalette_Froslass),',
            '    SPECIES_SHINY_PAL(MAMOSWINE, gMonShinyPalette_Mamoswine),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/footprint_table.h',
        anchor: '    [SPECIES_EGG]',
        lines: [
            '    [SPECIES_FROSLASS] = gMonFootprint_Froslass,',
            '    [SPECIES_MAMOSWINE] = gMonFootprint_Mamoswine,'
        ]
    }
];

graphicsTables.forEach(function(t) {
    var c = readF(t.rel);
    var idx = c.indexOf(t.anchor);
    if (idx === -1) { errors.push(t.rel + ': anchor "' + t.anchor + '" not found'); return; }
    c = c.slice(0, idx) + t.lines.join('\n') + '\n' + c.slice(idx);
    writeF(t.rel, c);
    done.push(t.rel);
});

/* ================================================================== */
/* 19. front_pic_anims.h — 3 sections                                  */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon_graphics/front_pic_anims.h';
    var c = readF(rel);

    /* Section 1: AnimCmd arrays — insert after Honchkrow's */
    var animAnchor = 'static const union AnimCmd sAnim_Honchkrow_1[] =\n' +
        '{\n' +
        '    ANIMCMD_FRAME(0, 15),\n' +
        '    ANIMCMD_FRAME(1, 15),\n' +
        '    ANIMCMD_FRAME(0, 15),\n' +
        '    ANIMCMD_END,\n' +
        '};';

    var newAnims =
'\n\nstatic const union AnimCmd sAnim_Froslass_1[] =\n' +
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
'};';

    c = c.replace(animAnchor, animAnchor + newAnims);

    /* Section 2: SINGLE_ANIMATION macros — insert after Honchkrow */
    c = c.replace(
        'SINGLE_ANIMATION(Honchkrow);',
        'SINGLE_ANIMATION(Honchkrow);\nSINGLE_ANIMATION(Froslass);\nSINGLE_ANIMATION(Mamoswine);'
    );

    /* Section 3: gMonFrontAnimsPtrTable — insert before [SPECIES_EGG] */
    var tableAnchor = '    [SPECIES_EGG]';
    var tableIdx = c.lastIndexOf(tableAnchor);
    if (tableIdx === -1) { errors.push(rel + ': EGG table entry not found'); return; }
    c = c.slice(0, tableIdx) +
        '    [SPECIES_FROSLASS] = sAnims_Froslass,\n' +
        '    [SPECIES_MAMOSWINE] = sAnims_Mamoswine,\n' +
        c.slice(tableIdx);

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 20. pokemon_icon.c — 2 tables                                       */
/* ================================================================== */
(function() {
    var rel = 'src/pokemon_icon.c';
    var c = readF(rel);

    /* Icon pointer table: insert before [SPECIES_EGG] = gMonIcon_Egg */
    var anchor1 = '    [SPECIES_EGG] = gMonIcon_Egg,';
    c = insertBefore(c, anchor1,
        '    [SPECIES_FROSLASS] = gMonIcon_Froslass,\n' +
        '    [SPECIES_MAMOSWINE] = gMonIcon_Mamoswine,\n');
    if (!c) { errors.push(rel + ': icon table anchor missing'); return; }

    /* Icon palette index table: insert before [SPECIES_EGG] = 1 */
    var anchor2 = '    [SPECIES_EGG] = 1,';
    c = insertBefore(c, anchor2,
        '    [SPECIES_FROSLASS] = 0,\n' +
        '    [SPECIES_MAMOSWINE] = 0,\n');
    if (!c) { errors.push(rel + ': icon palette anchor missing'); return; }

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 21. cry_tables.inc — forward + reverse                              */
/* ================================================================== */
(function() {
    var rel = 'sound/cry_tables.inc';
    var c = readF(rel);

    /* Forward: insert before first .align 2 */
    var idx = c.indexOf('\t.align 2');
    if (idx === -1) { errors.push(rel + ': .align 2 not found'); return; }
    c = c.slice(0, idx) + '\tcry Cry_Glalie\n\tcry Cry_Piloswine\n' + c.slice(idx);

    /* Reverse: append at end */
    c = c.trimEnd() + '\n\tcry_reverse Cry_Glalie\n\tcry_reverse Cry_Piloswine\n';

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 22. pokemon.c — sSpeciesToNationalPokedexNum + sSpeciesToHoennPokedexNum */
/* ================================================================== */
(function() {
    var rel = 'src/pokemon.c';
    var c = readF(rel);

    /* National dex mapping: insert before [SPECIES_EGG] or at end of the array */
    var natAnchor = '    [SPECIES_HONCHKROW] = NATIONAL_DEX_HONCHKROW,';
    if (c.indexOf(natAnchor) !== -1) {
        c = c.replace(natAnchor, natAnchor + '\n' +
            '    [SPECIES_FROSLASS] = NATIONAL_DEX_FROSLASS,\n' +
            '    [SPECIES_MAMOSWINE] = NATIONAL_DEX_MAMOSWINE,');
    }

    /* Hoenn dex mapping */
    var hoennAnchor = '    [SPECIES_HONCHKROW] = HOENN_DEX_HONCHKROW,';
    if (c.indexOf(hoennAnchor) !== -1) {
        c = c.replace(hoennAnchor, hoennAnchor + '\n' +
            '    [SPECIES_FROSLASS] = HOENN_DEX_FROSLASS,\n' +
            '    [SPECIES_MAMOSWINE] = HOENN_DEX_MAMOSWINE,');
    }

    /* sHoennToNationalOrder mapping */
    var h2nAnchor = '    NATIONAL_DEX_HONCHKROW, // HOENN_DEX_HONCHKROW';
    if (c.indexOf(h2nAnchor) !== -1) {
        c = c.replace(h2nAnchor, h2nAnchor + '\n' +
            '    NATIONAL_DEX_FROSLASS, // HOENN_DEX_FROSLASS\n' +
            '    NATIONAL_DEX_MAMOSWINE, // HOENN_DEX_MAMOSWINE');
    }

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* Report                                                              */
/* ================================================================== */
console.log('=== C213 Species Pipeline Complete ===');
console.log('Files modified: ' + done.length);
done.forEach(function(f) { console.log('  OK: ' + f); });
if (errors.length) {
    console.log('\nERRORS:');
    errors.forEach(function(e) { console.log('  !! ' + e); });
    process.exit(1);
}
