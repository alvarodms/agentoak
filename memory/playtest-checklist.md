# Legends of Hoenn — v3.0 "Red Ink" Playtest Route (C332)

*Birch wrote it down wrong. Go prove it, and see who notices.*

**SPOILERS.** If you came from the recruit post, play first and answer its five questions before reading on.

Nothing below has been played on an emulator yet. Follow it in order: one new game covers Part 1, then a Challenge Mode save covers Part 2, and a cleared save covers Part 3. When you report, give the build (the commit hash on the Releases page), the step number, what you saw, and a severity: A = crash, freeze or garbled text; B = something behaves wrong; C = looks or reads off.

## Quick start: the den-tour ROM (C339)
**First 30 seconds:** You start in LILYCOVE's POKéMON CENTER; the dens are MT. PYRE (ROUTE 122), SHOAL CAVE (MOSSDEEP → ROUTE 125, low tide), METEOR FALLS (FALLARBOR → ROUTE 114).
Build with `make playtest` (from pokeemerald/) to get `pokeemerald_playtest.gba`. It keeps its own save file. Start a NEW GAME: after Birch's intro you wake up in LILYCOVE's Pokémon Center with all 8 badges, FIELD NOTES pages 1-4 already inked (the four Hoennian Pokémon wait in the PC), a Lv41-42 team that knows FLY, SURF, STRENGTH, ROCK SMASH and WATERFALL, and every den still untouched. Call PROF. BIRCH on the PokéNav first, then follow the chapter in its intended order: Mt. Pyre (Route 122), Shoal Cave (fly to MOSSDEEP, Route 125, low tide), Meteor Falls (fly to FALLARBOR, Route 114). Story events outside these routes are not set up; anything odd away from them is probably the shortcut, not the hack. Tell us the first moment something surprised you.

**Lilycove doubt (C340), do this first.** From the Lilycove PC (door 24,14) walk south-east to the beach; talk to the old woman at 34,37 (she keeps facing the sea). Expect 3 boxes, the Wingull cry, the page SE and "wrote a line". Open FIELD NOTES p.3: 4 boxes, the last red, unsigned, ending "…?". Talk to her again: one box, "Still gliding, out there." Question for testers: did the "…?" make you want to go check, or did you skim it?

## Quick start: the coda ROM (C343)
**First 30 seconds:** You start in PETALBURG's POKéMON CENTER; walk west to ROUTE 104 to see the lesson, FLY to LILYCOVE to write the '…?', FLY back. Then do Quick start, part 2.
Build with `make playtest_coda` (from pokeemerald/) to get `pokeemerald_playtest_coda.gba`. It keeps its own save file. Start a NEW GAME: after Birch's intro you wake up in PETALBURG's Pokémon Center on a cleared save (the credits have already rolled), with all 8 badges, FIELD NOTES pages 1-4 inked (the four Hoennian Pokémon wait in the PC) and a Lv54-55 team that knows FLY and SURF. You have NOT written the Lilycove doubt yet. You can also FLY to DEWFORD, MAUVILLE, FALLARBOR and FORTREE. Story events away from Petalburg, Route 104, Lilycove and Routes 106, 113 and 119 are not set up.
1. Walk out of the Pokémon Center and west onto Route 104. Find the schoolkid on the shore (33,49) and the little girl just south of him. Talk to him, then to her. Expect the class with your LOTAD page only (no GLIGAR lines).
2. Fly to LILYCOVE. Talk to the old woman on the beach south-east of the Pokémon Center (34,37), then open FIELD NOTES page 3: its last line is your own red, unsigned "…?".
3. Fly back to PETALBURG and walk onto Route 104 again. Talk to the schoolkid. Expect the class plus page 3: a "?" over the girl, then "I said never. It's in red."
Question for testers: on the second visit, did the lesson feel like a reward or a warning? Did you want to correct him?

### Known first impression, coda ROM (C355, static read, not emulator-verified)
After Birch's intro, the screen fades in from black with the player on PETALBURG's Pokémon Center exit mat (warp 0, 7,8, MB_SOUTH_ARROW_WARP) facing north toward the nurse, with no step, no map-name popup and no automatic text box: the map has no ON_FRAME script, and EventScript_PlaytestCoda runs silently before the fade (no "playtest" text anywhere). The intro itself is the hack's full-game speech, unchanged for this ROM: it pitches the Migration and ends "Come to my lab when you're ready.", then drops the player on a cleared save in Petalburg with no line explaining the jump, which a tester may read as a missing intro step. The first non-vanilla box they can reach in the room is the C214 difficulty man (3,6, faces down); on this save Challenge Mode is off, so he says "Challenge Mode? I hear some TRAINERS push themselves that way." / "Not for me, though. I prefer a steady pace."

## Quick start, part 2: three people who believed you (v3.1, C351; coda ROM)
*Do this after coda steps 1-3, on the same save. Don't read past the Open pass until you've done it.*

**Open pass (15 minutes, no spoilers).** Your coda save can also FLY to DEWFORD, MAUVILLE, FALLARBOR and FORTREE. Spend 15 minutes wandering the routes around them however you like. Write down anything that seems different from a normal Emerald postgame, and anyone who seems to be acting on something they read. Before you scroll on, answer:
- What changed, and where?
- Was there anywhere you expected someone and found no one?

**Directed pass.** Now visit these three places in this order. At each one, write down what you saw *before* you talked to anyone, answer the question, and only then open the Verify block. Shortcut note: this ROM puts the four Hoennian Pokémon in your PC, which counts as catching them. On a normal save, each person appears only after the credits AND after you've caught that page's Pokémon yourself.

44. **FLY to DEWFORD and walk onto ROUTE 106, along the beach toward GRANITE CAVE.** Question: did you stop before the cave door? What did you think he was waiting for?
<details><summary>Verify step 44 (Beat A, C348)</summary>

A HIKER stands on the sand at 54,15, one row above the path to the cave door, back to the land, facing the sea (up). Talk to him. He does NOT turn toward you. One box: "It's in red. They swim better than they glide. They'll come." On this ROM the first talk also gives a HARD STONE (you never met him in the cave); talk again: same box, no item. Then enter GRANITE CAVE and go to B1F: his old spot by the B2F ladder (26,20) is empty. No GLIGAR ever appears on Route 106. He only appears once you're on Route 106 itself; you can't see him from DEWFORD TOWN, and the game only loads him after a few steps onto the sand heading west. Both changes happen as a map loads: on a normal save, catching GLIGAR on B2F empties B1F the moment you climb back up, and the beach shows him the next time you walk onto Route 106. On a save before the credits, or without GLIGAR caught, there's no one on the beach and he's still on B1F (step 7). Sightline (C354): walking west from DEWFORD to the cave door, he should come into view with his back turned before you reach the cave mouth; you pass right beneath him. Talking to him from 54,14 puts you in ELLIOT's line of sight; if ELLIOT is unbeaten, that battle comes first (vanilla).
</details>

45. **FLY to MAUVILLE, go east along ROUTE 118 (SURF across the water) and north into ROUTE 119.** Question: did the storm feel like hers?
<details><summary>Verify step 45 (Beat B, C349)</summary>

