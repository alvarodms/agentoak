# New Species — Completed Work

## Riolu, Lucario, Weavile, Gible, Gabite, Garchomp (Cycles 60-70)

Six species across ~29 source files each. Collapsed — see git history for details.

| Species | ID | Type | BST | Encounter | Evolution |
|---------|-----|------|-----|-----------|-----------|
| Riolu | 412 | Fighting | 285 | Route 116 8%, Lv8-10 | → Lucario (Friendship) |
| Lucario | 413 | Fight/Steel | 525 | Evolution | — |
| Weavile | 414 | Dark/Ice | 510 | Shoal Cave Ice 8%, Lv32-36 | Sneasel → (Lv40) |
| Gible | 415 | Dragon/Ground | 300 | Meteor Falls B1F_1R 2%, Lv25-30 | → Gabite (Lv24) |
| Gabite | 416 | Dragon/Ground | 410 | Evolution | → Garchomp (Lv48) |
| Garchomp | 417 | Dragon/Ground | 600 | Victory Road B2F 2%, Lv40-44 | — |

---

## Regional Forms (C195-C219)

| Species | ID | Type | BST | Source |
|---------|-----|------|-----|--------|
| Corsola_Hoenn | 418 | Ghost/Rock | 400 | Scripted: Pacifidlog Quest 1 reward Lv45 |
| Growlithe_Hoenn | 419 | Water | 350 | Scripted: Weather Institute Quest 2 Lv40 |
| Arcanine_Hoenn | 420 | Water/Fire | 555 | Growlithe_Hoenn + Water Stone |
| Vulpix_Hoenn | 426 | Ice/Fairy | 299 | Route 113 4% Lv21-22 |
| Ninetales_Hoenn | 427 | Ice/Fairy | 505 | Vulpix_Hoenn + Moon Stone |
| Bagon_Hoenn | 425 | Dragon/Rock | 450 | Meteor Falls B1F_2R 5% Lv28-30, standalone |

## Cross-Gen Evolutions (C212-C218)

| Species | ID | Type | BST | Pre-evo | E4 Usage |
|---------|-----|------|-----|---------|----------|
| Dusknoir | 421 | Ghost | 525 | Dusclops (Lv45) | Phoebe + Sidney |
| Honchkrow | 422 | Dark/Flying | 505 | Murkrow (Lv37) | Sidney |
| Froslass | 423 | Ice/Ghost | 480 | Snorunt (Lv42, female) | Glacia all tiers |
| Mamoswine | 424 | Ice/Ground | 530 | Piloswine (Lv44) | Glacia all tiers |
| Farigiraf | 428 | Normal/Psychic | — | Girafarig (Lv32) | Tate & Liza all tiers |

## C240: Deoxys_Hoenn (Poison/Fairy) — First Fully Custom Species

| Species | ID | Type | BST | Encounter |
|---------|-----|------|-----|-----------|
| Deoxys_Hoenn | 431 | Poison/Fairy | 600 | Quest III reward, Lv 70 (quest C242) |

Stats: 60/80/70/150/80/160. Abilities: Toxic Touch/Pressure (C241: ability1 changed from Pressure).
Growth: Slow. Catch Rate: 3. Genderless. Undiscovered egg group.
Learnset: 12 moves (Cosmic Power L1 → Moonblast L61). At Lv70 catch: Shadow Ball/Recover/Sludge Bomb/Moonblast.
TMs: 22 (Calm Mind, Toxic, HP, Ice Beam, Hyper Beam, Protect, TBolt, Thunder, Return, Psychic, Shadow Ball, Double Team, Reflect, Sludge Bomb, Facade, Rest, Skill Swap, Snatch + Cut/Strength/Flash/Rock Smash).
Cry: Mapped to vanilla Deoxys. Elevation: 8 (floats). Dex category: "Cosmic".
Sprites: Custom hot pink/cyan Poison/Fairy recolor by Sprite Designer v1.

Files modified: 23 source files (standard species pipeline + enemy_mon_elevation.h).

---

## C231: Stantler_Hoenn (Ghost/Grass) — Badge 5-6 Regional Form

| Species | ID | Type | BST | Encounter |
|---------|-----|------|-----|-----------|
| Stantler_Hoenn | 430 | Ghost/Grass | 465 | Route 119 4% Lv26-28 |

Stats: 73/65/72/95/80/80. Abilities: Intimidate / Natural Cure. Growth: Slow.
Learnset: Tackle, Leer, Astonish, Leech Seed, Mega Drain, Confuse Ray, Hypnosis, Shadow Ball, Giga Drain, Will-O-Wisp, Calm Mind, Dream Eater, Destiny Bond.
TMs: 22 (includes Calm Mind, Shadow Ball, Giga Drain, SolarBeam, Psychic).
Egg moves: Disable, Spite, Curse, Psych Up.
Cry: Mapped to base Stantler via cry_ids.h.
Sprites: Custom forest spirit recolor by Sprite Designer (mossy green body, spectral teal antlers).

Files modified: Same 19+7+1 pattern as Pinsir_Hoenn (all tables, graphics, encounter).

---

## C230: Pinsir_Hoenn (Bug/Fire) — First Mid-Game Regional Form

| Species | ID | Type | BST | Encounter |
|---------|-----|------|-----|-----------|
| Pinsir_Hoenn | 429 | Bug/Fire | 500 | Route 112 5% Lv21-22 |

Stats: 65/120/90/70/70/85. Abilities: Hyper Cutter / Flame Body. Growth: Slow.
Learnset: Focus Energy, Vice Grip, Ember, Fury Cutter, Harden, Flame Wheel, X-Scissor, Guillotine, Fire Punch, Swords Dance.
TMs: 22 (includes Flamethrower, Fire Blast, Overheat, Earthquake, Sunny Day).
Egg moves: Blaze Kick, False Swipe, Flail, Rock Slide.
Cry: Mapped to base Pinsir via cry_ids.h.
Sprites: Custom volcanic beetle recolor by Sprite Designer (crimson body, amber pincers).

Files modified (19 source + 7 sprite + 1 encounter):
- include/constants/species.h, pokedex.h
- src/data/pokemon/species_info.h, pokedex_text.h, pokedex_entries.h, pokedex_orders.h
- src/data/pokemon/level_up_learnsets.h, level_up_learnset_pointers.h, tmhm_learnsets.h
- src/data/pokemon/egg_moves.h, evolution.h, cry_ids.h
- include/graphics.h, src/data/graphics/pokemon.h, src/anim_mon_front_pics.c
- src/data/pokemon_graphics/ (8 tables: front/back pic, palette, shiny, still, footprint, coords)
- src/data/pokemon_graphics/front_pic_anims.h
- src/pokemon_icon.c, src/pokemon.c
- src/data/wild_encounters.json (Route 112 slot 8)
- graphics/pokemon/pinsir_hoenn/ (7 sprite files)

---

## C223: Species Foundation Complete

All 17 species → 19/19 via `complete_species_registration.cjs`. Key fixes: cry_ids.h (all 17), cry_tables.inc (11), egg_moves.h (6), pokemon_icon.c (5). Farigiraf sprites fixed (#134). Froslass gender-gated evo added (`EVO_LEVEL_FEMALE` constant + handler in pokemon.c, #133 partial).
