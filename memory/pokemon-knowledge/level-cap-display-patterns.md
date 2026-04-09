# Level Cap Display Patterns in ROM Hacks

**Cycle**: 185 | **Date**: April 2026

---

## How Top Hacks Communicate Level Caps

### Radical Red (FireRed decomp)
- Start menu integration shows in-game time; level cap awareness built into the difficulty system
- PokéCenter assistant can "Set To Level Cap" (QoL cheat option)
- Soft cap based on next boss battle, not badge count
- Players generally expected to consult external documentation or community resources for exact numbers

### Inclement Emerald (Emerald decomp)
- Level caps tied to badges: No badge=16, Stone=25, Knuckle=38, Dynamo=50, Heat=none
- Implemented as soft cap — above the cap, Pokémon earn only 1 EXP per battle
- No prominent in-game UI showing the cap; players rely on community documentation

### Emerald Horizons
- Boss Gauntlet system with progression gating; QoL features include level cap awareness

## Common Implementation Approaches (GBA ROM hacks)

1. **NPC-based** (simplest): A PokéCenter NPC or town NPC that checks badge count and displays the current/next cap. Script-only, no C changes. Most accessible for pokeemerald decomp.
2. **Start menu modification** (moderate): Add a line to the Start menu or Trainer Card showing current cap. Requires C code changes to `start_menu.c` or `trainer_card.c`.
3. **Pokédex/Key Item** (moderate): A key item that displays cap info when used. Requires item registration code.

## Relevance to Legends of Hoenn

v1.6 shipped 4 difficulty-reminder NPCs (Littleroot, Oldale, Petalburg, Rustboro) and badge-based level caps (18→55). Issue #104 asks for cap visibility. The simplest approach: add current/next cap text to the existing difficulty-reminder NPCs. They already check `FLAG_DIFFICULTY_CHALLENGE` — extending their dialogue with cap info is ~5-10 lines of script per NPC.
