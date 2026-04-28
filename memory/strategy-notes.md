# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v1.6** (C2-183): Core hack foundation — starters (Larvitar/Bagon/Dratini), P/S split, Fairy, species pipeline, encounters, trainers, QoL, Battle Frontier, legendary saga, difficulty modes, first impressions.
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. City NPCs, ocean witnesses, Deep Migration, The Gathering, post-Gathering callbacks.
**v1.8** (C192-200): "The Living Region" — 4 postgame quests, 2 regional forms (Corsola_Hoenn, Growlithe_Hoenn/Arcanine_Hoenn), species pipeline.
**v1.9** (C201-210): "The New Normal" — E4 & Champion overhaul, "The Exhale", 2 mid-game forms, Deoxys quest, challenge_mode_scaling.h.
**v2.0** (C212-225): "Deeper Roots" — 5 cross-gen evos, Bagon_Hoenn (Dragon/Rock), species validation suite, Mom's send-off.
**v2.1** (C226-238): "A Changed Hoenn" — Cyan protagonist palette, 2 mid-game forms, Echo dialogue layer, Deoxys Quest II, Changed Trainer reactions.
**v2.2** (C239-253): "The Cosmic Form" — Deoxys_Hoenn (Poison/Fairy) + Toxic Touch, Quest III, trainer narrative pass, Magma/Aqua reckoning, Gligar_Hoenn + Gliscor_Hoenn.
**v2.3** (C254-267): "Roots" — Species generator (26-file), trainer generator, 5 early-game regional forms (Lotad/Shroomish/Lombre/Breloom/Ludicolo_Hoenn), ability identity pass, Glacia redesign.
**v2.4** (C268-273): "The Proving Ground" — Gym leader migration pass complete (Brawly/Norman/Drake/Wattson/Juan/Wallace), Wally VR redesign, rival arc (Brendan/May Route 110 + Lilycove teams + dialogue).

---

**v2.5** (C274-281): "The Changed Three" — Treecko/Torchic lines registered (6 of 9 starters, Steel→Fairy→Fighting triangle), wild encounters, postgame Birch gift, rival integration, Drake T3-T4. Mudkip line still unregistered.
**v2.6** (C282-286): "The Reckoning" — Boss diversity pass (Roxanne Aron/Aerodactyl, T&L Espeon), 6-NPC villain postgame arc (3 Magma + 3 Aqua), Birch collection quest (PP_MAX), dialogue polish.

---

# v2.7: "The Living Difference" (C288-C294)

## Creative Vision

The migration changed how Hoenn looks and sounds. v2.7 makes it change how Hoenn **fights**. Every regional form should have at least one ability that expresses its changed ecology. The player encounters a regional form in battle and its ability does something they've never seen that species do. They pause. They remember.

**Design Hypothesis**: If regional forms fight with abilities that express their ecological niche — not just reskinned stats — the player will treat each form as a genuine discovery rather than a palette swap. Mechanical identity must arrive early (pre-Badge 1 forms) so the "Hoenn is different" feeling hits in Hour 1.

## Critical Prerequisite: Changed Three Registration

**C287 DISCOVERY**: The verify_species.sh script revealed that the Changed Three starters are far less registered than memory claimed:

| Line | species.h | species_info.h | species_names.h | Full 27-file |
|------|-----------|---------------|-----------------|-------------|
| Treecko_Hoenn (439-441) | ✓ | **MISSING** | ✓ | 2/27 |
| Torchic_Hoenn (442-444) | ✓ | **MISSING** | ✓ | 2/27 |
| Mudkip_Hoenn (445-447) | ✓ | ✓ | ✓ | **27/27 ✓C288** |

**6 species still need full registration** (Treecko + Torchic lines). C289 must complete these.

**Actual species count**: 36 custom species (11 cross-gen evos + 25 _HOENN forms). 19 fully registered. EGG=448, NUM_SPECIES=448.

## Three-Tier Mechanical Identity System

### Tier 1 — Custom Abilities (2 immediate + 1 deferred)

Follow the Toxic Touch pattern: 4 files per ability (abilities.h constant, text/abilities.h name+desc, battle_util.c effect, species_info.h assignment). ~15 lines new code per ability.

