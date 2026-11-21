# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Research phase consuming the budget (C110-308, 35 occurrences)

**Rule**: absolute `/__w/agentoak/agentoak/...` paths only (no `cd`), consult this file first on a known problem, start edits by action ~15-25, and cap planning research at ~60 actions before synthesizing.

## Edit-before-Read and `/w/` path typos (C256-C307, not hit since): Read before Edit; paths start `/__w/agentoak/agentoak/`.

## Invalid Escape Sequences in .string Directives (Cycles 26-197) — CRITICAL

**Symptom**: `error: unknown escape '\e'` (or `\t`, `\r`, etc.) OR `error: unknown character U+XXXX`.
**Cause**: pokeemerald `.string` only supports `\n`, `\l`, `\p`, `$`. Any other `\X` is fatal.
**Resolution**: Before `make`, run: `grep -nP '\\\\[^nlp$"\\]' <modified .inc files>` to catch invalid escapes. Em-dashes NOT in charmap — use `--`.

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

## Raw press/wait Screenshots Lag One Box (C361)
first-ink-cue-screens first used `wait 120` per box; field text prints at ~3 frames a letter, so a 2-line box was still printing and each `press A` only finished the current box: every screenshot showed the box before the one it was named for. Fix: `wait 240` per box (README tip says "a few hundred frames"); read the PNGs before trusting a screenshot test, since a lagging one still passes. Also: bootScenario's 60 settle frames already cover an ON_FRAME emote, so screenshot a boot cue with `wait 1`.

## Boot Test Says a Visible NPC Is Absent (C367)
`expectObject` reported Mauville's Wally "not on the map (hidden by its flag?)" though no flag hid him: the start tile 18,17 was 10 tiles from him, and objects outside the camera window (~x±7, y-4..y+5) are never spawned. Before blaming a hide flag, check the distance. Fix: keep the boot tile for the "no scene fired" checks, then `warp` next to the NPC (12,10 for Wally at 8,6) and assert there.

## Crashed-cycle memory claims (C374)

**Symptom**: C374 hit the 20-minute CLI timeout after writing memory but before anything reached the tree. strategy-notes (roadmap DONE row, "suite 100/100"), codebase-facts (reclaim mode, hpPercent/battleSwitch, MIN_ROWS 18), completed-work and v35-taken-north.md all described slot 486, the keeper scripts, harness steps and meteor-falls-chalk-copy as shipped; none existed (opponents.h still said GINA_AND_MIA_2).
**Resolution**: At planning, spot-check 3 claimed symbols in the tree before trusting a DONE row (a define, a file, a lint constant: e.g. `grep TRAINER_X pokeemerald/include/constants/opponents.h`, `ls` the config, `grep MIN_ROWS`). If the last commit says "cycle crashed", treat that cycle's memory as aspirational. Implementers write memory LAST (after ROM edits and playtests), so a timeout loses memory instead of inventing it.
**Rule**: memory written by a cycle that was later LOST can claim DONE work. Before trusting a DONE row, grep the artifact. **Found again C380**: tech-debt rows 369-373 (generate_trainer.cjs reclaim mode: no "reclaim" in the script) and 374 (playtests/meteor-falls-chalk-copy.json absent) still said DONE; corrected to pending.

## Anticipated Pitfalls

