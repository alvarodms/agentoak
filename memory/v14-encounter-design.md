# v1.4 "The Wild Redesign" — Encounter Design Document

> Full encounter specifications for all priority routes. Reference from strategy-notes.md.
> Created: C163 (planning cycle). Implementation: C164-C167. **C165**: Early game done. **C166**: Mid-game done. **C167**: Late-game & caves done.

---

## Critical Problems in Current Tables

1. **Early route power creep**: Routes 101-102 have Dratini (40%), Bagon (1%), Larvitar (1%), Aron, Trapinch, Houndour at Lv 2-4. Destroys difficulty curve.
2. **Petalburg Woods overleveled**: Heracross (BST 500), Scyther (BST 500), Breloom (BST 460), Alakazam (BST 490) at Lv 10-16. Pre-Badge 1!
3. **Homogeneous migration**: Houndour/Sneasel on 8+ routes — lost all identity.
4. **Route 103 has zero Hoenn natives**: Vulpix/Meowth/Abra/Poliwag/Wingull only.
5. **Water route monotony**: All sea routes copy-pasted Tentacool/Wingull/Pelipper.

---

## Level Curve

| Gym | Leader | Badge | Player Lv | Route Lv Range |
|-----|--------|-------|-----------|----------------|
| 1 | Roxanne (Rock) | Stone | 12-14 | R101-104, Petalburg Woods: 2-8 |
| 2 | Brawly (Fight) | Knuckle | 16-18 | R106-109, Granite Cave: 8-14 |
| 3 | Wattson (Elec) | Dynamo | 22-24 | R110, R117, Mauville: 15-22 |
| 4 | Flannery (Fire) | Heat | 26-28 | R111-113, Fiery/Jagged: 18-24 |
| 5 | Norman (Normal) | Balance | 30-32 | R114-116, Meteor Falls: 24-28 |
| 6 | Winona (Flying) | Feather | 33-35 | R118-121, Fortree: 25-31 |
| 7 | Tate&Liza (Psychic) | Mind | 38-40 | R124-128, Mossdeep: 30-38 |
| 8 | Juan (Water) | Rain | 43-45 | R127-134, Sootopolis: 35-42 |
| E4 | — | — | 48-52 | Victory Road, Sky Pillar: 40-55 |

---

## Design Principles

### Migration Species Distribution
- **No migration species on Routes 101-103.** First routes = pure Hoenn identity.
- Migration species appear mid-to-late game at 1-5% rates. Finding one = an event.
- Each migration species has 1-2 primary routes + 1-2 secondary at 1%.
- Hoenn natives always dominate (60%+ of every route).

### Migration Species Map
| Species | Primary (4-5%) | Secondary (1%) | Notes |
|---------|---------------|----------------|-------|
| Larvitar | R111 desert (5%) | Granite Cave deep, Meteor Falls deep | Desert/cave specialist |
| Gible | R111 desert (1%) | — | Ultra-rare desert prize |
| Riolu | R116 (4%) | New Mauville (1%) | Near Rustboro/Mauville |
| Dratini | Safari Zone (land) | R119 Super Rod (4%) | Aquatic + safari |
| Houndour | R112-113 (5%) | R123 (1%), Mt. Pyre (4%) | Volcanic/fire areas |
| Sneasel | Shoal Cave (5%) | R120 (1%), R113 (1%) | Cold/dark areas |

### Route Identity Rules
- Every route has 2-3 signature species in the top 3 slots (50% of encounters)
- No two adjacent routes share more than 1 species in top 3
- Every route has exactly 1 rare reward (1% slot)
- Migration species never above 10% base rate on any route

### Team-Building Flow
- Pre-Roxanne: Water (Lotad, Marill), Grass (Shroomish, Seedot), Fighting (none yet — Makuhita in Granite Cave)
- Pre-Brawly: Psychic (Ralts R102), Flying (Taillow R101/104)
- Pre-Wattson: Ground (Nincada R116, Sandshrew R111)
- Pre-Flannery: Water (surfing R110), Ground (R111)
- Pre-Norman: Fighting (Machop R112, Makuhita Granite Cave)
- Pre-Winona: Electric (Electrike R110, Mareep R110), Ice (Sneasel R113 rare)

