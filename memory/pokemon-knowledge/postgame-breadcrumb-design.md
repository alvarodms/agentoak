# Postgame Breadcrumb & Player Direction Design

**Cycle**: 139 | **Date**: April 2026

---

## Key Findings

### How Top Hacks Handle Postgame Direction

**Unbound** — Gold standard. Uses a **journal/quest log system** that tracks available and completed quests. Players always know what's available. Side quests unlock key mechanics (e.g., Mega Evolution locked behind a quest). This is a binary hack with custom UI — not feasible for a decomp without significant C work.

**Reborn** — Every significant NPC gets a postgame chapter closing out their story while the player hunts legendaries. The narrative gives each legendary encounter context through character arcs, not just "go to cave, catch legendary."

**General pattern** — The best hacks tie each legendary to a story event so encounters don't feel random. Tiered progression (unlock next tier after completing current events) keeps players on track.

### Breadcrumb Strategies Without a Quest Log

For GBA decomps without custom UI:
1. **Hub NPC** — A central character (professor, rival) who updates dialogue after each milestone. Player learns to check back.
2. **Post-event NPC hints** — After catching a legendary, an NPC in the same area says "I heard Professor [X] was looking for you" or "Strange readings from [next location]."
3. **Pokegear/phone calls** — Gen 2 style. Not in Emerald natively but could be simulated with forced NPC encounters or Pokenav messages.
4. **TV broadcasts** — Emerald has a TV system. Postgame TV reports could hint at next steps.
5. **Rival encounters** — Rival appears at key transition points to nudge the player toward the next objective.

### What NOT to Do
- Don't require players to randomly visit a specific NPC with no prompt
- Don't make the next step depend on exploring an area with no reason to revisit
- Don't lock major content behind obscure triggers that only dataminers would find

## Relevance to C139

The Legends of Hoenn postgame currently requires unprompted Birch Lab visits at every transition — exactly the anti-pattern. NPC breadcrumbs at each transition point (post-E4, post-beasts, post-Ho-Oh, post-primals) are the right fix. Consider the TV system as a secondary channel.
