# Regional Variant Pipeline

## Overview

Agent Oak can create regional Pokémon variants through two complementary techniques:
1. **Palette recoloring** — editing JASC-PAL text files to recolor sprites (high reliability)
2. **Pixel-level scripting** — using Pillow to draw markings, sparks, and accents (medium reliability)

Both are proven. The Arcanine Hoenn (Electric/Fire) PoC demonstrates the full pipeline.

## How It Works

GBA sprites use **indexed color**: each pixel stores a palette index (0–15), not a direct color. The actual colors live in `.pal` files. The shiny system already uses this mechanism.

**Critical**: The `.pal` file is what the GBA uses in-game. But the **PNG files also have an embedded palette** — this is what GitHub, file browsers, and reviewers see. You must update BOTH: write the `.pal` file AND apply the palette to the embedded PNG palette using Pillow.

## Pipeline Steps

### 1. Choose Variant
- Select base Pokémon + new type combination with a lore reason
- Design stats/abilities that reflect the new typing

### 2. Analyse Base Palette & Pixels
- View base sprite (`Read` the PNG — Claude is multimodal)
- Read `normal.pal` to get the 16 RGB entries
- **Map indices to body parts** — run the pixel map analysis script (see below) to identify which indices are fur, mane, eyes, outlines, stripes, etc.
- **Identify low-usage indices** (under ~25 pixels) — these can be repurposed for accent colors (e.g., gray eyes → electric blue eyes)

### 3. Design New Palette
- Primary type → dominant color family (see reference table)
- Secondary type → accent colors
- **Be aggressive with color shifts** — subtle changes look identical at 64x64. Push the blue channel to near-zero for warm types; push red to near-zero for cool types.
- Maintain contrast: shadows must stay darker than highlights in the same hue family
- Keep structural colors (outlines=black index 15, background index 0) unchanged
- Consider repurposing a low-usage index for a contrasting accent color
- Write `normal.pal` and `shiny.pal` in JASC-PAL format

### 4. Create Variant Directory & Apply Palette to PNGs
```bash
mkdir pokeemerald/graphics/pokemon/<name>_hoenn/
cp pokeemerald/graphics/pokemon/<name>/{front,back,anim_front,icon,footprint}.png \
   pokeemerald/graphics/pokemon/<name>_hoenn/
# Write new .pal files, then apply palette to PNG embedded palettes:
```

**Apply palette to PNGs** (mandatory — otherwise sprites display with original colors in file browsers and GitHub):
```python
from PIL import Image

def apply_pal_to_png(png_path, pal_colors):
    """pal_colors: list of 16 (R,G,B) tuples from the .pal file."""
    img = Image.open(png_path)
    old = img.getpalette()
    new = list(old)
    for i, (r, g, b) in enumerate(pal_colors):
        new[i*3], new[i*3+1], new[i*3+2] = r, g, b
    img.putpalette(new)
    img.save(png_path)

# Apply to: front.png, back.png, anim_front.png, icon.png
# Do NOT apply to footprint.png (1-bit, no palette)
```

### 5. (Optional) Pixel-Level Edits via Pillow

For variants that need more than a recolor — lightning markings, ice crystals, flame patterns, etc.

**Pixel map analysis** — run this first to understand the sprite structure:
```python
from PIL import Image
img = Image.open("front.png")
px = img.load()
w, h = img.size
# Count pixels per index
counts = {}
for y in range(h):
    for x in range(w):
        counts.setdefault(px[x,y], []).append((x,y))
for idx in sorted(counts):
    print(f"[{idx:2d}] {len(counts[idx]):4d} pixels")
# Find body canvas areas (long horizontal runs of body-colored pixels)
body = {8, 9, 10, 12, 13}  # adjust per species
for y in range(h):
    run_start, run_len = None, 0
    for x in range(w):
        if px[x,y] in body:
            if run_start is None: run_start = x
            run_len += 1
        else:
            if run_len >= 5: print(f"Row {y}: run at x={run_start}, len={run_len}")
            run_start, run_len = None, 0
```

**Proven pixel edit techniques:**

