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

**v2.5** (C274-281): "The Changed Three" — 9 regional starter species (Treecko/Torchic/Mudkip_Hoenn lines, Steel→Fairy→Fighting triangle), wild encounters (Meteor Falls/Mt. Pyre/Shoal Cave 4%), postgame Birch gift, rival integration (6 teams), Drake T3-T4 Sceptile_Hoenn, 27/27 species generator pipeline.

---

# v2.6: "The Reckoning" (C283-C290)

## Creative Vision

The migration transformed everything — wild Pokémon, gym leaders, villains, the rival, the starters. But the postgame currently feels like "what cool stuff can you find" rather than "what did all of this mean?" v2.6 shifts the postgame from a checklist into a narrative arc about **consequences and reckoning**.

**Theme**: The people who tried to reshape Hoenn (Teams Magma and Aqua) confront the fact that Hoenn reshaped itself. The gym leaders who adopted migration species each have their OWN unique relationship with that species — no two bosses share the same discovery.

**Emotional destination**: By the end of v2.6, the postgame player has encountered former villain faction members processing what they caused, boss trainers with fully unique migration species (reuse resolved), and a world that feels like it's moved on — even if the people in it haven't.

**Design hypothesis**: If the player walks through postgame Hoenn and finds ex-Magma members near Meteor Falls quietly watching the same Bagon_Hoenn that Drake reveres, and ex-Aqua members near Shoal Cave staring at the Mudkip_Hoenn they never imagined — the migration stops being a game mechanic and becomes a story.

## Boss Trainer Diversity Pass (C283)

### Audit Results — Species Reuse Matrix

| Species | Boss 1 | Boss 2 | Verdict |
|---------|--------|--------|---------|
| Bagon_Hoenn (Dragon/Rock) | Drake (E4, all tiers) | Roxanne (Gym 1, all tiers) | **Resolve** — Drake keeps |
| Corsola_Hoenn (Ghost/Rock) | Phoebe (E4, init+T3-T4) | Juan (Gym 8, all tiers) | **Accept reuse** |
| Farigiraf (Normal/Psychic) | Norman (Gym 5, all tiers) | T&L (Gym 7, T1-T3) | **Resolve** — Norman keeps |

Additional reuses (thematically acceptable — different trainer archetypes): Ninetales_Hoenn on Wallace/Wally/Courtney, Ludicolo_Hoenn on Wattson/Wallace, Gliscor_Hoenn on Brawly T4+/Archie.

### Bagon_Hoenn: Drake keeps, Roxanne gets Aron/Aerodactyl

**Drake** (Dragon specialist) has the definitive claim — his dialogue arc is reverence for "young ones changed, harder scales, stone in their blood." Bagon_Hoenn IS Drake's migration story.

**Roxanne** replacement: She's the academic/fossil researcher. Replace Bagon_Hoenn with species that fit her scholarly identity:
- **Initial fight (Lv13)**: Aron (Steel/Rock, BST 295) — the young mineral specimen. Fits her "studying stones" narrative. Already in game (SPECIES_ARON = 382).
- **Rematch T2-T5**: Aerodactyl (Rock/Flying, BST 515) — the prehistoric fossil. Her academic pride. Already in game (SPECIES_AERODACTYL = 142).
- **Dialogue update**: Shift from "living stone near Meteor Falls" to fossil research — "The ancients adapted too. AERODACTYL proves it." Roxanne becomes the voice for DEEP time, contrasting Drake's reverence for PRESENT change.

### Corsola_Hoenn: Accept Reuse (Juan + Phoebe)

Phoebe uses it as a Ghost type (Mt. Pyre connection). Juan uses it as his "one concession" — the fisherman who noticed the coral changing (C272 narrative). Different specialists, different game phases, different reasons. Juan's entire C272 redesign narrative depends on this species. Removing it would destroy a carefully crafted story for marginal diversity gain.

No action needed. Document as intentional dual-specialist design.

### Farigiraf: Norman keeps, T&L get Espeon

**Norman** has the definitive claim — his C268 narrative is "Farigiraf taught me Normal isn't simple." It's his character growth species.

**T&L** replacement: Farigiraf was one of several Psychic types on their roster. Replace with:
- **T1-T3**: Espeon (Psychic, BST 525) — the empathic eeveelution. Fits twins' connection/empathy theme. Already in game (SPECIES_ESPEON = 196).
- **T4**: Fix the Girafarig inconsistency (currently vanilla Girafarig on T4, which is a devolution). Replace with Espeon.
- **T5**: Already has Gardevoir — no Farigiraf or Girafarig. No change needed.
- **Dialogue update**: Shift from Farigiraf references to Espeon — "shared minds, shared sight" twin resonance.

### Implementation Scope (C283)

Files to modify: `trainer_parties.h` (Roxanne 5 parties + T&L 4 parties), `trainers.h` (if macro changes needed), 2 script files (Roxanne + T&L dialogue). No new species needed. Medium complexity, low risk.

## Villain Faction Postgame — "The Reckoning" Arc (C284-285)

