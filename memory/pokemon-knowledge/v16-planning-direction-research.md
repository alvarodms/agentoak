# v1.6 Planning Direction — Community Research

**Cycle**: 178 | **Date**: April 2026

---

## Key Findings

### Difficulty Modes Are Table Stakes for Top-Tier Hacks (2025-2026)

Every hack in the current top-10 lists ships difficulty options:
- **Unbound**: 4 modes (Vanilla/Difficult/Expert/Insane) — the gold standard
- **Radical Red**: Hardcore toggle + randomizer options at game start
- **Emerald Imperium**: Easy/Normal
- **Inclement Emerald**: Multiple difficulty toggles

This is not a nice-to-have — it's an expected feature. Hacks without it are seen as incomplete.

### Implementation Patterns

- Selection happens at game start (new game script), stored in a flag/var
- Common tiers: Easy (reduced AI, no items), Normal (current), Hard (set mode, level caps, smarter AI)
- Simplest approach: flag-gate trainer held items + AI flags. No engine rewrite needed.
- Radical Red's approach: items in bag restricted during battle (harder to implement in decomp)
- Unbound's approach: separate trainer data per difficulty (massive scope)

### Early Game Polish Is the #1 Retention Driver

Research confirms: players decide whether to keep playing in the first 2 hours. Hacks praised for "polish" consistently nail the Littleroot-to-Rustboro corridor. Key patterns:
- Tutorial that teaches hack-specific mechanics naturally
- Early encounter variety that signals "this isn't vanilla"
- NPC dialogue that establishes the hack's identity immediately

### Post-Encounter/Trainer Priority Stack (Community Consensus)

1. Difficulty modes (universal demand)
2. Expanded availability / new species access
3. Postgame depth
4. Engineering polish (UI, QoL)
5. Map changes / new areas (lowest priority — content > structure)
