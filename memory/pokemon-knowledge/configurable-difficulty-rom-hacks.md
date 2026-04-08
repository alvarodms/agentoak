# Configurable Difficulty in ROM Hacks

**Cycle**: 172–182 | **Date**: April 2026

---

## Industry Standard: Difficulty Modes Are Expected

Modern ROM hacks overwhelmingly offer difficulty configuration. It's become a baseline expectation:

- **Radical Red**: Choose Hardcore mode, Easy Mode, Easy+Min Grinding at game start. Randomizer options too.
- **Pokemon Unbound**: 4 difficulty tiers (Easy → Insane). Insane requires near-perfect counter-strategy.
- **Inclement Emerald**: Set/Switch mode emphasis, level caps, competitive AI toggle.

## Level Cap Design: Soft vs Hard

- **Hard cap**: Pokémon cannot gain EXP past the threshold. Simple but risks frustrating edge cases (can't reach cap if 1 EXP short).
- **Soft cap (EXP reduction)**: EXP drastically reduced above cap. Prevents softlocks. Unbound gives 1 EXP above cap. Some hacks do 10% EXP.
- **Player feedback**: 10% EXP is aggressive but tolerable if caps are well-spaced. Inclement Emerald players complained about "3-4 EXP per fight" at level 38 — likely too punitive for the mid-game grind feel.
- **Best practice**: Soft cap with dramatic reduction (10% or flat 1 EXP) is the standard. The important thing is that the cap values themselves feel right — not the reduction formula.

## Hoenn-Specific Cap Concerns

Inclement Emerald's creator flagged a Hoenn-specific issue: **the region is semi-open-world**, so a linear level cap can punish players who explore and battle every trainer. Caps should be set assuming the player fights most available trainers — not just the shortest path. Radical Red's Kanto is more linear so caps are simpler.

Key principle: **Caps should match natural play level, not minimum-encounters level.** If a player fights every trainer before Roxanne and naturally reaches Lv15, the cap shouldn't be 12.

## Changeability: One-Way Ratchet Is the Norm

- **Unbound** allows downgrading difficulty but NOT upgrading.
- **Radical Red** locks difficulty at game start — no mid-game changes.
- Best practice: Allow downgrading but not upgrading.

## Community Sentiment

Players love having options. #1 complaint is when difficulty modes feel half-baked. Legends of Hoenn's 2-tier approach (Normal/Challenge, same content, additive restrictions) is well-aligned with community expectations.
