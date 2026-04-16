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

## C223: Species Foundation Complete

All 17 species → 19/19 via `complete_species_registration.cjs`. Key fixes: cry_ids.h (all 17), cry_tables.inc (11), egg_moves.h (6), pokemon_icon.c (5). Farigiraf sprites fixed (#134). Froslass gender-gated evo added (`EVO_LEVEL_FEMALE` constant + handler in pokemon.c, #133 partial).
