# Battle Frontier Modifications

| File | Cycle | Changes |
|------|-------|---------|
| `src/battle_arena.c` | 78 | Added Fairy move Mind ratings (Moonblast, Play Rough, Dazzling Gleam = +1) |
| `include/constants/battle_frontier_mons.h` | 78 | Added 12 constants (FRONTIER_MON_LUCARIO_1-4, WEAVILE_1-4, GARCHOMP_1-4), NUM_FRONTIER_MONS 882→894 |
| `src/data/battle_frontier/battle_frontier_mons.h` | 78 | Added 12 Frontier mon entries (4 sets each for Lucario, Weavile, Garchomp) — indices 882-893, open-level only |

**Note (Cycle 78):** Factory style arrays (`battle_factory.c`) intentionally NOT modified — Fairy moves are standard attacking moves and don't belong in any style category (confirmed by Gameplay Designer analysis). Cycle 77 incorrectly added them to HighRiskHighReturn.

## Cycle 80 — P/S Split Punch Move Audit (25 sets modified)

**File**: `src/data/battle_frontier/battle_frontier_mons.h`

**Category A — Special attackers: punches replaced with special moves**
- ALAKAZAM_1: 3 punches → Psychic/Shadow Ball/Shock Wave
- ALAKAZAM_4: 3 punches → Psychic/Shadow Ball/Shock Wave/Calm Mind
- GENGAR_4: Fire/Ice Punch → Thunderbolt/Giga Drain
- GARDEVOIR_3: Ice/Fire Punch → Thunderbolt/Shadow Ball
- GARDEVOIR_4: Ice/Fire Punch → Shadow Ball/Calm Mind
- MR_MIME_4: Ice/Fire Punch → Shadow Ball/Calm Mind
- GRUMPIG_2: 3 punches → Shadow Ball/Shock Wave/Calm Mind
- LUDICOLO_1: Thunder/Fire Punch → Ice Beam/Giga Drain
- LUDICOLO_2: Thunder/Fire Punch → Giga Drain/Rain Dance
- SLOWBRO_1: Ice Punch + Headbutt → Ice Beam/Psychic
- HYPNO_1: 3 punches → Psychic/Shadow Ball/Calm Mind (EVs: Def→HP)
- HYPNO_4: 3 punches → Shadow Ball/Calm Mind/Thunder Wave
- MAGMAR_2: Thunder Punch → Psychic
- SCEPTILE_2: Thunder Punch → Dragon Claw
- SCEPTILE_4: Thunder Punch → Giga Drain
- EXPLOUD_3: Thunder Punch → Shock Wave
- VOLBEAT_2: Ice Punch → Shadow Ball
- ILLUMISE_2: Ice Punch → Shadow Ball

**Category B — Physical attackers: kept punches, fixed EVs/nature**
- MACHAMP_3: Fire Blast→Fire Punch, EVs SpA→Atk+HP, Nature→Adamant
- HARIYAMA_2: EVs SpA→Atk+HP, Nature Quiet→Adamant
- URSARING_3: EVs SpA→Atk, Nature Modest→Adamant
- MEDICHAM_3: EVs SpA→Atk

**Category C — Mixed sets redesigned**
- AMPHAROS_2: Punches→Thunderbolt/Thunder Wave/Focus Punch/Reflect, EVs→SpA+HP, Nature→Modest
- BLAZIKEN_2: EVs SpA→Atk+Speed, Nature→Adamant (moves kept physical)
- TYPHLOSION_2: Flamethrower→Earthquake, EVs→Atk+Speed, Nature→Adamant (committed physical)
- MUK_3: Tbolt/Flamethrower→Fire Punch/Ice Punch/Brick Break, EVs→Atk+HP, Nature→Adamant
- GRANBULL_2: Overheat/Tbolt→Double-Edge/Earthquake, EVs→Atk+HP, Nature→Adamant
- ELECTABUZZ_3: Fire/Ice Punch→Thunderbolt/Psychic/Thunder Wave, Nature→Modest

**No change**: AMPHAROS_4 (Fire Punch kept — only Fire coverage), BLAZIKEN_4, TYPHLOSION_4, REGISTEEL_2 (mixed sets acceptable as-is)

## Cycle 85 — P/S Split Crunch/Shadow Ball/Hyper Beam Audit (65 sets modified)

**File**: `src/data/battle_frontier/battle_frontier_mons.h`

**Category A — Physical mons with SpA EVs: fixed EVs/nature to match physical moves**
- POOCHYENA: EVs SpA→Atk
- MAWILE: EVs SpA→Atk
- MIGHTYENA_2: Shadow Ball→Return, Rock Smash added, EVs→Atk+Speed, Nature→Adamant
- SHARPEDO_2: EVs→Atk+Speed, Nature→Adamant
- URSARING_1: EVs→Atk+HP, Nature→Adamant
- SALAMENCE_2: EVs→Atk+Speed, Nature→Adamant
- SALAMENCE_3: EVs→Atk+Speed, Nature→Adamant
- FLYGON_4: EVs→Atk+Speed, Nature→Adamant
- URSARING_7: EVs→Atk+HP, Nature→Adamant
- URSARING_8: EVs→Atk+HP, Nature→Adamant
- TYRANITAR_2: EVs→Atk+Speed, Nature→Adamant
- TYRANITAR_9: EVs→Atk+Speed, Nature→Adamant
- FERALIGATR_3: EVs→Atk+HP, Nature→Adamant
- GRANBULL_4: Shadow Ball→Rock Slide, EVs→Atk+Speed, Nature→Adamant
- SALAMENCE_7: EVs→Atk+Speed, Nature→Adamant
- SALAMENCE_8: EVs→Atk+Speed, Nature→Adamant
- ARCANINE_3: EVs→Atk+Speed, Nature→Adamant (Overheat as one special nuke)
- ARCANINE_4: EVs→Atk+Speed, Nature→Adamant
- SCEPTILE_4: Crunch→Aerial Ace, Giga Drain kept, EVs→Atk+Speed, Nature→Adamant

