# Battle Engine

Physical/Special Split and Fairy Type implementations (v2.0).

---

## Physical/Special Split

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `include/pokemon.h` | Added MOVE_CATEGORY_* defines + `u8 category` to BattleMove struct | 43 | Foundation for P/S split |
| `include/battle.h` | Added IS_MOVE_PHYSICAL/SPECIAL/STATUS macros | 43 | Move-based category checks |
| `src/pokemon.c` | Rewrote damage calc to use move category instead of type | 43 | Weather/Flash Fire moved outside special branch; Thick Fat halves power |
| `src/battle_script_commands.c` | Hustle + Counter/Mirror Coat use move category | 43 | 3 instances updated |
| `src/battle_tv.c` | Reflect/Light Screen checks use move category | 43 | 2 instances updated |
| `src/data/battle_moves.h` | Added .category to all 355 moves | 43 | Gen IV categories from Kateulator's pokeemerald-physpe |

## Fairy Type

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `include/constants/pokemon.h` | Added TYPE_FAIRY = 18, NUMBER_OF_MON_TYPES = 19 | 44 | Foundation constant |
| `include/battle_main.h` | Updated gTypeEffectiveness extern to [372] | 44 | Matches new array size |
| `src/battle_main.c` | Added Fairy to gTypeNames, 12 type effectiveness entries, array size 336→372 | 44 | Full type chart: SE vs Fight/Dragon/Dark, NVE vs Fire/Poison/Steel, immune from Dragon |
| `src/battle_message.c` | Added "a FAIRY move" to sATypeMove_Table | 44 | Battle message support |
| `src/pokemon_summary_screen.c` | Added Fairy sprite anim, anim table entry, palette mapping (14) | 44 | Uses Psychic icon as placeholder |
| `src/pokedex.c` | Added Fairy to sDexSearchTypeOptions and sDexSearchTypeIds | 44 | Searchable in Pokedex |
| `src/menu.c` | Added TYPE_FAIRY + 1 entry to sMenuInfoIcons | 44 | Uses Psychic offset as placeholder |
| `src/data/union_room.h` | Added Fairy to sTradingBoardTypes | 44 | Union Room trade board |
| `graphics_file_rules.mk` | Added "fairy" to types list | 44 | Builds fairy.4bpp into spritesheet |
| `graphics/types/fairy.png` | Created (copy of psychic.png as placeholder) | 44 | Custom icon is future work |
| `src/data/pokemon/species_info.h` | Retyped 14 species to Fairy | 31, 32, **44** | See retypes list below |
| `include/constants/moves.h` | Added 3 Fairy move constants (355-357), MOVES_COUNT = 358 | **46** | MOVE_MOONBLAST, MOVE_PLAY_ROUGH, MOVE_DAZZLING_GLEAM (Cycle 45 was reverted) |
| `src/data/battle_moves.h` | Added 3 Fairy move definitions | **46** | Moonblast (95bp Sp, 30% SpA drop), Play Rough (90bp Ph, 10% Atk drop), Dazzling Gleam (80bp Sp, hits both) |
| `src/data/contest_moves.h` | Added 3 Fairy contest move entries | **46** | Beauty/Cute categories |
| `src/data/text/move_descriptions.h` | Added 3 move descriptions + pointer table entries | **46** | String defs + gMoveDescriptionPointers entries |
| `src/data/text/move_names.h` | Added 3 move names to gMoveNames | **46** | MOONBLAST, PLAY ROUGH, DAZZLNGLEAM |
| `src/data/pokemon/level_up_learnsets.h` | Added Fairy moves to 13 species learnsets | **46** | Ralts/Kirlia/Gardevoir, Clefairy/Clefable, Jigglypuff/Wigglytuff, Togetic, Marill/Azumarill, Snubbull/Granbull, Mawile |
| `graphics/types/fairy.png` | Recreated placeholder (copy of psychic.png) | **46** | Lost between cycles, needed for build |
| `graphics/types/fairy.png` | Restored placeholder (copy of normal.png) | **52** | Missing again, copied from normal.png to fix build |

### Species Retypes (Cycle 44)

- Pure Fairy: Clefairy, Clefable, Snubbull, Granbull
- Normal/Fairy: Jigglypuff, Wigglytuff, Azurill
- Water/Fairy: Marill, Azumarill
- Steel/Fairy: Mawile
- Psychic/Fairy: Ralts, Kirlia, Gardevoir
- Fairy/Flying: Togetic

### Fairy Moves (Cycle 46 — Cycle 45 was reverted)

- **Moonblast**: 95 power, Special, 30% chance to lower Special Attack
- **Play Rough**: 90 power, Physical, 10% chance to lower Attack (FLAG_MAKES_CONTACT)
- **Dazzling Gleam**: 80 power, Special, hits both opponents (MOVE_TARGET_BOTH)

## Gen 4/5 Move Additions (Cycle 129)

Added 20 moves (IDs 358-377, MOVES_COUNT = 378) across 5 files: `moves.h`, `battle_moves.h`, `move_names.h`, `move_descriptions.h`, `contest_moves.h`. Includes Night Slash, Brave Bird, Flare Blitz, Stone Edge, Dragon Pulse, Close Combat, Aqua Tail, Aura Sphere, Sucker Punch, Wild Charge, X-Scissor, Poison Jab, Ice Shard, Energy Ball, Shadow Claw, Flash Cannon, Nasty Plot, Cross Poison, Iron Head, Zen Headbutt. See git history (C129) for full stats table.