**1. "Frozen Spore"** (ABILITY_FROZEN_SPORE = 79)
- **Effect**: Contact moves made by this Pokémon have a 20% chance to freeze the target.
- **Assigned to**: Breloom_Hoenn (Poison/Ice), replacing POISON_POINT.
- **Narrative**: The migration froze this mushroom's spores. Each punch carries crystallized ice toxins that flash-freeze on impact.
- **Gameplay**: Freeze is the rarest and most powerful status in Gen 3 (no thaw except specific moves). 20% on a fast physical attacker with Mach Punch is terrifying. This IS the "pause and screenshot" moment.
- **Implementation**: Copy Toxic Touch block in battle_util.c. Change: ABILITY check, (Random() % 5) == 0 for 20%, MOVE_EFFECT_FREEZE. Freeze won't apply to Ice types (engine handles this).
- **Balance**: 20% (not 30% like Toxic Touch) because freeze > poison. Breloom_Hoenn's low bulk (60/80/60) means it dies fast — the ability rewards aggression, not stalling.

**2. "Scalding Touch"** (ABILITY_SCALDING_TOUCH = 80)
- **Effect**: Contact moves made by this Pokémon have a 30% chance to burn the target.
- **Assigned to**: Arcanine_Hoenn (Water/Fire), replacing FLASH_FIRE (currently redundant — Water/Fire already 4x resists Fire).
- **Narrative**: The Water/Fire dual nature means every physical strike carries scalding heat. The tidal dog's touch blisters.
- **Gameplay**: Burns halve Attack, punishing physical attackers who try to trade blows. Combined with Intimidate (slot 1), Arcanine_Hoenn becomes the ultimate physical wall pivot. Memorable: "the dog that Intimidates you AND burns you."
- **Implementation**: Copy Toxic Touch block. Change: ABILITY check, MOVE_EFFECT_BURN. Same 30% rate.
- **Balance**: 30% matches Toxic Touch. Burn is stronger than poison (Attack reduction) but Arcanine_Hoenn has 555 BST to justify it.

**3. TBD for Changed Three** (ABILITY_ID = 81, deferred to C291)
- Reserved for one starter line after full registration and playtesting confirms the other two abilities.
- Candidate: Sceptile_Hoenn (Grass/Steel) — "Tempered Blade" or similar, based on the steel-plant ecology.

### Tier 2 — Strategic Ability Reassignment (10 forms)

Implementation cost: species_info.h only (1 file, 1 line per form). Minimal risk.

| Form | Types | Current A2 | Proposed A2 | Narrative Justification |
|------|-------|-----------|-------------|------------------------|
| **Corsola_Hoenn** | Ghost/Rock | PRESSURE | **LEVITATE** | Ghost coral floats — severed from the seabed, untethered. Ground immunity patches the 2x Ground weakness (critical for Ghost/Rock). |
| **Arcanine_Hoenn** | Water/Fire | FLASH_FIRE | **SCALDING_TOUCH** (T1 custom) | Flash Fire is 100% redundant (Water/Fire 4x resists Fire). Custom ability replaces it. |
| **Vulpix_Hoenn** | Ice/Fairy | CUTE_CHARM | **NATURAL_CURE** | Fairy magic heals status on switch. Cute Charm is mediocre on a special attacker (only triggers on physical contact). |
| **Ninetales_Hoenn** | Ice/Fairy | CUTE_CHARM | **NATURAL_CURE** | Same ecological adaptation as Vulpix_Hoenn. The nine tails purify ailments. |
| **Pinsir_Hoenn** | Bug/Fire | HYPER_CUTTER | **GUTS** | The fire bug fights harder when hurt. Guts (+50% Atk when statused) rewards aggressive play. Hyper Cutter (prevent -Atk) is boring and rarely relevant. |
| **Bagon_Hoenn** | Dragon/Rock | SHED_SKIN | **STURDY** | The baby rock dragon is impossibly tough. Sturdy guarantees survival of one OHKO at full HP — the "little dragon that won't go down." Shed Skin is generic. |
| **Gligar_Hoenn** | Water/Rock | BATTLE_ARMOR | **SWIFT_SWIM** | The water scorpion rides currents. Swift Swim doubles Speed in rain, creating rain-team synergy. Battle Armor (no crits) is passive and boring. |
| **Gliscor_Hoenn** | Water/Rock | BATTLE_ARMOR | **SWIFT_SWIM** | Same aquatic adaptation as Gligar_Hoenn. The evolved form becomes a rain sweeper. |
| **Breloom_Hoenn** | Poison/Ice | POISON_POINT | **FROZEN_SPORE** (T1 custom) | Custom ability replaces the redundant Poison Point. Keeps THICK_FAT as slot 2. |
| **Stantler_Hoenn** | Ghost/Grass | NATURAL_CURE | **EFFECT_SPORE** | The haunted forest stag releases ghostly spores on contact. 30% chance to paralyze/sleep/poison attackers. More expressive than Natural Cure for a Ghost/Grass. |

