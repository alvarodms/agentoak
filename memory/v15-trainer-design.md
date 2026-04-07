# v1.5 "The Trainer Gauntlet" — Trainer Design Document

> Detailed specifications for the v1.5 trainer overhaul. Reference from strategy-notes.md.
> Created: C171 (planning cycle). Implementation: C172-C177.

---

## Current State Audit

### What's Already Done (Good Quality)
- **Gym Leaders 1-8**: Custom movesets + held items (C130-131). ITEM_CUSTOM_MOVES.
- **Elite Four + Champion**: Full competitive sets with coverage (C132). 5-6 mons each.
- **Gym Rematches**: 4 tiers each, all 8 gyms (C49-50, C54, C101-102).
- **E4 Rematches**: 4 tiers (C49-50, C54, C71).
- **Route trainers (102-125)**: v1.1 quality pass with anchor trainers (C146-150).
- **Route trainers (55-58 era)**: Routes 105-109, 110-123, Victory Road — early work, variable quality.
- **Villain trainers**: Maxie, Archie, admins, remnant grunts (C10-11, C122).
- **Draconid Kaelen**: Sky Pillar special trainer (C136).

### What Needs Work — Priority Order

| Priority | Category | Issue | Scope |
|----------|----------|-------|-------|
| **P0** | Rival Battles | All 30 parties use ItemDefaultMoves or NoItemDefaultMoves. No custom movesets. Team composition is C7/C12 era (160 cycles old). | 30 parties |
| **P1** | Gym Leader Team Sizes | Gyms 5-8 have only 3 mons (except T&L with 4). Late-game leaders should have 4. | 4 gym leaders, +1 mon each |
| **P2** | Victory Road Trainers | Only had C55-58 early pass. Not touched by v1.1 quality pass. | ~15 trainers |
| **P3** | Ocean Route Trainers (126-134) | Only C55-58 early pass. Swimmers still have generic teams despite v1.4 ocean encounter redesign. | ~25 trainers |
| **P4** | Cave Trainers (Mt. Pyre, Meteor Falls) | Variable quality from early cycles. | ~10 trainers |

---

## Design Principles

### Difficulty Tier: "Difficult But Fair"
Matches Inclement Emerald model — challenging but never unfair. Players who explore and prepare should succeed. Players who brute-force will struggle but never hit a wall.

### Item Availability (Gen 3)
**Available**: Choice Band, Leftovers, Sitrus Berry, Lum Berry, Oran Berry, type-boosting items (Charcoal, Mystic Water, Magnet, etc.), White Herb, Focus Band, Shell Bell, Scope Lens, Quick Claw, Bright Powder, King's Rock, Silk Scarf, Sharp Beak, Spell Tag, Dragon Fang, Miracle Seed, Black Belt, Soft Sand, Poison Barb, Metal Coat, Hard Stone, Never-Melt Ice, Twisted Spoon.

**NOT available**: Focus Sash, Life Orb, Choice Specs, Choice Scarf, Assault Vest, Rocky Helmet, Eviolite.

### IV Progression
| Stage | IV Value | Meaning |
|-------|----------|---------|
| Route 103 rival | 0-25 | Raw, untrained |
| Early gym (1-2) | 100-200 | Trained basics |
| Mid gym (3-5) | 200-250 | Serious trainer |
| Late gym (6-8) | 240-255 | Expert level |
| E4 + Champion | 250-255 | Near-perfect |

### Team Size Progression
| Battle | Team Size |
|--------|-----------|
| Gym 1-3 | 3 |
| Gym 4-5 | 3-4 |
| Gym 6-8 | 4 |
| E4 members | 5 |
| Champion | 6 |
| Rival (early) | 1-2 |
| Rival (mid) | 3 |
| Rival (late) | 4-5 |

---

## P0: Rival Battle Redesign

### Design Philosophy
The rival is the player's personal measuring stick. Each encounter should:
1. Show team growth (new mons, evolved forms, better moves)
2. Use species the player has access to but might have overlooked
3. Feature their starter as the ace (highest level, best moveset)
4. Include 1 migration species as their "signature companion" — the species they had from Route 103

### Rival Migration Companions (per player starter)
| Player Starter | Rival Starter | Rival Migration Companion | Evo Line |
|----------------|---------------|---------------------------|----------|
| Treecko | Torchic → Blaziken | Dratini → Dragonair → (no Dragonite, too strong) | Dragon |
| Torchic | Mudkip → Swampert | Bagon → Shelgon → (no Salamence) | Dragon |
| Mudkip | Treecko → Sceptile | Larvitar → Pupitar → (no Tyranitar) | Rock/Ground → Dark |

