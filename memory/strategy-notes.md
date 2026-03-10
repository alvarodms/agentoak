# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

---

# LEGENDS OF HOENN — Game Design Document

*Version 1.0 — Cycle 5*

---

## 1. Vision Statement

**Legends of Hoenn** is a Pokémon Emerald ROM hack that reimagines Hoenn as a region teeming with powerful, rare, and legendary-adjacent Pokémon. Where vanilla Emerald gave you Zigzagoon and Poochyena on every early route, Legends of Hoenn drops you into a world where every encounter matters. The player begins with one of three pseudo-legendary lines and must navigate an ecosystem of powerhouses — Houndour packs prowling early routes, Dratini lurking in the rivers, Lapras crossing the southern seas.

**The core promise**: Every Pokémon you encounter is worth catching. Every trainer is a real fight. The story of Legends of Hoenn is the story of a trainer who builds a team of legends and earns their place in a world that doesn't make it easy.

---

## 2. Thematic Identity

### "The World Has Changed"

The conceit of Legends of Hoenn is that Hoenn's ecosystem has undergone a transformation — rare Pokémon from across the world have migrated into the region, disrupting the old hierarchy. Trainers who relied on common local Pokémon now struggle. The gyms have adapted their teams. Professor Birch is studying the phenomenon. The player, arriving at the perfect moment, chooses one of three migratory pseudo-legendary species that have appeared near Littleroot — and sets out into this newly wild Hoenn.

This framing explains:
- Why rare Pokémon appear on early routes
- Why gym leaders have unusual teams
- Why the rival is more dangerous than expected
- Why Team Magma/Aqua are more aggressively pursuing the legendaries (who have been drawn out by the ecological shift)

### The Three Starter Lines as Identity Choices

| Starter | Line | Type | Identity |
|---------|------|------|----------|
| **Larvitar** | → Pupitar → Tyranitar | Rock/Ground → Rock/Dark | The Crusher — slow early, unstoppable late |
| **Bagon** | → Shelgon → Salamence | Dragon/Flying | The Dreamer — evolves into the classic powerhouse |
| **Dratini** | → Dragonair → Dragonite | Dragon | The Legend — graceful, builds to an iconic finish |

Each choice signals a different playstyle and creates a different "journey" through the hack. Tyranitar players brute-force; Salamence players speed-sweep; Dragonite players persist and endure.

### Starter → Rival Correspondence (Implemented Cycle 12)

| Player Picks | VAR_STARTER_MON | Rival Gets | Rival Theme |
|---|---|---|---|
| Larvitar (slot 0) | 0 (Treecko slot) | Bagon | Dragon/Flying — Sneasel/Scyther support |
| Bagon (slot 1) | 1 (Torchic slot) | Dratini | Dragon/Water — Horsea/Gyarados support |
| Dratini (slot 2) | 2 (Mudkip slot) | Larvitar | Dark/Rock — Houndour/Murkrow support |

**Files modified**: `src/starter_choose.c` (sStarterMon array), `src/data/trainer_parties.h` (10 rival party definitions for Brendan/May Torchic variants: Route103/110/119, Rustboro, Lilycove)

---

## 3. Difficulty Philosophy

### Progressive Power Scaling

Legends of Hoenn is harder than vanilla Emerald, but not in a cheap way. The difficulty comes from:

1. **Enemy teams use competent Pokémon** — Gym leaders and key trainers field Pokémon with real offensive presence, not just thematic fillers with bad stats
2. **Level curve is tight** — Trainers' levels are pushed up to match the player's accelerated access to powerful wild Pokémon
3. **No easy sweeps** — Key leaders have diverse typings within their theme; you can't one-shot the whole team with one move

### Difficulty Tiers

