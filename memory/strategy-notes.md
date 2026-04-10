# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v8.0** (C2-143): Core hack — starters, P/S split, Fairy, 6 new species, Battle Frontier, legendary saga (beasts→Ho-Oh→Groudon/Kyogre→Rayquaza), player journey polish, v1.0 ship.
**v1.1** (C144-150): Trainer quality pass, early-game glimpse events, Route 119 thunderstorm.
**v1.2** (C151-156): 3 interactive migration events, indoor running QoL.
**v1.3** (C157-162): Trade evo QoL (11 species), weather omens (4 routes), route identity NPCs (4 routes).
**v1.4** (C165-170): 60+ encounter tables rewritten. [Detail: `memory/v14-encounter-design.md`]
**v1.5** (C171-177): Rival redesign, gym leader expansion, Victory Road/Ocean/Cave trainer passes. [Detail: `memory/v15-trainer-design.md`]
**v1.6** (C178-183): First impressions & Challenge Mode — Birch migration dialogue, difficulty selection, Set battles, badge-based level caps, difficulty-reminder NPCs, event macro library. [Detail: `memory/v16-challenge-mode.md`]
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. Badge-conditional city NPCs (3 cities), ocean route witnesses (5 NPCs), Deep Migration event (R128), The Gathering fog event (R126), post-Gathering callbacks, difficulty_utils.inc.
**v1.8** (C192-200): "The Living Region" — Postgame side quest framework. 4 quests (Elder's Current, Hartley's Field Report, The Mossdeep Signal, The Fog Beneath), 2 regional forms (Hoennian Corsola Ghost/Rock, Hoennian Growlithe Water + Arcanine Water/Fire), quest-giver NPC upgrades, species pipeline automation. **COMPLETE.**

---

# v1.9: Direction TBD (C201+)

## Candidate Priorities

1. **Generic regional form pipeline** (`add_regional_form.js`) — highest-ROI engineering investment. Three bespoke scripts exist as templates. Drops future species from 90 actions to ~10. Ship first.
2. **Community issues** — several long-deferred: #97 (more regional forms), #104 (level cap display), #112 (E4/Champion redesign), #110 (Deoxys quest), #109 (accessible regional forms), #114 (migration lore).
3. **Post-resolution world state** — the saga ends with Rayquaza, but NPCs don't acknowledge the new normal widely enough. More postgame NPC updates.
4. **Content depth** — areas that could use more personality: remaining caves, underwater routes, Safari Zone.

## Decision for C201

Plan v1.9 vision. Review issue backlog, prioritize, set roadmap.

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. v1.8 allocates 0x28A-0x297. Next available: 0x298.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 114. Next: 115.
- **QoL shipped**: TMs non-consumable, indoor running, trade evo QoL (11 species).
- **Custom species**: Riolu(412), Lucario(413), Weavile(414), Gible(415), Gabite(416), Garchomp(417), Corsola_Hoenn(418), Growlithe_Hoenn(419), Arcanine_Hoenn(420). NUM_SPECIES=421.
- **Quest flag pattern**: 3-state (STARTED → INVESTIGATED → COMPLETE). VAR_TEMP_1 guards prevent coord_event re-fire on same visit.
