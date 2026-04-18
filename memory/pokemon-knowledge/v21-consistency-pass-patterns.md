# v2.1 Consistency Pass — Quest Reward & QA Patterns

**Cycle**: 237 | **Date**: April 2026

---

## Quest Rewards: Tangible Payoffs Are Non-Negotiable

Unbound's 84-mission system demonstrates the standard: every quest ends with a **tangible, gameplay-relevant reward** — items (Master Ball, Gold Bottle Cap, Beast Balls), TMs, rare Pokémon (Original Color Magearna, Power Construct Zygarde), or area unlocks. Even atmospheric/narrative quests give something concrete.

This is critical for Deoxys Quest II's "handshake" conclusion. The atmospheric resolution is strong, but players expect *something* — even a symbolic item (a meteorite fragment, a new key item, a Deoxys encounter tease for Quest III). Hacks that end multi-location quests with only dialogue get "that's it?" feedback.

**Pattern from Unbound wiki**: Rewards scale with quest difficulty. Multi-location investigation quests (comparable to Quest II) reward at minimum a rare held item or TM, sometimes with an NPC who offers a post-quest service.

## Flag-Gated Dialogue — #1 Community Bug Report

From pokeemerald-expansion GitHub (2025): flag/variable conflicts are the single most common class of bug report. Specific patterns:
- Flags not being set after cutscene completion (player sees pre-quest dialogue post-quest)
- VAR_TEMP variables being overwritten by other scripts on the same map
- Missing `goto_if_set` checks causing dialogue to fire in wrong game states

For C237: systematically verify every custom flag (0x264-0x2A2) has matching set/check pairs. Any Echo NPC dialogue without a flag check is a time bomb.

## Sources
- [Unbound Mission List](https://unboundwiki.com/missions/)
- [Unbound Extras & Side-Quests](https://unboundwiki.com/extras/)
- [pokeemerald-expansion GitHub](https://github.com/rh-hideout/pokeemerald-expansion)
