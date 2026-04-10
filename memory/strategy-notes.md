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
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. Badge-conditional city NPCs (3 cities), ocean route witnesses (5 NPCs), Deep Migration event (R128), The Gathering fog event (R126), post-Gathering callbacks, difficulty_utils.inc. Filled the Badge 7→E4 narrative void.

---

# v1.8: "The Living Region" (C192-C199)

## Vision

The hack's main arc is complete: curiosity → alarm → dread → triumph → investigation → resolution. But the postgame plays as a **linear questline** — Birch quest → Migration Tracker → Beasts → Ho-Oh → Primal → Rayquaza → done. The player has no agency, no branching, no reason to revisit the world.

v1.8 transforms the postgame from a questline into a **living world**. Side quests give the player choices about what to investigate next. Existing NPCs — the Elder, Dr. Hartley, the Mossdeep researcher — become quest givers. Two regional forms prove the migration didn't just bring new species; it **changed** species already here. And after Rayquaza, the world acknowledges what happened — NPCs across Hoenn reflect on the "new normal."

**Core question v1.8 answers**: *What happened to the world after I saved it?*

## Design Principles

1. **Weave, don't stack.** Side quests activate post-E4 and run alongside the legendary saga, not after it.
2. **Reuse existing NPCs.** Every quest giver is someone the player already met. No new NPCs just to start quests.
3. **Regional forms earn their existence.** Each has a narrative reason (migration changed this species) and a discovery mechanism (side quest reward). No random encounter-table drops.
4. **Resolution, not sequel.** After Rayquaza, the world settles. v1.8 is a denouement — richer, different, at peace. No new crisis.
5. **Minimal new flags.** Under 6 per quest. Total allocation: 14 flags (0x28A-0x297).

## Postgame Emotional Arc

The legendary saga provides: wonder (beasts) → awe (Ho-Oh) → urgency (Primal) → determination (Groudon/Kyogre) → peace (Rayquaza). v1.8 adds a parallel track of quieter discovery:

| Beat | Trigger | Feeling | Content |
|------|---------|---------|---------|
| **Curiosity** | FLAG_SYS_GAME_CLEAR | "Secrets remain" | Side quests unlock. NPCs gain postgame dialogue. |
| **Investigation** | Player picks up quests | "The migration changed everything" | Each quest revisits a familiar area with new context. |
| **Discovery** | Completing quests | "This isn't the same Hoenn" | Regional form encounters — species transformed by the migration. |
| **Acknowledgment** | FLAG_CAUGHT_RAYQUAZA_GUARDIAN | "The world knows" | Post-resolution NPC updates. R126 fog thins. |
| **Continuation** | All quests complete | "Always more to learn" | Birch's final dialogue: Champion AND researcher. |

## Side Quest Framework

### Quest 1: "The Elder's Current" (Pacifidlog)

**Giver**: Pacifidlog Elder (C186/C190). **Trigger**: FLAG_SYS_GAME_CLEAR.
**Premise**: Ocean currents near Pacifidlog reversed since The Gathering. The Elder asks the Champion to investigate a dive spot on Route 132 where sailors won't go.
**Steps**: (1) Talk to Elder → FLAG set. (2) Route 132 coord_event → underwater sequence with environmental text. (3) Return to Elder → reward + lore.
**Reward**: Hoennian Corsola encounter (Ghost/Rock, Lv45) + Mystic Water.
**Narrative**: The reversed currents exposed volcanic thermal vents that fossilized the coral — Corsola adapted by becoming ghostly remnants.
**Flags**: 0x28A (started), 0x28B (investigated), 0x28C (complete). 3 total.

### Quest 2: "Hartley's Field Report" (Weather Institute)

**Giver**: Dr. Hartley (C141). **Trigger**: FLAG_SYS_GAME_CLEAR.
**Premise**: Hartley compiling a report on permanent weather changes. Needs ground-truth readings from 3 sites where weather omens settled (v1.3 C159-160).
**Steps**: (1) Talk to Hartley → FLAG set. (2) Visit R111 sandstorm, R119 rain, R125 hail sites — existing weather omen NPCs gain postgame dialogue + set field-check flags. (3) Return to Hartley → reward + publication.
**Reward**: Hoennian Growlithe encounter (Water, Lv40) + Nevermeltice.
**Narrative**: The weather didn't revert. Growlithe migrants caught in the permanent coastal storms lost their fire — adapted to Water type.
**Flags**: 0x28D (started), 0x28E-0x290 (3 field sites), 0x291 (complete). 5 total.

### Quest 3: "The Mossdeep Signal" (Space Center)

