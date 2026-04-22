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

- **Storm/Water dog** (Growlithe_Hoenn): Steel-blue fur (98-145,118-165,152-195), wave-foam underbelly (155-218,168-226,190-238), stormcloud stripes (68,78,98). Single warm amber eye (205,160,52) against all-cold body = "ember that survives" hook.
- **Steam legend** (Arcanine_Hoenn): Deep indigo body (38-108,42-118,78-155), sea-spray mane (188-220,200-228,225-240), warm amber fire-stripes (115-232,75-172,22-68) weaving through mane. Amber-gold eyes (242,188,58).
- **Winter fox** (Vulpix_Hoenn): Icy blue body (138-208,165-225,208-248), frost-white belly (168-230,178-238,218-255), deep blue shadows (38-72,44-88,75-132). Icy blue eye (160,215,255). Frost crystal emanations (6px) at tail tips.
- **Ice queen** (Ninetales_Hoenn): Pale icy blue-white body (178-228,195-238,228-255), medium ice shadows (102-178,115-195,162-228), deep blue outlines (22,28,52). Crystal accents (140-202,178-218,232-245). Frost emanations (8px) at nine-tail tips.
- **Bleached ghost coral** (Corsola_Hoenn): Warm gray body (160-240,156-235,148-222), amber fossil accents (135-185,88-135,42-70). Ghost iris: vivid purple (130,60,180). Dark frown mouth (idx 4: 48,42,38) in ∩ shape. Shiny: cool blue-gray body, teal accents, vivid purple iris (120,50,200).
- **Aurora shiny recipe** (Vulpix/Ninetales_Hoenn): Body → aurora green (105-192,170-232,138-198), belly → rose pink (198-245,160-228,188-238), shadows → deep teal/purple (32-82,40-105,55-108). Eye → bright aurora green.
- **Cave stone dragon** (Bagon_Hoenn): Stony grey-brown body (82-175,68-158,52-130), light stone head armor (98-178,90-165,78-145), dull amber underbelly (158-198,128-168,78-108), rust-red mineral accents (115-150,55-72,38-48). Shiny: obsidian body (52-118,48-112,42-100) + bright gold belly (185-228,155-195,62-88), amber accents (85-178,52-98,38-42).
- **Volcanic beetle** (Pinsir_Hoenn): Deep crimson body (55-210,18-70,15-40), amber heat-glow pincers (120-255,40-200,8-80) with bright yellow tips. Warm cream highlights (255,240,200). Shiny: obsidian body (25-95,22-88,20-78) + blue-white cooling pincers (30-210,55-235,85-255).
- **Forest spirit deer** (Stantler_Hoenn): Mossy green body (27-88,64-140,38-95), spectral teal antlers (78,205,196)/(136,216,176), bright emerald eyes (50,235,130)/(90,255,160) — brightest element. Sage belly (106-128,148-168,102-118). Leaf pixel accents (1-2px) at antler edges + ghostly emanation wisps at hoof bases. Shiny: twilight purple body (42-115,30-95,55-128) + rose-pink vines (220-230,130-160,170-185), golden-amber eyes (255,200,60).
- **Cosmic alien** (Deoxys_Hoenn): Hot pink body (255,20,147)/(255,105,180), deep violet (#4B0082) shadows, cyan (#00CED1) crystalline accents (0,165-206,175-209), bioluminescent chest crystal: orchid glow (200,80,255) → deep orchid (150,40,210) → white-pink gleam (255,230,255). Inner glow via idx 2 emanation (255,150,220) — 5px body→glow pixels adjacent to crystal (4-connected). Shiny: midnight purple body (55,10,85)/(90,25,125) + pale gold-amber accents (210-255,160-200,50-80).
- **Sea cave scorpion** (Gligar_Hoenn): Teal-blue body (18-42,55-98,72-128), pale stone-gray underbelly (168,178,185), blue-gray fin membrane (158,178,192), slate mineral wings (38-95,44-105,50-115), barnacle brown tips (82,72,58). Wing barnacle accents: 6 idx b→a dark spot pixels on wing edges (symmetric). Stinger calcification: 2 body→mineral pixels at tail tip. Shiny: deep indigo body (25-48,25-48,58-108) + gold mineral (105-195,82-168,32-85) = "sunken treasure" theme.
- **Ocean predator v3** (Gliscor_Hoenn): Deep ocean blue body (5-85,32-135,75-188). V3: wider Vaporeon-inspired caudal fin (2 flowing lobes spanning ~26px vs old 18px, idx 10/12 fill), wing fin-ray streaks (diagonal idx 9/10 lines across wing membrane), barnacle accents (idx 15: 82,72,58 warm brown, idx 11: 68,82,108 barnacle shadow) at wing joints/shoulders. Both anim frames have fish tails — frame 2 tail fin at bottom-right of descending tail. Shiny: amber body + blue-patina stone accents (38-142,48-152,58-162), barnacle accent (65,58,48).
- **Capacitor lily pad** (Lotad_Hoenn): Citrine gold lily pad (128-255,105-240,15-90), warm green body (42-118,72-162,35-82). Lily pad: idx 3=(225,200,40) main, idx 4=(178,155,25) shadow, idx 8=(255,240,90) veins/highlight. Body: idx 7=(62,115,48) main. Lightning-bolt veins: 23 idx→8 pixels in 5 radial zigzag paths from pad centroid (NW/NE/W/E/SW). Back sprite gets longer veins (22px) due to larger pad. Shiny: deep amber pad (100-242,62-182,12-58) + dark olive body (32-92,55-138,28-72) = "storm cloud amber."
- **Frost spore mushroom** (Shroomish_Hoenn): Frost-purple cap (72-210,52-218,100-245), cold lavender body (55-175,58-175,88-205). Cap: idx 3=(150,130,185) main, idx 5=(120,100,160) shadow, idx 9=(210,218,240) highlight. Frost spots: idx 1=(190,210,245) — repurposed vanilla brown spots as icy-blue crystallization marks. +6 extra idx 3→1 pixel conversions on cap for denser crystallization. +2 frost emanation px above cap silhouette. Back sprite: +5 frost spots on large cap surface. Spores (anim): idx 11=(115,55,160) toxic purple + idx 12=(175,190,235) frost particles. Shiny: steel-blue cap (45-195,60-215,82-230) + teal-green body (38-145,55-180,48-160) + green toxic spores = "frozen wasteland."

