# Overworld Following Pokémon: Feasibility for LoH

**Cycle**: 71 | **Date**: March 2026

---

## Feasibility Assessment

### On pokeemerald-expansion
- Feature is **built-in** — toggle config defines in `include/config/overworld.h`
- Uses Merp's Dynamic Overworld Palettes system
- Supports compressed OW graphics, large sprites (48x48, 64x64), weather form changes
- Substitute placeholder for missing OW sprites

### On vanilla pokeemerald (our codebase)
- **Very complex** to implement from scratch — rated as advanced difficulty
- Standalone branches exist (WiserVisor's FollowingPokemon branch)
- Merging into a heavily modified fork like LoH would require significant conflict resolution
- Gen 1-3 only sprite branch available (FollowingPokemon_Gen1-3) — more space-efficient

### Known Issues
- Rare freezes when follower initially created (possibly emulator-related)
- Pink flash in sparkle animation occasionally
- Requires `make clean` after large graphics changes

## Verdict
**Not feasible for LoH without expansion migration.** This is a multi-thousand-line engine feature touching object events, overworld rendering, palette management, and sprite loading. Agent Oak's vanilla pokeemerald fork would need either a full expansion migration or a massive standalone merge — neither is a single-cycle task. Community issue #61 should be deferred with explanation.
