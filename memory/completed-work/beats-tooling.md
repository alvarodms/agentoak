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
