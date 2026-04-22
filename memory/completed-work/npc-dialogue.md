# NPC Dialogue

All modified NPC dialogue files — Professor Birch, Rival, Villains, Gym Leaders, Elite Four, and flavor text NPCs.

---

## Professor Birch

| File | Cycle | Notes |
|------|-------|-------|
| `data/text/birch_speech.inc` | 24 | Opening sequence → migration mystery |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | 15, 180, **181** | Lab aide + Birch rescue; C180: migration hint; C181: difficulty selection multichoice |
| Oldale/Rustboro/Dewford/Mauville PokemonCenter scripts | 181, **183** | Difficulty-aware helper NPCs (4 maps) |

## Rival, Villains, Gym Leaders (C25-173)

Rival (4 encounters rewritten), Villains (Maxie/Archie), all 8 Gym Leaders (pre-battle + rematch). C173: Norman/Winona expanded.

## Elite Four & Champion — Cycles 33, 42, **203**, **204**

C203: Rewrote Sidney (Murkrow/Houndoom callbacks), Phoebe (Mt. Pyre grandmother + Corsola_Hoenn intro), Glacia (Route 125 cold + migration pilgrim). Each ends with a question. Phoebe team: Banette → Corsola_Hoenn.
C204: Rewrote Drake (Bagon Colony + Draconid legend) and Wallace (The Gathering + Arcanine_Hoenn). Wallace team: Tentacruel → Arcanine_Hoenn. Drake→Wallace bridge + Hall of Fame setup.

## Flavor NPCs (Collapsed by Era)

