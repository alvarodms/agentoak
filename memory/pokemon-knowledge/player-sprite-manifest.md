# Player Sprite & Palette Manifest — Brendan/May

**Cycle**: 227 (cataloged), **228** (corrected + recolored)

---

## Palette Files (16 .pal files — all recolored C228)

| # | File | Context |
|---|------|---------|
| 1 | `graphics/object_events/palettes/brendan.pal` | Overworld sprite |
| 2 | `graphics/object_events/palettes/brendan_reflection.pal` | Water reflection |
| 3 | `graphics/object_events/palettes/may.pal` | Overworld sprite |
| 4 | `graphics/object_events/palettes/may_reflection.pal` | Water reflection |
| 5 | `graphics/object_events/palettes/ruby_sapphire_brendan.pal` | RS-style overworld |
| 6 | `graphics/object_events/palettes/ruby_sapphire_may.pal` | RS-style overworld |
| 7 | `graphics/object_events/palettes/player_underwater.pal` | Diving sprite (separate tag: OBJ_EVENT_PAL_TAG_PLAYER_UNDERWATER) |
| 8 | `graphics/trainers/palettes/brendan.pal` | Trainer front pic |
| 9 | `graphics/trainers/palettes/may.pal` | Trainer front pic |
| 10 | `graphics/trainers/palettes/brendan_rs.pal` | RS trainer front pic |
| 11 | `graphics/trainers/palettes/may_rs.pal` | RS trainer front pic |
| 12 | `graphics/battle_transitions/brendan_bg.pal` | E4 mugshot BG gradient |
| 13 | `graphics/battle_transitions/may_bg.pal` | E4 mugshot BG gradient |
| 14 | `graphics/decorations/brendan.pal` | Secret base doll |
| 15 | `graphics/decorations/may.pal` | Secret base doll |
| 16 | `graphics/intro/scene_2/player.pal` | Intro bicycle scene (shared, both genders) |

## PNG Files with Embedded Palettes (6 PNGs — all recolored C228)

| # | File | Palette usage |
|---|------|---------------|
| 17 | `graphics/pokenav/region_map/brendan_icon.png` | Embedded palette → .gbapal (used in-game) |
| 18 | `graphics/pokenav/region_map/may_icon.png` | Embedded palette → .gbapal (used in-game) |
| 19 | `graphics/intro/scene_2/brendan.png` | Pixel data → .4bpp only (player.pal is runtime palette) |
| 20 | `graphics/intro/scene_2/may.png` | Pixel data → .4bpp only (player.pal is runtime palette) |
| 21 | `graphics/intro/scene_2/brendan_credits.png` | Embedded palette → .gbapal (used in credits scene) |
| 22 | `graphics/intro/scene_2/may_credits.png` | Embedded palette → .gbapal (used in credits scene) |

## C227 Manifest Corrections Applied

- Reflection files are `_reflection.pal` not `_reflect.pal`
- No .gbapal source files exist — .gbapal is build-generated from .pal or PNG
- `player_underwater.pal` was missing from original manifest
- `ruby_sapphire_brendan.pal` / `ruby_sapphire_may.pal` were missing
- `brendan_rs.pal` / `may_rs.pal` were missing
- No `brendan_back.pal` / `may_back.pal` exist — trainer back sprites share front palette

## Runtime Palette Architecture

- Intro bicycle scene: `player.pal` → `player.gbapal` loaded for BOTH Brendan/May (code: `gIntroPlayer_Pal`)
- Credits scene: separate `brendan_credits.gbapal` / `may_credits.gbapal` generated from PNG embedded palettes
- Pokenav icons: palette extracted from PNG embedded palette via INCBIN
