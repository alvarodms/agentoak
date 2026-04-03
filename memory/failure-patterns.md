# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146) — RECURRING

**Symptom**: 90-117 actions spent on file reads/searches before first edit. C146: 117 reads for 21 trainers (reading each party AND trainer entry separately = ~5 reads per trainer).
**Cause**: Reading every trainer individually rather than batching. Also: redundant re-reads of the same data (read parties at actions 10-21, then re-read them again at actions 88-108).
**Resolution**: 
- **ALWAYS use `/__w/agentoak/agentoak/pokeemerald/`** as the base path.
- For bulk trainer edits: use `grep -n` to find all target offsets in ONE pass, then read in batches. Budget: ≤30 actions for reads, ≥30 for writes+build.
- **Never re-read data you already have** — take notes on first pass.

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
