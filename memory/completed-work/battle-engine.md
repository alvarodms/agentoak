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
