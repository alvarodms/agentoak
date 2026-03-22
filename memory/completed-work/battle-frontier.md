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