---

## Priority Route Specifications (Cycle A)

### Route 101 — "The First Steps" (Lv 2-3)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Zigzagoon | 2-3 | Hoenn signature, Pickup |
| 1 | 20 | Poochyena | 2-3 | Classic Route 101 Dark |
| 2 | 10 | Wurmple | 2-3 | Fast evo chain satisfaction |
| 3 | 10 | Taillow | 3 | Early Flying, 85 Spe |
| 4 | 10 | Lotad | 2-3 | Water/Grass dual-type diversity |
| 5 | 10 | Seedot | 2-3 | Grass, counterpart to Lotad |
| 6 | 5 | Zigzagoon | 3 | Higher level variant |
| 7 | 5 | Poochyena | 3 | Higher level variant |
| 8 | 4 | Ralts | 3-4 | Psychic fan favorite, rare enough to excite |
| 9 | 4 | Skitty | 3 | Cute Normal utility |
| 10 | 1 | Eevee | 4 | **Rare reward.** 5 evo paths, genuine "wow" moment |
| 11 | 1 | Swablu | 4 | Cotton bird → Dragon/Flying Altaria long-term |

### Route 102 — "The Pond Path" (Lv 3-4)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Zigzagoon | 3-4 | Continuity, higher level |
| 1 | 20 | Seedot | 3-4 | Woodland route Grass identity |
| 2 | 10 | Lotad | 3-4 | Pond dweller Water/Grass |
| 3 | 10 | Poochyena | 3-4 | Dark underbrush |
| 4 | 10 | Surskit | 3-4 | Bug/Water unique typing, pond signature |
| 5 | 10 | Ralts | 4 | Accessible Psychic |
| 6 | 5 | Marill | 4 | Water, Huge Power |
| 7 | 5 | Wurmple | 3 | Bug presence |
| 8 | 4 | Shroomish | 4 | Grass/Fighting Breloom reward |
| 9 | 4 | Nincada | 3-4 | Bug/Ground → Ninjask + Shedinja |
| 10 | 1 | Abra | 4-5 | **Rare reward.** Teleport challenge, → Alakazam |
| 11 | 1 | Oddish | 4 | Grass/Poison option |

### Route 103 — "The Coastal Lookout" (Lv 2-4)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Wingull | 2-3 | Coastal bird signature |
| 1 | 20 | Zigzagoon | 2-3 | Regional common |
| 2 | 10 | Poochyena | 3-4 | Coast prowler |
| 3 | 10 | Taillow | 3-4 | Inland bird vs coastal Wingull |
| 4 | 10 | Oddish | 3-4 | Coastal scrub Grass/Poison |
| 5 | 10 | Tentacool | 3-4 | Tide pool dweller on land |
| 6 | 5 | Wingull | 3-4 | More gulls |
| 7 | 5 | Poochyena | 4 | Higher level |
| 8 | 4 | Electrike | 4-5 | First Electric option, foreshadows Manectric |
| 9 | 4 | Vulpix | 4-5 | First Fire option besides Torchic |
| 10 | 1 | Staryu | 5 | **Rare reward.** → Starmie (BST 520) |
| 11 | 1 | Meowth | 4 | First migration hint — subtle |

### Route 104 — "The Flower Road" (Lv 4-5)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Wurmple | 4-5 | Garden bugs, pollinators |
| 1 | 20 | Taillow | 4-5 | Birds in flower fields |
| 2 | 10 | Marill | 4-5 | Water near bridge/coast |
| 3 | 10 | Poochyena | 4-5 | Regional predator |
| 4 | 10 | Wingull | 5 | Coastal proximity |
| 5 | 10 | Oddish | 4-5 | Flower garden Grass/Poison |
| 6 | 5 | Zigzagoon | 4-5 | Pickup utility |
| 7 | 5 | Roselia | 5-6 | **Route signature** — flower guardian, 100 SpA |
| 8 | 4 | Skitty | 5 | Near the cottage |
| 9 | 4 | Shroomish | 5 | Forest edge spillover |
| 10 | 1 | Pikachu | 5-6 | **Rare reward.** Classic Route 2 callback |
| 11 | 1 | Surskit | 5 | Bug/Water near bridge |

