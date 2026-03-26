# Roaming Legendaries & v1.0 Release Polish Patterns

**Cycle**: 107 | **Date**: March 2026

---

## Roaming Legendaries in ROM Hacks

Top hacks treat legendaries as **postgame rewards**, not core content:

- **Unbound**: Legendaries gated behind postgame side quests with narrative context (multiverse missions). Considered gold standard for postgame legendary design.
- **Glazed**: Legendaries scattered across 3 regions as exploration rewards. Roaming + fixed encounters.
- **Radical Red / Roaring Red**: All legendaries catchable, mostly in postgame Sevii Islands content.
- **Emerald Crest**: Extensive legendary quest system with progressive unlocks.

**Key pattern**: Roaming legendaries work best when tied to narrative. "Random roaming Latias" is forgettable; "migration-displaced legendary seeking a new territory" tells a story.

**Technical note**: pokeemerald already has roaming Latias/Latios infrastructure (roamer.c). Adding more roamers would extend existing systems rather than building from scratch.

## v1.0 Release Polish Priorities (from community examples)

Synthesized from Emerald Imperium, Contemporary Emerald, Re:Emerald, Randolocke release patterns:

1. **Game-breaking bugs**: Crashes, softlocks, progression blockers
2. **Emulator compatibility**: MyBoy known to crash on decomp hacks (Safari Zone especially)
3. **Scripted event correctness**: Shops, fossils, story flags
4. **Balance feedback**: Trainer difficulty, encounter rates
5. **Visual bugs**: Tileset/sprite issues
6. **Text polish**: Typos, grammar, decapitalization

**Common pattern**: Developers spend 1-3 update cycles on bug fixes before adding new content. Most bugs surface in first week of public release.

## Community Expectations for v1.0 (2025-2026 Landscape)

From PokéCommunity and ROM hack community analysis (C107 research):

- **QoL is table stakes**: Reusable TMs, faster gameplay, modern conveniences are expected, not bonus features. Legends of Hoenn already has reusable TMs, auto-run, and battle speed toggle — this is a strength.
- **Meaningful changes over vanilla**: Players criticize hacks that only rebalance stats without changing maps/story. Our migration narrative, new species, Fairy type, and P/S split differentiate us strongly.
- **Documentation matters**: Players want to know encounter locations, learnsets, TM lists. A README or in-game Pokédex coverage helps adoption.
- **Complete experience**: v1.0 implies the main story is fully playable start-to-finish. Our hack layers on top of vanilla Emerald's complete story, so this is satisfied.
- **Fair difficulty increase**: "The game puts up a fight now" — not Kaizo-level, but trainers with real movesets and full teams. Our gym leader overhauls, held items, and rival arc deliver this.
- **Recent comparable releases**: Phoenix Red (Mar 2026), Complete Crystal (2026), Ocean Blue — all emphasize exploration, balance, and QoL over extreme difficulty.
