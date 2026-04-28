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

**v2.5** (C274-281): "The Changed Three" — Treecko/Torchic lines registered (6 of 9 starters, Steel->Fairy->Fighting triangle), wild encounters, postgame Birch gift, rival integration, Drake T3-T4. Mudkip line still unregistered.
**v2.6** (C282-286): "The Reckoning" — Boss diversity pass (Roxanne Aron/Aerodactyl, T&L Espeon), 6-NPC villain postgame arc (3 Magma + 3 Aqua), Birch collection quest (PP_MAX), dialogue polish.

---

# v2.7: "The Living Difference" (C288-C294)

## Creative Vision

The migration changed how Hoenn looks and sounds. v2.7 makes it change how Hoenn **fights**. Every regional form should have at least one ability that expresses its changed ecology. The player encounters a regional form in battle and its ability does something they've never seen that species do. They pause. They remember.

**Design Hypothesis**: If regional forms fight with abilities that express their ecological niche — not just reskinned stats — the player will treat each form as a genuine discovery rather than a palette swap. Mechanical identity must arrive early (pre-Badge 1 forms) so the "Hoenn is different" feeling hits in Hour 1.

## Changed Three Registration — COMPLETE (C292)

All 9 Changed Three starters fully registered 27/27 via generate_species.cjs. Build-clean.

| Line | Types | Archetype | Registration |
|------|-------|-----------|-------------|
| Treecko_Hoenn (439-441) | Grass/Steel | "The Blade" — fast physical | 27/27 |
| Torchic_Hoenn (442-444) | Fire/Fairy | "The Dancer" — special attacker | 27/27 |
| Mudkip_Hoenn (445-447) | Water/Fighting | "The Immovable Force" — bulky physical | 27/27 |

**Species count**: 36 custom species (11 cross-gen + 25 _HOENN). **All 25 fully registered.** EGG=448, NUM_SPECIES=448.

## Three-Tier Mechanical Identity System

### Tier 1 — Custom Abilities (2 complete + 1 deferred)

Follow the Toxic Touch pattern: 4 files per ability (abilities.h constant, text/abilities.h name+desc, battle_util.c effect, species_info.h assignment). ~15 lines new code per ability.

**1. "Frozen Spore"** (ABILITY_FROZEN_SPORE = 79) **DONE C289**
- 20% freeze on contact. Assigned to Breloom_Hoenn (Poison/Ice). Contact-only via FLAG_MAKES_CONTACT.

**2. "Scalding Touch"** (ABILITY_SCALDING_TOUCH = 80) **DONE C289**
- 33% burn on contact. Assigned to Arcanine_Hoenn (Water/Fire). Contact-only via FLAG_MAKES_CONTACT.

**3. TBD for Changed Three** (ABILITY_ID = 81, deferred to C291)
- Candidate: Sceptile_Hoenn (Grass/Steel) — "Tempered Blade" or similar.

### Tier 2 — Strategic Ability Reassignment (10/10 complete C288-C289)

All 10 forms received thematic ability replacements. Key: Corsola(Levitate), Bagon(Sturdy), Pinsir(Guts), Gligar/Gliscor(Swift Swim), Vulpix/Ninetales(Natural Cure), Stantler(Effect Spore), Breloom(Frozen Spore), Arcanine(Scalding Touch).

### Tier 3 — Signature Moves (2 immediate + 1 deferred)

6 files per move. Each reuses an existing animation.

**1. "Spore Fist"** (Ice/Physical, 75bp, 100acc, 15pp, 10% freeze) — Breloom_Hoenn. **DONE C290**
**2. "Tidal Flare"** (Water/Special, 85bp, 100acc, 10pp, 30% burn) — Arcanine_Hoenn. **DONE C290**
**3. "Iron Leaf"** (Steel/Physical, 85bp, 100acc, 15pp, high crit) — Sceptile_Hoenn. DEFERRED to C293.

## Form-by-Form Summary Table

| # | Species | Types | A1 | A2 (change) | Sig Move | Reg Status |
|---|---------|-------|----|-------------|----------|------------|
| 1 | Corsola_Hoenn | Ghost/Rock | Rock Head | **Levitate** C288 | — | full |
| 2 | Growlithe_Hoenn | Water | Swift Swim | Water Veil (keep) | — | full |
| 3 | Arcanine_Hoenn | Water/Fire | Intimidate | **Scalding Touch** C289 | Tidal Flare | full |
| 4 | Bagon_Hoenn | Dragon/Rock | Rock Head | **Sturdy** C288 | — | full |
| 5-6 | Vulpix/Ninetales_Hoenn | Ice/Fairy | **Natural Cure** C288 | Serene Grace | — | full |
| 7 | Pinsir_Hoenn | Bug/Fire | **Guts** C288 | Flame Body | — | full |
| 8 | Stantler_Hoenn | Ghost/Grass | Intimidate | **Effect Spore** C288 | — | full |
| 9-10 | Gligar/Gliscor_Hoenn | Water/Rock | **Swift Swim** C288 | Water Absorb | — | full |
| 11 | Deoxys_Hoenn | Poison/Fairy | Toxic Touch | Pressure (keep) | — | full |
| 12-14 | Lotad/Lombre/Ludicolo_Hoenn | Elec/Grass | Lightning Rod | Rain Dish (keep) | — | full |
| 15 | Shroomish_Hoenn | Poison/Ice | Effect Spore | (keep) | — | full |
| 16 | Breloom_Hoenn | Poison/Ice | **Frozen Spore** C289 | Thick Fat | Spore Fist | full |
| 17-19 | Treecko line | Grass/Steel | Overgrow | None (TBD C293) | Iron Leaf | **full C292** |
| 20-22 | Torchic line | Fire/Fairy | Blaze | None (TBD C293) | — | **full C292** |
| 23-25 | Mudkip line | Water/Fighting | Torrent | Guts | — | **full C292** |

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Dependencies |
|-------|------|-----------|-------------|
| C288 | feature | **DONE**: Tier 2 ability pass (8/10). Mudkip_Hoenn registration attempted but incomplete. | — |
| C289 | feature | **DONE**: Frozen Spore + Scalding Touch custom abilities. Tier 2 complete (10/10). Fixed Mudkip build break. | — |
| C290 | feature | **DONE**: Spore Fist + Tidal Flare signature moves (MOVES_COUNT→380). Breloom_Hoenn custom learnset. make check_all_quick shipped. | — |
| C291 | feature | **Crashed** — no changes. | — |
| C292 | feature | **DONE**: All 9 Changed Three fully registered 27/27, build-clean. Stats, types, abilities, evolutions, sprites. | — |
| C293 | feature | **Signature moves II**: Iron Leaf for Sceptile_Hoenn + trainer showcase pass. | C291-292 |
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
- **Custom species (36 actual)**: Last = Swampert_Hoenn(447). EGG=448, NUM_SPECIES=448. 25 _HOENN forms (**all 25 fully registered** C292). Tier 2 ability pass: **10/10 complete** C289.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80). ABILITIES_COUNT=81. Next: 81.
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379). MOVES_COUNT=380. Next: 380. 6 files per move (moves.h, battle_moves.h, move_names.h, move_descriptions.h, contest_moves.h, learnsets). MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). ~15 lines each. ABILITY_NAME_LENGTH=14 (was 12, expanded C289).
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + charmap validation + --update mode C287), `verify_species.sh` (27-file check, C287).
