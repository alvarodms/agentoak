# Mid-Game Encounter Execution — Lessons from C164

**Cycle**: 165 | **Date**: April 2026

---

## Key Insight: Execution Risk on Encounter Overhauls

C164 demonstrated the risk of "planning drift" — a full design doc existed but the actual `wild_encounters.json` edits didn't land. The encounter specifications in `v14-encounter-design.md` are complete and verified; the work is pure JSON editing.

## Mid-Game Encounter Patterns from Top Hacks

- **Emerald++**: Trainer levels dynamically adjusted ±2 from player average — keeps mid-game engaging. Legends of Hoenn uses fixed levels but curated species diversity achieves similar engagement.
- **Modern Emerald**: Splits encounters into "Original" / "New (modern)" / "Post-game" tiers — similar to our SecondWave flag system.
- **Emerald Essence**: Removes version exclusives so both Zangoose+Seviper appear on R114. Our migration species serve a similar "expanded pool" role but with narrative justification.
- **R.O.W.E**: Open-world means every route must be self-contained. Our linear progression can use route-to-gym flow (e.g., Electrike on R110 → Wattson prep) which R.O.W.E can't.

## Applicable to C165

The mid-game routes (R110-117, Fiery Path) are 8-10 JSON encounter tables. The design doc has full slot-by-slot specs for R110, R111, R113. Routes R112, R114-117 have summary specs. The work is well-scoped for a single feature cycle if execution stays focused on the JSON file.