### Petalburg Woods — "The Deep Canopy" (Lv 5-8)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Shroomish | 5-7 | Forest floor, Grass → Breloom |
| 1 | 20 | Wurmple | 5-6 | Deep woods bugs |
| 2 | 10 | Slakoth | 5-6 | Petalburg Woods exclusive signature |
| 3 | 10 | Cascoon | 6-7 | Evolved bug, slightly threatening |
| 4 | 10 | Silcoon | 6-7 | Parallel with Cascoon |
| 5 | 10 | Taillow | 5-6 | Canopy gaps |
| 6 | 5 | Seedot | 5-6 | Acorn in trees |
| 7 | 5 | Spinarak | 5-7 | Bug/Poison — Gen 2 web spinner, fits forest |
| 8 | 4 | Shroomish | 7-8 | Higher level deeper |
| 9 | 4 | Oddish | 6-7 | Forest undergrowth |
| 10 | 1 | Heracross | 7-8 | **Rare reward.** Bug/Fighting 125 Atk, the forest prize |
| 11 | 1 | Pineco | 6-7 | Bug → Forretress (Bug/Steel) |

---

## Mid-Game Routes (Cycle B)

### Route 110 — "Cycling Road / Migration Watch" (Lv 15-18)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Electrike | 15-17 | Electric, route signature, Wattson prep |
| 1 | 20 | Oddish | 15-17 | Grass/Poison gardens |
| 2 | 10 | Gulpin | 16-17 | Poison — Mauville native |
| 3 | 10 | Plusle | 16-18 | Electric cheerleader |
| 4 | 10 | Minun | 16-18 | Electric counterpart |
| 5 | 10 | Wingull | 16-17 | Coastal birds |
| 6 | 5 | Mareep | 16-17 | **Migration** — Birdwatcher NPC references |
| 7 | 5 | Machop | 16-18 | Fighting — Norman prep |
| 8 | 4 | Volbeat | 17-18 | Bug nocturnal |
| 9 | 4 | Illumise | 17-18 | Bug counterpart |
| 10 | 1 | Electabuzz | 18 | **Rare reward.** Electric BST 490 |
| 11 | 1 | Pikachu | 17 | Fan favorite Electric |

### Route 113 — "The Ash Route" (Lv 20-23)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Spinda | 20-22 | Route signature, dizzy in ash |
| 1 | 20 | Slugma | 20-22 | Fire volcanic ash |
| 2 | 10 | Sandshrew | 20-22 | Ground, burrows in ash |
| 3 | 10 | Numel | 20-22 | Fire/Ground volcanic |
| 4 | 10 | Swablu | 21-22 | Flying through ash clouds |
| 5 | 10 | Spoink | 20-22 | Psychic bouncer |
| 6 | 5 | Houndour | 21-22 | **Migration** — Volcanologist NPC references |
| 7 | 5 | Murkrow | 21-22 | Dark/Flying ash scavenger |
| 8 | 4 | Torkoal | 21-23 | Fire — defensive wall |
| 9 | 4 | Baltoy | 21-22 | Ground/Psychic clay figure |
| 10 | 1 | Skarmory | 22-23 | **Rare reward.** Steel/Flying in volcanic cliffs |
| 11 | 1 | Sneasel | 22-23 | Dark/Ice migration oddity |

