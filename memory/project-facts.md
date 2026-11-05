# Project Facts

General project information — build system details, tool versions, configuration notes.

---

## Trainer System Constraints

- **Trainer Flag Allocation**: 0x500-0x874 = 891 flag slots
- **Current Status (C282 audit)**: TRAINERS_COUNT = 891, MAX_TRAINERS_COUNT = 891
- **Available Slots**: 8 unreferenced trainer IDs (C334 recount; 581 became TRAINER_PYRE_MOURNER): 117,173,462,485,486,633,634,853. Hand-verify each (computed-ID refs are invisible to the scan) before use; never bump TRAINERS_COUNT. 568 = JUAN_DUET (C322), 851/852 = MAXIE/ARCHIE_RECKONING (C326)
- **Future Capacity**: run `make check_trainer_slots` for the current unreferenced list; add each reclaimed ID to its RECLAIMED guard list. Never bump TRAINERS_COUNT (shifts SYSTEM_FLAGS, breaks saves)

## Emulator tooling

- 2026-11-04 (C337 probe): no mGBA (mgba, mgba-sdl, mgba-qt, mgba-rom-test) or xvfb-run in the runner image, nothing in /usr/games; pngjs is NOT installed (no node_modules at the repo root); no python3; tools/gbagfx is not built until `make`. PNG palettes can still be read with plain Node (the PLTE chunk is uncompressed: walk chunks from byte 8, PLTE data = RGB triplets).

## Build System

- **Build command**: `make` (run from `pokeemerald/` directory)
- **Output**: `pokeemerald/pokeemerald.gba`
- **Platform**: GBA (Game Boy Advance), 32-bit ARM7TDMI, Thumb-interwork

### Two Compiler Modes

**Classic mode (default, MODERN=0)**:
- Compiler: `agbcc` (custom GBA C compiler)
- Standard: C89
- Flags: `-mthumb-interwork -Wimplicit -Wparentheses -Werror -O2 -fhex-asm -g`
- Includes custom C library + libagbsyscall

**Modern mode (MODERN=1)**:
- Compiler: `arm-none-eabi-gcc`
- Flags: `-mthumb -mthumb-interwork -O2 -mabi=apcs-gnu -mtune=arm7tdmi -march=armv4t`

### Make Targets

- `make` / `make rom` — build the ROM (default)
- `make modern` — build with modern GCC toolchain
- `make compare` — verify against original ROM checksum
- `make clean` — remove all build artifacts
- `make syms` — generate symbol file for debugging
- `make generated` — generate auto-generated assets (maps, graphics)
- `make check_all` — check_species, check_encounters, check_e4_rematches, check_evolution, check_trainers, check_palettes, check_bosses, check_dens, check_gifts (C320); ends "=== All validation checks passed ===". `make check_all_quick` = check_scripts + check_species + check_trainers. Details in codebase-facts.md "Build Validation & Generators".

### Build Tools (in `tools/`)

`gbagfx` (PNG→4bpp), `mid2agb` (MIDI→M4A), `scaninc`, `preproc`, `mapjson` (JSON→asm), `gbafix`.

## Key Paths

- ROM source root: `/__w/agentoak/agentoak/pokeemerald/`
- Agent runner root: `/__w/agentoak/agentoak/`
- Memory files: `/__w/agentoak/agentoak/memory/`
- Journal files: `/__w/agentoak/agentoak/journal/`

## CI Environment Constraints

- **`gh` CLI not installed** — cannot query GitHub issues/PRs directly. Use journal/memory search for issue context instead.
- **`python3` not available** — use Node.js for scripting.
- **`pngjs` NOT installed** (C337 probe) — read PNG palettes with plain Node (see "Emulator tooling").

## MCP Tools — Pokémon Specialist

Available via MCP server (Pokédex tools). All default to Gen 3.

- `fetch_pokemon_sprites` — **Downloads real sprites** from pokeemerald-expansion to `pokeemerald/graphics/pokemon/<name>/`. Use when adding new species (Phase 6 of pipeline). Name format: lowercase with underscores (e.g., `lucario`, `mr_mime`).
- `pokemon_stats`, `search_pokemon`, `move_data`, `type_matchup`, `pokemon_learnset` — Research tools for stats, moves, matchups
- `smogon_sets`, `smogon_format_pokemon` — Competitive data from Smogon
- `team_type_coverage` — Team composition analysis

## Notes

- The JSON data files (`wild_encounters.json`) are processed by `mapjson` tool during build
- Graphics must be in PNG format; `gbagfx` converts them during build
- Assembly `.s` files in `data/` are part of the build and preprocessed with `preproc`
- The `generated/` directory contains auto-generated headers during build
- **Playtest ROM (C339)**: `make playtest` (from pokeemerald/) = `$(MAKE) PLAYTEST=1 rom` → `pokeemerald_playtest.gba`, objects in `build/playtest`, `-DPLAYTEST=1`. The runner/release only builds and ships the default `pokeemerald.gba`, so testers must build the den-tour ROM themselves (unless the runner learns to attach it). Default ROM is not byte-identical to pre-C339 (the den-tour script is always linked, never run).
