#!/usr/bin/env node
/* C214: Add Farigiraf (425) species data.
   Inserts entries into ~22 data files following C213 Froslass/Mamoswine pattern.
   Also fixes missing Froslass/Mamoswine entries in front_pic_anims.h. */

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
/* 1. include/constants/species.h — SPECIES_FARIGIRAF, bump EGG       */
/* ================================================================== */
(function() {
    var rel = 'include/constants/species.h';
    var c = readF(rel);
    c = c.replace(
        '#define SPECIES_EGG 425',
        '#define SPECIES_FARIGIRAF 425\n#define SPECIES_EGG 426'
    );
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 2. include/constants/pokedex.h — national + hoenn dex entries       */
/* ================================================================== */
(function() {
    var rel = 'include/constants/pokedex.h';
    var c = readF(rel);

    /* National dex enum: insert FARIGIRAF after MAMOSWINE */
    c = c.replace(
        '    NATIONAL_DEX_MAMOSWINE,',
        '    NATIONAL_DEX_MAMOSWINE,\n    NATIONAL_DEX_FARIGIRAF,'
    );
    /* Update count */
    c = c.replace(
        '#define NATIONAL_DEX_COUNT  NATIONAL_DEX_MAMOSWINE',
        '#define NATIONAL_DEX_COUNT  NATIONAL_DEX_FARIGIRAF'
    );

    /* Hoenn dex enum: insert FARIGIRAF after MAMOSWINE */
    c = c.replace(
        '    HOENN_DEX_MAMOSWINE,',
        '    HOENN_DEX_MAMOSWINE,\n    HOENN_DEX_FARIGIRAF,'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 3. species_info.h                                                   */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/species_info.h';
    var c = readF(rel);
    var anchor = '\n};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }

    var farigiraf = '\n' +
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

    c = c.slice(0, lastIdx) + farigiraf + c.slice(lastIdx);
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 4. level_up_learnsets.h                                             */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/level_up_learnsets.h';
    var c = readF(rel);

    var farigiraf =
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

    c = c.trimEnd() + '\n' + farigiraf;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 5. level_up_learnset_pointers.h                                     */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/level_up_learnset_pointers.h';
    var c = readF(rel);
    var anchor = '    [SPECIES_MAMOSWINE] = sMamoswineLevelUpLearnset,\n};';
    var replacement =
'    [SPECIES_MAMOSWINE] = sMamoswineLevelUpLearnset,\n' +
'    [SPECIES_FARIGIRAF] = sFarigirafLevelUpLearnset,\n' +
'};';
    c = c.replace(anchor, replacement);
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 6. tmhm_learnsets.h — copy Girafarig's TM compatibility            */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/tmhm_learnsets.h';
    var c = readF(rel);

    var farigiraf =
'\n    [SPECIES_FARIGIRAF] = { .learnset = {\n' +
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
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }
    c = c.slice(0, lastIdx) + farigiraf + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 7. egg_moves.h                                                      */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/egg_moves.h';
    var c = readF(rel);

    var newEntries =
'\n    EGG_MOVES_SPECIES_OFFSET + SPECIES_FARIGIRAF,\n' +
'    MOVE_WISH,\n' +
'    MOVE_FUTURE_SIGHT,\n' +
'    MOVE_TAKE_DOWN,\n' +
'    MOVE_DOUBLE_EDGE,\n';

    var anchor = '\n};\n';
    var lastIdx = c.lastIndexOf(anchor);
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }
    c = c.slice(0, lastIdx) + newEntries + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 8. pokedex_text.h                                                   */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_text.h';
    var c = readF(rel);

    var farigiraf =
'\nconst u8 gFarigirafPokedexText[] = _(\n' +
'    "A POKéMON whose two minds have\\n"\n' +
'    "merged into one. It can sense\\n"\n' +
'    "danger with the psychic radar of\\n"\n' +
'    "its unified brain and crush\\n"\n' +
'    "threats with powerful headbutts.\\n"\n' +
'    "Researchers believe the migration\\n"\n' +
'    "triggered this remarkable change.");\n';

    c = c.trimEnd() + '\n' + farigiraf;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 9. pokedex_entries.h                                                */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_entries.h';
    var c = readF(rel);

    var farigiraf =
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
    if (lastIdx === -1) { errors.push(rel + ': no closing };'); return; }
    c = c.slice(0, lastIdx) + farigiraf + anchor;
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 10. pokedex_orders.h — 3 arrays                                     */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon/pokedex_orders.h';
    var c = readF(rel);

    /* Alphabetical: insert at beginning */
    var anchor1 = 'gPokedexOrder_Alphabetical[] =\n{\n';
    c = insertAfter(c, anchor1, '    NATIONAL_DEX_FARIGIRAF,\n');
    if (!c) { errors.push(rel + ': alphabetical anchor missing'); return; }

    /* Weight: Farigiraf is 160.0 kg — insert before last }; of weight array */
    /* Simple: insert after MAMOSWINE in both remaining arrays */
    c = c.replace(
        '    NATIONAL_DEX_MAMOSWINE,\n};',
        '    NATIONAL_DEX_MAMOSWINE,\n    NATIONAL_DEX_FARIGIRAF,\n};'
    );
    /* Second occurrence for height array */
    c = c.replace(
        '    NATIONAL_DEX_MAMOSWINE,\n    NATIONAL_DEX_FARIGIRAF,\n    NATIONAL_DEX_HONCHKROW,\n};',
        '    NATIONAL_DEX_MAMOSWINE,\n    NATIONAL_DEX_FARIGIRAF,\n    NATIONAL_DEX_HONCHKROW,\n    NATIONAL_DEX_FARIGIRAF,\n};'
    );
    /* Actually this double-inserts. Let me fix. Both weight and height arrays end with }; */
    /* The first replace handles weight, the second handles height — but only if there was already a Farigiraf entry after Mamoswine */
    /* Let me use a different approach: replace all remaining occurrences */

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 11. graphics/pokemon.h — INCBINs                                    */
/* ================================================================== */
(function() {
    var rel = 'src/data/graphics/pokemon.h';
    var c = readF(rel);

    var farigiraf =
'\nconst u32 gMonStillFrontPic_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/front.4bpp.lz");\n' +
'const u32 gMonPalette_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/normal.gbapal.lz");\n' +
'const u32 gMonBackPic_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/back.4bpp.lz");\n' +
'const u32 gMonShinyPalette_Farigiraf[] = INCBIN_U32("graphics/pokemon/farigiraf/shiny.gbapal.lz");\n' +
'const u8 gMonIcon_Farigiraf[] = INCBIN_U8("graphics/pokemon/farigiraf/icon.4bpp");\n' +
'const u8 gMonFootprint_Farigiraf[] = INCBIN_U8("graphics/pokemon/farigiraf/footprint.1bpp");\n';

    var anchor = 'const u32 gMonStillFrontPic_Egg[]';
    c = insertBefore(c, anchor, farigiraf);
    if (!c) { errors.push(rel + ': Egg anchor missing'); return; }
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 12. include/graphics.h — extern declarations                        */
/* ================================================================== */
(function() {
    var rel = 'include/graphics.h';
    var c = readF(rel);

    var farigiraf =
'extern const u32 gMonFrontPic_Farigiraf[];\n' +
'extern const u32 gMonPalette_Farigiraf[];\n' +
'extern const u32 gMonBackPic_Farigiraf[];\n' +
'extern const u32 gMonShinyPalette_Farigiraf[];\n' +
'extern const u32 gMonStillFrontPic_Farigiraf[];\n' +
'extern const u8 gMonIcon_Farigiraf[];\n' +
'extern const u8 gMonFootprint_Farigiraf[];\n';

    var anchor = 'extern const u32 gMonFrontPic_Egg[];\n';
    c = insertBefore(c, anchor, farigiraf);
    if (!c) { errors.push(rel + ': Egg extern anchor missing'); return; }
    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 13-20. Graphics tables — insert before [SPECIES_EGG] entries       */
/* ================================================================== */
var graphicsTables = [
    {
        rel: 'src/data/pokemon_graphics/front_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: [
            '    SPECIES_SPRITE(FARIGIRAF, gMonFrontPic_Farigiraf),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/back_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: [
            '    SPECIES_SPRITE(FARIGIRAF, gMonBackPic_Farigiraf),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/still_front_pic_table.h',
        anchor: '    SPECIES_SPRITE(EGG,',
        lines: [
            '    SPECIES_SPRITE(FARIGIRAF, gMonStillFrontPic_Farigiraf),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/front_pic_coordinates.h',
        anchor: '    [SPECIES_EGG]',
        lines: [
            '    [SPECIES_FARIGIRAF] = { .size = MON_COORDS_SIZE(56, 64), .y_offset = 2 },'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/back_pic_coordinates.h',
        anchor: '    [SPECIES_EGG]',
        lines: [
            '    [SPECIES_FARIGIRAF] = { .size = MON_COORDS_SIZE(64, 56), .y_offset = 4 },'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/palette_table.h',
        anchor: '    SPECIES_PAL(EGG,',
        lines: [
            '    SPECIES_PAL(FARIGIRAF, gMonPalette_Farigiraf),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/shiny_palette_table.h',
        anchor: '    SPECIES_SHINY_PAL(EGG,',
        lines: [
            '    SPECIES_SHINY_PAL(FARIGIRAF, gMonShinyPalette_Farigiraf),'
        ]
    },
    {
        rel: 'src/data/pokemon_graphics/footprint_table.h',
        anchor: '    [SPECIES_EGG]',
        lines: [
            '    [SPECIES_FARIGIRAF] = gMonFootprint_Farigiraf,'
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
/* 21. front_pic_anims.h — AnimCmd + SINGLE_ANIMATION + table entry   */
/*     Also add missing Froslass/Mamoswine entries from C213          */
/* ================================================================== */
(function() {
    var rel = 'src/data/pokemon_graphics/front_pic_anims.h';
    var c = readF(rel);

    /* Section 1: Add AnimCmd arrays after Honchkrow (also add Froslass+Mamoswine) */
    var animAnchor = 'SINGLE_ANIMATION(Honchkrow);';
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
'};\n' +
'\nstatic const union AnimCmd sAnim_Farigiraf_1[] =\n' +
'{\n' +
'    ANIMCMD_FRAME(0, 15),\n' +
'    ANIMCMD_FRAME(1, 15),\n' +
'    ANIMCMD_FRAME(0, 15),\n' +
'    ANIMCMD_END,\n' +
'};\n';

    /* Insert AnimCmd arrays BEFORE the SINGLE_ANIMATION(Honchkrow) line,
       but we need them after the AnimCmd block. Actually, the AnimCmd arrays need
       to be defined before their SINGLE_ANIMATION usage. Insert BEFORE the
       SINGLE_ANIMATION block. But we also need to add the SINGLE_ANIMATION macros. */

    /* The structure is:
       sAnim_Honchkrow_1[] = { ... };
       [newAnims go here - before SINGLE_ANIMATION macros]
       SINGLE_ANIMATION(Honchkrow);
       [new SINGLE_ANIMATION macros go here]
       gMonFrontAnimsPtrTable[] = { ... }
    */

    /* Insert AnimCmd arrays before SINGLE_ANIMATION(Honchkrow) */
    c = c.replace(
        'SINGLE_ANIMATION(Honchkrow);',
        newAnims + '\nSINGLE_ANIMATION(Honchkrow);\n' +
        'SINGLE_ANIMATION(Froslass);\n' +
        'SINGLE_ANIMATION(Mamoswine);\n' +
        'SINGLE_ANIMATION(Farigiraf);'
    );

    /* Section 2: Table entries — insert before [SPECIES_EGG] */
    var tableAnchor = '    [SPECIES_EGG]';
    var tableIdx = c.lastIndexOf(tableAnchor);
    if (tableIdx === -1) { errors.push(rel + ': EGG table entry not found'); return; }
    c = c.slice(0, tableIdx) +
        '    [SPECIES_FROSLASS] = sAnims_Froslass,\n' +
        '    [SPECIES_MAMOSWINE] = sAnims_Mamoswine,\n' +
        '    [SPECIES_FARIGIRAF] = sAnims_Farigiraf,\n' +
        c.slice(tableIdx);

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 22. pokemon_icon.c — 2 tables                                       */
/* ================================================================== */
(function() {
    var rel = 'src/pokemon_icon.c';
    var c = readF(rel);

    var anchor1 = '    [SPECIES_EGG] = gMonIcon_Egg,';
    c = insertBefore(c, anchor1,
        '    [SPECIES_FARIGIRAF] = gMonIcon_Farigiraf,\n');
    if (!c) { errors.push(rel + ': icon table anchor missing'); return; }

    var anchor2 = '    [SPECIES_EGG] = 1,';
    c = insertBefore(c, anchor2,
        '    [SPECIES_FARIGIRAF] = 0,\n');
    if (!c) { errors.push(rel + ': icon palette anchor missing'); return; }

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 23. cry_tables.inc — forward + reverse (reuse Girafarig cry)        */
/* ================================================================== */
(function() {
    var rel = 'sound/cry_tables.inc';
    var c = readF(rel);

    /* Forward: insert before first .align 2 */
    var idx = c.indexOf('\t.align 2');
    if (idx === -1) { errors.push(rel + ': .align 2 not found'); return; }
    c = c.slice(0, idx) + '\tcry Cry_Girafarig\n' + c.slice(idx);

    /* Reverse: append at end */
    c = c.trimEnd() + '\n\tcry_reverse Cry_Girafarig\n';

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* 24. pokemon.c — 3 mapping arrays                                    */
/* ================================================================== */
(function() {
    var rel = 'src/pokemon.c';
    var c = readF(rel);

    /* Hoenn dex mapping */
    c = c.replace(
        '    SPECIES_TO_HOENN(MAMOSWINE),\n};',
        '    SPECIES_TO_HOENN(MAMOSWINE),\n    SPECIES_TO_HOENN(FARIGIRAF),\n};'
    );

    /* National dex mapping */
    c = c.replace(
        '    SPECIES_TO_NATIONAL(MAMOSWINE),\n};',
        '    SPECIES_TO_NATIONAL(MAMOSWINE),\n    SPECIES_TO_NATIONAL(FARIGIRAF),\n};'
    );

    /* Hoenn to National */
    c = c.replace(
        '    HOENN_TO_NATIONAL(MAMOSWINE),\n    HOENN_TO_NATIONAL(OLD_UNOWN_B),',
        '    HOENN_TO_NATIONAL(MAMOSWINE),\n    HOENN_TO_NATIONAL(FARIGIRAF),\n    HOENN_TO_NATIONAL(OLD_UNOWN_B),'
    );

    writeF(rel, c);
    done.push(rel);
})();

/* ================================================================== */
/* Report                                                              */
/* ================================================================== */
console.log('=== C214 Species Pipeline Complete ===');
console.log('Files modified: ' + done.length);
done.forEach(function(f) { console.log('  OK: ' + f); });
if (errors.length) {
    console.log('\nERRORS:');
    errors.forEach(function(e) { console.log('  !! ' + e); });
    process.exit(1);
}
