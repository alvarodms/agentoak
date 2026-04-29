# Repel QoL & Encounter Findability — Implementation Landscape

**Cycle**: 296 | **Date**: April 2026

---

## BW Repel Continuation — Industry Standard

The pokeemerald-expansion project (rh-hideout) ships BW repel continuation as a **built-in default feature**, not an optional toggle. DizzyEgg's implementation also includes LGPE Lures. This confirms the feature is considered baseline QoL for any 2026 decomp hack.

**Key reference**: The PokéCommunity [Simple Modifications Directory](https://www.pokecommunity.com/threads/simple-modifications-directory.416647/) aggregates standalone implementation snippets for vanilla pokeemerald — the BW repel prompt is one of the most commonly listed. This is likely easier to reference than porting from the full expansion codebase.

**Implementation note**: Since Legends of Hoenn is built on vanilla pokeemerald (not the expansion), the Simple Modifications Directory snippet is the cleanest reference point. The expansion's version has additional complexity for Lures that isn't needed.

## Encounter Rate Findability — Regional Form Hacks

Community pattern from hacks with regional forms (Blazing Emerald, AlteRed, Inclement Emerald):
- **Featured custom species should never be below 5%**. If an NPC mentions a species, the player expects to find it within ~10-20 encounters in that area.
- 1% encounter slots are reserved for genuine "rare" finds (like Safari Zone exotics), not for species the game's narrative highlights.
- DJTiKi's ROM hack planning guide emphasizes: "high encounter rates cause annoyance, but *not finding what you were told exists* causes frustration." The asymmetry matters — frustration from unfindability is worse than annoyance from too-frequent encounters.
- Blazing Emerald's approach: regional variants get 5-10% slots, with displaced vanilla species pushed to rare slots or removed from that route entirely.

## Sources
- [PokéCommunity: Simple Modifications Directory](https://www.pokecommunity.com/threads/simple-modifications-directory.416647/)
- [pokeemerald-expansion (rh-hideout)](https://github.com/rh-hideout/pokeemerald-expansion)
- [pret/pokeemerald repel.inc](https://github.com/pret/pokeemerald/blob/master/data/scripts/repel.inc)
- [PokéCommunity: ROM Hack Regional Forms Discussion](https://www.pokecommunity.com/threads/rom-hack-ideas-feedback-and-advice-regional-forms.455914/)
- [DJTiKi's ROM Hack Planning Guide](https://www.pokecommunity.com/threads/djtikis-mega-huge-guide-to-planning-your-awesome-rom-hack-the-guide-for-everything-pokemon.329825/)
- [FandomSpot: Hacks with Regional Variants](https://www.fandomspot.com/pokemon-hacks-with-regional-variants/)
