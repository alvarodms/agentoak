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
**v2.5** (C274-281): "The Changed Three" — Treecko/Torchic/Mudkip Hoenn lines (9 species, Steel/Fairy/Fighting triangle), wild encounters, postgame Birch gift, rival integration.
**v2.6** (C282-286): "The Reckoning" — Boss diversity pass, 6-NPC villain postgame arc, Birch collection quest (PP_MAX), dialogue polish.
**v2.7** (C288-294): "The Living Difference" — Mechanical identity for all 25 regional forms. 3 custom abilities (Frozen Spore, Scalding Touch, Toxic Touch), 10/10 Tier 2 ability reassignments, 3 signature moves (Spore Fist, Tidal Flare, Iron Leaf). Changed Three fully registered (9 species, 27 files each). Species count: 36 custom (11 cross-gen + 25 _HOENN), all registered.

---

# v2.8: "The Player's Hoenn" (C296-C300)

## Creative Vision

The foundation is rich: 25 regional forms, 3 custom abilities, 3 signature moves, dozens of NPC dialogues, a villain reckoning arc. But a first-time player doesn't see the foundation — they see the experience. v2.8 makes that experience smooth, discoverable, and worth recommending.

**Design Hypothesis**: If the player can find regional forms reliably (encounter rates), see them fight distinctively (battle animations), and experience the world's reaction without being lectured (dialogue polish), then the hack crosses from "interesting project" to "recommended hack."

**Guiding principle**: Polish over volume. No new species, no new quests. Make what exists feel complete.

## Player Experience Audit (C295)

Categorized every migration-related NPC as **Tell** (explicit dialogue explaining migration), **Show** (environment/encounters — player discovers meaning), or **Showcase** (trainer battle demonstrates a form).

| Hour Block | Tell | Show | Showcase | Assessment |
|------------|------|------|----------|------------|
| 0-3 (pre-Badge 1) | 3 | 4 | 3 | Healthy. Birch/Mom/Roxanne = 3 voices, distinct tones, well-spaced. |
| 3-6 (Badges 1-3) | **7** | 2 | 4 | **FATIGUE.** Echo layer stacked 3 "tell" NPCs on routes with existing gym leaders + Hartley. |
| 6-10 (Badges 4-7) | 3 | 4 | 3 | Strongest. Weather events carry the theme without dialogue. |
| 10-15 (E4+) | 4 | 5 | 4 | Climactic. Tell moments earned by boss battles. Villain behavior = powerful Show. |

**Key finding**: Hours 3-6 have a 7:2 Tell-to-Show ratio — the player hears "migration changed things" from Brawly, Wattson, Hartley, FrostTracker, R112 Hiker, R113 FrostTracker, and R119 Ecologist in rapid succession. Three of these are Echo dialogue NPCs (C232) that should be converted from Tell to Show.

### Subtraction Candidates (Hour 3-6)

1. **R112 Hiker Echo** (C232): Redundant with Flannery (encountered Hours 6-10). Trim to silent reaction or one-line observation.
2. **R113 FrostTracker extended** (C232): Base FrostTracker already covers Vulpix_Hoenn. Remove the extension.
3. **R119 Ecologist** (C232): "All 4 forms -> Hartley" redirect is wordy. Shorten to a brief observation.

### Enhancement Candidates

- Gym leader showcase dialogue: Brawly and Wattson's post-battle text should demonstrate their form's mechanics ("GLIGAR rode the tide into my fist" > "the migration brought GLIGAR"). Show through battle experience, don't explain.

## QoL Gap Analysis

### 1. Repel Continuation Prompt (BW-style)
- **Current**: `data/scripts/repel.inc` shows "REPEL's effect wore off" and ends. Code: `wild_encounter.c:883` calls `ScriptContext_SetupScript(EventScript_RepelWoreOff)`.
- **Change**: Modify the script to check bag for Repel items, show yes/no prompt, use strongest available.
- **Files**: `data/scripts/repel.inc` (~40 lines of script), `src/item_use.c` or new special (~20 lines of C helper to find best repel).
- **Risk**: Low. Self-contained. The script hooks already exist.

