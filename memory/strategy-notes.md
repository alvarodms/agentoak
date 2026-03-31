# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Vision

**v1.0** (Cycles 2-23): Starters, migration species on routes, trainers refreshed. Complete.
**v2.0** (Cycles 24-86): P/S split, Fairy type, 6 new species, Second Wave, Battle Frontier, QoL. Complete.
**v3.0** (Cycles 89-96): Trainer held items, mid-game encounters/narrative, wild held items, Migration Tracker Quest. Complete.
**v4.0** (Cycles 98-105): Dungeon encounters, gym rematch redesign+dialogue, rival arc, Battle Speed QoL. Complete.
**v5.0** (Cycles 107-116): "The Legends Awaken" — Roaming Raikou/Entei/Suicune, 6 NPC sighting network, Ho-Oh climax in Cave of Origin, post-catch world reaction. Complete.
**v6.0** (Cycles 118-126): "The Primal Stirring" — Groudon/Kyogre environmental arc, remnant trainers, cinematic encounters, world reaction. Complete.
**C127**: Community bug fixes (issue #80) + trainer validation Make target.
**C128**: v7.1 planning — move additions + trainer quality overhaul design (issue #82).

---

# v7.0 — "The Sky Guardian" (Deferred to post-v7.1)

Birch's atmospheric anomaly readings point to Rayquaza. Sky Pillar arc. Setup planted: Birch debrief (C126), Magma/Aqua admin dialogue, Pacifidlog elder.

---

# v7.1 — "Battle Quality Overhaul" (Active)

## Overview
Add 20 Gen 4/5 moves to fill P/S split gaps. Redesign all 8 gym leaders + 4 E4 + Champion teams for strategic identity, correct stat/move alignment, and level curve compliance. Fixes issue #82.

## Move Additions (IDs 358-377, new MOVES_COUNT = 378)

### Simple (reuse existing effects)
| ID | Constant | Type | BP | Acc | PP | Cat | Effect | Notes |
|----|----------|------|----|-----|----|-----|--------|-------|
| 358 | MOVE_NIGHT_SLASH | Dark | 70 | 100 | 15 | Phys | EFFECT_HIGH_CRITICAL | Absol's bread & butter |
| 361 | MOVE_STONE_EDGE | Rock | 100 | 80 | 5 | Phys | EFFECT_HIGH_CRITICAL | Tyranitar upgrade |
| 362 | MOVE_DRAGON_PULSE | Dragon | 90 | 100 | 10 | Spec | EFFECT_HIT | Kingdra Special Dragon |
| 364 | MOVE_AQUA_TAIL | Water | 90 | 90 | 10 | Phys | EFFECT_HIT | Gyarados Physical Water |
| 365 | MOVE_AURA_SPHERE | Fight | 90 | 0 | 20 | Spec | EFFECT_HIT | accuracy=0 = never miss |
| 368 | MOVE_X_SCISSOR | Bug | 80 | 100 | 15 | Phys | EFFECT_HIT | Heracross Bug STAB |
| 369 | MOVE_POISON_JAB | Poison | 80 | 100 | 20 | Phys | EFFECT_POISON_HIT(30%) | Player/route use |
| 370 | MOVE_ICE_SHARD | Ice | 40 | 100 | 30 | Phys | EFFECT_HIT, priority=+1 | Piloswine priority |
| 371 | MOVE_ENERGY_BALL | Grass | 80 | 100 | 10 | Spec | EFFECT_SPD_DOWN_HIT(10%) | Ludicolo/Jynx coverage |
| 372 | MOVE_SHADOW_CLAW | Ghost | 70 | 100 | 15 | Phys | EFFECT_HIGH_CRITICAL | Physical Ghost STAB |
| 373 | MOVE_FLASH_CANNON | Steel | 80 | 100 | 10 | Spec | EFFECT_SPD_DOWN_HIT(10%) | Magneton Steel STAB |
| 374 | MOVE_NASTY_PLOT | Dark | 0 | -- | 20 | Status | EFFECT_SPECIAL_ATTACK_UP_2 | Same as Tail Glow |
| 376 | MOVE_IRON_HEAD | Steel | 80 | 100 | 15 | Phys | EFFECT_FLINCH_HIT(30%) | Garchomp coverage |
| 377 | MOVE_ZEN_HEADBUTT | Psychic | 80 | 90 | 15 | Phys | EFFECT_FLINCH_HIT(20%) | Medicham use |

### Moderate (recoil variants — use existing effects)
| ID | Constant | Type | BP | Acc | PP | Cat | Effect | Notes |
|----|----------|------|----|-----|----|-----|--------|-------|
| 359 | MOVE_BRAVE_BIRD | Flying | 120 | 100 | 15 | Phys | EFFECT_DOUBLE_EDGE (1/3) | Swellow ace move |
| 367 | MOVE_WILD_CHARGE | Electric | 90 | 100 | 15 | Phys | EFFECT_RECOIL (1/4) | Phys Electric option |

### Complex (need new or adapted effects)
| ID | Constant | Type | BP | Acc | PP | Cat | Effect | Notes |
|----|----------|------|----|-----|----|-----|--------|-------|
| 360 | MOVE_FLARE_BLITZ | Fire | 120 | 100 | 15 | Phys | NEW: recoil+burn+thaw | Arcanine Physical Fire |
| 363 | MOVE_CLOSE_COMBAT | Fight | 120 | 100 | 5 | Phys | Adapt EFFECT_SUPERPOWER (Def/SpD-1) | Fighting nuke |
| 366 | MOVE_SUCKER_PUNCH | Dark | 80 | 100 | 5 | Phys | NEW: priority+fail if no atk | Can defer, use Night Slash |
| 375 | MOVE_CROSS_POISON | Poison | 70 | 100 | 20 | Phys | HIGH_CRIT+10% poison | Low priority |

### Implementation Notes
- Flare Blitz: compound effect. Simplify to EFFECT_DOUBLE_EDGE + 10% burn via secondaryEffectChance if new effect is too complex. Self-thaw is nice-to-have.
- Sucker Punch: needs target move check. **If too complex, defer it.** Replace with Crunch on affected trainers.
- Close Combat: adapt EFFECT_SUPERPOWER battle script to lower Def/SpD instead of Atk/Def. Or create EFFECT_CLOSE_COMBAT.
- Cross Poison: lowest priority. Can ship without it.

## Trainer Redesigns (Summary)

### Critical Fixes
- **Wallace**: Remove duplicate Milotic. Add Ludicolo (rain). Gyarados→Aqua Tail+Stone Edge (Physical). Kingdra→Dragon Pulse (Special).
- **Phoebe**: Remove duplicate Gengar. Add Banette (115 Atk Physical Ghost). Shadow Claw on physical ghosts.
- **Glacia**: Remove duplicate Lapras. Add Piloswine (Ice/Ground). Ice Shard for priority.
- **Juan**: Remove duplicate Kingdra. Add Ludicolo (rain synergy). Dragon Pulse on Kingdra.
- **Norman**: Replace Blissey ace with Slaking (Norman's signature, 160 Atk + Truant). Shadow Claw for Ghost coverage.
- **Winona**: Replace Salamence (save for Drake) with Swellow + Brave Bird.
- **Drake**: Replace Shelgon/Dragonair with Salamence/Garchomp. Iron Head on Garchomp.

### Level Curve Correction (ALL trainers lowered)
Roxanne 15 | Brawly 18 | Wattson 24 | Flannery 29 | Norman 31 | Winona 33 | T&L 42 | Juan 46 | Sidney 48 | Phoebe 50 | Glacia 52 | Drake 55 | Wallace 58

### Species Uniqueness: Zero duplicates across E4+Champion (verified)

### Detailed Specs
Full team compositions (species, levels, items, moves) in `memory/pokemon-knowledge/trainer-quality-and-hack-identity.md`

## Implementation Roadmap

**C129 — Move Infrastructure**: Add 20 moves to `battle_moves.h` + `moves.h`. Implement simple+moderate moves first (14 reusing existing effects). Attempt Flare Blitz and Close Combat new effects. Defer Sucker Punch/Cross Poison if complex. Build test.

**C130 — Gym Leaders 1-4**: Roxanne, Brawly, Wattson, Flannery in `trainer_parties.h`. 3 mons each = 12 total. Simplest changes. Build test.

**C131 — Gym Leaders 5-8**: Norman, Winona, Tate&Liza, Juan. Structural changes (Blissey→Slaking, Salamence→Swellow, 6→4 mons for T&L, remove dup Kingdra). Build test.

**C132 — E4 + Champion**: Sidney, Phoebe, Glacia, Drake, Wallace. Most complex (5-6 mons each, many new moves). Remove all duplicates. Build test.

**C133 — Rematch Tier Update + Polish**: Update rematch teams (tiers 1-4) to match new base teams. Run `make check_trainers`. README update with v7.1 changelog.

---

## Technical Reference

### Trainer Modification Checklist
1. Edit primary party struct (first battle)
2. Edit all rematch structs (2-5, for Match Call)
3. Ensure levels scale for rematches
4. Verify all SPECIES_* and MOVE_* constants exist before building

### Wild Encounter JSON Rules
- Land: 12 slots (0-11); probabilities 20/20/10/10/10/10/5/5/4/4/1/1
- Water: 5 slots; Fishing: 10 slots
- File: `pokeemerald/src/data/wild_encounters.json`

### Gen 3 Item Availability (CRITICAL)

Items that do NOT exist in vanilla pokeemerald (Gen 4+):
- ~~Focus Sash~~ -> use **Focus Band** (12% survive chance)
- ~~Choice Scarf/Specs~~ -> use **Scope Lens** or **Shell Bell**
- ~~Life Orb~~ -> use **Shell Bell** or type-boost items
- ~~Black Sludge~~ -> use **Leftovers**

### Flag Plan
Use unused block starting at `0x264` (88 consecutive flags available). ~14 flags used for v6.0 progression. Beast flags (SYSTEM_FLAGS + 0x21-0x27) remain untouched.