### Route 111 — "The Desert" (Lv 18-22) ✅ C166
| Slot | % | Species | Lv | Notes |
|------|---|---------|----|-------|
| 0 | 20 | Sandshrew | 19-21 | Desert signature |
| 1 | 20 | Trapinch | 18-20 | Arena Trap, →Flygon |
| 2 | 10 | Cacnea | 19-21 | Desert cactus |
| 3 | 10 | Baltoy | 19-21 | Ground/Psychic ruins |
| 4 | 10 | Geodude | 19-21 | Rocky outcrops |
| 5 | 10 | Sandshrew | 20-22 | Higher-level |
| 6 | 5 | Larvitar | 20-22 | **Migration** |
| 7 | 5 | Aron | 20-22 | Mineral deposits |
| 8 | 4 | Cacnea | 20-22 | Higher-level |
| 9 | 4 | Baltoy | 20-22 | Deeper ruins |
| 10 | 1 | Vibrava | 21-22 | Rare evolved form |
| 11 | 1 | Gible | 21-22 | **Ultra-rare migration** |

### Route 112 — "Volcanic Pass" (Lv 19-22) ✅ C166
| Slot | % | Species | Lv | Notes |
|------|---|---------|----|-------|
| 0 | 20 | Numel | 19-21 | Fire/Ground volcanic |
| 1 | 20 | Geodude | 19-21 | Rocky terrain |
| 2 | 10 | Machop | 20-22 | Mountain climber |
| 3 | 10 | Slugma | 19-21 | Lava slug |
| 4 | 10 | Koffing | 20-22 | Volcanic gas |
| 5 | 10 | Aron | 20-22 | Iron deposits |
| 6 | 5 | Numel | 21-22 | Higher-level |
| 7 | 5 | Geodude | 21-22 | Higher-level |
| 8 | 4 | Houndour | 21-22 | **Migration** |
| 9 | 4 | Nidoran-F | 20-22 | **Migration** |
| 10 | 1 | Torkoal | 22 | Rare furnace turtle |
| 11 | 1 | Graveler | 22 | Evolved Geodude |

### Route 114 — "The Riverbank" (Lv 15-18) ✅ C166
| Slot | % | Species | Lv | Notes |
|------|---|---------|----|-------|
| 0 | 20 | Lotad | 15-17 | River signature |
| 1 | 20 | Swablu | 15-17 | Riverside flier |
| 2 | 10 | Seviper | 16-18 | Riverside serpent |
| 3 | 10 | Zangoose | 16-18 | Seviper's rival |
| 4 | 10 | Oddish | 15-17 | Riverside vegetation |
| 5 | 10 | Marill | 16-17 | River mouse |
| 6 | 5 | Lombre | 16-18 | Evolved Lotad |
| 7 | 5 | Seedot | 15-17 | Forest edge |
| 8 | 4 | Nuzleaf | 17-18 | Evolved Seedot |
| 9 | 4 | Roselia | 16-18 | Wildflowers |
| 10 | 1 | Teddiursa | 17-18 | **Migration rare** |
| 11 | 1 | Surskit | 16-17 | Bug/Water pond |

### Route 115 — "The Cliff Coast" (Lv 23-26) ✅ C166
| Slot | % | Species | Lv | Notes |
|------|---|---------|----|-------|
| 0 | 20 | Swablu | 23-25 | Cliff nesting |
| 1 | 20 | Taillow | 23-25 | Coastal swallow |
| 2 | 10 | Jigglypuff | 24-26 | Cliff singer |
| 3 | 10 | Wingull | 23-25 | Coastal gulls |
| 4 | 10 | Geodude | 24-26 | Cliff rock |
| 5 | 10 | Nosepass | 24-26 | Rocky compass Pokémon |
| 6 | 5 | Swellow | 25-26 | Evolved Taillow |
| 7 | 5 | Machop | 24-26 | Cliff climber |
| 8 | 4 | Makuhita | 24-26 | Cliff warrior |
| 9 | 4 | Absol | 25-26 | Disaster omen |
| 10 | 1 | Gligar | 25-26 | **Migration rare** |
| 11 | 1 | Pinsir | 25-26 | Rare cliff beetle |

