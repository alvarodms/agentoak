# Strategy Notes

High-level strategies, ideas for the ROM hack, what to try next, and lessons about approach.

> **Maintenance**: Keep this file under ~200 lines. Delete completed roadmap items older than 10 cycles. Remove research/analysis for decisions already made. This file is for *current* vision, *active* plans, and *live* technical reference — not a historical archive.

---

# LEGENDS OF HOENN — Vision

**v1.0**: Pokémon Emerald reimagined with powerful migrant species on every route. Starters: Larvitar/Bagon/Dratini. Every encounter worth catching. Every trainer a real fight. **Released.**

**v2.0**: Physical/special split, Fairy type, 4 new species (Riolu/Lucario/Weavile/Gible/Gabite/Garchomp), all trainers refreshed, Second Wave event, Battle Frontier fixes, move category icons. **All 17 roadmap items complete.** See `completed-work.md` for file-level detail.

---

## Technical Reference

### Trainer Modification Checklist
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2–5, for Match Call)
3. Ensure levels scale for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (0–11); probabilities 20/20/10/10/10/10/5/5/4/4/1/1
- Water: 5 slots; Fishing: 10 slots
- File: `pokeemerald/src/data/wild_encounters.json`

### QoL Reference
- **Reusable TMs**: Deleted 2 lines in `src/party_menu.c`
- **Auto-Run**: `(heldKeys & B_BUTTON)` removed; `FlagSet(FLAG_SYS_B_DASH)` in `new_game.c`

### Trainer ID Constraints
- **Current state**: 874 trainer IDs (0x500-0x869)
- Rematch table: all 5 E4 slots used. Gym leaders: 4 tiers each.

---

## Remaining Polish

### Battle Frontier P/S Split Audit
~117 Crunch/Shadow Ball Frontier entries remain for a future cycle. Punch batch done (Cycle 80).

### New Species Pipeline
**Checklist**: `memory/pokemon-knowledge/species-addition-pipeline.md` — 25 steps, ~29 source files per 2-species family. All planned species shipped.

### Second Wave Event
**Full spec:** `memory/second-wave-design.md`. All implementation complete (Cycles 63-65).

---

# Birch Postgame Research Quest — Design Document

## Overview

**Trigger**: Talk to Birch after becoming Champion (`FLAG_SYS_GAME_CLEAR` set).
**Theme**: Birch asks the player to investigate the migration's cause — field data from three sites, then a discovery at Meteor Falls.
**Structure**: 4 investigation stages + final report = 5 interactions. Stages 1-3 are non-linear; Stage 4 requires all three; Stage 5 requires Stage 4.

**Resolution**: The migration is a natural, cyclical phenomenon. The Meteor Falls meteorite emits a resonance every few centuries that draws Dragon-type and high-BST species to Hoenn. The Absol sensed change, not disaster. Hoenn is a sanctuary, not a crisis zone. The migration will stabilize on its own.

## Flags (6 total — verified available in flags.h)

| Flag | Hex | Purpose |
|------|-----|---------|
| `FLAG_BIRCH_QUEST_STARTED` | 0x022 | Quest hook given |
| `FLAG_BIRCH_QUEST_WEATHER` | 0x023 | Weather Institute done |
| `FLAG_BIRCH_QUEST_SLAB` | 0x024 | Scorched Slab done |
| `FLAG_BIRCH_QUEST_COZMO` | 0x025 | Prof. Cozmo done |
| `FLAG_BIRCH_QUEST_METEOR` | 0x026 | Meteor Falls discovery done |
| `FLAG_BIRCH_QUEST_COMPLETE` | 0x027 | Final reward given |

## Quest Stages

### Stage 0: Quest Hook — Birch's Lab
**Insert point**: `EventScript_Birch` line 474, before `goto_if_unset FLAG_HAS_MATCH_CALL`. Add: `goto_if_set FLAG_SYS_GAME_CLEAR, EventScript_BirchQuestCheck`. The quest check handler branches on all 6 flags in priority order (complete → meteor → all-3 → started → hook).
**Dialogue**: Birch congratulates Champion, reveals migration data is extraordinary, asks player to investigate 3 sites (Weather Institute, Scorched Slab, Prof. Cozmo). Non-linear — any order.

### Stage 1: Weather Institute 2F — Atmospheric Data
**Map**: `Route119_WeatherInstitute_2F`. Reuse existing scientist NPC.
**Gate**: STARTED set, WEATHER not set.
**Clue**: Electromagnetic pulse from underground, strongest toward northwest/Meteor Falls. Correlates with migration waves.
**Reward**: Leftovers (ITEM_LEFTOVERS).