A PARASOL LADY (TESSA) stands at 20,110 facing west (left). Note whether it was already raining at her spot before you talked (Badge 6 brings storms to Route 119 on entry, but the route's weather can change as you walk). Talk: she faces you, "Its leaf drinks the storm. It's in red. Watch this!", turns to face up, and the thunderstorm (rain and flashes) should be visible for about a second and a half before she faces you again with "In the rain, my THUNDER never misses!" The battle starts with no intro: Hoennian LOTAD Lv55, LOMBRE Lv57, LUDICOLO Lv59. Check: rain is up in battle; LOMBRE uses FAKE OUT on its first turn in; THUNDER never shows "missed" while the rain lasts. After you win: "Next storm, wherever it's written. I'll be there.", she turns up. Talk again: that box only, no battle. Leave and come back: she faces up.
</details>

46. **FLY to FALLARBOR and walk east into ROUTE 113's falling ash.** Question, after the battle only: how did ELLIS's fight feel?
<details><summary>Verify step 46 (Beat C, C350)</summary>

A CAMPER (ELLIS) stands at 38,5 facing down at the picnicker (38,6, facing up at him). The ash keeps falling grey. Talk to her first: "He brought his VULPIX up here to train in the ash! Go on! Battle him!", and she turns back to him. Talk to him: he faces you, "Cold fur in the falling ash. It's in red. We train here!", "If it hails, my foxes won't even feel it!", then a battle with no intro: Hoennian VULPIX Lv54, NINETALES Lv56. After you win: "Same time tomorrow, right here in the ash!", and both turn to face right (east), side by side. Talk to him again: that box only, no battle. Talk to her: "Cold fur in the ash, every day. And I get to watch!" Leave and come back: both still face right. **Record: did your battle hail at any point?** Either answer is valid; he may never call it. On a save before the credits, or without VULPIX caught, she stands alone (step 10). On a normal save, if you catch VULPIX on Route 113 itself, ELLIS isn't there yet: he appears only after you leave the route and come back.
</details>

**v3.1 feel questions** (a sentence each):
- Which of the three would you show a friend? Why?
- Did any of them seem to be standing there for no reason?
- What happened with the weather in TESSA's battle, and in ELLIS's?
- Did you find any of the three during the Open pass, before this list named the route?

---
## Five things we most need eyes on
If you only have twenty minutes, test these. The full route below is for anyone who wants to go further.

1. **Steven's chalk on the wall (Meteor Falls).** Catch the crystal Treecko in the back room of B1F, then walk out into the next chamber. Did you notice anything in the chalk dust? Did you go back into the room on your own? Is there an answer under Steven's old note now? (The answer appears when you walk back in through the entrance. Saving and reloading inside the room won't make it appear, and that's expected.)
2. **Page 7's margin.** Copy Steven's answer, then open FIELD NOTES to page 7. Can you read the lines under "Copied from the cave wall" without squinting? Do they look like a different hand from your red ink?
3. **Birch's longest call.** With most pages inked, call PROF. BIRCH on the PokéNav. Does every text box end cleanly, with no cut-off or garbled words? Does "Word came from the dens too." get its own box, or is it squeezed onto the end of the names?
4. **Right after the den catch.** At Mt. Pyre's summit and Shoal Cave's tide pool, watch ISOLDE and MARLOW the moment the battle ends, before you talk to anyone. What did they do? "Nothing" is a useful report.
5. **Your own doubt (Lilycove beach).** Talk to the old woman looking out to sea on the beach south-east of the Pokémon Center, then open FIELD NOTES to page 3. Did the last line, ending in "…?", make you want to go and check, or did you skim past it?

For every person who reacts to your red ink (pages 1-7), there's one more question: **did you notice the change (someone moved, turned, or stood somewhere new) before anyone explained it?**

Report with the build (commit hash), the item number above or the step number below, what you saw, and a severity: A = crash, freeze or garbled text; B = something behaves wrong; C = looks or reads off.

---

## Part 1 — New game, hours 0-4 (Normal or Challenge)

1. **Where:** Birch's lab, after the Route 103 rival battle. **Do:** receive the Pokédex. **Expect:** Birch also hands you FIELD NOTES before the difficulty prompt. In the prompt, Challenge shows two extra boxes about the BAG before "It's how I'd do it, honestly.", and the YES/NO choice appears on the last box.
2. **Where:** anywhere. **Do:** open BAG > KEY ITEMS > FIELD NOTES, then register it and press SELECT. **Expect:** the cover reads "0 of 4"; four pages of Birch's notes; no extra pages yet.
3. **Where:** Route 102 grass. **Do:** catch a Hoennian LOTAD (about 1 in 5, Lv3-4), then reread FIELD NOTES. **Expect:** page 1 adds a red correction signed with your name, then a red "Since then:" margin note; the cover reads "1 of 4". Red text should be clearly red, not grey.
4. **Where:** Route 104 shore between Petalburg and the woods, the schoolkid. **Do:** talk to him. **Expect:** before you've caught that LOTAD, he faces the sea and repeats Birch's note. After the catch, he says his new lines and then turns east (toward Petalburg) on the spot (C334); after you re-enter the route he still faces east.
4b. **(Postgame, C342 Red Ink coda; do this in Part 3.) Where:** Route 104, the schoolkid, on a save after game clear with the Hoennian LOTAD caught. **Do:** re-enter Route 104, talk to him, then talk to the little girl. **Expect:** a little girl stands just south of him (33,50) facing the sea (west), and he faces down at her. Talking to him gives the lesson: "Shh! Class is in session.", your LOTAD page recited as fact, "Red ink means it's true." If you wrote the Lilycove doubt (FLAG_LILYCOVE_GLIGAR_DOUBT, step 5 of the top list), he adds page 3 ("GLIGAR: Water and Rock…"), a "?" pops over the girl, and he says "I said never. It's in red." Either way he then turns back to her. Talking to the girl: "My teacher says LOTAD love storms…", and she turns back to the sea. Before game clear, or without the LOTAD, nothing changes (no girl; step 4 behaviour). Catching the LOTAD postgame without leaving the route gives the old step-4 lines until you re-enter. **Fastest route: the coda ROM (`make playtest_coda`, quick start above).** The den-tour ROM cannot reach it (its preset never sets GAME_CLEAR). (README Part 3 step 23.)
5. **Where:** Petalburg Woods, the old woman forager. **Do:** talk; catch a Hoennian SHROOMISH in the woods (about 1 in 10, Lv6-7); talk again without leaving. **Expect:** before: her belief, then a line about a boy reading Birch's notes (it changes if you have the LOTAD). After: she grieves, then turns to face north. Leave and come back: she now stands beside the bug catcher in the cold patch, facing north.
6. **Where:** Pokénav, call Birch (1-2 pages inked). **Expect:** the Pokédex rating only; no red ink report yet.
7. **Where:** Granite Cave B1F hiker. **Do:** talk; catch a Hoennian GLIGAR on B2F (about 1 in 10, Lv10-13); come back up and talk. **Expect:** before: he faces away and doesn't turn. After: he turns away and back mid-talk and gives a HARD STONE once; the next time you enter B1F he faces south.
8. **Where:** anywhere, with 3 pages inked. **Do:** open FIELD NOTES. **Expect:** the cover reads "FIELD NOTES of PROF. BIRCH" with "and <your name>" in red, then "Pages in your ink: 3 of 4"; each inked page shows its red margin note.
9. **Where:** Pokénav, then Birch in person. **Do:** ask for a Pokédex rating both ways. **Expect:** after the rating, Birch reads your red ink: an opening, one box for each person your catches reached, then a closing. Every box is clean, with no stray symbols and no freeze at the end. In person it comes right after any den hint.
10. **Where:** Route 113 picnicker by the big rock. **Do:** talk; catch a Hoennian VULPIX in the ash grass (about 1 in 10, Lv21-22); talk again. **Expect:** before: she turns back to the rock after talking. After: a "!" and she looks up. The next time you enter the route she stands two steps north in the ash grass, facing up, without blocking the path.
11. **Where:** Pokénav, all four pages inked. **Do:** call Birch. **Expect:** the report names all four people and ends cleanly. This is the longest call in the game; report any text that is cut off.

## Part 2 — Badges 3-8 (a Challenge Mode save)

12. **Where:** any trainer battle. **Do:** choose BAG. **Expect:** "CHALLENGE: your BAG stays shut! / Fight with what you brought.", then back to FIGHT/BAG/POKéMON/RUN with no turn lost. In wild battles the BAG opens and Poké Balls work. In Normal Mode the BAG always opens.
13. **Where:** Lavaridge Gym, Flannery. **Expect:** she never uses Hyper Potions in Challenge. Does her sun team feel much harder than Norman's?
14. **Where:** Mt. Pyre summit fog, Meteor Falls B1F (crystal Treecko), Shoal Cave low tide (Mudkip). **Do:** knock out or run from each den Pokémon, then catch it. **Expect:** it returns after a KO or run and leaves for good once caught. With badges 5/6/8, FIELD NOTES pages 5/6/7 open and each catch inks its page. Page 5's margin appears only after step 25, page 6's only after step 33, page 7's only after step 39. Birch's Pokénav hint names the nearest unfound den. On a save from before v2.9, a Mt. Pyre Torchic knocked out back then may stay gone.
15. **Where:** Sootopolis Gym. **Expect:** Wallace is the Gym Leader and Juan stands beside him.
16. **Where:** the Champion's room, Steven. **Expect:** Fey Flame and Undertow announce themselves when his last Pokémon switch in. He never uses Full Restore in Challenge, but held berries and Leftovers still work.

## Den believers — Mt. Pyre (C334, pending; do these after step 14, before Part 3)

23. **Where:** Mt. Pyre summit, the Hex Maniac ISOLDE two steps west of the summit path (17,12). **Do:** talk to her BEFORE catching the starlight Torchic. **Expect:** she turns to you, speaks of "lights in the summit fog" that are "not for notebooks", and won't battle. She never blocks the path up to the summit.
24. **Do:** catch the starlight Torchic, then talk to her. **Expect:** right after the catch, before any text, she turns to face where the light stood. Then talking gives her soul-light/grandmother speech, then "Will you show me how you carry it?" YES/NO. NO gives "Then carry it quietly…"; talking again asks again.
25. **Do:** answer YES and battle (Dusclops 38, Chimecho 39, Banette 40; Hex Maniac music). Try switching the Torchic in when Banette goes for Will-O-Wisp. **Expect:** "It doesn't affect TORCHIC…". Banette never picks Will-O-Wisp while the Torchic is already out. After you win: her goodbye lines (pink starlight vs. an orange hearth), then she turns to face north on the spot.
26. **Do:** lose to her on purpose (separate save). **Expect:** whiteout; when you come back she offers the battle again.
27. **Do:** leave the summit area and come back. **Expect:** she stands one tile north in the little alcove (17,11), facing the graves. Talking gives "…I'm talking to her now…" and she does NOT turn around.
28. **Do:** open FIELD NOTES page 5 before and after beating her; then get a red ink report from Birch (3+ pages inked). **Expect:** page 5's red "Since then: a mourner on MT. PYRE…" margin appears only after the win. Birch's report adds "Word came from the dens too." If none of pages 1-4's people are named, it ends without "No one else ever read my den pages".
29. **Where:** Mt. Pyre exterior, the woman near the graves (coral mourner). **Expect:** her last box mentions "That woman by the graves" who has watched the fog for weeks.

## Den believers — Shoal Cave (C335; do these after step 14, before Part 3)

30. **Where:** Shoal Cave low tide, lower room, the sailor in the little pocket west of the tide pool (17,6). **Do:** talk to him BEFORE catching the titan Mudkip. **Expect:** he turns to you; "Forty years at sea…", the pool's "child of the sea… Big as a SWAMPERT", "It belongs to the sea. Not to some PROFESSOR's notebook." No trade offer. The Mudkip doll (18,6) can still be reached from 18,5 or 19,6.
31. **Do:** read the tide pool sign (from 19,7) before the catch, after the catch, and after step 33. **Expect:** three different texts: "It stirs below the surface…", then "Its water lies flat and still now.", then "A whiskered fish circles the salt water."
32. **Do:** catch the titan Mudkip, talk to him, answer NO; talk again, answer YES and press B in the party menu; talk again, answer YES and pick anything that is not a BARBOACH (also try an EGG). **Expect:** right after the catch he looks at you with a "?" and turns back to the pool. Then the offer names BARBOACH and CORSOLA and ends "Deal?" with YES/NO. NO and B both give "Then the ledger stays open… Whiskers swim the fresh water past FORTREE." A wrong Pokémon or an EGG gives "That's no BARBOACH." and then the same ledger text. No trade happens.
33. **Do:** fish a BARBOACH (Route 111/114/120 or Meteor Falls, Good Rod), come back, trade it. **Expect:** the normal trade scene. TIDEMARK arrives: a Hoennian CORSOLA (Ghost/Rock), female, Adamant, holding a SHOAL SHELL, OT MARLOW, at your BARBOACH's level. The Name Rater refuses to rename it. After the scene the sailor turns right to the pool, a splash plays, then "There. A river fish for the sea…" ending "Maybe nothing belongs to one water. I'll keep the pool."
34. **Do:** leave the room and come back (low tide). **Expect:** he stands on 18,6 (where the Mudkip was) facing down at the pool. Talking gives "Fresh or salt, the tide doesn't care…" then the shell-bell line, and he does NOT turn around.
35. **Do:** open FIELD NOTES page 6 before and after the trade; get a red ink report from Birch (3+ pages inked). **Expect:** page 6's red "Since then: a sailor keeps the tide pool for the sea." margin appears only after the trade. Birch's report has "Word came from the dens too." once page 5 or page 6 has its margin.

## Den believers -- Meteor Falls (C336; read step 36 before step 14's Treecko catch, the rest after it, before Part 3)

36. **Where:** Meteor Falls B1F (the back room with the crystal Treecko doll at 7,4). **Do:** BEFORE catching the Treecko, stand on 7,3 facing right and read the chalked wall (8,3). **Expect:** only the old note: "Not mine to collect. Some things should be found. - S."
37. **Do:** catch the crystal Treecko, then read the wall again in the same visit. **Expect:** the caught text ends "The chalk on the wall above seems to catch the light." The wall shows the old note and then "A stub of fresh chalk sits on the ledge below the words. Someone means to come back." No new lines yet.
38. **Do:** step out to the neighbouring B1F room and read the grooved meteorite stone (19,5). **Expect:** "Fresh chalk dust lies on it. Neat footprints lead back toward the inner chamber." (not the old "too clean for claws" text).
39. **Do:** walk out and back into the Treecko room (a warp in counts; saving and continuing inside the room does not) and read the wall. **Expect:** the answer: "Under the old chalk, a new line in the same neat hand:", "Found, then. Good.", "You were right. It needs no sun down here.", "But its kind still whet their leaves on forest bark.", "This one came for the meteor. The forest still remembers.", "- S.", then a page-turn sound and "You copy it down. Chalk dust greys the page under your ink." Read it again: the answer only, no sound, no copy line.
40. **Do:** open FIELD NOTES page 7, then re-read the grooved stone, then get a red ink report from Birch (3+ pages inked). **Expect:** page 7 shows the old text (dark), the red ink, then a blue box "Copied from the cave wall: Its kind still whet leaves on forest bark. This one came for the meteor. - S." **LEGIBILITY CHECK (C337):** the C336 grey was replaced by `{COLOR BLUE}{SHADOW LIGHT_BLUE}` after a palette check (gFieldNotesText_TreeckoMargin, pokedex_rating.inc). If the blue is hard to read or looks like the red ink, the last resort is the default colour, keeping "- S.". The grooved stone is back to its old text. Birch's report has "Word came from the dens too."
41. **Do:** on a v2.9 save without FIELD NOTES, catch the Treecko, leave, come back and read the wall. **Expect:** the answer reads, but no page-turn sound and no copy line; once you hold FIELD NOTES, re-reading the wall (after a fresh map load) copies it, and only then does page 7 get its blue box.
- check_flag_pairs (C336) found no genuine orphans (ALLOWLIST empty), so there are no orphan-flag checks to add.

## Birch at his bookshelf (C345; a normal save, between steps 8 and 9)
42. **Where:** Birch's lab, with 3+ FIELD NOTES pages inked. **Do:** walk in; don't talk yet. **Expect:** Birch stands on his usual spot facing AWAY from you (north, toward the back shelves). With 0-2 pages he faces you as before.
43. **Do:** talk to him. **Expect:** he turns to you before any text, then "You caught me copying… It seemed only fair." and the usual Pokédex rating question. If you have talked to the Lilycove old woman (page 3 ends "…?"), one more box: "I copied your question mark as well…". The PokéNav call never says either line. After the conversation he keeps facing you (vanilla: a talked-to NPC keeps the player's direction until the map reloads). Leave and re-enter: facing away again. Not during the National Dex / Johto starter scenes (VAR_DEX_UPGRADE_JOHTO_STARTER_STATE 1, 2, 4, 5): there he faces you and says neither line.

## Part 3 — Postgame (a cleared save)

17. **Where:** Mt. Chimney, at the meteorite machine. **Do:** talk to Maxie, answer YES. **Expect:** one battle (Camerupt ace); afterwards he only speaks.
18. **Where:** Route 128. **Do:** talk to Archie, answer YES. **Expect:** one rain battle (Sharpedo ace); afterwards he only speaks.
19. **Where:** Sootopolis Gym, Juan. **Do:** answer YES. **Expect:** a Double Battle once, then Mystic Water (offered again if your BAG was full), then Wallace speaks. His second pair may come out mixed with the first; that's normal.
20. **Where:** Meteor Falls, Steven. **Expect:** he turns from the wall, battles once, then leaves for good; his chalk note appears only after.
21. **Where:** Birch's lab (National Dex). **Expect:** the Changed Three gift mentions the dens in Field Notes order and reacts to the ones you've found.
22. **Where:** FIELD NOTES with all 7 pages inked. **Expect:** a final page appears.
22b. **Where:** Route 104 shore. **Do:** step 4b (the schoolkid's class).
22c. **(Optional, C344, any save.) Where:** Fortree House 3 (east treehouse with the MANIAC and schoolkid). **Do:** talk to the kid with 0, 1-3 and 4+ pages inked. **Expect:** 0 = the vanilla POKéDEX lines plus "Mine's going to have wings!"; 1-3 = his crayon wall (a WAILORD in a cloud, a TORCHIC that's really a star); 4+ = more drawings (spoon SKARMORY, dizzy SPINDA) and "So I only draw the NOT true stuff." Both playtest ROMs start at 4 pages, so they show only the last tier. Funnel question: did the crayon wall feel like a break, or like another quiz?

## Feel questions (answer in a sentence each)

- Did you open FIELD NOTES before this list told you to? When?
- When your name appeared on the cover in red, did you notice without being told?
- Did Birch's report sound like Birch being humbled, or like a list of things you did? Did it wear thin by the second or third rating?
- Did you meet the Route 104 schoolkid before or after catching your Hoennian LOTAD? Did you ever see him facing the sea?
- Did any of the four believers seem to do nothing after your catch?
- Did Isolde's battle feel like a test of your Torchic, or just another trainer? Did her goodbye land?
- Did the sailor's trade feel like a bargain or a chore? Did you already have a BARBOACH?
- Did you go back to the Meteor Falls wall on your own, or only because this list said so? Did Steven correcting you feel fair?
- In Challenge Mode, was the Champion a wall without your BAG?
- When the Route 104 kid taught your page as fact, did you feel proud, uneasy, or nothing? Did you reopen your FIELD NOTES?
- Did you find the Lilycove old woman's GLIGAR line on your own, before this list pointed you to her?
- Which single moment would you screenshot?
- Did any NPC text look like a typo, or did it read like that character's own voice?
- Did you notice Birch had his back to you before he spoke? Did his copying line wear thin on later visits?
- If you wrote the Lilycove '…?', did Birch keeping your question mark feel reassuring or unsettling?
- Normal-play only: how many FIELD NOTES pages were in your ink when you got Badge 5?

README synced C343 (coda shortcut + 3 feel questions) and C351 Reflection (coda part 2 = steps 44-46 condensed, open pass, rate fixes 3/5/7/10, 1 merged v3.1 feel question). Edit this file first, then mirror.

## Den chapter state walk (static, C337)

Built from the scripts, not from play: MtPyre_Exterior, ShoalCave_LowTideLowerRoom, MeteorFalls_B1F_2R + B1F_1R scripts.inc/map.json, src/match_call.c (IsFieldNotesPageOpen / IsFieldNotesPageInked / IsFieldNotesMarginEarned / WriteBirchRedInkReport / BufferFieldNotesPage), asm/macros/event_macros.inc (StaticDen trio). Engine facts used: ON_TRANSITION runs on warp/connection map loads, NOT on Continue (CB2_ContinueSavedGame → InitMapFromSavedGame runs ON_LOAD, then ON_RESUME); temp flags 0x00-0x1F are cleared by ClearTempFieldEventData on warp only and are restored from the save on Continue; returning from a battle runs ON_RESUME only and keeps object positions/facings.

Shared rules: a page opens on its badge (5/6/8) OR its den catch; ink = den CAUGHT flag; the margin box shows only when inked AND IsFieldNotesMarginEarned; Birch's "Word came from the dens too." needs one den page inked AND earned, and the whole report needs 3+ inked pages (FIELD_NOTES_REPORT_MIN_PAGES). Den pages never name anyone in the report (birchText NULL). Without the 4 P1-P4 names, the report goes Open → Dens → Close (no Believed, no OnlyYou).

### Mt. Pyre / Torchic / ISOLDE (page 5)
Objects: starlight Torchic doll 22,13 (FLAG_TEMP_11); ISOLDE LOCALID_MT_PYRE_EXTERIOR_MOURNER 17,12 FACE_DOWN, TRAINER_TYPE_NONE (no sight battle).

| State | Flags/temp flags true | What is on screen | Text label shown | What visibly changed vs previous | Page 5 shows | Birch report line? |
|---|---|---|---|---|---|---|
| P0 first visit, nothing done | — | doll 22,13; ISOLDE 17,12 facing down | ISOLDE: `_Text_MournerSilent` (faceplayer); doll: `_Text_StarlightTorchicApproach` | — | hidden unless BADGE05; if open: old text only | no |
| P1 Torchic KO'd / ran | FLAG_TEMP_11 (removeobject) | doll gone; ISOLDE unchanged | `_Text_StarlightTorchicFaded`; ISOLDE still Silent | doll vanishes | unchanged | no |
| P2 re-enter after P1 | TEMP_11 cleared by the warp | doll back at 22,13 | Approach | doll returns | unchanged | no |
| P3 Torchic caught (same visit) | CAUGHT_MT_PYRE_STARLIGHT_TORCHIC, TEMP_11 (ON_RESUME TryRemove) | doll gone; after the caught text ISOLDE turns right (toward 22,13) and steps in place (C338 on_caught `_EventScript_MournerSeesLightGone`, no text) | caught text; ISOLDE: `_Text_MournerChallenge` + `_Text_MournerAsk` YES/NO | doll gone; ISOLDE turns to where the light stood. Re-entry before beating her: 17,12 FACE_RIGHT (OnTransition `_MournerWatchesFog`; the beaten state P8 overrides it) | opens even without badge 5; old + red ink; no margin | Dens: no (margin not earned) |
| P4 answer NO | same as P3 | same | `_Text_MournerDecline` | none | same | no |
| P5 lose to her | same as P3 (trainer flag 0x745 unset) | whiteout; on return ISOLDE 17,12 | Challenge + Ask again | none | same | no |
| P6 beat her (same visit) | + trainer flag 0x745 | ISOLDE turns up on the spot at 17,12 (`Common_Movement_FaceUp`) | `_Text_MournerDefeat`, `_Text_MournerAfter`; talk again: `_Text_MournerDone`, no faceplayer | she faces the graves | ink + red margin `gFieldNotesText_TorchicMargin` | yes |
| P7 save + Continue on the exterior after P6 | same | ISOLDE still 17,12 facing up (saved object; no ON_TRANSITION) | Done | none | same | yes |
| P8 re-enter the map | same; TEMP_11 set by StaticDenTransition | ISOLDE at the 17,11 alcove, FACE_UP; no doll | Done | one tile north, facing graves | same | yes |

Ordering (a): beating ISOLDE before the catch is impossible (Silent, no battle, no sight). Ordering (c): page 5 read at P3-P5 = ink only; at P6+ = ink + margin.

### Shoal Cave / Mudkip / sailor MARLOW (page 6)
Objects: titan Mudkip doll 18,6 (FLAG_TEMP_12); sailor LOCALID_SHOAL_CAVE_LOWER_SAILOR 17,6 FACE_RIGHT (facing the doll); tide pool sign 18,7.

| State | Flags/temp flags true | What is on screen | Text label shown | What visibly changed vs previous | Page 6 shows | Birch report line? |
|---|---|---|---|---|---|---|
| S0 first visit (low tide) | — | doll 18,6; sailor 17,6 facing right | sailor: `_Text_SailorWarn` (faceplayer); pool: `_Text_TidePool` ("stirs") | — | hidden unless BADGE06; if open: old text | no |
| S1 Mudkip KO'd / ran | FLAG_TEMP_12 | doll gone until re-entry | `_Text_TitanMudkipFaded`; sailor Warn; pool still "stirs" | doll vanishes | unchanged | no |
| S2 Mudkip caught (same visit) | CAUGHT_SHOAL_CAVE_TITAN_MUDKIP, TEMP_12 | doll gone; after the caught text MARLOW turns to the player with "?", then back right to the pool (C338 on_caught `_EventScript_SailorWeighsCatch`); re-entry: 17,6 FACE_RIGHT (map default, unchanged) | caught text; sailor `_Text_SailorOffer` YES/NO; pool `_Text_TidePoolStill` | doll gone; MARLOW sizes up the catcher; pool text changes | ink, no margin | no |
| S3 NO / B / wrong mon / egg | same as S2 | same | `_Text_SailorDecline` (wrong mon: `_Text_SailorWrongMon` then Decline) | none | same | no |
| S4 trade done (same visit) | + FLAG_DEN_SHOAL_TRADE_DONE | sailor turns right to the empty 18,6, splash | `_Text_SailorTraded`; talk again: `_Text_SailorDone`, no faceplayer; pool `_Text_TidePoolFish` | he faces the pool; pool text changes | ink + red margin `gFieldNotesText_MudkipMargin` | yes |
| S5 save + Continue in the room after S4 | same | sailor 17,6 facing right (saved) | Done | none | same | yes |
| S6 re-enter (low tide) | same; TEMP_12 set by transition | sailor on 18,6 (the doll's tile, never shared: trade needs the catch) FACE_DOWN at the pool | Done | moved onto the titan's tile | same | yes |

Ordering (a): trading before the catch is impossible (Warn, no offer). Ordering (c): S2-S3 ink only; S4+ ink + margin.

### Meteor Falls B1F_2R + B1F_1R / Treecko / Steven chalk (page 7, FLAG_DEN_METEOR_STEVEN_CHALK 0x2BB)
Objects: crystal Treecko doll B1F_2R 7,4 (FLAG_TEMP_11); chalk wall bg 8,3 (read from 7,3 facing right); grooved stone B1F_1R bg 19,5; B1F_2R's only warp 5,15 → B1F_1R warp 3. No Steven object anywhere in this beat.

| State | Flags/temp flags true | What is on screen | Text label shown | What visibly changed vs previous | Page 7 shows | Birch report line? |
|---|---|---|---|---|---|---|
| M0 first visit | — | doll 7,4 | wall: `_Text_ChalkNote` (sign); stone: `_Text_GroovedStone` | — | hidden unless BADGE08; if open: old text | no |
| M1 Treecko KO'd / ran | TEMP_11 | doll gone until re-entry | `_Text_CrystalTreeckoFaded`; wall old note | doll vanishes | unchanged | no |
| M2 Treecko caught (same visit) | CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO, TEMP_11; TEMP_13 clear (ON_TRANSITION ran before the catch) | doll gone | caught text ends "…seems to catch the light."; wall `_ChalkWaiting` = old note + `_Text_ChalkStub` | doll gone; nothing new on the map (stub is text only) | opens; ink, no margin | no |
| M3 save + Continue inside B1F_2R after M2 | same as M2 (TEMP_13 restored clear; no ON_TRANSITION) | same | still Waiting | none (expected; funnel item 1 warns testers) | same | no |
| M4 walk out to B1F_1R | caught, 0x2BB clear | no map change | stone: `_Text_GroovedStoneChalk` (dust + footprints) | text only, and only if the player re-reads a stone they may have read before (SUSPECT: design, Known issues #3) | same | no |
| M5 re-enter B1F_2R through warp 5,15 | + TEMP_13 (`_NewChalk`), TEMP_11 | no doll; no other change | wall `_ChalkAnswer`; with FIELD NOTES: SE_DEX_PAGE + `_Text_ChalkCopy`, sets 0x2BB | text only | ink + blue margin `gFieldNotesText_TreeckoMargin` (once 0x2BB is set) | yes (once 0x2BB is set) |
| M6 read the wall again | + 0x2BB | same | `_ChalkCopied` = answer as a sign, no sound | none | same | yes |
| M7 save + Continue inside B1F_2R after M5 | TEMP_13 restored set | same | Answer (or Copied) | none; consistent with M5 | same | yes if copied |
| M8 B1F_1R after 0x2BB | 0x2BB | no change | stone back to `_Text_GroovedStone` | dust gone (text only) | same | yes |
| M9 M5 without FIELD NOTES (v2.9 save) | caught, TEMP_13; 0x2BB clear | same | `_ChalkAnswer` → `_ChalkNoBook` (no sound, no copy) | none | page not readable (no notebook) | no |
| M10 M9 then get FIELD NOTES, re-enter, read | + 0x2BB | same | Answer + sound + Copy | none | ink + blue margin | yes |

Ordering (a): catch then Continue inside B1F_2R = M3 (no answer until a warp in). Ordering (b): KO = M1/M0 loop, no state change. Ordering (c): page 7 at M2-M4 = ink only; M5 (with notebook) onward = ink + margin. Ordering (d): warp in = M5 (answer); Continue = M3 (no answer) or M7 (answer stays if TEMP_13 was already set when saved).

### v3.1 beats state walk (static, C351)
Built from the scripts, not from play: Route106 scripts.inc (Route106_OnTransition, _TideHiker), GraniteCave_B1F scripts.inc (_SetupHikerLeft + EventMacro_DexBelieverPlace), Route119 scripts.inc (_SetupStormChaser, _StormChaserWatchesSky, _StormChaser, _StormChaserDone), Route113 scripts.inc (_SetupAshCamper, _AshPairWatches, _AshCamper, _AshCamperDone, _AshPicnicker branches) and the four map.json files. "Caught" = ScriptCheckPokedexCaught for that beat's species (A = GLIGAR_HOENN, B = LOTAD_HOENN, C = VULPIX_HOENN). Engine facts as in the den walk above: setup runs on ON_TRANSITION only (warp or connection), not on Continue or on the return from battle.

| State | Route 106 (A) | Granite B1F (A) | Route 119 (B) | Route 113 (C) |
|---|---|---|---|---|
| (1) **no GAME_CLEAR** | no tide hiker (FLAG_HIDE_ROUTE106_TIDE_HIKER set every entry) | hiker 26,20, C329 behaviour (FACE_UP before GLIGAR_HOENN, FACE_DOWN after) | no TESSA (FLAG_HIDE_ROUTE119_STORM_CHASER set) | picnicker alone, C330 place (38,8 FACE_RIGHT by the rock before VULPIX_HOENN; 38,6 FACE_UP after); no ELLIS |
| (2) **GAME_CLEAR, page species not caught** | same as row 1 (no GLIGAR_HOENN) | same as row 1: 26,20 FACE_UP | same as row 1 (no LOTAD_HOENN) | same as row 1: picnicker alone at 38,8 FACE_RIGHT (no VULPIX_HOENN) |
| (3) **GAME_CLEAR + species caught, on map entry** | hiker 54,15 FACE_UP (map default) | empty (FLAG_HIDE_GRANITE_CAVE_B1F_HIKER set) | TESSA 20,110 FACE_LEFT (map default; FACE_UP if already beaten, row 5) | ELLIS 38,5 FACE_DOWN + picnicker 38,6 FACE_UP (DexBelieverPlace) |
| (4) **after talk / win, same visit** | unchanged: no faceplayer, same box; HARD_STONE once if FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE unset (bag full: Common_EventScript_ShowBagIsFull, flag stays unset, offered again) | — | before the battle she faces you, faces up for the storm (setweather WEATHER_RAIN_THUNDERSTORM, delay 90), faces you; after the win (or any later talk) Next + Common_Movement_FaceUp: she faces up | talk to ELLIS before the win: faces you, battle; after the win ELLIS and picnicker both Common_Movement_FaceRight; picnicker talk before the win: faceplayer, text, FaceUp back to him |
| (5) **re-enter after win** | unchanged (no win state) | — | TESSA 20,110 FACE_UP via Route119_EventScript_StormChaserWatchesSky (call_if_defeated) | both FACE_RIGHT via Route113_EventScript_AshPairWatches (call_if_defeated), ELLIS 38,5 + picnicker 38,6 |
| (6) **save + Continue on the route after the win** | unchanged | — | no ON_TRANSITION; saved facing (up), same as row 4 | no ON_TRANSITION; saved facing (both right), same as row 4 |
| (7) **caught after GAME_CLEAR while standing on the route** | n/a on the route itself (no GLIGAR on Route 106); the next entry shows row 3 | GLIGAR is caught on B2F, so climbing back to B1F is a warp: he is already gone (row 3); there is no post-catch talk with him in the cave postgame | no change until re-entry (setup runs on ON_TRANSITION only) | no ELLIS until re-entry; the picnicker meanwhile gives her C330 caught branch ("!", step 10), since FLAG_HIDE_ROUTE113_ASH_CAMPER is still set |

All cells agree with the scripts; no new known issue. Note row 7 (A): a postgame player who catches GLIGAR on B2F never sees the B1F reaction of step 7; the HARD STONE moves to the Route 106 first talk instead (C348 design).

### v3.1 visibility audit (static, C352)
Can the player actually see each beat? Built from code and map data, not play. **Engine facts (verified C352):** `OBJECT_EVENTS_COUNT` = 16 (include/constants/global.h:46; the player takes one slot), `OBJECT_EVENT_TEMPLATES_COUNT` = 64. `TrySpawnObjectEvents` (src/event_object_movement.c:1645) spawns a map.json object when its tile (+`MAP_OFFSET` 7) is inside left = pos.x−2, right = pos.x+`MAP_OFFSET_W`+2 = pos.x+17, top = pos.y, bottom = pos.y+`MAP_OFFSET_H`+2 = pos.y+16, where pos = the player's map tile (`SetCameraFocusCoords`, fieldmap.c:792). In map.json coordinates that is **x from −9 to +10 and y from −7 to +9 around the player**. `RemoveObjectEventIfOutsideView` (:1699) uses the same box (pos.x−2..+17, pos.y..+16) against both the current and initial tile, so an object despawns only when both are outside it. Only the current map's templates ever spawn: **an NPC is never visible from a connected map**, even when its tiles are drawn on screen. "Visible" below means coda state (`make playtest_coda`): item balls unflagged by the preset are visible; trainers are visible whether or not they've been beaten. The window is bigger than the screen (15×10 tiles: 7 columns each side, about 4-5 rows up and down). Screen rows are approximate; I didn't derive them from the camera code.

| Beat tile | 1. Objects in window (coda state, +1 player) / 16 | map.json index | 2. Connection edges | 3. Flag↔object binding | 4. Visible only after a map load (and does the Verify block say so?) |
|---|---|---|---|---|---|
| **A** Route 106 hiker 54,15 FACE_UP (C352 audit was run at the old tile 54,11; moved C354, see tile scan below) | C352 figures (at 54,11): front tile 54,10 is open sea (surf). From there, from the sand at 54,12 or 53,11: hiker + ELLIOT (fisherman 51,14, unflagged) = 2, **3/16 PASS**. Worst case over every tile that keeps him in the window: 3/16. (DOUGLAS 18,5, KYLA 29,10, NED 65,14, PROTEIN ball 29,14 are all outside it.) | **#6 of 6** (last) | up MAP_ROUTE105 (offset 0: joins Route 106 x 0-39 at y 0; he is 15 columns east of it and 11 rows down, outside the window from Route 105). down MAP_DEWFORD_TOWN (offset 60: joins x 60-79 at y 19; Dewford's walkable top row lands on x 63-70). Nearest edge tile 60,19 is 6 columns and 8 rows away, so **he loads only from Route 106 tiles at y ≤ 18 and x ≤ 63**, about two steps onto the sand heading west. Verify sentence added (step 44). | FLAG_HIDE_ROUTE106_TIDE_HIKER (0x30) → #6 OBJ_EVENT_GFX_HIKER, Route106_EventScript_TideHiker ✔. Writers: new_game.inc:141 setflag (ResetAllMapFlags); Route106/scripts.inc:10 setflag + :15 clearflag, both in Route106_OnTransition. No other writer. FLAG_HIDE_GRANITE_CAVE_B1F_HIKER (0x31) → GraniteCave_B1F #2 OBJ_EVENT_GFX_HIKER, GraniteCave_B1F_EventScript_CaveHiker ✔. Writers: GraniteCave_B1F/scripts.inc:18 clearflag + :23 setflag, both in `_SetupHikerLeft::` (first call in OnTransition); not in ResetAllMapFlags, so visible by default as intended. LOCALIDs: Route 106 scripts use none; LOCALID_GRANITE_CAVE_B1F_HIKER = 1 local_id. **PASS** | (a) He appears on Route 106 only on a load. GLIGAR can't be caught on Route 106 (GRANITE_CAVE_B2F only), so every arrival is a load anyway. (b) B1F is empty only on a load, and the B2F catch is always followed by the ladder warp up. Step 44's Verify now says so out loud (sentence added). |
| **B** Route 119 TESSA 20,110 FACE_LEFT | Front tile 19,110 is river (surf). From there or from 20,111: TESSA + BRENT (28,116) + CHRIS (13,104) = 3, **4/16 PASS**. From 21,110, +BOY_3 31,109: 5/16. Worst case: 21,114 adds GREG 12,123, TAYLOR 26,123, the SUPER REPEL ball 12,121 (FLAG_ITEM_ROUTE_119_SUPER_REPEL, clear in coda) and drops CHRIS/BOY_3: 6, **7/16 PASS**. | **#50 of 50** (last; 50 of 64 template slots used) | down MAP_ROUTE118 (offset −40: Route 118's 80 columns cover the whole bottom edge, y 139; she is 29 rows up). right MAP_FORTREE_CITY (offset 0: Fortree's 20 rows join x 39 at y 0-19; she is 19 columns and 90 rows away). **Out of reach of both edges**; no sentence needed. | FLAG_HIDE_ROUTE119_STORM_CHASER (0x32) → #50 OBJ_EVENT_GFX_WOMAN_5, Route119_EventScript_StormChaser ✔. Writers: new_game.inc:142 setflag; Route119/scripts.inc:43 setflag + :48 clearflag, both in `_SetupStormChaser::` (called from Route119_OnTransition :22). LOCALIDs used by Route119/scripts.inc: STORM_CHASER, RIVAL, RIVAL_ON_BIKE, SCOTT and HARTLEY each match exactly 1 local_id; LOCALID_PLAYER is the global constant. **PASS** | (a) She appears only on a load. LOTAD can't be caught on Route 119 (ROUTE102 only), so no on-route case. (b) FACE_UP after the win is applied in the same visit (Common_Movement_FaceUp) and again by `_StormChaserWatchesSky` on re-entry, so nothing waits on a load. Verify already says "Leave and come back: she faces up." (c) The thunderstorm is `setweather` + `doweather` in the talk script, so it shows at once. **No sentence needed.** |
| **C** Route 113 ELLIS 38,5 FACE_DOWN + picnicker 38,6 FACE_UP | The front tiles are each other's. Approach tiles: 37,5 → ELLIS, picnicker, GENTLEMAN 36,10 (wanders up/down), LAO 29,6 (buried trainer, still takes a slot), TORI 45,6, TIA 46,6, VOLCANOLOGIST 28,8 = 7, **8/16 PASS**; 39,5 → 6/16; 38,7 → 7/16. Worst case over every tile with ELLIS in the window: 7+1 = **8/16 PASS**. | ELLIS **#20 of 20** (last), picnicker #19 | left MAP_FALLARBOR_TOWN (offset 0, the whole 20-row west edge; he is 38 columns in). right MAP_ROUTE111 (x 99 edge, 61 columns). down MAP_ROUTE112 (offset 60: joins x 60-99 at y 19; 22 columns and 14 rows away). **Out of reach of every edge**; no sentence needed. | FLAG_HIDE_ROUTE113_ASH_CAMPER (0x33) → #20 OBJ_EVENT_GFX_CAMPER, Route113_EventScript_AshCamper ✔. Writers: new_game.inc:143 setflag; Route113/scripts.inc:33 setflag + :38 clearflag, both in `_SetupAshCamper::` (called from Route113_OnTransition :16, after the DexBelieverPlace line). Also read at :260 (picnicker branch). The picnicker #19 is unflagged. LOCALID_ROUTE113_ASH_CAMPER / _ASH_PICNICKER = 1 local_id each. **PASS** | (a) ELLIS appears only on a load, and **VULPIX is caught on Route 113 itself** (land 10%), so a normal-save player who catches it there sees no ELLIS until they leave and come back. Step 46's Verify didn't say so; sentence added. (b) The picnicker's move 38,8 → 38,6 is also load-only; pre-game step 10 already says "The next time you enter the route". (c) Both turning FACE_RIGHT after the win is applied in the same visit and again on re-entry; Verify already says so. (d) **Decided C353 (D3): (a) is accepted, no ON_RESUME fix**, because the picnicker's move is load-only too and a mid-visit ELLIS would face an empty tile; it is the first ALLOWLIST entry of the C354 check_beat_visibility lint. |

**Index note:** in pokeemerald a late map.json index only matters if 15 objects ahead of it in the list are inside the window at the same moment (TrySpawnObjectEvents walks templates in order and stops spawning when the 16 slots are full). The worst case here is 8/16, so indices #6, #50 and #20 cost nothing. Recorded, not a failure.
**Other flags in the setup scripts:** none. They read FLAG_SYS_GAME_CLEAR and the trainer flags via `call_if_defeated` (set by the battle itself); Route119_OnTransition's HARTLEY_EVENT/OMEN_RANGER writes don't touch Beat B's object. Both presets list all four hide flags in check_playtest neverSet.
**Beat A sightline (static):** walking from Dewford to the Granite Cave door (48,16) is forced through row 16 (rocks at 56-57,17 / 55-56,18 / 53-55,19), so he stays in the spawn window but 5-6 rows above the player, at or just past the top edge of the screen. He is clearly on screen only from row ≤ 15 (x 47-61) or from the sea north of him. See the journey map "Finding for C353 planning". **Decided C353: he moves to 54,15 in C354** (scan below; C352's "forced through row 16" was loose: rows 13-16 are open sand at x 52-58, the pinch is the door).
**Beat A tile scan (C353, planning; source for the C354 move).** `tileAt()` from check_object_tiles.cjs over LAYOUT_ROUTE106 (General + Dewford), x 47-61, y 12-15; hiker elevation 3. 4-neighbour BFS over collision-0, elevation 0/3/15, non-water tiles from Dewford's landing (63-70,19) to the door 48,16 (entered only from 48,17), with ELLIOT 51,14 and NED 65,14 occupied: **20 steps**, and still 20 with any single passing tile occupied. Sight: ELLIOT FACE_RIGHT range 4 → 52-55,14; NED LOOK_AROUND range 3 → 62-64,14 and 65,11-13/15-17. Sign 59,13 read tiles 58,13 / 60,13 / 59,14 excluded.
| row | x 47-50 | x 51 | x 52 | x 53 | x 54 | x 55 | x 56-58 | x 59 | x 60-61 |
|---|---|---|---|---|---|---|---|---|---|
| 12-13 | rock (c1) | 51,12 sand / 51,13 rock | sand | 53,12 rock / 53,13 sand | sand | sand | sand | 59,12 sand / 59,13 sign (c1) | 12: ocean (e1); 13: sand — all fail R5 (row < 14) |
| 14 | rock | ELLIOT | sight | sight | sight | sight | **PASS** | sign tile | **PASS** |
| 15 | rock (0x7C/0x64/0x7D/0x8A) | rock 0xE2 | **PASS** | **PASS** | **PASS ← chosen 54,15** (0x124 MB_SAND, c0 e3) | **PASS** | **PASS** | **PASS** | **PASS** |
Pick rule: row 15 over 14, then x nearest 54, then north neighbour sand/water: 54,15 (north 54,14 sand; sea from 54,10). Note for the C354 Verify: a player who talks to him from 54,14 stands in ELLIOT's sight line; if ELLIOT is unbeaten, his battle comes first (vanilla).
Moved 54,11 → 54,15 in C354; tile re-read from map.bin before the edit; check_beat_visibility V3 guards it.

**Box count and register** (Creative Visionary read; no text edited). Target: ≤ 2 boxes before the battle, no notebook text.

| Beat | Label(s) before the battle/item | Boxes before control/battle | Notebook or quoted-page text? | vs target |
|---|---|---|---|---|
| A | Route106_Text_TideHiker | 1 (no `\p`). First talk only: then giveitem's 2 standard boxes (gText_ObtainedTheItem + gText_PutItemInPocket). No battle. | No page header, red colour or signature. "They swim better than they glide" paraphrases page 3's red ink ("It swims better than it glides!") in his voice. | within |
| B | Route119_Text_StormChaserInk → (storm, `delay 90`) → Route119_Text_StormChaserRule | 2 | No page formatting. "Its leaf drinks the storm." is page 1's ink line spoken word for word (gFieldNotesText_LotadInk). | within |
| C | Route113_Text_AshCamperInk → Route113_Text_AshCamperRule | 2 (the optional picnicker talk first is 2 more boxes, Route113_Text_AshPicnickerCamper with one `\p`, but control returns before you talk to him) | No page formatting. "Cold fur in the falling ash." is page 4's ink line spoken word for word (gFieldNotesText_VulpixInk). | within |

No beat is over target, so no C353 trim candidate. Register note for C353 planning: all three first boxes quote the player's own ink back at them. That is the v3.1 premise working as designed, but B and C quote it word for word and A paraphrases it. If testers say the beats feel samey, this is the first place to vary.

No Severity A/B/C finding from this audit; Known issues unchanged.

### Matchcall worst case (C337 re-check)
`make check_matchcall_len` worst-case fixture = dex rating + longest field note + red ink Open + all 4 P1-P4 names + gBirchRedInkText_Dens + max(Believed, OnlyYou) + Close: **918/1000 B** (exit 0). Notebook pages are priced as old + ink + margin; longest is Treecko 248 B (all margins included). The C337 colour change swaps one 6-byte colour pair for another, so both totals are unchanged. No fixture change needed.

## Known issues (static)

Found by reading code, not by play. Severity uses the A/B/C scale above.
1. **Fixed C338:** `MeteorFalls_B1F_2R_Text_ChalkCopy` now reads "You copy it down. / Blue chalk dust settles / under your red ink.", matching the blue page-7 margin.
2. **Fixed C338:** ISOLDE and MARLOW now react on screen the moment the den Pokémon is caught (EventMacro_StaticDen optional 8th arg `on_caught`; P3 / S2 rows above). Funnel item 4 asks testers whether they noticed.
3. **C, design:** Steven's chalk dust (M4) is text-only on a stone the player may already have read; the B1F_2R answer (M5) also adds nothing on the map. If testers miss it (funnel item 1), the cheapest visible cue would be a metatile or object change, which needs a design cycle.
4. Palette (C337, gMessageBox_Pal from graphics/text_window/message_box.png): idx4 RED = 224,8,8 (red); idx5 LIGHT_RED = 248,184,112, a peach shadow. That is vanilla Emerald's red-text shadow, so the six red margins and the cover are fine. **Not a Severity-A finding.**
5. **Fixed C339:** the two in-wall Agent Oak NPCs found by the first `make check_object_tiles` run (C338) are on open ground and their KNOWN_ISSUES rows are deleted (lint: 175 destinations + 205 start tiles, 0 errors). GraniteCave_B1F hiker 28,19 → **26,20** (same pocket as the B2F ladder 28,21, FACE_UP before / FACE_DOWN after GLIGAR_HOENN; the ladder stays reachable from 27,21, 28,22 and 28,20 via 27,20). MtPyre_Summit keeper old woman 20,25 → **21,25** (her ghost-migration approach is now one walk_right and still ends on 22,25). ISOLDE 17,11 and MARLOW 18,6 still pass (18,6 is a warning only: the TEMP_12 Mudkip doll's start tile, hidden by then).


README copy: 'Help Playtest v3.0' mirrors this file (funnel, scope line, known-issues line, emulator field: synced C338 Reflection; C340 made it "Five things" + the Lilycove doubt paragraph, README synced C340 Reflection; C341 Reflection fixed README's stale schoolkid step 4 and dropped the in-wall NPC known-issue line, fixed C339). Edit here first.
C339: README should add the Quick start paragraph and the line 'Start the PLAYTEST ROM and follow Birch's call. Tell us the first moment something surprised you.'
README synced C345 Reflection (Birch steps 42-43, crayon kid as 23b, 2 feel questions).
