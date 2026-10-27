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
**v2.9** (C301-): "The Last Witness" — Champion narrative capstone. C302: Changed Three learnset fix. C303: Wallace dialogue (superseded by Steven champion swap). C304: Ambipom + Norman. C305: Carbink + Roxanne. C306: Champion redesign planning — Steven returns. C307: Toxapex + Juan. C308: Steven is Champion (5 parties), species pipeline repair (16 species). C309: Wallace comes home to Gym 8 + Juan cameo. C310: Fey Flame (Blaziken_Hoenn ability, switch-in announcement). C311: Undertow (Swampert_Hoenn ability) + Torchic_H/Combusken_H Will-O-Wisp Lv24 + Mudkip line back.png palette sync / Marshtomp cleanup (#201 partial). C312: Mt. Pyre starlight Torchic (first discovery beat) + Torchic-line palette restore (#201). C313: Sidney rebuilt (Absol ace, Hoenn Dark-types, Tyranitar/Houndoom removed, #193 partial) + Treecko-line palette restore pass (#201).

---

# v2.9: "The Last Witness"

**Theme**: Steven Stone — original RSE champion, geologist, collector — returns to the summit with all three Changed starters. The player, who mastered ONE, faces someone who mastered ALL THREE. The migration narrative's missing climax.

## Champion Redesign — Steven Returns

**Decision**: Steven replaces Wallace as Champion. 5 community requests (#120, #182, #183, #186, #192). Corrected evidence: Altair (Wally), Extended Cut, Energized Emerald (Steven), Kaizo (Drake) all changed Hoenn champions. Steven's collector identity maps to migration mastery.

### Steven's Team — SHIPPED C308 (source of truth: `pokeemerald/scripts/trainer_configs/steven_*.json`)

TRAINER_WALLACE + _REMATCH_1-4 slots now = STEVEN (pic TRAINER_PIC_STEVEN, class CHAMPION). Arrays sParty_StevenChampion / sParty_StevenRematch1-4. IV 255.

| Slot | Base | T1 | T2 | T3 | T4 |
|---|---|---|---|---|---|
| 1 | Cradily 53 | Cradily 64 | Skarmory 73 | Skarmory 82 | Carbink 90 |
| 2 | Flygon 54 (CB) | Flygon 65 | Flygon 75 (Fire Punch) | Aggron 84 (CB) | Registeel 91 |
| 3-5 | Sceptile_H 55 / Swampert_H 55 / Blaziken_H 56 | 66/67/68 | 76/78/80 | 85/86/88 (Blaz: Fire Blast) | 92/93/94 |
| 6 | Metagross 57 | 71 | 82 | 90 | 95 (Agility over Ice Punch) |

Sets: Sceptile_H Iron Leaf/Leaf Blade/SD/EQ @Scope Lens · Swampert_H Waterfall/Cross Chop/Bulk Up/EQ @Sitrus · Blaziken_H Flamethrower/Moonblast/CM/Will-O-Wisp @Petaya. (C306's Tidal Flare + Spore Fist were illegal + wrong category — swapped.)
**Engine facts (verified C308)**: trainer mons ALWAYS get ability slot 0 (Swampert_H = Undertow since C311, was Torrent; Aggron Sturdy; Corsola_H Rock Head). Crit: Iron Leaf w/ Scope Lens + Tempered Blade = stage 3 (1/3); Leaf Blade = stage 2 (1/4). Nature = trainer-name + species-name hash (renaming/reordering changes it). Challenge mode = +5 lv for CLASS_CHAMPION (capped 100).
**Not possible yet**: natures/EVs/abilities per mon — needs TrainerMon struct expansion (tech debt).
**#194 (Regis)**: Skarmory T2-T3, Registeel T4 (attack-only, no Rest/Curse) ADOPTED. Regirock/Regice → deferred to Meteor Falls Steven postgame.
**Dialogue**: Intro/Defeat/Post/Rematch rewritten in ChampionsRoom; starter-aware beat after first-clear post-battle uses VAR_STARTER_MON (0 Larvitar / 1 Bagon / 2 Dratini — the REAL starters; the Changed Three are wild/postgame-gift only, so the C306 "Your SCEPTILE…" lines were factually wrong for a first clear). Hall of Fame + Drake post-battle + E4 mugshot updated.
**Design caveat**: the "mirror" premise assumed the player raises a Changed starter. Originally only players who caught Treecko/Torchic/Mudkip_Hoenn in the wild did; since C312 the visible Mt. Pyre starlight Torchic (Lv30 static, returns until caught) gives every player a visible pre-Champion route to a Changed starter. Steven's team still reads as "master of the migration" — revisit if playtesters miss the mirror.

### Wallace Cascade — SHIPPED C309 (source of truth: `pokeemerald/scripts/trainer_configs/wallace_gym_*.json`)

- TRAINER_JUAN_1-5 slots now = **WALLACE** (name "WALLACE", pic TRAINER_PIC_CHAMPION_WALLACE, class LEADER; items/doubles/AI unchanged). Arrays sParty_WallaceGym1-5. Constant names (TRAINER_JUAN_*, REMATCH_JUAN, FLAG_ENABLE_JUAN_MATCH_CALL, MC_HEADER_JUAN) deliberately untouched.
- Slots **568 (GRUNT_UNUSED) and 853 (MAY_PLACEHOLDER) remain FREE**. A future Juan postgame battle should be a **Double Battle on slot 568**.
- Wallace = **Water-first, exactly one migration species (Arcanine_Hoenn, used by no other trainer)**. Milotic ace every tier. Gym: Sealeo 41 / Whiscash 42 / Arcanine_H 43 / Gyarados 43 / Milotic 46. Toxapex joins T2+ (#180 kept). T4 opens with Juan's Kingdra (entrusted to his student). Old Ludicolo_H/Ninetales_H Wallace teams retired (archive deleted).
- Story: Wallace gave up the Champion seat to guard Sootopolis's water; Juan kept the Gym meanwhile and now stands beside him (Gym 1F object at 9,2, `SootopolisCity_Gym_1F_EventScript_JuanCameo`, FLAG_BADGE08_GET-conditional). Post-battle hands off to Steven ("Show him what you've seen"). After the HM Waterfall gift, Wallace fades out of the city (FLAG_HIDE_SOOTOPOLIS_CITY_WALLACE) to wait in the Gym.
- Pokénav: Juan header = Wallace (name/pic come from gTrainers; desc "WATER ARTIST"); MatchCall_Text_Wallace (Champion header) now speaks as STEVEN.

**Discovery beat pattern** (C312, discovery-beats.md): doll-sprite static + 2 optional cue signs, hide flag set only on catch. **NEEDS EMULATOR CHECK**: doll renders in fog, cue rocks read correctly, fade/return works.

### Species Reuse (#193)

| Species | Boss Trainers | On Steven's New Team? |
|---------|--------------|----------------------|
| Tyranitar | Rival postgame (Brendan/May Mudkip variants), Meteor Falls Steven (`sParty_Steven`, Larvitar lineage), Roxanne5 — **Sidney removed C313**; Drake has none (ROM grep C313) | No |
| Houndoom | Maxie (Hideout+Mossdeep), Tabitha (Hideout+Mossdeep) = Magma's dog; also Flannery1/3/4/5 + Magma grunts — **Sidney removed C313** | No |
| Honchkrow | Sidney (signature, all 5 tiers), Winona1-5 (ROM data — NOT Wally; review Winona overlap later) | No |
| Corsola_Hoenn | Phoebe, Aqua grunts (Juan slots are now Wallace, no Corsola_H) | No |

**ONE-OWNER RULE:** each overused species belongs to the boss whose identity it fits; don't re-add Tyranitar/Houndoom to Sidney.

**Sidney C313 — "the one who followed the storm"** (source of truth: `pokeemerald/scripts/trainer_configs/sidney_*.json`, apply with generate_trainer.cjs): Hoenn-native Dark-types, Absol ace (last slot), Honchkrow signature. Base (44-48, 5 mons): Mightyena/Shiftry/Sharpedo/Honchkrow/Absol. R1 (60-68): Mightyena/Sharpedo/Shiftry/Umbreon/Honchkrow/Absol. R2 (70-80): Mightyena/Cacturne/Crawdaunt/Umbreon/Honchkrow/Absol(SD). R3 (80-88): Sharpedo lead/Cacturne/Crawdaunt/Umbreon/Honchkrow/Absol. R4 (88-95): Sharpedo/Shiftry/Crawdaunt(SD+Liechi)/Umbreon(Mean Look trap)/Honchkrow/Absol. All moves legal per ROM learnsets (Absol uses Slash/Faint Attack/Quick Attack — no Night Slash/Sucker Punch in its vanilla learnset; see tech-debt). Overlap with Phoebe/Glacia/Drake/Steven/Wallace arrays: **0 shared species** (grep C313). Intro text now names Absol pacing before the migration.

Steven's new team: **ZERO overlap** with overused species. Next #193: Phoebe/Glacia overlap test, then villain team diversity.

### Remaining Wallace/Juan threads
- Juan postgame Double Battle (slot 568) — not built yet. SkyPillar_Outside / PacifidlogTown / BirchLab Wallace lines checked C309: role-neutral, no change needed.
- Meteor Falls Steven: could acknowledge champion role + Regirock/Regice team (#194 remainder).
- Dead code: `SootopolisCity_EventScript_WallaceMoveFromGym(West)` + movements are now unreferenced (HM gift uses fade+removeobject). Harmless; delete during a cleanup pass.
- Playtest watch: Gym 1F Wallace (8,2) and Juan (9,2) objects have flag 0 (always visible). Wallace appears in BOTH city (until HM gift) and Gym simultaneously only if the player enters the Gym before talking to him — Gym door is reached after the city scene, so acceptable, but verify in a playthrough.

## Roster Fixes (#180) — Status

**Ambipom on Norman T3+**: DONE (C304). **Carbink on Roxanne T3+**: DONE (C305). **Toxapex on Sootopolis Gym T2+**: DONE (C307; kept on Wallace rematches C309). **Corsola_Hoenn on Phoebe R1**: DONE (C308). #180 complete.

## Changed Three Ability Parity

All three Changed starters now have signature abilities (Tempered Blade C300, Fey Flame C310, Undertow C311):
- **Blaziken_Hoenn**: DONE (C310) — FEY FLAME (82), slot 0 {FEY_FLAME, BLAZE}: 1.5x damage vs burned targets + switch-in announcement. Steven and postgame rivals carry Will-O-Wisp to show it.
  - **Player gap**: FIXED C311 — Torchic_H and Combusken_H learn Will-O-Wisp at Lv24 (level_up_learnsets.h). Blaziken_H keeps its Lv1 Will-O-Wisp.
- **Swampert_Hoenn**: DONE (C311) — UNDERTOW (83), slot 0 {UNDERTOW, TORRENT} on all three stages (Guts dropped): 1.3x power on any move if it already took damage this turn (gProtectStructs dmg flag) + switch-in "stirs below the surface!" message. Slow at 55 Spe, so it is live most turns and fits the champion set Waterfall/Cross Chop/Bulk Up/EQ @Sitrus. Champion and Brendan/May postgame get it via slot 0. Champion back three now announce in order: Swampert_H "stirs below the surface" (Undertow), then Blaziken_H "flickers to life" (Fey Flame). **NEEDS EMULATOR VERIFICATION**: both switch-in messages render, Undertow 1.3x applies only after being hit that turn, and Fey Flame 1.5x vs burned. Last hand-built ability; build generate_ability.cjs (tech-debt) before a 7th.

## Roadmap

| Cycle | Objective | Issues |
|-------|-----------|--------|
| 302-310 | Learnsets, Ambipom/Carbink/Toxapex rosters, Steven champion, Wallace cascade, Fey Flame — **ALL DONE** | #180, #182, #192, #194 partial, #193 partial |
| 311 | Undertow (ABILITY 83) + Torchic/Combusken_H Will-O-Wisp Lv24 + Mudkip-line sprite lint — **DONE** | #201 partial |
| 312 | Mt. Pyre starlight Torchic, the first den discovery beat (visible static Torchic_H Lv30 @Star Piece + 2 cue signs) — **DONE** | #201 partial (Torchic-line sprite lint) |
| 313 | Sidney rebuilt as "the one who followed the storm" (Absol ace, Honchkrow signature, no Tyranitar/Houndoom; sidney_*.json configs + intro line) — **DONE** | #193 partial |
| 314 | Phoebe/Glacia overlap test + Winona/Sidney Honchkrow overlap review; then villain team diversity (#193 remainder). Treecko-line palette restore DONE C313; remaining #201: eye-check Lotad/Lombre/Ludicolo + Shroomish/Breloom_H for the same vanilla regression | #193, #201 |
| 314+ | v2.9 polish | — |
| 315+ | Meteor Falls crystal Treecko den — discovery beat, same static pattern; also sets up the Steven Regirock/Regice postgame scene | #194 |
| 316+ | Shoal Cave titan Mudkip den — discovery beat, same static pattern | — |

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264+. Next available: 0x2B6.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Custom species (40)**: Last = Toxapex(450). EGG=451, NUM_SPECIES=451. 12 cross-gen evos + 25 _HOENN forms + 3 standalone imports (Carbink, Toxapex, etc.), all fully registered + verified.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81), FEY_FLAME(82), UNDERTOW(83). ABILITIES_COUNT=84. Next: 84. BATTLESTRINGS_COUNT=384 (next STRINGID 384).
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). Damage-multiplier + switch-in message: 9 files (see battle-engine.md Fey Flame / Undertow). ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file + ~6 manual in pokemon.c/pokemon_icon.c), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
