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

# v2.5: "The Changed Three" (C274+)

## Creative Vision

The migration transformed Hoenn's wild Pokémon, its gym leaders' teams, its villain factions, its rival's journey. But the three species most iconic to Hoenn — Treecko, Torchic, Mudkip — haven't appeared through the migration lens. v2.5 completes the circle: regional forms of Hoenn's original starter trio, discoverable in the wild and earnable postgame.

**Key insight**: The hack's actual starters are **Larvitar/Bagon/Dratini** (pseudo-legendaries since C2). This is the hack's signature — no other Emerald hack gives you pseudo-legendaries from minute one. Replacing or complicating them dilutes that identity. Regional Hoenn starters work better as **rare wild discoveries**: the player isn't given them, they find them. This mirrors the migration itself — transformation happens in the wild, not in a lab.

**Design hypothesis**: If the player discovers regional forms of Hoenn's original starter species — a crystal Treecko in Meteor Falls, a starlight Torchic on Mt. Pyre, a titan Mudkip in Shoal Cave — the migration feels total. Even the species that once defined this region have been reshaped by cosmic energy.

## Type Triangle: Steel → Fairy → Fighting

The three lines form a complete super-effective triangle:
- **Sceptile_Hoenn** (Steel) → Blaziken_Hoenn (Fairy/Flying): Steel 2x on Fairy
- **Blaziken_Hoenn** (Fairy/Flying) → Swampert_Hoenn (Fighting/Psychic): Fairy 2x on Fighting
- **Swampert_Hoenn** (Fighting/Psychic) → Sceptile_Hoenn (Steel): Fighting 2x on Steel

No Rock types added (type diversity constraint satisfied). No duplicate typings with existing 27 regional forms.

### Species Summary

| Line | Final Type | BST | Stat Identity | Key Move | Playstyle |
|------|-----------|-----|---------------|----------|-----------|
| Treecko_Hoenn | Steel | 530 | 110 Atk / 120 Spe | Meteor Mash | Fast physical sweeper, 11 resistances |
| Torchic_Hoenn | Fairy/Flying | 530 | 120 SpA / 95 Spe | Moonblast | Special sweeper, Dragon immune |
| Mudkip_Hoenn | Fighting/Psychic | 535 | 100 Atk / 95 SpA | Cross Chop + Extrasensory | Mixed tank, Bulk Up OR Calm Mind |

Full species specs (stats per stage, movesets, TMs, abilities): `pokemon-knowledge/regional-starter-designs.md`

## Presentation Model

### A. Wild Encounters (base forms only, 4% rarity)

| Species | Type | Location | Level | Thematic Connection |
|---------|------|----------|-------|---------------------|
| Treecko_Hoenn | Steel | Meteor Falls B1F 2R | 25-28 | Cosmic mineral deposits crystallized its plant tissue — same cave as Bagon colony |
| Torchic_Hoenn | Fairy | Mt. Pyre Exterior | 27-30 | Sacred mountain's spiritual energy replaced fire with celestial light |
| Mudkip_Hoenn | Fighting | Shoal Cave (low tide) | 28-32 | Tidal rhythms awakened primal martial discipline |

Each is a discovery moment. They're rare, reward exploration, and tell the player: "Even the species that once defined this region have been changed."

### B. Postgame Gift: Replace Johto Starters

Current postgame gift (VAR_DEX_UPGRADE_JOHTO_STARTER_STATE): Cyndaquil/Totodile/Chikorita after National Dex.
**Replace with**: Treecko_Hoenn/Torchic_Hoenn/Mudkip_Hoenn + migration-themed Birch dialogue.
Guaranteed access even if the player missed the wild encounters. Uses existing Johto starter infrastructure.

### C. Early Foreshadowing (BirchLab dialogue, pre-journey)

Add to Birch's existing migration dialogue:
*"I've been hearing field reports... TREECKO that reflect light like mirrors, TORCHIC that shimmer instead of burn. Keep your eyes open out there, [PLAYER]."*

### D. Postgame Birch Dialogue (replacing Johto starter text)

*"You've seen how the migration changed HOENN —\pthe coral, the foxes, the lily pads.\pBut I never showed you the most dramatic cases.\pThree species that were here all along —\pTREECKO, TORCHIC, MUDKIP —\pcompletely transformed.\pI think one of them should be with\pa trainer who understands\pwhat happened here.\pTake your pick!"*

## Implementation Roadmap

| Cycle | Mode | Objective | Depends On |
|-------|------|-----------|------------|
| C274 | planning | **THIS CYCLE** — Design document, species specs, presentation model | — |
| C275 | refactor | NPC dialogue generator (proactive build, 8th deferral) | — |
| C276 | feature | Treecko_Hoenn line (3 species via generator + sprites) | C274 design |
| C277 | feature | Torchic_Hoenn line (3 species via generator + sprites) | — |
| C278 | feature | Mudkip_Hoenn line (3 species via generator + sprites) | — |
| C279 | feature | Wild encounters (3 locations) + postgame gift + Birch dialogue | C276-278 |
| C280 | feature | Trainer integration — key NPCs carrying regional starters | C279 |

### Dependencies & Risks

1. **All key moves confirmed available** in hack's move table (Iron Head, Meteor Mash, Moonblast, Play Rough, Dazzling Gleam, Mach Punch, Cross Chop, Superpower, Extrasensory). Only Disarming Voice and Draining Kiss are missing — learnsets adjusted with available alternatives.
2. **Sprites**: 9 species need sprites. Sprite Designer batches 3/cycle, parallelizable with registration.
3. **Species IDs**: 439-447. EGG→448, NUM_SPECIES→448. Unown range auto-adjusts (relative to NUM_SPECIES).
4. **Postgame script**: Johto starter replacement = ~3 species constant swaps + dialogue rewrite. Low risk, uses existing infrastructure.

### Issue Triage

| Issue | Deferrals | Decision | Rationale |
|-------|-----------|----------|-----------|
| #154 Regional starters | 2 → **ACCEPT** | Designed this cycle. Implementation C276-280. |
| #151 Custom abilities | 3 | DEFER | Orthogonal to this arc |
| #152 Custom moves | 3 | DEFER | Revisit if future moves need adding |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2A7.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (27 registered)**: Last = Ludicolo_Hoenn(438). EGG=439, NUM_SPECIES=439. After v2.5: 36 species, EGG=448.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
