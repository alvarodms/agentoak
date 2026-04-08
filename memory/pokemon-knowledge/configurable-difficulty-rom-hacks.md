# Configurable Difficulty in ROM Hacks

**Cycle**: 172–183 | **Date**: April 2026

---

## Industry Standard: Difficulty Modes Are Expected

Modern ROM hacks overwhelmingly offer difficulty configuration. It's become a baseline expectation:

- **Radical Red**: Choose Hardcore mode, Easy Mode, Easy+Min Grinding at game start. Randomizer options too.
- **Pokemon Unbound**: 4 difficulty tiers (Easy → Insane). Recognized as "gold standard" for polish — but criticized when features feel numerous but unpolished ("tons of imperfect 7/10 features").
- **Inclement Emerald**: Set/Switch mode emphasis, level caps, competitive AI toggle.

## Level Cap Design: Soft vs Hard

- **Hard cap**: Pokémon cannot gain EXP past the threshold. Simple but risks frustrating edge cases.
- **Soft cap (EXP reduction)**: EXP drastically reduced above cap. Prevents softlocks. Unbound gives 1 EXP above cap. Some hacks do 10% EXP.
- **Player feedback**: 10% EXP is aggressive but tolerable if caps are well-spaced. Inclement Emerald players complained about "3-4 EXP per fight" at level 38 — likely too punitive for the mid-game grind feel.
- **Best practice**: Soft cap with dramatic reduction (10% or flat 1 EXP) is the standard. The important thing is that the cap values themselves feel right — not the reduction formula.

## Level Cap Communication (C183 research)

- **Radical Red**: Pokemon Center assistant NPC can tell player their current level cap. Also offers "Set To Level Cap" option (via Rare Candy cheat). The NPC serves as a one-stop difficulty info point.
- **Unbound**: Difficulty info accessible via menu. Multiple NPCs reference difficulty settings.
- **Community expectation**: Players want to KNOW what their cap is without guessing. A single NPC per Pokemon Center is sufficient — don't over-engineer it.
- **Key insight**: The #1 complaint about difficulty systems is when they feel "half-baked." Polish (reminders, clear communication, consistent behavior) matters more than feature count.

## Hoenn-Specific Cap Concerns

Hoenn is semi-open-world, so a linear level cap can punish explorers. Caps should match natural play level (fighting most trainers), not the shortest path. If a player fights every trainer before Roxanne and naturally reaches Lv15, the cap shouldn't be 12.

## Changeability: One-Way Ratchet Is the Norm

- **Unbound** allows downgrading difficulty but NOT upgrading.
- **Radical Red** locks difficulty at game start — no mid-game changes.
- Best practice: Allow downgrading but not upgrading.

## Community Sentiment

Players love having options. Most people play Radical Red on minimal grinding mode. The biggest criticism of difficulty hacks (even beloved ones like Unbound) is unpolished execution, not missing features.
