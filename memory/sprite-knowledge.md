# Sprite Knowledge

> **Maintained by**: Sprite Designer agent. Updated after each sprite creation/iteration cycle.
> **Budget**: ~60 lines. Trim obsolete techniques when exceeded.

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

## Lessons Learned

- **Subtle palette shifts are invisible at 64x64** — push colors aggressively
- **Always apply palette to PNG embedded palette** — `.pal` files only matter at GBA compile time
- **Low-usage indices are free accent slots** — repurpose low-pixel-count indices for accent colors
- **Pixel map analysis is essential** before placing glyphs — use run-length analysis to find safe canvas areas
- **Apply edits to ALL sprite files consistently** — front.png, back.png, both frames of anim_front.png

## Community Feedback Patterns

_(Updated as feedback accumulates across iterations)_

## Techniques Validated

- **Binary PLTE replacement (Node.js)**: Read PNG binary, find PLTE chunk, replace RGB bytes, recalculate CRC with `zlib.crc32()`. Preserves all pixel index data exactly — cleanest recolor approach. No Python/Pillow needed.
- **Icon palette is SEPARATE from sprite palette**: Icons use a shared palette system (gMonIconPaletteTable). The icon PNG's embedded PLTE has different color→index mapping than `normal.pal`. Must analyze icon's own PLTE and remap body-part colors independently.
- **Desaturation for fossil/stone aesthetic**: Push all body colors toward warm gray (nearly equal RGB channels with slight warm bias). Use amber (R:135-185, G:88-135, B:42-70) for accent "heated stone" details on branch tips/extremities.
- **4-bit indexed pixel remapping**: Decompress IDAT via zlib, reconstruct PNG filter rows, modify individual pixel nibbles, re-deflate. Essential for changing which palette index specific pixels use (e.g., making eyes use a different color than the fur highlight they share an index with). Must handle all 5 PNG filter types.
- **Dedicated accent index via unused slots**: Repurpose unused palette indices (e.g., magenta 255,0,255 placeholders) as dedicated accent colors. Then pixel-remap specific features to use that index. Gives per-pixel color control without affecting other pixels sharing the original index.
- **Eye detection heuristic**: White pixels (idx 1) within 2px of dark pixels (idx 3) reliably identifies eye locations in GBA sprites. Works for front and anim_front; back sprites typically have no visible eye.

## Palette Recipes

- **Storm/Water dog** (Growlithe_Hoenn): Steel-blue fur (98-145,118-165,152-195), wave-foam underbelly (155-218,168-226,190-238), stormcloud stripes (68,78,98). Single warm amber eye (205,160,52) against all-cold body = "ember that survives" hook.
- **Steam legend** (Arcanine_Hoenn): Deep indigo body (38-108,42-118,78-155), sea-spray mane (188-220,200-228,225-240), warm amber fire-stripes (115-232,75-172,22-68) weaving through mane. Amber-gold eyes (242,188,58).

## Reusable Scripts

- **PLTE binary recolor**: `/tmp/recolor_sprites.js` pattern — reads PNG binary, finds PLTE chunk offset, replaces 48 bytes (16×RGB), recalculates CRC. Works with `pngjs` npm package for analysis, raw `Buffer` for editing.
