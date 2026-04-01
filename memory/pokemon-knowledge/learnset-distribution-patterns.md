# Learnset Distribution for New Moves in ROM Hacks

**Cycle**: 132-133 | **Date**: April 2026

---

## Key Findings

### Community Consensus: Learnset Parity Is Non-Negotiable
- **#1 complaint** about ROM hacks with new moves: trainers using moves players can't learn. Seen as "unfair/broken" design.
- Radical Red, Blaze Black/Volt White 2, Supernova Sun all praised for symmetric access.
- PokéCommunity "common pitfalls" thread lists difficulty spikes from illegal trainer moves as top grievance.
- Issue #90 in our repo reflects this exact community expectation.

### Distribution Methods (pokeemerald vanilla)
1. **Level-up learnsets** (`level_up_learnsets.h`): Simplest — add to species' `sLevelUpLearnsets` arrays
2. **TM/HM compatibility** (`tmhm_learnsets.h`): Bitmask arrays, requires TM item mapping
3. **Tutor moves** (`tutor_learnsets.h`): Similar bitmask system
4. Level-up is lowest-friction for our 20 moves — no TM infrastructure needed.

### Priority Species for Each Move (Gen 3 dex)
- Brave Bird: Swellow, Dodrio, Skarmory, Crobat
- Flare Blitz: Arcanine, Blaziken, Camerupt
- Close Combat: Blaziken, Machamp, Heracross, Breloom
- Dragon Pulse: Salamence, Flygon, Altaria, Kingdra
- Stone Edge: Tyranitar, Aggron, Golem, Rhydon
- Night Slash: Absol, Zangoose, Seviper
- Shadow Claw: Banette, Dusclops, Zangoose
- Energy Ball: Vileplume, Roselia, Ludicolo, Sceptile
- Ice Shard: Piloswine, Sneasel, Glalie
- Flash Cannon: Magneton, Aggron, Metagross
- Aqua Tail: Gyarados, Milotic, Crawdaunt
- Aura Sphere: Lucario (if added), otherwise skip
- X-Scissor: Heracross, Pinsir, Scyther/Scizor
- Poison Jab: Seviper, Breloom, Crobat
- Wild Charge: Manectric, Electabuzz, Raichu
- Iron Head: Aggron, Metagross, Steelix
- Zen Headbutt: Medicham, Metagross, Alakazam
- Nasty Plot: Misdreavus, Houndoom, Murkrow
- Cross Poison: Seviper, Crobat
- Sucker Punch: Absol, Shiftry, Mightyena

### Rematch Team Design Patterns (from community)
- Best hacks change team composition across tiers, not just levels
- Tie scaling to story milestones (badges, E4 clear)
- Modern Emerald: rematches scale aggressively, trigger after 10 wild / 5 trainer battles
- Re:Emerald uses ORAS-style story-milestone triggers
