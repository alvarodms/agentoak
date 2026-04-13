# New Species — Completed Work

## Riolu, Lucario, Weavile, Gible, Gabite, Garchomp (Cycles 60-70)

Six new species added across ~29 source files each. Collapsed — see git history for per-file details.

| Species | ID | Type | BST | Encounter | Evolution |
|---------|-----|------|-----|-----------|-----------|
| Riolu | 412 | Fighting | 285 | Route 116 slots 8-9, Lv8-10, 8% | → Lucario (Friendship) |
| Lucario | 413 | Fight/Steel | 525 | Via evolution | — |
| Weavile | 414 | Dark/Ice | 510 | Shoal Cave Ice Room 8-9, Lv32-36, 8% | Sneasel → Weavile (Lv40) |
| Gible | 415 | Dragon/Ground | 300 | Meteor Falls B1F_1R 10-11, Lv25-30, 2% | → Gabite (Lv24) |
| Gabite | 416 | Dragon/Ground | 410 | Via evolution | → Garchomp (Lv48) |
| Garchomp | 417 | Dragon/Ground | 600 | Victory Road B2F 10-11, Lv40-44, 2% | — |

All sprites fetched via `fetch_pokemon_sprites`. Cries re-added C73.

---

## Hoennian Corsola (Cycle 195)

| Detail | Value |
|--------|-------|
| Species ID | SPECIES_CORSOLA_HOENN (418) |
| Stats | 65/55/75/65/95/45 BST 400, Ghost/Rock |
| Ability | Weak Armor |
| Encounter | Scripted: PacifidlogTown Quest 1 reward (setwildbattle Lv45) |
| Key moves | Shadow Ball, Rock Slide, Curse, Destiny Bond, Ancient Power |

## Hoennian Growlithe & Arcanine (Cycle 198)

| Detail | Value |
|--------|-------|
| Species IDs | GROWLITHE_HOENN (419), ARCANINE_HOENN (420) |
| Stats | Growlithe: 55/45/45/80/65/60 BST 350 (Water). Arcanine: 90/95/80/115/85/90 BST 555 (Water/Fire) |
| Abilities | Growlithe: Swift Swim. Arcanine: Intimidate / Flash Fire |
| Evolution | Growlithe_Hoenn → Arcanine_Hoenn via Water Stone |
| Encounter | Scripted: Weather Institute 2F Quest 2 reward (Lv40, held NeverMeltIce) |

## Hoennian Vulpix & Ninetales (Cycle 208)

| Detail | Value |
|--------|-------|
| Species IDs | VULPIX_HOENN (421), NINETALES_HOENN (422) |
| Stats | Vulpix: 38/36/40/55/65/65 BST 299 (Ice/Fairy). Ninetales: 73/60/75/90/100/107 BST 505 (Ice/Fairy) |
| Abilities | Vulpix: Inner Focus / Cute Charm. Ninetales: Inner Focus / Flash Fire |
| Evolution | Vulpix_Hoenn → Ninetales_Hoenn via Moon Stone |
| Encounter | Route 113 slot 9 (4%): Vulpix_Hoenn Lv21-22 |

---

## Cross-Gen Evolutions — Batch 1 (Cycle 212)

| Species | ID | Type | BST | Pre-evo | Key notes |
|---------|-----|------|-----|---------|-----------|
| Dusknoir | 421→** | Ghost | 525 | Dusclops → Dusknoir (Lv45) | On Phoebe's teams |
| Honchkrow | 422→** | Dark/Flying | 505 | Murkrow → Honchkrow (Lv37) | On Sidney's teams |

**Note**: IDs shifted when Vulpix_Hoenn/Ninetales_Hoenn were added C208. Actual C212 IDs were after those.

## Cross-Gen Evolutions — Batch 2 (Cycle 213)

| Species | ID | Type | BST | Pre-evo | E4 usage |
|---------|-----|------|-----|---------|----------|
| Froslass | 423 | Ice/Ghost | 480 | Snorunt → Froslass (Lv42) | Glacia main + all 4 rematches |
| Mamoswine | 424 | Ice/Ground | 530 | Piloswine → Mamoswine (Lv44) | Glacia main + all 4 rematches |

Pipeline: `scripts/add_froslass_mamoswine.cjs` (22 files) + manual patches for pokemon.c (3 arrays), anim_mon_front_pics.c, enemy_mon_elevation.h (Froslass floats), evolution.h (Snorunt+Piloswine gain new evo paths). Sprites via `fetch_pokemon_sprites`. Cries: Froslass reuses Glalie, Mamoswine reuses Piloswine. Glacia teams updated via `scripts/update_glacia_teams.cjs`. Glacia intro dialogue rewritten.

## Cross-Gen Evolutions — Batch 3 (Cycle 214)

| Species | ID | Type | BST | Pre-evo | Trainer usage |
|---------|-----|------|-----|---------|---------------|
| Farigiraf | 425 | Normal/Psychic | 520 | Girafarig → Farigiraf (Lv38) | Tate & Liza main + all 4 rematches |

Pipeline: `scripts/add_farigiraf.cjs` (24 files) + manual patches for evolution.h (Girafarig gains EVO_LEVEL 38), anim_mon_front_pics.c (gMonFrontPic_Farigiraf). Also fixed missing C213 entries: Froslass+Mamoswine added to front_pic_anims.h (AnimCmd, SINGLE_ANIMATION, gMonFrontAnimsPtrTable) and pokedex_orders.h (all 3 arrays). Sprites: back/icon/footprint/palettes via `fetch_pokemon_sprites`; front sprites copied from Girafarig placeholder. Cry reuses Girafarig. Tate & Liza teams updated (all 5 parties). Tate & Liza dialogue rewritten for Farigiraf/duality theme. Petalburg difficulty downgrade NPC added.
