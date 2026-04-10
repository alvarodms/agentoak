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

### Quest 1: "The Elder's Current" (Pacifidlog) — DONE (C193, C195)

**Giver**: Pacifidlog Elder. **Reward**: Hoennian Corsola encounter (Ghost/Rock, Lv45) + Mystic Water.

### Quest 2: "Hartley's Field Report" (Weather Institute) — DONE (C194, C198)

**Giver**: Dr. Hartley. **Reward**: Hoennian Growlithe encounter (Water, Lv40, held NeverMeltIce).
**Status**: Complete. Quest dialogue (C194), species pipeline + encounter wiring (C198). Growlithe_Hoenn and Arcanine_Hoenn both registered and building clean.

### Quest 3: "The Mossdeep Signal" (Space Center) — NOT STARTED

**Giver**: Mossdeep researcher. **Reward**: Star Piece x3 + Comet Shard. Narrative payoff, not species.

### Quest 4: "The Fog Beneath" (Route 126) — NOT STARTED

**Giver**: WarmSwimmer. **Reward**: Lapras encounter (Lv50, holding Shell Bell).

## Regional Forms Strategy (Issue #97)

### Hoennian Corsola (Ghost/Rock) — DONE (C195)
### Hoennian Growlithe (Water) → Hoennian Arcanine (Water/Fire) — DONE (C198)

**Species IDs**: GROWLITHE_HOENN (419), ARCANINE_HOENN (420). EGG shifted to 421.
**Pipeline**: Node.js script (`scripts/add_growlithe_arcanine.cjs`) + manual patches for graphics tables and extern declarations.
**Encounter**: Quest 2 reward — scripted battle in Weather Institute 2F after Hartley's investigation.

## Phase Plan (Revised after C197)

| Cycle | Phase | Scope | Status |
|-------|-------|-------|--------|
| **C192** | Engineering | Trainer ID audit + quest flag declarations | DONE |
| **C193** | Quest | "The Elder's Current" + Corsola Hoenn encounter | DONE |
| **C194** | Quest | "Hartley's Field Report" + 3 site updates | DONE |
| **C195** | Species | Hoennian Corsola (Ghost/Rock) — full pipeline | DONE |
| **C196** | Species | Growlithe/Arcanine attempt 1 — manual, never built | FAILED |
| **C197** | Species | Growlithe/Arcanine attempt 2 — script, build error | FAILED |
| **C198** | Species | Growlithe/Arcanine attempt 3 — full pipeline + Quest 2 wiring | **DONE** |
| **C199** | Buffer | Quests 3-4 OR generic add_regional_form.js OR v1.9 planning | — |

### Issue Tracking
- **#97 (Regional forms)**: Corsola_Hoenn (C195) + Growlithe/Arcanine (C198) done. More in v1.9.
- **#104 (Level cap display)**: Deferred — no room in v1.8 unless C198 succeeds quickly.

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. v1.8 allocates 0x28A-0x297. Next available after v1.8: 0x298.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 885/885, 12 reclaimable IDs (C192 audit): #117, #173, #462, #485, #486, #568, #581, #633, #634, #851, #852, #853.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 114. Next: 115.
- **QoL shipped**: TMs non-consumable, indoor running, trade evo QoL (11 species).
