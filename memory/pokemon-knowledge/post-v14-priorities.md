# Post-v1.4 Priorities — ROM Hack Community Expectations

**Cycle**: 170 | **Date**: April 2026

---

## v1.4 Status: COMPLETE (C169)

All 60+ encounter tables overhauled across land, caves, and 17 ocean routes. v1.4 "The Wild Redesign" is shipped and building.

## Community Expectations After Encounter Overhauls

Based on research into top-rated hacks (Unbound, Inclement Emerald, Radical Red, Emerald Legacy, Emerald Azure, Elite Redux):

1. **Data integrity matters more than volume**: Players notice broken encounters immediately. Validation tooling pays for itself. The tech debt backlog has deferred encounter validation and `make check_scripts` for 16+ cycles.

2. **Trainer quality must match encounter quality**: If wild Pokemon are carefully curated but trainers still use vanilla teams, the dissonance is noticeable. Emerald Azure gives 90% of trainers custom teams with smart AI. Elite Redux uses competitive movesets. "Yet Another Emerald Hack" uses smarter AI + held items + better IVs — slightly harder than vanilla but not kaizo. This is the #1 community expectation after an encounter overhaul.

3. **Engineering before content**: The ROM hacking community consensus (PokeCommunity, decomp projects) is "make small changes and test each one." After a 60+ table overhaul, a stabilization/validation cycle is standard practice before starting new content.

## Recommendation for C170

**Option A (Engineering)**: Build encounter validation script + promote `make check_scripts`. Protects the v1.4 investment. 16+ cycles deferred — this is overdue.

**Option B (Trainer Quality Pass)**: Begin v1.5 trainer team overhaul to match the encounter redesign quality. Emerald Azure/Elite Redux show this is what players expect next.

**My recommendation**: Option A first (one cycle), then Option B as v1.5's main arc. The encounter tables are the hack's crown jewel now — protect them before building on top.
