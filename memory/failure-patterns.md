# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150, 195, 196, 197) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit. C197: 60 actions of research before writing bulk script, despite the pattern being documented in memory from C195-196.
**Resolution**: For species pipeline: **run existing scripts first** — `scripts/add_growlithe_arcanine_hoenn.cjs` already exists (29KB, untracked). Start edits by action 15 max. Use `grep -n` to find offsets in ONE pass.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## Claiming Completion Without Git Changes (Cycles 107, 143) — RECURRING

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111, 196, 197)

**Symptom**: Agent completes only part of a multi-component objective. C197: script ran + manual patches applied but build failed on quest script text, all reverted.
**Resolution**: Budget actions — reserve 30 for build + debug. Start edits by action 15. Grep for invalid escapes before building.

## Invalid Escape Sequences in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125, 197) — CRITICAL

**Symptom**: `error: unknown escape '\e'` (or `\t`, `\r`, etc.) OR `error: unknown character U+XXXX`.
**Cause**: pokeemerald `.string` only supports `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Any other `\X` is fatal. Non-charmap Unicode is also fatal.
**Resolution**: Before `make`, run: `grep -nP '\\\\[^nlp$"\\]' <modified .inc files>` to catch invalid escapes. Use `cat >> file << 'HEREDOC'` for files with smart quotes. Em-dashes (—, –) NOT in charmap — use `--`.

## Python3 Unavailable in Build Environment (Cycle 170)

**Symptom**: `python3: command not found` when running validation scripts.
**Resolution**: Use Node.js (always available) for validation scripts. Do NOT assume Python is installed.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Cause**: Party macro doesn't match the struct type in trainer_parties.h. Four macros map 1:1 to four struct types.
**Resolution**: Change macro in trainers.h to match struct type. C195 created `scripts/fix_trainer_macros.cjs`.

## Missing HOENN_DEX Entry When Adding Species (Cycle 195)

**Symptom**: `initializer element for 'sSpeciesToHoennPokedexNum[N]' is not constant` in pokemon.c.
**Cause**: Added NATIONAL_DEX entry but forgot HOENN_DEX_* enum entry and HOENN_DEX_COUNT update.
**Resolution**: When adding any species, ALWAYS update both national AND Hoenn dex sections of pokedex.h.

## Two-Species Pipeline Too Large for Manual Edits (Cycles 196, 197)

**Symptom**: C196: 171 actions manual editing, never built. C197: wrote a script but still needed ~40 manual actions for patches the script missed.
**Cause**: Each species touches ~15 files. Two species = 30 file edits + quest integration.
**Resolution**: The script at `scripts/add_growlithe_arcanine_hoenn.cjs` handles most files. For next attempt: run script, then only fix pokedex entries text, learnset appends, and cry table appends manually. Total manual work should be ~15 actions.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