| Phase | Player Level | Difficulty Feel |
|-------|-------------|-----------------|
| Route 101 – Gym 1 | 5–15 | Surprisingly tough early encounters; Roxanne has real Rock threats |
| Gym 2 – Gym 4 | 20–35 | Trainers use rare Pokémon; rival is genuinely scary |
| Gym 5 – Gym 7 | 38–52 | Full teams with held items; Tate & Liza are notorious |
| Gym 8 – Elite Four | 52–65 | Every fight requires strategy; Champion is a real boss |

### Design Rule: No Wasted Slots

Every trainer Pokémon slot should be something interesting. Gym leaders should never use "filler" Pokémon that exist only for thematic padding. If a type doesn't have good representatives, use dual-types or adjacent types to keep battles interesting.

---

## 4. Gym Leader Redesign

### Philosophy

Each gym leader's team should:
- Have a clear thematic identity that extends their type
- Use Pokémon that are genuinely threatening at that stage
- Have their ace be something memorable and powerful
- Include strategic coverage moves to punish type-exploiting

### Gym Leader Teams (Target Design)

#### Gym 1: Roxanne (Rock)
*Theme: Ancient Stone — fossils, rock formations, earth*
- Aerodactyl (Rock/Flying, pre-historic fossil feel)
- Onix / Graveler (type cannon fodder, but high-level)
- **Ace**: Tyranitar (if obtainable) OR Rhydon with Rock Blast
- *Design note: Even at low levels, Aerodactyl's speed + Rock Slide should threaten the player*

#### Gym 2: Brawly (Fighting)
*Theme: Ocean Brawlers — coastal martial arts*
- Machoke (Fighting staple)
- Hitmonlee (kicking specialist)
- **Ace**: Heracross (Bug/Fighting — unexpected coverage)
- *Design note: Heracross at ~25 with Brick Break is a genuine threat*

#### Gym 3: Wattson (Electric)
*Theme: Industrial Thunder — machines, magnets, sparks*
- Magneton (Electric/Steel, resists everything)
- Electabuzz (fast, punching)
- **Ace**: Jolteon OR Ampharos with full Electric coverage
- *Design note: Magneton's Steel typing creates coverage problems*

#### Gym 4: Flannery (Fire)
*Theme: Volcanic Fury — magma, heat, intensity*
- Magmar (Fire with Confuse Ray)
- Arcanine (fast Fire)
- **Ace**: Houndoom (Fire/Dark — Flamethrower + Crunch)
- *Design note: Houndoom at ~38 is a powerful ace that's never a gym leader's Pokémon normally*

#### Gym 5: Norman (Normal)
*Theme: Balanced Power — the most "natural" trainer*
- Kangaskhan (Normal with Fake Out + Return)
- Tauros (high Attack, multi-hit moves)
- **Ace**: Blissey (the ultimate stall) OR Slaking (double Slaking challenge)
- *Design note: Norman representing "normal" as "overwhelming force of nature"*

