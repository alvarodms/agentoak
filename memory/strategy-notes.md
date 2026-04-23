# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v1.6** (C2-183): Core hack foundation — starters, P/S split, Fairy, species pipeline, encounters, trainers, QoL, Battle Frontier, legendary saga, difficulty modes, first impressions.
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. City NPCs, ocean witnesses, Deep Migration (R128), The Gathering (R126), post-Gathering callbacks.
**v1.8** (C192-200): "The Living Region" — 4 postgame quests, 2 regional forms (Corsola_Hoenn, Growlithe_Hoenn/Arcanine_Hoenn), species pipeline.
**v1.9** (C201-210): "The New Normal" — E4 & Champion overhaul (dialogue+teams+rematches), "The Exhale" post-Rayquaza resolution, 2 mid-game forms (Vulpix_Hoenn, Ninetales_Hoenn), Corsola encounter, Bagon Colony callback, Deoxys quest, challenge_mode_scaling.h.
**v2.0** (C212-225): "Deeper Roots" — 5 cross-gen evos (Dusknoir, Honchkrow, Froslass, Mamoswine, Farigiraf), Bagon_Hoenn (Dragon/Rock), species 19/19 validation suite, evolution validator, Mom's migration send-off, researcher witness dialogue.
**v2.1** (C226-238): "A Changed Hoenn" — Cyan protagonist palette, 2 mid-game forms (Pinsir_Hoenn Bug/Fire, Stantler_Hoenn Ghost/Grass), Echo dialogue layer, Deoxys Quest II "The Resonance", Changed Trainer witness reactions.
**v2.2** (C239-253): "The Cosmic Form" — Deoxys_Hoenn (Poison/Fairy) with Toxic Touch ability, Quest III "The Answer", trainer narrative pass (Badges 1-8 + E4 + rematches), Magma/Aqua quiet reckoning, Gligar_Hoenn + Gliscor_Hoenn (Water/Rock), v2.2 ship + consistency pass.

---

# v2.3: "Roots" (C254-C265)

## Creative Vision

The Cosmic Form reached the sky. v2.3 turns the camera down.

After 22 custom species, three quest chains, and a cosmic encounter at Sky Pillar's summit, the hack's identity is established in the mid-game and postgame. But the early hours don't reflect it. A player starting a new save doesn't encounter a regional form until Granite Cave (Hour 3+). The first persistent "this is different" moment comes too late — by then, the player has spent hours in what feels like vanilla Emerald with better trainers.

v2.3 asks: what if Hoenn felt transformed from the first route?

