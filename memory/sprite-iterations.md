# Sprite Iterations

> Tracks version history for regional form sprites across cycles.
> **Budget**: ~50 lines. Collapse completed entries when exceeded.

| Species | Type | Version | Cycle | Issue | Status |
|---------|------|---------|-------|-------|--------|
| Corsola Hoenn | Ghost/Rock | v3 | 216 | #116 | iterated — frown mouth (∩ shape: center y37 + drooping corners y38), vivid purple iris (130,60,180) per @alvarodms |
| Growlithe Hoenn | Water | v2 | 258 | #131 | bulkified — 1px outline expansion (left/right/down), fill 26.6%→34.7% front, 34.0%→41.0% back |
| Arcanine Hoenn | Water/Fire | v1 | 196 | — | awaiting feedback |
| Vulpix Hoenn | Ice/Fairy | v1 | 208 | — | new |
| Ninetales Hoenn | Ice/Fairy | v1 | 208 | — | new |
| Bagon Hoenn | Dragon/Rock | v1 | 215 | — | new |
| Pinsir Hoenn | Bug/Fire | v1 | 230 | — | new |
| Stantler Hoenn | Ghost/Grass | v1 | 231 | — | new |
| Deoxys Hoenn | Poison/Fairy | v1 | 240 | — | new |
| Gligar Hoenn | Water/Rock | v1 | 250 | — | new |
| Gliscor Hoenn | Water/Rock | v3 | 258 | #149 | iterated — wider V-fork caudal fin (±2px per lobe + row 59 tips), 12 fin-ray px on right wing (idx 10 aqua striation), 6 barnacle px (idx 3 dark) on body edges, fill 45.7%→47.0% |
| Lotad Hoenn | Electric/Grass | v2 | 258 | #131 | bulkified — 1px outline expansion (left/right/down), fill 19.7%→25.0% front, 37.2%→43.3% back |
| Shroomish Hoenn | Poison/Ice | v2 | 258 | #131 | bulkified — 1px outline expansion (left/right/down), fill 18.3%→23.1% front, 33.2%→39.1% back |
| Treecko Hoenn | Steel | v2 | 313 | — | palette restore — files had regressed to vanilla green (C312 check). Recolour only (indices untouched): body 1/4/5/3 blue-gray, belly 11/10/12 violet crystal, tail 13/14/15 deep steel-blue, eyes 6/8/9/7 amber. Shiny "frost-dawn": silver-white body, rose belly, rose-gold tail. PLTE synced front/back/anim (back carried shiny pal). Lint FAIL(1)→PASS. normal.pal: 00b0e8 485080 101010 e0e8f0 7080a8 a8b8d0 b06810 f8f8f8 f09820 f8d858 9880d8 584098 d0c0f0 202858 4058a0 78a0d8 |
| Grovyle Hoenn | Steel | v2 | 313 | — | palette restore — was vanilla green. Body 5/13/8/6/7 steel-blue, leaves+tail 1/3 violet with idx 2 bright cyan blade edges, belly 11/12/14 pale lilac, eyes 9/10 amber. Shiny: silver body, rose-gold leaves, rose belly. Jaggies front/f1 5→0 [(49,27) 4→0, (16,30) 4→5, (37,36) 4→8, (46,38) 4→2, (58,41) 4→0]; back PLTE synced. Lint FAIL(3)→PASS. normal.pal: c880d8 382878 70e0f0 8860c8 101010 283860 7090b8 b0c8e0 486090 d08010 f8d860 605890 a098d0 505878 d8d8f0 000000 |
| Sceptile Hoenn | Steel | v2 | 313 | — | palette restore — was vanilla green. Body 1/4/3/5/2 deep steel-blue, tail fan 14/12/13 indigo→cyan crystal, orbs 11/7/8 violet, throat/belt 9/10 amber. Eye shared orb idx 7/8, so 4 eye px per frame remapped 7→9, 8→10 (front, anim f1 (24-25,7-8), f2 (22-23,73-74), back (45,16-18),(46,19)) to keep eyes amber. Shiny: silver body, rose orbs, rose-gold tail. Back PLTE synced. Lint FAIL(1)→PASS. normal.pal: c0c0f8 283058 a8c0d8 5070a8 385080 7898c8 101010 9060d8 d0b0f8 c87010 f8b838 503088 4868b8 70c0e8 283078 000000 |
| Torchic Hoenn | Fairy | v2 | 312 | #201 | lint cleanup + palette restore — files had regressed to vanilla orange (C277 starlit pal lost, likely C308 re-fetch; halo accent pixels also gone). Rebuilt normal (violet-white body 5/7/6/8, gold crest 1-3 + beak/feet 11-13) and Dawn Bird shiny (gold body, indigo crest); PLTE synced on front/back/anim. Jaggies front/f1 3→0 [(33,19) 5→6 body rim, (29,48) c→d toe, (34,49) 4→b toe], f2 1→0 [(29,45) c→d]. Lint FAIL(1)→PASS |
| Combusken Hoenn | Fairy/Flying | v2 | 312 | #201 | lint cleanup + palette restore — was vanilla gold/orange. Normal: violet body 5-7, gold crest/thighs 4/1/3 + idx 8 (crest rim on back), lavender talons 13/10/14/12/11; shiny: amber body, indigo crest/thighs, warm-slate talons. back.png (8-bit) PLTE synced. Lint FAIL(4: strays 30→27, back PLTE, shiny 29%→91%)→PASS; jaggies 2 vs base 1 untouched |
| Blaziken Hoenn | Fairy/Flying | v2 | 312 | #201 | lint cleanup + palette restore — was red/khaki. Normal: pale gold body 9/1/5/6, deep violet plumes 4/3/7, starlight blue-white leg flames f/c/a, blue eyes kept, slate hands; shiny: indigo body, gold plumes, rose flames. Lint FAIL(2: back PLTE, shiny 22%→86%)→PASS; jaggies = base |
| Mudkip Hoenn | Water/Fighting | v2 | 311 | #201 | lint cleanup — back.png PLTE re-synced to normal.pal (was stale purple/orange set, 11 entries off; indices untouched). Lint FAIL(1)→PASS |
| Marshtomp Hoenn | Water/Fighting | v2 | 311 | #201 | lint cleanup — back.png PLTE re-synced (15 entries off); jaggies front/f1 2→0 [(35,48) c→4 belly rim, (34,52) 2→4 leg], f2 4→0 [(35,46),(34,50) same fixes, (35,25) 9→5 + (40,26) c→b mouth rim]. Lint FAIL(2)→PASS |
| Swampert Hoenn | Water/Fighting | v2 | 311 | #201 | lint cleanup — back.png PLTE re-synced (11 entries off). Lint FAIL(1)→PASS; f2 still 5 jaggies vs base 3 (within +2 gate) |
