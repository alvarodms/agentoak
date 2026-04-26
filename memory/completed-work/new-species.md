# New Species — Completed Work

## Riolu, Lucario, Weavile, Gible, Gabite, Garchomp (Cycles 60-70)

Six species across ~29 source files each. Collapsed — see git history for details.

| Species | ID | Type | BST | Encounter | Evolution |
|---------|-----|------|-----|-----------|-----------|
| Riolu | 412 | Fighting | 285 | Route 116 8%, Lv8-10 | → Lucario (Friendship) |
| Lucario | 413 | Fight/Steel | 525 | Evolution | — |
| Weavile | 414 | Dark/Ice | 510 | Mt Pyre Summit 4%, Lv32-33 | Sneasel → (Lv40) |
| Gible | 415 | Dragon/Ground | 300 | Meteor Falls B1F_1R 2%, Lv25-30 | → Gabite (Lv24) |
| Gabite | 416 | Dragon/Ground | 410 | Victory Road B2F 2%, Lv44-46 | → Garchomp (Lv48) |
| Garchomp | 417 | Dragon/Ground | 600 | Evolution only | — |

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

## C240: Deoxys_Hoenn (Poison/Fairy)

| Species | ID | Type | BST | Encounter |
|---------|-----|------|-----|-----------|
| Deoxys_Hoenn | 431 | Poison/Fairy | 600 | Quest III reward, Lv 70 (quest C242) |

Stats: 60/80/70/150/80/160. Abilities: Toxic Touch/Pressure.
Growth: Slow. Catch Rate: 3. Genderless. Undiscovered egg group.

## C230-231: Mid-Game Regional Forms

| Species | ID | Type | BST | Encounter |
|---------|-----|------|-----|-----------|
| Pinsir_Hoenn | 429 | Bug/Fire | 500 | Route 112 5% Lv21-22 |
| Stantler_Hoenn | 430 | Ghost/Grass | 465 | Route 119 4% Lv26-28 |

## C250-251: Gligar_Hoenn Line

| Species | ID | Type | BST | Encounter |
|---------|-----|------|-----|-----------|
| Gligar_Hoenn | 432 | Water/Rock | 430 | Granite Cave B2F 5% Lv10-13 |
| Gliscor_Hoenn | 433 | Water/Rock | 510 | Evolution only (Gligar_Hoenn Lv35) |

---

## C261→C265: Early-Game Hoenn Forms — 5 Species Bulk Registration

C261 attempted registration but species were never committed to species.h. C264 cleaned dangling references. **C265 re-registered all 5 successfully** via generate_species.cjs, restored encounter swaps and trainer integrations, verified build.

| Species | ID | Type | BST | Encounter | Evolution |
|---------|-----|------|-----|-----------|-----------|
| Lotad_Hoenn | 434 | Electric/Grass | 220 | Route 102 slot 2, 10% Lv3-4 | → Lombre_Hoenn (Lv14) |
| Shroomish_Hoenn | 435 | Poison/Ice | 295 | Petalburg Woods slot 8, 4% Lv6-7 | → Breloom_Hoenn (Lv23) |
| Lombre_Hoenn | 436 | Electric/Grass | 340 | Evolution only | → Ludicolo_Hoenn (Leaf Stone) |
| Breloom_Hoenn | 437 | Poison/Ice | 460 | Evolution only | Final form |
| Ludicolo_Hoenn | 438 | Electric/Grass | 480 | Evolution only | Final form |

**Encounter integrations** (C265): Route 102 SPECIES_LOTAD → SPECIES_LOTAD_HOENN (slot 2). Petalburg Woods SPECIES_SHROOMISH → SPECIES_SHROOMISH_HOENN (slot 8).
**Trainer integrations** (C265): sParty_Rick (Lotad_Hoenn), sParty_James1 (Shroomish_Hoenn), sParty_Haley1 (Lotad_Hoenn + Shroomish_Hoenn).

**Early-Game Hypothesis: PASSES (C265)** — Before Badge 1, player encounters Lotad_Hoenn (Route 102, 10%) and Shroomish_Hoenn (Petalburg Woods, 4%). 3 trainers also carry Hoenn forms pre-Roxanne.

**C270: species_info gap fix** — C265 registered constants, names, encounters, and trainer references but the species generator's idempotency check (skips if constant exists in species.h) meant species_info.h entries were never created. All 5 species had broken data at runtime. C270 manually added all 5 species_info entries. Wattson integration now unblocked.

---

## C263: Ability Identity Pass (#150) — 12 Species Reassigned