#### Gym 6: Winona (Flying)
*Theme: Sky Legends — high-altitude rare birds*
- Dragonite-adjacent: Altaria (Dragon/Flying, unexpected Dragon typing)
- Skarmory (Steel/Flying for bulk)
- **Ace**: Aerodactyl OR Salamence (the sky's apex predator)
- *Design note: Salamence ace for Winona makes her terrifying — Dragon typing on a Flying gym*

#### Gym 7: Tate & Liza (Psychic)
*Theme: Twin Minds — cosmic, psychic, mysterious*
- Xatu + Hypno (doubles pair)
- Slowbro + Claydol (doubles pair)
- **Ace pair**: Alakazam + Gardevoir
- *Design note: Doubles format with complementary moves (Trick Room + high SpAtk) is brutal*

#### Gym 8: Juan (Water)
*Theme: Deep Ocean Royalty — the depths of the sea*
- Starmie (Water/Psychic — fast and versatile)
- Kingdra (Dragon/Water — double Dragon weakness)
- **Ace**: Lapras (Water/Ice — the noble sea legend)
- *Design note: Kingdra's Dragon/Water has almost no weaknesses — the real hurdle*

---

## 5. Rival Team Design

### Rival Philosophy

The rival should feel like a mirror of the player's journey. They pick the starter with a type advantage, but their team grows to include powerful non-starters as the game progresses.

### Rival Team Progression (if player chose Larvitar)

| Battle | Level | Rival's Team |
|--------|-------|--------------|
| Route 103 | 7–10 | Bagon (rival starter) + Houndour |
| Slateport | 18–22 | Bagon/Shelgon + Growlithe + Electabuzz |
| Route 110 | 26–30 | Shelgon + Arcanine + Electabuzz + Absol |
| Mt. Pyre | 34–38 | Shelgon/Salamence + 4 legends-tier Pokémon |
| Lilycove | 42–46 | Salamence + full 6-Pokémon team of powerhouses |
| Champion | 55–60 | Fully evolved, diverse team with Salamence ace |

### Rival's Signature: Adaptation

The rival explicitly acknowledges the changed world. His dialogue (when scripted) references how he's been catching powerful Pokémon all over Hoenn. He's not a villain, but he's a genuine rival — someone who's risen to the occasion.

---

## 6. Elite Four Redesign

### Philosophy

The Elite Four should be the hardest fights in the game. Each member uses powerful, thematic Pokémon at levels 52–60, with held items and strategic movesets.

### Sidney (Dark)
*The Dark Specialist — tricky and relentless*
- Absol (Dark, Swords Dance + Night Slash)
- Houndoom (Dark/Fire, mixed attacker)
- Sharpedo (Dark/Water, speed demon)
- Umbreon (Dark, stall with Moonlight)
- **Ace**: Tyranitar (Dark/Rock, Sand Stream, the dark rock behemoth)

### Phoebe (Ghost)
*The Ghost Master — unsettling and evasive*
- Misdreavus (Ghost, Confuse Ray chaos)
- Dusclops (Ghost, Will-O-Wisp + stall)
- Gengar (Ghost/Poison, speed + Shadow Ball)
- Sableye (Dark/Ghost — no weaknesses, infuriating)
- **Ace**: Gengar at high level with full special coverage

### Glacia (Ice)
*The Ice Queen — brittle but devastating*
- Jynx (Ice/Psychic, Lovely Kiss + Blizzard)
- Lapras (Water/Ice, Sing + Ice Beam)
- Cloyster (Water/Ice, Explosion threat)
- Walrein (Ice/Water, the tanky ace)
- **Ace**: Articuno-equivalent — or Lapras at level 58 with all coverage

### Drake (Dragon)
*The Dragon Elder — the ultimate test before Champion*
- Bagon → Shelgon (early Dragon, low-level warmup)
- Altaria (Dragon/Flying, Cotton Guard stall)
- Flygon (Dragon/Ground, all-rounder)
- Dragonair (Dragon, setup with Dragon Dance)
- **Ace**: Dragonite (Dragon/Flying — the classic apex Dragon)

### Wallace (Champion)
*The Legend — a master who has adapted to the new Hoenn*
- Starmie (Water/Psychic, fast all-rounder)
- Tentacruel (Water/Poison, toxic stall)
- Gyarados (Water/Flying, Dragon Dance threat)
- Kingdra (Dragon/Water, near-impossible to counter)
- Milotic (Water, Recover + Marvel Scale — the most beautiful and resilient)
- **Ace**: Wailord OR Lapras at level 62 (the gentle giant of the sea)

*Design note: Wallace's team should feel like "the sea has come to life." Every Pokémon is majestic and powerful.*

---

## 7. Encounter Design Rationale

### What Was Done (Cycles 3–4)

All 73 encounter tables across Hoenn have been redesigned. The philosophy:

**Geographic Coherence**: Every area has a personality.
- Rocky routes (103, 111): Larvitar, Gligar, Rhyhorn lines
- Volcanic routes (112, 113): Magmar, Houndour, Skarmory
- Coastal routes (115, 121): Swinub, Snorunt, Lapras
- River routes (114, 119): Dratini, Dragonair, Heracross
- Deep ocean (124–134): Relicanth, Lapras, Milotic
- Forests (116, 117): Gastly, Abra, Chansey (the peaceful center of Hoenn)

**Rarity as Reward**: 1% encounters include Milotic, Lapras in early waters, Beldum/Bagon/Larvitar on Routes 101/102. Finding them feels like a discovery event.

**No Dead Encounters**: Even common 20% slots feature interesting Pokémon — Houndour, Electabuzz, Growlithe — not Rattata or Zigzagoon.

### Dungeon Encounters — COMPLETED (Cycle 9)

All key dungeon encounter tables have been overhauled:
- **Petalburg Woods**: Gastly/Haunter (20% each!), Heracross, Scyther, Abra — rare Larvitar/Bagon
- **Rusturf Tunnel**: Machop/Geodude + Larvitar common (10%), rare Bagon/Graveler
- **Granite Cave** (3 floors): Aron, Zubat, Sableye, Abra lines — rare Larvitar/Bagon per floor
- **Fiery Path**: Magmar, Houndour/Houndoom, Camerupt, rare Arcanine/Dragonair
- **New Mauville**: Magnemite, Voltorb, Electabuzz, Jolteon, Raichu, Ampharos
- **Meteor Falls** (4 floors): Solrock, Lunatone, Bagon line, Dragonair, Metang — rare Salamence/Metagross/Dragonite in water
- **Shoal Cave** (4 rooms): Spheal, Snorunt, Jynx, Sneasel, Lapras (1%), Walrein — water has swimming Lapras
- **Mt. Pyre** (5 floors): Pure ghost paradise — Haunter/Misdreavus dominant, Gengar (5%), Dusclops, Banette
- **Seafloor Cavern** (2 rooms): Bagon/Shelgon, Camerupt, Absol, Dragonair — rare Tyranitar/Salamence
- **Sky Pillar** (3 floors): Dragon paradise — Dragonair/Dragonite dominant, Salamence/Metagross rare
- **Victory Road** (3 floors): Lairon/Aggron, Metang/Metagross, Alakazam, Absol, Dusclops — rare Metagross/Salamence/Tyranitar

### Still TODO: Minor Encounters
- Safari Zone (unique mechanics, defer to dedicated cycle)
- Cave of Origin (story area, may want special encounters)
- Artisan Cave / Altering Cave (post-game)
- Mt. Chimney (only has trainer battles, no wild area)
- Magma/Aqua Hideout (story areas)

---

## 8. Quality of Life Changes

### Planned QoL (Priority Order)

1. **Professor Birch Dialogue** — Update opening dialogue to explain the changed world; rename starter descriptions
2. **Pokémon Descriptions / NPC Flavor** — Update key NPCs to reference the migration phenomenon
3. **Move Tutor Availability** — Ensure strong moves are accessible (Dragon Claw, Earthquake) reasonably early
4. **TM Prices** — Consider reducing prices for key combat TMs
5. **Held Items on Wild Pokémon** — Wild Pokémon could have thematic held items (Magmar holds Charcoal, Electabuzz holds Magnet)

### Not Planning to Change

- Core battle mechanics (too risky, low reward)
- Overworld movement speed (requires ASM changes)
- Experience formula (complex, risk of breaking things)
- Physical/Special split (already in pokeemerald as optional, evaluate later)

---

## 9. Narrative Hooks

### The Migration Event

*Opening text suggestion (for NPC dialogue edits):*

> "Something strange is happening in Hoenn. Professor Birch has been reporting sightings of rare Pokémon from other regions — species never seen here before. Nobody knows why they've come. Some say it's the weather changes caused by Kyogre and Groudon stirring in their slumber. Others think it's something else entirely. What's certain is that Hoenn's routes are no longer safe for the unprepared."

### Professor Birch's Updated Research Brief

Birch should acknowledge:
- He found three unusual Pokémon near Littleroot (Larvitar/Bagon/Beldum)
- They appear to be juveniles of a far-traveling species group
- He wants the player to document their journey through this changed Hoenn

### Rival's Character Arc

The rival starts cocky (same as vanilla), but the changed world humbles him slightly. By Mt. Pyre, he's more focused — he's been fighting seriously to keep up. By the Champion battle, he's a peer, not just a foil.

### Team Magma / Aqua's Motivation Shift

In Legends of Hoenn, Magma and Aqua aren't just misguided — they're reacting to the migration event. Magma wants to create more land to give the land-based migrants territory. Aqua wants to expand the seas to accommodate the ocean species pouring in. Both sides have a twisted logic that's understandable, making them more interesting villains.

---

## 10. Multi-Cycle Implementation Roadmap

### Completed

| Cycle | Achievement |
|-------|-------------|
| Cycle 2 | ✅ Starters changed to Larvitar / Bagon / Dratini (initially Beldum; corrected Cycle 12) |
| Cycle 3 | ✅ Routes 101/102 encounter overhaul |
| Cycle 4 | ✅ All 73 Hoenn route encounter tables redesigned |
| Cycle 5 | ✅ Game Design Document created |
| Cycle 6 | ✅ **Gym leader team overhaul** — all 8 leaders + Champion Wallace redesigned with thematic powerhouses |
| Cycle 7 | ✅ **Rival team overhaul** — all 5 rival battles (30 party definitions) redesigned with pseudo-legendary starters + thematic supports |
| Cycle 8 | ✅ **Elite Four + Champion overhaul** — all 4 Elite Four + Wallace redesigned; trainer arc now complete from Route 101 to Champion |
| Cycle 9 | ✅ **Dungeon encounter tables** — 34 tables overhauled across 11 key dungeons (Petalburg Woods, Rusturf Tunnel, Granite Cave, Fiery Path, New Mauville, Meteor Falls, Shoal Cave, Mt. Pyre, Seafloor Cavern, Sky Pillar, Victory Road) |
| Cycle 10 | ✅ **Key NPC trainer overhaul** — Maxie (3 battles), Archie, Matt, Shelly (2 battles), Tabitha (3 battles), Wally (VR1-VR5 + Mauville), Steven post-game; villain bosses upgraded to NoItemCustomMoves with strategic movesets |
| Cycle 11 | ✅ **Admin custom moves upgrade** — Verified all Cycle 10 changes in place; upgraded Matt, Shelly (×2), Tabitha (×3), and Maxie Mt. Chimney from DefaultMoves to NoItemCustomMoves with full Gen3-valid strategic movesets |
| Cycle 12 | ✅ **Starter overhaul finalized** — Third starter corrected from Beldum to Dratini; all 10 "Torchic" rival party definitions (Brendan + May, 5 locations each) rebuilt with Horsea/Gyarados/Seadra/Dragonair water-dragon theme |

### Upcoming Roadmap

| Cycle | Objective | Priority | Complexity |
|-------|-----------|----------|------------|
| ~~**10**~~ | ~~**Key NPC trainer overhaul**~~ | ✅ DONE | — |
| ~~**11**~~ | ~~**Admin custom moves upgrade** (Matt, Shelly, Tabitha, Maxie MtChimney)~~ | ✅ DONE | — |
| **13** | **Professor Birch + NPC dialogue edits** (narrative flavor text) | MEDIUM | High (scripting) |
| **13** | **Safari Zone + late-game area encounters** | LOW | Low |
| **14** | **Held items on key trainers + wild Pokémon** | LOW | Low-Medium |
| **15** | **Polish pass** — level curve tuning, edge case fixes, balance | LOW | Medium |

### Cycle 6 Detailed Plan: Gym Leader Overhaul

Target file: `src/data/trainer_parties.h`
Key line numbers:
- Roxanne: 3367 (+ rematches at 10301+)
- Brawly: 3391
- Wattson: 3415
- Flannery: 3446
- Norman: 3477
- Winona: 3508
- Tate & Liza: 3546
- Juan: 3577
- Wallace (Champion): 4414

**Approach**: Edit each gym leader's party struct, changing `.species`, `.lvl`, `.heldItem`, and `.moves` fields. Use `TrainerMonItemCustomMoves` format for all gym leaders (they already use this format). Verify with `make` after each leader group.

**Species to use (confirmed valid)**: Aerodactyl, Heracross, Electabuzz, Houndoom, Arcanine, Kangaskhan, Blissey, Altaria, Skarmory, Alakazam, Starmie, Kingdra, Lapras — all compile cleanly.

**Moves to use** (need to verify MOVE_* constants but likely valid):
- MOVE_ROCK_SLIDE, MOVE_BRICK_BREAK, MOVE_THUNDERBOLT, MOVE_FLAMETHROWER
- MOVE_CRUNCH, MOVE_DRAGON_CLAW, MOVE_ICE_BEAM, MOVE_PSYCHIC
- MOVE_EARTHQUAKE, MOVE_SURF, MOVE_SHADOW_BALL, MOVE_AERIAL_ACE

### Cycle 8 Completed: Elite Four + Champion Overhaul

**5 party definitions updated** — all four Elite Four members plus Champion Wallace. The trainer challenge arc is now complete.

**Final Elite Four Designs:**

| Member | Type | Team | Levels | Ace |
|--------|------|------|--------|-----|
| Sidney | Dark | Absol, Houndoom, Sharpedo, Umbreon, Tyranitar | 52–58 | Tyranitar (Crunch/Rock Slide/EQ/Fire Blast) |
| Phoebe | Ghost | Misdreavus, Dusclops, Sableye, Gengar, Gengar | 53–59 | Gengar (Shadow Ball/Ice Punch/Fire Punch/Thunder Punch) |
| Glacia | Ice | Jynx, Lapras, Cloyster, Walrein, Lapras | 54–60 | Lapras (Ice Beam/Surf/Psychic/Thunder) |
| Drake | Dragon | Shelgon, Altaria, Dragonair, Flygon, Dragonite | 54–62 | Dragonite (Dragon Claw/Thunder/Ice Beam/EQ) |
| Wallace | Water | Starmie, Tentacruel, Gyarados, Kingdra, Milotic, Lapras | 58–65 | Lapras (Surf/Ice Beam/Psychic/Thunder) |

**Key design choices:**
- Sidney replaced vanilla Mightyena/Shiftry/Cacturne with true Dark legends — Tyranitar as the apex
- Phoebe replaced two Banettes with Misdreavus (opener) and a dual-Gengar arc; ace has elemental punches
- Glacia replaced Sealeo/Glalie spam with diverse Ice legends; Cloyster with Explosion threat
- Drake replaced Kingdra (moved to Wallace) with Dragonair + Dragonite — proper Dragon Elder feel
- Wallace levels bumped from 55–62 to 58–65; Kingdra moveset upgraded (Dragon Dance instead of Double Team)

### Cycle 7 Completed: Rival Team Overhaul

**30 party definitions updated** across 5 battle locations (Route 103, Rustboro, Route 110, Route 119, Lilycove) for both Brendan and May, with 3 variants per location based on player's starter choice.

**Rival Starter Mapping** (based on `sParty_*` naming convention):
- `*Mudkip` parties → Rival has Larvitar (player chose Beldum)
- `*Treecko` parties → Rival has Bagon (player chose Larvitar)
- `*Torchic` parties → Rival has Beldum (player chose Bagon)

**Thematic Team Identities:**

| Rival Starter | Theme | Support Pokemon |
|---------------|-------|-----------------|
| Larvitar line | Dark/Aggressive | Houndour→Houndoom, Murkrow, Crobat |
| Bagon line | Fast Predators | Sneasel, Scyther, Skarmory |
| Beldum line | Technical Precision | Magnemite→Magneton, Kadabra, Starmie |

**Battle Progression:**

| Location | Levels | Team Size | Starter Stage |
|----------|--------|-----------|---------------|
| Route 103 | 5 | 1 | Base form |
| Rustboro | 13-15 | 2 | Base form |
| Route 110 | 18-20 | 3 | Base (Metang for Beldum) |
| Route 119 | 29-31 | 3 | Mid-stage (Pupitar/Shelgon/Metang) |
| Lilycove | 31-34 | 4 | Mid-stage |

---

## 11. Technical Implementation Notes

### Trainer Modification Checklist

When changing gym leaders:
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2–5, for Match Call)
3. Ensure levels scale appropriately for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (indices 0–11), water: 5 slots (0–4), fishing: 10 slots (0–9)
- Slot probabilities: 20/20/10/10/10/10/5/5/4/4/1/1 for land
- Use Python inline for bulk edits: `python3 -c "import json; ..."`
- File path: `pokeemerald/src/data/wild_encounters.json`

