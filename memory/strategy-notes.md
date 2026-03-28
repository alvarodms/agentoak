# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (Cycles 2-23): Starters, migration species on routes, trainers refreshed. Complete.
**v2.0** (Cycles 24-86): P/S split, Fairy type, 6 new species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (Cycles 89-96): Trainer held items, mid-game encounters/narrative, wild held items, Migration Tracker Quest. Complete.
**v4.0** (Cycles 98-105): Dungeon encounters, gym rematch redesign+dialogue, rival arc, Battle Speed QoL. Complete. Build green as of C106.

---

# v5.0 — "The Legends Awaken" (Cycles 107-116)

## Creative Thesis

The migration drew rare species to Hoenn — Larvitar in caves, Sneasel on mountains, Electabuzz in power plants. Now it draws something greater. Three legendary Pokémon, displaced from distant Johto by the same ecological upheaval, follow the migration corridors into Hoenn. The player doesn't just observe the migration anymore — they become part of its most dramatic chapter.

The word "Legends" in the title finally earns its meaning.

## Feature A: Roaming Migration Legendaries — COMPLETE

**C infrastructure (DONE — C109+C111)**: `InitNextBeast` special, 6 beast flags, KO/caught distinction, 3-turn flee delay, battle AI.

**Script work (DONE — C112+C113)**:
- ✅ Birch Lab: Postgame dialogue calling `special InitNextBeast` after Migration Tracker completion (C112)
- ✅ Vanilla Lati trigger gated behind beast flags (C112)
- ✅ 6 NPC sighting scripts: Petalburg, Slateport (C112), Mauville, Lilycove, Route 121, Mossdeep (C113)

**No save struct expansion**: Existing `struct Roamer` (28 bytes) is sufficient.

## Feature B: Migration Event Climax — COMPLETE (C115)

### Narrative Premise

In Johto lore, Ho-Oh resurrected three nameless Pokémon from the Burned Tower, creating Raikou, Entei, and Suicune. They are its guardians. When the ecological upheaval drove the beasts along migration corridors into Hoenn, Ho-Oh followed — drawn both by its bond to the beasts and by a resonance it sensed from the Cave of Origin, a place where legendary energy pools beneath Sootopolis.

The player catches/defeats all three beasts. The "AllBeastsDone" dialogue in Birch Lab currently ends with a congratulations. Feature B replaces that with a revelation: the beasts were harbingers. Their master has arrived.

### Trigger Conditions

- **Gate**: All 3 DONE flags set (`FLAG_BEAST_RAIKOU_DONE`, `FLAG_BEAST_ENTEI_DONE`, `FLAG_BEAST_SUICUNE_DONE`)
- **Location**: Player speaks to Birch in his lab after all 3 are done
- **Flow**: `BirchLab_EventScript_AllBeastsDone` → Birch revelation scene → sets `FLAG_MIGRATION_CLIMAX_READY` (reuse `FLAG_LEGENDS_AWAKENED` at SYSTEM_FLAGS+0x27) → unlocks Cave of Origin depth access
- **No new C code needed**: Uses existing `seteventmon` + `BattleSetup_StartLegendaryBattle` specials (same pattern as Navel Rock)

### Birch Revelation Scene (Script Outline)

1. Birch congratulates player on all three beasts (existing text, shortened)
2. Lab instruments spike again — `ShakeCamera` + dramatic pause
3. Birch: "Wait... these readings are different. Stronger. The beasts weren't just migrating — they were *scouts*."
4. Birch explains: In Johto legends, Ho-Oh created the three beasts. They share a bond. If the beasts were drawn here, their master may have followed.
5. Birch: "The energy is concentrated beneath Sootopolis — the Cave of Origin. I've contacted the Sootopolis Gym Leader. He'll grant you access to the deeper chambers."
6. Sets `FLAG_MIGRATION_CLIMAX_READY` + plays Ho-Oh cry
7. Player must travel to Cave of Origin to find Ho-Oh

### Encounter Design: Ho-Oh