### Design Philosophy

NOT redemption. These are people who haven't fully processed what happened. The migration made their mission look small — Magma wanted to expand the land, Aqua wanted to expand the sea, and Hoenn just... changed on its own, in ways neither faction imagined. The emotional arc across NPCs: **denial → confusion → grudging acknowledgment → quiet acceptance.**

All NPCs are dialogue-only (no battles). Gated behind Champion clear (FLAG_SYS_GAME_CLEAR). Each echoes a specific migration species from their location.

### Magma NPCs (C284) — 3 total (1 existing + 2 new)

| Location | Emotional Beat | Migration Echo | Notes |
|----------|---------------|----------------|-------|
| Mt. Chimney summit | Denial/deflection | General | **EXISTS** (C248): "The land's the same size, but there's more of everything anyway." |
| Lavaridge Town | Confusion | Pinsir_Hoenn (Bug/Fire, Route 112) | NEW: Ex-grunt who settled near the volcano. Watches fire species from the migration living alongside the ones they tried to protect. |
| Meteor Falls entrance | Grudging acknowledgment | Bagon_Hoenn (Dragon/Rock) | NEW: Near where the changed dragons roam. "MAXIE said the land needed to be stronger. These dragons figured that out without any of us." |

### Aqua NPCs (C285) — 3 new

| Location | Emotional Beat | Migration Echo | Notes |
|----------|---------------|----------------|-------|
| Slateport Harbor | Denial | Ocean/general | NEW: Staring at the water. Can't quite admit they were wrong. The sea was always moving — they just wanted to help it along. |
| Route 128 dive approach | Quiet horror | Deep Migration | NEW: Near the original Deep Migration sighting (C188). "I thought I understood water. But what came through..." |
| Shoal Cave entrance | Quiet acceptance | Mudkip_Hoenn (Fighting/Psychic) | NEW: Where the changed Mudkip lives. "That little fighter didn't need anyone to expand the sea for it." |

### Implementation Scope (C284-285)

5 new object events across 5 maps, 5 dialogue scripts, 0 trainer IDs, 0 new flags (Champion badge gate only). Low complexity per NPC, but requires careful dialogue writing (use /communicate skill). Split: C284 = Magma (2 new + 1 existing update), C285 = Aqua (3 new).

## Multi-Cycle Roadmap

| Cycle | Mode | Objective | Dependencies |
|-------|------|-----------|-------------|
| C282 | **planning** | This cycle — v2.6 design document | — |
| C283 | feature | Boss trainer diversity pass — Roxanne Aron/Aerodactyl, T&L Espeon, dialogue updates | Design doc |
| C284 | feature | Reckoning: Magma NPCs — Lavaridge + Meteor Falls new, Mt. Chimney update | — |
| C285 | feature | Reckoning: Aqua NPCs — Slateport + R128 + Shoal Cave | — |
| C286 | patch | Postgame polish pass — walk full postgame, verify arc coherence, fix gaps | C283-285 |
| C287 | planning | v2.7 direction — evaluate #151 (abilities), #152 (moves), #163 (shinies), #167 (Devon Mewtwo) | v2.6 complete |

### Issue Triage

| Issue | Decision | Rationale |
|-------|----------|-----------|
| #165 Boss diversity | **ACCEPT** (partial) | Bagon/Farigiraf reuse resolved. Corsola reuse accepted. See evaluation below. |
| #151 Custom abilities | **DEFER** (5th) | Revisit in C287 planning — will reach deferral limit |
| #152 Custom moves | **DEFER** (5th) | Revisit in C287 planning — will reach deferral limit |
| #163 Custom shinies | **DEFER** (2nd) | Massive scope, revisit after v2.6 |
| #167 Devon Corp Mewtwo | **DEFER** (2nd) | Compelling but too large — captured in creative backlog |

### Issue #165 Item-by-Item Evaluation

- **"Ambipom to replace Norman's Farigiraf"** → REJECT. Farigiraf IS Norman's migration narrative. Ambipom is generic Normal and adds nothing to his "Normal isn't simple" arc.
- **"Gallade to replace Wally's Gardevoir"** → REJECT replacement. Gardevoir IS Wally's identity since Gen 3. Gallade could appear on a different trainer if registered in a future cycle, but not at Wally's expense.
- **"Toxapex to replace Juan's Corsola-Hoenn"** → REJECT. Juan keeps Corsola_Hoenn (acceptable reuse with Phoebe). Toxapex is Gen 7, would need full 27-file pipeline, and Juan's narrative specifically revolves around noticing the coral changing — not a new species entirely.
- **"Carbink to replace Roxanne's Bagon-Hoenn"** → REJECT the specific species (27-file cost), ACCEPT the underlying concern. Roxanne WILL lose Bagon_Hoenn, but replacement is Aron/Aerodactyl (existing species, fossil theme).

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2A9.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (42 registered)**: Last = Swampert_Hoenn(447). EGG=448, NUM_SPECIES=448.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + charmap validation).
