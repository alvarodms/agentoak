---
name: Expansion Migration C41 Strategy
description: C41 build attempt findings — pokeemerald-expansion is architecturally incompatible with overlay approach. Decision archived.
type: reference
---

# Expansion Migration C41 — Key Findings

**Merged into**: [expansion-migration-planning.md](expansion-migration-planning.md) — see that file for the full decision record.

## Critical Discovery

The rsync + git checkout overlay approach fails because:
1. `struct BattleResources` has completely different members
2. Dozens of vanilla globals renamed/removed in expansion
3. Battle AI completely rewritten — 200+ errors
4. `gBattleMoves`, `gActiveBattler`, `gDisableStructs` all removed/renamed

## Trainer Format Reference

Expansion uses `.party` files compiled by `trainerproc` tool (Pokémon Showdown syntax):
```
=== TRAINER_ROXANNE_1 ===
Name: ROXANNE
Geodude
Level: 12
IVs: 0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe
```

**Lesson**: Correct migration = fresh expansion clone + port content in. Not overlay.
