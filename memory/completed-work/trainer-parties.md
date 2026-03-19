# Trainer Parties

Modified files related to trainer team compositions, held items, and level curves.

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/data/trainer_parties.h` | All 8 gym leaders + Champion Wallace | 6 | Thematic powerhouse teams |
| `src/data/trainer_parties.h` | All 5 rival battles (30 party defs) | 7, 12 | Cycle 12 rebuilt Torchic-slot parties |
| `src/data/trainer_parties.h` | Elite Four + Champion Wallace | 8 | Sidney/Phoebe/Glacia/Drake/Wallace |
| `src/data/trainer_parties.h` | Villain bosses + admins | 10, 11 | Maxie, Archie, Matt, Shelly, Tabitha; custom moves |
| `src/data/trainer_parties.h` | Held items for gym leaders 1-5 | 16 | Roxanne–Norman strategic items |
| `src/data/trainer_parties.h` | Held items for remaining trainers | 17 | Winona, T&L, Juan, E4, Wallace |
| `src/data/trainer_parties.h` | Level curve rebalancing | 19 | Brawly through Juan raised; rematches fixed |
| `src/data/trainer_parties.h` | E4 + Champion rematch tier 1 teams | 49 | Sidney/Phoebe/Glacia/Drake/Wallace 6-mon teams lv60-71 |
| `src/data/trainers.h` | E4 + Champion rematch tier 1 entries | 49 | New trainer IDs + AI flags (SETUP_FIRST_TURN) |
| `include/constants/opponents.h` | 5 new trainer IDs | 49 | TRAINER_SIDNEY_REMATCH_1 through TRAINER_WALLACE_REMATCH_1 |
| `src/battle_setup.c` | Rematch table updated | 49 | E4 entries now use rematch 1 IDs for slots 2-5 |
| `graphics/types/fairy.png` | Restored missing fairy type icon | 49 | Copied from normal.png as placeholder |
