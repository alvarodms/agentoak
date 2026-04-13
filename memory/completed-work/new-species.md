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

## Cross-Gen Evolutions — Batch 3 (Cycle 214) — REVERTED

C214 partially committed but SPECIES_FARIGIRAF was missing from species.h. C215 cleaned up stale references: removed from evolution.h, egg_moves.h, pokedex_orders.h, anim_mon_front_pics.c. Tate & Liza teams reverted to SPECIES_GIRAFARIG. Dialogue strings in MossdeepCity_Gym/scripts.inc still reference "FARIGIRAF" by name (text only, compiles fine). Sprites exist in graphics/pokemon/farigiraf/. Farigiraf needs full re-addition in a future cycle.

## Hoennian Bagon (Cycle 215)

| Detail | Value |
|--------|-------|
| Species ID | SPECIES_BAGON_HOENN (425) |
| Stats | 45/65/75/40/45/40 BST 310, Dragon/Rock |
| Abilities | Rock Head / Sturdy |
| Encounter | Meteor Falls B1F_2R slot 6 (5%): Lv28-30 |
| Key moves | Rock Tomb, Rock Slide, Ancient Power, Dragon Claw, Double-Edge |
| Evolution | None (standalone form) |

Pipeline: `add_regional_form.cjs` (25 files). Manual fixes: tmhm_learnsets.h (pipeline placed entry in struct def instead of array), pokemon.c (pipeline placed all 3 mapping macros in first array — split to correct arrays). Sprites: Sprite Designer created custom cave-stone palette (grey-brown body, rust-red accents, warm ivory eyes) + obsidian/gold shiny. Cry reuses Bagon. Researcher NPC: FLAG_BAGON_COLONY_CALLBACK (0x29B) gates first-visit vs. revisit dialogue. Revisit hints at B1F_2R encounter.