**Giver**: Mossdeep Space Center researcher (C186). **Trigger**: FLAG_PRIMAL_CRISIS_RESOLVED.
**Premise**: The Primal Stirring's energy pulse was detected bouncing off something in the upper atmosphere.
**Steps**: (1) Talk to researcher → FLAG set. (2) Travel to Route 131 specific tile → coord_event with atmospheric shimmer + cosmic SFX. (3) Return → revelation.
**Reward**: Star Piece x3 + Comet Shard. Narrative payoff, not species.
**Narrative**: The migration's energy rippled beyond earth/sea/sky. Something cosmic noticed. Seeds wonder without starting a crisis.
**Flags**: 0x292 (started), 0x293 (investigated), 0x294 (complete). 3 total.

### Quest 4: "The Fog Beneath" (Route 126)

**Giver**: WarmSwimmer (C187/C189, Route 126). **Trigger**: FLAG_GATHERING_EVENT.
**Premise**: The permanent fog hides a new underwater opening that appeared during The Gathering.
**Steps**: (1) Talk to WarmSwimmer → FLAG set. (2) Dive at specific R126 spot → environmental text + discovery. (3) Surface → special encounter.
**Reward**: Lapras encounter (Lv50, holding Shell Bell) — a non-Hoenn migrant drawn by The Gathering.
**Narrative**: The Gathering physically changed the seabed. The fog is permanent because what it covers is permanent.
**Flags**: 0x295 (started), 0x296 (investigated), 0x297 (complete). 3 total.

## Regional Forms Strategy (Issue #97)

**2 forms in v1.8. More deferred to v1.9.** Each requires the full 13-file species pipeline.

### Hoennian Corsola (Ghost/Rock) — Quest 1 reward
- **Lore**: Volcanic thermal vents fossilized coral. Corsola became ghostly remnants of living reef.
- **Types**: Ghost/Rock. **Ability**: Weak Armor. **BST**: ~410.
- **Distinct from Galarian Corsola**: Volcanic (not pollution), Rock subtype (not pure Ghost), different ability.
- **Pipeline**: 1 species = 1 implementation cycle.

### Hoennian Growlithe (Water) → Hoennian Arcanine (Water/Fire) — Quest 2 reward
- **Lore**: Fire-type migrants caught in permanent coastal storms. Fire quenched; adapted to swim.
- **Growlithe**: Water. **Ability**: Swift Swim. **BST**: ~350.
- **Arcanine**: Water/Fire (unique type combo — only Volcanion shares it). **Ability**: Swift Swim. **BST**: ~555. Evolves via Water Stone.
- **Pipeline**: 2 species = 1-2 implementation cycles.

## Engineering Prerequisites

1. **Trainer ID Audit** (pending 44 cycles): Ship C192. Expected 10-20 reclaimable IDs.
2. **Quest flags**: Allocate 0x28A-0x297 in flags.h. 14 flags for 4 quests.
3. **Species pipeline**: Established pattern from 6 prior species. Sprite Designer for palette work.
4. **No new macros needed**: Quest scripts use existing event_macros.inc patterns.

## Phase Plan

| Cycle | Phase | Scope | Depends On |
|-------|-------|-------|------------|
| **C192** | Engineering | ~~Trainer ID audit + quest flag declarations + NPC dialogue~~ DONE | — |
| **C193** | Quest | ~~"The Elder's Current" — Pacifidlog quest + R132 dive event~~ DONE | C192 flags |
| **C194** | Quest | "Hartley's Field Report" — Weather Institute quest + 3 site updates | C192 flags |
| **C195** | Species | Hoennian Corsola (Ghost/Rock) — full pipeline + Quest 1 integration | C193 |
| **C196** | Species | Hoennian Growlithe/Arcanine (Water, Water/Fire) — pipeline + Quest 2 | C194 |
| **C197** | Quest+Narrative | Quests 3-4 (Mossdeep Signal + Fog Beneath) + post-Rayquaza NPC updates | C192 |
| **C198** | Polish | Birch epilogue, narrative audit, R126 fog thinning post-Rayquaza, Issue #104 | All |
| **C199** | Buffer | Overflow, community issues, v1.9 planning | — |

### Issue Tracking
- **#97 (Regional forms)**: Partially addressed C195-196 (2 forms). More in v1.9.
- **#104 (Level cap display)**: Scheduled C198 polish.

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. v1.8 allocates 0x28A-0x297. Next available after v1.8: 0x298.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 114. Next: 115.
- **QoL shipped**: TMs non-consumable, indoor running, trade evo QoL (11 species).
