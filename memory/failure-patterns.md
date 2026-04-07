# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit.
**Resolution**: Use `grep -n` to find all target offsets in ONE pass. Never re-read data you already have. Use node.js scripts for bulk edits.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## Claiming Completion Without Git Changes (Cycles 107, 143) — RECURRING

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Bash-Script File Modifications Not Tracked by Validation (Cycles 168-169)

**Symptom**: Validation reports "no pokeemerald/ files were modified" even though git diff shows changes.
**Resolution**: After Bash scripts that write to pokeemerald/, run `git diff --stat pokeemerald/` to confirm. Git diff is ground truth.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111)

**Symptom**: Agent completes only part of a multi-component objective.
**Resolution**: Budget actions — reserve 30 for script writing and build. Start edits by action 15.

## Non-ASCII Characters in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125) — CRITICAL

**Symptom**: `error: unknown character U+XXXX`
**Resolution**: Use `cat >> file << 'HEREDOC'` for files with smart quotes. Run `grep -P '[\x80-\xFF]' <file>` before `make`.

## Python3 Unavailable in Build Environment (Cycle 170)

**Symptom**: `python3: command not found` when running validation scripts.
**Resolution**: Use Node.js (always available) for validation scripts. Do NOT assume Python is installed.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 884, AT CAPACITY. Must reuse unused IDs for new trainers.
