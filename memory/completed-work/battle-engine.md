# Battle Engine

> Collapsed C310 maintenance. Older per-file tables live in git history.

## Foundations (summary)

- **P/S split (C43)**: `include/pokemon.h` (MOVE_CATEGORY_*, `.category`), `include/battle.h` (IS_MOVE_PHYSICAL/SPECIAL/STATUS), `src/pokemon.c` damage calc by category, `battle_script_commands.c` (Hustle/Counter/Mirror Coat), `battle_tv.c`, `.category` on every move in `battle_moves.h`.
- **Fairy type (C44/46/52)**: TYPE_FAIRY=18 in `constants/pokemon.h`; type chart in `battle_main.c` (gTypeEffectiveness[372]); `battle_message.c`, `pokemon_summary_screen.c`, `pokedex.c`, `menu.c`, `union_room.h`, `graphics_file_rules.mk`; `graphics/types/fairy.png` is a placeholder copy (has gone missing twice — check if build complains). 14 species retyped (Clefairy line, Snubbull line, Jigglypuff line, Azurill, Marill line, Mawile, Ralts line, Togetic). Moonblast/Play Rough/Dazzling Gleam = moves 355-357.
- **Gen 4/5 moves (C129)**: IDs 358-377 across moves.h, battle_moves.h, move_names.h, move_descriptions.h, contest_moves.h.
- **Challenge Mode (C181/182/207)**: `battle_main.c` SET-style override; FLAG_DIFFICULTY_CHALLENGE 0x286 + IsChallengeModeActive() in flags.h; MULTI_DIFFICULTY_SELECT=114; `GetChallengeLevelCap()` + soft cap in Cmd_getexp; STRINGID_PKMNGAINEDEXPCAPPED=381.
- **Battle animations (C297)**: `data/battle_anim_scripts.s` Move_IRON_LEAF / Move_SPORE_FIST / Move_TIDAL_FLARE; gBattleAnims_Moves extended to 381 entries (355-377 padded Move_COUNT).

## Custom Abilities

| Ability | ID | Cycle | Holder (slot) | Hook | Effect |
|---|---|---|---|---|---|
| TOXIC TOUCH | 78 | 241 | Deoxys_Hoenn (0) | `battle_util.c` ABILITYEFFECT_ON_DAMAGE | 30% poison on any damaging move |
| FROZEN SPORE | 79 | 289 | Breloom_Hoenn (0) | same, after Toxic Touch | 20% freeze, contact only |
| SCALDING TOUCH | 80 | 289 | Arcanine_Hoenn (1) | same, after Frozen Spore | 33% burn, contact only |
| TEMPERED BLADE | 81 | 300 | Treecko/Grovyle/Sceptile_Hoenn (0) | `battle_script_commands.c` Cmd_critcalc | +1 crit on Steel contact moves |
| FEY FLAME | 82 | 310 | Torchic/Combusken/Blaziken_Hoenn (0), Blaze slot 1 | `pokemon.c` CalculateBaseDamage + switch-in msg | 1.5x power vs burned target, any move |

Every ability touches `include/constants/abilities.h` (ID + ABILITIES_COUNT), `src/data/text/abilities.h` (description string, gAbilityNames, gAbilityDescriptionPointers), `species_info.h`. C289 raised ABILITY_NAME_LENGTH 12→14 in `include/constants/global.h`.

### Fey Flame (C310) — template for damage-multiplier + switch-in announcement

| File | What Changed |
|---|---|
| `src/pokemon.c` | CalculateBaseDamage: `if (attacker->ability == ABILITY_FEY_FLAME && (defender->status1 & STATUS1_BURN))` 1.5x gBattleMovePower, right after the Blaze pinch line |
| `include/constants/battle_string_ids.h` | STRINGID_FEYFLAMEACTIVATES=382, BATTLESTRINGS_COUNT→383 |
| `src/battle_message.c` | sText_FeyFlameActivates ({B_SCR_ACTIVE_NAME_WITH_PREFIX}) + gBattleStringsTable entry |
| `data/battle_scripts_1.s` + `include/battle_scripts.h` | BattleScript_FeyFlameActivates (pause/printstring/waitmessage/end3) after SandstreamActivates + extern |
| `src/battle_util.c` | AbilityBattleEffects ON_SWITCHIN case after DROUGHT: push script, set gBattleScripting.battler, effect++ (no guard — re-announces each switch-in) |
| `src/data/trainer_parties.h` | Brendan/May PostgameTreecko Blaziken_Hoenn: Shadow Ball → Will-O-Wisp |
| `scripts/check_species_registration.sh` | Removed false-positive `sound/cry_tables.inc` check (uses Cry_ labels); validator 18/18 |

Built and VERIFIED C310. Not playtested in-emulator yet.

## Signature Moves

| Move | ID | Cycle | Stats | Learner |
|---|---|---|---|---|
| SPORE FIST | 378 | 290 | Ice/Phys 75bp 100acc, 10% freeze (EFFECT_FREEZE_HIT), contact | Breloom_Hoenn L36 |
| TIDAL FLARE | 379 | 290 | Water/Spec 85bp 100acc, 30% burn (EFFECT_BURN_HIT) | Arcanine_Hoenn L45 |
| IRON LEAF | 380 | 293/300 | Steel/Phys 85bp, EFFECT_HIGH_CRITICAL (C300), contact | Sceptile_Hoenn L29 |

Each move = 6 files: moves.h, battle_moves.h, move_names.h, move_descriptions.h, contest_moves.h, level_up_learnsets.h (+ battle_anim_scripts.s for animation).

## Ability Reassignments (summary)

- **C288 Tier 2 pass** (`species_info.h` only): Corsola_H Levitate, Bagon_H Sturdy, Pinsir_H Guts, Gligar/Gliscor_H Swift Swim, Stantler_H Effect Spore, Vulpix/Ninetales_H Natural Cure.
- **C289 build fix**: removed orphan Mudkip_Hoenn line species_info entries lacking SPECIES_ constants (later properly registered C292).
