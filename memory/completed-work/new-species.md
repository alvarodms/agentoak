# New Species — Completed Work

## Riolu & Lucario (Cycle 60)

First-ever new species addition. Complete pipeline: constants, species data, learnsets, evolution, Pokédex, graphics, cries, encounters.

### Files Modified

Same ~29 source files per species family. Key pattern: species.h, pokedex.h, species_info.h, learnsets, evolution, egg_moves, pokedex_text/entries/orders, species_names, pokemon.c (4 tables), graphics.h, graphics/pokemon.h, anim_mon_front_pics.c, 6 graphics tables, front_pic_anims.h, pokemon_icon.c, direct_sound_data.inc, cry_tables.inc, wild_encounters.json.

| Detail | Value |
|--------|-------|
| Species IDs | SPECIES_RIOLU (412), SPECIES_LUCARIO (413) |
| Encounter | Route 116 slots 8-9: Riolu lv8-10, 8% |
| Evolution | Riolu → Lucario via EVO_FRIENDSHIP |
| Assets | Fetched via fetch_pokemon_sprites (Cycle 65 re-land after revert). Cry wav re-added Cycle 73. |

## Weavile (Cycle 61)

Single species (Sneasel already in Gen 3). Same 28 source files + Sneasel evolution entry.

| Detail | Value |
|--------|-------|
| Species ID | SPECIES_WEAVILE (414) |
| Stats | 70/120/65/45/85/125 BST 510, Dark/Ice |
| Encounter | Shoal Cave Ice Room slots 8-9: Weavile lv32-36, 8% |
| Evolution | Sneasel → Weavile at lv40 |
| Assets | Real sprites fetched via fetch_pokemon_sprites (Cycle 73, Issue #62 fix) |

## Gible & Gabite (Cycle 68) — BUILD CLEAN

Two-species scope (Garchomp deferred to Cycle 69). Cycle 67 attempted all 3 but was **REVERTED**.

| Detail | Value |
|--------|-------|
| Species IDs | SPECIES_GIBLE (415), SPECIES_GABITE (416), EGG→417 |
| Stats | Gible: 58/70/45/40/45/42 BST 300; Gabite: 68/90/65/50/55/82 BST 410 |
| Encounters | Meteor Falls B1F_1R: Gible lv25-30 (slots 10-11, 2% total) |
| Evolution | Gible→Gabite (lv24). Gabite→Garchomp deferred to Cycle 69. |
| Assets | Sprites fetched via fetch_pokemon_sprites; cry wav re-added Cycle 73 (placeholder from abra) |
| Egg moves | Outrage, Body Slam, Scary Face, Twister, Double-Edge |

**Note**: Also re-fetched sprites for Riolu/Lucario/Weavile and fairy.png (missing from git).

## Garchomp (Cycle 70) — BUILD CLEAN

Final evolution of Gible line. Completes the pseudo-legendary Dragon/Ground family.

| Detail | Value |
|--------|-------|
| Species ID | SPECIES_GARCHOMP (417), EGG→418 |
| Stats | 108/130/95/80/85/102 BST 600, Dragon/Ground |
| Encounter | Victory Road B2F: Garchomp lv40-44 (slots 10-11, 2% total) |
| Evolution | Gabite→Garchomp at lv48 |
| Learnset highlights | Dragon Claw (33), Crunch (48), Earthquake (55) |
| TMs added vs Gabite | Hyper Beam, Brick Break |
| Assets | Sprites fetched via fetch_pokemon_sprites; cry wav re-added Cycle 73 (placeholder from abra) |

Same ~29 source files as prior species additions.
