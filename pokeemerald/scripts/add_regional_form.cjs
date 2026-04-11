#!/usr/bin/env node
/**
 * add_regional_form.cjs — Config-driven species insertion pipeline
 *
 * Reads a JSON config and inserts a new species into all ~27 pokeemerald
 * source files. Replaces bespoke per-species scripts.
 *
 * Usage:
 *   node scripts/add_regional_form.cjs configs/my_species.json
 *   node scripts/add_regional_form.cjs configs/my_species.json --dry-run
 *
 * Created: Cycle 202
 */

'use strict';

var fs = require('fs');
var path = require('path');

/* ------------------------------------------------------------------ */
/*  CLI                                                                */
/* ------------------------------------------------------------------ */

var args = process.argv.slice(2);
var dryRun = args.indexOf('--dry-run') !== -1;
var configPath = args.filter(function(a) { return a !== '--dry-run'; })[0];

if (!configPath) {
    console.error('Usage: node add_regional_form.cjs <config.json> [--dry-run]');
    process.exit(1);
}

var cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

/* Resolve pokeemerald root relative to this script */
var ROOT = path.resolve(__dirname, '..');

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

var summary = [];
var warnings = [];
var errors = [];

function p(rel) { return path.join(ROOT, rel); }

function readFile(rel) {
    return fs.readFileSync(p(rel), 'utf8');
}

function writeFile(rel, content) {
    if (dryRun) {
        summary.push('[DRY-RUN] Would write: ' + rel);
    } else {
        fs.writeFileSync(p(rel), content, 'utf8');
        summary.push('Modified: ' + rel);
    }
}

/**
 * Check if species already exists in file content.
 * Returns true if found (skip insertion).
 * Checks multiple patterns: [SPECIES_X], SPECIES_SPRITE(X, SPECIES_PAL(X, etc.
 */
function alreadyExists(content, speciesName) {
    return content.indexOf('SPECIES_' + speciesName) !== -1 ||
           content.indexOf('NATIONAL_DEX_' + speciesName) !== -1 ||
           content.indexOf('(' + speciesName + ',') !== -1 ||
           content.indexOf('(' + speciesName + ')') !== -1;
}

/**
 * Insert `insertion` before the first line matching `anchorRegex`.
 * Returns the modified content or null if anchor not found.
 */
function insertBefore(content, anchorRegex, insertion) {
    var match = anchorRegex.exec(content);
    if (!match) return null;
    var idx = match.index;
    return content.slice(0, idx) + insertion + content.slice(idx);
}

/**
 * Insert `insertion` after the first line matching `anchorRegex`.
 * Inserts after the end of the matched line (including its newline).
 */
function insertAfter(content, anchorRegex, insertion) {
    var match = anchorRegex.exec(content);
    if (!match) return null;
    var endOfLine = content.indexOf('\n', match.index);
    if (endOfLine === -1) endOfLine = content.length;
    else endOfLine += 1;
    return content.slice(0, endOfLine) + insertion + content.slice(endOfLine);
}

/**
 * Replace a specific pattern with new text.
 */
function replaceFirst(content, pattern, replacement) {
    var match = pattern.exec(content);
    if (!match) return null;
    return content.slice(0, match.index) + replacement + content.slice(match.index + match[0].length);
}

/* ------------------------------------------------------------------ */
/*  Config shorthand                                                   */
/* ------------------------------------------------------------------ */

var NAME = cfg.name;                     /* CORSOLA_HOENN */
var LOWER = cfg.lowerName;               /* corsola_hoenn */
var CAP = cfg.capitalName;               /* CorsolaHoenn */
var CRY = cfg.baseSpeciesCry;            /* Corsola */

var stats = cfg.stats;
var dex = cfg.dexEntry;
var evs = cfg.evYield;

/* ------------------------------------------------------------------ */
/*  1. include/constants/species.h                                     */
/* ------------------------------------------------------------------ */

