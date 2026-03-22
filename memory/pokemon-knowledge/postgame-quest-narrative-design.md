# Postgame Quest & Narrative Design Patterns in ROM Hacks

**Cycle**: 82 | **Date**: March 2026

---

## What Top Hacks Do for Postgame Quests

### Structural Patterns
1. **Mission/quest log systems** — Unbound's side quest tracker is the gold standard. 80+ missions with clear objectives. Players know what to do and can track progress.
2. **Tiered postgame** — Reborn separates post-story content into difficulty tiers. Players self-select challenge level.
3. **Narrative-driven legendary hunts** — Infinity, Glazed tie every legendary encounter to story threads. Feels earned, not random.
4. **Post-League story continuation** — Flora Sky reopens legendary storylines after Champion. The story doesn't end at credits.
5. **Multiple endpoints** — Odyssey and Infinity offer multiple endings based on player choices. High replayability.

### What Works for Smaller-Scope Hacks (Emerald-base, no expansion)
- **Structured multi-site investigation** — Send player to 3-4 locations collecting clues/items. Simple flag-based gating. Low technical risk.
- **Reuse existing NPCs and locations** — Avoids needing new maps. Recontextualize familiar spaces.
- **Meaningful reward at the end** — Master Ball, rare species, or unique item. The reward should match the effort.
- **Lore payoff** — Best quests answer a question the player didn't know they had. Revelation > reward.

### Common Pitfalls
- Fetch quests with no narrative thread (go here, talk, go there, talk)
- Rewards that feel anticlimactic after multi-stage effort
- Unclear progression — player doesn't know what to do next
- Quest that contradicts or ignores main story events

## Application to LoH Birch Quest
The design already follows best practices: multi-site investigation, non-linear middle stages, narrative payoff (migration explained), meaningful reward (Master Ball). The non-linearity of stages 1-3 is a strength — mirrors Unbound's mission flexibility. Key risk: ensure each investigation site feels distinct (different NPC personality, different type of clue) rather than "talk to NPC, get item, leave."
