# Elite Four Rematch Design & Fairy Move Implementation

**Cycle**: 48 | **Date**: March 2026

---

## Adding Moves to Vanilla pokeemerald — Critical Files

The Cycle 45 build failure was likely caused by using **non-existent EFFECT constants** (e.g., `EFFECT_SPECIAL_ATTACK_DOWN_HIT`). In vanilla pokeemerald, effect constants are in `include/constants/battle_move_effect.h`. Key principle: **reuse existing effects** rather than inventing new ones.

Safe EFFECT mappings for Fairy moves:
- **Moonblast** (95bp, 30% SpA drop): Use `EFFECT_SPECIAL_ATTACK_DOWN_HIT` — but VERIFY this exists in vanilla. If not, use `EFFECT_HIT` as fallback.
- **Play Rough** (90bp, 10% Atk drop): Use `EFFECT_ATTACK_DOWN_HIT` — same verification needed.
- **Dazzling Gleam** (80bp): `EFFECT_HIT` (no secondary effect needed for basic implementation)
- **Draining Kiss** (50bp): `EFFECT_ABSORB` (existing drain effect)
- **Disarming Voice** (40bp): `EFFECT_HIT` with `FLAG_KEEP_HP_BAR` or just `EFFECT_HIT`

Also required but missed in Cycle 45:
- `src/data/contest_moves.h` — contest move entries
- `src/data/text/move_descriptions.h` — description strings
- `src/data/text/move_names.h` — name strings

## Elite Four Rematch Design — Best Practices from Top Hacks

Key principles from Radical Red, Inclement Emerald, Elite Redux:

1. **Hand-crafted teams, not level bumps**: Each rematch tier should have distinct team compositions, not just +10 levels
2. **Competitive movesets with held items**: Full 4-move coverage sets, strategic held items (Leftovers, Choice items, Life Orb)
3. **Fair difficulty**: Give players access to the same tools (EVs, competitive items, move tutors) that AI trainers use
4. **Multiple rematch tiers**: Elite Redux does up to 4 distinct rematches per E4 member
5. **Thematic consistency**: Each E4 member should deepen their type specialty, not just add random strong Pokemon
6. **Dual team setups**: Radical Red gives each E4 member TWO possible teams — adds replayability and prevents memorization
7. **Weather/terrain strategies**: E4 teams in top hacks often build around weather (hail for Ice, sand for Rock/Ground) — not just raw stats
8. **Legendaries for rematches only**: Inclement Emerald reserves legendaries for E4 rematch battles, creating a clear power escalation

For LoH specifically:
- Strategy notes already have a solid E4 rematch plan (Sidney gets Night Slash, Phoebe gets Dusknoir, etc.)
- With P/S split done, physical Dark/Ghost moves now hit differently — rematch teams should exploit this
- Fairy type creates new E4 counterplay: Fairy Pokemon are strong vs Sidney (Dark) and Drake (Dragon)
- **Togetic concern**: As a wild encounter on Route 120, Togetic has only 405 BST and 40 Spe — without Togekiss evolution it's underwhelming as a "Dragon-counterplay" Pokémon. Consider whether Gardevoir (retyped to Psychic/Fairy) is the real Dragon answer and Togetic is more of a support/tank option.
