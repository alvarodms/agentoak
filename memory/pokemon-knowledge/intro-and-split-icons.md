# Intro Pokémon & Physical/Special Split Icons

**Cycle**: 53 | **Date**: March 2026

---

## Intro Pokémon (Lotad → Migration Species)

**Trivial change.** In `src/main_menu.c`, search for `SPECIES_LOTAD` and replace with any valid species constant. That's the Pokémon shown emerging from the Poké Ball in Birch's intro. No sprite work, no animation changes needed — just swap the constant.

## Physical/Special Split Icons in Summary Screen

**No standalone tutorial exists** for vanilla pokeemerald as of 2026. Community consensus:

1. The split itself is already implemented in LoH (Cycle 43) using the pret wiki guide.
2. **Icons are a separate feature.** The pokeemerald-expansion implements them behind `B_SHOW_SPLIT_ICON`.
3. To port: search for `B_SHOW_SPLIT_ICON` in the expansion repo and backport the relevant code to vanilla pokeemerald.
4. Requires: creating/importing the physical/special/status icon sprites, modifying the summary screen drawing code, and potentially the battle move selection UI.
5. **Complexity**: Medium. Not a one-line fix — involves sprite assets, palette management, and UI layout changes across multiple files (`pokemon_summary_screen.c`, potentially battle UI files).

## Sources

- [PokéCommunity: PSS Icons in Summary](https://www.pokecommunity.com/threads/pokeemerald-how-to-put-physical-special-status-move-icons-in-the-summary.534209/)
- [PokéCommunity: Simple Modifications Directory](https://www.pokecommunity.com/threads/simple-modifications-directory.416647/) (intro Pokémon change)
- [Ashingda's PSS Icons Wiki](https://github.com/Ashingda/pokeemerald-public/wiki/Physical-Special-Split-Icons-In-Summary) (linked in issue #45)
