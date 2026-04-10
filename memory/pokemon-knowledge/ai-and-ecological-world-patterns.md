# Trainer AI & Ecological World-Change Patterns in ROM Hacks

**Cycle**: 198 | **Date**: April 2026

---

## Trainer AI: What Hacks Actually Do

No ROM hack has implemented MCTS or any tree-search AI. "Smarter AI" in the community means:
1. **Better team composition** — curated movesets, held items, type coverage (Radical Red, Storm Silver)
2. **AI flag tuning** — pokeemerald's AI is bitfield-based per trainer. Gym leaders/E4 get higher flags than random trainers. pokeemerald-expansion adds configurable AI flags.
3. **Switching improvements** — community patches (PokéCommunity) improve switch-in logic so trainers swap on bad matchups more often.

MCTS on GBA would require: (a) rewriting the AI system in C, (b) massive CPU budget per turn on a 16MHz ARM7, (c) months of development. No hack has attempted it — the ROI is poor because 90% of "smart battle feel" comes from good team design + existing AI flags.

## Ecological Map Changes: What Works

**Pokémon Pisces** remasters Hoenn set years after Emerald — transformed maps, 250+ new Pokémon. This is the closest to Issue #114's vision but required full tileset/map redesign.

Hacks that keep vanilla geography (like Legends of Hoenn) achieve the "world changed" feel through:
- **NPC dialogue** acknowledging environmental shifts
- **Encounter table** changes reflecting new ecology
- **Event scripting** (weather changes, fog, visual cues)
- **Regional forms** as evidence of adaptation

Map transformation (forests→deserts, flooding Fortree) requires tileset editing — the most labor-intensive ROM hack task, far beyond script/data edits.

## Sources
- [PokéCommunity — Trainer AI Command Research](https://www.pokecommunity.com/threads/trainer-ai-command-research.403682/)
- [PokéCommunity — Emerald AI Switching Patch](https://www.pokecommunity.com/threads/emerald-patch-for-vanilla-emerald-that-has-trainer-ai-switch-more.536914/)
- [EmulatorHacks — Yet Another Emerald Hack](https://www.emulatorhacks.com/2026/03/pokemon-yet-another-emerald-hack-gba.html)
