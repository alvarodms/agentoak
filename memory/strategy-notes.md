# Strategy Notes

> **Maintenance**: Keep under ~200 lines. Delete completed items older than 10 cycles. Current vision + active plans only.

---

# LEGENDS OF HOENN — Version History

**v1.0-v1.6** (C2-183): Core hack foundation — starters (Larvitar/Bagon/Dratini), P/S split, Fairy, species pipeline, encounters, trainers, QoL, Battle Frontier, legendary saga, difficulty modes, first impressions.
**v1.7** (C184-191): "The Gathering Storm" — Late-game atmosphere arc. City NPCs, ocean witnesses, Deep Migration, The Gathering, post-Gathering callbacks.
**v1.8** (C192-200): "The Living Region" — 4 postgame quests, 2 regional forms (Corsola_Hoenn, Growlithe_Hoenn/Arcanine_Hoenn), species pipeline.
**v1.9** (C201-210): "The New Normal" — E4 & Champion overhaul, "The Exhale", 2 mid-game forms, Deoxys quest, challenge_mode_scaling.h.
**v2.0** (C212-225): "Deeper Roots" — 5 cross-gen evos, Bagon_Hoenn (Dragon/Rock), species validation suite, Mom's send-off.
**v2.1** (C226-238): "A Changed Hoenn" — Cyan protagonist palette, 2 mid-game forms, Echo dialogue layer, Deoxys Quest II, Changed Trainer reactions.
**v2.2** (C239-253): "The Cosmic Form" — Deoxys_Hoenn (Poison/Fairy) + Toxic Touch, Quest III, trainer narrative pass, Magma/Aqua reckoning, Gligar_Hoenn + Gliscor_Hoenn.
**v2.3** (C254-267): "Roots" — Species generator (26-file), trainer generator, 5 early-game regional forms (Lotad/Shroomish/Lombre/Breloom/Ludicolo_Hoenn), ability identity pass, Glacia redesign.
**v2.4** (C268-273): "The Proving Ground" — Gym leader migration pass complete (Brawly/Norman/Drake/Wattson/Juan/Wallace), Wally VR redesign, rival arc (Brendan/May Route 110 + Lilycove teams + dialogue).
**v2.5** (C274-281): "The Changed Three" — Treecko/Torchic/Mudkip Hoenn lines (9 species, Steel/Fairy/Fighting triangle), wild encounters, postgame Birch gift, rival integration.
**v2.6** (C282-286): "The Reckoning" — Boss diversity pass, 6-NPC villain postgame arc, Birch collection quest (PP_MAX), dialogue polish.
**v2.7** (C288-294): "The Living Difference" — Mechanical identity for all 25 regional forms. 3 custom abilities (Frozen Spore, Scalding Touch, Toxic Touch), 10/10 Tier 2 ability reassignments, 3 signature moves (Spore Fist, Tidal Flare, Iron Leaf). Changed Three fully registered (9 species, 27 files each). Species count: 36 custom (11 cross-gen + 25 _HOENN), all registered.
**v2.8** (C296-300): "The Player's Hoenn" — Polish pass. BW-style repel prompt, 3 custom battle animations, dialogue subtraction (Tell:Show 7:2->4:5 in Hours 3-6), Brawly/Wattson gym leader dialogue rewrite, Growlithe_Hoenn on R118, Tempered Blade (4th custom ability, Sceptile_Hoenn), Iron Leaf redesigned to high-crit synergy. **COMPLETE.**

---

# v2.9: "The Last Witness"

**Theme**: The migration narrative's climax. For 15 hours, the player has witnessed Hoenn transform — new forms appearing, gym leaders adapting, villains reckoning with consequences. The Champion fight should be where that story converges. When the credits roll, the player should feel: "Hoenn's transformation was real, and I was its witness."

**Design hypothesis**: If Wallace's dialogue frames the battle as the migration's final exam — testing whether the player *understood* the transformation, not just survived it — the pre-credits emotion shifts from "I beat the hard fight" to "Hoenn's story ends here too."

## Roadmap (~10 cycles)

| Cycle | Mode | Objective | Issues |
|-------|------|-----------|--------|
| 301 | planning | Design v2.9 arc | — |
| 302 | refactor | Changed Three learnset fix (CRITICAL) + JSON trainer config extraction | — |
| 303 | feature | Champion dialogue rewrite — Wallace as migration's final witness | #182 |
| 304 | feature | Ambipom species (Normal) + Norman roster fix | #180 partial |
| 305 | feature | Carbink species (Rock/Fairy) + Roxanne roster fix | #180 partial |
| 306 | feature | Toxapex species (Poison/Water) + Juan roster fix | #180 partial |
| 307 | feature | Blaziken_Hoenn custom ability (ABILITY_82) | — |
| 308 | feature | Swampert_Hoenn custom ability (ABILITY_83) | — |
| 309 | feature | Field Notes key item (stretch goal) | — |
| 310 | patch | v2.9 polish pass | — |

