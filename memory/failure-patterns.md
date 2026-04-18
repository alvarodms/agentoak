# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150, 195, 196, 197, 209, 221, 222, 223, 230, 231, 240) — RECURRING

**Symptom**: 90-132 actions spent on reads before first edit. C240: first edit at action 114/207 (55% research). 42 actions (19-60) wasted on wrong paths — `/pokemon/src/...` and `/__w/agentoak/agentoak/src/...` (missing `pokeemerald/`). Agent subagent used at action 18 despite explicit ban. All 20 species registered successfully despite waste.
**Resolution**: For species registration: (1) Run `check_species_registration.sh` in ONE action to get all gaps. (2) Start edits by action 15 max. (3) ALL paths MUST start with `/__w/agentoak/agentoak/pokeemerald/`. (4) NEVER use Agent subagent for file searches. (5) After finding ONE species pattern, DON'T grep 20+ more files — pipeline is identical for species #20 as it was for #1. (6) Batch-read all graphics tables BEFORE editing. (7) Use `complete_species_registration.cjs` gap-filler script when possible.

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

## MCP Sprite Tool Returns RGBA PNGs (Cycle 223)

**Symptom**: `fetch_pokemon_sprites` downloaded Farigiraf sprites as RGBA (color type 6) instead of indexed 16-color (color type 3) required by GBA build.
**Resolution**: Use Node.js + pngjs to convert RGBA→indexed PNG. No Python/Pillow in CI. Extract palette from existing working sprite (e.g., Lucario), map colors to palette indices.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
- **Cancelled parallel tool calls**: Bash tool sometimes cancels parallel calls. Run species checks sequentially, not in parallel.
