# Vanilla Physical/Special Split: Implementation Feasibility

**Cycle**: 42 | **Date**: March 2026

---

## Key Finding

The physical/special split CAN be implemented on vanilla pokeemerald WITHOUT the expansion. Two authoritative resources exist:

### 1. Official pret Wiki Guide
- **URL**: https://github.com/pret/pokeemerald/wiki/add-physical-special-split
- Community-maintained tutorial on the official pokeemerald decompilation wiki
- Step-by-step instructions for adding the split to vanilla

### 2. Kateulator's pokeemerald-physpe
- **URL**: https://github.com/Kateulator/pokeemerald-physpe
- Minimal fork: "Pokemon Emerald but with the physical special split, that is all"
- Clean reference implementation — can study the diff or cherry-pick commits

### 3. PokéCommunity Confirmation (Dec 2024)
- Users confirmed the pret wiki guide works for vanilla pokeemerald
- Multiple respondents recommended this over the full expansion for projects that only need the split

## Implications for Legends of Hoenn

- The P/S split was the #1 reason for the expansion migration
- If it can be done on vanilla, Path A (vanilla v2.0) becomes dramatically more attractive
- Fairy type would still need manual implementation, but that's a simpler type-chart + species data edit
- No trainer party format conversion needed (stay with C structs)
- No 5-8 cycle migration overhead

## Expansion Migration Reality Check

- No Reddit/community posts found describing successful mid-project migrations in 2025-2026
- RHH's own docs say "if your project is a bit old, you might get merge conflicts" — LoH with 41 cycles of mods is well beyond "a bit old"
- Most discussion happens on RHH Discord, not public forums — suggesting migration help is needed in real-time, not via guides
- Cycle 41 already proved the architectures are incompatible for overlay approaches