### Route 116 — "Tunnel Approach" (Lv 6-10) ✅ C166
| Slot | % | Species | Lv | Notes |
|------|---|---------|----|-------|
| 0 | 20 | Taillow | 6-8 | Route standard |
| 1 | 20 | Whismur | 6-8 | Tunnel-adjacent |
| 2 | 10 | Nincada | 7-9 | Bug/Ground burrower |
| 3 | 10 | Zigzagoon | 6-8 | Regional common |
| 4 | 10 | Poochyena | 7-8 | Dark prowler |
| 5 | 10 | Geodude | 8-10 | Near tunnel |
| 6 | 5 | Abra | 7-9 | Teleport challenge |
| 7 | 5 | Taillow | 8-10 | Higher-level |
| 8 | 4 | Riolu | 8-10 | **Migration** |
| 9 | 4 | Skitty | 7-9 | Cute Normal |
| 10 | 1 | Aron | 9-10 | Tunnel spillover |
| 11 | 1 | Sableye | 8-10 | Dark/Ghost cave |

### Route 117 — "Daycare Route" (Lv 13-15) ✅ C166
| Slot | % | Species | Lv | Notes |
|------|---|---------|----|-------|
| 0 | 20 | Oddish | 13-14 | Garden weed |
| 1 | 20 | Marill | 13-14 | Stream mouse |
| 2 | 10 | Volbeat | 14-15 | Bug garden light |
| 3 | 10 | Illumise | 14-15 | Bug garden glow (fixed from 40%) |
| 4 | 10 | Seedot | 13-15 | Garden tree pods |
| 5 | 10 | Zigzagoon | 13-14 | Garden path |
| 6 | 5 | Roselia | 14-15 | Garden flower |
| 7 | 5 | Oddish | 14-15 | Higher-level |
| 8 | 4 | Shroomish | 14-15 | Garden mushroom |
| 9 | 4 | Marill | 14-15 | Higher-level |
| 10 | 1 | Ditto | 15 | Daycare route breeder prize |
| 11 | 1 | Surskit | 14-15 | Garden pond skater |

---

## Late-Game Routes (Cycle C)

### Route 119 — "The Weather Route" (Lv 25-30)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Tropius | 26-28 | Route signature — jungle giant, exclusive |
| 1 | 20 | Oddish | 25-27 | Jungle undergrowth |
| 2 | 10 | Linoone | 27-29 | Evolved regional showing progression |
| 3 | 10 | Kecleon | 26-28 | Camouflage signature |
| 4 | 10 | Gloom | 27-29 | Evolved Oddish, rain growth |
| 5 | 10 | Roselia | 26-28 | Jungle flowers, 100 SpA |
| 6 | 5 | Chinchou | 25-28 | **Migration** — Weather Intern references |
| 7 | 5 | Yanma | 26-28 | Bug/Flying jungle dragonfly |
| 8 | 4 | Bellsprout | 26-28 | Jungle vine trap |
| 9 | 4 | Natu | 27-29 | Psychic/Flying mystic bird |
| 10 | 1 | Heracross | 28-30 | Deep jungle prize |
| 11 | 1 | Corsola | 27-29 | Water/Rock rain pools |

Super Rod: Dratini (4%), Feebas (1%) — fishing migration + legendary rarity.

### Route 123 — "The Berry Garden" (Lv 26-30)
| Slot | % | Species | Lv | Justification |
|------|---|---------|----|---------------|
| 0 | 20 | Oddish | 26-28 | Berry garden dweller |
| 1 | 20 | Mightyena | 27-29 | Dark route guard |
| 2 | 10 | Gloom | 27-29 | Garden ecology |
| 3 | 10 | Roselia | 26-28 | Berry Researcher's specimen |
| 4 | 10 | Kecleon | 26-28 | Bush camouflage |
| 5 | 10 | Shuppet | 27-28 | Mt. Pyre influence |
| 6 | 5 | Meowth | 26-28 | **Migration** — Berry Researcher references |
| 7 | 5 | Volbeat | 27-28 | Pollinator |
| 8 | 4 | Exeggcute | 27-29 | Grass/Psychic tropical garden |
| 9 | 4 | Paras | 26-28 | Bug/Grass mushroom |
| 10 | 1 | Heracross | 28-30 | Garden undergrowth fighter |
| 11 | 1 | Houndour | 28 | Dark/Fire migration predator |

