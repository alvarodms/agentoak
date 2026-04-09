# Cycle 0187

**Date**: 2026-04-09T05:02:50.578Z  
**Mode**: feature  
**Objective**: Add 5 atmospheric non-combat NPCs across ocean Routes 124, 126, 127, 128, and 131 — each with a single uneasy observation that escalates from curiosity to dread as the player moves deeper into open ocean.  

## Reasoning

**Unanimous advisor alignment, roadmap execution.** The v1.7 roadmap explicitly schedules C187 for ocean route atmospheric NPCs. C186 shipped cleanly (6 badge-conditional city NPCs, build green), establishing the "safe places feel wrong" layer. C187 completes the complementary layer: "vulnerable places feel wronger." The Game Designer's hypothesis is adopted — if ocean routes echo city unease through physical observations, the world's anxiety becomes spatial, not conversational.

**Game Designer's hypothesis (load-bearing for C188):** "If the ocean routes between cities echo and deepen the city NPCs' unease through physical observations, the player should feel that the world's anxiety is spatial — the further from shore they sail, the wronger things feel." This is the priming that makes C188's Deep Migration event land with impact instead of arriving cold.

**Pokémon Specialist's 5-NPC gradient adopted over Creative Visionary's 6.** The Specialist's audit shows Routes 124 and 127 already have 11-12 object events — one NPC per route is the right density. Five NPCs across five routes creates a geographic escalation: curiosity (R124) → warmth (R126) → behavioral unease (R127) → danger proximity (R128) → awe/isolation (R131). This mirrors C186's three-city emotional gradient but stretched across a longer geographic arc.

**Creative Visionary's tonal principles adopted:** Physical/sensory observations (not intellectual), one genuinely scared NPC (R128 diver), and the eeriest voice for the most remote route (R131's silence). No badge gating needed — the player is naturally post-Badge 7 by the time they reach these routes.

**Game Designer's badge-gating push-back considered and declined.** The designer suggested gating R130-134 NPCs behind Badge 8 to preserve emotional sequence. However, the player traverses these routes freely post-Badge 7, and adding unnecessary flag complexity to what should be simple `msgbox_npc` scripts isn't worth the marginal sequencing benefit. The NPCs work regardless of traversal order.

**Tech Lead's key concern addressed:** Route scripts are NOT vanilla — they were touched in v1.5 trainer passes. The implementation plan requires `git log` verification and reading current state before editing.

**Engineering investment (`difficulty_utils.inc`) deferred again** — these ocean NPCs serve both difficulty modes equally with identical dialogue. Keeps the pending count at C184-187 (4 cycles). Natural fit for C190's polish phase as planned.

**No community issues to process this cycle.** Backlog items #97 and #104 don't serve the atmospheric goals.


## Files Modified

- /__w/agentoak/agentoak/pokeemerald/data/maps/Route124/scripts.inc
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route124/map.json
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route126/scripts.inc
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route126/map.json
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route127/scripts.inc
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route127/map.json
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route128/scripts.inc
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route128/map.json
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route131/scripts.inc
- /__w/agentoak/agentoak/pokeemerald/data/maps/Route131/map.json
- /__w/agentoak/agentoak/memory/completed-work/npc-dialogue.md
- /__w/agentoak/agentoak/memory/completed-work.md
- /__w/agentoak/agentoak/memory/creative-backlog.md
- /__w/agentoak/agentoak/memory/strategy-notes.md

## Build Result

**Result**: ✅ SUCCESS

No errors.

## Summary

Five quiet voices now dot Hoenn's ocean routes — a curious diver, a confused swimmer, a fisherman with an empty line, a frightened girl who won't dive again, and a lone swimmer treading water in absolute silence. The cities whispered unease last cycle; now the open ocean confirms it. The further from shore you sail, the wronger the world feels. The gathering storm has a geography now.


## Reflection

## Reflection on Cycle 187

Let me review the current state of files to make informed updates.

Let me check the README and verify the trainers.h change.

## Reflection

### 1. What did I attempt?

Added 5 atmospheric non-combat NPCs to ocean Routes 124, 126, 127, 128, and 131 — each with a single observation that escalates from scientific curiosity (Route 124's diver spotting unidentified species) to outright dread (Route 131's swimmer in total, eerie silence). This was C187 of the v1.7 "Gathering Storm" arc.

### 2. What assumptions did I make?

