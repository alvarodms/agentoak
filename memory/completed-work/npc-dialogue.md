# NPC Dialogue

All modified NPC dialogue files — Professor Birch, Rival, Villains, Gym Leaders, Elite Four, and flavor text NPCs.

---

## Collapsed History (C15-267) — See git history for full details

- **Birch/Lab** (C15,24,180,181,279,286,319): Opening speech, difficulty selection, postgame Changed Three gift, Reckoning collection quest (PP_MAX)
- **Rival** (C25-29,273): 4 encounters rewritten. C273: Route 119 + Lilycove → specific regional form references
- **Villains** (C248,249,284,285,286): Magma (Mt.Chimney/Lavaridge/Meteor Falls) + Aqua (Slateport/R128/Shoal Cave) postgame arc. 6 ex-Team NPCs. Reckoning collection quest.
- **Gym Leaders** (C25-29,244,245,269,271,283,305): All 8 rewritten. C269: Brawly/Norman/Drake regional form refs. C271: Wattson Lotad_Hoenn. C283: Roxanne fossil scholar + T&L Espeon empathy. C305: Roxanne post-rematch → RUSTURF TUNNEL crystals + geology rewriting (Carbink foreshadow).
- **E4 + Champion** (C33,42,203,204,212,213,214,283): Sidney/Phoebe/Glacia/Drake/Wallace rewritten for cross-gen evo + regional form themes
- **Flavor NPCs** (~30 cycles): Early foreshadowing (sighting events), mid-game escalation (Bagon Colony, weather omens), The Gathering Storm (ocean witnesses), Echo Dialogue Layer (C232), Changed Trainer Witnesses (C235,238), Migration Acknowledgment NPCs (C267)
- **Quests** (C116-243): Beast sightings, Primal network, Sky Guardian, 4 side quests, Resonance (C233), Cosmic (C242,243)
- **Difficulty NPC** (C214): PetalburgCity PokemonCenter downgrade
- **Wally VR** (C270, VictoryRoad_1F) + **Rival arc** (C273, Route119/Lilycove): regional-form references

## Reckoning Arc (C284-286)

- **Magma** (C284): Mt.Chimney upgrade + Lavaridge + Meteor Falls ex-grunt NPCs. FLAGS 0x2A9-0x2AD.
- **Aqua** (C285): Slateport + R128 + Shoal Cave ex-grunt NPCs. FLAGS 0x2AE-0x2B3.
- **Collection** (C286): Birch Lab payoff, R128 horror polish, FLAG_RECKONING_COMPLETE 0x2B4. Build fixes (MUDKIP_HOENN→MUDKIP).

---

## v2.8 (C298-299) — collapsed
- C298 Tell→Show: R112 Hiker, R113 FrostTracker, R119 Ecologist trimmed (Hours 3-6 Tell:Show 7:2→4:5). C299: Brawly/Wattson defeat + post-battle text rewritten to battle moments. See git history.

---

## Champion Dialogue — C308 (supersedes C303 Wallace witness text)

EverGrandeCity_ChampionsRoom/{scripts.inc,map.json}: STEVEN object gfx, LOCALID_CHAMPIONS_ROOM_STEVEN, all Wallace labels → Steven. Intro/Defeat/PostBattle/Rematch texts rewritten; VAR_STARTER_MON beat (Larvitar/Bagon/Dratini) after first-clear post-battle; StevenComeWithMe/StevenWaitOutside. EverGrandeCity_HallOfFame: STEVEN gfx + LOCALID_HALL_OF_FAME_STEVEN + 2 texts. EverGrandeCity_DrakesRoom: post-battle "STEVEN is through that door". src/battle_transition.c: MUGSHOT_CHAMPION → TRAINER_PIC_STEVEN. Wallace-as-figure text elsewhere left for C309 (list in strategy-notes).

---


## C309 — Wallace comes home (Sootopolis Gym 8)
Sootopolis Gym_1F (Juan texts → Wallace, Juan cameo 9,2), Gym_B1F (9 trainer texts), SootopolisCity (gym sign, Wallace fades after HM Waterfall), PokemonCenter_1F, House3, CaveOfOrigin_B1F, MossdeepCity, match_call.inc/match_call_messages.h/strings.c (Juan header = Wallace, Champion header = Steven). C314: FortreeCity_Gym + SidneysRoom Honchkrow story link. See git log C309/C314.

## C320 — v2.9 release-candidate polish

| File | Change |
|------|--------|
| `data/maps/FortreeCity/scripts.inc` | `FortreeCity_EventScript_MigrationBirdKeeper` (live object 20,8) now lock/faceplayer + `goto_if_set FLAG_SYS_GAME_CLEAR` → `_MigrationBirdKeeperHonchkrow` + `FortreeCity_Text_MigrationBirdKeeperHonchkrow` ("Last night a big dark bird… Like it was visiting home."), the postgame Winona→Sidney Honchkrow callback. Deleted the dead C141 `FortreeCity_EventScript_MigrationBirdwatcher` + text: no map object referenced it (the plan had targeted it), it repeated the keeper's "twenty years" line, and it had a three-`\n` overflow. |
| `data/maps/SootopolisCity/scripts.inc` | Deleted dead `SootopolisCity_EventScript_WallaceMoveFromGym(West)` + `SootopolisCity_Movement_WallaceMoveFromGym(West)` (unreferenced since the C309 fade-out). VAR_SOOTOPOLIS_WALLACE_STATE kept. |
| `data/maps/FortreeCity_Gym/scripts.inc` | Read-through fixes: `WinonaPostRematch` and `WinonaRematchNeedTwoMons` had 3 chained `\n` lines (overflow the 2-line box) → 2nd/3rd use `\l`. |

