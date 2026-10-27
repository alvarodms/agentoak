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
| Treecko Hoenn | Steel | v1 | 276 | — | new — crystal gecko, cool blue-gray body, amber eyes, crystal gleam + emanation accents — ⚠ C312 check: files are vanilla green again (C277-style regression); needs a palette restore like the Torchic line v2 |
| Grovyle Hoenn | Steel | v1 | 276 | — | new — crystal runner, steel-blue body, violet crystal accents, bright cyan blade edges — ⚠ C312 check: files are vanilla green again (C277-style regression); needs a palette restore like the Torchic line v2 |
| Sceptile Hoenn | Steel | v1 | 276 | — | new — crystal guardian, deep steel-blue body, violet crystal orbs, amber eyes — ⚠ C312 check: files are vanilla green again (C277-style regression); needs a palette restore like the Torchic line v2 |
| Torchic Hoenn | Fairy | v2 | 312 | #201 | lint cleanup + palette restore — files had regressed to vanilla orange (C277 starlit pal lost, likely C308 re-fetch; halo accent pixels also gone). Rebuilt normal (violet-white body 5/7/6/8, gold crest 1-3 + beak/feet 11-13) and Dawn Bird shiny (gold body, indigo crest); PLTE synced on front/back/anim. Jaggies front/f1 3→0 [(33,19) 5→6 body rim, (29,48) c→d toe, (34,49) 4→b toe], f2 1→0 [(29,45) c→d]. Lint FAIL(1)→PASS |
| Combusken Hoenn | Fairy/Flying | v2 | 312 | #201 | lint cleanup + palette restore — was vanilla gold/orange. Normal: violet body 5-7, gold crest/thighs 4/1/3 + idx 8 (crest rim on back), lavender talons 13/10/14/12/11; shiny: amber body, indigo crest/thighs, warm-slate talons. back.png (8-bit) PLTE synced. Lint FAIL(4: strays 30→27, back PLTE, shiny 29%→91%)→PASS; jaggies 2 vs base 1 untouched |
| Blaziken Hoenn | Fairy/Flying | v2 | 312 | #201 | lint cleanup + palette restore — was red/khaki. Normal: pale gold body 9/1/5/6, deep violet plumes 4/3/7, starlight blue-white leg flames f/c/a, blue eyes kept, slate hands; shiny: indigo body, gold plumes, rose flames. Lint FAIL(2: back PLTE, shiny 22%→86%)→PASS; jaggies = base |
| Mudkip Hoenn | Water/Fighting | v2 | 311 | #201 | lint cleanup — back.png PLTE re-synced to normal.pal (was stale purple/orange set, 11 entries off; indices untouched). Lint FAIL(1)→PASS |
| Marshtomp Hoenn | Water/Fighting | v2 | 311 | #201 | lint cleanup — back.png PLTE re-synced (15 entries off); jaggies front/f1 2→0 [(35,48) c→4 belly rim, (34,52) 2→4 leg], f2 4→0 [(35,46),(34,50) same fixes, (35,25) 9→5 + (40,26) c→b mouth rim]. Lint FAIL(2)→PASS |
| Swampert Hoenn | Water/Fighting | v2 | 311 | #201 | lint cleanup — back.png PLTE re-synced (11 entries off). Lint FAIL(1)→PASS; f2 still 5 jaggies vs base 3 (within +2 gate) |
