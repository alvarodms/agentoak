# Configurable Difficulty in ROM Hacks

**Cycle**: 172 | **Date**: April 2026

---

## Industry Standard: Difficulty Modes Are Expected

Modern ROM hacks overwhelmingly offer difficulty configuration. It's become a baseline expectation:

- **Radical Red**: Choose Hardcore mode, Easy Mode, Easy+Min Grinding at game start. Randomizer options too.
- **Pokemon Unbound**: 4 difficulty tiers (Easy → Insane). Insane requires near-perfect counter-strategy.
- **Pokemon R.O.W.E. 2.0**: 3 difficulties (Easy/Normal/Hard) with different level caps.
- **Pokemon Modern Emerald**: Difficulty level caps (Normal/Hard) + EXP multiplier (x1/x1.5/x2/x0).
- **Emerald Destiny v3.0**: Strict Level Caps toggle + Hard Mode.
- **Inclement Emerald**: Set/Switch mode emphasis, level caps, competitive AI toggle.

## Common Toggleable Features

1. **Level caps** (soft/hard, per-badge) — most common difficulty lever
2. **EXP multiplier** (x0.5/x1/x1.5/x2) — reduces grinding
3. **Set/Switch mode** — forced Set mode in hard difficulties
4. **Item use in battle** — restricted in hardcore modes
5. **EXP Share toggle** (Gen 6 party-wide vs Gen 3 single-holder)
6. **Nuzlocke mode** (built-in encounter/death rules)

## Implementation Complexity (pokeemerald base)

These features require **significant engine-level code changes** — not data edits:
- Level caps need badge-checking logic in the EXP gain function
- EXP multipliers need arithmetic changes in battle result processing
- Nuzlocke mode needs death detection, encounter tracking, UI changes
- A difficulty selection menu needs new UI screens at game start

This is fundamentally different from the data-editing work (trainer teams, encounter tables) that Legends of Hoenn has focused on. It's an engineering project, not a content project.

## Community Sentiment

Players love having options, but the #1 complaint is when difficulty modes feel half-baked — e.g., "Easy mode" that just doubles EXP without adjusting trainer levels. Good difficulty modes require the entire trainer roster to be balanced for each tier.
