# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (C110-250, 18 occurrences) — RECURRING

**Symptom**: 64-132 actions before first edit. C250: first edit at action 65/115 (56% research) for a well-understood species pipeline. C248: first edit at action 80/125 (64% research).
**Resolution**: (1) ALL paths MUST start with `/__w/agentoak/agentoak/pokeemerald/`. (2) NEVER use Agent subagent. (3) Start edits by action 15 max. (4) For species work: write the node.js bulk script FIRST, then read only the files needed for anchor text. Don't grep every constant in every file before writing.

## "File Modified Since Read" on Rapid Sequential Edits (Cycle 147)

**Symptom**: ~15 "File has been modified since read" errors on rapid sequential edits to large files.
**Resolution**: Use a **node.js script** to apply all changes in one pass.

## "File Has Not Been Read Yet" on Edit Calls (Cycle 256) — 8 wasted actions

**Symptom**: Edit tool rejected 8 consecutive calls with "File has not been read yet. Read it first before writing to it."
**Cause**: Attempted to Edit graphics table files after grepping them (grep doesn't count as "read"). The Edit tool requires an explicit Read call for each file before editing.
**Resolution**: Before editing ANY file, call Read on it first. Batch: read all 8 graphics table files in parallel, then edit all 8. For species work, the 8 graphics tables always need Read→Edit after running generate_species.cjs.

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

## Premature Entries for Unregistered Species (C259→C260 fix)

**Symptom**: Build fails with `undeclared` errors for SPECIES_X constants in graphics tables, tmhm_learnsets.h, evolution.h, and wild_encounters.json.
**Cause**: C259 added entries for 4 future species (Shroomish/Lotad/Lombre/Breloom_Hoenn) across 11 files BEFORE defining their SPECIES_ constants in species.h.
**Resolution**: C260 removed all premature entries. **Rule**: NEVER add entries for a species until `generate_species.cjs` has created its SPECIES_ constant. The generator handles all 26 files atomically — manual pre-population causes build breaks.

## Pokédex categoryName Max Length (C261)

**Symptom**: `warning: excess elements in array initializer after gPokedexEntries[N].categoryName` — treated as error.
**Cause**: `PokedexEntry.categoryName` is `u8[12]`. The `_()` macro produces GBA-encoded bytes + null terminator. Any categoryName over 11 characters overflows the 12-byte buffer.
**Resolution**: Keep all Pokédex category names to **11 characters max**. "Storm Dancer" (12) → "STORMDANCER" (11). Existing entries top out at 11 chars.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
- **Cancelled parallel tool calls**: Bash tool sometimes cancels parallel calls. Run species checks sequentially, not in parallel.
- **egg_moves.h**: Regional forms still need an entry (even if empty) — C250 Gligar_Hoenn missed this (17/19). Fixed in C251.
- **cry_tables.inc**: Forward and reverse tables MUST have identical entry counts. C252 found a 2-entry mismatch (duplicate Growlithe/Arcanine in vanilla reverse section + misplaced entries before gCryTable:: label). New species using base-species cries need ONLY a cry_ids.h entry, NOT new cry_tables.inc entries.
- **TM/HM learnset fields**: Not all move constants are TM fields. Gen4/5 moves like ENERGY_BALL exist as MOVE_ constants but are NOT assigned to TM slots — using them in tmhm_learnsets.h causes "unknown field" error. Verify a field exists before adding to TM lists.
- **check_species_registration.sh**: cry_tables.inc check is a known false positive for 16/22 species — validator greps for regional form name but cry table uses base species labels. 18/19 is the expected ceiling for species that reuse base cries.
