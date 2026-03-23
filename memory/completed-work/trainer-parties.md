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
