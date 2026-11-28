# v3.14 "Mine to give" (spec C403; build C404)

The spec, gate, sequence, close criteria M1-M6 and build file list are in strategy-notes.md, section v3.14. This file keeps the C403 working: the scans and estimates behind those choices, so C404 doesn't redo them.

## Placement scan (C403)
- Tools: `node scripts/map_scan.cjs MossdeepCity 0-79 0-39`, plus a throwaway BFS over its output, started at the gym exit 38,10. The BFS allowed moves only onto c0 tiles with no warp and no ocean, and between tiles of the same elevation or of elevation 0/15.
- Elevation bands: the west town (gym, PC, Game Corner) is e5. The east plateau is e7 (rows 6-26, x 42-65). The Space Center grounds are e9 (rows 16-21 x 60-69, the corridor x 69-70 rows 6-15, the north lawn rows 6-7 x 57-69). Stairs (e0): 63-65,22 (e7↔e9), 57-58,27 (e5↔e7), 32-33,27-28 (town↔beach), 25-26,25.
- West and east connect only through 40-43, rows 21-26. That is why vanilla put the six Magma coord triggers there (MossdeepCity/map.json:414-459).
- Behaviour counts over the whole map: MB_NORMAL 1783, MB_OCEAN_WATER 878, MB_SHALLOW_WATER 382, MB_MOUNTAIN_TOP 103, MB_SAND 44 (all on x 1-7 rows 21-30, a Surf-only sandbar), MB_ANIMATED_DOOR 10.
- **Rejected: the east shore.** The only land touching the ocean in the east is the e9 north lawn (69,6 faces east, 60,6 / 65,6 / 67-69,6 face north). It sits behind the Space Center building, 9+ rows from the door at 64,15. Everything at x 70-78, rows 8-26, is collision. 61-66 rows 2-5 is an e1 block that can't be reached from e9.
- **Rejected: the south grass plateau** (rows 29-35 x 43-63). A rock wall (row 36, General_RockWall_GrassBase) closes it off, so it isn't shore.
- **Chosen: the south clifftop, row 26, x 31-39** (e5 grass). Directly south is a rock wall (row 27), then the shallow-water beach (rows 28-32), then the ocean. Taken: 34,26 (doll), 35,26 (grunt), 36,26 (WREN). Left free: 31-33,26 and 37-39,26, the stair tops 32-33,26 and the Game Corner exit 36,25.
- Exit tiles, each read with `map_scan --at`: 34,26 0x001 c0 e5 · 33,26 0x122 c0 e5 · 33,27 0x0CF c0 e0 [coord VisitedMossdeep, VAR_TEMP_1 0, player-only] · 33,28 0x0CF c0 e0 · 33,29/30/31/32 0x19E MB_SHALLOW_WATER c0 e3. Walls: 35,27 0x07C c1, 36,27 0x31C c1.
- Actor check (C366): MossdeepCity/scripts.inc has 15 applymovement lines. They move Maxie and grunts 1-4 (starting at x 44-45, walking east and south), Scott (61,29) and the player (watching Scott), plus one VAR_LAST_TALKED face-back. Wanderers near the tiles: NinjaBoy 26,21 (rows 20-22), Black Belt 31,29 (walks in place), WarmSwimmer 24,27 (LOOK_AROUND). None comes within 3 tiles of 34-36,26 or onto the exit path.

## Damage estimates behind the party draft (IV 0, no EVs, so a lower bound: the real trainer mons are iv 100 ≈ 12)
- Worn yardstick (playtests/space-center-steven-worn.json), at 50% HP: SHELGON 41 ≈ 52 HP, LINOONE 40 ≈ 56, WHISCASH 40 ≈ 69.
- CARVANHA 39 ICE_BEAM (2x) on SHELGON: 71-84, an OHKO, so it's cut. CARVANHA CRUNCH (physical in this ROM, STAB) on SHELGON: ≈ 39.
- SHARPEDO 39 CRUNCH on LINOONE: ≈ 81, an OHKO, so SHARPEDO is out. MIGHTYENA 38 CRUNCH on LINOONE: 51-60, a near-OHKO on a worn LINOONE. That is the fight's only real threat, and INTIMIDATE softens the physical answers.
- WHISCASH SURF on MIGHTYENA: ≈ 70 of 101, a 2HKO. On CARVANHA (SpD 20): an OHKO.
- Prediction (written before measuring): a WIN with 0-1 faints. If a faint happens, it is LINOONE to MIGHTYENA CRUNCH.

## Accepted risks (C403)
- WREN appears in two places during the window (at Fortree 3,7 and on Mossdeep).
- In state 1 the Magma group (44-45, 23-26) is on screen with the beat.
- Palettes: PICNICKER, AQUA_MEMBER_M and LOTAD_DOLL all draw beside the Magma sprites. M1's screenshot checks this. The fallback is the gate `VAR_MOSSDEEP_CITY_STATE >= 2`.

**C403 reflection checks for C404** (not yet verified in code): (1) the grunt exit walks onto MB_SHALLOW_WATER 33,29-32; scripted applymovement is expected to ignore collision, confirm in the playtest (expectObject absent after the walk). (2) Read the M1 screenshot for WREN/PICNICKER + AQUA palette clashes in state 1 (Magma on screen). (3) MossdeepCity object count 20→23 stays far under the 64 template cap.
