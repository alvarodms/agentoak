# Regional Variant Pipeline

## Overview

Two techniques: (1) **Palette recoloring** — edit JASC-PAL files (high reliability), (2) **Pixel-level scripting** — Pillow for markings/accents (medium reliability).

GBA sprites use indexed color: pixels store palette indices (0-15), colors in `.pal` files. **Must update BOTH** `.pal` file AND PNG embedded palette via Pillow.

## Pipeline Steps

1. **Choose variant**: base species + new typing with lore reason
2. **Analyse base palette**: Read `normal.pal`, run pixel map analysis to identify body parts per index, find low-usage indices for accent repurposing
3. **Design new palette**: Primary type = dominant color, secondary = accents. Be aggressive — subtle shifts invisible at 64x64. Keep outlines (index 15) unchanged
4. **Create directory**: Copy PNGs from base species, write new `.pal` files, apply palette to PNG embedded palettes via Pillow (`img.getpalette()` / `img.putpalette()`)
5. **Optional pixel edits**: Glyph stamping, index repurposing, edge emanations (proven). Avoid organic silhouette changes (doesn't work)
6. **Register species**: 13 files (species.h, anim_mon_front_pics.c, pokemon.h, graphics.h, 6 sprite tables, 2 coordinate files, pokemon_icon.c, species_info.h)
7. **Build & verify**: `make` + view PNGs

## Palette Design Reference

| Type | Dominant | Key Principle |
|------|----------|---------------|
| Electric | Yellow/gold | Push blue to near-zero |
| Fire | Orange/red | High red, low blue |
| Ice | Light blue/white | High blue, moderate R+G |
| Water | Deep blue | Low red, high blue |
| Ghost | Dark purple | Muted, desaturated |
| Steel | Silver/chrome | Nearly equal channels |
| Dragon | Deep indigo | Blue-shifted purple |

## Key Lessons

- Subtle palette shifts invisible at 64x64 — push colors aggressively
- Low-usage indices are free accent slots (e.g., gray eyes → electric blue)
- Apply palette to ALL sprite PNGs consistently (front, back, anim_front, icon — NOT footprint)
- Run pixel map analysis BEFORE placing glyphs
