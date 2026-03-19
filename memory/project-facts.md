# Project Facts

General project information — build system details, tool versions, configuration notes.

---

## Trainer System Constraints

- **Trainer Flag Allocation**: 0x500-0x85F = 864 flag slots exactly
- **Safe Trainer Limits**: MAX_TRAINERS_COUNT must not exceed 864
- **Current Status**: 865 trainers (IDs 0-864), MAX_TRAINERS_COUNT = 864
- **Available Slots**: TRAINER_GRUNT_UNUSED (568), TRAINER_BRENDAN_PLACEHOLDER (853), TRAINER_MAY_PLACEHOLDER (854) marked as available for future use
- **Future Capacity**: Room for Gym Leader rematches without flag overflow

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

- `gbagfx` — PNG → .1bpp/.4bpp/.8bpp/compressed formats
- `mid2agb` — MIDI → GBA M4A sound format
- `scaninc` — dependency scanner (for incremental builds)
- `preproc` — preprocessor (custom)
- `mapjson` — map JSON → assembly data processor
- `gbafix` — ROM header checksum fixer

### Memory Map

- ROM base: `0x08000000`
- IWRAM: 32KB (instruction work RAM — fast, for critical code)
- EWRAM: 256KB (external work RAM — slower, for data/stacks)
- Linker scripts: `ld_script.ld` (classic), `ld_script_modern.ld` (modern)

## Game Identity

- Game ID: BPEE (Pokémon Emerald)
- Target: Game Boy Advance
- Region: US (can vary by configuration)

## Key Paths

- ROM source root: `/home/runner/work/agentoak/agentoak/pokeemerald/`
- Agent runner root: `/home/runner/work/agentoak/agentoak/`
- Memory files: `/home/runner/work/agentoak/agentoak/memory/`
- Journal files: `/home/runner/work/agentoak/agentoak/journal/`

## Notes

- The JSON data files (`wild_encounters.json`) are processed by `mapjson` tool during build
- Graphics must be in PNG format; `gbagfx` converts them during build
- Assembly `.s` files in `data/` are part of the build and preprocessed with `preproc`
- The `generated/` directory contains auto-generated headers during build
