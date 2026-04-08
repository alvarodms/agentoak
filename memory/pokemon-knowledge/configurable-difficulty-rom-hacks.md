# Configurable Difficulty in ROM Hacks

**Cycle**: 172–181 | **Date**: April 2026

---

## Industry Standard: Difficulty Modes Are Expected

Modern ROM hacks overwhelmingly offer difficulty configuration. It's become a baseline expectation:

- **Radical Red**: Choose Hardcore mode, Easy Mode, Easy+Min Grinding at game start. Randomizer options too.
- **Pokemon Unbound**: 4 difficulty tiers (Easy → Insane). Insane requires near-perfect counter-strategy.
- **Pokemon R.O.W.E. 2.0**: 3 difficulties (Easy/Normal/Hard) with different level caps.
- **Pokemon Modern Emerald**: Difficulty level caps (Normal/Hard) + EXP multiplier (x1/x1.5/x2/x0).
- **Emerald Destiny v3.0**: Strict Level Caps toggle + Hard Mode.
- **Inclement Emerald**: Set/Switch mode emphasis, level caps, competitive AI toggle.

## Emerald Azure & Imperium — Recent Case Studies (2025-2026)

- **Emerald Azure**: Forces Set mode + level caps for ALL players. Trainers set at the cap. Provides Infinite Candy to reach cap. Player feedback mixed — some say it's fair, others want optionality.
- **Emerald Imperium**: Normal mode forces Set + restricts bag use in trainer battles. Easy mode is still "harder than vanilla" but drops boss levels by 2. Both modes force Set.
- **Key criticism**: When a hack forces Set mode for everyone (no opt-out), casual players feel excluded. When it's opt-in via difficulty mode, the community response is far more positive.

## Changeability: One-Way Ratchet Is the Norm

- **Unbound** allows downgrading difficulty (Expert→Difficult→Vanilla) but NOT upgrading.
- **Radical Red** locks difficulty at game start — no mid-game changes.
- **Player complaints** center on permanent locks when the game turns out harder than expected.
- **Best practice**: Allow downgrading but not upgrading. Players who chose Challenge can escape if stuck; players who chose Normal can't cheese by switching to Challenge for rewards then back.

## Common Toggleable Features

1. **Level caps** (soft/hard, per-badge) — most common difficulty lever
2. **Set/Switch mode** — forced Set mode in hard difficulties
3. **Item use in battle** — restricted in hardcore modes
4. **EXP multiplier** — reduces grinding
5. **Nuzlocke mode** (built-in encounter/death rules)

## Implementation Complexity (pokeemerald base)

These features require **significant engine-level code changes** — not data edits:
- Level caps need badge-checking logic in the EXP gain function
- Set mode override needs a check in `battle_main.c`
- A difficulty selection menu needs multichoice script at game start

## Community Sentiment

Players love having options, but the #1 complaint is when difficulty modes feel half-baked — e.g., "Easy mode" that just doubles EXP without adjusting trainer levels. Legends of Hoenn's approach (2 tiers, same content, additive restrictions) avoids this trap.
