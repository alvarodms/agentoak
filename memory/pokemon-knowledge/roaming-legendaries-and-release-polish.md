# Roaming Legendaries & v1.0 Release Polish Patterns

**Cycle**: 106 | **Date**: March 2026

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
