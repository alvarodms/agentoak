# QoL Changes & Release

Quality-of-life improvements and release artifacts.

---

## QoL Changes

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| TM shop data files | TM prices halved (3000→1500) | 22 | Dragon Claw, EQ, Shadow Ball, Psychic, etc. |
| `data/maps/FallarborTown/scripts.inc` | Move tutor: Metronome→Earthquake | 23 | Pre-Gym 4 EQ access |
| `src/field_player_avatar.c` | Auto-run enabled (B_BUTTON check removed) | 37 | Running is now default; always runs when FLAG_SYS_B_DASH set |
| `src/bike.c` | Indoor running enabled (removed `allowRunning` and `MAP_TYPE_INDOOR` checks) | 156 | `IsRunningDisallowed` and `RS_IsRunningDisallowed` — only metatile checks remain |
| `src/new_game.c` | FlagSet(FLAG_SYS_B_DASH) at game start | 38 | Player runs from very first step, not just after getting shoes |
| `src/pokemon_summary_screen.c` | Move category icons (Physical/Special/Status) on summary screen | 75 | New sprite slot, animations, SetMoveCategoryIcon() function. Shows on battle moves page detail pane. |
| `graphics/types/physical.png` | Physical category icon (red "PHYS") | 75 | 32x16 indexed-color PNG, palette 13 |
| `graphics/types/special.png` | Special category icon (purple "SPEC") | 75 | 32x16 indexed-color PNG, palette 14 |
| `graphics/types/status.png` | Status category icon (gray "STAT") | 75 | 32x16 indexed-color PNG, palette 13 |
| `graphics/types/fairy.png` | Fairy type icon (pink "FAIRY") — was missing | 75 | Required by build system since Cycle 44 fairy addition |
| `src/option_menu.c` | Added BATTLE SPEED toggle (NORMAL/FAST) to Options menu | 105 | New menu item between BATTLE SCENE and BATTLE STYLE |
| `src/battle_main.c` | Hook battle speed into HITMARKER_NO_ANIMATIONS | 105 | OR'd with existing optionsBattleSceneOff check |
| `include/global.h` | Added optionsBattleSpeed:1 bitfield to SaveBlock2 | 105 | Uses bit 13 of existing u16 field |
| `include/constants/global.h` | Added OPTIONS_BATTLE_SPEED_NORMAL/FAST constants | 105 | |
| `src/strings.c` | Added gText_BattleSpeed, gText_BattleSpeedNormal, gText_BattleSpeedFast | 105 | |
| `include/strings.h` | Added extern declarations for battle speed strings | 105 | |
| `graphics_file_rules.mk` | Added move_categories to sprite sheet concatenation | 75 | physical/special/status appended after contest types |
| `src/data/pokemon/evolution.h` | All 11 trade evolutions removed — 4 pure-trade→EVO_LEVEL 37, 7 trade-item→EVO_ITEM | 158 | Kadabra, Machoke, Graveler, Haunter→level 37; Politoed, Slowking, Steelix, Kingdra, Scizor, Porygon2, Huntail, Gorebyss→item-based |
| `include/constants/items.h` | ITEM_DAWN_STONE = 99 (slot 0x063) | 229 | New evolution stone item |
| `src/data/text/item_descriptions.h` | sDawnStoneDesc added | 229 | |
| `src/data/items.h` | Dawn Stone item data entry | 229 | Price 2100, POCKET_ITEMS, ItemUseOutOfBattle_EvolutionStone |
| `src/data/pokemon/item_effects.h` | gItemEffect_DawnStone + table entry | 229 | ITEM4_EVO_STONE |
| `src/data/item_icon_table.h` | Dawn Stone icon (reuses Moon Stone) | 229 | |
| `include/constants/pokemon.h` | EVO_ITEM_FEMALE = 17 | 229 | Item-use evolution gated by female gender |
| `src/pokemon.c` | EVO_ITEM_FEMALE handler in GetEvolutionTargetSpecies | 229 | Checks item match + female gender |
| `src/data/pokemon/evolution.h` | Snorunt→Froslass: EVO_LEVEL_FEMALE→EVO_ITEM_FEMALE + ITEM_DAWN_STONE | 229 | Canonical Dawn Stone evolution |
| `include/constants/flags.h` | FLAG_ITEM_SHOAL_CAVE_ICE_ROOM_DAWN_STONE = 0x468 | 229 | Repurposed unused flag |
| `data/maps/ShoalCave_LowTideIceRoom/map.json` | Dawn Stone item ball at (9,14) | 229 | Third object_event in Ice Room |
| `data/scripts/item_ball_scripts.inc` | ShoalCave_LowTideIceRoom_EventScript_ItemDawnStone | 229 | finditem ITEM_DAWN_STONE |
| `scripts/check_evolution_consistency.sh` | Check 5b: EVO_ITEM_FEMALE validation | 229 | Validates target species + item constants |

## Release

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `pokeemerald/RELEASE_NOTES.md` | v1.0 release notes created | 37 | Full feature list, v2.0 preview, credits |
| `README.md` (project root) | Full rewrite of "The Game" section as player-facing sales pitch | 107 | v1.0 Beta release. Organized by category: Migration, Battle System, Trainers, Postgame, QoL |
| `pokeemerald/graphics/types/fairy.png` | Re-created placeholder (copy of normal.png) | 107 | Recurring missing-asset fix — must be committed |
| `pokeemerald/graphics/types/physical.png` | Re-created placeholder (copy of normal.png) | 107 | Recurring missing-asset fix — must be committed |
| `pokeemerald/graphics/types/special.png` | Re-created placeholder (copy of normal.png) | 107 | Recurring missing-asset fix — must be committed |
| `pokeemerald/graphics/types/status.png` | Re-created placeholder (copy of normal.png) | 107 | Recurring missing-asset fix — must be committed |