## Changed Three Learnset Gap (CRITICAL BUG — C302 P0)

ALL 9 Changed Three species (Treecko/Grovyle/Sceptile/Torchic/Combusken/Blaziken/Mudkip/Marshtomp/Swampert _Hoenn) are **completely missing** from both `level_up_learnsets.h` and `level_up_learnset_pointers.h`. The JSON configs have full movesets but the generator never compiled them into these two files.

**Impact**: Player-raised Changed Three starters learn ZERO moves by level up. They're stuck with whatever moves they had when obtained. The entire v2.5 "The Changed Three" and v2.8 Tempered Blade + Iron Leaf design only works on trainer-owned Pokémon. This is the worst bug in the hack's history — the signature feature is broken for players.

**Fix scope**: 9 learnset arrays + 9 pointer entries. Either fix the generator or hand-write entries from the JSON configs. Must ship in C302 before any other v2.9 work.

## Champion Dialogue Direction (#182)

Wallace already has 3 migration species: Ludicolo_Hoenn (Electric/Grass), Arcanine_Hoenn (Water/Fire), Ninetales_Hoenn (Ice/Fairy). The team composition is correct — the dialogue needs reframing.

**Current problem**: Wallace's dialogue is self-centered. "I called it the most beautiful thing I'd ever witnessed." "My team is a gallery of what HOENN has become." "Can you appreciate art that fights back?" This frames the Champion battle as Wallace's aesthetic exhibition. The player is an audience member, not a participant in the migration's story.

**Target**: Reframe the battle around the PLAYER's journey. Wallace should recognize the player as a fellow witness — someone who walked every route, saw every form, and understood what happened. The battle is the final exam: not "can you beat my art gallery?" but "did you understand what Hoenn became?"

**Pre-battle direction**: Wallace acknowledges the player has seen what he's seen. Two witnesses meeting. "You walked those routes. You saw them change. So did I. My team is my answer to what Hoenn became — show me yours."

**Post-battle direction**: Emotional closure. Wallace realizes the difference — he collected migration species because they were beautiful; the player raised them because they were *theirs*. "I traveled every route looking for beauty. You traveled every route and it found *you*." The parallel: Hoenn changed, the player changed with it.

**Re-talk**: Lighter. Fellow travelers. Wallace is glad someone else finally understands.

## Roster Fixes (#180) — Status & Sequencing

**Corsola_Hoenn on Phoebe**: ALREADY DONE. Present on base team + rematch tiers 2, 3, 4. No work needed.

Remaining 3 items each require a new species (27-file pipeline) + trainer party integration:

- **Ambipom** (Normal, Gen 4) → Norman T3+. Cross-gen evo of Aipom. Fast Technician attacker with Fake Out/Double Hit. Add without Aipom (precedent: Farigiraf exists without wild Girafarig). Norman's dialogue already references Normal-types learning new tricks — Ambipom embodies this.
- **Carbink** (Rock/Fairy, Gen 6) → Roxanne T2+. Defensive pivot with Clear Body. A crystalline migration species for the academic Rock specialist. Roxanne already references Bagon_Hoenn near Meteor Falls — Carbink adds a second migration discovery to her worldview.
- **Toxapex** (Poison/Water, Gen 7) → Juan T2+. Defensive wall with Regenerator/Merciless. Add without Mareanie. Juan's quiet recognition that even the coral's predators have changed. Juan already has Corsola_Hoenn — Toxapex is its natural counterpart.

JSON trainer config refactor (C302) must ship BEFORE these edits. The macro format caused build failures in C179, C190, C195.

## Changed Three Ability Parity

Sceptile_Hoenn has Tempered Blade (+1 crit stage on Steel contact → 25% crit with high-crit Iron Leaf). Blaziken_Hoenn and Swampert_Hoenn need equivalent treatment:

- **Blaziken_Hoenn** (Fire/Fairy): Currently Cute Charm. Needs ability reflecting Fairy/Fire warrior identity. Must be felt in battle, not an invisible stat nudge. Design with Gameplay Designer in C307.
- **Swampert_Hoenn** (Water/Fighting): Currently Guts. Needs ability reflecting Water/Fighting brawler identity. Same perception threshold requirement. Design with Gameplay Designer in C308.

Both abilities should follow the pattern: ability + STAB synergy → coherent combat identity the player can name and describe.

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2B5.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (36 actual)**: Last = Swampert_Hoenn(447). EGG=448, NUM_SPECIES=448. 25 _HOENN forms, all fully registered + verified C294.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81). ABILITIES_COUNT=82. Next: 82.
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