### 2. Encounter Rate Rebalancing — ALREADY CORRECT
C295 audit claimed Pinsir_Hoenn/Vulpix_Hoenn/Mudkip_Hoenn were at 1%. **Verified C297: Pinsir_Hoenn is 5% (slot 7), Vulpix_Hoenn is 4% (slot 9), Mudkip_Hoenn is 4% (slot 8).** The 1% claim was incorrect — rates were already at reasonable levels. No changes needed.

### 3. Battle Animation Templates
Custom moves 378-380 (Spore Fist, Tidal Flare, Iron Leaf) all use the generic `Move_COUNT` fallback (basic hit + shake, 12 lines). Signature moves deserve signature animations.

- **Files**: `data/battle_anim_scripts.s` (~90 lines total: 3 animations + table extension)
- **Templates**: Iron Leaf (Steel Wing base: metallic_shine + slash, ~25 lines), Spore Fist (Ice Punch base: ice crystals + fist, ~35 lines), Tidal Flare (Scald/Flamethrower hybrid: water+fire particles, ~30 lines)
- **Table**: Extend `gBattleAnims_Moves` past entry 373. Pad 374-377 with `Move_COUNT`, assign 378-380 to custom labels.
- **Risk**: Low-medium. Animation scripts are well-structured bytecode.

## Issue #178 Re-evaluation

**Critique**: C283 rejected species proposals with "needs pipeline" — not a design argument. **Verdict**: Valid. The pipeline is proven (25 forms registered). Pipeline complexity will never be used as a rejection reason again.

**C283 decisions re-evaluated on design merits only**:
- Bagon_Hoenn: Drake keeps it (dragon specialist reverence > Roxanne's academic curiosity). **Still valid.**
- Farigiraf: Norman keeps it ("Normal isn't simple" arc is richer than T&L adding another Psychic). **Still valid.**
- Carbink for Roxanne: **No longer pipeline-blocked.** Could be added in v2.9+ if a regional form is designed. Not needed — Roxanne's Aron/Aerodactyl identity is strong.

**Outcome**: Accept #178, close it. Acknowledge the critique publicly. Specific C283 roster decisions were correct on design grounds but the reasoning was inadequate.

## Multi-Cycle Roadmap

| Cycle | Mode | Pillar | Objective | Status |
|-------|------|--------|-----------|--------|
| C296 | — | — | Crashed (zero output). v2.8 deferred to C297. | crashed |
| C297 | feature | QoL + Visual | BW-style repel prompt + battle animation templates (Iron Leaf, Spore Fist, Tidal Flare). Encounter rates verified already correct. | **shipped** |
| C298 | feature | Dialogue + Encounters + Trainers | Dialogue subtraction (3 NPCs Tell→Show), Growlithe_Hoenn on R118 (5%), Crobat on Maxie/Archie (4 encounters). Tell:Show 7:2→4:5. | **shipped** |
| C299 | feature | Dialogue | Brawly + Wattson defeat/re-talk rewrite (Tell→Show). Flannery descoped — Hour 6-10 already healthy. | **shipped** |
| C300 | feature | Capstone | Tempered Blade (ABILITY_81) — Sceptile_Hoenn custom ability. Steel-type contact moves have boosted crit rate. 4-file pattern (abilities.h, text/abilities.h, battle_util.c, species_info.h). | |

**Pillar design intent**:
- **QoL (C296)**: Table-stakes polish. Player can find forms and navigate comfortably. Signals quality.
- **Visual (C297)**: Signature moves look distinct. Player sees Iron Leaf's metallic slash and knows this isn't a reskin.
- **Dialogue (C298-299)**: Hour 3-6 fatigue fixed. Gym leaders show through battle, not explanation. 7:2 Tell:Show ratio becomes 4:5.
- **Capstone (C300)**: Highest-impact remaining item. Field Notes (key item showing form flavor text when used near a regional form) makes the research theme playable. Tempered Blade gives Sceptile_Hoenn a unique ability identity. Community feedback from C296-299 will inform the choice.

## Trainer Capacity

891/891 IDs, 2 reclaimable (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853). v2.8 rewrites existing NPCs — no new trainer IDs needed for Pillars 1-3. Capstone may need 0-1. **Sufficient. No expansion planned.**

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2B5.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (36 actual)**: Last = Swampert_Hoenn(447). EGG=448, NUM_SPECIES=448. 25 _HOENN forms, all fully registered + verified C294.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80). ABILITIES_COUNT=81. Next: 81.
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). ~15 lines each. ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
