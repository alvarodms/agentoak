---
name: Species Addition Pipeline
description: Complete step-by-step checklist for adding new Pokémon species to vanilla pokeemerald — every file, constant, table, and asset required
type: reference
---

# Species-Addition Pipeline — Complete Checklist

Verified against codebase in Cycle 59. Use this as a mechanical template for adding any new species.

---

## Quick Reference

- **~27 source files + ~14 asset files** per 2-species evolution family
- **Most steps are mechanical** (copy-paste with substitution from an existing species like Bagon)
- **SPECIES_EGG must always be the last species ID** — all new species go before it
- **Cry table is position-indexed** (not keyed) — order must match species ID order exactly

---

## PHASE 1: Constants (2 files)

### 1. Species IDs
**File**: `include/constants/species.h`
- Add `#define SPECIES_X <next_id>` before `SPECIES_EGG`
- Increment `SPECIES_EGG` by number of new species
- `NUM_SPECIES` auto-updates (= SPECIES_EGG)
- Unown variants auto-adjust (defined relative to NUM_SPECIES)

### 2. Pokédex Constants
**File**: `include/constants/pokedex.h`
- **National dex enum**: Add `NATIONAL_DEX_X` after `NATIONAL_DEX_DEOXYS`, BEFORE `NATIONAL_DEX_OLD_UNOWN_B`
- Update `#define NATIONAL_DEX_COUNT NATIONAL_DEX_<last_new_species>`
- **Hoenn dex enum**: Add `HOENN_DEX_X` after `HOENN_DEX_CELEBI`, before `HOENN_DEX_OLD_UNOWN_B` (in the "excluded from Pokédex" section — non-Hoenn species go here)
- Do NOT change `HOENN_DEX_COUNT` (stays = HOENN_DEX_DEOXYS)

---

## PHASE 2: Species Data (1 file)

### 3. Species Info (base stats, types, abilities, etc.)
**File**: `src/data/pokemon/species_info.h`
- Add `[SPECIES_X] = { ... }` entry to `gSpeciesInfo[]`
- Fields: baseHP/Atk/Def/Speed/SpAtk/SpDef, types[2], catchRate, expYield, evYield_*, itemCommon/Rare, genderRatio, eggCycles, friendship, growthRate, eggGroups[2], abilities[2], safariZoneFleeRate, bodyColor, noFlip
- **Reference**: Copy format from any existing entry (e.g., Bagon at `[SPECIES_BAGON]`)

---

## PHASE 3: Learnsets & Evolution (5 files)

### 4. Level-Up Learnsets
**File**: `src/data/pokemon/level_up_learnsets.h`
- Add `static const u16 s<Name>LevelUpLearnset[] = { LEVEL_UP_MOVE(lvl, MOVE_X), ..., LEVEL_UP_END };`
- **CRITICAL**: All MOVE_* constants must exist in `include/constants/moves.h`

### 5. Learnset Pointers
**File**: `src/data/pokemon/level_up_learnset_pointers.h`
- Add `[SPECIES_X] = s<Name>LevelUpLearnset,` to `gLevelUpLearnsets[]`

### 6. TM/HM Learnsets
**File**: `src/data/pokemon/tmhm_learnsets.h`
- Add `[SPECIES_X] = { .learnset = { .TM_NAME = TRUE, ... }},` to `gTMHMLearnsets[]`
- Format: `.MOVE_NAME_WITHOUT_MOVE_PREFIX = TRUE` (e.g., `.BRICK_BREAK = TRUE`)

### 7. Egg Moves
**File**: `src/data/pokemon/egg_moves.h`
- Add `egg_moves(SPECIES_NAME, MOVE_X, MOVE_Y, ...),` — only for base-form species
- Baby Pokémon (EGG_GROUP_NO_EGGS_DISCOVERED) technically can't breed but entry still matters for chain breeding

### 8. Evolution Table
**File**: `src/data/pokemon/evolution.h`
- Add `[SPECIES_X] = {{EVO_METHOD, param, SPECIES_TARGET}},` to `gEvolutionTable[]`
- Available methods: EVO_LEVEL, EVO_ITEM, EVO_FRIENDSHIP, EVO_FRIENDSHIP_DAY, EVO_FRIENDSHIP_NIGHT, EVO_LEVEL_ATK_GT_DEF, etc.
- Table sized `[NUM_SPECIES][EVOS_PER_MON]` — auto-expands with NUM_SPECIES

