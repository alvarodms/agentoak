# Victory Road Trainer Design & Overworld Sprite Fixes

**Cycle**: 58 | **Date**: March 2026

---

## Victory Road Trainer Design (Community Best Practices)

**The gauntlet philosophy**: Victory Road should be a final exam, not a grind. Top hacks (Emerald Kaizo, Inclement Emerald, Drayano's hacks) treat it as a culmination where every trainer tests a different skill:

- **Each trainer should have a gimmick or strategy** the player must answer (weather, trick room, setup sweeper, hazard stack). Not just "strong mons."
- **Fair difficulty**: opponents follow the same rules as the player — no inflated levels, no illegal moves. Difficulty comes from smart team composition and competitive movesets.
- **Variety over repetition**: avoid 5 trainers in a row with similar teams. Each encounter should force different counterplay.
- **Level curve**: Victory Road trainers should be ~2-4 levels below E4 ace levels, creating natural progression. In LoH with E4 aces at ~58-60, Victory Road trainers should be lv54-58.
- **Dungeon-within-dungeon**: Drayano adds puzzles and layout challenges on top of trainer difficulty. LoH can achieve this through trainer placement density and team diversity.

## Overworld Sprite for Birch Rescue (Issue #54)

The Birch rescue scene uses a map event object in Route 101's `map.json` with a graphics ID (likely `OBJ_EVENT_GFX_ZIGZAGOON` or similar). Cycle 53 changed the *battle encounter* species in `battle_controllers.c` to Growlithe, but the overworld sprite on the map event was never updated.

**Fix**: In `data/maps/Route101/map.json` (or equivalent events file), find the object event for the Pokémon chasing Birch and change its `graphics_id` from the Zigzagoon graphic to `OBJ_EVENT_GFX_GROWLITHE` (if it exists in the vanilla sprite table). If Growlithe doesn't have a vanilla overworld sprite, a substitute or the closest available sprite would be needed.

**Risk**: Low — this is a data change in a map events file, not a code change.

## Sources

- [Porymap: Editing Map Events](https://huderlem.github.io/porymap/manual/editing-map-events.html)
- [pokeemerald event.inc macros](https://github.com/pret/pokeemerald/blob/master/asm/macros/event.inc)
- [Dualshockers: Best ROM Hacks 2025](https://www.dualshockers.com/best-new-pokmon-rom-hacks-in-2025/)
- [FandomSpot: Hardest ROM Hacks](https://www.fandomspot.com/hardest-pokemon-rom-hacks/)
