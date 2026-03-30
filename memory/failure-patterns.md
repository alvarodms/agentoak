# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111) — RESOLVED C112

**Symptom**: Objective calls for script content (map scripts, NPC dialogues) but cycle ends with only C-side infrastructure. 25+ actions spent reading/searching before any edits begin.
**Cause**: Agent defaults to deep research even when the system is already well-understood from prior cycles. Memory files contain all needed context.
**Resolution**: When C infrastructure is DONE, start writing scripts immediately. Read ONLY the specific insertion point (50-line window), then edit. Budget: ≤10 actions for reads, ≥30 for writes+build.

## Claiming Completion Without Git Changes (Cycle 107)

**Symptom**: Cycle summary claims work is done but git diff shows 0 pokeemerald/ changes. Validator flags as UNSUBSTANTIATED.
**Cause**: Working-directory changes succeed but files are never staged/committed.
**Resolution**: Before marking any objective "DONE", verify with `git status pokeemerald/`.

## Incomplete Multi-Part Objectives (Cycles 14, 16, 22, 67, 77, 88, 110, 111)

**Symptom**: Agent completes only part of a multi-component objective.
**Cause**: Gets focused on early phases (research, C plumbing) and runs out of actions before script content.
**Resolution**: Budget actions — reserve at least 30 actions for script writing and build. Start edits by action 15.

## Untracked Binary Assets (Cycles 68, 91, 92, 94, 100) — RESOLVED C108

**Symptom**: Build fails with "Failed to open" for sprites or PNGs.
**Resolution**: PNGs committed to git in C108.

## Smart Quote Corruption in .string Directives (Cycles 26, 64, 65, 94, 119, 120, 121, 122) — CRITICAL

**Symptom**: `error: expected UTF-8 string literal` or `no mapping exists for double quote`
**Cause**: Edit tool silently corrupts existing Unicode smart quotes (`\u201c\u201d`) when they appear in the `old_string` match. The replacement changes their byte encoding even if the text looks identical.
**Resolution**: For files containing smart quotes (DewfordTown, PacifidlogTown, SlateportCity, Route111, BirchLab, etc.), use `cat >> file << 'HEREDOC'` to APPEND new content instead of the Edit tool. Only use Edit tool if the target `old_string` range contains NO non-ASCII characters.
**ACTIVE BUG (C121→C122)**: Route111/scripts.inc line 650 has corrupted smart quotes in `Route111_Text_WinstrateHouseSign`. This blocks ALL builds. Must fix at start of C123 by replacing with ASCII double quotes.

## Pre-existing Build Blockers Cause Cascade Reverts (NEW — C122)

**Symptom**: Cycle makes valid changes to files X, Y, Z but build fails due to pre-existing corruption in unrelated file W. Runner reverts ALL pokeemerald changes including the valid ones.
**Cause**: C121 introduced smart quote corruption in Route111. C122 didn't touch Route111 but inherited the broken state.
**Resolution**: At cycle start, run a smoke `make` build BEFORE making any changes. If it fails, fix the blocker first. This prevents wasting an entire cycle of work to a known pre-existing issue.

## agbcc Toolchain Missing After Runner Revert (Cycle 42+)

**Symptom**: `fatal error: string.h: No such file or directory`
**Resolution**: `ln -s` the agbcc tools directory.

## "File has not been read yet" After Context Compression (Cycles 57, 67, 88)

**Symptom**: Edit tool returns `File has not been read yet.`
**Cause**: Context compression evicts the file read after many tool calls.
**Resolution**: Re-read immediately before editing.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