## C321 — Meteor Falls Steven collector scene + read-through fixes

| File | Change |
|------|--------|
| `data/maps/MeteorFalls_StevensCave/scripts.inc` | Full rewrite. Old Expect-the-worst / StevenDefeat / MyPredictionCameTrue texts + `_EventScript_Defeated` deleted. Steven: WallMusing (said facing the wall) → ! → face player → `goto_if_set FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO` TreeckoFound / else TreeckoWaiting → PreBattle → `trainerbattle_no_intro TRAINER_STEVEN` (Defeat) → PostBattle (collector/listens + Sealed Chamber braille hint, "two old swimmers" = vanilla `CheckRelicanthWailord`, still in SealedChamber_InnerRoom) → setflag FLAG_DEFEATED_METEOR_FALLS_STEVEN → fade, removeobject, fade. New `_EventScript_ChalkNote` (only after defeat): "Fresh chalk on the cave wall. / Some things should be found. Some should be carried. / - S." (B1F_2R note format). |
| `data/maps/MeteorFalls_StevensCave/map.json` | Steven object flag "0" → FLAG_DEFEATED_METEOR_FALLS_STEVEN (old saves that beat him see the note). New sign bg_event (19,2) elev 3 FACING_NORTH → ChalkNote; (19,2) is wall metatile 561 (collision 1), (19,3) walkable. Flag used only in this map. |
| `data/maps/MeteorFalls_1F_1R/scripts.inc` | `ColonyResearcher2`: "appeared ... never been recorded in HOENN" → "The old BAGON colony by the falls has swollen almost overnight. / HOENN has never seen Dragon-types in such numbers." (Drake fact conflict). `ColonyPostBattle3` "drawing these creatures to HOENN..." → "to the falls...". Other researcher texts checked: no first-sighting claims. |
| `data/maps/EverGrandeCity_ChampionsRoom/scripts.inc` | `PostBattleSpeech` no longer repeats the Intro's "rare stones": "I spent years reading HOENN's stone, waiting to see what it would become. / You didn't come to read anything. You just walked forward. / CHAMPION… that word belongs to you now." |
| `data/maps/SootopolisCity_Gym_1F/scripts.inc` + `include/constants/flags.h` | **C322 Juan duet**: `JuanCameo` → `goto_if_set FLAG_SYS_GAME_CLEAR, _JuanDuet` after faceplayer. New `_JuanDuet` (defeated → `_JuanDuetDone`; YESNO offer; No → `_JuanDuetDecline`; Yes → `_Movement_JuanSpin` on VAR_LAST_TALKED → `trainerbattle_double TRAINER_JUAN_DUET` → `_JuanDuetDefeated`), `_JuanDuetDefeated` (gift text, giveitem ITEM_MYSTIC_WATER, bag full → Common_EventScript_ShowBagIsFull, set FLAG_RECEIVED_JUAN_MYSTIC_WATER (0x2B8, was FLAG_UNUSED_0x2B8), Wallace (lid 1) faces right + "You still lead, you know.", Juan (lid 3) faces left, both face down), `_JuanDuetDone` (flag unset → retry gift). 8 new texts (Offer/Decline/Intro/Defeat/NeedTwoMons/Gift/WallaceToJuan/Done). Old Juan/Wallace text unchanged. |
| `data/maps/{DewfordTown,LavaridgeTown,Route119,RustboroCity,TerraCave_End}/scripts.inc` | **C322 width rewraps** (words unchanged, all lines ≤208px): Dewford TinyIslandCommunity box 2 → 4 scrolled lines; Lavaridge OhYouLikeHotSprings "the" moved up; Route119 WeatherIntern split into 2 boxes at "haywire!"; Rustboro MigrationScientist → \n/\l/\l; TerraCave GroudonCaught split at "grows still." |

## C323 — v2.9 read-through pass (text only, labels unchanged)

| File | Change |
|------|--------|
| `data/maps/EverGrandeCity_SidneysRoom/scripts.inc` | `_Text_IntroSpeech`: "Everybody ran when the storm came" → "when the sky went dark" (one "storm" left: "HONCHKROW rode a storm down", the Winona link). |
| `data/maps/FortreeCity/scripts.inc` | `_Text_MigrationBirdKeeperHonchkrow` opener → "Last night I heard wings over / the treehouses before I saw it." (no longer copies Winona's "circling at dusk"). |
| `data/maps/FortreeCity_Gym/scripts.inc` | `_Text_WinonaPreRematch`: "Murkrow" → "MURKROW", rewrapped to 3 lines (\n/\l). |