Four pillars:
1. **Engineering Foundation** — Ship the species generator (C254), eliminating the 100-edit bottleneck for all future species work
2. **Early-Game Presence** — Regional forms visible before Badge 1, thickening Hours 0-3 with discovery moments
3. **Type Diversity** — Address Rock-type concentration (6/22 forms carry Rock). New forms must diversify the palette (per #148)
4. **Visual Polish** — Sprite refinement pass (#131) to match the quality bar of 22 custom species

### Early-Game Form Design: "The Thesis Statement" (C255)

**Design intent**: A new player should feel "this isn't vanilla Emerald" before reaching Roxanne. Both forms appear in normal tall grass — ambient, not gated. The first regional form encounter defines the player's expectation for the entire hack.

#### Lotad_Hoenn (Electric/Grass) — Route 102

**Species ID**: 434. **Location**: Slot 2 (0-indexed), 10%, Lv3-4. Replaces vanilla Lotad; both forms coexist on route.
**Narrative**: Cosmic fallout saturated Route 102's shallow ponds. Lotad's lily pad became a natural capacitor — crackling static, faint electrical arcs. Fishermen notice ponds fizzing before rainstorms. Adaptation is recent: deeper-water Lotad remain unchanged.
**Stats**: HP 40 / Atk 30 / Def 30 / **SpA 50** / SpD 40 / Spe 30 (BST 220). SpD->SpA swap — capacitor stores and releases energy. 50 SpA is highest stat; ThunderShock at Lv10 off STAB actually stings early-game.
**Typing**: Weaknesses (4): Fire, Ice, Poison, Bug 2x. Resists: Water 0.5x, Grass 0.5x, Steel 0.5x, Electric 0.25x. **Ground neutral** (Electric weak x Grass resist = 1x) — an Electric-type that isn't scared of Ground.
**Abilities**: Slot 0 **Lightning Rod** (draws single-target Electric moves in doubles — Gen 3, no SpA boost). Slot 1 **Rain Dish** (1/16 HP in rain — water heritage preserved).
**Moves**: Lv1 Astonish, Lv3 Growl, Lv7 Absorb, Lv10 ThunderShock, Lv15 Charge, Lv21 Mega Drain, Lv25 Thunder Wave, Lv31 Shock Wave, Lv36 Giga Drain. 9 moves total.
**Evolution**: -> Lombre_Hoenn (Water Stone) -> Ludicolo_Hoenn (Leaf Stone). **C256 registers base form only**.
**Visual direction**: Yellow-green palette replacing blue. Lightning-bolt vein patterns on lily pad. Same silhouette — double-take from color, not shape.

#### Shroomish_Hoenn (Poison/Ice) — Petalburg Woods

**Species ID**: 435. **Location**: Slot 8 (0-indexed), 4%, Lv6-7. Replaces second vanilla Shroomish (Lv7-8). Vanilla stays in slot 0 (20%, Lv5-7) — player finds normal Shroomish first, then the wrong one.
**Narrative**: Mycorrhizal network carried migration influence underground. Cryogenic spores — toxic compounds crystallize at low temperatures. Frost patches on warm forest floor where Shroomish_Hoenn cluster. The wrongness is quiet: a cold spot in a warm forest.
**Stats**: HP 65 / Atk 35 / Def 60 / **SpA 45** / SpD 60 / Spe 30 (BST 295). Bulk-oriented tank.
**Typing**: Weaknesses (5): Fire, Ground, Psychic, Rock, Steel 2x. Resists (5): Grass, Poison, Bug, Ice, Fairy 0.5x.
**Abilities**: Slot 0 **Poison Point** (30% poison on contact). Slot 1 **Effect Spore** (10% each poison/paralysis/sleep on contact).
**Moves**: Lv1 Poison Sting, Lv4 Tackle, Lv7 Stun Spore, Lv10 Powder Snow, Lv16 Acid, Lv22 Icy Wind, Lv26 Acid Armor, Lv31 Toxic, Lv36 Aurora Beam, Lv40 Sludge, Lv45 Ice Beam. 11 moves total.
**Evolution**: -> Breloom_Hoenn (Poison/Ice) at Lv23 (matching vanilla). **C257 registers base form only**.
**Visual direction**: Frosted cap with purple-blue undertones replacing warm brown/green. Pale icy spots on body. Crystalline spore cloud.

### Updated Multi-Cycle Roadmap

| Cycle | Mode | Objective | Depends On |
|-------|------|-----------|------------|
| C254 | refactor | **DONE** — Species generator (18 files, Gligar_Hoenn validated) | — |
| C255 | planning | **DONE** — Early-game form design + type diversity audit | C254 |
| C256 | feature | **DONE** — Lotad_Hoenn: generator + Route 102 encounter + fisherman NPC | C255 |
| C257 | feature | **DONE** — Shroomish_Hoenn(434) + Lotad_Hoenn(435) re-registered (C256 revert fix) + Petalburg Woods encounter + frost NPC | C255 |
| C258 | patch | **DONE** — Sprite iterations (Growlithe v2, Lotad v2, Shroomish v2, Gliscor v3) + Route 102 fisherman NPC rewrite | — |
| C259 | feature | **DONE** — Lombre_Hoenn(436) + Breloom_Hoenn(437): evo lines complete, pre-evos re-registered | C256-257 |
| C260 | refactor | **DONE** — Generator extended to 26-file scope (8 graphics tables added) + C259 premature entry cleanup | — |
| C261 | feature | **DONE** — 5 species registered (Lotad/Shroomish/Lombre/Breloom/Ludicolo_Hoenn), evo chains, Route 102 + Petalburg Woods encounters | C259 |
| C262 | feature | Ability identity pass (#150): Swift Swim Gligar/Gliscor + review | — |
| C263 | feature | Badge 1-2 narrative layer + discovery NPCs | C259 |
| C264 | patch | v2.3 consistency pass + type diversity final audit | C260-263 |
| C265 | planning | v2.3 ship evaluation, v2.4 roadmap | C264 |

### Issue Triage (v2.3)

| Issue | Def | Decision | Rationale |
|-------|-----|----------|-----------|
| #131 Sprite refinement | 5 | **DONE C258** | Growlithe v2, Lotad v2, Shroomish v2 bulkified; Gliscor v3 aquatic tail. |
| #148 Type diversity | 1->partial | **DONE C261** | 5 species registered: Electric/Grass (Lotad/Lombre/Ludicolo line) + Poison/Ice (Shroomish/Breloom line). Pre-Badge 1 encounters live. |
| #149 Gliscor sprite | 1 | **DONE C258** | v3: wider V-fork caudal fin, fin-ray striations, barnacle accents. |
| #150 Ability swaps | 1 | ACCEPT C259 | Thematic ability identity pass. |
| #151 Custom abilities | 1 | DEFER C265+ | Multi-cycle engineering needed. |
| #152 Custom moves | 1 | DEFER C265+ | Multi-cycle engineering needed. |
| #153 Trainer teams | 1 | DEFER C262-263 | Remaining gaps need early-game forms first. |
| #154 Regional starters | 1 | DEFER v2.4+ | Serious design needed — not a quick swap. |
| #156 Rival fight | 1 | DEFER C262-263 | Narrative layer cycle. |

## Engineering Prerequisites
- Species generator (C254→C260) — `scripts/generate_species.cjs`, 26-file scope, configs in `species_configs/`. C261: validated 5 sequential runs.
- Trainer validator promoted to check_all (C254)

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2A7.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (28 registered)**: Last registered = Ludicolo_Hoenn(438). EGG=439, NUM_SPECIES=439. All 5 early-game forms registered in C261: Lotad_Hoenn(434), Shroomish_Hoenn(435), Lombre_Hoenn(436), Breloom_Hoenn(437), Ludicolo_Hoenn(438). Evo chains: Lotad→Lombre(Lv14)→Ludicolo(LeafStone), Shroomish→Breloom(Lv23). categoryName max 11 chars (u8[12] field).
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