Note: Migration companions cap at Stage 2 for the rival. Full evolution (Dragonite/Salamence/Tyranitar) is reserved for E4.

### Battle 1: Route 103 (Lv 5)
**Current**: 1 mon, NoItemDefaultMoves. Migration companion only (no starter).
**Redesign**: 1 mon — the rival's STARTER at Lv 5. This is the player's introduction to type advantage. Tradition matters here.
- Party type: `NoItemDefaultMoves` (fine for Lv 5)
- The migration companion appears in Battle 2

| Variant | Species | Lv |
|---------|---------|-----|
| Player chose Treecko | Torchic | 5 |
| Player chose Torchic | Mudkip | 5 |
| Player chose Mudkip | Treecko | 5 |

### Battle 2: Rustboro City (Lv 13-15)
**Current**: 2 mons, NoItemDefaultMoves. Migration companion + another migration species. No starter!
**Redesign**: 2 mons — starter (evolved) + migration companion. `NoItemCustomMoves`.

| Variant | Mon 1 | Mon 2 (ace) |
|---------|-------|-------------|
| vs Torchic | Dratini Lv13 (Twister, Thunder Wave, Wrap, Leer) | Combusken Lv15 (Double Kick, Ember, Peck, Sand-Attack) |
| vs Mudkip | Bagon Lv13 (Bite, Headbutt, Leer, Ember) | Marshtomp Lv15 (Mud Shot, Water Gun, Rock Throw, Growl) |
| vs Treecko | Larvitar Lv13 (Bite, Rock Slide, Sandstorm, Leer) | Grovyle Lv15 (Absorb, Quick Attack, Pursuit, Leer) |

### Battle 3: Route 110 (Lv 18-20)
**Current**: 3 mons, ItemDefaultMoves. Two migration species + starter.
**Redesign**: 3 mons — migration companion + route-appropriate species + starter ace. `ItemCustomMoves`.

| Variant | Mon 1 | Mon 2 | Mon 3 (ace) |
|---------|-------|-------|-------------|
| vs Torchic | Dragonair Lv18 (Dragon Rage, Slam, Thunder Wave, Twister) [no item] | Breloom Lv18 (Mach Punch, Mega Drain, Headbutt, Stun Spore) [Oran Berry] | Combusken Lv20 (Double Kick, Flame Wheel, Peck, Bulk Up) [Sitrus Berry] |
| vs Mudkip | Shelgon Lv18 (Headbutt, Dragon Breath, Protect, Scary Face) [no item] | Manectric Lv18 (Spark, Bite, Quick Attack, Howl) [Oran Berry] | Marshtomp Lv20 (Mud Shot, Water Pulse, Rock Tomb, Protect) [Sitrus Berry] |
| vs Treecko | Pupitar Lv18 (Rock Slide, Bite, Scary Face, Sandstorm) [no item] | Hariyama Lv18 (Vital Throw, Fake Out, Knock Off, Sand-Attack) [Oran Berry] | Grovyle Lv20 (Leaf Blade, Quick Attack, Pursuit, Screech) [Sitrus Berry] |

### Battle 4: Route 119 (Lv 29-31)
**Current**: 3 mons, ItemDefaultMoves. Evolved migration + support + starter.
**Redesign**: 4 mons — migration companion + 2 diverse coverage mons + starter ace. `ItemCustomMoves`. This should feel like a genuine rival fight.

| Variant | Mon 1 | Mon 2 | Mon 3 | Mon 4 (ace) |
|---------|-------|-------|-------|-------------|
| vs Torchic | Dragonair Lv28 (Dragon Breath, Slam, Thunder Wave, Ice Beam) [Dragon Fang] | Breloom Lv28 (Mach Punch, Sky Uppercut, Leech Seed, Spore) [Black Belt] | Camerupt Lv28 (Earthquake, Flamethrower, Rock Slide, Amnesia) [Sitrus Berry] | Blaziken Lv31 (Blaze Kick, Sky Uppercut, Rock Slide, Bulk Up) [Charcoal] |
| vs Mudkip | Shelgon Lv28 (Dragon Claw, Headbutt, Protect, Scary Face) [Dragon Fang] | Manectric Lv28 (Thunderbolt, Bite, Quick Attack, Thunder Wave) [Magnet] | Ludicolo Lv28 (Surf, Giga Drain, Rain Dance, Ice Beam) [Miracle Seed] | Swampert Lv31 (Surf, Earthquake, Rock Slide, Protect) [Mystic Water] |
| vs Treecko | Pupitar Lv28 (Rock Slide, Crunch, Earthquake, Scary Face) [Hard Stone] | Hariyama Lv28 (Brick Break, Knock Off, Rock Slide, Fake Out) [Black Belt] | Crobat Lv28 (Aerial Ace, Sludge Bomb, Bite, Confuse Ray) [Sharp Beak] | Sceptile Lv31 (Leaf Blade, Dragon Claw, Crunch, Quick Attack) [Miracle Seed] |

