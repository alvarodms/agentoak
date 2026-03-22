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
| `src/data/trainer_parties.h` | Late-game route trainer refresh (Routes 113-118, 121-123) | 57 | 83 base trainers redesigned across 9 routes: held items on all, custom movesets on 40+, migration species (Gligar, Larvitar, Houndour/Houndoom, Phanpy, Teddiursa/Ursaring, Sneasel, Murkrow, Misdreavus, Heracross, Stantler, Togetic, Ninetales, Mareep, Scyther, Snubbull); tier 5 rematches for Jessica/Cristin upgraded |
| `src/data/trainers.h` | Late-game route trainer entries updated | 57 | Party types changed to ItemCustomMoves/ItemDefaultMoves matching trainer_parties.h |
| `graphics/types/fairy.png` | Re-restored missing fairy type icon | 57 | Copied from normal.png (missing again) |
| `src/data/trainer_parties.h` | Victory Road trainer refresh (16 trainers + Wally) | **58** | All 17 Victory Road trainers: 3-mon teams (4 for Dianne, 6 for Wally), held items, custom movesets, migration species, lv54-58 |
| `src/data/trainers.h` | Victory Road trainer entries updated | **58** | All 17 changed to ITEM_CUSTOM_MOVES, 2x Full Restore (3x for Wally), competitive AI |
| `src/data/trainer_parties.h` | E4 + Champion rematch tier 3 teams | **71** | lv78-88; Weavile on Sidney/Glacia, Garchomp on Drake, .iv=250 |
| `src/data/trainer_parties.h` | E4 + Champion rematch tier 4 teams | **71** | lv85-95; Lucario on Phoebe/Wallace, Garchomp ace on Drake, .iv=255 |
| `src/data/trainers.h` | E4 + Champion rematch tier 3+4 entries | **71** | 10 new entries (IDs 864-873), 4x Full Restore, competitive AI |
| `include/constants/opponents.h` | Trainer ID ceiling extended to 874 | **71** | 10 new IDs: TRAINER_SIDNEY_REMATCH_3 through TRAINER_WALLACE_REMATCH_4 |
| `src/battle_setup.c` | Rematch table: tier 3+4 IDs in slots 4-5 | **71** | All 5 E4 members now use all 5 rematch slots |
| `include/constants/flags.h` | Updated trainer flag range comment | **71** | 0x500-0x869 (874 trainers) |
| `src/data/trainer_parties.h` | Villain dungeon trainer refresh (36 trainers) | **72** | Mt. Chimney (2 grunts + Tabitha), Jagged Pass (1 grunt), Magma Hideout (16 grunts + Tabitha), Aqua Hideout (8 grunts + Matt), Seafloor Cavern (5 grunts + Shelly). All with custom movesets, held items, migration species (Houndour/Houndoom, Crawdaunt, Claydol, Weezing). Levels raised to match progression. |
| `src/data/trainers.h` | Villain dungeon trainer entries updated | **72** | All 36 changed to ITEM_CUSTOM_MOVES. Grunts: CHECK_BAD_MOVE + TRY_TO_FAINT + CHECK_VIABILITY. Admins: + SETUP_FIRST_TURN + Full Restores. |
| `src/data/trainer_parties.h` | Mt. Pyre interior trainer refresh (8 trainers) | **73** | Mark (2F), Dez&Luke (2F doubles), William (3F), Kayla (3F), Tasha (4F), Atsushi (5F), Valerie (6F), Cedric (6F). Custom movesets, held items, migration species (Misdreavus, Murkrow, Sableye). Levels 28-33. |
| `src/data/trainers.h` | Mt. Pyre interior trainer entries updated | **73** | All 8 changed to ITEM_CUSTOM_MOVES. AI: CHECK_BAD_MOVE + TRY_TO_FAINT + CHECK_VIABILITY. Kayla reclassed from Psychic to Hex Maniac. Super/Hyper Potions. |
| `src/data/trainer_parties.h` | Early-game route trainer refresh (Routes 102-104) | **74** | 11 trainers: Calvin (unchanged), Rick (1 Wurmple w/ custom moves), Allen (Zigzagoon+Nidoran♂), Tiana (Shroomish+Teddiursa), Miguel (Skitty+Flaaffy Lv25-27), Daisy (Breloom+Weepinbell Lv26-27), Cindy (unchanged), Winston (Growlithe Lv8), Ivan (Magikarp+Poliwag), Billy (Seedot+Machop), Haley (Shroomish+Phanpy w/ Oran Berry), Gina&Mia (Taillow+Houndour). 8 migration species: Nidoran♂, Teddiursa, Flaaffy, Weepinbell, Growlithe, Poliwag, Machop, Phanpy, Houndour. |
| `src/data/trainers.h` | Early-game route trainer entries updated | **74** | 10 trainers changed to CUSTOM_MOVES party types. Winston loses Full Restore + Nugget. Haley upgraded to ITEM_CUSTOM_MOVES for Phanpy's Oran Berry. |