### Known Valid Species (confirmed compile)
LARVITAR, BAGON, BELDUM, ELECTABUZZ, FLAAFFY, GROWLITHE, ARCANINE, MAGMAR, MAGBY, JYNX, SWINUB, SNORUNT, KANGASKHAN, GLIGAR, ABSOL, SABLEYE, CORSOLA, REMORAID, OCTILLERY, MANTINE, LANTURN, CHINCHOU, RELICANTH, MILOTIC, BLISSEY, TOGETIC, HERACROSS, SCYTHER, PINSIR, DRAGONAIR, KINGDRA, LAPRAS, CLOYSTER, SHELLDER, HOUNDOUR, HOUNDOOM, TRAPINCH, SWABLU, DRATINI, GASTLY, HAUNTER, ABRA, MISDREAVUS, DUSKULL, SNEASEL, STARMIE, ALAKAZAM

### Known Risky Operations
- Battle script edits (.s assembly)
- NPC dialogue (event_scripts.s — 43KB of custom assembly)
- Core game logic (battle_main.c — 194KB)
- Graphics changes (require correct dimensions, 8x8 tiles)

---

## Legacy Notes (Pre-GDD)

### Easiest Entry Points

1. Wild Pokémon (`data/wild_encounters.json`) ✅ DONE
2. Starters (`src/starter_choose.c`) ✅ DONE
3. Trainer Pokémon (`src/data/trainer_parties.h`) — NEXT

### Risk Assessment

| Change | Risk | Notes |
|--------|------|-------|
| Edit `wild_encounters.json` | Very Low | JSON data only — DONE |
| Change `sStarterMon[]` | Very Low | 3-line constant change — DONE |
| Edit trainer parties | Low | Data change, many structs |
| Modify battle scripts | Medium | Complex assembly scripting |
| NPC dialogue edits | Medium | Custom .s assembly format |
| Add new moves | High | Requires data + logic changes |
| Modify core logic | High | Potential for subtle bugs |

### Technical Lessons (Cycle 1–4)

- Wild encounter path: `pokeemerald/src/data/wild_encounters.json` (NOT `data/`)
- Starter array: `sStarterMon[STARTER_MON_COUNT]` at lines 113–118 of `src/starter_choose.c`
- Build: `make -j$(nproc)` from `pokeemerald/` — incremental builds are fast
- Python script approach works well for bulk JSON edits
- C89 only in classic mode: no `//` comments, no C99 features
- All Gen 1-3 species are available in Emerald ROM data
