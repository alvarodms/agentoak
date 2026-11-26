# Tech Debt Backlog — archive

Rows retired, merged or rewritten out of [tech-debt-backlog.md](tech-debt-backlog.md), copied verbatim. Older compactions (C360, C380): git history.

## C400 (source: git 5c60f44 + the uncommitted C400 planning edit of row 399)

Retired C400 as dropped (v3.3 rule: no new FIELD NOTES pages, so the trigger can't occur):

| Cycle | Investment | Status |
|-------|-----------|--------|
| 335 | Margin gate table: replace the per-page switch in IsFieldNotesMarginEarned with `sMarginGates[]` and let check_dens confirm every den page has a row. Do it if more gated pages are ever planned. | pending |
| 345 | Data-driven Field Notes extras: replace the page-3 doubt branch in BufferFieldNotesPage with `sFieldNotesExtras[] = {page, flag, text}`; check_matchcall_len reads the table. Build with the next margin box. | pending |

Merged C400 into row 352:

| Cycle | Investment | Status |
|-------|-----------|--------|
| 352 | `make check_selftest` aggregate target running every lint's --selftest (second half of the C352 row; the codebase-facts split shipped C380). | pending |
| 352b | Selftests for the last two check_all Node lints without one: check_text_width.cjs (plant a 209px line and a {STR_VAR_1} line) and audit_boss_species.cjs (plant a shared boss species). | pending |

Rewritten C400 (row 399 seedSweep, previous wording):

| Cycle | Investment | Status |
|-------|-----------|--------|
| 399-400 | seedSweep harness step: build it as a RATE report, not a guard (upstream pokeemerald-expansion PASSES_RANDOMLY precedent). One step replays a block per frame-offset seed and prints the pass rate per pre-registered criterion (e.g. 'Helping Hand by t2 on ≥2/3 seeds'). A single-seed outcome never becomes a guard. It would turn C398's 8 hand-built ISABEL files, and any future Mossdeep twins study, into one file. Schedule it for a later engineering cycle; v3.13 doesn't need it. | pending |
| 399 | seedSweep harness step: a playtest step {"seedSweep": [0,7,23], "steps": [...]} in src/emulator/playtest.ts replays one step block once per frame-offset seed and writes a single combined battleSummaries table to report.json, optionally checking pre-registered JSON bounds (R1-R4 style) itself. C398 hand-built 3 seeds x 3 strategies = 8 playtests and hand-copied the numbers; the Mossdeep twins and ISABEL rematch studies would each become one file. Good fit for the C400 maintenance cycle; keep a fallback per C377. | pending |