### Battle 5: Lilycove City (Lv 33-36)
**Current**: 4 mons, ItemDefaultMoves.
**Redesign**: 5 mons — full team showing rival's growth. Migration companion + 3 diverse mons + starter ace. `ItemCustomMoves`. This is the final rival fight before the E4 stretch.

| Variant | Mon 1 | Mon 2 | Mon 3 | Mon 4 | Mon 5 (ace) |
|---------|-------|-------|-------|-------|-------------|
| vs Torchic | Dragonair Lv33 (Dragon Breath, Ice Beam, Thunder Wave, Slam) [Dragon Fang] | Breloom Lv33 (Sky Uppercut, Mach Punch, Spore, Leech Seed) [Black Belt] | Camerupt Lv33 (Earthquake, Flamethrower, Rock Slide, Amnesia) [Sitrus Berry] | Swellow Lv34 (Aerial Ace, Return, Steel Wing, Quick Attack) [Sharp Beak] | Blaziken Lv36 (Blaze Kick, Sky Uppercut, Rock Slide, Bulk Up) [Charcoal] |
| vs Mudkip | Shelgon Lv33 (Dragon Claw, Headbutt, Flamethrower, Protect) [Dragon Fang] | Manectric Lv33 (Thunderbolt, Flamethrower, Quick Attack, Thunder Wave) [Magnet] | Ludicolo Lv33 (Surf, Giga Drain, Ice Beam, Rain Dance) [Miracle Seed] | Torkoal Lv34 (Flamethrower, Body Slam, Amnesia, Yawn) [White Herb] | Swampert Lv36 (Earthquake, Surf, Ice Beam, Rock Slide) [Mystic Water] |
| vs Treecko | Pupitar Lv33 (Rock Slide, Crunch, Earthquake, Scary Face) [Hard Stone] | Hariyama Lv33 (Brick Break, Knock Off, Rock Slide, Belly Drum) [Sitrus Berry] | Crobat Lv33 (Aerial Ace, Sludge Bomb, Shadow Ball, Confuse Ray) [Sharp Beak] | Weezing Lv34 (Sludge Bomb, Flamethrower, Shadow Ball, Will-O-Wisp) [Lum Berry] | Sceptile Lv36 (Leaf Blade, Dragon Claw, Earthquake, Quick Attack) [Miracle Seed] |

---

## P1: Gym Leader Team Size Expansion

These leaders already have good movesets/items from C130-131. Add 1 mon each to make late-game gyms feel like boss fights.

### Norman (Gym 5) — Add Zangoose
Current: Kangaskhan (Lv27) / Tauros (Lv29) / Slaking (Lv31) — 3 mons
Add: **Zangoose Lv29** before Tauros. Swords Dance + Slash + Brick Break + Shadow Claw. Silk Scarf. IV 220.
- Rationale: Zangoose is Hoenn-native (Route 114 counterpart). Swords Dance makes it a sweep threat the player must stop. Shadow Claw covers Ghost-types that wall Normal.
- New order: Kangaskhan (Lv27) → Zangoose (Lv29) → Tauros (Lv30) → Slaking (Lv31)

### Winona (Gym 6) — Add Tropius
Current: Skarmory (Lv29) / Altaria (Lv31) / Swellow (Lv33) — 3 mons
Add: **Tropius Lv30** between Skarmory and Altaria. Aerial Ace + Solar Beam + Earthquake + Sunny Day. Sitrus Berry. IV 220.
- Rationale: Hoenn-native Grass/Flying. Sunny Day + Solar Beam is a surprise combo. Earthquake handles Electric counters. Adds type diversity (Grass/Flying vs Steel/Flying vs Dragon/Flying vs Normal/Flying).
- New order: Skarmory (Lv29) → Tropius (Lv30) → Altaria (Lv32) → Swellow (Lv33)

### Juan (Gym 8) — Add Whiscash
Current: Starmie (Lv42) / Ludicolo (Lv44) / Kingdra (Lv46) — 3 mons
Add: **Whiscash Lv43** after Starmie. Earthquake + Surf + Ice Beam + Rest. Lum Berry. IV 240.
- Rationale: Water/Ground typing gives Electric immunity, which breaks the common Grass+Electric strategy against Water gyms. Forces the player to rely on Grass only for this member. Hoenn native (R114 fishing).
- New order: Starmie (Lv42) → Whiscash (Lv43) → Ludicolo (Lv44) → Kingdra (Lv46)

