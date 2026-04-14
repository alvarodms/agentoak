# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150, 195, 196, 197, 209, 221, 222) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit. C222: 89 actions before first file creation, though ~25 of those were productive (fixing check script, discovering cry system gaps). Many cancelled parallel tool calls wasted actions.
**Resolution**: For species registration: (1) Run `make check_species 2>&1 | grep -A20 "SPECIES_X"` in ONE action to get all gaps. (2) Start edits by action 15 max. (3) Use `grep -n` to find anchor patterns in ONE pass. (4) NEVER use Agent subagent for simple file searches — use Grep directly. (5) Always use `/__w/agentoak/agentoak/` prefix for absolute paths. (6) Avoid parallel Bash calls that get cancelled — run species checks sequentially.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## Claiming Completion Without Git Changes (Cycles 107, 143) — RECURRING

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111, 196, 197, 221)

**Symptom**: Agent completes only part of a multi-component objective. C221: filled 20 of ~35 required files for 5 species (build green, but species still 5-7/19 each instead of target 19/19).
**Resolution**: Budget actions — reserve 30 for build + debug. Start edits by action 15. Run `make check_species` BEFORE and AFTER to track progress.

## Invalid Escape Sequences in .string Directives (Cycles 26, 64, 65, 94, 119-122, 125, 197) — CRITICAL

**Symptom**: `error: unknown escape '\e'` (or `\t`, `\r`, etc.) OR `error: unknown character U+XXXX`.
**Cause**: pokeemerald `.string` only supports `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Any other `\X` is fatal. Non-charmap Unicode is also fatal.
**Resolution**: Before `make`, run: `grep -nP '\\\\[^nlp$"\\]' <modified .inc files>` to catch invalid escapes. Use `cat >> file << 'HEREDOC'` for files with smart quotes. Em-dashes (—, –) NOT in charmap — use `--`.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Cause**: Party macro doesn't match the struct type in trainer_parties.h. Four macros map 1:1 to four struct types.
**Resolution**: Change macro in trainers.h to match struct type. C195 created `scripts/fix_trainer_macros.cjs`.

## Missing HOENN_DEX Entry When Adding Species (Cycle 195)

**Symptom**: `initializer element for 'sSpeciesToHoennPokedexNum[N]' is not constant` in pokemon.c.
**Cause**: Added NATIONAL_DEX entry but forgot HOENN_DEX_* enum entry and HOENN_DEX_COUNT update.
**Resolution**: When adding any species, ALWAYS update both national AND Hoenn dex sections of pokedex.h.

## add_regional_form.cjs Catastrophic Failure (Cycles 215-216) — CRITICAL

**Symptom**: Pipeline only populated 7 of 23+ required files for Bagon_Hoenn.
**Resolution**: DO NOT trust `add_regional_form.cjs`. After running, verify EVERY file. Use `complete_species_registration.cjs` (C222) to fill gaps.

## Script Written But Never Executed (Cycle 218, fixed C219) — CRITICAL

**Symptom**: C218 journal reported build green, but `SPECIES_VULPIX_HOENN undeclared` on next build.
**Resolution**: After writing ANY registration script: (1) EXECUTE it, (2) verify output with grep, (3) run `make`.

## All 17 Custom Species Have Registration Gaps (C220-C222) — IN PROGRESS

**Symptom**: `make check_species` reveals registration gaps across all custom species.
**C222 progress**: Bagon_Hoenn, Ninetales_Hoenn, Farigiraf → 19/19. **14 species remain** with gaps.
**Resolution**: Use `scripts/complete_species_registration.cjs` with JSON configs. C223 target: batch complete remaining 14.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
- **Cancelled parallel tool calls**: Bash tool sometimes cancels parallel calls. Run species checks sequentially, not in parallel.