**Forms left unchanged (abilities already express identity):**
- Lotad/Lombre/Ludicolo_Hoenn (Electric/Grass): LIGHTNING_ROD / RAIN_DISH — perfect for Electric type
- Shroomish_Hoenn (Poison/Ice): EFFECT_SPORE / (inherit from pre-evo) — fine
- Growlithe_Hoenn (Water/Water): SWIFT_SWIM / WATER_VEIL — coherent Water identity
- Deoxys_Hoenn (Poison/Fairy): TOXIC_TOUCH / PRESSURE — already has custom ability

### Tier 3 — Signature Moves (2 immediate + 1 deferred)

Follow the Fairy moves pattern (C46): 6 files per move (moves.h constant, battle_moves.h data, move_names.h, move_descriptions.h, contest_moves.h, level_up_learnsets.h). Each reuses an existing animation.

**1. "Spore Fist"** (Ice/Physical) — Breloom_Hoenn line
- Power: 75, Accuracy: 100, PP: 15, Category: Physical
- Effect: 10% freeze chance
- Animation: Reuse MOVE_ICE_PUNCH animation effect
- Rationale: Breloom_Hoenn (Poison/Ice) has 130 base Atk but no physical Ice STAB in Gen 3. This fills the critical movepool gap. Mach Punch + Spore Fist gives it a devastating two-punch combo with Frozen Spore's 20% freeze.
- Learns: Breloom_Hoenn (Lv36), Shroomish_Hoenn (Lv43)

**2. "Tidal Flare"** (Water/Special) — Arcanine_Hoenn
- Power: 85, Accuracy: 100, PP: 10, Category: Special
- Effect: 30% burn chance
- Animation: Reuse MOVE_FLAMETHROWER animation effect
- Rationale: Arcanine_Hoenn (Water/Fire, 100 SpA) needs a move that captures both types in one attack. A Water move that burns is thematically perfect — scalding geothermal water. Water Pulse is too weak (60 BP) and Surf is generic.
- Learns: Arcanine_Hoenn (Lv49)

**3. "Iron Leaf"** (Steel/Physical) — Sceptile_Hoenn line (DEFERRED to C292)
- Power: 85, Accuracy: 100, PP: 15, Category: Physical
- Effect: High critical hit ratio
- Animation: Reuse MOVE_LEAF_BLADE animation effect
- Rationale: Sceptile_Hoenn (Grass/Steel) needs reliable physical Steel STAB. Iron Tail has 75% accuracy. This gives Leaf Blade's crit identity in Steel typing.
- Deferred: Requires Changed Three full registration first.

## Form-by-Form Summary Table

