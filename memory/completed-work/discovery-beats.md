# Discovery Beats (visible static encounters + environmental cues)

Pattern: a visible overworld Pokémon (OBJ_EVENT_GFX_*_DOLL stand-in) that becomes a static battle and comes back until caught, hinted by optional sign-type bg_event "cues". Recipe and macros: codebase-facts.md → "Static Encounter Recipe" (C315 StaticDen pattern: object flag FLAG_TEMP_11 + permanent FLAG_CAUGHT_*).

| File | Change | Cycle | Notes |
|------|--------|-------|-------|
| `include/constants/flags.h` | 0x2B5 `FLAG_HIDE_MT_PYRE_STARLIGHT_TORCHIC` (C312) → renamed `FLAG_CAUGHT_MT_PYRE_STARLIGHT_TORCHIC` (C315); `FLAG_UNUSED_0x2B6` → `FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO` | 312, **315** | Both set ONLY on catch and never used as object flags. Next free flag: 0x2B7 |
| `asm/macros/event_macros.inc` | +`EventMacro_StaticDen`, `EventMacro_StaticDenTransition`, `EventMacro_StaticDenTryRemove` | **315** | Fixes the C312 bug where `removeobject` set the object's flag, so a KO or flee hid the den forever |
| `data/maps/MtPyre_Exterior/map.json` | +object TORCHIC_DOLL at (22,13) elev 3, FACE_DOWN; +sign ScorchMark (11,31); +sign FrostPrints (27,21). C315: doll flag → `FLAG_TEMP_11` | 312, **315** | (22,13) sits in a 6-wide fog area (rows 12-14), doesn't block summit warps (19/20,10) or item ball (27,15) |
| `data/maps/MtPyre_Exterior/scripts.inc` | StarlightTorchic (SPECIES_TORCHIC_HOENN Lv30 @ ITEM_STAR_PIECE) + ON_RESUME TryRemove + ScorchMark/FrostPrints texts (C312). C315: OnTransition gets `EventMacro_StaticDenTransition`, TryRemove body = `EventMacro_StaticDenTryRemove`, StarlightTorchic = one `EventMacro_StaticDen` line; `StarlightTorchicFaded` label removed | 312, **315** | Coral Mourner untouched. Texts unchanged |
| `data/maps/MeteorFalls_B1F_2R/map.json` | +object TREECKO_DOLL (7,4) elev 3, FACE_DOWN, flag FLAG_TEMP_11; +sign SilverLeaf (8,14); +sign ChalkNote (8,3) | **315** | Room is land rows 3-4 / water rows 5-13 / land rows 14-15. The doll is on the far shelf, 2 tiles from the TM ball (5,3), so the ball stays reachable by surfing (BFS-checked). The plan wanted SilverLeaf at y 9-13, but nothing there touches a walkable tile, so it went on the entrance shelf instead. ChalkNote is read from (7,3), next to the doll |
| `data/maps/MeteorFalls_B1F_2R/scripts.inc` | +ON_TRANSITION/ON_RESUME map scripts; CrystalTreecko = `EventMacro_StaticDen SPECIES_TREECKO_HOENN, 40, ITEM_MOON_STONE, ...`; SilverLeaf + ChalkNote ("- S.", Steven) texts | **315** | Resonance meteorite (C233/236/242) untouched |
| `data/maps/MeteorFalls_B1F_1R/map.json` + `scripts.inc` | +sign GroovedStone at (19,5): a lone rock 4 tiles from the B1F_2R warp (17,3) | **315** | First cue on the approach |

Mt. Pyre also has Torchic_Hoenn as a 4% wild slot (C279, wild-encounters.md). The den is the visible, guaranteed way to get it.

Future beat using the same pattern (strategy-notes roadmap): Shoal Cave titan Mudkip den (flag 0x2B7, 3 lines via EventMacro_StaticDen).

**Save-compat caveat (C315 reflection)**: 0x2B5 kept its number when renamed. Pre-C315 saves where the player KO'd/fled the Torchic have 0x2B5 set (old removeobject), so the den now reads as "caught" and stays hidden for them. Fresh saves unaffected; accepted, no migration code.