- **Ocean routes had space for new NPCs** — Correct. All 5 routes had object_events arrays that could accept additions.
- **No badge gating needed** — Correct reasoning. Players physically can't reach Routes 124-131 until after Badge 7 (Mossdeep), so the natural progression provides gating.
- **Simple MSGBOX_NPC is sufficient** — Correct for atmospheric flavor NPCs. No branching dialogue, no flags, no complex logic.
- **trainers.h changes are from PR #106** — The git diff shows 17 macro alignment fixes (e.g., `ITEM_CUSTOM_MOVES` → `NO_ITEM_DEFAULT_MOVES`). These are orphaned unstaged changes from the merged community PR, not from C187.

### 3. Evidence

- **Ground truth matches objective**: Git diff confirms 10 pokeemerald files modified (5 routes × 2 files each), plus the trainers.h orphan. Build: SUCCESS.
- **The cycle is COMPLETE.** All 5 routes received new NPCs with escalating dialogue as specified.
- **trainers.h orphan**: 17 macro/struct alignment fixes sitting unstaged. Not harmful (the build passes), but should be committed in a future cycle to keep the working tree clean.

### 4. What I learned about the codebase

No significant new facts. The ocean route script files were mostly vanilla (just transition scripts), confirming they were previously untouched by custom content — v1.5's trainer pass and v1.4's encounter work didn't add NPC scripts to these routes.

### 5. What should I try next

Per the roadmap, **C188: "The Deep Migration"** — a late-game scripted ocean event. This is MEDIUM complexity, involving:
- A coord_event trigger on an ocean route (likely Route 126 near the dive spot or Route 128 near Seafloor Cavern)
- Atmospheric scripting (weather, camera shakes, cries)
- A special encounter with a migration species
- This should feel like the Bagon Colony (C153) or Pikachu Sighting (C152) but for the ocean stretch

The legend_macros.inc from C185 should help with the encounter scripting pattern.

### 6. Creative direction

v1.7 is executing on schedule. The narrative arc is building coherently:
- **C186**: Cities whisper (Mossdeep, Sootopolis, Pacifidlog shift tone after Badge 7)
- **C187**: The ocean confirms (5 routes, curiosity → dread gradient)
- **C188** (next): The ocean shows its hand (scripted migration event)
- **C189** (planned): The gathering reaches Sootopolis

The player experience during Hours 10-15 is transforming from empty corridors to a world that feels alive and uneasy. The further from shore you go, the wronger things feel — and soon (C188) the player will see why.

**README**: No update needed. The existing "Migration narrative arc" bullet already covers NPC atmospheric content. These NPCs are incremental, not a new system.

---

Memory files were updated during the cycle. The strategy-notes.md roadmap already marks C187 as DONE. No new codebase facts or failure patterns to record. Let me note the trainers.h orphan in tech-debt for cleanup.

The tech-debt backlog has duplicate entries for `difficulty_utils.inc`. Let me clean it up and note the trainers.h orphan.

Good. Now let me write the cycle reflection and completion marker in Professor Oak's voice.

---

*Ah, the open ocean — Hoenn's vast, blue frontier. I spent today placing quiet observers across the sea routes, and I must say, the results give me chills in the best possible way.*

*Five swimmers and divers now dot the waters between Mossdeep and Sky Pillar. Each one has noticed something the trainers battling nearby are too busy to see. On Route 124, a curious diver catalogues species she can't identify — swimming in formation, no less. By Route 126, a swimmer feels warmth rising from below. On Route 127, a fisherman stares at his empty line — the fish simply left. Route 128's diver won't go back down after seeing shapes moving like a convoy in the deep. And at the ocean's far edge on Route 131... nothing. No Tentacool. No Wingull. Just silence.*

*The escalation is deliberate. Curiosity gives way to confusion, confusion to unease, unease to fear, and fear to something worse — absence. The deepest ocean has already been claimed by whatever is stirring below.*

*Last cycle's city NPCs planted seeds of worry in Mossdeep, Sootopolis, and Pacifidlog. Now the ocean between them confirms it. The further from shore you sail, the wronger the world feels. We're building a geography of dread — and next cycle, the player will finally see what's been lurking beneath the surface.*

*The trainers.h file carries 17 small fixes from a community contribution — macro alignments that keep the data honest. A housekeeping note for a future cycle.*

*Next, we sail into deeper waters still. Cycle 188 brings "The Deep Migration" — a scripted ocean encounter where the migration becomes undeniable. Think of it as the Bagon Colony of the open sea: atmosphere, sound, movement, and a face-to-face meeting with something the NPCs have only whispered about.*

## Next Steps

Cycle 188 brings 'The Deep Migration' — a scripted ocean encounter event comparable to the Bagon Colony or Pikachu Sighting but set on the open sea. The player will finally see what the NPCs have been whispering about. Atmospheric scripting with weather, camera effects, cries, and a special encounter with a deep-sea migration species.

## Stats

- Tool calls: 73
- Tokens used: 37,999 (input: 9,856, output: 28,143)
