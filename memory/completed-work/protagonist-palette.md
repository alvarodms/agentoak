# Protagonist Palette Recolor — Sea-Glass Teal

**Cycle 228** | Issue #136

## Summary
Recolored all Brendan/May clothing from vanilla blue/grey to sea-glass teal, and headband/bandanna from green to teal-green, across 22 files. Creative direction: "muted teal — the region left its mark."

## Color Scheme
- **Clothing**: Blue-dominant → Teal (G and B close, both > R)
- **Headband/Bandanna**: Green → Teal-green (82,197,156 / 49,156,115)
- **Reflections**: Blue-tinted versions of base teal
- **Battle transition BGs**: Both Brendan (blue) and May (pink) → unified teal gradient
- **Unchanged**: Skin, hair, red accents, RS/decoration yellow headbands, black, white

## Files Modified (22 total)

### .pal files (16)
| File | Changes |
|------|---------|
| `graphics/object_events/palettes/brendan.pal` | Clothing (4 slots) + headband (2 slots) |
| `graphics/object_events/palettes/brendan_reflection.pal` | Clothing (4) + headband (2), blue-tinted |
| `graphics/object_events/palettes/may.pal` | Clothing (2 slots) + bandanna (2 slots) |
| `graphics/object_events/palettes/may_reflection.pal` | Clothing (2) + bandanna (2), blue-tinted |
| `graphics/object_events/palettes/ruby_sapphire_brendan.pal` | Clothing (4). Yellow headband kept. |
| `graphics/object_events/palettes/ruby_sapphire_may.pal` | Clothing (2). Yellow headband kept. |
| `graphics/object_events/palettes/player_underwater.pal` | Clothing (4). Yellow headband kept. |
| `graphics/trainers/palettes/brendan.pal` | Clothing (4) + headband (2) |
| `graphics/trainers/palettes/may.pal` | Clothing (2) + headband (2) |
| `graphics/trainers/palettes/brendan_rs.pal` | Clothing (4). Yellow headband kept. |
| `graphics/trainers/palettes/may_rs.pal` | Clothing (2). Yellow headband kept. |
| `graphics/battle_transitions/brendan_bg.pal` | 5 gradient shades → teal gradient |
| `graphics/battle_transitions/may_bg.pal` | 5 gradient shades → teal gradient (was pink) |
| `graphics/decorations/brendan.pal` | Clothing (4). Yellow headband kept. |
| `graphics/decorations/may.pal` | Clothing (2). Yellow headband kept. |
| `graphics/intro/scene_2/player.pal` | Clothing slot (idx 7) only |

### PNG files (6 — embedded palette recolor)
| File | Changes |
|------|---------|
| `graphics/pokenav/region_map/brendan_icon.png` | Clothing (4) + headband (2) — palette used in-game |
| `graphics/pokenav/region_map/may_icon.png` | Clothing (2) + bandanna (2) — palette used in-game |
| `graphics/intro/scene_2/brendan.png` | Headband (2) — cosmetic (player.pal is runtime) |
| `graphics/intro/scene_2/brendan_credits.png` | Headband (2) — palette generates .gbapal for credits |
| `graphics/intro/scene_2/may.png` | Clothing (1) + bandanna (4) — cosmetic |
| `graphics/intro/scene_2/may_credits.png` | Clothing (1) + bandanna (4) — palette generates .gbapal for credits |