**Category B — Special mons: Crunch replaced with special moves**
- HOUNDOUR: Crunch→Shadow Ball
- GIRAFARIG_2: Crunch→Thunderbolt
- GLALIE_1: Crunch→Shadow Ball
- MANECTRIC_2: Crunch→Shadow Ball
- MANECTRIC_4: Crunch→Shadow Ball
- HOUNDOOM_2: Crunch→Shadow Ball
- HOUNDOOM_4: Crunch→Shadow Ball
- FLYGON_2: Crunch→Protect (Sunny Day set)
- NIDOQUEEN_3: Crunch→Sludge Bomb (Poison STAB)
- ARCANINE_2: Crunch→Solar Beam (Sunny Day synergy)
- TYRANITAR_4: Crunch→Surf (all-special coverage set)

**Category C — Physical mons: Shadow Ball replaced with physical moves**
- LICKITUNG_2: Shadow Ball→Brick Break
- RATICATE_2: Shadow Ball→Facade
- FURRET_2: Shadow Ball→Brick Break
- QWILFISH_2: Shadow Ball→Waterfall (Water STAB)
- VIGOROTH_2: Shadow Ball→Brick Break
- ZANGOOSE_2: Shadow Ball→Return
- STANTLER_2: Shadow Ball→Earthquake
- ABSOL_2: Shadow Ball→Brick Break
- SWALOT_2: Shadow Ball→Earthquake
- KANGASKHAN_2: Shadow Ball→Brick Break
- KANGASKHAN_4: Shadow Ball→Rock Slide
- MILTANK_1: Shadow Ball→Brick Break
- MILTANK_2: Shadow Ball→Body Slam
- MILTANK_3: Shadow Ball→Rock Slide
- NIDOKING_2: Shadow Ball→Rock Slide
- SNORLAX_1: Shadow Ball→Earthquake
- SNORLAX_3: Shadow Ball→Earthquake
- SNORLAX_4: Shadow Ball→Earthquake
- SNORLAX_5: Shadow Ball→Earthquake
- SNORLAX_6: Shadow Ball→Rock Slide
- SNORLAX_8: Shadow Ball→Earthquake
- GRANBULL_2: Shadow Ball→Rock Slide (prev modified Cycle 80)
- SLAKING_2: Shadow Ball→Earthquake
- SLAKING_3: Shadow Ball→Return (CB set)
- HYPNO_3: Shadow Ball→Brick Break
- WEEZING_4: Shadow Ball→Will-O-Wisp
- CROBAT_3: Shadow Ball→Bite
- CROBAT_4: Shadow Ball→Bite
- CLAYDOL_4: Shadow Ball→Rock Slide
- FLAREON_3: Shadow Ball→Return, Nature→Adamant
- KECLEON_2: Shadow Ball→Return (CB set)

**Category D — Ghost/special mons: fixed natures/EVs to match Shadow Ball**
- GOLBAT_2: EVs Atk→SpA, Nature Adamant→Modest (3 special moves in split)
- BANETTE_2: Frustration→Thunderbolt, EVs→SpA+Speed, Nature→Modest
- MISDREAVUS_1: Nature Impish→Bold (keeps Def, doesn't penalize SpA)
- GENGAR_2: EVs Atk→SpA, Nature Adamant→Timid
- EXPLOUD_1: EVs Atk→SpA, Nature Impish→Modest
- WEEZING_1: EVs Atk→SpA, Nature Adamant→Bold
- PORYGON2_1: Aerial Ace→Thunderbolt, EVs→SpA, Nature→Modest
- DUSCLOPS_3: Nature Adamant→Hardy (neutral, preserves Shadow Ball STAB)
- DUSCLOPS_4: Nature Adamant→Hardy

**Category E — Hyper Beam replaced with physical Normal moves**
- SNORLAX_7: Hyper Beam→Return, Shadow Ball→Rock Slide
- AERODACTYL_2: Hyper Beam→Double-Edge, Ancient Power→Rock Slide
- URSARING_6: Hyper Beam→Return
- REGIROCK_5: Hyper Beam→Double-Edge
- DRAGONITE_3: Hyper Beam→Double-Edge
- DRAGONITE_4: Hyper Beam→Return

**Category F — Latias/Latios: Shadow Ball replaced on physical sets**
- LATIAS_7: Shadow Ball→Dragon Claw
- LATIOS_7: Shadow Ball→Dragon Claw

**Also fixed (build prerequisite):**
- Created `graphics/types/fairy.png`, `physical.png`, `special.png`, `status.png` (placeholder type icons)
- Created 6 cry WAV placeholders for new species (Lucario, Weavile, Riolu, Gible, Gabite, Garchomp)
