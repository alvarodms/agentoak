# Player Sprite Recoloring — Scope & Community Patterns

**Cycle**: 227 | **Date**: April 2026

---

## Scope in pokeemerald Decomp

Recoloring player characters (Brendan/May) is a **wide-surface cosmetic change**. All event object sprites of Brendan share a single palette (`graphics/object_events/palettes/brendan.pal`), which simplifies overworld recoloring. However, the full scope includes:

- **Overworld sprites** — walking, running, biking, surfing, diving, field moves (many animation frames) in `graphics/object_events/pics/people/`
- **Trainer back sprite** — `TRAINER_BACK_PIC_BRENDAN` / `TRAINER_BACK_PIC_MAY`
- **Trainer front sprite** — used in link battles, trainer card
- **Intro sequence** — Birch's intro uses player sprites
- **Cutscene graphics** — some events use hardcoded player graphics
- **Rival** — the unchosen character appears as the rival; must be recolored too for consistency

## Critical Gotcha: Diving Sprites Use Palette 15

**The #1 missed-file risk.** PokeCommunity threads confirm that diving sprites use **palette slot 15** instead of palette 0 like other overworld player sprites. This means editing `brendan.pal` alone will NOT update the underwater appearance. Two approaches:

1. **Remap the diving sprites** to use the same palette slot as other player sprites (edit `object_event_graphics_info.h`)
2. **Edit the embedded palette** in the diving PNG itself to match the new colors

The research cycle (C227) MUST explicitly locate and catalog the diving sprite files and their palette assignment in `object_event_graphics_info.h`.

## Sprites Without .pal Files

Some pokeemerald sprites embed their palette directly in the PNG rather than referencing a separate `.pal` file. If the research pass finds PNGs with no `.pal` reference, each must be opened and re-indexed to the new palette manually. This is a common gotcha per PokeCommunity — editing the `.pal` file won't affect these sprites.

## What Other Hacks Do

- **Greenless Version**: Removes Emerald's green scheme, reverts Brendan/May to RS red/blue palette. Pure palette swap, widely appreciated for "feels more like RS."
- **CosmicEmerald**: Offers add-on patches for player color customization including cutscene appearances. Explicitly markets this as a feature.
- **Unbound / Radical Red**: Use entirely custom player characters (not recolors) — higher effort, bigger identity payoff.

## GBA Palette Constraints

- GBA palettes are 16 colors max (first color = transparent, leaving 15 usable)
- Colors are 15-bit RGB (5 bits per channel = 32 levels per channel)
- For cyan/teal tones: ensure sufficient contrast against water/cave environments (common player locations). The GBA's limited color depth can make close blues/cyans muddy.

## Sources
- [PokeCommunity — Fix messed up palettes for player sprites](https://www.pokecommunity.com/threads/pokeemerald-how-to-fix-messed-up-palettes-for-the-player-sprites-other-than-walking.498164/)
- [PokeCommunity — Edit sprite without .pal file](https://www.pokecommunity.com/threads/pokeemerald-edit-sprite-that-doesnt-have-an-associated-pal-file-without-messing-up-the-palette.503432/)
- [PokeCommunity — Replacing Overworlds and Unique Palettes](https://www.pokecommunity.com/threads/tutorial-replacing-overworlds-and-adding-unique-palettes.425969/)
- [Greenless Version — Romhacking.net](https://www.romhacking.net/hacks/2737/)
- [CosmicEmerald — PokeCommunity](https://www.pokecommunity.com/threads/pok%C3%A9mon-cosmicemerald-version-updated-12-24-2019.398314/)
