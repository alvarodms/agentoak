# Starters & Core Mechanics

Modified files related to starter Pokémon selection and core game mechanics.

| File | What Changed | Cycle | Notes |
|------|-------------|-------|-------|
| `src/starter_choose.c` | Starters → Larvitar/Bagon/Dratini | 2, 12 | Cycle 12 corrected Beldum→Dratini |
| `src/party_menu.c` | Reusable TMs (2-line deletion) | 35 | TMs no longer consumed on use |
| `src/data/pokemon/species_info.h` | Wild held items for 164 species | 31, 32 | Magmar→Charcoal, Dratini→Dragon Scale, etc. |
| `src/battle_controllers.c` | Birch rescue encounter species | 52, 53, **58** | Cycle 52: Zigzagoon→Mightyena. Cycle 53: Mightyena→Growlithe. **Cycle 58**: Growlithe→Poochyena (Issue #54 fix — sprite mismatch) |
| `data/maps/Route101/map.json` | Birch rescue overworld sprite | **58** | Changed OBJ_EVENT_GFX_ZIGZAGOON_1→OBJ_EVENT_GFX_POOCHYENA to match battle species |
| `src/main_menu.c` | Intro cinematic Pokémon | **53** | Changed SPECIES_LOTAD→SPECIES_BAGON in both sprite calls (Pokéball release + affine sprite) |
| `src/data/pokemon/level_up_learnsets.h` | Dratini/Dragonair/Dragonite: added DragonBreath at lv1 | **86** | Issue #70 fix — Dratini had 4x damage gap vs other starters (Wrap 15BP vs Bite 60BP). DragonBreath (60BP, Dragon, STAB) gives parity. |
