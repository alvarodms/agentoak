# New Species — Completed Work

## Riolu & Lucario (Cycle 60)

First-ever new species addition to the ROM hack. Complete pipeline: constants, species data, learnsets, evolution, Pokédex, graphics, cries, encounters.

### Files Modified

| File | What Changed |
|------|-------------|
| `include/constants/species.h` | SPECIES_RIOLU (412), SPECIES_LUCARIO (413), SPECIES_EGG shifted to 414 |
| `include/constants/pokedex.h` | NATIONAL_DEX_RIOLU/LUCARIO, HOENN_DEX entries, NATIONAL_DEX_COUNT updated |
| `src/data/pokemon/species_info.h` | Full base stats, types, abilities for both |
| `src/data/pokemon/level_up_learnsets.h` | Riolu (8 moves) + Lucario (13 moves) learnsets |
| `src/data/pokemon/level_up_learnset_pointers.h` | Pointer entries for both |
| `src/data/pokemon/tmhm_learnsets.h` | Riolu (22 TMs) + Lucario (26 TMs) |
| `src/data/pokemon/egg_moves.h` | Riolu egg moves (8 moves incl. Blaze Kick) |
| `src/data/pokemon/evolution.h` | Riolu → Lucario via EVO_FRIENDSHIP |
| `src/data/pokemon/pokedex_text.h` | Pokédex descriptions for both |
| `src/data/pokemon/pokedex_entries.h` | Pokédex entries (height, weight, category) |
| `src/data/pokemon/pokedex_orders.h` | Alphabetical, weight, height sort arrays |
| `src/data/text/species_names.h` | "RIOLU" and "LUCARIO" |
| `src/pokemon.c` | 4 tables: HoennDex, NationalDex, HoennToNational, FrontAnimIds |
| `include/graphics.h` | extern declarations for all graphics symbols |
| `src/data/graphics/pokemon.h` | INCBIN for still front, back, palette, shiny, icon, footprint |
| `src/anim_mon_front_pics.c` | Animated front pic INCBINs |
| `src/data/pokemon_graphics/front_pic_table.h` | Front pic table entries |
| `src/data/pokemon_graphics/back_pic_table.h` | Back pic table entries |
| `src/data/pokemon_graphics/still_front_pic_table.h` | Still front pic table entries |
| `src/data/pokemon_graphics/palette_table.h` | Palette table entries |
| `src/data/pokemon_graphics/shiny_palette_table.h` | Shiny palette table entries |
| `src/data/pokemon_graphics/footprint_table.h` | Footprint table entries |
| `src/data/pokemon_graphics/front_pic_coordinates.h` | Sprite coordinates |
| `src/data/pokemon_graphics/back_pic_coordinates.h` | Sprite coordinates |
| `src/data/pokemon_graphics/front_pic_anims.h` | Anim cmds + SINGLE_ANIMATION + pointer table |
| `src/pokemon_icon.c` | Icon table + palette indices |
| `sound/direct_sound_data.inc` | Cry data labels (Cry_Riolu, Cry_Lucario) |
| `sound/cry_tables.inc` | cry + cry_reverse entries (position-indexed) |
| `src/data/wild_encounters.json` | Route 116 slots 8-9: Riolu 8-10, 8% total |

### Assets Created

| Asset | Source (placeholder) |
|-------|---------------------|
| `graphics/pokemon/riolu/*` (7 files) | Copied from makuhita |
| `graphics/pokemon/lucario/*` (7 files) | Copied from medicham |
| `sound/direct_sound_samples/cries/riolu.wav` | Copied from makuhita |
| `sound/direct_sound_samples/cries/lucario.wav` | Copied from medicham |
| `graphics/types/fairy.png` | Copied from psychic (pre-existing missing asset) |
