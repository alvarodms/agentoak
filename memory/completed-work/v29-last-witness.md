# v2.9 "The Last Witness" — design and RC detail (archived from strategy-notes C347)

> Moved out of strategy-notes.md in C347 to make room for v3.1. Shipped C302-C323; never emulator-tested. Source of truth for teams = `pokeemerald/scripts/trainer_configs/*.json`; this file is the design record.

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
**Design caveat**: the "mirror" premise assumes the player raises a Changed starter; the Mt. Pyre Torchic (C312) and Meteor Falls Treecko (C315) dens give every player a pre-Champion route. Revisit if playtesters miss the mirror.

### Wallace Cascade — SHIPPED C309 (source of truth: `pokeemerald/scripts/trainer_configs/wallace_gym_*.json`)

- TRAINER_JUAN_1-5 slots now = **WALLACE** (name "WALLACE", pic TRAINER_PIC_CHAMPION_WALLACE, class LEADER; items/doubles/AI unchanged). Arrays sParty_WallaceGym1-5. Constant names (TRAINER_JUAN_*, REMATCH_JUAN, FLAG_ENABLE_JUAN_MATCH_CALL, MC_HEADER_JUAN) deliberately untouched.
- Slot 568 = **TRAINER_JUAN_DUET** (C322, Juan postgame doubles). 851 = **TRAINER_MAXIE_RECKONING**, 852 = **TRAINER_ARCHIE_RECKONING** (C326, ex-RED/LEAF). 8 unreferenced trainer IDs (C334 recount; 581 became TRAINER_PYRE_MOURNER): 117,173,462,485,486,633,634,853. Hand-verify each (computed-ID refs are invisible to the scan) before use; never bump TRAINERS_COUNT.
- Wallace = **Water-first, exactly one migration species (Arcanine_Hoenn, used by no other trainer)**. Milotic ace every tier. Gym: Sealeo 41 / Whiscash 42 / Arcanine_H 43 / Gyarados 43 / Milotic 46. Toxapex joins T2+ (#180 kept). T4 opens with Juan's Kingdra (entrusted to his student). Old Ludicolo_H/Ninetales_H Wallace teams retired (archive deleted).
- Story: Wallace gave up the Champion seat to guard Sootopolis's water; Juan kept the Gym meanwhile and now stands beside him (Gym 1F object at 9,2, `SootopolisCity_Gym_1F_EventScript_JuanCameo`, FLAG_BADGE08_GET-conditional). Post-battle hands off to Steven ("Show him what you've seen"). After the HM Waterfall gift, Wallace fades out of the city (FLAG_HIDE_SOOTOPOLIS_CITY_WALLACE) to wait in the Gym.
- Pokénav: Juan header = Wallace (name/pic come from gTrainers; desc "WATER ARTIST"); MatchCall_Text_Wallace (Champion header) now speaks as STEVEN.

### Species Reuse (#193) — moved C335 to memory/boss-species-ownership.md (one-owner table, villain/Drake/Sidney/Winona sources of truth, `make check_bosses`). ONE-OWNER RULE: each overused species belongs to the boss whose identity it fits.

## Changed Three Ability Parity — DONE (C300/C310/C311)

Tempered Blade (Sceptile_H, 81), Fey Flame (Blaziken_H, 82: 1.5x vs burned, switch-in msg; Torchic_H/Combusken_H Will-O-Wisp Lv24), Undertow (Swampert_H line, 83: 1.3x after taking damage this turn, switch-in msg). Last hand-built ability; build generate_ability.cjs (tech-debt) before a 7th.


## v2.9 RC — Not Yet Playtested (tile/flag detail; player route = playtest-checklist.md)

No headless emulator in the pipeline; everything below is statically checked only.
Playtest route: memory/playtest-checklist.md (C332) is the single list, mirrored into README "Help Playtest v3.0" (edit the checklist first). Playtest presets: `make playtest` (den tour, PLAYTEST=1) and `make playtest_coda` (Red Ink coda, PLAYTEST=2). Adding a preset = new .inc + PRESETS row in check_playtest.cjs + new_game.c branch + Makefile target. BAG lock checks = route steps 1, 12, 16.
- **Dens** (Mt. Pyre Exterior Torchic 22,13 · Meteor Falls B1F_2R Treecko 7,4 · Shoal Cave Lower Room Mudkip 18,6): doll visible on first entry (Torchic inside the summit fog); KO or run → faded text, doll gone until you leave and re-enter; catch → gone for good; whiteout mid-battle → doll still there. Old saves: a pre-C315 KO of the Torchic hides it forever (0x2B5 reused). Shoal Cave doll is low-tide only; Entrance cue (13,29) text switches with the tide.
- **Birch's Field Notes**: one hint per call (nearest reachable den first, then the all-found line). Pokénav worst case is budgeted by `make check_matchcall_len` (C332); check the CHAR_PROMPT_CLEAR page breaks render and the in-person hint reads as one beat.
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
- Pokénav worst case: authoritative figure is `make check_matchcall_len` (C332; hand counts retired).
- Gift/notes agree: 8/8 cases (C320). The Changed Three gift (BirchLab `ChooseJohtoStarter`) shows found-or-hint for each den in Field Notes order Torchic, Mudkip, Treecko (C323); its lines react to the notes ("That glitter on MT. PYRE…") instead of repeating them, and each stands alone (no "And/too/either") since any found/unfound mix can occur. It uses the same three FLAG_CAUGHT_* flags; it is postgame, so badge gates don't matter, and it gives SPECIES_TREECKO/MUDKIP/TORCHIC_HOENN.
- Adding a 4th den: enum entry before ALL_FOUND (renumber the script ids!), text, `sFieldNoteTexts` entry, a `GetActiveFieldNote` branch in reach order, the all-found term, a script block — AND a FIELD NOTES notebook page (below).

