# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit. C147: 120 reads for 59 trainers.
**Resolution**: 
- For bulk trainer edits: use `grep -n` to find all target offsets in ONE pass, then read in batches.
- **Never re-read data you already have** — take notes on first pass.
- Consider node.js scripts for batch edits to large files.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors when making many sequential edits to trainer_parties.h (311KB).
**Cause**: Edit tool detects file modification between read and write on rapid sequential edits.
**Resolution**: For bulk edits to a single large file, use a **node.js script** to apply all changes in one pass.

## Claiming Completion Without Git Changes (Cycles 107, 143) — RECURRING

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111)

**Symptom**: Agent completes only part of a multi-component objective.
**Resolution**: Budget actions — reserve at least 30 actions for script writing and build. Start edits by action 15.

## Non-ASCII Characters in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125) — CRITICAL

**Symptom**: `error: unknown character U+XXXX`
**Resolution**:
- Use `cat >> file << 'HEREDOC'` for files with existing smart quotes.
- **VALIDATE**: Run `grep -P '[\x80-\xFF]' <file>` on every modified .inc file BEFORE `make`.
- Smart quotes U+201C/U+201D in existing vanilla text are VALID charmap entries — do NOT replace.

## Dangling map.json Script References (Cycle 130)

**Symptom**: Linker error `undefined reference to 'EventScript_Xxx'`.
**Resolution**: Add the missing script to `scripts.inc` or fix the reference in `map.json`.

## "File has not been read yet" After Context Compression (Cycles 57, 67, 88)

**Symptom**: Edit tool returns `File has not been read yet.`
**Resolution**: Re-read immediately before editing.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 884, AT CAPACITY. Must reuse unused IDs for new trainers.