---

## PHASE 4: Pokédex Data (4 files)

### 9. Pokédex Text
**File**: `src/data/pokemon/pokedex_text.h`
- Add `const u8 g<Name>PokedexText[] = _("line1\nline2\nline3\nline4.");`
- Constraint: ~40 chars/line, 4 lines max

### 10. Pokédex Entries
**File**: `src/data/pokemon/pokedex_entries.h`
- Add `[NATIONAL_DEX_X] = { .categoryName, .height, .weight, .description, .pokemonScale/Offset, .trainerScale/Offset }` to `gPokedexEntries[]`
- Height in decimeters, weight in hectograms

### 11. Pokédex Sort Orders
**File**: `src/data/pokemon/pokedex_orders.h`
- Insert `NATIONAL_DEX_X` into `gPokedexOrder_Alphabetical[]` at correct alphabetical position
- Also update weight, height, and type sort arrays

### 12. Species Names
**File**: `src/data/text/species_names.h`
- Add `[SPECIES_X] = _("NAME"),` to `gSpeciesNames[]`
- Max 10 characters (POKEMON_NAME_LENGTH)

---

## PHASE 5: Dex Lookup Tables (1 file, 4 tables)

### 13. Species ↔ Dex Mappings
**File**: `src/pokemon.c`

Four tables need entries (all sized `[NUM_SPECIES - 1]`, auto-expand):

| Table | Format | Insert after |
|-------|--------|-------------|
| `sSpeciesToHoennPokedexNum[]` (~line 108) | `SPECIES_TO_HOENN(X),` | CHIMECHO |
| `sSpeciesToNationalPokedexNum[]` (~line 524) | `SPECIES_TO_NATIONAL(X),` | CHIMECHO |
| `sHoennToNationalOrder[]` (~line 940) | `HOENN_TO_NATIONAL(X),` | end of Johto section (after CELEBI) |
| `sMonFrontAnimIdsTable[]` (~line 1405) | `[SPECIES_X - 1] = ANIM_TYPE,` | CHIMECHO |

Also optionally: `sMonAnimationDelayTable[]` (~line 1795) — only if delay needed (default 0).

---

## PHASE 6: Graphics (6 assets/species + 10 table files)

### 14. Create Sprite Assets
**Directory**: `graphics/pokemon/<name>/`

**PREFERRED: Use the `fetch_pokemon_sprites` MCP tool** to download real sprites from the pokeemerald-expansion repo:
```
fetch_pokemon_sprites(name: "riolu")   # Downloads all files below automatically
```
This saves all required files to `graphics/pokemon/<name>/` including auto-generating `front.png` from `anim_front.png`.

| File | Format | Notes |
|------|--------|-------|
| `front.png` | 64x64, 16-color indexed | Still front sprite |
| `anim_front.png` | 64x128, 16-color indexed | 2 frames stacked vertically |
| `back.png` | 64x64, 16-color indexed | Back sprite |
| `icon.png` | 32x64, 16-color indexed | 2-frame party/box icon |
| `normal.pal` | 16 entries | Normal palette |
| `shiny.pal` | 16 entries | Shiny palette |
| `footprint.png` | 16x16, 1bpp monochrome | Pokédex footprint |

**Fallback**: If `fetch_pokemon_sprites` fails, copy from similar species (e.g., `cp -r graphics/pokemon/makuhita graphics/pokemon/riolu`)

### 15. Graphics Declarations
**File**: `include/graphics.h`
- Add 7 `extern` declarations per species: gMonFrontPic_X, gMonPalette_X, gMonBackPic_X, gMonShinyPalette_X, gMonStillFrontPic_X, gMonIcon_X, gMonFootprint_X

### 16. Graphics INCBIN (still sprites + palettes)
**File**: `src/data/graphics/pokemon.h`
- Add 6 INCBIN entries: StillFrontPic (.4bpp.lz), Palette (.gbapal.lz), BackPic (.4bpp.lz), ShinyPalette (.gbapal.lz), Icon (.4bpp), Footprint (.1bpp)

### 17. Animated Front Pic INCBIN
**File**: `src/anim_mon_front_pics.c`
- Add `const u32 gMonFrontPic_X[] = INCBIN_U32("graphics/pokemon/<name>/anim_front.4bpp.lz");`

### 18. Sprite Tables (6 files)
All use designated initializers `[SPECIES_X]` — order doesn't strictly matter but insert before EGG for clarity.