**Early-game foreshadowing** (C15, 28, 36, 140, 144, 145, 152, **180**, **224**, **258**): LittlerootTown→Route 116 migration sightings. 4 glimpse coord_events (R101/102/104/116, flags 0x278-0x27B). Petalburg Woods Pikachu OW sprint (flag 0x27E-0x27F). C180: Birch kids. C224: Mom migration send-off — Running Shoes → 5 Poké Balls + migration dialogue (#135). C258: Route 102 fisherman rewritten — Lotad_Hoenn electric discovery framing ("My line keeps getting shocked").
**Mid-game escalation** (C29, 94, 95, 141, 149, 153, 154, 159, 160, 162): Weather Institute Dr. Hartley, Meteor Falls Bagon Colony (flag 0x280), Mt. Pyre Restless Dead (flag 0x281), weather omen NPCs (flags 0x282-0x285), route identity NPCs (R110/113/119/123). R119 thunderstorm event (flags 0x27C-0x27D).
**Late-game + The Gathering Storm** (C33, 112, 113, 186, 187, 188, 189, 190, **205**): City atmosphere (Mossdeep/Sootopolis/Pacifidlog badge-gated), ocean route witnesses (R124/126/127/128/131), Deep Migration R128 (flag 0x287), The Gathering R126 (flags 0x288-0x289). C205 "The Exhale": 6 ocean NPCs gain post-Rayquaza resolved dialogue, R126 fog thins.
**Postgame quests** (C116, 118, 120, 135-137, 139, 192, 193, 194, 200, **207**, **209**, **210**, **247**): Beast sightings, Primal network, Sky Guardian arc, 4 side quests (Elder's Current/Hartley's Report/Mossdeep Signal/Fog Beneath). C207: Mt. Pyre Coral Mourner NPC. C209: Bagon Colony researcher postgame callback. C210: Deoxys "Second Signal" quest. C247: Steven Meteor Falls dialogue — Sky Pillar coda ("Whatever stirred up there… it wasn't meant for me") inserted before battle invitation.

## Cross-Gen Evolution Dialogue — Cycles 212-214

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/EverGrandeCity_SidneysRoom/scripts.inc` | **212** | Sidney intro+defeat+rematch rewritten for Honchkrow theme |
| `data/maps/EverGrandeCity_PhoebesRoom/scripts.inc` | **212** | Phoebe intro+rematch rewritten for Dusknoir theme |
| `data/maps/EverGrandeCity_GlaciasRoom/scripts.inc` | **213** | Glacia intro+defeat+rematch rewritten for Froslass/Mamoswine |
| `data/maps/MossdeepCity_Gym/scripts.inc` | **214** | Tate & Liza intro+defeat+post-battle+pre-rematch+rematch-defeat+post-rematch rewritten for Farigiraf/duality theme. TATE:/LIZA: speaker tags throughout. |

## Bagon Colony Researcher Update — Cycles 215, 225

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/MeteorFalls_1F_1R/scripts.inc` | **215**, **225** | PostChampion script: FLAG_BAGON_COLONY_CALLBACK (0x29B) gates first-visit vs. revisit. C215: revisit text hinting at B1F_2R encounter. C225: added 4th state — witness dialogue triggers when player has seen SPECIES_BAGON_HOENN in Pokédex. Uses `ScriptCheckPokedexSeen` special. "They dream of enduring." |
| `include/constants/flags.h` | **215** | FLAG_BAGON_COLONY_CALLBACK at 0x29B |
| `src/script_pokemon_util.c` | **225** | Added `ScriptCheckPokedexSeen()` special — checks if species in VAR_0x8004 has been seen in Pokédex |
| `data/specials.inc` | **225** | Registered `ScriptCheckPokedexSeen` (line 541) |

## Difficulty Downgrade NPC — C214

PetalburgCity PokemonCenter: scripts.inc + map.json + script_menu.h (constants + data). Challenge→Normal downgrade, MULTI_DIFFICULTY_DOWNGRADE=115.

## Echo Dialogue Layer — Cycle 232

Cross-referencing NPC dialogue connecting all 4 regional forms (Vulpix_Hoenn, Pinsir_Hoenn, Stantler_Hoenn, Corsola_Hoenn) + "Changed Trainer" diegetic motif debut.

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/Route112/scripts.inc` | **232** | NEW: MigrationHiker — references Pinsir_Hoenn (local) + Stantler_Hoenn (R119 ranger report) |
| `data/maps/Route112/map.json` | **232** | Added OBJ_EVENT_GFX_HIKER at (9,34), MOVEMENT_TYPE_FACE_RIGHT |
| `data/maps/Route113/scripts.inc` | **232** | MODIFIED: FrostTracker text extended — cross-references R112 fire-type Pinsir, fire-and-ice parallel |
| `data/maps/Route119/scripts.inc` | **232** | NEW: Ecologist — references ALL 4 regional forms, sends findings to Dr. Hartley |
| `data/maps/Route119/map.json` | **232** | Added OBJ_EVENT_GFX_SCIENTIST_1 at (7,100), MOVEMENT_TYPE_FACE_RIGHT |
| `data/maps/Route119_WeatherInstitute_1F/scripts.inc` | **232** | MODIFIED: Dr. Hartley gains badge-gated (FLAG_BADGE05_GET) post-migration dialogue referencing 3 regional forms + "transformation" thesis |
| `data/maps/FortreeCity/scripts.inc` | **232** | NEW: ChangedTrainer — notices player's cyan palette, "HOENN changes everyone who walks through it. Not just POKéMON." |
| `data/maps/FortreeCity/map.json` | **232** | Added OBJ_EVENT_GFX_WOMAN_2 at (34,5) elev 4, MOVEMENT_TYPE_FACE_LEFT |

## Changed Trainer Witnesses — Cycle 235

Post-Champion dialogue: Mom, Rival, Norman, and Nurse Joy notice the player's transformation. Each reacts through their relationship lens (emotional/competitive/evaluative/clinical).

| File | Cycle | Notes |
|------|-------|-------|
| `data/scripts/players_house.inc` | **235**, **238** | MODIFIED: `PlayersHouse_1F_EventScript_Mom` gains FLAG_SYS_GAME_CLEAR branch → `MomWitness`. C238: Fixed MomWitness to goto HealParty after witness text (was blocking heal). |
| `data/maps/LittlerootTown_BrendansHouse_1F/scripts.inc` | **235** | MODIFIED: Added `PlayersHouse_1F_Text_MomChangedTrainer` text label. |
| `data/maps/LittlerootTown_MaysHouse_2F/scripts.inc` | **235** | MODIFIED: `RivalsHouse_2F_EventScript_Rival` gains FLAG_SYS_GAME_CLEAR branch → `RivalWitness`. Added `RivalsHouse_2F_Text_RivalChangedTrainer`. Shared by both houses. |
| `data/maps/PetalburgCity_Gym/scripts.inc` | **235** | MODIFIED: `PetalburgCity_Gym_Text_DadNoAmountOfTrainingIsEnough` rewritten as witness dialogue. Same script flow, new text. |
| `data/maps/OldaleTown_PokemonCenter_1F/scripts.inc` | **235**, **238** | MODIFIED: Nurse gains one-time witness message gated by FLAG_CHANGED_TRAINER_NURSE (0x2A0) + FLAG_SYS_GAME_CLEAR. C238: Removed stray `release` between witness and heal (lock gap fix). |
| `include/constants/flags.h` | **235** | FLAG_CHANGED_TRAINER_NURSE at 0x2A0. |

## Quest 6: The Resonance (C233) + Resonance Residue (C236)

Deoxys Quest II — Three-location postgame investigation, then environmental follow-through.

| File | Cycle | Notes |
|------|-------|-------|
| `include/constants/flags.h` | **233**, **236** | C233: FLAGS 0x29C-0x29F (RESONANCE_STARTED/METEOR/OCEAN/COMPLETE). C236: FLAGS 0x2A1-0x2A2 (RESIDUE_MOSSDEEP/RESIDUE_OCEAN). |
| `data/maps/MossdeepCity_SpaceCenter_2F/scripts.inc` | **233**, **236**, **237** | C233: Resonance offer/progress/completion/post-complete + terminal readouts. C236: ResonancePostCheck branch (screen flash FADE_TO_WHITE/FADE_FROM_WHITE), residue discovery dialogue, TerminalResidueStable branch. C237: Rare Candy reward added to Residue first-visit branch (giveitem + ResidueGift text). |
| `data/maps/MeteorFalls_B1F_2R/scripts.inc` | **233**, **236** | C233: Meteorite bg_event 3 states. C236: ResonanceMeteorResidue — steady glow + warmth text after Resonance completion. |
| `data/maps/MeteorFalls_B1F_2R/map.json` | **233** | Added bg_event "sign" at (3,5), BG_EVENT_PLAYER_FACING_ANY |
| `data/maps/Route131/scripts.inc` | **233**, **236** | C233: ShimmerSpotTrigger Resonance branches + Ocean vision. C236: NEW ResidueSwimmer NPC — 3 states (normal/first-time/revisit), casual blue-green lights dialogue. |
| `data/maps/Route131/map.json` | **236** | Added OBJ_EVENT_GFX_SWIMMER_M at (25,15), MOVEMENT_TYPE_FACE_DOWN, non-trainer, script ResidueSwimmer. |

## Gym Leader Narrative Pass — Cycles 244-245

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/RustboroCity_Gym/scripts.inc` | **244** | Roxanne intro rewritten: Bagon_Hoenn near Meteor Falls, living stone hide, academic curiosity |
| `data/maps/DewfordTown_Gym/scripts.inc` | **244** | Brawly intro rewritten: Hitmonlee washed up on Dewford shore, sparring buddy, casual respect |
| `data/maps/MauvilleCity_Gym/scripts.inc` | **244** | Wattson intro rewritten: Electabuzz wandered into Power Plant, magnificent voltage, jovial wonder |
| `data/maps/LavaridgeTown_Gym_1F/scripts.inc` | **244** | Flannery intro rewritten: Pinsir on Route 112 breathe fire, grandpa legacy, eager passion |
| `data/maps/PetalburgCity_Gym/scripts.inc` | **245** | Norman intro rewritten: father-focused, no migration species. "The world changed while you were out there. But so did you." Shortest leader speech. |
| `data/maps/FortreeCity_Gym/scripts.inc` | **245** | Winona intro rewritten: dark bird from migration, "I took it under my wing." Honchkrow foreshadowing. |
| `data/maps/MossdeepCity_Gym/scripts.inc` | **245** | Tate & Liza: SURGICAL INSERT of cosmic foreshadowing before existing C214 Farigiraf dialogue. "We've been feeling something -- from very far away. It hasn't arrived yet." |
| `data/maps/SootopolisCity_Gym_1F/scripts.inc` | **245** | Juan intro rewritten: quietest leader, fewest words. "The tides carry new things since the Stirring." Understated certainty. |

## Late-Game Trainer Narrative Pass — Cycle 246

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/VictoryRoad_1F/scripts.inc` | **246** | Wally entrance pre-fight: Petalburg callback + "New POKéMON found me on the way here." Defeat: pride in growth. Post-entrance: migration Pokémon "showed me who I could be." Exit intro: post-Champion training. Exit defeat: "getting closer every time." PostBattle left unchanged. |

## Team Magma Quiet Reckoning — Cycle 248

Magma faction dialogue rewrite: admin defeat text cracks, Courtney Terra Cave full rewrite, postgame NPC.

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/TerraCave_End/scripts.inc` | **248** | Courtney intro/defeat/post-battle rewritten: sparse, measured dialogue. 1-second delay before speaking. trainerbattle_single→trainerbattle_no_intro with lockall/releaseall. "It doesn't matter, does it." |
| `data/maps/MtChimney/scripts.inc` | **248** | Tabitha defeat: "Hehehe… → Hehehe... heh." Forced, hollow. Postgame Magma grunt NPC added (FLAG_SYS_GAME_CLEAR gated via OnTransition + FLAG_HIDE_MT_CHIMNEY_POSTGAME_MAGMA_GRUNT 0x2C). "The land's the same size, but there's more of everything anyway." |
| `data/maps/MtChimney/map.json` | **248** | Added postgame Magma grunt object event at (16,38), FACE_DOWN, non-trainer. |
| `data/maps/MagmaHideout_4F/scripts.inc` | **248** | Tabitha defeat: "Taken down again…\nHehe…" → "Taken down again...\p............\pHehe." Extended pause, hollow laugh isolated. |
| `data/maps/MossdeepCity_SpaceCenter_2F/scripts.inc` | **248** | Tabitha defeat: "I'm with our leader…" → "I'm with our leader...\pAlways have been.\p...Right?" Self-doubt surfaces. |
| `include/constants/flags.h` | **248** | FLAG_HIDE_MT_CHIMNEY_POSTGAME_MAGMA_GRUNT at 0x2C (repurposed FLAG_UNUSED_0x02C). |

## Team Aqua Reckoning — Cycle 249

Aqua faction dialogue rewrite: Shelly analytical acceptance, Matt deflection through loyalty, postgame NPC.

| File | Cycle | Notes |
|------|-------|-------|
| `data/maps/SeafloorCavern_Room3/scripts.inc` | **249** | Shelly intro/defeat/post-battle rewritten: analytical, not aggressive. "After I've tested you." Post-battle plants core seed: "The ocean didn't need us for that." |
| `data/maps/AquaHideout_B2F/scripts.inc` | **249** | Matt defeat/post-submarine/post-battle rewritten: shorter than vanilla, every line references "the BOSS." "Hehehe" laugh removed. Personal loyalty, not ideology. |
| `data/maps/LilycoveCity/scripts.inc` | **249** | Postgame Aqua grunt NPC added (FLAG_SYS_GAME_CLEAR gated via OnTransition + FLAG_HIDE_LILYCOVE_POSTGAME_AQUA_GRUNT 0x2A6). "We were right… Weren't we? …Then why does it feel like the sea forgot we existed?" |
| `data/maps/LilycoveCity/map.json` | **249** | Added postgame Aqua grunt object event at (37,37) elev 5, FACE_DOWN, non-trainer. |
| `include/constants/flags.h` | **249** | FLAG_HIDE_LILYCOVE_POSTGAME_AQUA_GRUNT at 0x2A6. |

## Quest 7: The Answer (C242)

Deoxys_Hoenn encounter — Sky Pillar atmospheric buildup, Space Center trigger, 3-location aftermath.

| File | Cycle | Notes |
|------|-------|-------|
| `include/constants/flags.h` | **242** | FLAGS 0x2A3-0x2A5 (QUEST_COSMIC_STARTED/COMPLETE/APPEARED). |
| `data/maps/MossdeepCity_SpaceCenter_2F/scripts.inc` | **242**, **243** | Quest 7 branches added to Scientist NPC (CosmicOffer/Reminder/Done) and Terminal (CosmicPending/Active/Done). ~112 new lines of script + text. C243: CosmicReminder branches on FLAG_QUEST_COSMIC_APPEARED → CosmicReturnReminder (post-fight retry text). TerminalCosmicDone text refined: "Signal did not cease. Signal completed." |
| `data/maps/SkyPillar_Top/scripts.inc` | **242** | CosmicArrival coord_event handler: 6-beat atmospheric sequence (silence→shimmer→double flash→cry→shake→presence), retry path, caught/not-caught outcomes. ~138 new lines. |
| `data/maps/SkyPillar_Top/map.json` | **242** | Added coord_event at (14,9) with VAR_TEMP_1 guard for CosmicArrival script. |
| `data/maps/MeteorFalls_B1F_2R/scripts.inc` | **242**, **243** | CosmicAftermath branch. C243: Relief register — player touches cool stone, warmth "has gone somewhere." |
| `data/maps/Route131/scripts.inc` | **242**, **243** | CosmicAftermath branch. C243: Unease register — dead still water, something moved underneath, "I didn't look down." |