## Challenge Mode — Set Battle Override (C181) + Level Caps (C182)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/battle_main.c` | After `gBattleScripting.battleStyle` assignment, override to SET if Challenge Mode | **181**, **182** | C182: refactored to use IsChallengeModeActive() macro |
| `include/constants/flags.h` | `FLAG_DIFFICULTY_CHALLENGE` = 0x286 + `IsChallengeModeActive()` macro | **181**, **182** | C182: added shared helper macro |
| `include/constants/script_menu.h` | `MULTI_DIFFICULTY_SELECT` = 114 | **181** | New multichoice constant |
| `src/data/script_menu.h` | `MultichoiceList_DifficultySelect` (Normal/Challenge) + array entry | **181** | 2 text strings + list + 1 array entry |
| `src/battle_script_commands.c` | `GetChallengeLevelCap()` function + soft cap check in `Cmd_getexp()` | **182**, **207** | Badge-based caps (18/20/24/30/34/38/42/48/55), 10% EXP above cap. C207: added in-battle feedback message when cap reduces EXP. |
| `include/constants/battle_string_ids.h` | `STRINGID_PKMNGAINEDEXPCAPPED` (381), BATTLESTRINGS_COUNT → 382 | **207** | Level cap feedback string ID |
| `src/battle_message.c` | `sText_PkmnGainedEXPCapped` string + table entry | **207** | Two-page message: EXP gained + "EXP reduced by the level cap." |

## Custom Ability: Toxic Touch (C241)

First custom ability in the hack. 30% chance to poison the target when the holder uses ANY damaging move (no contact required).

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `include/constants/abilities.h` | Added ABILITY_TOXIC_TOUCH = 78, ABILITIES_COUNT → 79 | **241** | First custom ability constant |
| `src/data/text/abilities.h` | Description string, gAbilityNames entry, gAbilityDescriptionPointers entry | **241** | "TOXIC TOUCH", "Its attacks leave a toxic residue." |
| `src/battle_util.c` | Toxic Touch logic in ABILITYEFFECT_ON_DAMAGE case, after inner switch | **241** | Checks attacker ability directly (not gLastUsedAbility). No FLAG_MAKES_CONTACT. Blocks: Substitute, status1, confusionSelfDmg, no-effect, power==0 |
| `src/data/pokemon/species_info.h` | Deoxys_Hoenn ability1: ABILITY_PRESSURE → ABILITY_TOXIC_TOUCH | **241** | ability2 stays ABILITY_PRESSURE |

## Custom Ability: Frozen Spore (C289)

20% chance to freeze the target when the holder uses a contact-based damaging move. Assigned to Breloom_Hoenn (Poison/Ice), replacing Poison Point.

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `include/constants/abilities.h` | Added ABILITY_FROZEN_SPORE = 79, ABILITIES_COUNT → 81 | **289** | |
| `include/constants/global.h` | ABILITY_NAME_LENGTH 12 → 14 | **289** | Needed for "SCALDING TOUCH" (14 chars) |
| `src/data/text/abilities.h` | Description string, gAbilityNames entry, gAbilityDescriptionPointers entry | **289** | "FROZEN SPORE", "Icy spores may freeze on contact." |
| `src/battle_util.c` | Frozen Spore logic in ABILITYEFFECT_ON_DAMAGE case, after Toxic Touch block | **289** | Contact-only (FLAG_MAKES_CONTACT), (Random() % 5) == 0 for 20%, MOVE_EFFECT_FREEZE |
| `src/data/pokemon/species_info.h` | Breloom_Hoenn ability1: ABILITY_POISON_POINT → ABILITY_FROZEN_SPORE | **289** | ability2 stays ABILITY_THICK_FAT |

## Custom Ability: Scalding Touch (C289)

33% chance to burn the target when the holder uses a contact-based damaging move. Assigned to Arcanine_Hoenn (Water/Fire), replacing Flash Fire.

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `include/constants/abilities.h` | Added ABILITY_SCALDING_TOUCH = 80 (same ABILITIES_COUNT update as Frozen Spore) | **289** | |
| `src/data/text/abilities.h` | Description string, gAbilityNames entry, gAbilityDescriptionPointers entry | **289** | "SCALDING TOUCH", "Scalding touch may burn the foe." |
| `src/battle_util.c` | Scalding Touch logic in ABILITYEFFECT_ON_DAMAGE case, after Frozen Spore block | **289** | Contact-only (FLAG_MAKES_CONTACT), (Random() % 3) == 0 for 33%, MOVE_EFFECT_BURN |
| `src/data/pokemon/species_info.h` | Arcanine_Hoenn ability2: ABILITY_FLASH_FIRE → ABILITY_SCALDING_TOUCH | **289** | ability1 stays ABILITY_INTIMIDATE |

## Pre-existing Build Fix (C289)

Removed orphaned Mudkip_Hoenn/Marshtomp_Hoenn/Swampert_Hoenn entries from species_info.h — these had data blocks but no corresponding SPECIES_ constants in species.h (C288 partial registration issue). Build was broken before C289 changes.

## Tier 2 Ability Reassignment Pass (C288)

8 regional forms received thematic ability replacements in `species_info.h`. One-line edits per species — no new abilities created (all existing engine constants). Replaced generic/redundant abilities with ones expressing each form's ecological niche.

Key gameplay impacts:
- Corsola_Hoenn gains Ground immunity via Levitate (patches Ghost/Rock's Ground weakness)
- Bagon_Hoenn survives one OHKO via Sturdy (early-game durability)
- Pinsir_Hoenn rewards status with 50% Atk boost via Guts
- Gligar/Gliscor_Hoenn become rain sweepers via Swift Swim
- Stantler_Hoenn punishes contact via Effect Spore (30% para/sleep/poison)
- Vulpix/Ninetales_Hoenn heal status on switch via Natural Cure
