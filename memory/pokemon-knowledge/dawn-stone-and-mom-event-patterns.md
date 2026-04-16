# Dawn Stone Implementation & Mom Event Replacement Patterns

**Cycle**: 223 | **Date**: April 2026

---

## Dawn Stone in Emerald Hacks

Most vanilla-pokeemerald hacks avoid adding the Dawn Stone entirely — they use level-based evolution for Froslass instead. The PokéCommunity tutorial "Adding New Evolution Stones the easy way" (2015, still referenced) covers the general approach for GBA hacks: define a new item constant, add name/description/icon, set the ITEM_USE_FIELD_EFFECT to EVO_STONE, and wire up the evolution method.

pokeemerald-expansion includes Dawn Stone natively (ITEM_DAWN_STONE exists in the item tables). Vanilla pokeemerald does NOT — adding it requires creating a new item entry, which is more invasive than using EVO_LEVEL.

**Hack survey:**
- **Inclement Emerald**: Has Dawn Stone natively (expansion-based)
- **Modern Emerald**: Uses level-based for Froslass (Lv42)
- **Royal Emerald**: Uses level-based (Lv42)
- **LoH current**: Uses EVO_LEVEL (Lv38) — issue #133 flags this as confusing alongside Glalie at Lv42

## Running Shoes Mom Event

No major hack documents a creative replacement for the mom Running Shoes event when auto-run is enabled. Most hacks that enable auto-run simply skip or ignore the redundancy. This is an untapped creative opportunity — community member alvarodms (#135) specifically suggests making it migration-themed.

The mom event script is in `LittlerootTown_BrendansHouse_1F/scripts.inc` (or MaysHouse). It checks FLAG_SYS_POKEMON_GET and gives ITEM_RUNNING_SHOES.

## Sources
- [Adding New Evolution Stones — PokéCommunity](https://www.pokecommunity.com/threads/adding-new-evolution-stones-the-easy-way.366913/)
- [Dawn Stone — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Dawn_Stone)
- [Running Shoe Script — PokéCommunity](https://www.pokecommunity.com/showthread.php?t=361334)
