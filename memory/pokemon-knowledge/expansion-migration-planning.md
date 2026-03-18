# pokeemerald-expansion Migration: Planning & Design Implications

**Cycle**: 39 | **Date**: March 2026

---

**Research Question**: What's the practical migration path and key design decisions when planning a v2.0 on pokeemerald-expansion?

## Technical Migration Path

pokeemerald-expansion recommends upgrading **one minor version at a time** via git:
```
git remote add RHH https://github.com/rh-hideout/pokeemerald-expansion
git pull RHH expansion/X.Y.Z
```
Python migration scripts handle breaking system changes (e.g., `.aif → .wav` audio, `tmIlliterate → teachingType` flag). Scripts are in `migration_scripts/` and must be run per-version step.

**Key implication**: The migration is incremental, not a single leap — but it still requires manual conflict resolution at each step. For a project with ~38 cycles of customizations, budget 5-8 cycles minimum.

## 2025 Design Patterns That Work

- **Physical/Special split** is now the most-cited gameplay differentiator in top 2025 hacks (Theta Emerald EX, Project Nova, Evolved). Players notice immediately.
- **Fairy type as counter to Dragon** is particularly impactful for a Dragon-heavy hack like Legends of Hoenn — creates natural new tension in encounter design.
- **Modern Emerald** approach: make Fairy and P/S split the headline features; rebuild encounter tables around the new type chart.

## Design Priority for Legends of Hoenn v2.0

1. **Physical/Special split** — transforms combat feel for Tyranitar (Crunch becomes Physical), Salamence (Dragon Claw becomes Physical), Dragonite (ExtremeSpeed). All three starters benefit enormously.
2. **Fairy type** — reshapes the Dragon routes; introduces counterplay. Gen 4 Fairy Pokémon (Togekiss, Sylveon via eevee, Gardevoir retypes) fit the migration narrative.
3. **Expanded species pool** — Gen 4/5 species like Garchomp, Lucario, Weavile fit the "legendary-adjacent migrant" theme naturally.
4. **Postgame expansion** — Elite Four rematches with upgraded teams using new mechanics = high retention.

**Sources**: [pokeemerald-expansion GitHub](https://github.com/rh-hideout/pokeemerald-expansion), [migration scripts README](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/migration_scripts/README.md), [PokemonCoders Physical/Special Split hacks](https://www.pokemoncoders.com/best-pokemon-rom-hacks-physical-special-split/)
