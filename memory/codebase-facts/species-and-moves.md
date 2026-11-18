# Species, moves and animations

Moved verbatim from memory/codebase-facts.md in C380 (index: [../codebase-facts.md](../codebase-facts.md)). Current state, not a log: replace what a new fact makes redundant.

## Species Registration System

27 files per species — all handled by `generate_species.cjs`. Check: `scripts/check_species_registration.sh`. 3 naming conventions: `SPECIES_X`, `NATIONAL_DEX_X`, PascalCase `gMon*_X`.

**Per-species file count**: 27 generator files + 6 manual entries (`pokemon.c`: Hoenn dex, National dex, Hoenn→National order, front anim ID; `pokemon_icon.c`: 2). ~33 total.

**Cry system**: Custom species MUST add cry_ids.h entry `[SPECIES_X - 277] = <base_cry_id>`. Without it, defaults to cry ID 0 (Growlithe).

## Physical/Special Split & Move System (Cycle 43-44, 75, 128, 293, 300)

**MOVES_COUNT** = 381 (IDs 0-380). Last vanilla = MOVE_PSYCHO_BOOST (354). Fairy: 355-357. Gen 4/5: 358-377. Custom signatures: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). Next move ID: 381.

**Iron Leaf** (C293, redesigned C300): Steel/Physical, 85bp, 100acc, 15pp, EFFECT_HIGH_CRITICAL. Sceptile_Hoenn signature. C300 changed from EFFECT_DEFENSE_DOWN_HIT to high-crit to synergize with Tempered Blade (stacks to crit stage 2 = 25%).

**TM/HM fields vs move constants**: The `tmhm_learnsets.h` struct fields correspond to TM/HM assignments, NOT to all moves. Custom Gen4/5 moves (ENERGY_BALL, NASTY_PLOT, etc.) are valid move constants but may NOT be TM fields unless assigned to a TM slot.

**Evolution methods**: Constants 1-17 in `include/constants/pokemon.h`. Custom: `EVO_LEVEL_FEMALE` (16), `EVO_ITEM_FEMALE` (17). Snorunt→Froslass uses `EVO_ITEM_FEMALE` with `ITEM_DAWN_STONE`.

## Battle Animation System (C295, shipped C297)

**Main file**: `data/battle_anim_scripts.s` — `gBattleAnims_Moves` pointer table at top. 381 entries (0-380). `Move_COUNT` = generic fallback (basic hit + shake).

**Custom move animations (C297)**: Move_IRON_LEAF (Steel Wing metallic_shine + Leaf Blade slash), Move_SPORE_FIST (Ice Punch crystals + fist strike + IceCrystalEffectShort), Move_TIDAL_FLARE (Water Pulse bubbles + Ember fire particles). All use recomposed existing sprite templates — no new assets.

**Launcher**: `DoMoveAnim()` in `battle_anim.c:201` indexes into `gBattleAnims_Moves[move]`.

**Key macros**: `metallic_shine`, `create_leaf_blade_task`, `create_cross_impact_sprite`, `create_basic_hitsplat_sprite`, `simple_palette_blend`. All in `asm/macros/battle_anim_script.inc`.

**Shared subroutines**: `IceCrystalEffectShort` (ice hit particles), `FlamethrowerCreateFlames` (fire stream), `EmberFireHit` (fire flare).

**Species count (C308)**: 40 custom species, all 27/27: 12 cross-gen evos + 25 _HOENN forms (9 Changed Three) + Carbink/Toxapex/Lucario line imports. AMBIPOM=448, CARBINK=449, TOXAPEX=450, EGG=451=NUM_SPECIES. **The Changed Three (439-447), Shroomish/Breloom_Hoenn and Carbink all HAVE tmhm_learnsets.h rows** (grep-verified C309; the old "no TM rows" note was wrong).
