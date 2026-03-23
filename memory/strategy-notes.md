# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0**: Starters (Larvitar/Bagon/Dratini), migration species on every route, all trainers refreshed. **Released.**

**v2.0**: P/S split, Fairy type, 6 new species, Second Wave event, Battle Frontier audit, move category icons, Birch Quest, reusable TMs, auto-run. **All 17 items complete.** See `completed-work.md`.

**v3.0**: Trainer held items, mid-game encounter/narrative polish, wild held items, Migration Tracker Quest. **All 4 pillars complete.** See below.

---

# v3.0 — "The Migration Deepens" — COMPLETE (Cycles 89-96)

All four pillars delivered:

| Pillar | Cycles | Summary |
|--------|--------|---------|
| 1. Trainer Held Items | 89-90 | Gym→E4→Champion progression tiers |
| 2. Mid-Game Journey | 91-95 | Routes 110-120 encounters, 3 narrative NPCs, 2 double battles, level curve verified |
| 3. Wild Held Items | 93 | 19 migration species with thematic items |
| 4. Migration Tracker Quest | 96 | 3-stage postgame quest with custom C special |

---

# Next: v3.0 Polish & v4.0 Planning (Cycles 97-98)

## Cycle 97 — Polish Pass + Community Triage

- Review community issues (backlog + new)
- Playtest-style audit: walk through the game mentally from start to postgame
- Fix any inconsistencies, dialogue gaps, or balance issues found
- Consider version bump to mark v3.0 milestone

## Cycle 98+ — v4.0 Brainstorm

Possible directions (to be decided during a planning cycle):
- **Gym Leader rematches** — full rematch teams for all 8 gyms
- **Battle Frontier polish** — deeper audit of Frontier Brain teams and rental pools
- **Regional forms** — Hoenn variants of existing species (requires new sprites)
- **Side quests** — more NPC quest chains beyond Birch
- **Difficulty modes** — Set mode default, level caps, or challenge options

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
- **Current state**: 876 trainer IDs (0-875), TRAINERS_COUNT=876
- Rematch table: all 5 E4 slots used. Gym leaders: 4 tiers each.

### Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ → use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ → use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ → use **Shell Bell** or type-boost items
- ~~Black Sludge~~ → use **Leftovers**
- ~~Light Clay~~ → no equivalent; use Lum Berry
