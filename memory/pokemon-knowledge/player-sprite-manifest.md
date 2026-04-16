# Player Sprite & Palette Manifest — Brendan/May

**Cycle**: 227 | **Purpose**: Complete file list for cyan recolor in C228

---

## Palette Files (13 .pal files to recolor)

| # | File | Context | Notes |
|---|------|---------|-------|
| 1 | `graphics/object_events/palettes/brendan.pal` | Overworld sprite | Shared by all overworld anims |
| 2 | `graphics/object_events/palettes/brendan_reflect.pal` | Water reflection | Must match #1 |
| 3 | `graphics/object_events/palettes/may.pal` | Overworld sprite | Shared by all overworld anims |
| 4 | `graphics/object_events/palettes/may_reflect.pal` | Water reflection | Must match #3 |
| 5 | `graphics/trainers/palettes/brendan.pal` | Trainer front pic | Link battles, trainer card |
| 6 | `graphics/trainers/palettes/may.pal` | Trainer front pic | Link battles, trainer card |
| 7 | `graphics/trainers/palettes/brendan_back.pal` | Trainer back pic | In-battle sprite |
| 8 | `graphics/trainers/palettes/may_back.pal` | Trainer back pic | In-battle sprite |
| 9 | `graphics/battle_transitions/brendan_bg.pal` | E4 mugshot BG | Blue gradient — needs cyan remap |
| 10 | `graphics/battle_transitions/may_bg.pal` | E4 mugshot BG | Pink gradient — needs cyan remap |
| 11 | `graphics/decorations/brendan.pal` | Secret base doll | |
| 12 | `graphics/decorations/may.pal` | Secret base doll | |
| 13 | `graphics/intro/scene_2/player.pal` | Intro bicycle scene | Shared by both genders |

## Embedded Palettes (credits/intro .gbapal — referenced via INCBIN)

- `graphics/intro/scene_2/brendan_credits.gbapal` — credits Brendan
- `graphics/intro/scene_2/may_credits.gbapal` — credits May
- `graphics/intro/scene_2/brendan.gbapal` — intro Brendan
- `graphics/intro/scene_2/may.gbapal` — intro May

Referenced in `src/intro_credits_graphics.c` via `INCBIN_U16()`.

## Sprite PNG Directories

- `graphics/object_events/pics/people/brendan/` — acro_bike, mach_bike, surfing, etc.
- `graphics/object_events/pics/people/may/` — same set
- `graphics/pokenav/region_map/brendan_icon.png` — region map icon
- `graphics/pokenav/region_map/may_icon.png` — region map icon

PNGs use indexed color — palette baked into PNG. If .pal files are recolored, PNGs sharing those palettes update automatically at build time. PNGs with embedded palettes (no .pal reference) need manual re-indexing.

## Code References

| File | What | Line(s) |
|------|------|---------|
| `src/event_object_movement.c` | `OBJ_EVENT_PAL_TAG_BRENDAN/MAY` palette tables, `LoadPlayerObjectReflectionPalette()` | ~488, ~2073 |
| `src/battle_transition.c` | `sMugshotPal_Brendan/May` E4 mugshot palettes, player mugshot loading | ~890, ~2325 |
| `src/main_menu.c` | New game sprite display — `tBrendanSpriteId/tMaySpriteId` | ~1262, ~1460 |
| `src/intro_credits_graphics.c` | Intro/credits sprite sheets + palette references | ~64, ~579, ~639 |
| `src/decorations.c` | `sBrendanPalette/sMayPalette` INCBIN | ~437 |
| `src/region_map.c` | `sRegionMapPlayerIcon_BrendanPal/MayPal` INCBIN | ~125 |
| `src/trainer_card.c` | FACILITY_CLASS_RS_BRENDAN/MAY mappings | ~310 |
| `include/event_object_movement.h` | `PALSLOT_PLAYER` enum | ~12 |

## Diving Sprite Risk

Per community research (player-sprite-recolor-scope.md), diving sprites may use a different palette slot (15 vs 0). Check `object_event_graphics_info.h` for diving entries — if `paletteTag` differs from overworld, the diving palette needs separate handling.
