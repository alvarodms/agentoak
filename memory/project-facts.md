# Project Facts

General project information — build system details, tool versions, configuration notes.

---

## Build System

### Requirements
- **ARM Toolchain**: arm-none-eabi-* binutils (gcc, ld, as, objcopy, objdump) OR agbcc
- **Build Tools**: make, gcc, git, libpng-dev, zlib
- **Platform**: Works on Linux, macOS, Windows (via WSL/msys2/Cygwin)

### Build Process
1. Build tools first: `make tools` (compiles mapjson, scaninc, gbagfx, etc.)
2. Build ROM: `make` or `make -j$(sysctl -n hw.ncpu)` (parallel build on macOS)
3. Output: `pokeemerald.gba` (should match SHA1: f3ae088181bf583e55daf962a92bb46f4f1d07b7)

### Makefile Configuration
- `MODERN ?= 0` - Use modern compiler (default: agbcc)
- `COMPARE ?= 0` - Compare to original ROM checksum
- `KEEP_TEMPS ?= 0` - Keep intermediate files
- Target names: `all`, `rom`, `modern`, `compare`, `clean`, `clean-tools`

### Build Tools (in tools/ directory)
- **mapjson** - Converts map JSON to C headers
- **scaninc** - Scans includes for dependency tracking
- **gbagfx** - Graphics conversion (PNG to GBA format, requires libpng)
- **gbafix** - Fixes ROM header
- **bin2c** - Converts binary data to C arrays
- **jsonproc** - Processes JSON data files
- **preproc** - Preprocessor for data files

### Build Directories
- `build/emerald/` - Object files for non-modern build
- `build/modern/` - Object files for modern build
- Intermediate files: .o (object), .elf (executable), .map (linker map), .sym (symbols)

## macOS-Specific Setup

### Prerequisites (INSTALL.md:252-320)
1. **Xcode Command Line Tools** - Install with `xcode-select --install`
2. **libpng** - Install via Homebrew: `brew install libpng`
3. **agbcc** - Custom ARM compiler, must be cloned and built separately

### agbcc Installation Steps
```bash
# From parent directory containing pokeemerald/
git clone https://github.com/pret/agbcc
cd agbcc
./build.sh
./install.sh ../pokeemerald
cd ..
```

### Build Command (macOS)
```bash
cd pokeemerald
make -j$(sysctl -n hw.ncpu)  # Parallel build using all CPU cores
```

### Verification
After successful build, verify with:
```bash
make compare
```
Expected output: `pokeemerald.gba: OK`

## Project Info

### Game Version
- **Target ROM**: Pokémon Emerald (USA)
- **ROM Code**: BPEE (Game Boy Advance)
- **Maker Code**: 01
- **Expected SHA1**: f3ae088181bf583e55daf962a92bb46f4f1d07b7

### File Organization
- C files in `src/` (~316 files)
- Headers in `include/` (~242 files)
- Assembly in `asm/` and `data/`
- Graphics in `graphics/` (PNG format)
- Maps in `data/maps/` (JSON format)
- Sound in `sound/`

### Platform Details
- **Target Hardware**: Game Boy Advance (32-bit ARM7TDMI @ 16.78 MHz)
- **Memory**: 256 KB EWRAM, 32 KB IWRAM, 96 KB VRAM
- **Display**: 240x160 pixels, 15-bit color (32768 colors)
- **Tile-based graphics**: 8x8 pixel tiles, background layers, sprite objects

## Current Environment

### Host System
- **OS**: macOS (Darwin 25.2.0)
- **Working Directory**: /Users/alvaro.bezerra/dev/_pessoal/agentoak
- **ROM Source**: pokeemerald/ subdirectory
- **Memory Storage**: memory/ subdirectory
- **Journal Storage**: journal/ subdirectory

### Build Status (as of Cycle 1)
- **pokeemerald**: Cloned, not yet successfully built
- **agbcc**: Installation status unknown (to be verified in Cycle 2)
- **libpng**: Installation status unknown (to be verified in Cycle 2)
- **Build Tools**: Not yet compiled (gbagfx, mapjson, scaninc missing)

### Next Actions Required
1. Check libpng installation: `brew list libpng`
2. Check agbcc installation: `ls -la pokeemerald/agbcc`
3. Install missing dependencies
4. Attempt first successful build
