# Sky Pillar Arc & Rematch Team Design — Detailed Specs

**Cycle**: 134 | **Status**: Design complete, awaiting implementation (C135-139)

---

## Sky Pillar Encounter Tables (12-slot land format)

Probabilities: 20/20/10/10/10/10/5/5/4/4/1/1

### SkyPillar_1F — "Haunted Ruins" (encounter_rate: 10)
| Slot | Species | Min | Max | Notes |
|------|---------|-----|-----|-------|
| 0-1 (20% each) | GOLBAT | 45 | 45 | Common — cave staple |
| 2-3 (10% each) | CLAYDOL | 46 | 46 | Ancient psychic sentinel |
| 4-5 (10% each) | BANETTE | 46 | 47 | Ghost ambusher |
| 6-7 (5% each) | SABLEYE | 45 | 46 | Dark/Ghost scout |
| 8-9 (4% each) | DUSCLOPS | 47 | 48 | Rare defensive ghost |
| 10-11 (1% each) | XATU | 48 | 48 | Psychic/Flying — oracle theme |

### SkyPillar_3F — "Ancient Sentinels" (encounter_rate: 10)
| Slot | Species | Min | Max | Notes |
|------|---------|-----|-----|-------|
| 0-1 (20% each) | CLAYDOL | 48 | 49 | Dominant — pillar guardians |
| 2-3 (10% each) | ALTARIA | 49 | 50 | Dragon/Flying — altitude theme |
| 4-5 (10% each) | DUSCLOPS | 48 | 49 | Ghost sentries |
| 6-7 (5% each) | XATU | 49 | 50 | Psychic/Flying oracle |
| 8-9 (4% each) | BANETTE | 49 | 50 | Physical ghost threat |
| 10-11 (1% each) | FLYGON | 51 | 51 | Rare dragon sighting |

### SkyPillar_5F — "Dragon's Domain" (encounter_rate: 10)
| Slot | Species | Min | Max | Notes |
|------|---------|-----|-----|-------|
| 0-1 (20% each) | ALTARIA | 51 | 52 | Common dragon |
| 2-3 (10% each) | FLYGON | 52 | 53 | Ground/Dragon powerhouse |
| 4-5 (10% each) | CLAYDOL | 51 | 52 | Persistent guardian |
| 6-7 (5% each) | AERODACTYL | 53 | 54 | Ancient flying predator |
| 8-9 (4% each) | SHELGON | 53 | 54 | Pre-evo dragon — tanky |
| 10-11 (1% each) | SALAMENCE | 55 | 55 | Ultra-rare apex predator |

**Design notes**: No encounters on 2F/4F (puzzle floors) or Top (boss). Encounter rate stays at 10 (vanilla) — low enough to not frustrate puzzle navigation but high enough to make the climb feel dangerous. Salamence at 1% on 5F is a prestige encounter — players will talk about finding one.

---

## Draconid Trainer (Optional — 3F)

**Identity**: Remnant of the ancient civilization that built Sky Pillar. Tests whether the player is worthy to meet the Guardian.

| Species | Level | Held Item | Moves |
|---------|-------|-----------|-------|
| Altaria | 50 | None | Dragon Pulse, Flamethrower, Sing, Safeguard |
| Flygon | 51 | None | Dragon Pulse, Earthquake, Crunch, Dragon Dance |
| Shelgon | 50 | None | Dragon Claw, Protect, Iron Defense, Crunch |

Uses `NO_ITEM_CUSTOM_MOVES` struct. Reward: Dragon Scale (ITEM_DRAGON_SCALE). This trainer does NOT appear in rematches.

---

## Rematch Tier Design Specs

### Level Curve Across Tiers
| Tier | Context | Ace Level | Team Size |
|------|---------|-----------|-----------|
| Base | Story progression | Per gym (15-46) | 3-6 |
| Tier 1 | Post-E4 first rematch | Base +10 | +1 mon |
| Tier 2 | After 2+ rematches | Base +18 | +1 mon |
| Tier 3 | After 4+ rematches | Base +25 | 6 |
| Tier 4 | Final form | Base +30 | 6 + held items |

### Per-Leader Rematch Highlights

**Roxanne** (Rock): Base ace Nosepass Lv15 → T4 ace Aerodactyl Lv45 w/ Stone Edge. Adds Golem (T1), Omastar (T2), Kabutops (T3). Fossil specialist identity.

**Brawly** (Fighting): Base ace Heracross Lv18 → T4 ace Heracross Lv48 w/ Close Combat + X-Scissor. Adds Blaziken (T2), Medicham (T3 w/ Zen Headbutt). Bug/Fight dual identity.

**Wattson** (Electric): Base ace Jolteon Lv24 → T4 ace Jolteon Lv54 w/ Thunderbolt. Adds Electrode (T1), Raichu (T2), Magneton (T3 w/ Flash Cannon). Speed+special theme.

**Flannery** (Fire): Base ace Houndoom Lv29 → T4 ace Arcanine Lv59 w/ Flare Blitz. Adds Camerupt (T1), Ninetales (T2), Magmar→new ace rotation (T3). Sun+power theme.

**Norman** (Normal): Base ace Slaking Lv31 → T4 ace Slaking Lv61 w/ Shadow Claw + Earthquake. Adds Snorlax (T2), Ursaring (T3). Power + coverage identity.

**Winona** (Flying): Base ace Swellow Lv33 → T4 ace Swellow Lv63 w/ Brave Bird. Adds Crobat (T1), Dodrio (T2), Aerodactyl (T3). Speed+aggression theme.

**Tate & Liza** (Psychic): Base 4-mon doubles → T4 6-mon Lv72. Adds Gardevoir (T1), Espeon (T2), Starmie (T3). Psychic coverage specialists.

**Juan** (Water): Base ace Kingdra Lv46 → T4 ace Kingdra Lv76 w/ Dragon Pulse + Rain Dance. Adds Vaporeon (T1), Gyarados (T2 w/ Aqua Tail), Milotic (T3). Rain synergy mastery.

---

## Flag Allocation for v7.0

From the 0x264 block (~74 remaining after v6.0's ~14):
- `FLAG_SKY_GUARDIAN_QUEST_ACTIVE` (0x272) — Set when Birch sends player to Pacifidlog
- `FLAG_PACIFIDLOG_ELDER_SPOKEN` (0x273) — Elder lore delivered
- `FLAG_CAUGHT_RAYQUAZA` (0x274) — Rayquaza captured (world reaction trigger)
- `FLAG_DEFEATED_RAYQUAZA` (0x275) — Rayquaza defeated but not caught
- `FLAG_HIDE_SKY_PILLAR_DRACONID` (0x276) — Hide Draconid trainer after defeat
