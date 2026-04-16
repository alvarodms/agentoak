---
name: Battle Frontier Compatibility Audit
description: Audit of all Frontier facilities for P/S split, Fairy, and custom species compatibility. Issues 1/2/4 resolved (C77). Issue 3 (moveset audit) remains open.
type: reference
---

# Battle Frontier Audit (C76-77)

## Verdict: No crash risks. 1 open quality issue.

Issues 1 (Arena sMindRatings), 2 (Factory style arrays), 4 (new species pool) — **all resolved C77**.

## Open: Issue 3 — Frontier Mon P/S Split Mismatches (MEDIUM)

**File**: `src/data/battle_frontier/battle_frontier_mons.h` — 894 entries (882 vanilla + 12 custom)
**Problem**: Gen 3 sets designed for type-based split. Our P/S split made Thunder/Fire/Ice Punch Physical. ~41 entries use Punch moves on SpAtk-focused mons. ~117 use Crunch/Shadow Ball with wrong EV optimization.
**Impact**: AI uses suboptimal sets. Noticeable to competitive players.
**Fix**: Audit 894 entries, adjust EVs/natures/moves. Prioritize Tower/Factory (most visible). Multi-cycle scope.

## Per-Facility Status

| Facility | Status | Notes |
|----------|--------|-------|
| Palace | SAFE | Categorizes by power/target, not type/category |
| Dome | SAFE | Uses sentinel-terminated gTypeEffectiveness |
| Tower | SAFE | Issue 4 resolved |
| Factory | SAFE (AI quality) | Issue 3 affects mon quality |
| Pike | SAFE | Status checks type-correct |
| Arena | SAFE | Issue 1 resolved |
| Pyramid | SAFE | Issue 4 resolved |

## Architecture Notes

- All facilities use centralized `gTypeEffectiveness[]` with Fairy entries (C45)
- Palace independent of P/S split (categorizes by power + target)
- Species constants use u16 fields — no hardcoded limits
