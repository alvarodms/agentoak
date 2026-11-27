# v3.13 "Side by side, after" (spec C399, built C401)

Once the Space Center is won, one tile of Steven's rock display (MossdeepCity_StevensHouse, right wall 10,6, sign bg_event elevation 3, read facing right from 9,6) reads a new line. The other three display tiles (0,1, 1,1, 10,4) keep the vanilla "It's a collection of rare rocks and / stones assembled by STEVEN." Companionship register, Hours 13-14, between triumph and the Sootopolis dread. One box, no name, no fight, no reward, no explanation; no new flag, var, object, sound or movement.

## Game changes (C401)
- `data/maps/MossdeepCity_StevensHouse/scripts.inc`: new `MossdeepCity_StevensHouse_EventScript_RockDisplayNewest` directly after the untouched `RockDisplay` (`goto_if_unset FLAG_DEFEATED_MAGMA_SPACE_CENTER, ..._EventScript_RockDisplay` / `msgbox ..._Text_NewestSpaceHoldsTwo, MSGBOX_SIGN` / `end`); new `MossdeepCity_StevensHouse_Text_NewestSpaceHoldsTwo` "Rare rocks, one to a space.\nThe newest space holds two.$" (widest line 145px) after the untouched `Text_CollectionOfRareRocks`. Steven's text, OnTransition and the ON_FRAME DIVE scene are untouched.
- `data/maps/MossdeepCity_StevensHouse/map.json`: only the bg_event at 10,6 (e3) → `RockDisplayNewest`; 0,1, 1,1 and 10,4 stay `RockDisplay`.
- `scripts/beats.json` row `v313-side-by-side-after` (place, speaker none, gate flag FLAG_DEFEATED_MAGMA_SPACE_CENTER, tiles [[10,6,"right"]], labels [RockDisplayNewest], 4 playtests). seeFirst: "When DIVE ends, the right wall of Steven's rock shelf sits at the screen edge, a few steps from his desk." `scripts/lib/beats.cjs` MIN_ROWS 23 → 24. check_beats: "OK (24 rows ...)", "RM pending: v3.13 has 1 row", "SF OK (9 v3.4+ row(s) with seeFirst, no speech verbs)".

## Playtests (all pass first run, no tile swap needed; suite 159/159)
All boot MAP_MOSSDEEP_CITY_STEVENS_HOUSE with scenario flags/clearFlags/vars (no checkpoint), party SALAMENCE 70, VAR_STEVENS_HOUSE_STATE always explicit (state 1 fires the DIVE scene).
- `stevens-shelf-after-space-center`: 9,6, win flag set, Steven's hide flag cleared, state 2. Screenshot `stevens-shelf-after` (viewed: Steven at his desk 6,5, player beside the right wall), face right, talk, both lines, 1 box.
- `stevens-shelf-before-space-center`: 9,6, win flag cleared, hide flag set, state 0: "assembled by STEVEN", expectNoText "holds two".
- `stevens-shelf-other-space-after`: as the first but 9,4: 10,4 keeps "assembled by STEVEN", expectNoText "holds two".
- `stevens-shelf-after-seafloor`: 9,6, win flag + hide flag set, state 2: "The newest space holds two.", 1 box (permanence).

## Decisions
- **One tile only**, so "newest space" points somewhere and the other three tiles give contrast.
- **Permanent gate** (the win flag alone), so the line survives Seafloor and the postgame Beldum visit and warmth is never undone. A later cycle must NOT re-add the `FLAG_HIDE_MOSSDEEP_CITY_STEVENS_HOUSE_STEVEN` AND (the C399 spec had it; C401 dropped it).
- **No SF lint exemption**: an honest seeFirst exists (the shelf is on screen when DIVE ends).
- **"Two" is never explained** by anyone, including creative 391b.
- **First-read rationale**: "one to a space" sets the rule, "two" breaks it.
- **Accepted lower read rate**: pre-win visitors learn the shelf is set dressing; the permanent gate gives a postgame second chance.
- Miss condition: the player leaves without facing 10,6.

## Index row
C401: pokeemerald/data/maps/MossdeepCity_StevensHouse/scripts.inc, pokeemerald/data/maps/MossdeepCity_StevensHouse/map.json, pokeemerald/scripts/beats.json, pokeemerald/scripts/lib/beats.cjs, playtests stevens-shelf-after-space-center / stevens-shelf-before-space-center / stevens-shelf-other-space-after / stevens-shelf-after-seafloor (new). No harness edit.
- **C401 verdict**: reflection CLOSED v3.13 as built (all machine checks PASS; read rate is human-only).