### Route 118/120/121 — Outlines
- **R118**: Keep SecondWave. Replace Wingull overload (5 slots) with Doduo (5%), Absol (4%), Girafarig (4%). Rare: Kangaskhan (1%).
- **R120**: Keep Absol, Kecleon, Togetic (1%). Replace Flaaffy with Exeggcute. Sneasel stays at 1%.
- **R121**: Good as-is. Clefairy (20%) identity. SecondWave Tauros/Miltank/Ursaring.

### Caves
- **Granite Cave**: Remove Larvitar/Bagon/Sneasel/Alakazam (too early). Keep Aron (signature), Zubat, Sableye, Geodude, Machop. Add Makuhita (10%), Nosepass (4%), Mawile (4%), Abra (1%).
- **Mt. Pyre 1F**: Replace 12-slot Shuppet monoculture with: Shuppet (40%), Duskull (20%), Meditite (10%), Vulpix (5%), Misdreavus (4%), Houndour (4%), Sableye (1%).
- **Victory Road**: Add Graveler (10%), Pupitar (4%), Medicham (5%), Shelgon (1%). Keep Golbat, Hariyama, Lairon.
- **Shoal Cave**: Sneasel's PRIMARY location (5%). Rare: Lapras (1% surf). Spheal/Snorunt/Sealeo.

---

## Ocean Routes (Cycle D)

Every water route gets 1-2 unique species to end the Tentacool/Wingull monoculture:

| Route | Theme | Unique Additions |
|-------|-------|-----------------|
| R105 | Standard ocean | Staryu (5% surf), Horsea (4%) |
| R106 | Granite Cave area | Seel (5% surf), Shellder (4%) |
| R107 | Deep ocean | Wailmer (30%), Corsola (4%), Mantine (1%) |
| R108 | Abandoned Ship | Grimer (5% surf), Koffing (4%) |
| R109 | Beach/resort | Psyduck (5% surf), Slowpoke (4%) |
| R122 | Mt. Pyre approach | Shuppet (5% surf), Duskull (4%) |
| R124 | Deep ocean | Chinchou (5% surf), Horsea (4%), Seadra (1%) |
| R125 | Shoal Cave approach | Spheal (5% surf) |
| R127 | Rocky shoals | Corsola (5%), Staryu (4%), Remoraid (1%) |
| R128 | Seafloor Cavern | Wailmer (30%), Relicanth (1%) |
| R129 | Pelagic zone | Sharpedo (5%), Wailmer dominant |
| R130 | Mirage area | Wynaut (1%) |
| R131 | Sky Pillar approach | Carvanha elevated, Qwilfish (4%) |

---

## New Species Placements Summary

| Species | Where | Rate | Why |
|---------|-------|------|-----|
| Eevee | R101 | 1% | Dream catch on first route |
| Staryu | R103 land/surf | 1%/5% | Coastal tide pools |
| Pikachu | R104, R110 | 1% each | Fan service, Electric |
| Spinarak | Petalburg Woods | 5% | Forest web-spinner |
| Heracross | Petalburg/R119/R123 | 1% each | Deep forest prize |
| Roselia | R104/R117/R119/R123 | 5-10% | Flower routes |
| Exeggcute | R120/R123 | 4% each | Tropical Grass/Psychic |
| Yanma | R119 | 5% | Jungle dragonfly |
| Natu | R119 | 4% | Mystic forest bird |
| Teddiursa | R114 | 1% | Riverside bear |
| Gligar | R115 | 1% | Cliff Ground/Flying |
| Kangaskhan | R118 | 1% | Safari-like encounter |
| Lapras | Shoal Cave surf | 1% | Ice cave legend |
| Paras | R123 | 4% | Berry garden bug |
