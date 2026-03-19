# Encounter Design Patterns in ROM Hacks

**Cycle**: 47 | **Date**: March 2026

---

## Core Design Principles

### Species Placement Philosophy
- **Late game routes for evolved Pokémon. Early game routes for NFE's** - fundamental rule most ROM hack creators follow
- **Avoid random combinations**: Species like Skarmory and Ditto stick out when placed inappropriately on early routes
- **Consider type relationships**: Most Pokemon being weak to upcoming gym types creates poor starter balance (e.g., the "Brock problem" with Charmander)
- **Logical rarity distribution**: Don't make the weakest Pokemon rare encounters - creates poor player experience

### Encounter Rate Standards
- **Grass encounters**: ~10% standard rate
- **Cave/Water encounters**: ~5% standard rate
- **Slot distribution**: 20,20,10,10,10,10,5,5,4,4,1,1 (top to bottom)
- **1% encounter rate**: Reserved only for legendary Pokemon, not regular species

### Progression Curve Management
- **Consistent challenge over spikes**: Overhauled level curves for smooth difficulty without arbitrary spikes
- **Early-Mid-Late game balance**: All Pokemon should have viable STAB coverage throughout progression
- **10 level rule**: Successful difficulty hacks often place players ~10 levels behind opponents with competitive movesets

## Fairy-Type Integration Best Practices

### Successful Implementation Examples
- **Radical Red**: Maintains balance through specific rules (no accuracy/evasion moves, Sleep Clause, OHKO removal)
- **Inclement Emerald**: Distributes encounters without overcrowding, uses environmental systems (sand mounds, berry trees)
- **Focus**: Thoughtful integration rather than arbitrary addition, with careful attention to competitive viability

### Balance Considerations
- **Dragon counterplay**: Fairy-types provide necessary balance against Dragon-heavy ecosystems
- **Type effectiveness**: Consider how Fairy interactions affect existing team compositions
- **Movepool support**: Ensure Fairy-types have appropriate STAB moves available at appropriate levels

## Modern ROM Hack Standards

### Accessibility Improvements
- **Full Pokemon access**: Modern hacks make more species available earlier (249 species catchable pre-Elite Four in top hacks)
- **Meaningful encounters**: Every route should offer species worth catching, not filler
- **Environmental diversity**: Use natural systems (caves, water, hidden areas) for logical species placement

### Design Philosophy
- **Intentional over arbitrary**: Best hacks feel intentional, not just harder but smarter
- **Fair distribution**: Players should have access to same tools (EVs, items, moves) that AI trainers use
- **Strategic depth**: Force learning of type cores, pivoting, item timing, boss-specific counterplay