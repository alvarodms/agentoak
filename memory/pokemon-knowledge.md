# Pokémon Knowledge Base

Research findings about Pokémon games, ROM hacks, community expectations, and design patterns — gathered via web search by the Pokémon Specialist advisor.

---

## Physical/Special Split in Late Development (March 2026)

**Research Question**: Is implementing the physical/special split worth it late in ROM hack development?

**Findings**: The physical/special split has been successfully implemented in top-tier ROM hacks and is generally well-received by the community, even when added late in development.

**Evidence from Successful Hacks**:
- **Radical Red** and **Inclement Emerald** both feature the split and are among the most praised ROM hacks
- Technical implementation is feasible with existing tools like "Gen3Tools" for modifying the 11th byte of move data
- **Strategic Benefits**: Enhances movepool viability (Salamence can use physical Dragon moves, Sharpedo gets physical STAB, Swampert becomes fully physical)

**Trade-offs**: Some early-game Pokémon lose viability (Aron, Electrike, Plusle/Minun struggle more), requiring rebalancing consideration.

**Community Reception**: Positive - players appreciate the enhanced strategic depth and see it as a quality-of-life improvement.

**Sources**: [PokemonCoders Physical Special Split](https://www.pokemoncoders.com/best-pokemon-rom-hacks-physical-special-split/), [Smogon Gen3 PSS Discussion](https://www.smogon.com/forums/threads/3rd-gen-with-physical-special-split-retiering.3643953/), [ROMHacking.net PSS Discussion](https://www.romhacking.net/forum/index.php?topic=35469.0)

## ROM Hack Polish and Finishing Touches (March 2026)

**Research Question**: What finishing touches make ROM hacks memorable and beloved?

**Key Polish Features That Elevate ROM Hacks**:

1. **Completion and Stability**: Players heavily prioritize completed, bug-free experiences over feature-rich but incomplete hacks
2. **Quality of Life Improvements**: Reusable TMs, running shoes from start, battle speed-ups, unlimited bag space, auto-run features
3. **Narrative Cohesion**: Environmental storytelling, consistent dialogue, and mature themes that feel authentic
4. **Strategic Depth**: Enhanced AI, competitive movesets, proper held item usage, and balanced difficulty scaling

**Community Priorities (2024-2025)**:
- **Complete experiences over new features**: "Pokémon Unbound consistently ranks as the top choice due to its polish"
- **Strategic battle mechanics**: Players value "champion-level AI, competitive movesets, and better held items"
- **Mature narratives**: Community appreciates "dark storylines reflecting manga's mature tone"

**Examples of Excellent Polish**:
- **Pokémon Unbound**: "Most customizable Pokémon game ever" - focuses on customization and quality
- **Pokémon Gaia**: "Rich lore and modern mechanics" with comprehensive implementation
- **Emerald Seaglass**: "Smart, subtle tweaks" that make it feel like a "polished, lost classic"

**What NOT to Focus On**: Feature creep, unnecessary complexity, or architectural changes that risk stability in mature projects.

**Sources**: [DualShockers Best ROM Hacks](https://www.dualshockers.com/best-pokemon-rom-hacks-2024/), [ScreenRant ROM Hacks Ranking](https://screenrant.com/best-pokemon-rom-hacks/), [PokéHarbor 2024 Completed Hacks](https://www.pokeharbor.com/2024/03/20-best-completed-pokemon-rom-hacks-of-2024/), [ROM Hacks Showcase](https://www.pokecommunity.com/forums/rom-hacks-showcase.184/)

## Wild Held Items vs Trainer Held Items Priority

**Key Finding**: The community values held items primarily for **strategic trainer battles** rather than wild Pokémon collection. Players appreciate when "gym leaders and boss trainers use competitive-style teams with optimized movesets and weather strategies."

**Implementation Focus**: Strategic held items on trainers > wild Pokémon held items for discovery.

## Trainer Held Items: The Hallmark of Elite ROM Hacks (March 2026)

**Research Question**: How do top-tier hacks implement trainer held items and how does the community respond?

**Key Findings from Inclement Emerald & Radical Red**:

- **Inclement Emerald Challenge Mode** documents complete trainer data: each gym leader has 4 Pokémon with abilities, natures, IVs, EVs, and held items specifically chosen for their role. This level of detail is heavily praised.
- **Radical Red** is praised for being "hard but reasonably paced and properly balanced" — distinct from "troll hard" Kaizo-style games. The key distinction: gym leaders have strong held items AND strong movesets, but the player has fair access to counter-strategies.
- Community notes that "properly balanced" difficulty (Radical Red) > "troll difficulty" (Kaizo). Players want to feel outplayed by smart trainer design, not overwhelmed by cheap cheap mechanics.
- Frisk/CompoundEyes increasing wild held item encounter rate is a QoL mechanic players appreciate for item farming.

**Design Pattern for Trainer Held Items**:
- Early gyms: simple boosts (X-item equivalents like Oran Berry, type-enhancing plates)
- Mid gyms: Choice items, Leftovers, Lum Berry for status prevention
- Late gyms/Elite Four: Focus Sash, Life Orb, Choice Band/Specs — full competitive sets
- Champion: Full EV-trained competitive team with optimized held items

**Critical Rule**: Hard = smart, not cheap. Trainers should have items that reward the player for thinking, not items that feel unfair (no Sleep Powder + Bright Powder spam).

**Sources**: [Inclement Emerald PokéCommunity Thread](https://www.pokecommunity.com/threads/pokémon-inclement-emerald-a-decomp-difficulty-hack-version-1-13.457039/), [Inclement Emerald Challenge Mode Docs](https://www.scribd.com/document/598841293/Inclement-Emerald-Challenge-Mode-Trainers-Docs), [Radical Red PokéCommunity Thread](https://www.pokecommunity.com/threads/pokémon-radical-red-version-4-1-released-gen-9-dlc-pokemon-character-customization-now-available.437688/)