| Technique | How | Quality |
|-----------|-----|---------|
| Glyph stamping | Design small shapes (lightning bolts, ice crystals) as coordinate lists; place on body canvas areas | Good — clearly visible, intentional |
| Index repurposing | Change a low-usage palette index to an accent color; existing pixels change automatically (e.g., gray→blue gives blue eyes) | Excellent — free thematic detail |
| Edge emanations | Find outline pixels with background above/beside them; place accent-colored pixels beyond the silhouette | Decent — adds dynamism |
| Palette index remapping | Change which index specific pixels use (swap stripe color for body color) | Good for pattern changes |

**What doesn't work well:**
- Organic silhouette changes (mane reshaping, adding appendages) — looks wrong without artistic judgment
- Freeform pixel painting — Claude can't preview the aesthetic result during editing
- Very subtle changes — invisible at 64x64 scale; be bold

### 6. Register Species (13 files)
1. `include/constants/species.h` — `#define SPECIES_<NAME>_HOENN`
2. `src/anim_mon_front_pics.c` — INCBIN for anim_front
3. `src/data/graphics/pokemon.h` — INCBINs for still front, back, palette, shiny palette, icon, footprint
4. `include/graphics.h` — extern declarations for all symbols
5. `src/data/pokemon_graphics/front_pic_table.h` — SPECIES_SPRITE entry
6. `src/data/pokemon_graphics/back_pic_table.h` — SPECIES_SPRITE entry
7. `src/data/pokemon_graphics/still_front_pic_table.h` — SPECIES_SPRITE entry
8. `src/data/pokemon_graphics/palette_table.h` — SPECIES_PAL entry
9. `src/data/pokemon_graphics/shiny_palette_table.h` — SPECIES_SHINY_PAL entry
10. `src/data/pokemon_graphics/front_pic_coordinates.h` — coords (copy from base species)
11. `src/data/pokemon_graphics/back_pic_coordinates.h` — coords (copy from base species)
12. `src/pokemon_icon.c` — icon table + palette index entries (TWO tables)
13. `src/data/pokemon/species_info.h` — base stats, typing, abilities

All entries go after the last UNOWN_QMARK entry, before the closing `};`.

### 7. Build & Verify
- `make` must succeed (palette conversion: `tools/gbagfx/gbagfx <variant>/normal.pal <variant>/normal.gbapal`)
- View all sprites (`Read` the PNGs) to confirm colors render correctly

## Palette Design Reference

| Type | Dominant Color | RGB Range | Key Principle |
|------|---------------|-----------|---------------|
| Electric | Saturated yellow/gold | R:190-255, G:155-236, B:0-10 | Push blue to near-zero |
| Fire | Orange/red | R:200-255, G:60-140, B:0-50 | High red, low blue |
| Ice | Light blue/white | R:150-220, G:200-240, B:230-255 | High blue, moderate R+G |
| Water | Deep blue | R:40-100, G:100-180, B:180-255 | Low red, high blue |
| Grass | Green | R:60-150, G:180-230, B:50-120 | Green dominant |
| Poison | Purple | R:140-200, G:50-120, B:160-220 | High R+B, low G |
| Ghost | Dark purple | R:80-140, G:50-100, B:120-180 | Muted, desaturated |
| Steel | Silver/chrome | R:170-210, G:170-210, B:180-220 | Nearly equal channels |
| Dragon | Deep indigo | R:80-130, G:60-110, B:160-220 | Blue-shifted purple |
| Dark | Near-black/maroon | R:40-90, G:20-50, B:20-50 | Very low values |

## Lessons Learned (Arcanine PoC)

1. **Subtle palette shifts are invisible at 64x64** — push colors aggressively. The first attempt was too close to the original orange; only saturated gold (B channel ≈ 0) looked distinct.
2. **Always apply palette to PNG embedded palette** — `.pal` files only matter at GBA compile time. File browsers and GitHub render the PNG's own palette.
3. **Low-usage indices are free accent slots** — Arcanine's index 3 (gray, 23 pixels for eyes/toes) was repurposed to electric blue, giving blue eyes and crackling feet at zero cost.
4. **Pixel map analysis is essential** before placing glyphs — use run-length analysis to find safe body canvas areas where bolts/markings won't overlap outlines or other detail.
5. **Apply edits to ALL sprite files consistently** — front.png, back.png, both frames of anim_front.png (64x128, frame 2 starts at y=64). Icon (32x64) is usually too small for pixel edits.
6. **Pillow is the tool** — `pip install Pillow`, then `Image.open()` / `.load()` / `.getpalette()` / `.putpalette()` / `.save()`.
