# Battle Frontier Compatibility Audit — Cycle 76

**Scope**: All Frontier facilities audited for compatibility with P/S split, Fairy type, and 6 new species.

---

## VERDICT: NO CRASH RISKS — 4 AI QUALITY ISSUES

All Frontier code uses data-driven lookups with sentinel terminators. No hardcoded type counts, no species bounds issues, no array overflows. The Frontier **will not crash**. But AI quality degrades in several measurable ways.

---

## Issue 1: Arena sMindRatings — Missing Entries for 3 Fairy Moves — **RESOLVED (Cycle 77)**

Added `[MOVE_MOONBLAST] = 1, [MOVE_PLAY_ROUGH] = 1, [MOVE_DAZZLING_GLEAM] = 1` to `sMindRatings` in `src/battle_arena.c`.

---

## Issue 2: Factory Move Style Arrays — 3 Fairy Moves Unclassified — **RESOLVED (Cycle 77)**

Added Moonblast/Play Rough/Dazzling Gleam to `sMoves_HighRiskHighReturn[]` in `src/battle_factory.c`.

---

## Issue 3: Frontier Mon Moveset/Stat Mismatches Under P/S Split (MEDIUM)

**File**: `src/data/battle_frontier/battle_frontier_mons.h` — 882 entries
**Problem**: Gen 3 type-based split meant Electric/Fire/Ice Punch were Special, Crunch was Special, etc. Our P/S split made these Physical (matching Gen 4+). Frontier mons designed for Gen 3 now have mismatches:
- **41 entries** use Thunder/Fire/Ice Punch — many on SpAtk-focused mons (e.g., Alakazam with Modest nature + SpAtk EVs running now-Physical Punch moves)
- **~117 entries** use Crunch/Shadow Ball/Hyper Beam — category changes affect optimization
**Impact**: AI opponents use suboptimal sets. Not game-breaking but noticeable to knowledgeable players.
**Fix**: Audit the 882 Frontier mons for category mismatches. Large scope — likely 50-100 entries need EV/nature/move adjustments. This is the same work that Energized Emerald undertook.
**Effort**: Multiple cycles. Consider prioritizing the most-used Frontier mons (Tower/Factory sets) over rarely-seen ones.

---

## Issue 4: New Species Not in Frontier Pool — **RESOLVED (Cycle 77)**

Added 12 Frontier entries (4 sets each for Lucario, Weavile, Garchomp) at indices 882-893. NUM_FRONTIER_MONS updated to 894. All sets above FRONTIER_MONS_HIGH_TIER (849) so they appear in open-level battles only.

---

## Per-Facility Status

| Facility | P/S Split | Fairy Type | New Species | Issues |
|----------|-----------|------------|-------------|--------|
| **Palace** | SAFE | SAFE | N/A | None — categorizes by power/target, not type/category |
| **Dome** | SAFE | SAFE | N/A | None — uses sentinel-terminated gTypeEffectiveness |
| **Tower** | SAFE | SAFE | Not in pool | Issue 4 only |
| **Factory** | SAFE | SAFE | Not in pool | Issue 2 (style arrays), Issue 3 (mon sets), Issue 4 |
| **Pike** | SAFE | SAFE | N/A | None — status immunity checks are type-correct |
| **Arena** | SAFE | SAFE | N/A | Issue 1 (sMindRatings) |
| **Pyramid** | SAFE | SAFE | Not in pool | Issue 4 only (wild mon lists are manual) |

---

## Key Architecture Findings

### Type Effectiveness — Centralized & Safe
All Frontier facilities use `gTypeEffectiveness[]` (defined in `src/battle_main.c:335-463`). This table already has complete Fairy matchups (lines 445-459). Sentinel-terminated with `TYPE_ENDTABLE`. No facility has its own type table.

### Battle Palace — Independent of P/S Split
Move categorization in `src/battle_gfx_sfx_util.c:296-318` (`GetBattlePalaceMoveGroup()`) uses power + target, NOT type or category. ATTACK = power > 0 with offensive target. DEFENSE = targets user. SUPPORT = power == 0. The P/S split is completely invisible to Palace logic.

### Battle Dome AI — Data-Driven
`GetTypeEffectivenessPoints()` at `src/battle_dome.c:2801-2935` loops `gTypeEffectiveness` with sentinel termination. No move category references. Tournament brackets are fixed at 16 trainers. No type count assumptions.

### Battle Arena Mind/Skill/Body
- **Mind** (`sMindRatings`): Indexed by move ID. Array sized to MOVES_COUNT (358). Unassigned entries default to 0. **Our 3 new moves need +1 ratings.**
- **Skill**: Uses `TypeCalc()` from `src/battle_script_commands.c:1536` — same function as regular battles. Already Fairy-aware.
- **Body**: HP-based. No type/category dependency.

### Battle Factory Style Classification
`GetMoveBattleStyle()` searches 7 static move lists. Our new moves aren't in any list → `FACTORY_STYLE_NONE`. Affects AI's assessment of opponent strategy but doesn't crash.

### Species Constants
All Frontier code uses `u16 species` fields and symbolic `SPECIES_*` constants. No hardcoded limits on species ID values. IDs 412-417 are structurally safe everywhere.

---

## Recommended Fix Plan

**Cycle N+1 (Quick wins — 1 cycle):**
1. Add sMindRatings entries for 3 Fairy moves (Issue 1)
2. Add Factory style array entries for 3 Fairy moves (Issue 2)
3. Build + verify

**Cycle N+2 (Optional — Frontier mon pool, 1 cycle):**
4. Design competitive Frontier sets for Lucario, Weavile, Garchomp (Issue 4)
5. Add to `battle_frontier_mons.h`, update NUM_FRONTIER_MONS
6. Add to trainer mon reference lists

**Cycles N+3+ (Large — moveset audit, multi-cycle):**
7. Audit 882 Frontier mons for P/S split stat mismatches (Issue 3)
8. Prioritize Tower/Factory mons (most player-visible)
9. Adjust EVs, natures, or swap moves where category changed