- **Species IDs**: Only valid SPECIES_* constants from `constants/species.h`.
- **JSON errors**: `wild_encounters.json` — validate syntax after editing.
- **C89 only**: Default agbcc build. No `//` comments, no declarations after statements.
- **Graphics**: PNG, 8x8 tile multiples. `gbagfx` errors on wrong dimensions/colors.
- **Trainer capacity**: TRAINERS_COUNT = 891 (all slots defined); never bump it. **Source of truth for free slots: `node scripts/check_trainer_slots.cjs`** (prints the zero-reference ID list). Verified C385: 2 candidates left, 633 LUCAS_2, 634 MIKE_1; 853 MAY_PLACEHOLDER is data-only (pret wiki: never rename; the lint lists it separately) (462 is now TRAINER_ROUTE109_STORM_WATCHER C368, 485 TRAINER_MAUVILLE_GYM_HOPEFUL C369, 486 TRAINER_FORTREE_CHARM_KEEPER C375) (a grep of data/ src/ include/ finds each only in opponents.h + trainers.h). 117 is now TRAINER_ROUTE119_STORM_CHASER (TESSA, C349), 173 TRAINER_ROUTE113_ASH_CAMPER (ELLIS, C350), 581 TRAINER_PYRE_MOURNER (C334). Hand-verify a slot before use (computed-ID refs are invisible to the scan); `generate_trainer.cjs` reclaim mode (C385) adds it to RECLAIMED.
- **egg_moves.h**: Regional forms still need an entry (even if empty).
- **cry_tables.inc**: Forward and reverse tables MUST have identical entry counts.
- **TM/HM learnset fields**: Not all move constants are TM fields. Field names use underscores matching the struct definition (e.g., `.SOLAR_BEAM` not `.SOLARBEAM`). Always check existing entries in `tmhm_learnsets.h` for exact field names before adding new species.
- **species_names.h**: Covered by `generate_species.cjs` since C281 (27/27 files). No manual steps needed.
- **Palette manifest drift (C314)**: `make check_all` runs `check_palettes.sh`, which fails if any `graphics/pokemon/*_hoenn/*.pal` changes without a manifest refresh. After an intentional palette edit, run `bash scripts/check_palettes.sh --update` in the same cycle.
- **Roster fixes that ignore story order (C316)**: The villain pass gave Tabitha a Houndoom ace at Mt. Chimney, right before Flannery's Houndoom-ace Gym 4, and the audit only reported it as a generic collision. Before shipping a boss roster, check the fights on either side of it in story order (Fiery Path → Mt. Chimney → Lavaridge Gym), not just the set of species.
- **Tag battles cap at 3 mons per opponent (C316)**: In BATTLE_TYPE_TWO_OPPONENTS (Mossdeep Maxie/Tabitha), only party slots 1-3 load, so an ace in slot 4 never appears. Keep tag-battle parties at 3 or fewer with the ace in slot 3.
- **Dead NPC scripts look live (C320)**: The plan targeted `FortreeCity_EventScript_MigrationBirdwatcher`, but no map.json object used it (the live NPC at 20,8 runs `_MigrationBirdKeeper`), so the new line would never have shown. Before editing an NPC script, `grep -rn '<label>' data/maps/*/map.json` and confirm an object points at it. The callback went on the live script and the dead one was deleted.
- **`make check_all` red without anyone noticing (found C385)**: check_dens Rule 1 (no shared FLAG_TEMP_* on any map) failed on FortreeCity FLAG_TEMP_5 from the C375 storm-charm design onward, because cycles ran only their own targets and nobody ran check_all end to end. Fixed C385 with a reasoned TEMP_FLAG_SHARE_ALLOWLIST row. Run `make -k check_all` (shows every failing target, not just the first) before finishing any cycle that adds a deliberate exception to a lint rule.
- **Parallel sprite phase vs check_palettes (C320)**: The sprite phase runs during implementation and edits `*_hoenn/shiny.pal`, so `make check_all` fails at check_palettes mid-cycle until that phase runs `check_palettes.sh --update`. Don't refresh the manifest from the patch phase while its files are still changing. Run the other targets on their own (`make check_bosses check_dens check_gifts`, `make check_all_quick`) to verify your own work.
- **JS `replace()` with a `$` in the replacement (C321)**: a memory edit wrote markdown containing "stops at `$`)" through `String.replace(str, newText)`; `$`+backtick is a special pattern (= text before the match), so most of codebase-facts.md was pasted into one line (150→264 lines). Use `s.split(old).join(new)` or a replacer function `() => newText` for any replacement text you didn't write yourself.
- **Plant a failure first (C322, C334, C344)**: prove every new lint or check FAILS on a planted break (`make <target>` exits non-zero) before trusting a pass. C322: `check_scripts` ran `if grep ... a/*/x b/*/*/x 2>/dev/null`, the empty second glob made grep exit 2 and the `if` always said "clean"; `grep -P "\xe2\x80\x94"` only matches bytes under `LC_ALL=C`. C334: a hand count (Tier B 11, really 12) and stale flags.h hex comments (SYSTEM_FLAGS 0x860 / daily 0x920; real 0x87B / 0x940) were wrong: trust the lint (`make check_flag_values`) or computed values, and quote generator commands exactly (`generate_trainer.cjs <config>`, mode comes from the JSON). C344: a grep for FieldCB_WarpExitFadeFromBlack could never fail (vanilla overworld.c already has it 3 times); assert an absent symbol (ExecuteTruckSequence) instead.
- **Line-regex parsers over trainers.h skip entries with trailing comments** (C323 check_doubles): `[TRAINER_MAY_PLACEHOLDER] =  // Available…` broke `=\s*\{`; allow `[^\n{]*\n?` before the brace, and make every new lint fail if it parses suspiciously few records (<100) so a broken parser can't pass silently.
- **Stale capacity "facts" in memory (C333)**: memory said "0x2BB is the last free flag" for ~10 cycles and a flag-reclamation refactor was queued on it; one grep showed 264 unreferenced `FLAG_UNUSED_0x*` defines (codebase-facts' trainer/system ranges were wrong too). Before planning around a limit (flags, trainer slots, specials, multichoice IDs), re-derive it from source with grep and note the cycle it was verified.
- **Playtest exit mats need a press, not a step (C359)**: walking onto an indoor exit mat (MB_SOUTH_ARROW_WARP, e.g. Birch lab 6,12) only shows the arrow; the warp fires on a DOWN press while standing on it. First try (`walk down 7`, `wait 180`) left the player on the mat in the lab (failure.png showed the arrow). Fix: `walk` onto the mat, then `{"press": "DOWN", "hold": 20}`, `wait 180`. Door tiles outdoors (Littleroot 7,16) warp on a plain `walk up`.

- **Message boxes per page = A-presses per `\l`/`\p` (C360)**: a FIELD NOTES page with ink is 5+ boxes, not 3 (each `\l` scroll and `\p` wait for A). When a playtest screenshots a specific box, count the line breaks in the .inc text first, then place the screenshot after that many presses.
- **Planned NPC walk across a ledge (C363)**: the plan had the forager "walk north" from 18,34, but row 30 cols 16-21 is a south ledge; scripted `applymovement` ignores collision, so she would have walked up the cliff with no error. Before writing any NPC route, run `node scripts/map_scan.cjs <Map> <xs> <ys>` over every tile on it, and give a second route for when the player stands on the first tile (getplayerxy).
- **NPC tile beside a cutscene actor (C366)**: design put DAX at Mauville 6,6 and deferred "does Wally's scene cross it?" to the build cycle; one awk over `<Map>_Movement_*` lists showed WallyExitNorth1 walks 8,6→6,6. Before placing an NPC within 3 tiles of any scripted actor, trace every applymovement list from that actor's map.json tile in the design cycle.
- **Seed-fixed battle turn counts (C368)**: route109-storm-watch-defeated first failed at step 43 ("What will" never showed) because the turn steps assumed a different KO count; the fight takes 6 turns (3 per foe) only on the suite seed. Any change to RNG consumption before the battle (new map script, party, item) can shift it. Prefer `waitForBattleText` on the defeat line over counting "What will" prompts; if counts are needed, re-run once and read failure.png before editing.
- **Stale foe after a 2nd battle in one test (C370)**: word-travels-in-order failed at `expectBattle` for DAX because gBattleMons still held TOBY's MINUN for a few frames after the battle started. Fixed in playtest.ts: `expectBattle` polls up to 600 frames for the expected species+level, then asserts strictly. Any new battle-state read in a multi-battle test needs the same wait.
- **Black screenshot at battle start (C376)**: a `screenshot` right after a sighting/`waitFor battle` lands in the transition; wait for "What will" first.
- **Harness change rolled back by the runner gate (C377)**: the runner verifies src/emulator edits with the whole-repo `npx vitest run`; an unrelated infra test (src/repo/game-tree.test.ts, temp-git staging) failed there though local npm test passed, so the new step vanished and the playtest using it became an invalid file. Rule: a playtest needing a new harness step must ship a fallback plan, and the step should be as small as possible; when the step only re-checks something the transcript already proves, prefer existing steps (harness edits can be rolled back by unrelated infra tests). **C378: resolved by deletion** (taken-north-in-order's two expectTrainerDefeated steps + README row removed; no harness edit).
- **Worn-run decider ≠ full-HP decider (C386)**: C385's worn run said MANECTRIC decides the Route 119 rival, so C386 pre-specified a 2-step MANECTRIC nerf; at full HP the wipe came from STANTLER_HOENN (Ghost vs slot-1 HEADBUTT) instead, and the nerf changed nothing. Measure the target condition (full HP) BEFORE choosing which mon to fix, and check the yardstick can answer each foe type.
- **moveFor needs role-aligned slots (C387)**: `battleTurns` `moveFor` keys on the FOE only (battle[1].speciesName), not on which of your mons is out, so one slot number must mean the same role on every party member (C387 rival yardstick: 1 = hits Ghosts BITE/SURF/BITE, 2 = anti-Grass/Fighting STRENGTH/WING_ATTACK/STRENGTH, 3 = anti-Fire FACADE/WATER_GUN/HEADBUTT). Never put a Normal move in a slot mapped to a Ghost. In doubles battle[1] is only the left foe. Coverage alone did not flip the rival: at full HP sleep + seed (STANTLER_HOENN HYPNOSIS/LEECH_SEED) beats a type-correct yardstick, so check the foe's status moves, not just its type.
