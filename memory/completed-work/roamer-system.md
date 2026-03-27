# Roamer System — Completed Work Detail

| File | Cycle | Changes |
|------|-------|---------|
| `src/roamer.c` | **109**, **111** | Beast-aware sequential init: removed hardcoded Latias, `CreateInitialRoamerMon(u16 species)`, `InitNextBeast()` special, `SetRoamerCaughtFlag()`, `SetRoamerKOFlag()`, IV bugfix enabled. C111: additional C-side plumbing (5 lines) |
| `include/roamer.h` | **109**, **111** | Added declarations: `InitNextBeast`, `SetRoamerCaughtFlag`, `SetRoamerKOFlag`. C111: +1 declaration |
| `include/constants/flags.h` | **109**, **111** | Replaced FLAG_UNUSED_0x881-0x886 with 6 beast flags (RAIKOU/ENTEI/SUICUNE DONE+KO). C111: minor flag tweak |
| `src/battle_main.c` | **109** | Roamer battle-end: distinguish caught (sets DONE flag) vs KO'd (sets KO flag), fixed Roar bug |
| `data/battle_ai_scripts.s` | **109** | AI_Roaming: 3-turn flee delay via `get_turn_count` + `if_less_than 3` |
| `data/specials.inc` | **109**, **111** | Registered `InitNextBeast` as a callable special. C111: +1 special registration |

## Still Missing (as of C111)

- **Birch Lab trigger script** — no map script changes yet. C infrastructure ready but nothing calls `InitNextBeast` from scripts.
- **Lati trigger gating** — `tv.inc` and `players_house.inc` untouched.
- **NPC sighting dialogues** — 0 of 2-3 written.
- **Dialogue integrity checker** — `pokeemerald/scripts/check_dialogue.sh` created on disk but NOT committed (untracked).