function doSpeciesH() {
    var rel = 'include/constants/species.h';
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — SPECIES_' + NAME + ' already exists');
        return;
    }

    /* Find current SPECIES_EGG line to get its ID */
    var eggMatch = /#define SPECIES_EGG\s+(\d+)/.exec(content);
    if (!eggMatch) { errors.push(rel + ': cannot find SPECIES_EGG'); return; }
    var eggId = parseInt(eggMatch[1], 10);
    var newId = eggId;
    var newEggId = eggId + 1;

    /* Insert new define before SPECIES_EGG */
    var newLine = '#define SPECIES_' + NAME + ' ' + newId + '\n';
    content = insertBefore(content, /^#define SPECIES_EGG\s+\d+/m, newLine);
    if (!content) { errors.push(rel + ': insertBefore SPECIES_EGG failed'); return; }

    /* Update SPECIES_EGG value */
    content = content.replace(
        '#define SPECIES_EGG ' + eggId,
        '#define SPECIES_EGG ' + newEggId
    );

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  2. include/constants/pokedex.h                                     */
/* ------------------------------------------------------------------ */

function doPokedexH() {
    var rel = 'include/constants/pokedex.h';
    var content = readFile(rel);
    if (content.indexOf('NATIONAL_DEX_' + NAME) !== -1) {
        summary.push('[SKIP] ' + rel + ' — NATIONAL_DEX_' + NAME + ' already exists');
        return;
    }

    /* National enum: insert before "// Old Unown" */
    var natInsert = '    NATIONAL_DEX_' + NAME + ',\n';
    content = insertBefore(content, /^\s*\/\/ Old Unown/m, natInsert);
    if (!content) { errors.push(rel + ': cannot find "// Old Unown" anchor'); return; }

    /* Hoenn enum: insert before HOENN_DEX_OLD_UNOWN_B */
    var hoenInsert = '    HOENN_DEX_' + NAME + ',\n';
    content = insertBefore(content, /^\s*HOENN_DEX_OLD_UNOWN_B,/m, hoenInsert);
    if (!content) { errors.push(rel + ': cannot find HOENN_DEX_OLD_UNOWN_B anchor'); return; }

    /* Update NATIONAL_DEX_COUNT to reference new last species */
    content = content.replace(
        /^(#define NATIONAL_DEX_COUNT\s+)NATIONAL_DEX_\w+/m,
        '$1NATIONAL_DEX_' + NAME
    );

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  3. src/data/pokemon/species_info.h                                 */
/* ------------------------------------------------------------------ */

function doSpeciesInfo() {
    var rel = 'src/data/pokemon/species_info.h';
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var block = [
        '',
        '    [SPECIES_' + NAME + '] =',
        '    {',
        '        .baseHP        = ' + stats.hp + ',',
        '        .baseAttack    = ' + stats.atk + ',',
        '        .baseDefense   = ' + stats.def + ',',
        '        .baseSpeed     = ' + stats.speed + ',',
        '        .baseSpAttack  = ' + stats.spAtk + ',',
        '        .baseSpDefense = ' + stats.spDef + ',',
        '        .types = { ' + cfg.types[0] + ', ' + cfg.types[1] + ' },',
        '        .catchRate = ' + cfg.catchRate + ',',
        '        .expYield = ' + cfg.expYield + ',',
        '        .evYield_HP        = ' + evs.hp + ',',
        '        .evYield_Attack    = ' + evs.atk + ',',
        '        .evYield_Defense   = ' + evs.def + ',',
        '        .evYield_Speed     = ' + evs.speed + ',',
        '        .evYield_SpAttack  = ' + evs.spAtk + ',',
        '        .evYield_SpDefense = ' + evs.spDef + ',',
        '        .itemCommon = ' + cfg.items[0] + ',',
        '        .itemRare   = ' + cfg.items[1] + ',',
        '        .genderRatio = ' + cfg.genderRatio + ',',
        '        .eggCycles = ' + cfg.eggCycles + ',',
        '        .friendship = ' + cfg.happiness + ',',
        '        .growthRate = ' + cfg.growthRate + ',',
        '        .eggGroups = { ' + cfg.eggGroups[0] + ', ' + cfg.eggGroups[1] + ' },',
        '        .abilities = {' + cfg.abilities[0] + ', ' + cfg.abilities[1] + '},',
        '        .safariZoneFleeRate = ' + cfg.safariZoneFleeRate + ',',
        '        .bodyColor = ' + cfg.bodyColor + ',',
        '        .noFlip = ' + (cfg.noFlip ? 'TRUE' : 'FALSE') + ',',
        '    },',
        ''
    ].join('\n');

    /* Anchor: before [SPECIES_EGG] if present, otherwise before }; */
    content = insertBefore(content, /^\s*\[SPECIES_EGG\]/m, block);
    if (!content) {
        content = readFile(rel);
        content = insertBefore(content, /^\};[\s]*$/m, block);
    }
    if (!content) { errors.push(rel + ': cannot find anchor in species_info.h'); return; }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  4. src/data/pokemon/level_up_learnsets.h                           */
/* ------------------------------------------------------------------ */

function doLevelUpLearnsets() {
    var rel = 'src/data/pokemon/level_up_learnsets.h';
    var content = readFile(rel);
    if (content.indexOf('s' + CAP + 'LevelUpLearnset') !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var lines = ['', 'static const u16 s' + CAP + 'LevelUpLearnset[] = {'];
    cfg.levelUpMoves.forEach(function(pair) {
        lines.push('    LEVEL_UP_MOVE(' + (pair[0] < 10 ? ' ' : '') + pair[0] + ', ' + pair[1] + '),');
    });
    lines.push('    LEVEL_UP_END');
    lines.push('};');
    lines.push('');

    /* Insert before the egg learnset if it exists, otherwise before #endif or end */
    var anchor = /^static const u16 sEggLevelUpLearnset/m;
    if (!anchor.test(content)) {
        /* fallback: insert before end of file */
        content = content.trimEnd() + '\n' + lines.join('\n') + '\n';
    } else {
        content = insertBefore(content, anchor, lines.join('\n'));
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  5. src/data/pokemon/level_up_learnset_pointers.h                   */
/* ------------------------------------------------------------------ */

function doLevelUpLearnsetPointers() {
    var rel = 'src/data/pokemon/level_up_learnset_pointers.h';
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var entry = '    [SPECIES_' + NAME + '] = s' + CAP + 'LevelUpLearnset,\n';
    content = insertBefore(content, /^\s*\[SPECIES_EGG\]/m, entry);
    if (!content) {
        content = readFile(rel);
        content = insertBefore(content, /^\};[\s]*$/m, entry);
    }
    if (!content) { errors.push(rel + ': cannot find anchor in learnset_pointers.h'); return; }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  6. src/data/pokemon/egg_moves.h                                    */
/* ------------------------------------------------------------------ */

function doEggMoves() {
    var rel = 'src/data/pokemon/egg_moves.h';
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }
    if (!cfg.eggMoves || cfg.eggMoves.length === 0) {
        summary.push('[SKIP] ' + rel + ' — no egg moves in config');
        return;
    }

    var lines = [
        '',
        '        EGG_MOVES_SPECIES_OFFSET + SPECIES_' + NAME + ','
    ];
    cfg.eggMoves.forEach(function(move) {
        lines.push('    ' + move + ',');
    });

    /* Insert before closing marker: find the last egg move group end.
       The egg_moves array ends with EGG_MOVES_TERMINATOR or 0xFF.
       Insert before that terminator. */
    var termIdx = content.lastIndexOf('EGG_MOVES_TERMINATOR');
    if (termIdx === -1) {
        /* fallback: try 0xFF or 255 */
        termIdx = content.lastIndexOf('0xFF');
    }
    if (termIdx === -1) {
        /* fallback: insert before }; */
        content = insertBefore(content, /^\};/m, lines.join('\n') + '\n');
    } else {
        /* Insert before the terminator line */
        var lineStart = content.lastIndexOf('\n', termIdx) + 1;
        content = content.slice(0, lineStart) + lines.join('\n') + '\n' + content.slice(lineStart);
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  7. src/data/pokemon/tmhm_learnsets.h                               */
/* ------------------------------------------------------------------ */

function doTmhmLearnsets() {
    var rel = 'src/data/pokemon/tmhm_learnsets.h';
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }
    if (!cfg.tmhm || cfg.tmhm.length === 0) {
        summary.push('[SKIP] ' + rel + ' — no TM/HM moves in config');
        return;
    }

    var moveLines = cfg.tmhm.map(function(move) {
        /* Convert MOVE_TOXIC -> .TOXIC = TRUE */
        var shortName = move.replace('MOVE_', '');
        return '        .' + shortName + ' = TRUE,';
    });

    var block = [
        '',
        '    [SPECIES_' + NAME + '] = { .learnset = {',
    ].concat(moveLines).concat([
        '    } },',
        ''
    ]).join('\n');

    /* Insert before }; at end of the array */
    content = insertBefore(content, /^\};[\s]*$/m, block);
    if (!content) { errors.push(rel + ': cannot find }; anchor'); return; }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  8. src/data/pokemon/evolution.h                                    */
/* ------------------------------------------------------------------ */

function doEvolution() {
    var rel = 'src/data/pokemon/evolution.h';
    if (!cfg.evolution) {
        summary.push('[SKIP] ' + rel + ' — no evolution in config');
        return;
    }
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    /* cfg.evolution = { method: "EVO_LEVEL", param: 38, target: "SPECIES_X" } */
    var evo = cfg.evolution;
    var entry = '    [SPECIES_' + NAME + ']  = {{' + evo.method + ', ' + evo.param + ', ' + evo.target + '}},\n';
    content = insertBefore(content, /^\};/m, entry);
    if (!content) { errors.push(rel + ': cannot find }; anchor'); return; }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  9. src/data/pokemon/pokedex_text.h                                 */
/* ------------------------------------------------------------------ */

function doPokedexText() {
    var rel = 'src/data/pokemon/pokedex_text.h';
    var content = readFile(rel);
    var varName = 'g' + CAP + 'PokedexText';
    if (content.indexOf(varName) !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    if (!dex || !dex.descriptionText) {
        summary.push('[SKIP] ' + rel + ' — no description text in config');
        return;
    }

    /* Split description into lines for pokeemerald format.
       The text uses \\n for line breaks within the .string macro.
       We use _("line1\\n" "line2\\n" ...) format. */
    var descLines = dex.descriptionText.split('\n');
    var formatted = ['', 'const u8 ' + varName + '[] = _('];
    descLines.forEach(function(line, i) {
        var sep = (i < descLines.length - 1) ? '\\n"' : '");';
        formatted.push('    "' + line + sep);
    });
    formatted.push('');

    /* Append at end of file (before any #endif or at EOF) */
    if (content.indexOf('#endif') !== -1) {
        content = insertBefore(content, /#endif/, formatted.join('\n'));
    } else {
        content = content.trimEnd() + '\n' + formatted.join('\n') + '\n';
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  10. src/data/pokemon/pokedex_entries.h                             */
/* ------------------------------------------------------------------ */

function doPokedexEntries() {
    var rel = 'src/data/pokemon/pokedex_entries.h';
    var content = readFile(rel);
    if (content.indexOf('NATIONAL_DEX_' + NAME) !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var block = [
        '',
        '    [NATIONAL_DEX_' + NAME + '] =',
        '    {',
        '        .categoryName = _("' + dex.categoryName + '"),',
        '        .height = ' + dex.height + ',',
        '        .weight = ' + dex.weight + ',',
        '        .description = g' + CAP + 'PokedexText,',
        '        .pokemonScale = ' + dex.pokemonScale + ',',
        '        .pokemonOffset = ' + dex.pokemonOffset + ',',
        '        .trainerScale = ' + dex.trainerScale + ',',
        '        .trainerOffset = ' + dex.trainerOffset + ',',
        '    },',
        ''
    ].join('\n');

    /* Insert before }; */
    content = insertBefore(content, /^\};[\s]*$/m, block);
    if (!content) { errors.push(rel + ': cannot find }; anchor'); return; }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  11. src/data/pokemon/pokedex_orders.h                              */
/* ------------------------------------------------------------------ */

function doPokedexOrders() {
    var rel = 'src/data/pokemon/pokedex_orders.h';
    var content = readFile(rel);
    if (content.indexOf('NATIONAL_DEX_' + NAME) !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var entry = '    NATIONAL_DEX_' + NAME + ',\n';

    /* Alphabetical array: find correct position by name.
       Search for the first entry whose name sorts after ours. */
    var alphaInserted = false;
    var alphaRe = /^(\s*NATIONAL_DEX_)(\w+),/gm;
    var firstArrayEnd = content.indexOf('};');
    var m;
    while ((m = alphaRe.exec(content)) !== null) {
        if (m.index > firstArrayEnd) break;
        var entryName = m[2];
        if (entryName > NAME && entryName !== 'NONE') {
            content = content.slice(0, m.index) + entry + content.slice(m.index);
            alphaInserted = true;
            break;
        }
    }
    if (!alphaInserted) {
        /* Insert before first }; */
        var endIdx = content.indexOf('};');
        content = content.slice(0, endIdx) + entry + content.slice(endIdx);
    }

    /* Weight array: append before its closing }; (second one) */
    var weightArrayStart = content.indexOf('gPokedexOrder_Weight');
    if (weightArrayStart !== -1) {
        var weightEnd = content.indexOf('};', weightArrayStart);
        if (weightEnd !== -1) {
            content = content.slice(0, weightEnd) + entry + content.slice(weightEnd);
        }
    }

    /* Height array: append before its closing }; (third one) */
    var heightArrayStart = content.indexOf('gPokedexOrder_Height');
    if (heightArrayStart !== -1) {
        var heightEnd = content.indexOf('};', heightArrayStart);
        if (heightEnd !== -1) {
            content = content.slice(0, heightEnd) + entry + content.slice(heightEnd);
        }
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  12. src/pokemon.c — 4 table insertions                             */
/* ------------------------------------------------------------------ */

function doPokemonC() {
    var rel = 'src/pokemon.c';
    var content = readFile(rel);
    if (content.indexOf('SPECIES_' + NAME) !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    /* a) sSpeciesToHoennPokedexNum — uses SPECIES_TO_HOENN macro */
    var hoennEntry = '    SPECIES_TO_HOENN(' + NAME + '),\n';
    /* Find the table by looking for the first SPECIES_TO_HOENN, then insert before SPECIES_EGG or before }; */
    var hoennTableEnd = content.indexOf('};', content.indexOf('SPECIES_TO_HOENN'));
    if (hoennTableEnd !== -1) {
        content = content.slice(0, hoennTableEnd) + hoennEntry + content.slice(hoennTableEnd);
    }

    /* b) sSpeciesToNationalPokedexNum — uses SPECIES_TO_NATIONAL macro */
    var natEntry = '    SPECIES_TO_NATIONAL(' + NAME + '),\n';
    var natTableEnd = content.indexOf('};', content.indexOf('SPECIES_TO_NATIONAL'));
    if (natTableEnd !== -1) {
        content = content.slice(0, natTableEnd) + natEntry + content.slice(natTableEnd);
    }

    /* c) sHoennToNationalOrder — uses HOENN_TO_NATIONAL macro */
    var h2nEntry = '    HOENN_TO_NATIONAL(' + NAME + '),\n';
    var h2nTableEnd = content.indexOf('};', content.indexOf('HOENN_TO_NATIONAL'));
    if (h2nTableEnd !== -1) {
        content = content.slice(0, h2nTableEnd) + h2nEntry + content.slice(h2nTableEnd);
    }

    /* d) sMonFrontAnimIdTable — animation type */
    var animType = cfg.animType || 'ANIM_V_SQUISH_AND_BOUNCE';
    var animEntry = '    [SPECIES_' + NAME + ' - 1] = ' + animType + ',\n';
    /* Insert before }; of sMonFrontAnimIdTable (find it by the array declaration) */
    var animTableStart = content.indexOf('sMonFrontAnimIdTable');
    if (animTableStart !== -1) {
        var animTableEnd = content.indexOf('};', animTableStart);
        if (animTableEnd !== -1) {
            content = content.slice(0, animTableEnd) + animEntry + content.slice(animTableEnd);
        }
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  13. src/data/graphics/pokemon.h — INCBIN lines                     */
/* ------------------------------------------------------------------ */

function doGraphicsPokemonH() {
    var rel = 'src/data/graphics/pokemon.h';
    var content = readFile(rel);
    if (content.indexOf(CAP) !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var block = [
        '',
        'const u32 gMonStillFrontPic_' + CAP + '[] = INCBIN_U32("graphics/pokemon/' + LOWER + '/front.4bpp.lz");',
        'const u32 gMonPalette_' + CAP + '[] = INCBIN_U32("graphics/pokemon/' + LOWER + '/normal.gbapal.lz");',
        'const u32 gMonBackPic_' + CAP + '[] = INCBIN_U32("graphics/pokemon/' + LOWER + '/back.4bpp.lz");',
        'const u32 gMonShinyPalette_' + CAP + '[] = INCBIN_U32("graphics/pokemon/' + LOWER + '/shiny.gbapal.lz");',
        'const u8 gMonIcon_' + CAP + '[] = INCBIN_U8("graphics/pokemon/' + LOWER + '/icon.4bpp");',
        'const u8 gMonFootprint_' + CAP + '[] = INCBIN_U8("graphics/pokemon/' + LOWER + '/footprint.1bpp");',
        ''
    ].join('\n');

    /* Insert before EGG section or at end */
    var eggIdx = content.indexOf('gMonStillFrontPic_Egg');
    if (eggIdx === -1) eggIdx = content.indexOf('gMonFrontPic_Egg');
    if (eggIdx !== -1) {
        /* Find start of the egg block (the blank line before it) */
        var lineStart = content.lastIndexOf('\n', eggIdx);
        /* Go back one more line to find the blank separator */
        var prevLine = content.lastIndexOf('\n', lineStart - 1);
        content = content.slice(0, lineStart + 1) + block + content.slice(lineStart + 1);
    } else {
        content = content.trimEnd() + '\n' + block + '\n';
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  14. src/anim_mon_front_pics.c — animated front pic INCBIN          */
/* ------------------------------------------------------------------ */

function doAnimFrontPics() {
    var rel = 'src/anim_mon_front_pics.c';
    var content = readFile(rel);
    if (content.indexOf(CAP) !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var line = 'const u32 gMonFrontPic_' + CAP + '[] = INCBIN_U32("graphics/pokemon/' + LOWER + '/anim_front.4bpp.lz");\n';

    /* Insert before EGG line or at end */
    var eggRe = /^const u32 gMonFrontPic_Egg/m;
    if (eggRe.test(content)) {
        content = insertBefore(content, eggRe, line);
    } else {
        content = content.trimEnd() + '\n' + line;
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  15. include/graphics.h — extern declarations                       */
/* ------------------------------------------------------------------ */

function doGraphicsExterns() {
    var rel = 'include/graphics.h';
    var content = readFile(rel);
    if (content.indexOf(CAP) !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var block = [
        'extern const u32 gMonFrontPic_' + CAP + '[];',
        'extern const u32 gMonPalette_' + CAP + '[];',
        'extern const u32 gMonBackPic_' + CAP + '[];',
        'extern const u32 gMonShinyPalette_' + CAP + '[];',
        'extern const u32 gMonStillFrontPic_' + CAP + '[];',
        'extern const u8 gMonIcon_' + CAP + '[];',
        'extern const u8 gMonFootprint_' + CAP + '[];',
        ''
    ].join('\n');

    /* Insert before egg externs or at end */
    var eggRe = /^extern const u32 gMonFrontPic_Egg/m;
    if (eggRe.test(content)) {
        content = insertBefore(content, eggRe, block);
    } else {
        content = content.trimEnd() + '\n' + block + '\n';
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  16-23. Graphics tables (8 files, all insert before SPECIES_EGG)    */
/* ------------------------------------------------------------------ */

function doGraphicsTable(rel, entryGenerator) {
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var entry = entryGenerator();

    /* Try multiple EGG anchor patterns used across different table formats */
    var anchors = [
        /^\s*\[SPECIES_EGG\]/m,
        /^\s*SPECIES_SPRITE\(EGG/m,
        /^\s*SPECIES_PAL\(EGG/m,
        /^\s*SPECIES_SHINY_PAL\(EGG/m
    ];

    var result = null;
    for (var i = 0; i < anchors.length; i++) {
        result = insertBefore(content, anchors[i], entry);
        if (result) break;
    }

    if (!result) { errors.push(rel + ': cannot find EGG anchor'); return; }
    writeFile(rel, result);
}

function doAllGraphicsTables() {
    /* front_pic_table.h */
    doGraphicsTable('src/data/pokemon_graphics/front_pic_table.h', function() {
        return '    SPECIES_SPRITE(' + NAME + ', gMonFrontPic_' + CAP + '),\n';
    });

    /* back_pic_table.h */
    doGraphicsTable('src/data/pokemon_graphics/back_pic_table.h', function() {
        return '    SPECIES_SPRITE(' + NAME + ', gMonBackPic_' + CAP + '),\n';
    });

    /* still_front_pic_table.h */
    doGraphicsTable('src/data/pokemon_graphics/still_front_pic_table.h', function() {
        return '    SPECIES_SPRITE(' + NAME + ', gMonStillFrontPic_' + CAP + '),\n';
    });

    /* palette_table.h */
    doGraphicsTable('src/data/pokemon_graphics/palette_table.h', function() {
        return '    SPECIES_PAL(' + NAME + ', gMonPalette_' + CAP + '),\n';
    });

    /* shiny_palette_table.h */
    doGraphicsTable('src/data/pokemon_graphics/shiny_palette_table.h', function() {
        return '    SPECIES_SHINY_PAL(' + NAME + ', gMonShinyPalette_' + CAP + '),\n';
    });

    /* front_pic_coordinates.h */
    doGraphicsTable('src/data/pokemon_graphics/front_pic_coordinates.h', function() {
        return '    [SPECIES_' + NAME + '] = { .size = ' + cfg.frontPicSize + ', .y_offset = ' + cfg.frontPicYOffset + ' },\n';
    });

    /* back_pic_coordinates.h */
    doGraphicsTable('src/data/pokemon_graphics/back_pic_coordinates.h', function() {
        return '    [SPECIES_' + NAME + '] = { .size = ' + cfg.backPicSize + ', .y_offset = ' + cfg.backPicYOffset + ' },\n';
    });

    /* footprint_table.h */
    doGraphicsTable('src/data/pokemon_graphics/footprint_table.h', function() {
        return '    [SPECIES_' + NAME + '] = gMonFootprint_' + CAP + ',\n';
    });
}

/* ------------------------------------------------------------------ */
/*  24. src/data/pokemon_graphics/front_pic_anims.h — 3 insertions     */
/* ------------------------------------------------------------------ */

function doFrontPicAnims() {
    var rel = 'src/data/pokemon_graphics/front_pic_anims.h';
    var content = readFile(rel);
    if (content.indexOf('sAnim_' + CAP + '_1') !== -1) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var frames = cfg.animFrames || 32;
    var delay = cfg.animDelay || 15;

    /* a) AnimCmd array — insert before #define SINGLE_ANIMATION */
    var animBlock = [
        '',
        'static const union AnimCmd sAnim_' + CAP + '_1[] =',
        '{',
        '    ANIMCMD_FRAME(0, ' + delay + '),',
        '    ANIMCMD_FRAME(1, ' + delay + '),',
        '    ANIMCMD_FRAME(0, ' + delay + '),',
        '    ANIMCMD_END,',
        '};',
        ''
    ].join('\n');

    content = insertBefore(content, /^#define SINGLE_ANIMATION/m, animBlock);
    if (!content) { errors.push(rel + ': cannot find SINGLE_ANIMATION macro'); return; }

    /* b) SINGLE_ANIMATION macro call — insert before gMonFrontAnimsPtrTable declaration */
    var singleAnimLine = 'SINGLE_ANIMATION(' + CAP + ');\n';
    content = insertBefore(content, /^const union AnimCmd \*const \*const gMonFrontAnimsPtrTable/m, singleAnimLine);
    if (!content) {
        errors.push(rel + ': cannot find gMonFrontAnimsPtrTable anchor');
        return;
    }

    /* c) Pointer table entry — insert before [SPECIES_EGG] */
    var ptrEntry = '    [SPECIES_' + NAME + '] = sAnims_' + CAP + ',\n';
    var ptrResult = insertBefore(content, /^\s*\[SPECIES_EGG\]/m, ptrEntry);
    if (!ptrResult) {
        /* Fallback: insert before }; of the table */
        var tableStart = content.lastIndexOf('gMonFrontAnimsPtrTable');
        var tableEnd = content.indexOf('};', tableStart);
        if (tableEnd !== -1) {
            content = content.slice(0, tableEnd) + ptrEntry + content.slice(tableEnd);
        } else {
            errors.push(rel + ': cannot find [SPECIES_EGG] or }; in ptr table');
            return;
        }
    } else {
        content = ptrResult;
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  25. src/pokemon_icon.c — 2 insertions                              */
/* ------------------------------------------------------------------ */

function doPokemonIcon() {
    var rel = 'src/pokemon_icon.c';
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var iconIdx = cfg.iconPaletteIndex != null ? cfg.iconPaletteIndex : 0;

    /* a) gMonIconTable — insert before [SPECIES_EGG] */
    var iconEntry = '    [SPECIES_' + NAME + '] = gMonIcon_' + CAP + ',\n';
    content = insertBefore(content, /^\s*\[SPECIES_EGG\]\s*=\s*gMonIcon_Egg/m, iconEntry);
    if (!content) { errors.push(rel + ': cannot find [SPECIES_EGG] in gMonIconTable'); return; }

    /* b) gMonIconPaletteIndices — insert before [SPECIES_EGG] (second table) */
    var palEntry = '    [SPECIES_' + NAME + '] = ' + iconIdx + ',\n';
    /* Find the second SPECIES_EGG (in palette indices table) */
    var firstEgg = content.indexOf('[SPECIES_EGG]');
    var secondEgg = content.indexOf('[SPECIES_EGG]', firstEgg + 1);
    if (secondEgg !== -1) {
        /* Find start of that line */
        var lineStart = content.lastIndexOf('\n', secondEgg) + 1;
        content = content.slice(0, lineStart) + palEntry + content.slice(lineStart);
    } else {
        warnings.push(rel + ': could not find second [SPECIES_EGG] for palette indices');
    }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  26. sound/cry_tables.inc — 2 insertions                            */
/* ------------------------------------------------------------------ */

function doCryTables() {
    var rel = 'sound/cry_tables.inc';
    var content = readFile(rel);

    /* Idempotency: check if species already exists in the ORIGINAL species.h
       (read before any modifications). If the species is already registered,
       its cry entry must already be in the table. */
    if (originalSpeciesH.indexOf('SPECIES_' + NAME) !== -1) {
        summary.push('[SKIP] ' + rel + ' — SPECIES_' + NAME + ' already in species.h');
        return;
    }

    /* Forward table: insert before .align 2 / gCryTable_Reverse:: */
    var cryLine = '\tcry Cry_' + CRY + '\n';
    content = insertBefore(content, /^\s*\.align 2/m, cryLine);
    if (!content) { errors.push(rel + ': cannot find .align 2 anchor'); return; }

    /* Reverse table: append at end */
    var cryReverseLine = '\tcry_reverse Cry_' + CRY + '\n';
    content = content.trimEnd() + '\n' + cryReverseLine;

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  27. enemy_mon_elevation.h (only if elevation > 0)                  */
/* ------------------------------------------------------------------ */

function doEnemyElevation() {
    var rel = 'src/data/pokemon_graphics/enemy_mon_elevation.h';
    if (!cfg.elevation || cfg.elevation === 0) {
        summary.push('[SKIP] ' + rel + ' — elevation is 0');
        return;
    }
    var content = readFile(rel);
    if (alreadyExists(content, NAME)) {
        summary.push('[SKIP] ' + rel + ' — already exists');
        return;
    }

    var entry = '    [SPECIES_' + NAME + '] = ' + cfg.elevation + ',\n';
    content = insertBefore(content, /^\};/m, entry);
    if (!content) { errors.push(rel + ': cannot find }; anchor'); return; }

    writeFile(rel, content);
}

/* ------------------------------------------------------------------ */
/*  Pre-read original species.h (before any modifications)             */
/* ------------------------------------------------------------------ */

var originalSpeciesH = readFile('include/constants/species.h');

/* ------------------------------------------------------------------ */
/*  Execute all insertions                                             */
/* ------------------------------------------------------------------ */

console.log('=== add_regional_form.cjs ===');
console.log('Species: ' + NAME + ' (' + CAP + ')');
console.log('Mode: ' + (dryRun ? 'DRY RUN' : 'LIVE'));
console.log('');

doSpeciesH();
doPokedexH();
doSpeciesInfo();
doLevelUpLearnsets();
doLevelUpLearnsetPointers();
doEggMoves();
doTmhmLearnsets();
doEvolution();
doPokedexText();
doPokedexEntries();
doPokedexOrders();
doPokemonC();
doGraphicsPokemonH();
doAnimFrontPics();
doGraphicsExterns();
doAllGraphicsTables();
doFrontPicAnims();
doPokemonIcon();
doCryTables();
doEnemyElevation();

/* ------------------------------------------------------------------ */
/*  Report                                                             */
/* ------------------------------------------------------------------ */

console.log('--- Summary ---');
summary.forEach(function(s) { console.log('  ' + s); });

if (warnings.length > 0) {
    console.log('');
    console.log('--- Warnings ---');
    warnings.forEach(function(w) { console.log('  [WARN] ' + w); });
}

if (errors.length > 0) {
    console.log('');
    console.log('--- Errors ---');
    errors.forEach(function(e) { console.log('  [ERROR] ' + e); });
    process.exit(1);
}

console.log('');
console.log('Done. ' + summary.filter(function(s) { return s.indexOf('Modified') === 0; }).length + ' files modified, ' +
    summary.filter(function(s) { return s.indexOf('[SKIP]') === 0; }).length + ' skipped.');
