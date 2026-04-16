# Player Sprite Recoloring — Scope & Community Patterns

**Cycle**: 226 | **Date**: April 2026

---

## Scope in pokeemerald Decomp

Recoloring player characters (Brendan/May) is a **wide-surface cosmetic change**. All event object sprites of Brendan share a single palette (`graphics/object_events/palettes/brendan.pal`), which simplifies overworld recoloring. However, the full scope includes:

- **Overworld sprites** — walking, running, biking, surfing, diving, field moves (many animation frames)
- **Trainer back sprite** — `TRAINER_BACK_PIC_BRENDAN` / `TRAINER_BACK_PIC_MAY`
- **Trainer front sprite** — used in link battles, trainer card
- **Intro sequence** — Birch's intro uses player sprites
- **Cutscene graphics** — some events use hardcoded player graphics
- **Rival** — the unchosen character appears as the rival; must be recolored too for consistency

The PokeCommunity warns: if you edit overworld sprites, you MUST ensure all variants share the same palette or explicitly assign separate palettes in code.

## What Other Hacks Do

- **Greenless Version**: Removes Emerald's green color scheme, reverts Brendan/May to RS red/blue palette. Pure palette swap, widely appreciated for "feels more like RS."
- **CosmicEmerald**: Offers add-on patches for player color customization including cutscene appearances. Explicitly markets this as a feature.
- **Unbound / Radical Red**: Use entirely custom player characters (not recolors) — higher effort, bigger identity payoff.

## Key Takeaway

Palette-only recolor (no sprite reshaping) is **medium scope** — touching ~6-10 palette/graphic files, but safe because it's data-only (no C code changes). Full custom sprites are high scope. The differentiator value is real but purely cosmetic — no gameplay impact.

## Sources
- [PokeCommunity — Fix messed up palettes for player sprites](https://www.pokecommunity.com/threads/pokeemerald-how-to-fix-messed-up-palettes-for-the-player-sprites-other-than-walking.498164/)
- [Greenless Version — Romhacking.net](https://www.romhacking.net/hacks/2737/)
- [CosmicEmerald — PokeCommunity](https://www.pokecommunity.com/threads/pok%C3%A9mon-cosmicemerald-version-updated-12-24-2019.398314/)
- [Spriters Resource — Brendan Emerald](https://www.spriters-resource.com/game_boy_advance/pokemonemerald/asset/8324/)
