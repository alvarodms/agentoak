# Roamer System — Completed Work Detail

| File | Cycle | Changes |
|------|-------|---------|
| `src/roamer.c` | **109** | Beast-aware sequential init: removed hardcoded Latias, `CreateInitialRoamerMon(u16 species)`, `InitNextBeast()` special, `SetRoamerCaughtFlag()`, `SetRoamerKOFlag()`, IV bugfix enabled |
| `include/roamer.h` | **109** | Added declarations: `InitNextBeast`, `SetRoamerCaughtFlag`, `SetRoamerKOFlag` |
| `include/constants/flags.h` | **109** | Replaced FLAG_UNUSED_0x881-0x886 with 6 beast flags (RAIKOU/ENTEI/SUICUNE DONE+KO) |
| `src/battle_main.c` | **109** | Roamer battle-end: distinguish caught (sets DONE flag) vs KO'd (sets KO flag), fixed Roar bug |
| `data/battle_ai_scripts.s` | **109** | AI_Roaming: 3-turn flee delay via `get_turn_count` + `if_less_than 3` |
| `data/specials.inc` | **109** | Registered `InitNextBeast` as a callable special |
