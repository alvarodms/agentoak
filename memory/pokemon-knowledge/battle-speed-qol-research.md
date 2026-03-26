# Battle Speed QoL: Implementation Patterns from ROM Hacks

**Cycle**: 105 | **Date**: March 2026

---

## Community Expectation

Battle speed QoL is now table stakes for any serious ROM hack. Every top-rated hack (Unbound, Radical Red, ROWE, FRLG+, Emerald Imperium) includes some form of battle speed control. Players expect it — its absence is a notable gap.

## Implementation Approaches

### 1. Options Menu Toggle (Recommended — FRLG+ style)
- FRLG+ adds dedicated options menu settings to remove/speed up battle animations
- Clean, familiar UX — players check Options first
- Modify `src/option_menu.c` to add a "Battle Speed: Normal / Fast" toggle

### 2. Battle Script Timing (pokeemerald-specific)
- PokeCommunity thread: battle scripts use `pause` and `waitmessage` commands for pacing
- These can be halved or removed for faster battles
- Located in `data/battle_scripts_1.s`

### 3. Speedchoice Approach (overkill for LoH)
- pokeemerald-speedchoice adds a full Speedchoice menu with many toggles
- Too complex for a single "fast battles" feature

### 4. pokeemerald-expansion Approach
- RHH expansion: message + animation/cry play simultaneously, faster HP drain
- These are always-on improvements, not toggleable

## Risk Factors

- Modifying `src/option_menu.c` requires understanding the save format (option values stored in save data)
- Battle Frontier compatibility: ensure fast battle mode doesn't break existing Frontier logic
- The simplest approach: reuse the existing `BATTLE_ANIM` flag infrastructure — when "Fast Battles" is on, force animations off + reduce `waitmessage` delays

## Key Takeaway

The safest MVP is an Options menu toggle that (a) forces `sAnimationsDisabled = TRUE` and (b) reduces battle script pause durations. This mirrors what FRLG+ and ROWE do and is the community-expected pattern.