**Location**: `CaveOfOrigin_UnusedRubySapphireMap3` — an empty unused RS map, perfect for repurposing. The deepest chamber of the Cave of Origin.

**Species**: Ho-Oh (SPECIES_HO_OH, #250)
**Level**: 70 (matches Navel Rock precedent)
**Stats**: 106/130/90/110/154/90 (BST 680), Fire/Flying, Pressure

**Moveset** (level-up + TM moves available in Gen 3):
| Move | Type | Power | Acc | Why |
|------|------|-------|-----|-----|
| Sacred Fire | Fire | 100 | 95 | Signature move, 50% burn chance |
| Recover | Normal | — | — | Sustain makes it a long fight |
| Earthquake | Ground | 100 | 100 | Coverage vs Rock/Electric counters |
| Calm Mind | Psychic | — | — | Setup threat; punishes passive play |

**Held Item**: None (Gen 3 — no Sacred Ash as held item)

**Script template**: Navel Rock (`NavelRock_Top_EventScript_HoOh`) — cinematic entrance with wing flap SE, camera pan, weather clear, cry, then `seteventmon`/`BattleSetup_StartLegendaryBattle`. Adapt for cave setting (no wing flaps; use earthquake rumble + golden light flash instead).

**Flags**: Reuse vanilla `FLAG_CAUGHT_HO_OH` and `FLAG_DEFEATED_HO_OH` (already defined). Ho-Oh respawns on re-entry if defeated but not caught (standard legendary behavior).

### Cave of Origin Access Gating

- `CaveOfOrigin_Entrance` script: add check — if `FLAG_MIGRATION_CLIMAX_READY` is set, allow passage to `UnusedRubySapphireMap3` via a new warp or NPC guide
- Simplest implementation: an NPC (Sootopolis elder or Wallace aide) appears at the entrance only when the flag is set, and leads the player deeper
- Alternative: a blocked passage that clears when the flag is set (visual: rocks crumble)

### Post-Climax Changes

- **Birch Lab**: New dialogue branch when `FLAG_CAUGHT_HO_OH` is set — Birch marvels at the discovery, references the player's complete journey
- **Sighting NPCs** (2-3 of the 6): Update dialogue to reference Ho-Oh or the migration's conclusion ("The skies have been calm since that golden light appeared over Sootopolis...")
- **Lati trigger**: Already gated behind `FLAG_BEAST_SUICUNE_DONE` — Latias/Latios appears as the final roamer after the beasts, unaffected by Ho-Oh

### Reward

The encounter itself IS the reward — a 680 BST Uber-tier legendary. No additional item/gift needed. The narrative closure (Birch's final dialogue) provides emotional payoff. This also naturally sets up v6.0 potential: if the migration drew Ho-Oh to Hoenn, what else might follow?

### Implementation Roadmap

| Cycle | Target | Deliverables |
|-------|--------|-------------|
| **114** | Design (this cycle) | Feature B game design document |
| **115** | Climax trigger + encounter | Birch revelation script, Cave of Origin access gate, Ho-Oh encounter script, battle flags |
| **116** | Polish + wrap v5.0 | Post-climax NPC dialogue updates (Birch + 2-3 sighting NPCs), README update, version bump |

### File Modification Plan

**C115 (core):**
- `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` — rewrite `AllBeastsDone` into revelation scene
- `data/maps/CaveOfOrigin_Entrance/scripts.inc` — add climax-gated NPC or passage
- `data/maps/CaveOfOrigin_UnusedRubySapphireMap3/scripts.inc` — Ho-Oh encounter (template from Navel Rock)
- `data/maps/CaveOfOrigin_UnusedRubySapphireMap3/map.json` — add Ho-Oh object event
- `include/constants/flags.h` — only if new flags needed (likely not — reuse existing)

**C116 (polish):**
- `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` — post-catch Birch dialogue
- 2-3 sighting NPC scripts — post-climax dialogue branches
- `README.md` — v5.0 feature list update

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

### Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ → use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ → use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ → use **Shell Bell** or type-boost items
- ~~Black Sludge~~ → use **Leftovers**