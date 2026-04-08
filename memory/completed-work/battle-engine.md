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

Added 20 moves (IDs 358-377, MOVES_COUNT = 378) across 5 files:
- `include/constants/moves.h` — 20 new #define constants
- `src/data/battle_moves.h` — 20 gBattleMoves entries
- `src/data/text/move_names.h` — 20 gMoveNames entries
- `src/data/text/move_descriptions.h` — 20 static strings + 20 pointer table entries
- `src/data/contest_moves.h` — 20 gContestMoves entries

| Move | ID | Type | BP | Cat | Effect | Notes |
|------|-----|------|-----|------|--------|-------|
| Night Slash | 358 | Dark | 70 | Phys | HIGH_CRITICAL | Contact |
| Brave Bird | 359 | Flying | 120 | Phys | DOUBLE_EDGE | 1/3 recoil |
| Flare Blitz | 360 | Fire | 120 | Phys | DOUBLE_EDGE | 1/3 recoil (no burn) |
| Stone Edge | 361 | Rock | 100 | Phys | HIGH_CRITICAL | No contact |
| Dragon Pulse | 362 | Dragon | 90 | Spec | HIT | |
| Close Combat | 363 | Fight | 120 | Phys | SUPERPOWER | Lowers Atk/Def |
| Aqua Tail | 364 | Water | 90 | Phys | HIT | 90 acc |
| Aura Sphere | 365 | Fight | 90 | Spec | HIT | Never miss (acc=0) |
| Sucker Punch | 366 | Dark | 80 | Phys | HIT | Priority +1 (simplified) |
| Wild Charge | 367 | Electric | 90 | Phys | RECOIL | 1/4 recoil |
| X-Scissor | 368 | Bug | 80 | Phys | HIT | |
| Poison Jab | 369 | Poison | 80 | Phys | POISON_HIT | 30% poison |
| Ice Shard | 370 | Ice | 40 | Phys | HIT | Priority +1 |
| Energy Ball | 371 | Grass | 80 | Spec | SPD_DOWN_HIT | 10% SpDef drop |
| Shadow Claw | 372 | Ghost | 70 | Phys | HIGH_CRITICAL | |
| Flash Cannon | 373 | Steel | 80 | Spec | SPD_DOWN_HIT | 10% SpDef drop |
| Nasty Plot | 374 | Dark | -- | Status | SP_ATK_UP_2 | Self-target |
| Cross Poison | 375 | Poison | 70 | Phys | POISON_HIT | 10% poison |
| Iron Head | 376 | Steel | 80 | Phys | FLINCH_HIT | 30% flinch |
| Zen Headbutt | 377 | Psychic | 80 | Phys | FLINCH_HIT | 20% flinch |

## Challenge Mode — Set Battle Override (C181)

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/battle_main.c` | After `gBattleScripting.battleStyle` assignment, override to SET if `FLAG_DIFFICULTY_CHALLENGE` | **181** | 2 lines added after line ~3111 |
| `include/constants/flags.h` | `FLAG_DIFFICULTY_CHALLENGE` = 0x286 | **181** | Repurposed `FLAG_UNUSED_0x286` |
| `include/constants/script_menu.h` | `MULTI_DIFFICULTY_SELECT` = 114 | **181** | New multichoice constant |
| `src/data/script_menu.h` | `MultichoiceList_DifficultySelect` (Normal/Challenge) + array entry | **181** | 2 text strings + list + 1 array entry |
