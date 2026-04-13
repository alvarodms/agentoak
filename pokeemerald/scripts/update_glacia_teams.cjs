#!/usr/bin/env node
/* C213: Rewrite Glacia's 5 teams (main + 4 rematches) */

var fs = require('fs');
var path = require('path');
var file = path.resolve(__dirname, '..', 'src', 'data', 'trainer_parties.h');
var c = fs.readFileSync(file, 'utf8');

/* ================================================================ */
/* Main team — 5 members                                             */
/* ================================================================ */
var mainTeam =
'static const struct TrainerMonItemCustomMoves sParty_Glacia[] = {\n' +
'    {\n' +
'    .iv = 250,\n' +
'    .lvl = 48,\n' +
'    .species = SPECIES_JYNX,\n' +
'    .heldItem = ITEM_LUM_BERRY,\n' +
'    .moves = {MOVE_LOVELY_KISS, MOVE_ICE_BEAM, MOVE_PSYCHIC, MOVE_FAKE_TEARS}\n' +
'    },\n' +
'    {\n' +
'    .iv = 250,\n' +
'    .lvl = 49,\n' +
'    .species = SPECIES_CLOYSTER,\n' +
'    .heldItem = ITEM_SITRUS_BERRY,\n' +
'    .moves = {MOVE_SPIKES, MOVE_SURF, MOVE_ICE_BEAM, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 250,\n' +
'    .lvl = 50,\n' +
'    .species = SPECIES_MAMOSWINE,\n' +
'    .heldItem = ITEM_CHOICE_BAND,\n' +
'    .moves = {MOVE_EARTHQUAKE, MOVE_ICE_SHARD, MOVE_ROCK_SLIDE, MOVE_BODY_SLAM}\n' +
'    },\n' +
'    {\n' +
'    .iv = 250,\n' +
'    .lvl = 51,\n' +
'    .species = SPECIES_WALREIN,\n' +
'    .heldItem = ITEM_LEFTOVERS,\n' +
'    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_TOXIC, MOVE_SHEER_COLD}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 52,\n' +
'    .species = SPECIES_FROSLASS,\n' +
'    .heldItem = ITEM_FOCUS_BAND,\n' +
'    .moves = {MOVE_SHADOW_BALL, MOVE_ICE_BEAM, MOVE_THUNDERBOLT, MOVE_DESTINY_BOND}\n' +
'    }\n' +
'};\n';

/* ================================================================ */
/* Rematch 1 — 6 members                                             */
/* ================================================================ */
var rematch1 =
'static const struct TrainerMonItemCustomMoves sParty_GlaciaRematch1[] = {\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 62,\n' +
'    .species = SPECIES_GLALIE,\n' +
'    .heldItem = ITEM_SALAC_BERRY,\n' +
'    .moves = {MOVE_ICE_BEAM, MOVE_SHADOW_BALL, MOVE_EARTHQUAKE, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 63,\n' +
'    .species = SPECIES_JYNX,\n' +
'    .heldItem = ITEM_LUM_BERRY,\n' +
'    .moves = {MOVE_LOVELY_KISS, MOVE_ICE_BEAM, MOVE_PSYCHIC, MOVE_CALM_MIND}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 65,\n' +
'    .species = SPECIES_CLOYSTER,\n' +
'    .heldItem = ITEM_SITRUS_BERRY,\n' +
'    .moves = {MOVE_SPIKES, MOVE_SURF, MOVE_ICE_BEAM, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 67,\n' +
'    .species = SPECIES_MAMOSWINE,\n' +
'    .heldItem = ITEM_CHOICE_BAND,\n' +
'    .moves = {MOVE_EARTHQUAKE, MOVE_ICE_SHARD, MOVE_STONE_EDGE, MOVE_BODY_SLAM}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 68,\n' +
'    .species = SPECIES_WALREIN,\n' +
'    .heldItem = ITEM_LEFTOVERS,\n' +
'    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_TOXIC, MOVE_SHEER_COLD}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 70,\n' +
'    .species = SPECIES_FROSLASS,\n' +
'    .heldItem = ITEM_FOCUS_BAND,\n' +
'    .moves = {MOVE_SHADOW_BALL, MOVE_ICE_BEAM, MOVE_THUNDERBOLT, MOVE_DESTINY_BOND}\n' +
'    }\n' +
'};\n';

/* ================================================================ */
/* Rematch 2 — 6 members (same roster, higher levels)                */
/* ================================================================ */
var rematch2 =
'static const struct TrainerMonItemCustomMoves sParty_GlaciaRematch2[] = {\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 66,\n' +
'    .species = SPECIES_GLALIE,\n' +
'    .heldItem = ITEM_SALAC_BERRY,\n' +
'    .moves = {MOVE_ICE_BEAM, MOVE_SHADOW_BALL, MOVE_EARTHQUAKE, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 67,\n' +
'    .species = SPECIES_JYNX,\n' +
'    .heldItem = ITEM_LUM_BERRY,\n' +
'    .moves = {MOVE_LOVELY_KISS, MOVE_ICE_BEAM, MOVE_PSYCHIC, MOVE_CALM_MIND}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 69,\n' +
'    .species = SPECIES_CLOYSTER,\n' +
'    .heldItem = ITEM_SITRUS_BERRY,\n' +
'    .moves = {MOVE_SPIKES, MOVE_SURF, MOVE_ICE_BEAM, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 71,\n' +
'    .species = SPECIES_MAMOSWINE,\n' +
'    .heldItem = ITEM_CHOICE_BAND,\n' +
'    .moves = {MOVE_EARTHQUAKE, MOVE_ICE_SHARD, MOVE_STONE_EDGE, MOVE_BODY_SLAM}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 72,\n' +
'    .species = SPECIES_WALREIN,\n' +
'    .heldItem = ITEM_LEFTOVERS,\n' +
'    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_TOXIC, MOVE_SHEER_COLD}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 74,\n' +
'    .species = SPECIES_FROSLASS,\n' +
'    .heldItem = ITEM_FOCUS_BAND,\n' +
'    .moves = {MOVE_SHADOW_BALL, MOVE_ICE_BEAM, MOVE_THUNDERBOLT, MOVE_DESTINY_BOND}\n' +
'    }\n' +
'};\n';

