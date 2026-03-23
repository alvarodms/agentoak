# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88)

**Symptom**: Agent completes only part of a multi-component objective.
**Cause**: Gets focused on data entry and memory updates, skipping the build.
**Resolution**: Budget actions — reserve at least 20 actions for build+fix at the end. Re-read files immediately before editing to avoid context eviction.

## Untracked Binary Assets (Cycles 68, 91) — CRITICAL

**Symptom**: Build fails with "Failed to open" for fairy.png, species sprites, or cry WAVs.
**Cause**: Binary assets from previous cycles aren't committed to git. Fresh checkouts miss them.
**Resolution**: Copy placeholders — fairy/physical/special/status.png from normal.png, cries from similar species, sprites via `fetch_pokemon_sprites`.
**PREVENTION**: Run `make` as a **smoke test at cycle start** BEFORE making any edits. Cycle 91 wasted 60 actions (~67% of budget) diagnosing these failures mid-build. Fix asset gaps first, then do real work.
**Known missing cries**: gabite, garchomp, gible, lucario, riolu, weavile — copy from similar species each build.

## Duplicate Entry "2 matches found" Edit Error

**Cause**: Search string matches multiple locations in file.
**Resolution**: Read file to get unique surrounding context. Include more lines in old_str.

## agbcc Toolchain Missing After Runner Revert (Cycle 42+)

**Symptom**: `fatal error: string.h: No such file or directory`
**Resolution**: `ln -s /home/runner/work/agentoak/agentoak/pokeemerald/tools/agbcc /__w/agentoak/agentoak/pokeemerald/tools/agbcc`

## Unicode Character in .string Directive (Cycles 26, 64, 65)

**Symptom**: `error: unknown character U+2014` in scripts.inc
**Resolution**: Use only ASCII in .string text. Em dash, smart quotes NOT in charmap.
**WARNING**: Edit tool can silently corrupt `"` into Unicode smart quotes near existing smart quotes.

## Move Constant Naming

**Symptom**: `MOVE_THUNDERPUNCH' undeclared` — missing underscore.
**Resolution**: Check exact spelling in `include/constants/moves.h`. Tricky: `MOVE_SELF_DESTRUCT`, `MOVE_FAINT_ATTACK`, `MOVE_THUNDER_PUNCH`.

## "File has not been read yet" After Context Compression (Cycles 57, 67, 88)

**Symptom**: Edit tool returns `File has not been read yet.`
**Cause**: After many tool calls (200+), context compression evicts the file read.
**Resolution**: Re-read immediately before editing. For bulk updates, use bash scripts.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`. Invalid → crash.
- **JSON errors**: `wild_encounters.json` processed by `mapjson`. Validate JSON syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
