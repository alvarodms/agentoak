# Quest Implementation Priorities After Lost Cycles

**Cycle**: 84 | **Date**: March 2026

---

## Context
Cycles 82 and 83 both crashed (parsing errors), producing zero implementation. The Birch Postgame Research Quest was fully designed in Cycle 81 but has no code in the tree.

## Key Insight: Batch Implementation Over Incremental
The original roadmap spread the quest over 3 cycles (82-84). After two lost cycles, the best approach is to implement the entire quest in one ambitious feature cycle rather than doing one stage at a time. The quest is technically simple — flag checks, dialogue branches, 2 new NPCs — and the design document is complete. The risk of a single-cycle implementation is low.

## Community Expectations for Postgame Quests (from search)
- PokéCommunity scripting tutorials confirm the flag-based `goto_if_set` pattern is standard for multi-stage quests
- Top hacks like Unbound (80+ missions), Odyssey (multiple endings), Lazarus (side quests) all ship postgame quests as key differentiators
- Players expect quest rewards to match effort — Master Ball as final reward is appropriate
- Non-linear middle stages (any order) mirrors Unbound's flexibility and is praised by players

## Implementation Risk Assessment
- **Low risk**: All 6 flags verified available, script patterns understood from Cycle 81 research
- **Medium risk**: 2 new NPCs require map.json edits (Scorched Slab + Meteor Falls B1F) — NPC placement needs care
- **Key pitfall**: Must gate one-time rewards with flags to avoid infinite item bugs (standard practice)
