# Primal Static Encounter Design — Groudon & Kyogre

**Cycle**: 124 | **Date**: March 2026

---

## Level & Moveset Considerations

Both are 670 BST Ubers. At Lv70 in Gen 3:
- **Groudon** knows: Mud Shot, Scary Face, Ancient Power, Slash, Bulk Up, Earthquake, Fire Blast, Rest, Fissure, Eruption (learns at 75, so NOT at 70). Key moves at 70: Earthquake + Fire Blast + Bulk Up + Rest. Drought activates on entry.
- **Kyogre** knows: Water Pulse, Scary Face, Ancient Power, Body Slam, Calm Mind, Ice Beam, Hydro Pump, Rest, Sheer Cold, Double-Edge (learns at 65). Water Spout at 75 — NOT at 70. Drizzle activates on entry.

Lv70 is appropriate — matches vanilla Emerald's Rayquaza level, sits above the remnant trainers (Lv40-45), and signals postgame power.

## Community Expectations (2025-2026 Research)

1. **Narrative-earned encounters are mandatory** — ROM hack community harshly criticizes "free" legendaries. Legends of Hoenn already has the narrative scaffolding (Primal Stirring arc, remnant trainers, investigation flags). This is well set up.
2. **Post-catch world changes sell the moment** — Hoenn's Last Wish built an entire game around legendary consequences. Even smaller hacks (Emerald Legacy, Crest) add NPC dialogue changes. The C125 "world reaction" cycle addresses this.
3. **Weather abilities create cinematic drama for free** — Drought/Drizzle activate on battle entry. The pre-battle script should match: Groudon's room gets intense sunlight/heat effects, Kyogre's room gets rain/flooding effects. Use `setweather`/`doweathereffect` before the encounter.
4. **Avoid "legendary inflation"** — Big Blue was criticized for too-easy legendary access. The investigation gate (flags from C118-123) prevents this.

## Scripting Best Practices (from C115 research + new findings)

- Use the Ho-Oh (Cave of Origin) encounter script as direct template
- Groudon: camera shake + `SE_M_EARTHQUAKE` SFX, fade to black, reveal sprite, dramatic pause
- Kyogre: water SFX + screen flash, fade to white (underwater divine moment), reveal sprite
- Both should have brief pre-battle NPC-less dialogue boxes describing the scene ("The ground trembles violently..." / "The ocean surges with impossible force...")
- Post-catch: set flag, change weather back to normal, brief aftermath text
