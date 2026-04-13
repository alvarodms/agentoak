# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research Phase Consuming Implementation Budget (Cycles 110, 111, 136, 146, 147, 150, 195, 196, 197, 209) — RECURRING

**Symptom**: 90-120 actions spent on reads before first edit. C209: 37 actions before first edit, partly due to `gh` CLI being unavailable (7 actions wasted discovering this).
**Resolution**: For species pipeline: write script early. C198 succeeded by starting script by action 10. Use `grep -n` to find offsets in ONE pass. **`gh` is NOT available** — don't attempt it; search journals/memory directly.

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

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Cause**: Party macro doesn't match the struct type in trainer_parties.h. Four macros map 1:1 to four struct types.
**Resolution**: Change macro in trainers.h to match struct type. C195 created `scripts/fix_trainer_macros.cjs`.

## Missing HOENN_DEX Entry When Adding Species (Cycle 195)

**Symptom**: `initializer element for 'sSpeciesToHoennPokedexNum[N]' is not constant` in pokemon.c.
**Cause**: Added NATIONAL_DEX entry but forgot HOENN_DEX_* enum entry and HOENN_DEX_COUNT update.
**Resolution**: When adding any species, ALWAYS update both national AND Hoenn dex sections of pokedex.h.

## Two-Species Pipeline Too Large for Manual Edits (Cycles 196, 197, fixed C198)

**Symptom**: C196: 171 actions manual editing, never built. C197: script + manual but `\e` killed build.
**Resolution (C198)**: Fresh script + 8 manual Edit patches for graphics tables that have EGG/UNOWN entries after CORSOLA_HOENN. Script anchors that assume `};` follows CORSOLA_HOENN are WRONG for graphics tables — always insert before `[SPECIES_EGG]`.

## replace_all Footgun (Cycle 198)

**Symptom**: Used `replace_all: true` to fix `MON_MALE` → `PERCENT_FEMALE(25)` in species_info.h; changed ALL species with MON_MALE, not just the two new ones.
**Resolution**: NEVER use `replace_all` on common strings in large files. Use targeted edits or `git checkout --` to restore + re-apply.

## PNG Palette Modification Requires PLTE Chunk Surgery (Cycle 209)

**Symptom**: Writing .pal files doesn't update the embedded palette in PNG files. Build uses PNG PLTE, not .pal, for sprite graphics.
**Resolution**: When modifying sprite palettes, must also update the PLTE chunk in the PNG binary directly using Node.js. Find PLTE chunk offset, write raw RGB bytes. Keep .pal and PNG PLTE in sync.

## wild_encounters.h Is Gitignored — Do Not Stage (Cycle 212)

**Symptom**: `git add` fails with "The following paths are ignored by one of your .gitignore files: pokeemerald/src/data/wild_encounters.h".
**Cause**: `pokeemerald/src/data/.gitignore` ignores `wild_encounters.h` (generated from `wild_encounters.json`). Runner staging tried to add it.
**Resolution**: Only stage `wild_encounters.json`, never `wild_encounters.h`. When staging pokeemerald changes, skip gitignored generated files.

## MCP Sprite Fetch Incomplete for Newer Pokemon (Cycle 214)

**Symptom**: `fetch_pokemon_sprites("farigiraf")` returned only 5 of 7 files — missing `anim_front.png` and `front.png`.
**Cause**: The expansion repo may not have all sprite variants for Gen 9 species, or the MCP tool's file detection missed them.
**Resolution**: After calling `fetch_pokemon_sprites`, ALWAYS verify with `ls` that all 7 files exist. If any are missing, copy from the base species (e.g., Girafarig for Farigiraf) as fallback.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 885, AT CAPACITY. Must reuse unused IDs for new trainers.
