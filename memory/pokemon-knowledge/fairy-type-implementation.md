# Fairy Type Implementation: Design & Balance for LoH

**Cycle**: 44 | **Date**: March 2026

---

## Technical Approaches (Vanilla pokeemerald)

Three viable paths:
1. **DizzyEgg's Battle Engine Upgrade** — cherry-pick Fairy commits (heavy dependency)
2. **Pokémon Modern Emerald** — open-source, minimal Fairy impl to study
3. **Manual implementation** — add TYPE_FAIRY constant, update type effectiveness table, retype species, add moves

For LoH (already on vanilla with manual P/S split), **manual is the right path** — consistent with Cycle 42 decision.

## Implementation Components

1. **Type constant**: Add `TYPE_FAIRY` (value 0x17 per hex convention)
2. **Type effectiveness table**: Fairy SE vs Dragon/Dark/Fighting; resisted by Fire/Poison/Steel; immune to Dragon; weak to Poison/Steel
3. **Species retypes** (Gen 1-3 available in Hoenn):
   - Ralts/Kirlia/Gardevoir: Psychic/Fairy (BST 518 Gardevoir — major buff)
   - Azurill/Marill/Azumarill: Normal→Water/Fairy (Huge Power + Fairy = strong)
   - Mawile: Steel/Fairy (BST 380, still weak but better coverage)
   - Clefairy/Clefable: Normal→Fairy (pure)
   - Snubbull/Granbull: Normal→Fairy (pure)
   - Jigglypuff/Wigglytuff: Normal/Fairy
   - Togetic: Normal/Flying→Fairy/Flying
4. **Moves**: Need at least 1-2 Fairy STAB options. Moonblast (95bp Special) is the standard. Could repurpose an unused move slot or add new.

## Community Consensus on Retypes

**Strong consensus**: Gardevoir Psychic/Fairy, Mawile Steel/Fairy, Azumarill Water/Fairy, Clefairy line pure Fairy, Togetic Fairy/Flying
**Popular but debated**: Milotic Water/Fairy (strategy notes already propose Moonblast for Wallace's Milotic)
**Community fatigue warning**: "Fairy Milotic" is seen as overdone in some circles — consider whether it fits LoH's narrative

## Balance Impact on LoH

- **Dragon starters (Bagon/Dratini lines)** become vulnerable to Fairy — this is intentional and creates late-game counterplay per strategy notes
- **Sidney's Dark team** gets a new weakness — Fairy corridor Pokémon become useful pre-E4
- Gardevoir at 125 SpA with Fairy STAB becomes a top-tier threat
- Azumarill with Huge Power + physical Fairy moves would be extremely strong