| File | Table | Macro |
|------|-------|-------|
| `src/data/pokemon_graphics/front_pic_table.h` | `gMonFrontPicTable[]` | `SPECIES_SPRITE(X, gMonFrontPic_X)` |
| `src/data/pokemon_graphics/back_pic_table.h` | `gMonBackPicTable[]` | `SPECIES_SPRITE(X, gMonBackPic_X)` |
| `src/data/pokemon_graphics/still_front_pic_table.h` | `gMonStillFrontPicTable[]` | `SPECIES_SPRITE(X, gMonStillFrontPic_X)` |
| `src/data/pokemon_graphics/palette_table.h` | `gMonPaletteTable[]` | `SPECIES_PAL(X, gMonPalette_X)` |
| `src/data/pokemon_graphics/shiny_palette_table.h` | `gMonShinyPaletteTable[]` | `SPECIES_SHINY_PAL(X, gMonShinyPalette_X)` |
| `src/data/pokemon_graphics/footprint_table.h` | `gMonFootprintTable[]` | `[SPECIES_X] = gMonFootprint_X` |

### 19. Sprite Coordinates (2 files)
- `src/data/pokemon_graphics/front_pic_coordinates.h`: `[SPECIES_X] = { .size = MON_COORDS_SIZE(w, h), .y_offset = y }`
- `src/data/pokemon_graphics/back_pic_coordinates.h`: same format

### 20. Icon Table & Palette
**File**: `src/pokemon_icon.c`
- `gMonIconTable[]`: `[SPECIES_X] = gMonIcon_X,`
- `gMonIconPaletteIndices[]`: `[SPECIES_X] = N,` (0-5, index into shared icon palettes; 2 = blue)

### 21. Front Sprite Animations
**File**: `src/data/pokemon_graphics/front_pic_anims.h`
- Add `static const union AnimCmd sAnim_<Name>_1[] = { ANIMCMD_FRAME(0, 15), ANIMCMD_FRAME(1, 15), ANIMCMD_FRAME(0, 15), ANIMCMD_END };`
- Add `SINGLE_ANIMATION(<Name>);` (macro creates sAnims_<Name> array)
- Add `[SPECIES_X] = sAnims_<Name>,` to `gMonFrontAnimsPtrTable[]`

### 22. Enemy Elevation (skip for grounded species)
**File**: `src/data/pokemon_graphics/enemy_mon_elevation.h`
- Only needed for flying/floating Pokémon (default elevation = 0)

---

## PHASE 7: Cries (3 files)

### 23. Cry Audio File
**Directory**: `sound/direct_sound_samples/cries/`
- Add `<name>.wav` file (8-bit PCM, mono)
- **Placeholder**: `cp sound/direct_sound_samples/cries/makuhita.wav sound/direct_sound_samples/cries/riolu.wav`
- Build system uses `wav2agb` tool to convert .wav → .bin automatically

### 24. Cry Sound Data Declaration
**File**: `sound/direct_sound_data.inc`
- Add after last cry entry (Chimecho):
```
	.align 2
Cry_<Name>::
	.incbin "sound/direct_sound_samples/cries/<name>.bin"
```

### 25. Cry Tables
**File**: `sound/cry_tables.inc`
- Add `cry Cry_<Name>` to `gCryTable::` (after Cry_Chimecho, before `.align 2`)
- Add `cry_reverse Cry_<Name>` to `gCryTable_Reverse::` (after cry_reverse Cry_Chimecho)
- **CRITICAL**: Position-indexed by species ID - 1. Order must match species.h order exactly.

---

## GOTCHAS

1. **SPECIES_EGG shift**: Always the last ID. Adding N species shifts EGG by N. Unown variants auto-adjust.
2. **NATIONAL_DEX_COUNT**: Must update to last new species if they extend the National Dex.
3. **Cry table ordering**: Position-indexed, not keyed. Must exactly match species ID order.
4. **Array sizes**: Most use `[NUM_SPECIES]` or `[NUM_SPECIES - 1]` with designated initializers — auto-expand. But cry tables are sequential — must insert at correct position.
5. **Build dependencies**: `wav2agb` must be built (part of `make tools`). Graphics auto-convert via `gbagfx`.
6. **ROM size**: Each species adds ~5-8 KB. Vanilla has significant free space.
7. **Fairy type**: If using TYPE_FAIRY, `graphics/types/fairy.png` must exist (already handled in our hack).
