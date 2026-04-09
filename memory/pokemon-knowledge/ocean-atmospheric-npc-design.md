# Ocean Atmospheric NPC Design — Patterns & Placement

**Cycle**: 187 | **Date**: April 2026

---

## Current State of Ocean Routes (124-134)

All existing NPCs on ocean routes are **trainers or item balls**. Zero non-combat atmospheric NPCs exist. This is the gap C187 fills.

### NPC Density (object_events per route)
- **Route 124**: 12 objects (5 trainers + 3 items + 2 double-battle pairs)
- **Route 126**: 9 objects (7 trainers + 1 item + 1 pair)
- **Route 127**: 11 objects (7 trainers + 3 items + 1 pair)
- **Route 131**: 8 objects (6 trainers + 2 pairs)

Routes 124 and 127 are already dense. R131 and the R130/132-134 stretch have more room.

## Design Principles for Water Route Atmospheric NPCs

### From Top Hacks (Cross-Referenced with C186 Research)
1. **Non-trainer swimmers are uncommon in vanilla** — players expect swimmers to battle. A non-combat swimmer who just talks is a surprise moment. Use this to advantage: the player approaches expecting a fight, gets unsettling dialogue instead.
2. **Elevation matters**: Water NPCs need elevation 1 (swimming). Land NPCs on island fragments use elevation 3. Fishermen on small islands (like R127's Jonah/Roger/Henry) are a natural fit for atmospheric observers — they sit still and watch the sea.
3. **Occupational variety**: Swimmers report body sensations (warm currents, strange pulls). Fishermen report behavioral changes (unusual catches, fish behavior). Divers report what they see below. Sailors report navigational anomalies.

### Narrative Escalation Pattern
The player typically traverses east-to-west (Mossdeep → Pacifidlog direction) or south toward Sootopolis. The atmosphere should build:
- **R124 (near Mossdeep)**: Curiosity — "Haven't seen species like these before"
- **R126 (Sootopolis approach)**: Warmth — physical sensation of water temperature change
- **R127-128 (Seafloor Cavern area)**: Unease — turbulence, depth references, danger proximity
- **R130-134 (remote ocean)**: Isolation + awe — vast ocean, something massive below, loneliness amplifies dread

### Practical Implementation Notes
- Use `TRAINER_TYPE_NONE` with `trainer_sight_or_berry_tree_id: "0"` for non-combat NPCs
- No badge gating needed (player is naturally post-Badge 7 by the time they reach these routes)
- Simple `msgbox_npc` scripts — one observation per NPC, no branching
- 4-6 total NPCs across all routes. Don't over-saturate: 1 per route cluster is enough
- Consider fisherman sprites on island tiles (elevation 3) as well as swimmer sprites on water (elevation 1)
