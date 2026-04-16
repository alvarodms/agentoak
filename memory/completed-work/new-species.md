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

## Hoennian Vulpix & Ninetales (C208 design, C217 partial, C218 completed)

| Detail | Value |
|--------|-------|
| Species IDs | VULPIX_HOENN (426), NINETALES_HOENN (427) |
| Stats | Vulpix: 38/36/40/55/65/65 BST 299 (Ice/Fairy). Ninetales: 73/60/75/90/100/107 BST 505 (Ice/Fairy) |
| Abilities | Vulpix: Inner Focus / Cute Charm. Ninetales: Inner Focus / Flash Fire |
| Evolution | Vulpix_Hoenn → Ninetales_Hoenn via Moon Stone |
| Encounter | Route 113 slot 9 (4%): Vulpix_Hoenn Lv21-22 |
| Pipeline | C217-C219: partial registration + script execution. C222: `complete_species_registration.cjs` filled 7 gaps (egg_moves, pokedex_orders, pokemon_icon, pokemon.c mappings, cry_tables, cry_ids, evolution). Updated learnset per Gameplay Designer spec (13 moves: Powder Snow→Sweet Kiss→Icy Wind→Mist→Aurora Beam→Charm→Ice Beam→Moonlight→Attract→Blizzard). Added 5 egg moves (Hypnosis, Disable, Spite, Faint Attack, Flail). Vulpix_Hoenn→Ninetales_Hoenn Moon Stone evolution restored. Now 19/19. |

---

## Cross-Gen Evolutions — Batch 1 (Cycle 212)

| Species | ID | Type | BST | Pre-evo | Key notes |
|---------|-----|------|-----|---------|-----------|
| Dusknoir | 421 | Ghost | 525 | Dusclops → Dusknoir (Lv45) | On Phoebe + Sidney teams |
| Honchkrow | 422 | Dark/Flying | 505 | Murkrow → Honchkrow (Lv37) | On Sidney's teams |

## Cross-Gen Evolutions — Batch 2 (Cycle 213)

| Species | ID | Type | BST | Pre-evo | E4 usage |
|---------|-----|------|-----|---------|----------|
| Froslass | 423 | Ice/Ghost | 480 | Snorunt → Froslass (Lv42) | Glacia main + all 4 rematches |
| Mamoswine | 424 | Ice/Ground | 530 | Piloswine → Mamoswine (Lv44) | Glacia main + all 4 rematches |

Pipeline: `scripts/add_froslass_mamoswine.cjs` (22 files) + manual patches for pokemon.c, anim_mon_front_pics.c, enemy_mon_elevation.h (Froslass floats), evolution.h. Sprites via `fetch_pokemon_sprites`. Glacia teams updated via `scripts/update_glacia_teams.cjs`.

## Cross-Gen Evolutions — Batch 3: Farigiraf (C214 reverted, C218 completed)

| Detail | Value |
|--------|-------|
| Species ID | SPECIES_FARIGIRAF (428) |
| Type | Normal/Psychic |
| Pre-evo | Girafarig → Farigiraf (via Twin Beam — mapped to level-up) |
| E4 usage | Tate & Liza main + all 4 rematches |
| Pipeline | C214: initial attempt reverted. C215: cleaned stale refs. C218-C219: script execution + fixes, build green. C222: `complete_species_registration.cjs` filled 6 gaps (egg_moves, pokedex_orders, pokemon_icon, pokemon.c mappings, cry_tables, cry_ids). Updated learnset per Gameplay Designer spec (14 moves: Tackle→Stomp→Psybeam→Crunch→Calm Mind→Psychic→Skill Swap→Future Sight). Added 5 egg moves (Amnesia, Wish, Magic Coat, Take Down, Beat Up). Girafarig→Farigiraf evolution restored (EVO_LEVEL 32). Now 19/19. |

## Hoennian Bagon (Cycle 215, repaired C216)

| Detail | Value |
|--------|-------|
| Species ID | SPECIES_BAGON_HOENN (425) |
| Stats | 65/85/120/45/75/60 BST 450, Dragon/Rock |
| Abilities | Rock Head / Sturdy |
| Encounter | Meteor Falls B1F_2R slot 6 (5%): Lv28-30 |
| Key moves | Rock Tomb, Rock Slide, Ancient Power, Dragon Claw, Double-Edge, Iron Defense |
| Evolution | None (standalone form) |

Pipeline: `add_regional_form.cjs` catastrophically failed (7/23 files). C216 repair added 16 missing entries. Sprites by Sprite Designer. Cry reuses Bagon.

---

## Cycle 223: Species Foundation Completion

All 17 species brought to 19/19 registration via `complete_species_registration.cjs`.

**Gap-filler batch results:**
- cry_ids.h: All 17 species added (was universally missing)
- cry_tables.inc: 11 species added with comments (Corsola_Hoenn, Growlithe_Hoenn, Arcanine_Hoenn, Dusknoir, Honchkrow, Froslass, Mamoswine, Bagon_Hoenn, Vulpix_Hoenn, Ninetales_Hoenn, Farigiraf)
- egg_moves.h: 6 species added (Lucario, Weavile, Gabite, Garchomp, Arcanine_Hoenn, Vulpix_Hoenn)
- pokemon_icon.c: 5 species added (Froslass, Mamoswine, Vulpix_Hoenn, Ninetales_Hoenn, Farigiraf)
- pokemon.c mappings: 3 species added (Vulpix_Hoenn, Ninetales_Hoenn, Farigiraf)
- pokedex_orders.h: 3 species added (Vulpix_Hoenn, Ninetales_Hoenn, Farigiraf)
- evolution.h: 1 species added (Corsola_Hoenn standalone comment)

**Farigiraf sprite fix (#134):** Downloaded correct front/back/icon/footprint/palettes from expansion repo. Front sprite now shows Farigiraf (was showing Girafarig's face).

**Froslass gender-gated evolution (#133 partial):**
- Added `EVO_LEVEL_FEMALE` constant (16) to `include/constants/pokemon.h`
- Added handler in `src/pokemon.c` `GetEvolutionTargetSpecies()` — checks `GetGenderFromSpeciesAndPersonality()` == MON_FEMALE
- Changed Snorunt→Froslass evolution from `EVO_LEVEL` to `EVO_LEVEL_FEMALE` in `evolution.h`
- Changed Froslass gender ratio from `PERCENT_FEMALE(50)` to `MON_FEMALE` in `species_info.h`
