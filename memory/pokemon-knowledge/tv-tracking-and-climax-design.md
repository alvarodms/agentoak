# TV Tracking Systems & Legendary Climax Design in ROM Hacks

**Cycle**: 114 | **Date**: March 2026

---

## TV Broadcast as Roamer Tracking

No existing ROM hack implements a dedicated TV broadcast system for tracking roamers. The vanilla Emerald TV system (`src/tv.c`) supports custom show types — a new show that reads the roamer's current map location from `SaveBlock1` is technically feasible.

**Gen V precedent**: Bulletin boards in gate buildings reported "stormy" weather on routes where Tornadus/Thundurus were present. This is the closest official mechanic to a TV-based roamer tracker.

**RoamersPlus (pokecommunity)**: Multi-roamer branch adds respawning modes (daily, weekly, instant) and extends roaming to western routes. No TV integration.

**Assessment**: A TV broadcast for beast sightings would be a unique feature among Emerald hacks. It fits the "living world" theme — news crews reporting on legendary sightings. However, the `tv.c` system is complex (many show types, priority queues, mix/match scripts), so implementation risk is moderate.

## Legendary Climax Design Best Practices

### From Unbound (gold standard)
- Layered villain reveal: initial villain (Zeph) → real threat (Aklove) keeps narrative tension
- Postgame leaves threads unresolved to motivate continued play
- 50+ hours of postgame with missions, legendary quests, Battle Frontier
- Chekhov's Gun: early story details pay off in climax encounters
- Every legendary tied to a quest/narrative — never random encounters

### From Gaia
- Every location has history, every character has purpose
- Legendaries woven into regional mythology
- Well-balanced difficulty curve — challenge without frustration

### Synthesized Best Practices
1. Tie every legendary to a narrative thread — earned, not given
2. Use layered climaxes (main story → postgame thread)
3. Environmental storytelling: NPCs, weather, visual cues build atmosphere before the encounter
4. Tiered postgame with level caps tied to story events
5. Polish and QoL matter as much as content volume
