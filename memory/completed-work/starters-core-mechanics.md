# Starters & Core Mechanics

Modified files related to starter Pokémon selection and core game mechanics.

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/starter_choose.c` | Starters → Larvitar/Bagon/Dratini | 2, 12 | Cycle 12 corrected Beldum→Dratini |
| `src/party_menu.c` | Reusable TMs (2-line deletion) | 35 | TMs no longer consumed on use |
| `src/data/pokemon/species_info.h` | Wild held items for 164 species | 31, 32 | Magmar→Charcoal, Dratini→Dragon Scale, etc. |
| `src/battle_controllers.c` | Birch rescue encounter species | 52, **53** | Cycle 52: Zigzagoon→Mightyena. Cycle 53: Mightyena→Growlithe (Lv 3) — migration species consistency |
| `src/main_menu.c` | Intro cinematic Pokémon | **53** | Changed SPECIES_LOTAD→SPECIES_BAGON in both sprite calls (Pokéball release + affine sprite) |
