# New Species — Completed Work

## Riolu & Lucario (Cycle 60)

First-ever new species addition. Complete pipeline: constants, species data, learnsets, evolution, Pokédex, graphics, cries, encounters.

### Files Modified

Same ~29 source files per species family. Reusable scripts: `scripts/add_corsola_hoenn.js` + `add_corsola_hoenn_part2.cjs`.

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

## Hoennian Corsola (Cycle 195) — BUILD CLEAN

First regional variant. Ghost/Rock typing. Quest 1 reward encounter.

| Detail | Value |
|--------|-------|
| Species ID | SPECIES_CORSOLA_HOENN (418) |
| Stats | 65/55/75/65/95/45 BST 400, Ghost/Rock |
| Ability | Weak Armor |
| Encounter | Scripted: PacifidlogTown Quest 1 reward (setwildbattle Lv45) |
| Learnset | Astonish, Rock Throw, Shadow Sneak, Night Shade, Ancient Power, Curse, Shadow Ball, Rock Slide, Confuse Ray, Destiny Bond |
| Egg moves | Confuse Ray, Curse, Destiny Bond, Night Shade, Screech |
| TMs | Shadow Ball, Rock Tomb, Calm Mind, Toxic, Return, etc. |
| Assets | Fetched via fetch_pokemon_sprites (expansion repo Corsola sprites — placeholder until Sprite Designer creates bleached-fossil palette) |
| Cry | Reuses Corsola cry (no custom .bin) |
| Script | PacifidlogTown_EventScript_ElderQuestBattle — static encounter after completing Quest 1 investigation |
| Dex text | Volcanic thermal vent lore — fossilized coral becoming ghostly remnants |
| Pipeline | Automated via Node.js scripts (add_corsola_hoenn.js + part2.cjs). Also fixed 17 pre-existing trainer macro warnings. |

## Hoennian Growlithe & Arcanine (Cycle 198) — BUILD CLEAN

Second and third regional variants. Water (Growlithe) and Water/Fire (Arcanine) typing. Quest 2 reward encounter.

| Detail | Value |
|--------|-------|
| Species IDs | SPECIES_GROWLITHE_HOENN (419), SPECIES_ARCANINE_HOENN (420), EGG→421 |
| Stats | Growlithe: 55/45/45/80/65/60 BST 350 (Water), Arcanine: 90/95/80/115/85/90 BST 555 (Water/Fire) |
| Abilities | Growlithe: Swift Swim / Swift Swim, Arcanine: Intimidate / Flash Fire |
| Evolution | Growlithe_Hoenn → Arcanine_Hoenn via Water Stone |
| Encounter | Scripted: Weather Institute 2F Quest 2 reward (setwildbattle Lv40, held NeverMeltIce) |
| Learnset (G) | Bite, Roar, Water Gun(7), Leer(13), Odor Sleuth(19), Water Pulse(25), Take Down(31), Rain Dance(37), Agility(43), Hydro Pump(49) |
| Learnset (A) | Bite(1), Water Gun(1), Roar(1), Water Pulse(1), Flamethrower(1), Helping Hand(1), Extreme Speed(49) |
| Egg moves | Crunch, Thrash, Howl, Mist, Whirlpool, Safeguard |
| TMs | G: 25 TMs (Water HMs, Ice Beam, Rain Dance). A: 31 TMs (adds Fire STAB: Flamethrower/Fire Blast/Overheat, Sunny Day, Blizzard, Hyper Beam) |
| Assets | Fetched via fetch_pokemon_sprites (expansion repo). All 7 files each. |
| Cry | Reuses vanilla Cry_Growlithe and Cry_Arcanine |
| Pipeline | Automated via Node.js script (scripts/add_growlithe_arcanine.cjs) + manual patches for graphics tables and include/graphics.h extern declarations |
| Files modified | 27 source files + scripts/add_growlithe_arcanine.cjs + Quest 2 script modification |

## Hoennian Vulpix & Ninetales (Cycle 208) — BUILD PENDING

Fourth and fifth regional variants. Ice/Fairy typing. Second mid-game accessible form (Route 113).

| Detail | Value |
|--------|-------|
| Species IDs | SPECIES_VULPIX_HOENN (421), SPECIES_NINETALES_HOENN (422), EGG→423 |
| Stats | Vulpix: 38/36/40/55/65/65 BST 299 (Ice/Fairy), Ninetales: 73/60/75/90/100/107 BST 505 (Ice/Fairy) |
| Abilities | Vulpix: Inner Focus / Cute Charm, Ninetales: Inner Focus / Flash Fire |
| Evolution | Vulpix_Hoenn → Ninetales_Hoenn via Moon Stone |
| Encounter | Route 113 slot 9 (4%): Vulpix_Hoenn Lv21-22 (replaces Baltoy) |
| NPC | FrostTracker (PokeFan_M) at Route 113 x=56,y=12 — pacing NPC tracking frost crystals in volcanic ash |
| Learnset (V) | Powder Snow(1), Tail Whip(5), Roar(9), Quick Attack(13), Icy Wind(17), Confuse Ray(21), Dazzling Gleam(25), Ice Beam(29), Safeguard(33), Grudge(37), Blizzard(41) |
| Learnset (N) | Confuse Ray(1), Quick Attack(1), Moonblast(1), Safeguard(1), Blizzard(45) |
| Egg moves | Hypnosis, Disable, Spite, Charm, Howl, Extrasensory, Moonblast |
| TMs | V: 18 TMs (Calm Mind, Hail, Ice Beam, Blizzard, etc.). N: 21 TMs (adds Hyper Beam, Psychic, Shadow Ball) |
| Assets | Sprite Designer created ice-blue recolor sprites (v1). All 7 files each. |
| Cry | Reuses vanilla Cry_Vulpix and Cry_Ninetales |
| Pipeline | Automated via `scripts/add_regional_form.cjs` with configs in `pokeemerald/configs/` |
| Files modified | 26+24 source files (pipeline) + wild_encounters.json + Route113/scripts.inc + Route113/map.json |
