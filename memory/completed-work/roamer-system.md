# Roamer System — Completed Work Detail

| File | Cycle | Changes |
|------|-------|---------|
| `src/roamer.c` | **109**, **111** | Beast-aware sequential init: removed hardcoded Latias, `CreateInitialRoamerMon(u16 species)`, `InitNextBeast()` special, `SetRoamerCaughtFlag()`, `SetRoamerKOFlag()`, IV bugfix enabled. C111: additional C-side plumbing (5 lines) |
| `include/roamer.h` | **109**, **111** | Added declarations: `InitNextBeast`, `SetRoamerCaughtFlag`, `SetRoamerKOFlag`. C111: +1 declaration |
| `include/constants/flags.h` | **109**, **111** | Replaced FLAG_UNUSED_0x881-0x886 with 6 beast flags (RAIKOU/ENTEI/SUICUNE DONE+KO). C111: minor flag tweak |
| `src/battle_main.c` | **109** | Roamer battle-end: distinguish caught (sets DONE flag) vs KO'd (sets KO flag), fixed Roar bug |
| `data/battle_ai_scripts.s` | **109** | AI_Roaming: 3-turn flee delay via `get_turn_count` + `if_less_than 3` |
| `data/specials.inc` | **109**, **111** | Registered `InitNextBeast` as a callable special. C111: +1 special registration |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | **112** | Birch Lab beast trigger: cinematic first-trigger scene with ShakeCamera + Raikou cry, NextBeastArrived for subsequent beasts, BeastActive/AllBeastsDone branches |
| `data/scripts/tv.inc` | **112** | Gated vanilla Lati trigger behind FLAG_BEAST_SUICUNE_DONE — Latias/Latios only triggers after all 3 beasts done |
| `data/maps/Route118/scripts.inc` | **112** | Fisherman beast-sighting conditional dialogue when roamer active |
| `data/maps/FortreeCity/scripts.inc` | **112** | Woman NPC beast-sighting conditional dialogue when roamer active |

## Status: COMPLETE (C112+C113)

All components delivered:
- C infrastructure (C109/C111): roamer.c, flags, battle integration, AI flee delay
- Script layer (C112): Birch trigger, Lati gating, 2 NPC sighting dialogues
- Sighting NPCs expanded (C113): 4 new beast-specific conditional NPCs (Mauville, Lilycove, Route 121, Mossdeep) — total 6 sighting NPCs across Hoenn
- Dialogue checker: `pokeemerald/scripts/check_dialogue.sh` committed C112