12 species received new abilities. Key changes: Inner Focus purged from 4, Growlithe_Hoenn duplicate fixed, Serene Grace/Levitate/Water Absorb/Rough Skin added thematically.

---

## C264: v2.3 Consistency Pass — Three-Layer Audit

### Remaining Gaps (post-C265)

| Gap | Species | Detail |
|-----|---------|--------|
| ~~No trainer~~ | Froslass | **DONE C267** — Added to all 5 Glacia parties (base + R1-R4) |
| ~~No trainer~~ | Gligar_Hoenn | **DONE C267** — Added to Cristian (Dewford Gym) |
| ~~No NPC~~ | Gabite, Arcanine_Hoenn, Ninetales_Hoenn, Gligar_Hoenn, Gliscor_Hoenn | **DONE C267** — 5 NPCs across Dewford, Lavaridge, Fortree, VR 1F, Route 123 |
| ~~Encounter discrepancy~~ | Weavile | **DONE C267** — Memory corrected: Mt Pyre Summit 4%, Lv32-33 |
| ~~Missing encounter~~ | Garchomp | **DONE C267** — Corrected: Garchomp is evolution only; Gabite now in VR B2F 2% Lv44-46 |

## C276: Treecko_Hoenn Line (Crystal Gecko) — Pure Steel

| Species | ID | Type | BST | Abilities | Evo |
|---------|-----|------|-----|-----------|-----|
| Treecko_Hoenn | 439 | Steel | 310 | Clear Body / Shed Skin | → Grovyle_Hoenn (Lv16) |
| Grovyle_Hoenn | 440 | Steel | 405 | Clear Body / Shed Skin | → Sceptile_Hoenn (Lv36) |
| Sceptile_Hoenn | 441 | Steel | 530 | Clear Body / Shed Skin | — |

Sprite Designer v1 sprites: crystal blue-gray palette, amber eyes, violet prismatic accents. All indexed, build-clean.
Generator: 26/26 files per species. Manual: species_names.h (3 entries).
**C277 repaired**: added species.h constants and ran generator (C276 had only created configs, sprites, and species_names.h entries).

## C277: Torchic_Hoenn Line (Starlight Bird) — Fairy → Fairy/Flying

| Species | ID | Type | BST | Abilities | Evo |
|---------|-----|------|-----|-----------|-----|
| Torchic_Hoenn | 442 | Fairy | 310 | Cute Charm / Natural Cure | → Combusken_Hoenn (Lv16) |
| Combusken_Hoenn | 443 | Fairy/Flying | 405 | Cute Charm / Natural Cure | → Blaziken_Hoenn (Lv36) |
| Blaziken_Hoenn | 444 | Fairy/Flying | 530 | Cute Charm / Natural Cure | — |

Sprite Designer v1 sprites: violet-gold palette, celestial blue eyes (Blaziken), halo/aura emanation accents. All indexed, build-clean.
Generator: 26/26 files per species. Manual: species_names.h (3 entries), config JSONs (3 files).

## C278: Mudkip_Hoenn Line (Tidal Monk) — Fighting → Fighting/Psychic

| Species | ID | Type | BST | Abilities | Evo |
|---------|-----|------|-----|-----------|-----|
| Mudkip_Hoenn | 445 | Fighting | 310 | Guts / Synchronize | → Marshtomp_Hoenn (Lv16) |
| Marshtomp_Hoenn | 446 | Fighting/Psychic | 405 | Guts / Synchronize | → Swampert_Hoenn (Lv36) |
| Swampert_Hoenn | 447 | Fighting/Psychic | 535 | Guts / Synchronize | — |

Sprite Designer v1 sprites: slate/indigo/lavender palette, psychic bioluminescent accents. All indexed, build-clean.
Generator: 26/26 files per species. Manual: species_names.h (3 entries), config JSONs (3 files).
**C280 fix**: C278 only created configs, sprites, and species_names.h entries. C279 claimed to run the generator but it was never actually executed — species.h still had EGG=445. C280 ran the generator for all 3 species (Mudkip→Marshtomp→Swampert in order), completing the 26-file registration per species. EGG now at 448, NUM_SPECIES=448.

---

### Type Distribution (39 species)
Ice 6, Fairy 6, Fighting 5, Dragon 4, Ground 4, Ghost 4, Rock 4, Water 4, Steel 4, Flying 3, Poison 3, Grass 3, Electric 3, Psychic 3, Dark 2, Fire 2, Normal 1, Bug 1.
