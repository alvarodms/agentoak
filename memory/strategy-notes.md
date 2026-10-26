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
**v2.9** (C301-): "The Last Witness" — Champion narrative capstone. C302: Changed Three learnset fix. C303: Wallace dialogue (superseded by Steven champion swap). C304: Ambipom + Norman. C305: Carbink + Roxanne. C306: Champion redesign planning — Steven returns. C307: Toxapex + Juan. C308: Steven is Champion (5 parties), species pipeline repair (16 species).

---

# v2.9: "The Last Witness"

**Theme**: Steven Stone — original RSE champion, geologist, collector — returns to the summit with all three Changed starters. The player, who mastered ONE, faces someone who mastered ALL THREE. The migration narrative's missing climax.

## Champion Redesign — Steven Returns

**Decision**: Steven replaces Wallace as Champion. 5 community requests (#120, #182, #183, #186, #192). Corrected evidence: Altair (Wally), Extended Cut, Energized Emerald (Steven), Kaizo (Drake) all changed Hoenn champions. Steven's collector identity maps to migration mastery.

### Steven's Team — SHIPPED C308 (source of truth: `pokeemerald/scripts/trainer_configs/steven_*.json`)

TRAINER_WALLACE + _REMATCH_1-4 slots now = STEVEN (pic TRAINER_PIC_STEVEN, class CHAMPION). Arrays sParty_StevenChampion / sParty_StevenRematch1-4. IV 255. Old Wallace teams archived verbatim in `memory/wallace-team-archive.md` for C309.

| Slot | Base | T1 | T2 | T3 | T4 |
|---|---|---|---|---|---|
| 1 | Cradily 53 | Cradily 64 | Skarmory 73 | Skarmory 82 | Carbink 90 |
| 2 | Flygon 54 (CB) | Flygon 65 | Flygon 75 (Fire Punch) | Aggron 84 (CB) | Registeel 91 |
| 3-5 | Sceptile_H 55 / Swampert_H 55 / Blaziken_H 56 | 66/67/68 | 76/78/80 | 85/86/88 (Blaz: Fire Blast) | 92/93/94 |
| 6 | Metagross 57 | 71 | 82 | 90 | 95 (Agility over Ice Punch) |

Sets: Sceptile_H Iron Leaf/Leaf Blade/SD/EQ @Scope Lens · Swampert_H Waterfall/Cross Chop/Bulk Up/EQ @Sitrus · Blaziken_H Flamethrower/Moonblast/CM/Will-O-Wisp @Petaya. (C306's Tidal Flare + Spore Fist were illegal + wrong category — swapped.)
**Engine facts (verified C308)**: trainer mons ALWAYS get ability slot 0 (Swampert_H = Torrent, never Guts; Aggron Sturdy; Corsola_H Rock Head). Crit: Iron Leaf w/ Scope Lens + Tempered Blade = stage 3 (1/3); Leaf Blade = stage 2 (1/4). Nature = trainer-name + species-name hash (renaming/reordering changes it). Challenge mode = +5 lv for CLASS_CHAMPION (capped 100).
**Not possible yet**: natures/EVs/abilities per mon — needs TrainerMon struct expansion (tech debt).
**#194 (Regis)**: Skarmory T2-T3, Registeel T4 (attack-only, no Rest/Curse) ADOPTED. Regirock/Regice → deferred to Meteor Falls Steven postgame.
**Dialogue**: Intro/Defeat/Post/Rematch rewritten in ChampionsRoom; starter-aware beat after first-clear post-battle uses VAR_STARTER_MON (0 Larvitar / 1 Bagon / 2 Dratini — the REAL starters; the Changed Three are wild/postgame-gift only, so the C306 "Your SCEPTILE…" lines were factually wrong for a first clear). Hall of Fame + Drake post-battle + E4 mugshot updated.
**Design caveat**: the "mirror" premise assumed the player raises a Changed starter. In reality only players who caught Treecko/Torchic/Mudkip_Hoenn in the wild do. Steven's team still reads as "master of the migration" — revisit if playtesters miss the mirror.

### Wallace Cascade — Recommended: Option A

| Option | Description | Complexity | Verdict |
|--------|-------------|------------|---------|
| A | Wallace → Gym 8, Juan → postgame | High | **Recommended** — canonical RSE, narrative escalation |
| B | Wallace → postgame superboss | Medium | Viable fallback — preserves all existing work |
| C | Wallace → storyline only | Low | Rejected — wastes team/dialogue investment |

**Why A**: Gym 8 shows migration diversity (Wallace's Ludicolo_Hoenn, Arcanine_Hoenn, Ninetales_Hoenn). Champion shows migration mastery (Steven's Changed Three). Player climbs from "Hoenn changed" to "someone mastered the change." Canonical RSE arrangement. Juan relocates to postgame mentor role (Pacifidlog/Cave of Origin), keeps Corsola_Hoenn identity.

### Species Reuse (#193)

| Species | Boss Trainers | On Steven's New Team? |
|---------|--------------|----------------------|
| Tyranitar | Sidney, Drake, Rival, Steven (Meteor Falls) — 4 bosses | No |
| Houndoom | Sidney, Maxie, Tabitha — 3+ bosses | No |
| Honchkrow | Sidney (all tiers), Wally — 2 bosses | No |
| Corsola_Hoenn | Phoebe, Juan, Aqua grunts — 3+ bosses | No |

Steven's new team: **ZERO overlap** with overused species. Primary #193 target: Sidney's Tyranitar/Houndoom/Honchkrow saturation (C312).

### C309 Handoff (Wallace cascade)
- Wallace teams: `memory/wallace-team-archive.md` (231 lines, TEMPORARY — delete once Wallace Gym 8 parties ship in C309). Claim TRAINER_GRUNT_UNUSED (568) for Wallace Gym 8.
- Untouched Wallace-as-figure text (C309 territory): SootopolisCity, SootopolisCity_PokemonCenter_1F ("toughest TRAINER" rumor), SootopolisCity_House3, SootopolisCity_Gym_1F, CaveOfOrigin_B1F, SkyPillar_Outside, PacifidlogTown, MossdeepCity, BirchLab revelation, data/text/match_call.inc (pokenav).
- Meteor Falls Steven: could acknowledge champion role + Regirock/Regice team (#194 remainder).

## Roster Fixes (#180) — Status

**Ambipom on Norman T3+**: DONE (C304). **Carbink on Roxanne T3+**: DONE (C305). **Toxapex on Juan T2+**: DONE (C307; registration re-applied C308). **Corsola_Hoenn on Phoebe R1**: DONE (C308). #180 complete.

## Changed Three Ability Parity

Sceptile_Hoenn has Tempered Blade. Blaziken_Hoenn (Blaze/Cute Charm) and Swampert_Hoenn (Torrent/Guts) need custom abilities:
- **Blaziken_Hoenn**: Design in C310. Fairy/Fire warrior identity.
- **Swampert_Hoenn**: Design in C311. Water/Fighting brawler identity.

## Roadmap

| Cycle | Objective | Issues |
|-------|-----------|--------|
| 302-305 | Learnsets, dialogue, Ambipom+Norman, Carbink+Roxanne — **ALL DONE** | #180, #182 |
| 306 | Champion redesign planning — **DONE** | #192 |
| 307 | Toxapex + Juan roster fix — **DONE** | #180 |
| 308 | Steven champion implementation — **DONE** (+ species pipeline repair) | #192, #194 partial, #180 |
| 309 | Wallace cascade (Wallace → Gym 8, Juan → postgame) | — |
| 310 | Blaziken_Hoenn custom ability (ABILITY_82) | — |
| 311 | Swampert_Hoenn custom ability (ABILITY_83) | — |
| 312 | Species reuse fixes (#193 — Sidney saturation) | #193 |
| 313+ | Field Notes key item, v2.9 polish | — |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2B5.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (40)**: Last = Toxapex(450). EGG=451, NUM_SPECIES=451. 12 cross-gen evos + 25 _HOENN forms + 3 standalone imports (Carbink, Toxapex, etc.), all fully registered + verified.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81). ABILITIES_COUNT=82. Next: 82.
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file + ~6 manual in pokemon.c/pokemon_icon.c), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
