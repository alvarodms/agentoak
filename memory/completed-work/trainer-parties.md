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
| `src/data/trainer_parties.h` | E4 + Champion rematch tier 2 teams | 50 | lv72-82; Sidney swaps Mightyena for Crawdaunt, Wallace swaps Lapras for Ludicolo |
| `src/data/trainers.h` | E4 + Champion rematch tier 2 entries | 50 | 5 new entries with 4x Full Restore |
| `include/constants/opponents.h` | 5 more trainer IDs (860-864) | 50 | TRAINER_SIDNEY_REMATCH_2 through TRAINER_WALLACE_REMATCH_2; MAX_TRAINERS_COUNT raised to 869 |
| `src/battle_setup.c` | Rematch table: tier 2 IDs in slots 3-5 | 50 | Tier 1 in slot 2, tier 2 in slots 3-5 |
| `include/constants/opponents.h` | Trainer ID ceiling fix (partial) | 51 | Removed 3 unused entries: GRUNT_UNUSED (568), BRENDAN_PLACEHOLDER (853), MAY_PLACEHOLDER (854); renumbered WALLACE_REMATCH_2 to 863; TRAINERS_COUNT reduced from 869 to 865 (still 1 over 864 limit) |
| `src/data/trainers.h` | Removed 3 unused trainer definitions | 51 | Commented out GRUNT_UNUSED, BRENDAN_PLACEHOLDER, MAY_PLACEHOLDER |
| `src/data/trainer_parties.h` | Removed 3 unused party definitions | 51 | Commented out sParty_GruntUnused, sParty_BrendanLinkPlaceholder, sParty_MayLinkPlaceholder |
| `include/constants/opponents.h` | Trainer ID ceiling fix (complete) | 52 | Completely removed TRAINER_BRENDAN_PLACEHOLDER; TRAINERS_COUNT reduced to 864; MAX_TRAINERS_COUNT reached |
| `src/data/trainers.h` | Removed BRENDAN_PLACEHOLDER definition | 52 | Completely removed trainer entry |
| `src/data/trainer_parties.h` | Removed sParty_BrendanLinkPlaceholder | 52 | Completely removed party definition |
| `src/data/trainer_parties.h` | Gym leader rematch teams (all 8, slots _2-_5) | 54 | Competitive 6-mon teams lv57-71, migration species, held items, .iv=200 |
| `src/data/trainers.h` | Gym leader rematch entries (all 8, slots _2-_5) | 54 | Added AI_SCRIPT_SETUP_FIRST_TURN, 4x Full Restore |
| `src/data/trainer_parties.h` | Mid-game route trainer refresh (Routes 110-112, 119-120) | 55 | 28 trainers redesigned: custom moves, held items, migration species (Electabuzz, Murkrow, Sneasel, Houndour, Magmar, Misdreavus, Politoed, Kingdra, Scyther); P/S split showcase |
| `src/data/trainers.h` | Mid-game trainer entries updated | 55 | Party types changed to ItemCustomMoves/ItemDefaultMoves; route aces get SETUP_FIRST_TURN AI |
| `graphics/types/fairy.png` | Re-restored missing fairy type icon | 55 | Copied from normal.png (was missing again) |
| `src/data/trainer_parties.h` | Water route trainer refresh (Routes 105-109) | 56 | 35 base trainers + 24 rematches redesigned: ocean migration species (Corsola, Lanturn, Qwilfish, Mantine, Octillery, Lapras, Starmie, Relicanth, Seadra, Sharpedo); 4 route aces (Imani, Beth, Matthew, Cory) with smart AI |
| `src/data/trainers.h` | Water route trainer entries updated | 56 | Party types changed to ItemCustomMoves/ItemDefaultMoves; route aces get CHECK_VIABILITY + TRY_TO_FAINT AI |
| `graphics/types/fairy.png` | Re-restored missing fairy type icon | 56 | Copied from normal.png (missing again after build) |