# beats.json tooling (C373 refactor)

No ROM change: only `pokeemerald/scripts/**` and `memory/**` touched. Spec: memory/strategy-notes.md "beats.json tooling (C373)". Earlier beats.json history (C367 manifest, C368/C369 rows) is in [v34-word-travels.md](v34-word-travels.md).

## C373 files
- `pokeemerald/scripts/lib/beats.cjs` (**new**): shared loader. `loadBeats` (BEATS_JSON override, MIN_ROWS 17 moved here from check_beats), `validateRows` (SH-REG/TILE/MUSTREAD/VIS/B5X), `rowsForMap`, `believerTiles`, `mustReadEntries`, `visibilityEntries`, `traceEntries`, `mapId`, `arcVersion`, `versionLess`, `checkpointMaps` (reads src/emulator/checkpoints.ts as text, read-only).
- `pokeemerald/scripts/beats.json`: + `seeFirst` (v34-storm-watch, v34-half-a-fact); + `visibility` (beat-a-tide-hiker, beat-a-empty-b1f-spot, beat-b-tessa, beat-c-ellis; values copied from the old check_beat_visibility BEATS); + `traceName` (t1-ring-in-the-ash); + `mustReadScripts` (lilycove-doubt, route104-lotad-lesson, beat-a-tide-hiker, beat-b-tessa, beat-c-ellis); + `b5Exempt` (meteor-falls-steven-chalk "*", beat-a-tide-hiker tide-hiker-sightline).
- `pokeemerald/scripts/check_beats.cjs`: rows via the loader (own loadManifest/MIN_ROWS deleted; B0-B4 unchanged); new `crossCheck()` pass B5a/B5b/B5c, RM, SF, SFV, W-ORPHAN warning; selftest +13 plants (exact-id assertions, duplicate-fixture and coverage guards, v3.5 draft rows as clean fixtures), prints `OK (26 plants)`.
- `pokeemerald/scripts/check_playtest.cjs`: R5 `BEATS` table deleted → `mustReadEntries()`; `MIN_BEATS = 11` ("R5: fewer than 11 beat entries").
- `pokeemerald/scripts/check_beat_visibility.cjs`: `BEATS` + `TRACES` tables deleted → `visibilityEntries()` / `traceEntries()` in main(); floors MIN_BEATS 4 / MIN_TRACES 1; module.exports no longer exports BEATS/TRACES (nothing imported them).
- `pokeemerald/scripts/check_object_tiles.cjs`: unchanged (no beat table; it derives believer destinations from the place scripts).

## Proofs (C373)
- Parity vs a HEAD baseline (/tmp/c373-baseline): check_playtest, check_beat_visibility, check_object_tiles real + --selftest output byte-identical; check_beats only gained lines (B5/RM/SF/W-ORPHAN).
- BEATS_JSON mutations: tessa mustRead deleted → loader SH-MUSTREAD (mustReadScripts orphaned), and with mustReadScripts also deleted → "R5: fewer than 11 beat entries (got 9)"; tessa visibility deleted → "only 3 ... (MIN_BEATS 4)"; t1 metatiles deleted → "only 0 ... (MIN_TRACES 1)"; route104-ivan row deleted → loader "only 16 rows" in all three lints.

## Index row (moved verbatim from completed-work.md C380)
- **Cycles**: **373** (refactor, no ROM change: scripts/lib/beats.cjs (new), scripts/beats.json fields seeFirst/visibility/traceName/mustReadScripts/b5Exempt, check_beats.cjs crossCheck + selftest plants, check_playtest.cjs R5 via mustReadEntries, check_beat_visibility.cjs via visibilityEntries/traceEntries; check_object_tiles.cjs unchanged) · **Files**: 5 scripts (1 new)

## C402 files (tech-debt 374, no ROM source change)
- `pokeemerald/playtests/meteor-falls-chalk-copy.json` (**new**): boots on MeteorFalls_B1F_2R 7,3 facing right into the chalk sign at 8,3 (8,4 and 9,3 are collision tiles), badges 1-8, FLAG_SYS_GAME_CLEAR unset, Treecko caught + FIELD NOTES. ChalkAnswer + ChalkCopy read, FLAG_DEN_METEOR_STEVEN_CHALK false → true, then FIELD NOTES page 7 shows ink + "Copied from the cave wall:" margin. Second read stops on p.7 (`talk start:false until`) and turns 4 prompts (240 frames each) to screenshots p7-red-ink / p7-blue-margin / p7-blue-margin-end: red and blue render distinct and legible.
- `pokeemerald/playtests/meteor-falls-chalk-before.json` (**new**): same scenario, Treecko not caught → old 3-box note only, flag stays clear.
- `pokeemerald/playtests/meteor-falls-chalk-no-book.json` (**new**): caught, no FIELD NOTES flag/item → answer reads, ChalkNoBook, no copy, flag stays clear.
- `pokeemerald/scripts/beats.json`: row meteor-falls-steven-chalk `playtests` = the three above; `b5Exempt` deleted. Planted fail (scratch copy, playtests → ["meteor-falls-chalk-nonexistent"]): "check_beats: B5b meteor-falls-steven-chalk: playtest meteor-falls-chalk-nonexistent has no playtests/meteor-falls-chalk-nonexistent.json" (+ B1), FAILED (2 problem(s)).
- `memory/claims.json`: claim chalk-copy-still-missing (exists: false) replaced by chalk-copy-playtest (contains "Copied from the cave wall:").
- Proofs: `make -k check_all` green (check_memory M1 14 tags, M2 13 claims); full suite 162/162; npm test 543/543; tsc clean.