| # | Species | Types | A1 | A2 (change) | Sig Move | Cycle | Reg Status |
|---|---------|-------|----|-------------|----------|-------|------------|
| 1 | Corsola_Hoenn | Ghost/Rock | Rock Head | **Levitate** ✓C288 | — | — | ✓ full |
| 2 | Growlithe_Hoenn | Water/Water | Swift Swim | Water Veil (keep) | — | — | ✓ full |
| 3 | Arcanine_Hoenn | Water/Fire | Intimidate | **Scalding Touch** ← Flash Fire | Tidal Flare | C290+C292 | ✓ full |
| 4 | Bagon_Hoenn | Dragon/Rock | Rock Head | **Sturdy** ✓C288 | — | — | ✓ full |
| 5 | Vulpix_Hoenn | Ice/Fairy | **Natural Cure** ✓C288 | Serene Grace | — | — | ✓ full |
| 6 | Ninetales_Hoenn | Ice/Fairy | **Natural Cure** ✓C288 | Serene Grace | — | — | ✓ full |
| 7 | Pinsir_Hoenn | Bug/Fire | **Guts** ✓C288 | Flame Body | — | — | ✓ full |
| 8 | Stantler_Hoenn | Ghost/Grass | Intimidate | **Effect Spore** ✓C288 | — | — | ✓ full |
| 9 | Gligar_Hoenn | Water/Rock | **Swift Swim** ✓C288 | Water Absorb | — | — | ✓ full |
| 10 | Gliscor_Hoenn | Water/Rock | **Swift Swim** ✓C288 | Water Absorb | — | — | ✓ full |
| 11 | Deoxys_Hoenn | Poison/Fairy | Toxic Touch | Pressure (keep) | — | — | ✓ full |
| 12 | Lotad_Hoenn | Elec/Grass | Lightning Rod | Rain Dish (keep) | — | — | ✓ full |
| 13 | Shroomish_Hoenn | Poison/Ice | Effect Spore | (pre-evo, keep) | — | — | ✓ full |
| 14 | Lombre_Hoenn | Elec/Grass | Lightning Rod | Rain Dish (keep) | — | — | ✓ full |
| 15 | Breloom_Hoenn | Poison/Ice | **Frozen Spore** ← Poison Point | Thick Fat | Spore Fist | C290+C292 | ✓ full |
| 16 | Ludicolo_Hoenn | Elec/Grass | Lightning Rod | Rain Dish (keep) | — | — | ✓ full |
| 17 | Treecko_Hoenn | Grass/Steel? | TBD | TBD | — | C291 | ⚠ 2/27 |
| 18 | Grovyle_Hoenn | Grass/Steel? | TBD | TBD | — | C291 | ⚠ 2/27 |
| 19 | Sceptile_Hoenn | Grass/Steel? | TBD | TBD | Iron Leaf | C291+C292 | ⚠ 2/27 |
| 20 | Torchic_Hoenn | Fire/Fairy? | TBD | TBD | — | C291 | ⚠ 2/27 |
| 21 | Combusken_Hoenn | Fire/Fairy? | TBD | TBD | — | C291 | ⚠ 2/27 |
| 22 | Blaziken_Hoenn | Fire/Fairy? | TBD | TBD | — | C291 | ⚠ 2/27 |
| 23 | Mudkip_Hoenn | Water/Fighting | Torrent | **Guts** | — | C288 | ✓ full |
| 24 | Marshtomp_Hoenn | Water/Fighting | Torrent | **Guts** | — | C288 | ✓ full |
| 25 | Swampert_Hoenn | Water/Fighting | Torrent | **Guts** | — | C288 | ✓ full |

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Dependencies |
|-------|------|-----------|-------------|
| C288 | feature | **DONE**: Mudkip_Hoenn line registered (Water/Fighting, 27/27 × 3). Tier 2 ability pass (8/10). | — |
| C289 | feature | **Changed Three registration P2**: Complete Torchic line registration (25 missing files). Run verify_species.sh on all 9 — must show 27/27 for each. | C288 |
| C290 | feature | **Ability pass**: Implement Frozen Spore + Scalding Touch (2 custom abilities). Apply all 10 Tier 2 reassignments. Single cycle, ~5 files. | C288-289 (for starters), full reg for 16 existing forms |
| C291 | feature | **Changed Three abilities**: Design and assign abilities for all 9 starter forms. Optionally: third custom ability. | C288-289 registration |
| C292 | feature | **Signature moves**: Implement Spore Fist + Tidal Flare (+ Iron Leaf if starters ready). 6 files per move. | C290 abilities |
| C293 | feature | **Trainer showcase**: Update key trainer teams to use new abilities/moves in battle. Dialogue referencing abilities. | C290-292 |
| C294 | patch | **Balance + polish**: Difficulty mode tuning, encounter rate adjustment, trainer IV review. v2.7 complete. | C293 |

## Issue Integration

- **#151** (Custom abilities): v2.7 core objective. Tiers 1+2 deliver the ask. ACCEPTED (final — was at 5 deferrals).
- **#152** (Custom moves): Scoped to Tier 3 (2-3 signature moves). Full move catalog out of scope. ACCEPTED (final — was at 5 deferrals).
- **#163** (Custom shinies): DEFERRED (3rd). Not evaluated in this session per design guidance.
- **#167** (Devon Corp Mewtwo): DEFERRED (3rd). Cannot add form #43 until the existing 25 have mechanical identity.
- **#178** (C283 rejection reasoning): Carries forward. Addressed via holistic roster evaluation in C293.

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2B5.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (36 actual)**: Last registered = Swampert_Hoenn(447). EGG=448, NUM_SPECIES=448. 25 _HOENN forms (19 fully registered, 6 partial). Tier 2 ability pass: 8/10 done (Arcanine + Breloom deferred to C290 — require custom abilities).
- **Custom abilities**: TOXIC_TOUCH(78), next available: 79. ABILITIES_COUNT must update.
- **Custom ability pattern**: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). ~15 lines each.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + charmap validation + --update mode C287), `verify_species.sh` (27-file check, C287).
