# Failure Patterns Archive (resolved; moved C390)

Moved verbatim from [../failure-patterns.md](../failure-patterns.md) in C390. Each item keeps a one-line rule in failure-patterns.md "Archived (C390)".

## Research phase consuming the budget (C110-308, 35 occurrences)

**Rule**: absolute `/__w/agentoak/agentoak/...` paths only (no `cd`), consult this file first on a known problem, start edits by action ~15-25, and cap planning research at ~60 actions before synthesizing.

## Edit-before-Read and `/w/` path typos (C256-C307, not hit since): Read before Edit; paths start `/__w/agentoak/agentoak/`.

## Trainer Party Macro/Struct Type Mismatch (Cycles 179, 190, 195) — RECURRING

**Symptom**: `warning: initialization from incompatible pointer type` in trainers.h, treated as error.
**Resolution**: C266 generate_trainer.cjs now auto-detects the correct macro/struct pairing.

## Pokedex categoryName Max Length (C261)

**Symptom**: `warning: excess elements in array initializer` — treated as error.
**Resolution**: Keep all Pokedex category names to **11 characters max**.

## fetch_pokemon_sprites Missing anim_front.png (C307) — NEW

**Symptom**: MCP `fetch_pokemon_sprites` for Toxapex delivered only 5/7 files (no anim_front.png, no front.png). front.png is auto-cropped from anim_front.png, so both were missing.
**Resolution**: Always `ls` the sprite directory after download to verify all 7 files. If anim_front.png is missing, copy from a visually similar species (C307 used Tentacruel). Run with `overwrite: true` on retry. Keep a mental list of good fallback species per type.

## Memory State Drifted From Tree (C308) — NEW, HIGH IMPACT

**Symptom**: codebase-facts claimed "39 species ALL registered 27/27"; actual tree had Toxapex 0/27 and 16 others at ~4-6/27 (null sprites/icons, no dex, no evos, no TM rows for Changed Three). Validators (make check_species) passed because they check fewer files than verify_species.sh.
**Resolution**: At cycle start for any species/trainer work, run `bash /__w/agentoak/agentoak/pokeemerald/scripts/verify_species.sh <NAME>` across all custom species (see [[species-registration]]). Trust the tree, not memory. Repair via `generate_species.cjs <cfg> --fill-missing` (idempotent since C308).

## Silent Sprite Palette Regression (C312)

**Symptom**: Torchic line (C277 violet-gold) and Treecko line (C276 steel-blue) found with vanilla-coloured palettes in C312, while sprite-iterations still described the custom art. Lint passed — it checks noise vs base, not art intent. Likely cause: C308 pipeline repair re-fetched base sprites.
**Resolution**: After any species re-fetch/repair, preview every touched _hoenn sprite against its sprite-iterations description. **Resolved (verified C352):** Treecko/Grovyle/Sceptile_Hoenn were restored C313 (sprite-iterations.md row "Treecko/Grovyle/Sceptile Hoenn v2, 313, palette restore"); `bash scripts/check_palettes.sh` passes (50 files), each `*_hoenn/normal.pal` differs byte-for-byte from its vanilla dir, and all three dirs are in `scripts/palette_manifest.sha256`. The palette check catches a revert to vanilla, not art drift, so the preview rule above still stands.

## Static Pokémon removeobject Permanently Sets Hide Flag (C312 → fixed C315)

**Symptom**: The C312 Mt. Pyre Torchic was meant to come back after a KO or flee, but it never did. Its faded path ran `Common_EventScript_RemoveStaticPokemon` → `removeobject`, and `RemoveObjectEventByLocalIdAndMap` calls FlagSet on the object's flag (`src/event_object_movement.c:1394`). The object flag was the permanent FLAG_HIDE_*, so the Torchic stayed hidden forever. The build was clean, so nothing caught this.
**Resolution**: Use a FLAG_TEMP object flag plus a permanent caught flag. The object_event flag = `FLAG_TEMP_11` (cleared on every map load, not on return from battle). A separate permanent `FLAG_CAUGHT_*` is set only on B_OUTCOME_CAUGHT, and ON_TRANSITION re-sets the temp flag when it's set. Use `EventMacro_StaticDen` / `StaticDenTransition` / `StaticDenTryRemove`. Never give an object that the script might `removeobject` a permanent flag unless removal really should be permanent.

## Gift Script Gave the Vanilla Species, Not the Custom Form (C279 → fixed C319)

**Symptom**: The C279 Changed Three gift gave SPECIES_MUDKIP instead of MUDKIP_HOENN (showmonpic, bufferspeciesname, VAR_TEMP_TRANSFERRED_SPECIES, givemon), and nobody noticed for 40 cycles. The text described the titan Mudkip, and the other two balls were correct. Validators don't check what a script gives.
**Resolution**: When a script's text describes a custom form, grep its givemon/showmonpic species: `grep -n "SPECIES_" <scripts.inc>`.

## Harness change rolled back by the runner gate (C377)
- **Harness change rolled back by the runner gate (C377)**: the runner verifies src/emulator edits with the whole-repo `npx vitest run`; an unrelated infra test (src/repo/game-tree.test.ts, temp-git staging) failed there though local npm test passed, so the new step vanished and the playtest using it became an invalid file. Rule: a playtest needing a new harness step must ship a fallback plan, and the step should be as small as possible; when the step only re-checks something the transcript already proves, prefer existing steps (harness edits can be rolled back by unrelated infra tests). **C378: resolved by deletion** (taken-north-in-order's two expectTrainerDefeated steps + README row removed; no harness edit).
