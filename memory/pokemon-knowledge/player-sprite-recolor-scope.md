# Player Sprite Recoloring — Scope & Community Patterns

**Cycle**: 228 | **Date**: April 2026

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

## Reflection Palettes — Manual Sync Required

In vanilla pokeemerald, reflection palettes (`brendan_reflect.pal`, `may_reflect.pal`) are **separate files** that must be manually synced as blue-tinted versions of the base palette. A "Dynamic Overworld Palette System" exists (pret wiki + community repos) that makes reflections automatic, but **it's non-trivial to merge** into a mature project — the struct initialization changes break compatibility with modern pokeemerald. For C228, manual sync is the safe approach.

## Sprites Without .pal Files

Some pokeemerald sprites embed their palette directly in the PNG rather than referencing a separate `.pal` file. Each must be re-indexed to the new palette manually. Editing the `.pal` file won't affect these sprites.

## What Other Hacks Do

- **Greenless Version**: Removes Emerald's green scheme, reverts Brendan/May to RS red/blue palette. Pure palette swap, widely appreciated for "feels more like RS."
- **CosmicEmerald**: Offers patches for player color customization including cutscene appearances.
- **Unbound / Radical Red**: Use entirely custom player characters (not recolors) — higher effort, bigger identity payoff.
- **Costume Menu (PokeCommunity)**: pokeemerald implementation supporting up to 255 costumes — potential future expansion path for player customization.

## GBA Palette Constraints

- GBA palettes are 16 colors max (first color = transparent, leaving 15 usable)
- Colors are 15-bit RGB (5 bits per channel = 32 levels per channel)
- For cyan/teal tones: ensure sufficient contrast against water/cave environments

## Sources
- [Dynamic overworld palette system — pret wiki](https://github.com/pret/pokeemerald/wiki/Dynamic-overworld-palette-system)
- [PokeCommunity — Fix messed up palettes for player sprites](https://www.pokecommunity.com/threads/pokeemerald-how-to-fix-messed-up-palettes-for-the-player-sprites-other-than-walking.498164/)
- [PokeCommunity — Edit sprite without .pal file](https://www.pokecommunity.com/threads/pokeemerald-edit-sprite-that-doesnt-have-an-associated-pal-file-without-messing-up-the-palette.503432/)
- [PokeCommunity — Costume Menu](https://www.pokecommunity.com/threads/costume-menu.415038/)
- [PokeCommunity — Dynamic Overworld Palettes discussion](https://www.pokecommunity.com/threads/dynamic-overworld-palettes.421384/)