### Flannery (Gym 4) — Add Torkoal
Current: Magmar (Lv25) / Arcanine (Lv27) / Houndoom (Lv29) — 3 mons
Add: **Torkoal Lv26** after Magmar. Flamethrower + Body Slam + Amnesia + Yawn. White Herb. IV 200.
- Rationale: Torkoal is Flannery's signature mon in vanilla. Its high Defense + Amnesia setup makes it a physical wall that Water-type attackers can handle but physical Ground-types struggle against. Yawn forces switches.
- New order: Magmar (Lv25) → Torkoal (Lv26) → Arcanine (Lv27) → Houndoom (Lv29)

---

## P2: Victory Road Trainer Quality Pass

Victory Road should be the final gauntlet before E4. Every trainer should feel like a challenge.

### Design Philosophy
- All trainers: `ITEM_CUSTOM_MOVES` with held items
- Cooltrainers/Ace Trainers: 3-4 mons, competitive movesets, AI: CHECK_BAD+TRY_FAINT+CHECK_VIABILITY+SETUP_FIRST_TURN
- Other classes: 2-3 mons, good coverage, AI: CHECK_BAD+TRY_FAINT+CHECK_VIABILITY
- Level range: Lv40-48 (just below E4's Lv44-58)
- Species should include strong final-stage Pokémon: Medicham, Hariyama, Camerupt, Claydol, Weezing, Dusclops, etc.
- Each trainer should have at least 1 coverage move that hits the player's likely team weaknesses

### Key Species to Feature
From Victory Road's v1.4 encounter tables + Hoenn thematic:
- Graveler, Golbat → Crobat, Lairon, Loudred → Exploud, Medicham, Hariyama
- Migration species at low rates: Pupitar (4%), Shelgon (1%)

Specific redesigns deferred to implementation cycle — C174 will read each trainer's current data and redesign individually.

---

## P3: Ocean Route Trainer Quality Pass

17 ocean routes now have unique encounter identities (v1.4). Swimmer trainers should reflect their route's theme.

### Design Philosophy
- Swimmers on Route 108 (toxic shipwreck): Grimer/Muk, Tentacruel, Koffing
- Swimmers on Route 122 (ghostly Mt. Pyre waters): Shuppet, Duskull, Tentacruel with Shadow Ball
- Swimmers on Route 133 (Horsea colony): Seadra, Horsea, Corsola
- Each ocean route's swimmers use species from that route's encounter table
- Level range matches encounter level + 2-5 (trainers slightly stronger than wilds)
- Most swimmers: 2-3 mons, `ITEM_DEFAULT_MOVES` with held items
- Anchor swimmers: `ITEM_CUSTOM_MOVES` with strategic movesets

Specific redesigns deferred to implementation cycle — C175 will map each route's encounter table to its trainers.

---

## Rival Team Verification Notes

### Move Legality (confirmed via MCP learnset data)
- Larvitar learns Rock Slide at Lv22 (level-up) and Bite at Lv1 — OK for Lv13+
- Larvitar learns Earthquake at Lv50 — Pupitar at Lv28 with Earthquake requires TM, which trainers can use. OK.
- Houndoom learns Flamethrower at Lv51 (level-up) or TM — trainer use OK at any level
- Kingdra learns Dragon Dance at Lv62 — not needed for rival (Dragonair doesn't evolve for rival)
- Dragonair: Dragon Breath (not in Gen 3 level-up but added via custom learnset in C127). Ice Beam via TM. OK.
- Breloom: Mach Punch (egg move), Sky Uppercut (Lv36 level-up or custom). Trainers aren't bound by level-up restrictions.
- Sceptile: Leaf Blade (Lv29), Dragon Claw (TM), Earthquake (TM). All legal.
- Blaziken: Blaze Kick (Lv36), Sky Uppercut (Lv59 or TM). OK for trainer use.
- Swampert: Earthquake (TM), Surf (HM), Ice Beam (TM), Rock Slide (tutor). All legal.

### Item Availability (confirmed Gen 3)
All held items in the designs are Gen 3 available: Dragon Fang, Charcoal, Black Belt, Hard Stone, Sharp Beak, Miracle Seed, Mystic Water, Magnet, Sitrus Berry, Oran Berry, Lum Berry, White Herb, Silk Scarf.
