# Deep Migration Event Design — Scripted Ocean Encounter Patterns

**Cycle**: 188 | **Date**: April 2026

---

## What Makes Great Scripted Discovery Events in ROM Hacks

### Pattern from Legends of Hoenn's Own Best Events

The hack's strongest scripted moments follow a consistent formula:
1. **Environmental trigger** (coord_event on a natural chokepoint)
2. **Atmospheric buildup** (weather change, camera shake, SE_cry)
3. **Visual payoff** (overworld sprite movement the player WATCHES, not just reads about)
4. **NPC witness/context** (optional — Hartley on R119, Keeper on Mt. Pyre, Scientist in Meteor Falls)
5. **Special encounter** (unique wild battle with held item as reward)

Best-received events: Petalburg Woods Pikachu (pure visual — sprite dashes across path), Meteor Falls Bagon Colony (NPC + lore + encounter), Route 119 Thunderstorm (weather drama + Hartley dialogue).

### Ocean-Specific Design Considerations

- **Dive mechanic** is unique to ocean routes and underutilized for narrative. An event that involves surfacing from a dive spot (or triggers while surfing near one) would feel distinctly oceanic.
- **Water tile movement** is slower than land — pacing must account for this. Keep the active event area compact.
- **Swimmer/Diver NPC sprites ON water** are unusual as non-combatants — C187 established this pattern, so a witness NPC in the event would feel like a natural escalation.
- **Camera limitations**: GBA viewport is small. "Something massive" needs to be conveyed through sound, screen effects, and partial sprite visibility rather than showing a huge creature.

### Community Expectations for "Payoff" Events

From ROM hack community analysis: players tolerate atmospheric buildup ONLY if the payoff delivers something mechanically meaningful (a rare encounter, a unique item, an unlock). Pure narrative beats without gameplay reward are criticized as "cutscene bloat."

The C186-187 NPC gradient built expectations of something big. The Deep Migration must deliver:
- A VISUAL moment (overworld movement, not just text)
- A MECHANICAL reward (special encounter or item)
- A NARRATIVE connection (references what NPCs warned about)
