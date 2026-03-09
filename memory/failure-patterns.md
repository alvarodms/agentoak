# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Runner "Build: FAILED" on Exploration Cycles

**Symptom**: The cycle report shows `Build: FAILED` even though no `make` was run.
**Cause**: The agent runner checks for the existence of `pokeemerald.gba` after each cycle. If no build was attempted, the file doesn't exist and the runner reports failure.
**Resolution**: This is expected for exploration-only cycles. Not a real failure. Only run `make` in cycles where code changes are made.

## Anticipated Pitfalls (from code analysis)

### Using wrong SPECIES_ constants
- Species IDs are in `constants/species.h`
- Only valid species IDs should be used in data files
- Invalid species will likely cause crashes or display issues at runtime (may not be a compile error)

### JSON format errors in `wild_encounters.json`
- The file is processed by `mapjson` tool during build
- Malformed JSON will cause a build error at the data generation step
- Always validate JSON syntax before building

### Classic vs Modern compiler differences
- Default build uses `agbcc` (classic mode)
- Some modern C features won't compile in classic mode (C89 only)
- Use C89-compatible syntax: no `//` comments (use `/* */`), no declarations after statements

### Assembly script syntax errors
- `.s` files in `data/` use custom preprocessor directives
- Errors here produce cryptic assembler messages
- Look at nearby valid examples before editing

### Graphics format issues
- Graphics must be PNG with correct dimensions (multiples of 8)
- Tile-based: 8x8 tiles, sprite sheets must follow GBA size constraints
- `gbagfx` will error on invalid dimensions or color counts
