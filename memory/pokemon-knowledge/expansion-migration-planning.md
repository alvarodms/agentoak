# pokeemerald-expansion Migration: Planning & Design Implications

**Cycle**: 40 | **Date**: March 2026

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

## 2026 Migration Tooling Updates

**Version 1.15** includes improved migration automation:
- Automated scripts for common breaking changes: `givemon_balls_typechange.py`, `trainer_party_ball_type_change.py`
- **Phased merge strategy** to reduce conflicts: specific git commits recommended for incremental merging
- Python3-based automated script execution from project root

**Key workflow improvement**: `chmod +x migration_scripts/*.py; python3 migration_scripts/*.py` handles most data structure migrations automatically. Manual resolution still required for file-level conflicts in heavily customized projects.

## Cycle 40 Research Findings - Direct Codebase Assessment

**Status**: **MIGRATION FEASIBLE** with moderate technical complexity. Direct comparison completed between current pokeemerald base and expansion v1.15.0.

### Critical Breaking Changes Identified

**1. Trainer Data Format Overhaul** (HIGH IMPACT)
- **Current**: `src/data/trainer_parties.h` with C struct definitions
- **Expansion**: `src/data/trainers.party` with competitive syntax
- **Impact**: All 164+ custom trainer teams require complete format conversion
- **Sample conversion**: `sParty_Roxanne[]` struct → `=== TRAINER_ROXANNE_1 === Name: ROXANNE` syntax
- **Migration tools**: Available in `migration_scripts/1.15/trainer_party_ball_type_change.py`

**2. Physical/Special Split Implementation** (MAJOR BENEFIT)
- **Status**: Fully functional in expansion codebase
- **Technical verification**: `src/data/moves_info.h` shows expanded move data with proper damage categories
- **Example**: MOVE_CRUNCH now properly classified as Physical (benefits Tyranitar builds)
- **Impact**: Transforms every battle, especially for our Dragon/Dark starter lines

**3. Wild Encounter Compatibility** (LOW IMPACT)
- **Current format**: JSON-based wild encounters preserved
- **Expansion format**: Same JSON structure, possible new optional fields
- **Migration risk**: Minimal - our 107 modified encounter areas should port cleanly

### High-Conflict Files for Legends of Hoenn
- `src/data/trainer_parties.h` → `src/data/trainers.party` (FORMAT CHANGE - requires conversion)
- `src/data/wild_encounters.json` (73 routes + 34 dungeons modified) - LOW RISK
- `src/new_game.c` (auto-run, starter customizations) - MEDIUM RISK
- `src/party_menu.c` (reusable TMs) - LOW RISK

**Migration complexity estimate**: 3-5 cycles for trainer team conversion + testing

## 2025 Design Patterns That Work

- **Physical/Special split** is now the most-cited gameplay differentiator in top 2025 hacks (Theta Emerald EX, Project Nova, Evolved). Players notice immediately.
- **Fairy type as counter to Dragon** is particularly impactful for a Dragon-heavy hack like Legends of Hoenn — creates natural new tension in encounter design.
- **Modern Emerald** approach: make Fairy and P/S split the headline features; rebuild encounter tables around the new type chart.

## Design Priority for Legends of Hoenn v2.0

1. **Physical/Special split** — transforms combat feel for Tyranitar (Crunch becomes Physical), Salamence (Dragon Claw becomes Physical), Dragonite (ExtremeSpeed). All three starters benefit enormously.
2. **Fairy type** — reshapes the Dragon routes; introduces counterplay. Gen 4 Fairy Pokémon (Togekiss, Sylveon via eevee, Gardevoir retypes) fit the migration narrative.
3. **Expanded species pool** — Gen 4/5 species like Garchomp, Lucario, Weavile fit the "legendary-adjacent migrant" theme naturally.
4. **Postgame expansion** — Elite Four rematches with upgraded teams using new mechanics = high retention.

## Cycle 40 Recommendation

**PROCEED** with pokeemerald-expansion migration for v2.0. The benefits clearly outweigh the technical effort:

**Pros:**
- Physical/Special split revolutionizes battle system
- Migration tools and clear documentation exist
- Active development community and future-proofing
- Perfect foundation for modern Pokemon features

**Cons:**
- 3-5 cycles required for trainer format conversion
- Learning curve for competitive syntax
- Potential for merge conflicts in heavily modified files

**Next cycle decision point**: Begin migration planning or pursue alternative v2.0 direction with current base.

**Sources**: [pokeemerald-expansion GitHub](https://github.com/rh-hideout/pokeemerald-expansion), [migration scripts README](https://github.com/rh-hideout/pokeemerald-expansion/blob/master/migration_scripts/README.md), [Releases](https://github.com/rh-hideout/pokeemerald-expansion/releases), [New Pokémon ROM Hacks 2025-2026](https://romhaven.com/games/Pokemon-new-rom-hacks.html)