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
**v2.9** (C301-): "The Last Witness" — Champion narrative capstone. C302: Changed Three learnset fix. C303: Wallace dialogue (superseded by Steven champion swap). C304: Ambipom + Norman. C305: Carbink + Roxanne. C306: Champion redesign planning — Steven returns. C307: Toxapex + Juan. C308: Steven is Champion (5 parties), species pipeline repair (16 species). C309: Wallace comes home to Gym 8 + Juan cameo. C310: Fey Flame (Blaziken_Hoenn ability, switch-in announcement). C311: Undertow (Swampert_Hoenn ability) + Torchic_H/Combusken_H Will-O-Wisp Lv24 + Mudkip line back.png palette sync / Marshtomp cleanup (#201 partial). C312: Mt. Pyre starlight Torchic (first discovery beat) + Torchic-line palette restore (#201). C313: Sidney rebuilt (Absol ace, Hoenn Dark-types, Tyranitar/Houndoom removed, #193 partial) + Treecko-line palette restore pass (#201). C314: Honchkrow/Sharpedo/Flygon/Crobat collisions removed + Lotad-line shinies. C315: StaticDen macros + Meteor Falls crystal Treecko. C316: villain ownership table (Magma land / Aqua sea, 5 ace lines) + audit_boss_species.cjs (9 collisions left, #193 stays open for Flannery). C317: Flannery Torkoal rebuild + Roxanne fossil hall + Drake Flygon + Wallace Relicanth; audit 0, `check_bosses` gates check_all (#193 closed). C318: Shoal Cave titan Mudkip den (third den — all three Changed starters now have a visible route) + Drake 5 teams learnset-legal + Bagon/Growlithe/Arcanine_H lint & shinies (#201/#163 batch). C319: Birch's Field Notes in-game (dex rating den hints), Changed Three gift reacts to dens + Mudkip_Hoenn species fix, `check_dens` lint, Corsola/Vulpix/Ninetales_H lint & shinies. C320: release-candidate polish (Field Notes one-hint cap, Fortree Honchkrow callback, check_gifts, dead-code cut). **RELEASE CANDIDATE — not yet emulator-tested.**

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
| 2 | Donphan 54 (CB) | Donphan 65 (CB) | Donphan 75 (CB) | Aggron 84 (CB) | Registeel 91 |
| 3-5 | Sceptile_H 55 / Swampert_H 55 / Blaziken_H 56 | 66/67/68 | 76/78/80 | 85/86/88 (Blaz: Fire Blast) | 92/93/94 |
| 6 | Metagross 57 | 71 | 82 | 90 | 95 (Agility over Ice Punch) |

Donphan (C314, replaced Flygon — Drake owns Flygon) EQ/Rock Slide/Iron Tail/Double-Edge @Choice Band, Sturdy; chosen over Aggron because Flygon's loss left Ground/Fighting 3-weak with no resist (Aggron 4x both). Slot-2 lineage: Donphan T0-T2 → Aggron T3 → Registeel T4. Sets: Sceptile_H Iron Leaf/Leaf Blade/SD/EQ @Scope Lens · Swampert_H Waterfall/Cross Chop/Bulk Up/EQ @Sitrus · Blaziken_H Flamethrower/Moonblast/CM/Will-O-Wisp @Petaya. (C306's Tidal Flare + Spore Fist were illegal + wrong category — swapped.)
**Engine facts (verified C308)**: trainer mons ALWAYS get ability slot 0 (Swampert_H = Undertow since C311, was Torrent; Aggron Sturdy; Corsola_H Rock Head). Crit: Iron Leaf w/ Scope Lens + Tempered Blade = stage 3 (1/3); Leaf Blade = stage 2 (1/4). Nature = trainer-name + species-name hash (renaming/reordering changes it). Challenge mode = +5 lv for CLASS_CHAMPION (capped 100).
**Not possible yet**: natures/EVs/abilities per mon — needs TrainerMon struct expansion (tech debt).
**#194 (Regis)**: Skarmory T2-T3, Registeel T4 (attack-only, no Rest/Curse) ADOPTED. Regirock/Regice → deferred to Meteor Falls Steven postgame.
**Dialogue**: Intro/Defeat/Post/Rematch rewritten in ChampionsRoom; starter-aware beat after first-clear post-battle uses VAR_STARTER_MON (0 Larvitar / 1 Bagon / 2 Dratini — the REAL starters; the Changed Three are wild/postgame-gift only, so the C306 "Your SCEPTILE…" lines were factually wrong for a first clear). Hall of Fame + Drake post-battle + E4 mugshot updated.
**Design caveat**: the "mirror" premise assumed the player raises a Changed starter. Originally only players who caught Treecko/Torchic/Mudkip_Hoenn in the wild did; since C312 the visible Mt. Pyre starlight Torchic (Lv30 static) and since C315 the Meteor Falls crystal Treecko (Lv40 static, B1F_2R, post-Waterfall; Steven's chalked "- S." note sits beside it) give every player visible pre-Champion routes to a Changed starter. Both return until caught (C315 den fix). Steven's team still reads as "master of the migration" — revisit if playtesters miss the mirror.

### Wallace Cascade — SHIPPED C309 (source of truth: `pokeemerald/scripts/trainer_configs/wallace_gym_*.json`)

- TRAINER_JUAN_1-5 slots now = **WALLACE** (name "WALLACE", pic TRAINER_PIC_CHAMPION_WALLACE, class LEADER; items/doubles/AI unchanged). Arrays sParty_WallaceGym1-5. Constant names (TRAINER_JUAN_*, REMATCH_JUAN, FLAG_ENABLE_JUAN_MATCH_CALL, MC_HEADER_JUAN) deliberately untouched.
- Slots **568 (GRUNT_UNUSED) and 853 (MAY_PLACEHOLDER) remain FREE**. A future Juan postgame battle should be a **Double Battle on slot 568**.
- Wallace = **Water-first, exactly one migration species (Arcanine_Hoenn, used by no other trainer)**. Milotic ace every tier. Gym: Sealeo 41 / Whiscash 42 / Arcanine_H 43 / Gyarados 43 / Milotic 46. Toxapex joins T2+ (#180 kept). T4 opens with Juan's Kingdra (entrusted to his student). Old Ludicolo_H/Ninetales_H Wallace teams retired (archive deleted).
- Story: Wallace gave up the Champion seat to guard Sootopolis's water; Juan kept the Gym meanwhile and now stands beside him (Gym 1F object at 9,2, `SootopolisCity_Gym_1F_EventScript_JuanCameo`, FLAG_BADGE08_GET-conditional). Post-battle hands off to Steven ("Show him what you've seen"). After the HM Waterfall gift, Wallace fades out of the city (FLAG_HIDE_SOOTOPOLIS_CITY_WALLACE) to wait in the Gym.
- Pokénav: Juan header = Wallace (name/pic come from gTrainers; desc "WATER ARTIST"); MatchCall_Text_Wallace (Champion header) now speaks as STEVEN.

**Discovery beat pattern** (C312, discovery-beats.md): doll-sprite static + 2 optional cue signs, hide flag set only on catch. Emulator checks: see the v2.9 RC block.

### Species Reuse (#193)

| Species | Final owner (C317) | Notes |
|---------|-------------------|-------|
| Camerupt (ace), Weezing line, Rhydon line, Nidoking line | **Maxie** (Magma = land) | Ace last slot every tier. Off Flannery C317 |
| Houndoom (ace), Muk line, Magmar, Sandslash | **Tabitha** | Off Flannery C317 (Houndour stays a wild migration species) |
| Sharpedo (ace), Crobat, Wailord, Gliscor_Hoenn | **Archie** (Aqua = sea) | Gliscor_H also Brawly4/5 rematch (accepted) |
| Huntail (ace), Octillery, Qwilfish, Carvanha (WI), Corsola_Hoenn | **Shelly** | Corsola_H also Phoebe R1 (accepted, Aqua adopted migrant) |
| Poliwrath (ace), Kingler, Quagsire, Tentacruel | **Matt** | |
| Crawdaunt, Mightyena | **Sidney** | No villain boss fields either |
| Honchkrow | **Sidney** (all 5 tiers) | Winona removed C314 |
| Gyarados | **Wallace** | |
| Torkoal (ace), Arcanine, Magcargo, Ninetales, Rapidash, Pinsir_Hoenn | **Flannery** | C317 "steam, not smoke": Torkoal ace every tier (F1 White Herb Overheat; F2-F5 sun Eruption). Source of truth `flannery_gym_1-5.json`. Intro/rematch text: Magma wants the mountain to rage, Torkoal keeps it warm |
| Omastar, Kabutops, Aerodactyl, Armaldo | **Roxanne** (fossil hall) | C317 `roxanne_gym_2-5.json`; Omastar replaces Lunatone, R5 ace = banded Aerodactyl 75 (Kabutops R5 only). Golem kept |
| Relicanth | **Wallace** | C317: replaces Sealeo (Gym1) / Walrein (Gym2-4) in slot 1 of `wallace_gym_1-4.json`. Gym5 untouched |
| Walrein/Sealeo | **Glacia** | Off Wallace C317 |
| Lunatone | **Tate&Liza** | Off Roxanne C317 |
| Sceptile_Hoenn | **Steven** only | Off Drake R3/R4 C317 (→ Flygon, `drake_rematch_3/4.json`) |
| Claydol | **Tate&Liza** | |
| Flygon | **Drake** | Steven T0-T2 → Donphan C314 |
| Tyranitar | Rival postgame, Meteor Falls Steven, Steven rematches | Off Roxanne5 C317 |
| Kingdra | Wallace Gym5 (Juan's) + Drake R3/R4 | **Accepted overlap** (both postgame-only) |
| Carbink, Cradily | Roxanne R3+ + Steven | **Accepted overlap** (stone student / stone master; fossil hall Steven inspired) |
| Skarmory | Winona 1/3/4/5 + Steven T2/T3 + Meteor Falls Steven | **Accepted overlap** (vanilla on both, #194) |
| Grunts (any species) | — | **Exempt** — faction uniforms |

**Villain source of truth (C316):** `pokeemerald/scripts/trainer_configs/villain_*.json` (10 configs; apply with generate_trainer.cjs modify). **Tag battles cap each opponent at 3 mons** (battle_main.c, BATTLE_TYPE_TWO_OPPONENTS) — sParty_MaxieMossdeep is Weezing/Nidoking/Camerupt (Rhydon dropped so the ace appears; Rhydon stays Maxie's via the Hideout).

**Audit (C317):** `node pokeemerald/scripts/audit_boss_species.cjs [--strict]`; **`make check_bosses` (--strict) is part of `make check_all`**, so any new boss species share fails the checks. Result C317: **COLLISIONS: 0**, stale allowlist none. Accepted (each with a written `why`, required by --strict): Skarmory, Mightyena (pairs []), Corsola_H, Gliscor_H, Kingdra, Carbink, Cradily. New overlaps: fix the roster first; allowlist only with a story reason.

**Flannery sun (C318 check):** Torkoal ability is WHITE_SMOKE only — Flannery's sun depends on Sunny Day (Torkoal in F1, Ninetales slot 1 in F2-F5; all five teams carry it, no change needed).

**Drake learnset legality (C318):** all 5 teams legal per rom_species; source of truth `drake.json`, `drake_rematch_1-4.json`. Only exception: Dragonite Extreme Speed (Gen 3 event move, Drake signature). Backlog: R3 Flygon (Dragon Breath/Toxic Leftovers stall) hits softer than R1/R2 Flygon.

**ONE-OWNER RULE:** each overused species belongs to the boss whose identity it fits; don't re-add Tyranitar/Houndoom to Sidney.

**Sidney C313 — "the one who followed the storm"** (source of truth: `pokeemerald/scripts/trainer_configs/sidney_*.json`, apply with generate_trainer.cjs): Hoenn-native Dark-types, Absol ace (last slot), Honchkrow signature. Base (44-48, 5 mons): Mightyena/Shiftry/Sharpedo/Honchkrow/Absol. R1 (60-68): Mightyena/Sharpedo/Shiftry/Umbreon/Honchkrow/Absol. R2 (70-80): Mightyena/Cacturne/Crawdaunt/Umbreon/Honchkrow/Absol(SD). R3 (80-88): Sharpedo lead/Cacturne/Crawdaunt/Umbreon/Honchkrow/Absol. R4 (88-95): Sharpedo/Shiftry/Crawdaunt(SD+Liechi)/Umbreon(Mean Look trap)/Honchkrow/Absol. All moves legal per ROM learnsets (Absol uses Slash/Faint Attack/Quick Attack — no Night Slash/Sucker Punch in its vanilla learnset; see tech-debt). Overlap with Phoebe/Glacia/Drake/Steven/Wallace arrays: **0 shared species** (grep C313). Intro text now names Absol pacing before the migration.
**C314 Sharpedo swap** (only that slot changed): Base slot 3 → Crawdaunt 46 (Crabhammer/Knock Off/Ice Beam/Brick Break); R1 slot 2 → Cacturne 62 (Spikes/Giga Drain/Faint Attack/Thunder Punch); R3 lead → Shiftry 80 (Fake Out/Faint Attack/Giga Drain/Explosion); R4 lead → Mightyena 88 (Taunt/Crunch/Iron Tail/Swagger). Every tier now has a distinct 6-species roster (pool of 7: Mightyena/Shiftry/Cacturne/Crawdaunt + fixed Umbreon/Honchkrow/Absol). Intro: "HONCHKROW rode a storm down from FORTREE. Runs the crew now."

**Winona C314 — "Hoenn's own wings"** (source of truth: `pokeemerald/scripts/trainer_configs/winona_gym_1..5.json`, apply with generate_trainer.cjs): Honchkrow → Sidney, Crobat → Archie. W1 Skarmory/Tropius/Pelipper/Altaria(ace, DD); W2 Swellow/Pelipper/Tropius/Altaria; W3 Skarmory/Pelipper/Swellow/Tropius/Altaria; W4 Skarmory/Pelipper/Dodrio/Masquerain/Tropius/Altaria; W5 Skarmory/Swellow/Dodrio/Tropius/Pelipper/Altaria 75. Badge 6 is softer than C313 (70-Atk Altaria ace vs Brave Bird Honchkrow) — the fight's key beat is "stop the Dragon Dance". Story link: Winona intro says the dark bird she raised "flew south, toward the ELITE FOUR"; Sidney's intro says it "rode a storm down from FORTREE". Rematch pre-text still mentions Murkrow flocks in the sky (flavour, not party).

**Phoebe and Glacia: 0 overlap** with villain bosses. #193 villain pass DONE C316 (Crawdaunt off Shelly/Matt, Crobat Archie-only, Sharpedo Archie-only among bosses). #193 closed C317 (audit 0).

### Remaining Wallace/Juan threads
- Juan postgame Double Battle (slot 568) — not built yet. SkyPillar_Outside / PacifidlogTown / BirchLab Wallace lines checked C309: role-neutral, no change needed.
- Meteor Falls Steven: could acknowledge champion role + Regirock/Regice team (#194 remainder) — C321.
- Trainer ID allocation (C320): 568 = Juan doubles (C322); 853 = spare; C321 Steven uses vanilla TRAINER_STEVEN.

## Roster Fixes (#180) — Status

**Ambipom on Norman T3+**: DONE (C304). **Carbink on Roxanne T3+**: DONE (C305). **Toxapex on Sootopolis Gym T2+**: DONE (C307; kept on Wallace rematches C309). **Corsola_Hoenn on Phoebe R1**: DONE (C308). #180 complete.

## Changed Three Ability Parity

All three Changed starters now have signature abilities (Tempered Blade C300, Fey Flame C310, Undertow C311):
- **Blaziken_Hoenn**: DONE (C310) — FEY FLAME (82), slot 0 {FEY_FLAME, BLAZE}: 1.5x damage vs burned targets + switch-in announcement. Steven and postgame rivals carry Will-O-Wisp to show it.
  - **Player gap**: FIXED C311 — Torchic_H and Combusken_H learn Will-O-Wisp at Lv24 (level_up_learnsets.h). Blaziken_H keeps its Lv1 Will-O-Wisp.
- **Swampert_Hoenn**: DONE (C311) — UNDERTOW (83), slot 0 {UNDERTOW, TORRENT} on all three stages (Guts dropped): 1.3x power on any move if it already took damage this turn (gProtectStructs dmg flag) + switch-in "stirs below the surface!" message. Slow at 55 Spe, so it is live most turns and fits the champion set Waterfall/Cross Chop/Bulk Up/EQ @Sitrus. Champion and Brendan/May postgame get it via slot 0. Champion back three now announce in order: Swampert_H "stirs below the surface" (Undertow), then Blaziken_H "flickers to life" (Fey Flame). Emulator checks: v2.9 RC block. Last hand-built ability; build generate_ability.cjs (tech-debt) before a 7th.

## Roadmap

| Cycle | Objective | Issues |
|-------|-----------|--------|
| 302-314 | Learnsets, Ambipom/Carbink/Toxapex rosters, Steven champion, Wallace cascade, Fey Flame + Undertow, Mt. Pyre Torchic den, Sidney/Winona rebuilds, boss collisions, sprite lint batches — **ALL DONE** | #180, #182, #192, #193/#194/#201/#163 partial |
| 315 | Den fix + StaticDen macros + Meteor Falls crystal Treecko Lv40 @Moon Stone (B1F_2R) + grooved-stone/silver-leaf cues + Steven chalk note — **DONE** | #194 (Regi scene deferred) |
| 316 | Villain ownership table (villain_*.json, Magma land / Aqua sea), audit_boss_species.cjs, den static review — **DONE** | #193 |
| 317 | Flannery Torkoal rebuild, Roxanne fossil hall, Drake Flygon, Wallace Relicanth; audit COLLISIONS: 0, `check_bosses` in check_all — **DONE** | #193 closed |
| 318 | Shoal Cave titan Mudkip den (Lower Room 18,6, 0x2B7, FLAG_TEMP_12) + Drake teams learnset-legal + Bagon/Growlithe/Arcanine_H lint & shinies — **DONE** | #201/#163 partial |
| 319 | Birch's Field Notes in-game, Changed Three gift reacts to dens + real SPECIES_MUDKIP_HOENN, `check_dens` in check_all, Corsola/Vulpix/Ninetales_H lint & shinies — **DONE** | #201/#163 partial |
| 320 | RC polish: Field Notes one hint per call (`GetActiveFieldNote`), Fortree bird-keeper postgame Honchkrow line, dead Sootopolis WallaceMoveFromGym + dead Fortree Birdwatcher cut, `check_gifts` in check_all, v2.9 paper read-through (Winona rematch `\n` fixes, gift intro rewrap), RC known-issues block; Gligar/Gliscor_H "sunset shoal" + Shroomish/Breloom_H "spring thaw" shinies by the sprite phase — **DONE** | #201/#163 partial |
| 321 | Meteor Falls Steven collector scene: Steven present as a person (talks, battles with Regirock/Regice on vanilla TRAINER_STEVEN), NOT a 4th den/static. #194. Sprite batch: Pinsir/Stantler/Deoxys_H (#201 finish) + fix the Drake/researcher Bagon fact conflict (researcher line → "never seen in such numbers") + 1-2 read-through tone fixes (gift "And…" openers, Steven "rare stones" repeat) | #194, #201 |
| 322 | Juan doubles on slot 568 (doubleBattle TRUE, ≥2 mons) | — |
| 323+ | v3.0 opener: Field Notes key item (notebook with corrections page); #190 Bag-in-trainer-battles gate belongs to v3.0 | #190 |

## v2.9 RC — Not Yet Playtested (player-facing copy in README "Known Issues", C320)

No headless emulator in the pipeline; everything below is statically checked only.
- **Dens** (Mt. Pyre Exterior Torchic 22,13 · Meteor Falls B1F_2R Treecko 7,4 · Shoal Cave Lower Room Mudkip 18,6): doll visible on first entry (Torchic inside the summit fog); KO or run → faded text, doll gone until you leave and re-enter; catch → gone for good; whiteout mid-battle → doll still there. Old saves: a pre-C315 KO of the Torchic hides it forever (0x2B5 reused). Shoal Cave doll is low-tide only; Entrance cue (13,29) text switches with the tide.
- **Birch's Field Notes**: one hint per call (nearest reachable den first, then the all-found line). Worst-case Pokénav call is 506 B of the 1000 B gStringVar4 (C320 hand count); check the CHAR_PROMPT_CLEAR page breaks render and the in-person hint reads as one beat.
- **Fey Flame / Undertow**: both switch-in messages render (Champion back three: Swampert_H then Blaziken_H); Undertow 1.3x only after being hit that turn; Fey Flame 1.5x vs burned targets.
- **Sootopolis Gym 1F**: Wallace (8,2) and Juan (9,2) have flag 0 (always visible); Wallace should never show in the city and the Gym at once in a normal route (Gym door is reached after the city scene).
- **Flannery badge 4**: sun/Torkoal fight (F1 Torkoal 29 White Herb Overheat; Magcargo 26 under-levelled, accepted). If it feels harder than the Brawly→Norman curve, drop Overheat to Flamethrower — don't change species.
- **Fortree postgame line**: the bird keeper (20,8) switches to the Honchkrow "visiting home" line after FLAG_SYS_GAME_CLEAR.

Please report anything odd on the issue tracker.

**Static verification (no emulator):** C316 — den flags 0x2B5/0x2B6 unique, FLAG_TEMP_11 unshared, ON_TRANSITION + ON_RESUME wired, Meteor Falls TM Dragon Claw (5,3) still reachable. C318 — Shoal Cave BFS: doll pocket reachable at low tide only, blocking it leaves all warps/items reachable, Entrance cue tile reachable in both tides. C319+ — `make check_dens` and (C320) `make check_gifts` guard den wiring and vanilla-vs-_HOENN gift/static species in check_all.

### Field Notes (IN-GAME C319, one hint per call C320; source `GetActiveFieldNote` in src/match_call.c)
- Texts: `gBirchFieldNoteText_{Header,Torchic,Mudkip,Treecko,AllFound}` in data/text/pokedex_rating.inc.
- Match call: `BufferPokedexRatingForMatchCall` → `AppendBirchFieldNotes` (CHAR_PROMPT_CLEAR-separated) after the Hoenn/National rating. In person: `ProfBirch_EventScript_AskRatePokedex` → `ProfBirch_EventScript_FieldNotes` (special `IsBirchFieldNoteActive`, VAR_0x8004 = 0 Torchic, 1 Mudkip, 2 Treecko, 3 all found, 4 any). NOT in `ProfBirch_EventScript_RatePokedex` (Champion's Room shares it).
- `GetActiveFieldNote` returns ONE id, first match wins: Torchic (badge 5 && !0x2B5) → Mudkip (badge 6 && !0x2B7) → Treecko (badge 8 && !0x2B6) → ALL_FOUND (all three caught) → ANY = "nothing to say" sentinel. Both paths read it, so they can't disagree.
- Worst case (C320 hand count, {PLAYER} 7 chars, 3-digit counts): AreYouCurious 81 + SoYouveSeen 65 + LessThan160 102 + OnANationwideBasis 84 + Header 55 + Mudkip hint 113 + 6 separators/EOS = **506 B** of 1000 (three hints were ~700 B).
- Gift/notes agree: 8/8 cases (C320). The Changed Three gift (BirchLab `ChooseJohtoStarter`) shows found-or-hint for each den with the same three FLAG_CAUGHT_* flags; it is postgame, so badge gates don't matter, and it gives SPECIES_TREECKO/MUDKIP/TORCHIC_HOENN.
- Adding a 4th den: enum entry before ALL_FOUND (renumber the script ids!), text, `sFieldNoteTexts` entry, a `GetActiveFieldNote` branch in reach order, the all-found term, a script block.

### v2.9 read-through notes (C320) — tone / over-telling, for C321+
- Gift den lines "And the crystal TREECKO…" / "And the titan MUDKIP…" open with "And" even when the line before was a hint (Torchic uncaught). Gift order Torchic→Treecko→Mudkip differs from Field Notes badge order Torchic→Mudkip→Treecko.
- Gift hints ("Something still glitters/hums/stirs…") repeat the Field Notes hints almost word for word; a player who heard the call gets the same line twice.
- All three den "Faded" texts share one template ("Perhaps it will return/rise again once the … is still/settles again"); vary one or two.
- Shoal Cave: Approach "The tide pool goes still." is followed by Caught "The tide pool falls still." in the same scene.
- Sidney intro uses "storm" in two boxes in a row ("Everybody ran when the storm came" / "HONCHKROW rode a storm down").
- Steven Intro and PostBattle both open on "I came (to HOENN) seeking rare stones"; the second time explains a beat the player just heard.
- Fortree has the dusk-circling image twice postgame: Winona's rematch pre-text ("dark birds circling FORTREE at dusk") and the new bird-keeper line. Fine as an echo; check it doesn't feel copied.
- **Fact conflict**: Drake intro "I watched the BAGON colony in METEOR FALLS since I was young" vs MeteorFalls_1F_1R researcher (C153) "Dragon-types that have never been recorded in HOENN". Simplest fix: the researcher's line → "never seen in such numbers".

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264-0x2B7 (C318: 0x2B7 = FLAG_CAUGHT_SHOAL_CAVE_TITAN_MUDKIP). Next available: **0x2B8** (0x2B8-0x2BB are FLAG_UNUSED; 0x2BC+ vanilla).
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891, 2 reclaimable IDs (GRUNT_UNUSED=568, MAY_PLACEHOLDER=853).
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue, StaticDen/StaticDenTransition/StaticDenTryRemove), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Specials**: custom specials are appended at the end of `data/specials.inc` (`def_special Name`). C319 gained `IsBirchFieldNoteActive` (src/match_call.c, prototype in include/match_call.h).
- **Custom species (40)**: Last = Toxapex(450). EGG=451, NUM_SPECIES=451. 12 cross-gen evos + 25 _HOENN forms + 3 standalone imports (Carbink, Toxapex, etc.), all fully registered + verified.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81), FEY_FLAME(82), UNDERTOW(83). ABILITIES_COUNT=84. Next: 84. BATTLESTRINGS_COUNT=384 (next STRINGID 384).
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). Damage-multiplier + switch-in message: 9 files (see battle-engine.md Fey Flame / Undertow). ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (378), EVO_ITEM_FEMALE method, Shoal Cave low-tide.
- **Generator toolchain**: `generate_species.cjs` (27-file + ~6 manual in pokemon.c/pokemon_icon.c), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
