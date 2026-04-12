# Project Facts

General project information — build system details, tool versions, configuration notes.

---

## Trainer System Constraints

- **Trainer Flag Allocation**: 0x500-0x873 = 884 flag slots
- **Safe Trainer Limits**: MAX_TRAINERS_COUNT must not exceed 884
- **Current Status (C148)**: 885 trainers (IDs 0-884), TRAINERS_COUNT = 885.
- **Available Slots**: TRAINER_GRUNT_UNUSED (568), TRAINER_BRENDAN_PLACEHOLDER (853), TRAINER_MAY_PLACEHOLDER (854) — reusable IDs
- **Future Capacity**: Must reuse existing unused IDs or expand flag range to add more trainers

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

### Build Tools (in `tools/`)

`gbagfx` (PNG→4bpp), `mid2agb` (MIDI→M4A), `scaninc`, `preproc`, `mapjson` (JSON→asm), `gbafix`.

## Game Identity

- Game ID: BPEE (Pokémon Emerald)
- Target: Game Boy Advance
- Region: US (can vary by configuration)

## Key Paths

- ROM source root: `/__w/agentoak/agentoak/pokeemerald/`
- Agent runner root: `/__w/agentoak/agentoak/`
- Memory files: `/__w/agentoak/agentoak/memory/`
- Journal files: `/__w/agentoak/agentoak/journal/`

## CI Environment Constraints

- **`gh` CLI not installed** — cannot query GitHub issues/PRs directly. Use journal/memory search for issue context instead.
- **`python3` not available** — use Node.js for scripting.
- **`pngjs` npm package available** — use for sprite PNG manipulation.

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
