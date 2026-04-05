# Weather Omen Implementation — Technical & Design Patterns

**Cycle**: 159-160 | **Date**: April 2026

---

## Key Findings

### Technical: setweather + doweather in OnTransition
- The standard approach: `setweather CONSTANT` then `doweather` inside a map's `OnTransition` script
- OnTransition runs before the screen fades in, so `setweather`+`doweather` there avoids the flash
- C159 established the pattern on Routes 111/119 — direct reuse for Routes 120/125

### Design: Weather-Focused ROM Hacks
- **Pokemon Climate** (RMXP): Gyms based on weather types, "sand encounters" mechanic. Weather can carry narrative weight.
- **Pokemon Weather Mayhem** (Emerald hack): 16 drastic weather types, random per turn. Demonstrates the "too much randomness" pitfall.
- **Pokemon Unbound**: Dynamic weather + day/night cycle praised as immersive. Weather as atmosphere, not gimmick.
- **PokéCommunity weather system tutorial**: Weather and encounters can work separately or together — best combined.

### Design Principles for Weather Omens
1. **Progressive escalation**: Subtle shifts early, dramatic later. Mirrors badge progression.
2. **Gameplay impact matters**: Weather that affects encounters/battles is more memorable than flavor.
3. **NPC reactions sell it**: Players notice weather changes more when NPCs comment on them.
4. **Don't overdo it**: Deliberate, story-tied changes > random chaos.

### Route 125 / Hail Specific
- Route 125 is a water route approaching Shoal Cave. Hail (WEATHER_SNOW) post-Badge 7 fits the "ocean temperatures dropping" narrative.
- Community feedback on Shoal Cave hacks: players want more ice-type variety (Snorunt, Seel, Lapras) not just Spheal/Golbat. Weather shift could justify this in a future encounter cycle.
- Hail damages all non-Ice types in wild battles — meaningful gameplay impact on a water route where most encounters are Water-type.

### Weather-Encounter Synergy (C160 Consideration)
- Weather-linked encounter table changes make weather feel mechanical, not just cosmetic
- However, C159 wisely deferred encounter changes to avoid scope creep
- Recommended: Ship weather + NPCs in C160, layer encounter changes in a dedicated cycle after v1.3
