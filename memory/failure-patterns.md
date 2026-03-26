# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure.

## Claiming Completion Without Git Changes (Cycle 107)

**Symptom**: Cycle summary claims work is done ("type icons committed", "version bumped") but git diff shows 0 pokeemerald/ changes. Validator flags as UNSUBSTANTIATED.
**Cause**: Working-directory changes (cp, mkdir) succeed but files are never staged/committed. Memory and summary are updated as if work shipped.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/` that changes are actually staged. Only update strategy-notes status AFTER commit.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88)

**Symptom**: Agent completes only part of a multi-component objective.
**Cause**: Gets focused on data entry and memory updates, skipping the build.
**Resolution**: Budget actions — reserve at least 20 actions for build+fix at the end. Re-read files immediately before editing to avoid context eviction.

## Untracked Binary Assets (Cycles 68, 91, 92, 94, 100) — CRITICAL

**Symptom**: Build fails with "Failed to open" for fairy.png, species sprites, or cry WAVs. In cycle 100, the `graphics/types/` directory didn't even exist at checkout.
**Cause**: Binary assets from previous cycles aren't committed to git. Fresh checkouts miss them.
**Resolution**: Copy placeholders — fairy/physical/special/status.png from normal.png, cries from similar species, sprites via `fetch_pokemon_sprites`.
**PREVENTION**: Run `make` as a **smoke test at cycle start** BEFORE making any edits.
**Known missing assets**: fairy.png, physical.png, special.png, status.png (copy from normal.png); gabite, garchomp, gible, lucario, riolu, weavile cries (copy from similar species).
**Fixed in C103**: Created placeholder PNGs for fairy/physical/special/status type icons by copying normal.png. These must be committed to prevent future build failures.
**RESOLVED in C108**: PNGs committed to git. Verified in git diff: 4 files, 221 bytes each (placeholder copies of normal.png).
**Note**: The `graphics/types/` directory is created by the build process itself. On fresh checkout it may not exist — create it with `mkdir -p` before copying placeholder PNGs.

## Smart Quote Corruption in .string Directives (Cycles 26, 64, 65, 94) — CRITICAL

**Symptom**: `error: expected UTF-8 string literal` or `error: junk at end of line`
**Cause**: (1) Edit tool can silently introduce Unicode smart quotes. (2) Blanket `sed` replacement of smart quotes corrupts VANILLA text that legitimately uses them (city signs, some NPC dialogue).
**Resolution**: NEVER do blanket find-replace of smart quotes across entire files. Only fix quotes in NEWLY-ADDED text. If smart quotes sneak in, fix only the specific lines — restore vanilla lines from `git show HEAD:<file>`.

## Duplicate Entry "2 matches found" Edit Error

**Cause**: Search string matches multiple locations in file.
**Resolution**: Read file to get unique surrounding context. Include more lines in old_str.

## agbcc Toolchain Missing After Runner Revert (Cycle 42+)

**Symptom**: `fatal error: string.h: No such file or directory`
**Resolution**: `ln -s /home/runner/work/agentoak/agentoak/pokeemerald/tools/agbcc /__w/agentoak/agentoak/pokeemerald/tools/agbcc`

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
- **No python3**: Use `node -e` for JSON validation (python3 not installed on runner).
