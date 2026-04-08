# Regional Variant Pipeline

## Overview

Agent Oak can create regional Pokémon variants primarily through **palette recoloring** — editing the 16-color JASC-PAL text files while reusing the same sprite pixel data. This produces meaningful, type-themed visual variants with minimal effort.

## How It Works

GBA sprites use **indexed color**: each pixel stores a palette index (0–15), not a direct color. The actual colors live in `.pal` files. Changing the palette recolors the entire sprite automatically. The shiny system already uses this exact mechanism.

## Pipeline Steps

### 1. Choose Variant
- Select base Pokémon + new type combination with a lore reason
- Design stats/abilities that reflect the new typing

### 2. Analyse Base Palette
- View base sprite (`Read` the PNG — Claude is multimodal)
- Read `normal.pal` to get the 16 RGB entries
- Map indices to body parts (fur, mane, eyes, outlines, etc.)

### 3. Design New Palette
- Primary type → dominant color family (Electric→yellow, Ice→light blue, etc.)
- Secondary type → accent colors
- Maintain contrast: shadows must stay darker than highlights
- Keep structural colors (outlines=black, background grays) unchanged
- Write `normal.pal` and `shiny.pal` in JASC-PAL format

### 4. Create Variant Directory
```bash
mkdir pokeemerald/graphics/pokemon/<name>_hoenn/
cp pokeemerald/graphics/pokemon/<name>/{front,back,anim_front,icon,footprint}.png \
   pokeemerald/graphics/pokemon/<name>_hoenn/
# Place new .pal files in the variant directory
```

### 5. Register Species (13 files to touch)
1. `include/constants/species.h` — `#define SPECIES_<NAME>_HOENN`
2. `src/anim_mon_front_pics.c` — INCBIN for anim_front
3. `src/data/graphics/pokemon.h` — INCBINs for still front, back, palette, shiny palette, icon, footprint
4. `include/graphics.h` — extern declarations for all symbols
5. `src/data/pokemon_graphics/front_pic_table.h` — SPECIES_SPRITE entry
6. `src/data/pokemon_graphics/back_pic_table.h` — SPECIES_SPRITE entry
7. `src/data/pokemon_graphics/still_front_pic_table.h` — SPECIES_SPRITE entry
8. `src/data/pokemon_graphics/palette_table.h` — SPECIES_PAL entry
9. `src/data/pokemon_graphics/shiny_palette_table.h` — SPECIES_SHINY_PAL entry
10. `src/data/pokemon_graphics/front_pic_coordinates.h` — coords (copy base species)
11. `src/data/pokemon_graphics/back_pic_coordinates.h` — coords (copy base species)
12. `src/pokemon_icon.c` — icon table + palette index entries
13. `src/data/pokemon/species_info.h` — base stats, typing, abilities

### 6. Build & Verify
- `make` must succeed
- Verify palette converts: `tools/gbagfx/gbagfx <variant>/normal.pal <variant>/normal.gbapal`

## Palette Design Reference

| Type | Dominant Color | RGB Range |
|------|---------------|-----------|
| Electric | Golden yellow | 200-255, 180-220, 20-80 |
| Ice | Light blue | 150-220, 200-240, 230-255 |
| Water | Deep blue | 40-100, 100-180, 180-255 |
| Grass | Green | 60-150, 180-230, 50-120 |
| Poison | Purple | 140-200, 50-120, 160-220 |
| Ghost | Dark purple | 80-140, 50-100, 120-180 |
| Steel | Silver | 170-210, 170-210, 180-220 |
| Dragon | Deep indigo | 80-130, 60-110, 160-220 |

## Proven: Electric/Fire Arcanine (Cycle PoC)
- Base Arcanine palette → golden/amber fur recolor
- Same pixel data, completely different visual identity
- Shiny variant: electric blue/white theme
- 13 files modified, all tables updated, palette converts successfully
