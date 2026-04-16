---
name: Species Addition Pipeline
description: 19-file checklist for adding new Pokémon species to pokeemerald — verified C222 with gap-filler tool
type: reference
---

# Species Addition — 19-File Checklist

**Tooling**: `scripts/complete_species_registration.cjs` (C222) fills gaps automatically. `make check_species` validates.

## The 19 Files

| # | File | Key |
|---|------|-----|
| 1 | `include/constants/species.h` | `SPECIES_X` before SPECIES_EGG |
| 2 | `include/constants/pokedex.h` | `NATIONAL_DEX_X` + `HOENN_DEX_X` |
| 3 | `src/data/pokemon/species_info.h` | Stats, types, abilities |
| 4 | `src/data/pokemon/level_up_learnsets.h` | Level-up moveset |
| 5 | `src/data/pokemon/level_up_learnset_pointers.h` | Pointer entry |
| 6 | `src/data/pokemon/tmhm_learnsets.h` | TM/HM compatibility |
| 7 | `src/data/pokemon/egg_moves.h` | Egg moves (base forms) |
| 8 | `src/data/pokemon/evolution.h` | Evolution method |
| 9 | `src/data/pokemon/pokedex_text.h` | Dex flavor text |
| 10 | `src/data/pokemon/pokedex_entries.h` | Height, weight, category |
| 11 | `src/data/pokemon/pokedex_orders.h` | Alphabetical + sort arrays |
| 12 | `src/data/text/species_names.h` | Display name (max 10 chars) |
| 13 | `src/pokemon.c` | 4 tables: sSpeciesToHoenn, sSpeciesToNational, sHoennToNational, sMonFrontAnimIds |
| 14 | `src/pokemon_icon.c` | gMonIconTable + gMonIconPaletteIndices |
| 15 | `src/data/pokemon_graphics/*.h` (6 tables) | front/back/still/palette/shiny/footprint |
| 16 | `src/data/graphics/pokemon.h` | INCBIN entries |
| 17 | `include/graphics.h` | extern declarations |
| 18 | `src/anim_mon_front_pics.c` | Animated front pic INCBIN |
| 19 | `src/data/pokemon_graphics/front_pic_anims.h` | Animation + pointer table |

## Assets (per species)

`graphics/pokemon/<name>/`: front.png, anim_front.png, back.png, icon.png, footprint.png, normal.pal, shiny.pal. Use `fetch_pokemon_sprites` MCP tool.

## Cries

- `sound/direct_sound_data.inc` + `sound/cry_tables.inc` — only for UNIQUE cries
- `src/data/pokemon/cry_ids.h` — ALL custom species need this (maps species to base cry)
- Gen 3+: `gSpeciesIdToCryId[species - 276]` — without entry, defaults to cry 0 (Growlithe)

## Gotchas

1. SPECIES_EGG must always be last ID
2. Cry tables are position-indexed — order must match species.h
3. `NATIONAL_DEX_COUNT` must update to last new species
4. Use `fetch_pokemon_sprites` then verify 7 files exist before proceeding
