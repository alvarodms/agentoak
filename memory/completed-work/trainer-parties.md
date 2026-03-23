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
| `src/data/trainer_parties.h` | E4 + Champion rematch tier 1-2 teams | 49-50 | lv60-82 competitive teams |
| `src/data/trainers.h` | E4 + Champion rematch entries | 49-50 | AI flags + Full Restores |
| `include/constants/opponents.h` | Trainer IDs for E4 rematches | 49-52 | Ceiling fixes, unused entries removed |
| `src/data/trainer_parties.h` | Gym leader rematches (all 8, slots _2-_5) | 54 | Competitive 6-mon teams lv57-71 |
| `src/data/trainer_parties.h` | Mid-game route trainers (Routes 110-112, 119-120) | 55 | 28 trainers, migration species |
| `src/data/trainer_parties.h` | Water route trainers (Routes 105-109) | 56 | 35 base + 24 rematches |
| `src/data/trainer_parties.h` | Late-game route trainers (Routes 113-118, 121-123) | 57 | 83 trainers across 9 routes |
| `src/data/trainer_parties.h` | Victory Road trainers + Wally | **58** | 17 trainers, lv54-58 |
| `src/data/trainer_parties.h` | E4 + Champion rematch tier 3-4 | **71** | lv78-95, new species |
| `src/data/trainer_parties.h` | Villain dungeon trainers (36 trainers) | **72** | Mt. Chimney through Seafloor |
| `src/data/trainer_parties.h` | Mt. Pyre interior (8 trainers) | **73** | Ghost-themed migration |
| `src/data/trainer_parties.h` | Early-game routes 102-104 (11 trainers) | **74** | Migration species introduction |

**Note**: Cycle 88 attempted Gym Leader 1-5 held item overhaul + Rival Route 110/119 items, but changes were **REVERTED** (build never run). Must retry in next cycle.
