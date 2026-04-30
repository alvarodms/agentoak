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
**v2.9** (C301-): "The Last Witness" — Champion narrative capstone. C302: Changed Three learnset fix (10 species). C303: Wallace dialogue rewritten as migration witness. C304: Ambipom species (37th custom, Normal cross-gen evo) + Norman T3/T4/T5 roster integration + 2 encounter fixes. C305: Carbink species (38th custom, Rock/Fairy) + Roxanne T3-T5 roster integration + migration-geology dialogue. Also fixed Ambipom partial registration from C304.

---

# v2.9: "The Last Witness"

**Theme**: The migration narrative's climax. For 15 hours, the player has witnessed Hoenn transform — new forms appearing, gym leaders adapting, villains reckoning with consequences. The Champion fight should be where that story converges. When the credits roll, the player should feel: "Hoenn's transformation was real, and I was its witness."

## Roadmap (~10 cycles)

| Cycle | Mode | Objective | Issues |
|-------|------|-----------|--------|
| 302 | feature | Changed Three learnset fix (10 species) — **DONE** | — |
| 303 | feature | Champion dialogue rewrite — **DONE** | #182 |
| 304 | feature | Ambipom species + Norman roster fix — **DONE** | #180 partial |
| 305 | feature | Carbink species (Rock/Fairy) + Roxanne roster fix — **DONE** | #180 partial |
| 306 | feature | Toxapex species (Poison/Water) + Juan roster fix | #180 partial |
| 307 | feature | Blaziken_Hoenn custom ability (ABILITY_82) | — |
| 308 | feature | Swampert_Hoenn custom ability (ABILITY_83) | — |
| 309 | feature | Field Notes key item (stretch goal) | — |
| 310 | patch | v2.9 polish pass | — |

## Roster Fixes (#180) — Status

**Corsola_Hoenn on Phoebe**: ALREADY DONE. No work needed.
**Ambipom on Norman T3/T4/T5**: DONE (C304). Ambipom added as 37th custom species, integrated into rematch tiers 3-5.
**Carbink on Roxanne T3/T4/T5**: DONE (C305). Carbink added as 38th custom species, integrated into rematch tiers 3-5. Dual-screens wall with Fairy STAB.

Remaining 1 item:

- **Toxapex** (Poison/Water, Gen 7) → Juan T2+. Defensive wall with Regenerator/Merciless. Juan already has Corsola_Hoenn — Toxapex is its natural counterpart.

## Changed Three Ability Parity

Sceptile_Hoenn has Tempered Blade (+1 crit stage on Steel contact → 25% crit with high-crit Iron Leaf). Blaziken_Hoenn and Swampert_Hoenn need equivalent treatment:

- **Blaziken_Hoenn** (Fire/Fairy): Currently Cute Charm. Needs ability reflecting Fairy/Fire warrior identity. Design in C307.
- **Swampert_Hoenn** (Water/Fighting): Currently Guts. Needs ability reflecting Water/Fighting brawler identity. Design in C308.

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2B5.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (39)**: Last = Carbink(449). EGG=450, NUM_SPECIES=450. 12 cross-gen evos + 25 _HOENN forms + 2 standalone imports (Carbink, etc.), all fully registered + verified.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81). ABILITIES_COUNT=82. Next: 82.
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file + ~6 manual in pokemon.c/pokemon_icon.c), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