### Stage 2: Scorched Slab — Ancient Records
**Map**: `ScoredSlab`. **New NPC**: Hiker (OBJ_EVENT_GFX_HIKER), visibility gated on FLAG_SYS_GAME_CLEAR.
**Gate**: STARTED set, SLAB not set.
**Clue**: Cave paintings showing Pokémon crossing seas toward Hoenn, a star falling into a mountain — cyclical, every few centuries.
**Reward**: TM02 Dragon Claw (thematic — Dragon migration).

### Stage 3: Fallarbor Town — Meteorite Analysis
**Map**: `FallarborTown_CozmosLab`. Reuse existing Cozmo NPC.
**Gate**: STARTED set, COZMO not set.
**Clue**: Meteorite fragments emit resonance activating Dragon-types. Cyclical — ~300 year period. Current cycle began ~18 months ago. Source: deep Meteor Falls.
**Reward**: PP Max (ITEM_PP_MAX).

### Stage 4: Meteor Falls B1F_1R — The Discovery
**Map**: `MeteorFalls_B1F_1R` (where Gible appears at 2%). **New NPC**: Researcher (OBJ_EVENT_GFX_SCIENTIST_1), visibility gated on FLAG_BIRCH_QUEST_STARTED.
**Gate**: All three investigation flags set, METEOR not set.
**Discovery**: Gible from Sinnoh gathered around the meteorite's glowing core — drawn across an ocean. The meteorite is a "heartbeat," not a weapon. This is the migration's epicenter.
**Reward**: Rare Candy x3.

### Stage 5: Report to Birch — Quest Complete
**Map**: `LittlerootTown_ProfessorBirchsLab`.
**Gate**: METEOR set, COMPLETE not set.
**Resolution**: Birch synthesizes all data — cyclical meteorite resonance, ancient paintings confirm millennia of migrations, Absol sensed change not disaster. Hoenn is a sanctuary. Migration will stabilize.
**Reward**: Master Ball (ITEM_MASTER_BALL) — "The League sent this for whoever solved the migration mystery."

## Narrative Continuity

Builds on: Second Wave Birch call ("migration is ACCELERATING"), Mauville Scientist ("readings off the scale"), Route 120 Absol swarm (20% post-Wave), Gible in Meteor Falls (Cycle 68), lab aide postgame ("migration species establishing territories"). Contradicts nothing. Recontextualizes Absol from disaster omen → change sensor.

## Technical Requirements

| Map | Changes | New NPCs |
|-----|---------|----------|
| `LittlerootTown_ProfessorBirchsLab` | Birch quest dialogue (6 branches) | 0 |
| `Route119_WeatherInstitute_2F` | Scientist quest branch | 0 |
| `ScoredSlab` | Hiker NPC + script | **1** (map.json entry needed) |
| `FallarborTown_CozmosLab` | Cozmo quest branch | 0 |
| `MeteorFalls_B1F_1R` | Researcher NPC + script | **1** (map.json entry needed) |

**Script pattern** (each investigation site):
```
lock → faceplayer → goto_if_set STAGE_FLAG (post-completion) → goto_if_set STARTED (quest active: dialogue + giveitem + setflag) → default dialogue
```

**Birch priority order**: COMPLETE → METEOR (give Master Ball, set COMPLETE) → all-3-set (unlock Meteor Falls) → STARTED (remind) → GAME_CLEAR (hook, set STARTED) → existing flow.

## Implementation Roadmap

### Cycle 82: Flags + Birch Lab Scripts
- `include/constants/flags.h` — rename 6 flags
- `LittlerootTown_ProfessorBirchsLab/scripts.inc` — full quest dialogue tree
- **Build risk**: Low (script additions, existing flag slots)

### Cycle 83: Investigation Sites 1-3
- `Route119_WeatherInstitute_2F/scripts.inc` — scientist branch
- `ScoredSlab/scripts.inc` + `map.json` — new Hiker NPC
- `FallarborTown_CozmosLab/scripts.inc` — Cozmo branch
- **Build risk**: Low (1 new NPC, 2 dialogue branches)

### Cycle 84: Meteor Falls + Quest Verification
- `MeteorFalls_B1F_1R/scripts.inc` + `map.json` — new Researcher NPC
- Verify full quest flag flow across all scripts
- **Build risk**: Low (1 new NPC)

**Dependencies**: Cycle 83-84 both depend on Cycle 82 (flags). They are independent of each other.

## Full Dialogue

Complete draft dialogue for all stages is in `memory/birch-quest-dialogue.md`.
