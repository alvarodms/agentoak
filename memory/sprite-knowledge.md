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

- **Expression matters for concept** (@alvarodms, Corsola #116): "bleached dead coral" should look sad/mournful. Facial expression must match the lore. Addressed via: (1) highlight/pupil swap for downcast eyes (C209), (2) frown mouth via ∩ pixel pattern + vivid iris (C216).
- **Iris color must be aggressive**: Muted colors disappear at game scale. Push saturation hard — (130,60,180) reads as vivid purple; (100,50,150) was still too muted; (136,102,170) reads as gray.
- **Dual-type balance reads from accent color, not body** (@manta89640, Gliscor #149): Grey accents on a teal body = reads Rock. Aqua accents on the same body = reads Water. The accent palette indices (8-12,14-15) drive type perception more than the base body color.

## Techniques Validated

- **Binary PLTE replacement (Node.js)**: Read PNG binary, find PLTE chunk, replace RGB bytes, recalculate CRC with `zlib.crc32()`. Preserves all pixel index data exactly — cleanest recolor approach. No Python/Pillow needed.
- **Icon palette is SEPARATE from sprite palette**: Icons use a shared palette system (gMonIconPaletteTable). The icon PNG's embedded PLTE has different color→index mapping than `normal.pal`. Must analyze icon's own PLTE and remap body-part colors independently.
- **Desaturation for fossil/stone aesthetic**: Push all body colors toward warm gray (nearly equal RGB channels with slight warm bias). Use amber (R:135-185, G:88-135, B:42-70) for accent "heated stone" details on branch tips/extremities.
- **4-bit indexed pixel remapping**: Decompress IDAT via zlib, reconstruct PNG filter rows, modify individual pixel nibbles, re-deflate. Essential for changing which palette index specific pixels use (e.g., making eyes use a different color than the fur highlight they share an index with). Must handle all 5 PNG filter types.
- **Dedicated accent index via unused slots**: Repurpose unused palette indices (e.g., magenta 255,0,255 placeholders) as dedicated accent colors. Then pixel-remap specific features to use that index. Gives per-pixel color control without affecting other pixels sharing the original index.
- **Eye detection heuristic**: White pixels (idx 1) within 2px of dark pixels (idx 3) reliably identifies eye locations in GBA sprites. Works for front and anim_front; back sprites typically have no visible eye.
- **Anim frames have different body positions**: Frame 2 often shifts/rotates the pose. Pixel modifications (tail, accents) must be positioned per-frame — do NOT assume same (x,y) coordinates. Always analyze each frame's pixel map before placing pixels.
- **Morphological dilation for bulkiness**: Expand non-BG mask by 1px outward, assign nearest body color to new pixels, then redraw outline at new boundary. Adds ~3% canvas fill and 2px in each dimension. Conditional 2nd outline ring (only where body ≥3px thick) gives 2px outlines on main contours while preserving thin features. Works on both 4-bit and 8-bit indexed PNGs.
- **4-bit vs 8-bit indexed PNGs**: Sprites from MCP fetch_pokemon_sprites are often 8-bit (bit_depth=8), but sprites modified by previous cycles may be 4-bit (bit_depth=4). Always check IHDR bit depth and handle both in parsing. 4-bit packs 2 pixels per byte (high nibble = left, low nibble = right).

- **Sad expression via highlight/pupil swap**: Move bright highlight pixel from eye-top to eye-bottom, move dark pupil from eye-bottom to eye-top. Creates "downcast/heavy-lidded" look. Works because viewers read dark-on-top as closed/drooping eyelid.
- **Frown mouth via ∩ pixel pattern**: Replace flat horizontal mouth with dark idx 4 pixels arranged as: center line at y (closer to eyes) + corners at y+1 (drooping away from eyes). At 64x64, even a 1-row vertical offset reads as curved. Use dark body-outline color, not amber — amber reads warm/happy.
- **Ghost iris: push past 130 saturation**: (100,50,150) still too muted at game scale. (130,60,180) clearly reads as vivid purple. The green channel is key — keep it low (≤60) to avoid muddy lavender.

## Palette Recipes

- **Growlithe/Arcanine_Hoenn**: Steel-blue/indigo body, sea-spray mane, warm amber accents. Amber eye = "ember that survives" hook.
- **Vulpix/Ninetales_Hoenn**: Icy blue body, frost-white belly, deep blue shadows. Frost crystal emanations at tail tips. Shiny: aurora green body + rose pink belly.
- **Corsola_Hoenn**: Warm gray body, amber fossil accents. Ghost iris: vivid purple (130,60,180). Dark frown mouth. Shiny: cool blue-gray + teal.
- **Bagon_Hoenn**: Stony grey-brown, rust-red mineral accents. Shiny: obsidian + bright gold.
- **Pinsir_Hoenn**: Deep crimson body, amber heat-glow pincers. Shiny: obsidian + blue-white cooling.
- **Stantler_Hoenn**: Mossy green body, spectral teal antlers, bright emerald eyes. Shiny: twilight purple + rose-pink + golden-amber eyes.
- **Deoxys_Hoenn**: Hot pink body, cyan crystalline accents, bioluminescent chest crystal. Inner glow emanation. Shiny: midnight purple + pale gold.
- **Gligar/Gliscor_Hoenn**: Teal-blue body, barnacle brown tips, wing fin-ray streaks. Shiny: deep indigo + gold mineral / amber + blue-patina.
- **Lotad_Hoenn**: Citrine gold lily pad, warm green body, lightning-bolt veins (23px, 5 radial zigzag paths). Shiny: deep amber + dark olive.
- **Shroomish_Hoenn**: Frost-purple cap, icy-blue crystallization spots, frost emanation. Shiny: steel-blue cap + teal-green body.
- **Treecko/Grovyle/Sceptile_Hoenn**: Cool steel-blue body, crystal gleam highlights, violet prismatic accents. Amber eyes for warm contrast. Shiny: warm gold-amber + cool blue eyes.
- **Torchic/Combusken/Blaziken_Hoenn**: Violet-gold celestial theme. Halo/aura emanation. Duplicate palette indices (1-3 and 11-13) allow different crest vs beak coloring. Shiny: inverted "Dawn Bird" gold + indigo.
- **Mudkip/Marshtomp/Swampert_Hoenn**: Shoal Cave slate-indigo, soft lavender headfin accents (bioluminescent, NOT neon), brine-stone belly. Shiny "Midnight Monk": charcoal + amber/gold.

