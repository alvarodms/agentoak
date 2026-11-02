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
**v2.9** (C301-323): "The Last Witness" — Steven returns as Champion with the Changed Three (C308), Wallace comes home to Gym 8 + Juan cameo/duet (C309/C322), Fey Flame + Undertow abilities (C310-311), three Changed-starter dens (Mt. Pyre Torchic C312, Meteor Falls Treecko C315, Shoal Cave Mudkip C318), boss species audit 0 (C313-317), Birch's Field Notes hints (C319-320), Meteor Falls Steven Regis (C321), 25/25 custom shinies, lint gates (check_bosses/dens/gifts/text_width/doubles). **COMPLETE C323; not yet emulator-tested.**

**v3.0 "Red Ink"** (C324-): the player corrects the record of a changed Hoenn. Every chapter puts someone who still holds an old belief (Birch's notes, the villains' plans, townsfolk repeating the old notes) in front of a player who has seen the truth, and lets the player's catches and battles write the correction. C324 Field Notes (Birch's 7 wrong beliefs, red ink on catch). C325 #190 Challenge Bag lock. C326 Maxie/Archie Reckoning rematches (slots 851/852): the leaders admit the land and sea grew without them. C327-330: one believer per open page — Route 104 schoolkid (P1, accepts), Petalburg Woods forager (P2, grieves), Granite Cave B1F hiker (P3, refuses then relents, HARD_STONE), Route 113 ash picnicker (P4, delight) — via `EventMacro_DexBelieverPlace` (C329) + `CountInkedFieldNotePages` special (C330). C331 Red Ink payoff: with 3+ pages inked, Birch reads the player's red ink and names the believers (Pokénav + in person, one C writer). Pages 1-4 gain red margin lines, and the cover adds the player's name in red. No flags. Next: C332 consolidation/playtest checklist.

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
**#194 (Regis)**: Skarmory T2-T3, Registeel T4 (attack-only, no Rest/Curse) ADOPTED. Regirock/Regice → Meteor Falls Steven postgame DONE C321 (`steven_meteor_falls.json`); #194 closed.
**Dialogue**: Intro/Defeat/Post/Rematch rewritten in ChampionsRoom; starter-aware beat after first-clear post-battle uses VAR_STARTER_MON (0 Larvitar / 1 Bagon / 2 Dratini — the REAL starters; the Changed Three are wild/postgame-gift only, so the C306 "Your SCEPTILE…" lines were factually wrong for a first clear). Hall of Fame + Drake post-battle + E4 mugshot updated.
**Design caveat**: the "mirror" premise assumed the player raises a Changed starter. Originally only players who caught Treecko/Torchic/Mudkip_Hoenn in the wild did; since C312 the visible Mt. Pyre starlight Torchic (Lv30 static) and since C315 the Meteor Falls crystal Treecko (Lv40 static, B1F_2R, post-Waterfall; Steven's chalked "- S." note sits beside it) give every player visible pre-Champion routes to a Changed starter. Both return until caught (C315 den fix). Steven's team still reads as "master of the migration" — revisit if playtesters miss the mirror.

### Wallace Cascade — SHIPPED C309 (source of truth: `pokeemerald/scripts/trainer_configs/wallace_gym_*.json`)

- TRAINER_JUAN_1-5 slots now = **WALLACE** (name "WALLACE", pic TRAINER_PIC_CHAMPION_WALLACE, class LEADER; items/doubles/AI unchanged). Arrays sParty_WallaceGym1-5. Constant names (TRAINER_JUAN_*, REMATCH_JUAN, FLAG_ENABLE_JUAN_MATCH_CALL, MC_HEADER_JUAN) deliberately untouched.
- Slot 568 = **TRAINER_JUAN_DUET** (C322, Juan postgame doubles). 851 = **TRAINER_MAXIE_RECKONING**, 852 = **TRAINER_ARCHIE_RECKONING** (C326, ex-RED/LEAF). 9 unreferenced IDs per check_trainer_slots (C327): 117,173,462,485,486,581,633,634,853. Hand-verify each (computed-ID refs are invisible to the scan) before use; never bump TRAINERS_COUNT.
- Wallace = **Water-first, exactly one migration species (Arcanine_Hoenn, used by no other trainer)**. Milotic ace every tier. Gym: Sealeo 41 / Whiscash 42 / Arcanine_H 43 / Gyarados 43 / Milotic 46. Toxapex joins T2+ (#180 kept). T4 opens with Juan's Kingdra (entrusted to his student). Old Ludicolo_H/Ninetales_H Wallace teams retired (archive deleted).
- Story: Wallace gave up the Champion seat to guard Sootopolis's water; Juan kept the Gym meanwhile and now stands beside him (Gym 1F object at 9,2, `SootopolisCity_Gym_1F_EventScript_JuanCameo`, FLAG_BADGE08_GET-conditional). Post-battle hands off to Steven ("Show him what you've seen"). After the HM Waterfall gift, Wallace fades out of the city (FLAG_HIDE_SOOTOPOLIS_CITY_WALLACE) to wait in the Gym.
- Pokénav: Juan header = Wallace (name/pic come from gTrainers; desc "WATER ARTIST"); MatchCall_Text_Wallace (Champion header) now speaks as STEVEN.

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
| Tyranitar | Rival postgame only (sParty_Brendan/MayPostgameMudkip) | Off Roxanne5 C317; off Meteor Falls Steven C321 |
| Regirock, Regice | **Meteor Falls Steven** only (C321, `steven_meteor_falls.json`) | #194 closed; Registeel stays Steven T4 |
| Kingdra | Wallace Gym5 (Juan's) + Drake R3/R4 | **Accepted overlap** (both postgame-only) |
| Carbink, Cradily | Roxanne R3+ + Steven | **Accepted overlap** (stone student / stone master; fossil hall Steven inspired) |
| Skarmory | Winona 1/3/4/5 + Steven T2/T3 + Meteor Falls Steven (Lv80 Spikes lead, C321) | **Accepted overlap** (vanilla on both, #194) |
| Grunts (any species) | — | **Exempt** — faction uniforms |

**Villain source of truth (C316):** `pokeemerald/scripts/trainer_configs/villain_*.json` (10 configs; apply with generate_trainer.cjs modify). **Tag battles cap each opponent at 3 mons** (battle_main.c, BATTLE_TYPE_TWO_OPPONENTS) — sParty_MaxieMossdeep is Weezing/Nidoking/Camerupt (Rhydon dropped so the ace appears; Rhydon stays Maxie's via the Hideout).

**Audit (C317):** `node pokeemerald/scripts/audit_boss_species.cjs [--strict]`; **`make check_bosses` (--strict) is part of `make check_all`**, so any new boss species share fails the checks. Result C317: **COLLISIONS: 0**, stale allowlist none. Accepted (each with a written `why`, required by --strict): Skarmory, Mightyena (pairs []), Corsola_H, Gliscor_H, Kingdra, Carbink, Cradily. New overlaps: fix the roster first; allowlist only with a story reason.

**Drake learnset legality (C318):** all 5 teams legal per rom_species; source of truth `drake.json`, `drake_rematch_1-4.json`. Only exception: Dragonite Extreme Speed (Gen 3 event move, Drake signature). Backlog: R3 Flygon (Dragon Breath/Toxic Leftovers stall) hits softer than R1/R2 Flygon.
**ONE-OWNER RULE:** each overused species belongs to the boss whose identity it fits; don't re-add Tyranitar/Houndoom to Sidney.

**Sidney (C313/C314)**: Hoenn-native Dark-types, Absol ace, Honchkrow signature, distinct 6-species roster per tier, 0 shared species with other E4/Champion. Source of truth `scripts/trainer_configs/sidney_*.json` (Absol has no Night Slash/Sucker Punch — tech-debt).

**Winona (C314)**: "Hoenn's own wings" — Altaria DD ace, no Honchkrow/Crobat; source `winona_gym_1..5.json`. Story link: her dark bird "flew south" → Sidney's Honchkrow "rode a storm down from FORTREE".

## Changed Three Ability Parity — DONE (C300/C310/C311)

Tempered Blade (Sceptile_H, 81), Fey Flame (Blaziken_H, 82: 1.5x vs burned, switch-in msg; Torchic_H/Combusken_H Will-O-Wisp Lv24), Undertow (Swampert_H line, 83: 1.3x after taking damage this turn, switch-in msg). Last hand-built ability; build generate_ability.cjs (tech-debt) before a 7th.

## Roadmap

| Cycle | Objective | Issues |
|-------|-----------|--------|
| 302-323 | v2.9 "The Last Witness": Steven champion, Wallace cascade, Fey Flame/Undertow, 3 Changed-starter dens, Field Notes, boss audit 0, Meteor Falls Steven, Juan duet, 25/25 shinies, lint gates — **ALL DONE** | #180 #182 #192-#194 #201 #163 closed |
| 324-330 | v3.0 opener: FIELD NOTES key item (C324), #190 Challenge BAG lock (C325), Maxie/Archie Reckoning rematches 851/852 (C326), believers P1-P4 (C327-330) + check_trainer_slots, check_gifts Rule C, DexBelieverPlace macro, CountInkedFieldNotePages — **DONE** (none emulator-tested) | #190 closed |
| 331 | Red Ink multi-page payoff: `BufferBirchRedInkReport` / `WriteBirchRedInkReport` (Pokénav call + in-person rating, ≥3 pages inked), margin lines on inked P1-P4, `CoverYours` named cover. No flags (0x2BB still free) — **DONE** (not emulator-tested) | — |
| 332 | Consolidation/patch: merge all outstanding v3.0 emulator checks (FIELD NOTES, 4 believers, C331 payoff, Reckoning rematches, Bag lock) into one README playtest checklist; optional skeptic/forager in-scene turn. No new content. | — |

## v2.9 RC — Not Yet Playtested (player-facing copy in README "Known Issues", C320)

No headless emulator in the pipeline; everything below is statically checked only.
- **Dens** (Mt. Pyre Exterior Torchic 22,13 · Meteor Falls B1F_2R Treecko 7,4 · Shoal Cave Lower Room Mudkip 18,6): doll visible on first entry (Torchic inside the summit fog); KO or run → faded text, doll gone until you leave and re-enter; catch → gone for good; whiteout mid-battle → doll still there. Old saves: a pre-C315 KO of the Torchic hides it forever (0x2B5 reused). Shoal Cave doll is low-tide only; Entrance cue (13,29) text switches with the tide.
- **Birch's Field Notes**: one hint per call (nearest reachable den first, then the all-found line). Worst-case Pokénav call is 506 B of the 1000 B gStringVar4 (C320 hand count); check the CHAR_PROMPT_CLEAR page breaks render and the in-person hint reads as one beat.
- **Fey Flame / Undertow**: both switch-in messages render (Champion back three: Swampert_H then Blaziken_H); Undertow 1.3x only after being hit that turn; Fey Flame 1.5x vs burned targets.
- **Sootopolis Gym 1F**: Wallace (8,2) and Juan (9,2) have flag 0 (always visible); Wallace should never show in the city and the Gym at once in a normal route (Gym door is reached after the city scene).
- **Flannery badge 4**: sun/Torkoal fight (F1 Torkoal 29 White Herb Overheat; Magcargo 26 under-levelled, accepted). If it feels harder than the Brawly→Norman curve, drop Overheat to Flamethrower — don't change species.
- **Fortree postgame line**: bird keeper (20,8) switches to the Honchkrow "visiting home" line after game clear. **Researcher Bagon line** (C321) reads as numbers, not first sighting.
- **Meteor Falls Steven** (C321): he faces the wall for the first box, then turns; the Treecko branch matches 0x2B6; after the battle he fades out and stays gone; the chalk note reads only after his defeat.
- **Sootopolis Gym Juan duet** (C322): after game clear, talk to Juan (9,2): Yes → spin → doubles; test faint/switch-in on both sides, bag-full Mystic Water retry, Wallace turns right then both face down; declining and the pre-clear cameo text unchanged. The closing pair can come in mixed with the opening pair (the AI picks replacements by matchup, not party order); that is expected engine behavior, not a bug.

### Field Notes (IN-GAME C319, one hint per call C320; source `GetActiveFieldNote` in src/match_call.c)
- Texts: `gBirchFieldNoteText_{Header,Torchic,Mudkip,Treecko,AllFound}` in data/text/pokedex_rating.inc.
- Match call: `BufferPokedexRatingForMatchCall` → `AppendBirchFieldNotes` (CHAR_PROMPT_CLEAR-separated) after the Hoenn/National rating. In person: `ProfBirch_EventScript_AskRatePokedex` → `ProfBirch_EventScript_FieldNotes` (special `IsBirchFieldNoteActive`, VAR_0x8004 = 0 Torchic, 1 Mudkip, 2 Treecko, 3 all found, 4 any). NOT in `ProfBirch_EventScript_RatePokedex` (Champion's Room shares it).
- `GetActiveFieldNote` returns ONE id, first match wins: Torchic (badge 5 && !0x2B5) → Mudkip (badge 6 && !0x2B7) → Treecko (badge 8 && !0x2B6) → ALL_FOUND (all three caught) → ANY = "nothing to say" sentinel. Both paths read it, so they can't disagree.
- Worst case (C320 hand count, {PLAYER} 7 chars, 3-digit counts): AreYouCurious 81 + SoYouveSeen 65 + LessThan160 102 + OnANationwideBasis 84 + Header 55 + Mudkip hint 113 + 6 separators/EOS = **506 B** of 1000 (three hints were ~700 B). C331 Red Ink report adds up to 363 B → **869 B** (see FIELD NOTES section).
- Gift/notes agree: 8/8 cases (C320). The Changed Three gift (BirchLab `ChooseJohtoStarter`) shows found-or-hint for each den in Field Notes order Torchic, Mudkip, Treecko (C323); its lines react to the notes ("That glitter on MT. PYRE…") instead of repeating them, and each stands alone (no "And/too/either") since any found/unfound mix can occur. It uses the same three FLAG_CAUGHT_* flags; it is postgame, so badge gates don't matter, and it gives SPECIES_TREECKO/MUDKIP/TORCHIC_HOENN.
- Adding a 4th den: enum entry before ALL_FOUND (renumber the script ids!), text, `sFieldNoteTexts` entry, a `GetActiveFieldNote` branch in reach order, the all-found term, a script block — AND a FIELD NOTES notebook page (below).

### FIELD NOTES key item (C324, v3.0 opener; source `BufferFieldNotesPage` in src/match_call.c)
- Item: `ITEM_FIELD_NOTES` = 363 (renamed FRLG ITEM_FAME_CHECKER slot; Fame Checker icon reused), Key Items, registrable, ITEM_USE_FIELD → `ItemUseOutOfBattle_FieldNotes` (src/item_use.c, SetUpItemUseOnFieldCallback pattern) → script `FieldNotes_EventScript_Read` (data/scripts/prof_birch.inc, extern in include/event_scripts.h).
- Special `BufferFieldNotesPage` (VAR_0x8004 = page id) writes gStringVar4, returns FALSE for hidden pages. Script calls ids 0..8 explicitly (no loop), SE_DEX_PAGE per shown page.
- Pages: 0 cover ("Pages in your ink: inked of open"), 1 Lotad (R102), 2 Shroomish (Petalburg Woods), 3 Gligar (Granite Cave), 4 Vulpix (R113), 5 Torchic (Mt. Pyre), 6 Mudkip (Shoal Cave), 7 Treecko (Meteor Falls), 8 last page (only when all 7 inked).
- Open: pages 1-4 always; 5/6/7 on badge 5/6/8 OR the den caught — same badge gates as `GetActiveFieldNote` (comment in code; keep them identical).
- Inked: pages 1-4 = Pokedex caught flag of SPECIES_{LOTAD,SHROOMISH,GLIGAR,VULPIX}_HOENN; pages 5-7 = FLAG_CAUGHT_MT_PYRE_STARLIGHT_TORCHIC / _SHOAL_CAVE_TITAN_MUDKIP / _METEOR_FALLS_CRYSTAL_TREECKO. Ink = old text, CHAR_PROMPT_CLEAR, then `{COLOR RED}{SHADOW LIGHT_RED}` correction signed {PLAYER}.
- Texts: `gFieldNotesText_*` in data/text/pokedex_rating.inc.
- Flag `FLAG_RECEIVED_FIELD_NOTES` (0x2B9), set in exactly 2 places: BirchLab `GivePokedex` (after MigrationHint2, before the difficulty prompt) and `ProfBirch_EventScript_GiveFieldNotesLate` (called from `ProfBirch_EventScript_RatePokedexOrRegister` after faceplayer; needs FLAG_RECEIVED_POKEDEX_FROM_BIRCH; v2.9 saves get it here — lab, Route 101, Route 103 Birch).
- Shared text `LittlerootTown_ProfessorBirchsLab_Text_FieldNotesExplain::` (global) is reused by the late fallback.
- Adding a page: text pair, `sFieldNotesPages` entry (4 fields: oldText, inkText, marginText, birchText; the last two are NULL if the page has no believer) + enum, Open/Inked switch cases, FIELD_NOTES_PAGE_COUNT, and a setvar/call pair in the script (last page id moves up). A page with a believer also needs `gFieldNotesText_<X>Margin` (red, player's voice, "Since then: …") and `gBirchRedInkText_<X>` (≤28 chars/line; C-built text skips check_text_width). Re-hand-count the Pokénav worst case below.
- **Red Ink payoff (C331)**: `#define FIELD_NOTES_REPORT_MIN_PAGES 3` (next to the page enum).
  - Cover: once numInked ≥ 3, `BufferFieldNotesPage` uses `gFieldNotesText_CoverYours` ("FIELD NOTES of PROF. BIRCH / {COLOR RED}and {PLAYER}{COLOR DARK_GRAY}. / Pages in your ink: / X of Y"). The count is split over two `\l` lines because check_text_width counts each STR_VAR as 60px.
  - Inked pages with a non-NULL `marginText` add a third box (CHAR_PROMPT_CLEAR) after the ink.
  - `static u8 *WriteBirchRedInkReport(u8 *str)` (after `CountInkedFieldNotePages`) writes Open, then each inked page's non-NULL `birchText`, then Believed (if any name was written) or OnlyYou (den pages only), then Close, all CHAR_PROMPT_CLEAR-separated.
  - Callers: `BufferPokedexRatingForMatchCall` (after `AppendBirchFieldNotes`, which now returns str) and the special `u16 BufferBirchRedInkReport(void)` (FALSE under 3, else writes gStringVar4) → `ProfBirch_EventScript_RedInkReport` (prof_birch.inc, called from AskRatePokedex after FieldNotes; NOT RatePokedex/Champion's Room).
  - Texts: `gFieldNotesText_{Lotad,Shroomish,Gligar,Vulpix}Margin`, `gFieldNotesText_CoverYours`, `gBirchRedInkText_{Open,Lotad,Shroomish,Gligar,Vulpix,Believed,OnlyYou,Close}`.
  - **Pokénav worst case (C331 hand count): 506 (C320) + report 363 (Open 44 + names 53+51+51+53 + Believed 56 + Close 48 + 7 separators) = 869 B of 1000.** Longest notebook page: Gligar 70+64+57 + 2 separators + EOS = 194 B.
  - Static trace: memory/player-journey-map.md "Red Ink payoff — static walkthrough (C331)". Emulator checks there.
- Emulator checks (not done): red ink renders in the field message box; registered-SELECT use works; cover count on a fresh save reads "0 of 4".
- **`CountInkedFieldNotePages` special (C330)**: 0-7 inked, all pages, not just open (src/match_call.c, right after `IsFieldNotesPageInked`; `specialvar VAR_RESULT, CountInkedFieldNotePages`). Use this for any multi-page check instead of chaining ScriptCheckPokedexCaught. Not used by the cover count (that counts open pages only). First user: the Route 113 picnicker's rumour line.
- World reactions: Route 104 skeptic (page 1, LOTAD_HOENN), Petalburg Woods forager (page 2, SHROOMISH_HOENN), Granite Cave B1F hiker (page 3, GLIGAR_HOENN) and Route 113 picnicker (page 4, VULPIX_HOENN) read the same dex-caught truth as IsFieldNotesPageInked.
  - **Template (C329): `EventMacro_DexBelieverPlace species, localid, x, y, movement`** (asm/macros/event_macros.inc), inlined in the map's MAP_SCRIPT_ON_TRANSITION script before its end/goto: once species is dex-caught it does setobjectxyperm + setobjectmovementtype. Pass the object's own map.json tile for a facing-only change. A new believer = `"local_id"` on the map.json object + one macro line + a hand-written talk script (dialogue is never macro'd). All four believers use it. Static walkthrough of every believer state: memory/player-journey-map.md "Red Ink believers — static walkthrough (C330)".
  - Per-believer details (objects, tiles, talk labels, item flags, tile-rejection reasons, emulator checks): memory/player-journey-map.md "Red Ink believers — static walkthrough (C330)". Tiles: skeptic Route104 33,49 (face L→R); forager PetalburgWoods 18,34 D → 11,24 U; hiker GraniteCave_B1F 28,19 (U→D, HARD_STONE flag 0x2BA); picnicker Route113 38,8 R → 38,6 U (no flag/item). Tiles chosen by map.bin scan: collision 0, same elevation, clear of trainer sight rows, warps, wander boxes and one-tile chokepoints.
  - Believer emotional arc (one per page, never repeat a reaction): schoolkid = accepts (P1), forager = grieves (P2), hiker = refuses then relents (P3), picnicker = delight (P4). No new believer until after the payoff; next ones at the dens. Rule: **every world reaction changes something visible** (position / facing / item / battle), not only text.
  - Lint: `check_gifts.cjs` Rule C fails any ScriptCheckPokedexCaught whose nearest preceding `setvar VAR_0x8004, SPECIES_X` (same label block) is a vanilla species with an _HOENN twin, or has no species setvar. C329: an `EventMacro_DexBelieverPlace` line is also a dex check of its first argument (fails if not SPECIES_*, or vanilla with an _HOENN twin). Exceptions go in `DEX_CHECK_ALLOWLIST` (file:label strings, empty). Prints `dex-check species: 14 calls OK` (C330: +picnicker talk check +Route113 macro line).

### C325 Challenge Bag-lock audit (read-only; no fights changed)
Cap = `GetChallengeLevelCap()` badges held at the fight (soft: EXP /10 at or over cap, so players can overshoot). Ace = trainer_parties.h level + `sChallengeModeScaling` boost (Leader +3, Rival +2, Champion +5). Items = `gTrainers[].items` the AI can no longer use in Challenge.

| Fight (trainer ID) | Cap | Ace (base → Challenge) | Items removed by lock | Gap |
|---|---|---|---|---|
| Flannery (TRAINER_FLANNERY_1, 3 badges) | 30 | Torkoal 29 → 32 | 2x Hyper Potion | 2 |
| Juan (TRAINER_JUAN_1, 7 badges) | 48 | Milotic 46 → 49 | 2x Hyper Potion | 1 |
| Wally VR (TRAINER_WALLY_VR_1, RIVAL) | 55 | Gardevoir 58 → 60 | 3x Full Restore | 5 (edge, not flagged) |
| Champion Steven (TRAINER_WALLACE, CHAMPION) | 55 | Metagross 57 → 62 | 4x Full Restore | **7 — watch for wall** |
| Meteor Falls Steven (TRAINER_STEVEN, RIVAL, postgame) | 55 | Metagross 86 → 88 | 4x Full Restore | **33 — watch for wall** (postgame superboss; cap never rises past 55) |

Every audited fight lost its trainer items, so the lock makes each one easier for the AI side, while the player loses potions too. Champion: whether losing 4 Full Restores (him) vs. the player's whole BAG nets out is the playtest question. If Champion Challenge reports come back as a wall, the levers are the CHAMPION +5 boost or the 55 cap, not his roster. Mossdeep Steven tag partner: his AI is already item-less (INGAME_PARTNER early-out in `ShouldUseItem`).

### C325 BAG lock — Emulator checklist (not done)
- (a) Challenge + trainer battle: BAG → "CHALLENGE: your BAG stays shut! / Fight with what you brought." then back to the FIGHT/BAG/POKéMON/RUN menu (no turn lost).
- (b) Challenge + wild battle: BAG opens, Poké Balls throw and catch.
- (c) Normal Mode trainer battle: BAG opens as before.
- (d) Challenge vs an item trainer (Wally VR / Champion / Meteor Falls Steven, all Full Restore): the AI never uses one; held items (Sitrus, Leftovers, Lum) still trigger.
- Also: Birch's difficulty prompt shows the 2 new boxes before "It's how I'd do it, honestly." and the multichoice still lands on the last box.

---

## Technical Reference

- **Difficulty flag**: `FLAG_DIFFICULTY_CHALLENGE` at 0x286. Helper: `IsChallengeModeActive()`.
- **Flag space**: Custom 0x264-0x2BA (0x2B9 FIELD_NOTES C324, 0x2BA GRANITE_HIKER_HARD_STONE C329). Next available: **0x2BB** (LAST free custom flag; 0x2BC+ vanilla). After it, reuse FLAG_TEMP or a VAR bit, or reclaim a dead vanilla flag after grep.
- **Encounter slots**: Land 12, Water 5, Fish 10. File: `src/data/wild_encounters.json`.
- **Trainer capacity**: 891/891 defined; 9 unreferenced IDs (list below). Ledger `make check_trainer_slots` (scripts/check_trainer_slots.cjs, in check_all; RECLAIMED guard list in the script — add each newly reclaimed ID there). C327 scan: 9 zero-reference candidates — 117 CINDY_2, 173 DUDLEY, 462 KAYLEE, 485 AMY_AND_LIV_3, 486 GINA_AND_MIA_2, 581 TERRY, 633 LUCAS_2, 634 MIKE_1, 853 MAY_PLACEHOLDER (CINDY_2 / AMY_AND_LIV_3 are the tiers vanilla gRematchTable skips; still hand-verify each before reuse). 568 = TRAINER_JUAN_DUET (C322); 851 = TRAINER_MAXIE_RECKONING, 852 = TRAINER_ARCHIE_RECKONING (C326, renamed from TRAINER_RED/LEAF).
- **Reckoning rematches (C326)**: source of truth `scripts/trainer_configs/villain_{maxie,archie}_reckoning.json` (regenerate with generate_trainer.cjs; Archie audit regex is now `/^sParty_Archie/`). Objects are appended last in MtChimney/Route128 map.json (no LOCALID) on the original leaders' tiles, and reuse the grunts' postgame hide flags (FLAG_HIDE_MT_CHIMNEY_POSTGAME_MAGMA_GRUNT, FLAG_HIDE_ROUTE128_POSTGAME_AQUA_GRUNT, cleared by OnTransition after FLAG_SYS_GAME_CLEAR) — no new flags. YES/NO offer → trainerbattle_single; goto_if_defeated gives the Done line. Challenge +2 levels via the MAGMA/AQUA_LEADER classes (64-67/70 → 66-69/72). Each carries 2 Full Restores (Normal only — the C325 Bag lock strips them in Challenge) plus held items.
- **Trainer cap decision (C324)**: NO plain TRAINERS_COUNT/MAX_TRAINERS_COUNT bump. SYSTEM_FLAGS = TRAINER_FLAGS_END + 1 (flags.h), so any bump shifts every FLAG_SYS_* flag and breaks v2.9 saves. Plan: reclaim never-battled vanilla IDs. Research (C324 grep): TRAINER_RED (851) and TRAINER_LEAF (852) had ZERO references → reclaimed C326. Link-path check (C326): gTrainers is `const` (ROM) and TRAINER_LINK_OPPONENT = 2048 sits outside the table, so the pret-wiki cable-club "overwrite" caveat does not apply to reclaimed slots. TRAINER_MARIELA (848), TRAINER_ALVARO (849), TRAINER_EVERETT (850) are battled in data/maps/Route110_TrickHousePuzzle7/scripts.inc:303/308/313 → NOT free. Find more candidates the same way (FRLG/unused IDs with no script refs) before reusing.
- **Event Macros**: `event_macros.inc` (GlimpseEvent, BadgeGateShow, ConditionalDialogue, StaticDen/StaticDenTransition/StaticDenTryRemove), `difficulty_utils.inc` (DifficultyDialogue).
- **Multichoice IDs**: Last used 115. Next: 116.
- **Specials**: custom specials are appended at the end of `data/specials.inc` (`def_special Name`). C319 gained `IsBirchFieldNoteActive`, C324 `BufferFieldNotesPage` (both src/match_call.c, prototypes in include/match_call.h). C327 ScriptCheckPokedexCaught (src/script_pokemon_util.c, VAR_0x8004 = species; no prototype, like ScriptCheckPokedexSeen).
- **Custom species (40)**: Last = Toxapex(450). EGG=451, NUM_SPECIES=451. 12 cross-gen evos + 25 _HOENN forms + 3 standalone imports (Carbink, Toxapex, etc.), all fully registered + verified.
- **Custom abilities**: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81), FEY_FLAME(82), UNDERTOW(83). ABILITIES_COUNT=84. Next: 84. BATTLESTRINGS_COUNT=385 (next STRINGID 385).
- **Custom moves**: SPORE_FIST(378), TIDAL_FLARE(379), IRON_LEAF(380). MOVES_COUNT=381. Next: 381. 6 files per move. MOVE_NAME_LENGTH=12.
- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). Damage-multiplier + switch-in message: 9 files (see battle-engine.md Fey Flame / Undertow). ABILITY_NAME_LENGTH=14.
- **Quest flag pattern**: 3-state (STARTED -> INVESTIGATED -> COMPLETE). VAR_TEMP_1 guards prevent re-fire.
- **Dawn Stone**: ITEM_DAWN_STONE (99, slot 0x063, Moon Stone icon), EVO_ITEM_FEMALE method, Shoal Cave Ice Room (flag 0x468).
- **Generator toolchain**: `generate_species.cjs` (27-file + ~6 manual in pokemon.c/pokemon_icon.c), `generate_trainer.cjs` (3-file), `generate_npc_dialogue.cjs` (2-file + --update mode C287), `verify_species.sh` (27-file check, C287).
