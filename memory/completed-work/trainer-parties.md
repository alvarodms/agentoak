# Trainer Parties

Modified files related to trainer team compositions, held items, and level curves.

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/data/trainer_parties.h` | All 8 gym leaders + Champion Wallace | 6 | Thematic powerhouse teams |
| `src/data/trainer_parties.h` | All 5 rival battles (30 party defs) | 7, 12 | Cycle 12 rebuilt Torchic-slot parties |
| `src/data/trainer_parties.h` | Elite Four + Champion Wallace | 8 | Sidney/Phoebe/Glacia/Drake/Wallace |
| `src/data/trainer_parties.h` | Villain bosses + admins | 10, 11 | Maxie, Archie, Matt, Shelly, Tabitha |
| `src/data/trainer_parties.h` | Held items for gym leaders + E4 | 16, 17 | |
| `src/data/trainer_parties.h` | Level curve rebalancing | 19 | Brawly through Juan |
| `src/data/trainer_parties.h` | E4/Champion rematches + Gym rematches | 49-50, 54 | lv60-82, competitive 6-mon |
| `src/data/trainer_parties.h` | Route trainers (110-123, 105-109, Victory Road) | 55-58 | 163 trainers total |
| `src/data/trainer_parties.h` | E4 rematch tiers 3-4 | **71** | lv78-95 |
| `src/data/trainer_parties.h` | Villain dungeon + Mt. Pyre + early routes | **72-74** | 55 trainers |
| `src/data/trainer_parties.h` | v3.0 held item overhaul: Gyms 1-5 + Rival | **89** | Tier progression system |
| `src/data/trainers.h` | Rival Route 110/119 → ITEM_DEFAULT_MOVES | **89** | 12 entries converted |
| `src/data/trainer_parties.h` | v3.0 held item overhaul: Gyms 6-8, E4, Champion, Rival Lilycove | **90** | Full competitive items |
| `src/data/trainers.h` | Rival Lilycove → ITEM_DEFAULT_MOVES | **90** | 6 entries converted |
| `src/data/trainer_parties.h` | Route 110 Twins (Growlithe+Poliwag Lv16) + Route 119 Sr/Jr (Houndour+Snubbull Lv27) | **94** | 2 new double-battle trainers with migration species |
| `src/data/trainers.h` | New trainer entries for TRAINER_MIA_AND_LILY_1, TRAINER_LILA_AND_ROY_1 | **94** | doubleBattle=TRUE, AI flags |
| `include/constants/opponents.h` | Added TRAINER_MIA_AND_LILY_1 (874), TRAINER_LILA_AND_ROY_1 (875); TRAINERS_COUNT→876 | **94** | 2 new trainer IDs |
| `src/data/trainer_parties.h` | 6 Primal Stirring remnant trainers: 2 Magma grunts (Lv40-42, ITEM_DEFAULT_MOVES), 1 Magma admin (Lv42-44, ITEM_CUSTOM_MOVES, 4 mons), 2 Aqua grunts (Lv40-42, ITEM_DEFAULT_MOVES), 1 Aqua admin (Lv42-44, ITEM_CUSTOM_MOVES, 4 mons) | **122** | Held items + custom movesets for admins |
| `src/data/trainers.h` | 6 new entries: TRAINER_MAGMA_GRUNT_TERRA_1/2, TRAINER_MAGMA_ADMIN_TERRA (Courtney), TRAINER_AQUA_GRUNT_SEAFLOOR_1/2, TRAINER_AQUA_ADMIN_SEAFLOOR (Amber). Admins have FULL_RESTORE + SETUP_FIRST_TURN AI | **122** | |
| `include/constants/opponents.h` | IDs 876-881, TRAINERS_COUNT→882 | **122** | 6 new remnant trainer IDs |
| `src/data/trainer_parties.h` | Redesigned all 4 rematch tiers for Roxanne, Brawly, Wattson, Flannery | **101** | 16 parties: tiered IVs (100→200), levels (38-75), 4→6 mons per tier. Migration aces: Tyranitar (Roxanne T4), Lucario (Brawly T3-4), Electabuzz/Ampharos (Wattson), Houndoom/Ninetales (Flannery). Competitive items, custom movesets. Fallbacks used: MOVE_BRICK_BREAK/MOVE_PSYCHIC for Lucario (Aura Sphere/Dragon Pulse don't exist). MOVE_HI_JUMP_KICK (not HIGH_JUMP_KICK). |
| `src/data/trainer_parties.h` | Wallace base+R1: Lapras ace → Milotic (Lv65/71, Leftovers, Surf/IceBeam/Recover/Toxic). Juan base: Lapras ace → Kingdra (Lv55, LumBerry, Surf/IceBeam/RainDance/Twister). Glacia unchanged. | **127** | Issue #80 item 2: ace diversification |
| `src/data/trainer_parties.h` | v7.1 Gym Leaders 1-4 redesign: Roxanne (Geodude/Aerodactyl/Nosepass Lv12-15), Brawly (Machoke/Hitmonlee/Heracross Lv15-18), Wattson (Magneton/Electabuzz/Jolteon Lv20-24), Flannery (Magmar/Arcanine/Houndoom Lv25-29). All ITEM_CUSTOM_MOVES with strategic movesets. Level curve corrected down from previous values. | **130** | Issue #82 partial: gyms 1-4 |
| `data/maps/TerraCave_Entrance/scripts.inc` | Added missing MagmaGrunt1 trainer battle script (fixes linker error from C122) | **130** | Pre-existing build fix |
| `src/data/pokemon/level_up_learnsets.h` | Dratini: swapped Dragon Breath (Lv1→Lv15) and Twister (Lv15→Lv1). Fixes overpowered 60BP STAB at Lv5 in rival's first battle. | **127** | Issue #80 item 1: Dragon Rage fix |
| `pokeemerald/Makefile` | Added `check_trainers` and `check_ascii` phony targets for trainer data validation and .inc ASCII guard | **127** | Tech debt: deferred since C118 |
| `src/data/trainer_parties.h` | Redesigned all 4 rematch tiers for Norman, Winona, Tate & Liza, Juan | **102** | 16 parties: tiered IVs (100→200), levels (38-75), 4→6 mons per tier. Migration species: Tauros/Ursaring (Norman T3+/T4+), Murkrow (Winona T2-T3 only, 405 BST cap), Misdreavus (T&L T3+), Poliwrath (Juan T4+). Key strats: Norman=setup sweepers (Belly Drum Linoone, Guts Ursaring), Winona=Guts Swellow+Spikes Skarmory+DD Altaria, T&L=Levitate EQ spam+Perish Song+Explosion in doubles, Juan=Rain Dance+Swift Swim Kingdra+Double Team ace. |
