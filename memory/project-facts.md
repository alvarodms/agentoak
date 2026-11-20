# Project Facts

General project information — build system details, tool versions, configuration notes. (Compacted C380: trainer-slot detail lives in codebase-facts/trainers-and-slots.md, playtest ROM build facts in codebase-facts/harness.md.)

---

## Trainer System Constraints

- **Trainer flags** 0x500-0x87A, TRAINERS_COUNT = MAX_TRAINERS_COUNT = 891. Never bump it (shifts SYSTEM_FLAGS, breaks saves).
- **Free slots**: `make check_trainer_slots` / `node scripts/check_trainer_slots.cjs` is the source of truth: **633/634 free; 853 MAY_PLACEHOLDER data-only (pret wiki: never rename)** at C385 (9 reclaimed: 117, 173, 462, 485, 486, 568, 581, 851, 852). Hand-verify before use. Reclaim with `node scripts/generate_trainer.cjs <cfg> --dry-run` then without (`"mode": "reclaim"`, C385); it appends RECLAIMED.

## Emulator tooling

- **C356: headless mGBA works.** `npm run playtest` (repo root) replays pokeemerald/playtests/*.json against the built retail ROM, writing screenshots to artifacts/playtests/<name>/ (Read them to see the screen). Needs a built pokeemerald.gba (run make first). Still no python3 or pngjs; read PNG palettes with plain Node (PLTE chunk = RGB triplets). The C337 "no mGBA" probe is obsolete.

## Build System

- **Build**: `make` from `pokeemerald/` → `pokeemerald/pokeemerald.gba`. GBA, 32-bit ARM7TDMI, Thumb-interwork.
- **Classic mode (default, MODERN=0)**: `agbcc`, C89, `-mthumb-interwork -Wimplicit -Wparentheses -Werror -O2 -fhex-asm -g`, custom C library + libagbsyscall.
- **Modern mode (MODERN=1)**: `arm-none-eabi-gcc`, `-mthumb -mthumb-interwork -O2 -mabi=apcs-gnu -mtune=arm7tdmi -march=armv4t`.

### Make Targets

- `make` / `make rom` (default), `make modern`, `make compare` (checksum vs original), `make clean`, `make syms`, `make generated` (maps, graphics).
- `make check_all` — every lint (order and details: codebase-facts/lints.md); ends "=== All validation checks passed ===". `make check_all_quick` = check_scripts + check_species + check_trainers.
- `make playtest` (PLAYTEST=1 den tour) / `make playtest_coda` (PLAYTEST=2) / `make check_playtest_build` (both, not in check_all): see codebase-facts/harness.md "Playtest ROM build facts".

### Build Tools (in `tools/`)

`gbagfx` (PNG→4bpp), `mid2agb` (MIDI→M4A), `scaninc`, `preproc`, `mapjson` (JSON→asm), `gbafix`.

## Key Paths

- ROM source root: `/__w/agentoak/agentoak/pokeemerald/`
- Agent runner root: `/__w/agentoak/agentoak/`
- Memory files: `/__w/agentoak/agentoak/memory/`
- Journal files: `/__w/agentoak/agentoak/journal/`

## CI Environment Constraints

- **`gh` CLI not installed** (re-checked C380) — use journal/memory search for issue context.
- **`python3` not available** (re-checked C380) — use Node.js for scripting.
- **`pngjs` NOT installed** (C337 probe) — read PNG palettes with plain Node.

## MCP Tools — Pokémon Specialist

Available via MCP server (Pokédex tools). All default to Gen 3.

- `fetch_pokemon_sprites` — downloads real sprites from pokeemerald-expansion to `pokeemerald/graphics/pokemon/<name>/` (lowercase with underscores, e.g. `lucario`, `mr_mime`).
- `pokemon_stats`, `search_pokemon`, `move_data`, `type_matchup`, `pokemon_learnset` — stats, moves, matchups.
- `smogon_sets`, `smogon_format_pokemon` — competitive data. `team_type_coverage` — team analysis.
- `rom_species(name, sections?)` — what the ROM currently has for a species (use instead of reading species_info.h etc.).

## Notes

- `wild_encounters.json` is processed by `mapjson` during build; graphics are PNG converted by `gbagfx`; `data/*.s` are preprocessed with `preproc`; `generated/` holds build-time headers.
- Playtest ROMs are not runner-built: the runner's "Build: SUCCESS" covers only retail `make` (detail: codebase-facts/harness.md).
