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

## Reusable Scripts

- **PLTE binary recolor**: `/tmp/recolor_sprites.js` pattern — reads PNG binary, finds PLTE chunk offset, replaces 48 bytes (16×RGB), recalculates CRC. Works with `pngjs` npm package for analysis, raw `Buffer` for editing.
