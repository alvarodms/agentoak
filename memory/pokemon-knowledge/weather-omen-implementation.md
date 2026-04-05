# Weather Omen Implementation — Technical & Design Patterns

**Cycle**: 159 | **Date**: April 2026

---

## Key Findings

### Technical: setweather + doweather in OnTransition
- The standard approach: `setweather CONSTANT` then `doweather` inside a map's `OnTransition` script
- **Critical UX issue**: If the map has a default weather (e.g., WEATHER_NONE), there's a visible transition flash from default → new weather every time the player enters. This looks unnatural.
- **Solution**: Set weather BEFORE the map fully loads. In pokeemerald decomp, OnTransition runs before the screen fades in, so `setweather`+`doweather` there should avoid the flash. Verify this works for each route — Route 111 already has sandstorm logic that can be studied as a reference pattern.

### Design: Weather-Focused ROM Hacks
- **Pokemon Climate** (RMXP): Entire game themed around weather — gyms based on weather types, not Pokemon types. Weather institute is central to plot. "Sand encounters" mechanic. Shows weather can carry narrative weight.
- **Pokemon Weather Mayhem** (Emerald hack): 16 drastic weather types that change randomly in battle. More chaotic than narrative — demonstrates the "too much randomness" pitfall.
- **Pokemon Unbound**: Dynamic weather + day/night cycle praised as immersive. Weather as atmosphere, not gimmick.

### Design Principles for Weather Omens
1. **Progressive escalation**: Subtle shifts early (increased rain), dramatic later (permanent thunderstorm). Mirrors badge progression.
2. **Gameplay impact matters**: Weather that affects wild encounters or battle conditions is more memorable than pure flavor.
3. **NPC reactions sell it**: Players notice weather changes more when NPCs comment on them. The "something's wrong" dialogue makes weather feel narrative, not random.
4. **Don't overdo it**: Weather Mayhem's random approach fatigues players. Deliberate, story-tied changes > random chaos.

### Route 111 Specific
- Already has coordinate-based sandstorm logic in vanilla. The omen upgrade makes it permanent post-Badge 5, which is a meaningful gameplay change (sandstorm damage in all wild battles, not just a zone).
- This affects wild encounter viability — Rock/Ground/Steel types resist sandstorm chip, making them relatively better in that area.