/* ================================================================ */
/* Rematch 3 — 6 members                                             */
/* ================================================================ */
var rematch3 =
'static const struct TrainerMonItemCustomMoves sParty_GlaciaRematch3[] = {\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 70,\n' +
'    .species = SPECIES_GLALIE,\n' +
'    .heldItem = ITEM_SALAC_BERRY,\n' +
'    .moves = {MOVE_ICE_BEAM, MOVE_SHADOW_BALL, MOVE_EARTHQUAKE, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 71,\n' +
'    .species = SPECIES_JYNX,\n' +
'    .heldItem = ITEM_LUM_BERRY,\n' +
'    .moves = {MOVE_LOVELY_KISS, MOVE_ICE_BEAM, MOVE_PSYCHIC, MOVE_CALM_MIND}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 73,\n' +
'    .species = SPECIES_CLOYSTER,\n' +
'    .heldItem = ITEM_SITRUS_BERRY,\n' +
'    .moves = {MOVE_SPIKES, MOVE_SURF, MOVE_ICE_BEAM, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 75,\n' +
'    .species = SPECIES_MAMOSWINE,\n' +
'    .heldItem = ITEM_CHOICE_BAND,\n' +
'    .moves = {MOVE_EARTHQUAKE, MOVE_ICE_SHARD, MOVE_STONE_EDGE, MOVE_BODY_SLAM}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 76,\n' +
'    .species = SPECIES_WALREIN,\n' +
'    .heldItem = ITEM_LEFTOVERS,\n' +
'    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_TOXIC, MOVE_SHEER_COLD}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 78,\n' +
'    .species = SPECIES_FROSLASS,\n' +
'    .heldItem = ITEM_FOCUS_BAND,\n' +
'    .moves = {MOVE_SHADOW_BALL, MOVE_ICE_BEAM, MOVE_THUNDERBOLT, MOVE_DESTINY_BOND}\n' +
'    }\n' +
'};\n';

/* ================================================================ */
/* Rematch 4 — 6 members                                             */
/* ================================================================ */
var rematch4 =
'static const struct TrainerMonItemCustomMoves sParty_GlaciaRematch4[] = {\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 74,\n' +
'    .species = SPECIES_GLALIE,\n' +
'    .heldItem = ITEM_SALAC_BERRY,\n' +
'    .moves = {MOVE_ICE_BEAM, MOVE_SHADOW_BALL, MOVE_EARTHQUAKE, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 75,\n' +
'    .species = SPECIES_JYNX,\n' +
'    .heldItem = ITEM_LUM_BERRY,\n' +
'    .moves = {MOVE_LOVELY_KISS, MOVE_ICE_BEAM, MOVE_PSYCHIC, MOVE_CALM_MIND}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 77,\n' +
'    .species = SPECIES_CLOYSTER,\n' +
'    .heldItem = ITEM_SITRUS_BERRY,\n' +
'    .moves = {MOVE_SPIKES, MOVE_SURF, MOVE_ICE_BEAM, MOVE_EXPLOSION}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 79,\n' +
'    .species = SPECIES_MAMOSWINE,\n' +
'    .heldItem = ITEM_CHOICE_BAND,\n' +
'    .moves = {MOVE_EARTHQUAKE, MOVE_ICE_SHARD, MOVE_STONE_EDGE, MOVE_BODY_SLAM}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 80,\n' +
'    .species = SPECIES_WALREIN,\n' +
'    .heldItem = ITEM_LEFTOVERS,\n' +
'    .moves = {MOVE_SURF, MOVE_ICE_BEAM, MOVE_TOXIC, MOVE_SHEER_COLD}\n' +
'    },\n' +
'    {\n' +
'    .iv = 255,\n' +
'    .lvl = 82,\n' +
'    .species = SPECIES_FROSLASS,\n' +
'    .heldItem = ITEM_FOCUS_BAND,\n' +
'    .moves = {MOVE_SHADOW_BALL, MOVE_ICE_BEAM, MOVE_THUNDERBOLT, MOVE_DESTINY_BOND}\n' +
'    }\n' +
'};\n';

/* ================================================================ */
/* Replace each team                                                  */
/* ================================================================ */

function replaceTeam(content, name, newTeam) {
    var start = content.indexOf('static const struct TrainerMonItemCustomMoves ' + name + '[]');
    if (start === -1) {
        console.error('ERROR: Could not find ' + name);
        process.exit(1);
    }
    var end = content.indexOf('};\n', start);
    if (end === -1) {
        console.error('ERROR: Could not find end of ' + name);
        process.exit(1);
    }
    end += 3; /* include };\n */
    return content.slice(0, start) + newTeam + content.slice(end);
}

c = replaceTeam(c, 'sParty_Glacia', mainTeam);
c = replaceTeam(c, 'sParty_GlaciaRematch1', rematch1);
c = replaceTeam(c, 'sParty_GlaciaRematch2', rematch2);
c = replaceTeam(c, 'sParty_GlaciaRematch3', rematch3);
c = replaceTeam(c, 'sParty_GlaciaRematch4', rematch4);

fs.writeFileSync(file, c, 'utf8');
console.log('OK: All 5 Glacia teams updated');
