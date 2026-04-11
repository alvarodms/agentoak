Route126_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, Route126_OnTransition
	.byte 0

Route126_OnTransition:
	call_if_set FLAG_SYS_WEATHER_CTRL, Common_EventScript_SetAbnormalWeather
	goto_if_set FLAG_GATHERING_FOG_SET, Route126_EventScript_CheckFogState
	end

Route126_EventScript_CheckFogState::
	goto_if_set FLAG_CAUGHT_RAYQUAZA_GUARDIAN, Route126_EventScript_SetThinFog
	goto_if_set FLAG_DEFEATED_RAYQUAZA_GUARDIAN, Route126_EventScript_SetThinFog
	setweather WEATHER_FOG_HORIZONTAL
	end

Route126_EventScript_SetThinFog::
	setweather WEATHER_FOG_DIAGONAL
	end

Route126_EventScript_Barry::
	trainerbattle_single TRAINER_BARRY, Route126_Text_BarryIntro, Route126_Text_BarryDefeat
	msgbox Route126_Text_BarryPostBattle, MSGBOX_AUTOCLOSE
	end

Route126_EventScript_Dean::
	trainerbattle_single TRAINER_DEAN, Route126_Text_DeanIntro, Route126_Text_DeanDefeat
	msgbox Route126_Text_DeanPostBattle, MSGBOX_AUTOCLOSE
	end

Route126_EventScript_Nikki::
	trainerbattle_single TRAINER_NIKKI, Route126_Text_NikkiIntro, Route126_Text_NikkiDefeat
	msgbox Route126_Text_NikkiPostBattle, MSGBOX_AUTOCLOSE
	end

Route126_EventScript_Brenda::
	trainerbattle_single TRAINER_BRENDA, Route126_Text_BrendaIntro, Route126_Text_BrendaDefeat
	msgbox Route126_Text_BrendaPostBattle, MSGBOX_AUTOCLOSE
	end

Route126_EventScript_Leonardo::
	trainerbattle_single TRAINER_LEONARDO, Route126_Text_LeonardoIntro, Route126_Text_LeonardoDefeat
	msgbox Route126_Text_LeonardoPostBattle, MSGBOX_AUTOCLOSE
	end

Route126_EventScript_Isobel::
	trainerbattle_single TRAINER_ISOBEL, Route126_Text_IsobelIntro, Route126_Text_IsobelDefeat
	msgbox Route126_Text_IsobelPostBattle, MSGBOX_AUTOCLOSE
	end

Route126_EventScript_Sienna::
	trainerbattle_single TRAINER_SIENNA, Route126_Text_SiennaIntro, Route126_Text_SiennaDefeat
	msgbox Route126_Text_SiennaPostBattle, MSGBOX_AUTOCLOSE
	end

Route126_EventScript_Pablo::
	trainerbattle_single TRAINER_PABLO_1, Route126_Text_PabloIntro, Route126_Text_PabloDefeat, Route126_EventScript_RegisterPablo
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route126_EventScript_RematchPablo
	msgbox Route126_Text_PabloPostBattle, MSGBOX_DEFAULT
	release
	end

Route126_EventScript_RegisterPablo::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route126_Text_PabloRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_PABLO_1
	release
	end

Route126_EventScript_RematchPablo::
	trainerbattle_rematch TRAINER_PABLO_1, Route126_Text_PabloRematchIntro, Route126_Text_PabloRematchDefeat
	msgbox Route126_Text_PabloPostRematch, MSGBOX_AUTOCLOSE
	end

@ C187 Ocean Atmosphere NPC — Warm Swimmer
@ C192: Upgraded to v1.8 Quest 4 giver
@ C205: Post-Rayquaza resolution ("The Exhale")
Route126_EventScript_WarmSwimmer::
	goto_if_set FLAG_CAUGHT_RAYQUAZA_GUARDIAN, Route126_EventScript_WarmSwimmerResolved
	goto_if_set FLAG_DEFEATED_RAYQUAZA_GUARDIAN, Route126_EventScript_WarmSwimmerResolved
	goto_if_set FLAG_QUEST_FOG_COMPLETE, Route126_EventScript_SwimmerQuestDone
	goto_if_set FLAG_QUEST_FOG_INVESTIGATED, Route126_EventScript_SwimmerQuestReturn
	goto_if_set FLAG_QUEST_FOG_STARTED, Route126_EventScript_SwimmerQuestReminder
	goto_if_set FLAG_GATHERING_EVENT, Route126_EventScript_SwimmerQuestOffer
	msgbox Route126_Text_WarmSwimmer, MSGBOX_NPC
	end

Route126_EventScript_WarmSwimmerResolved::
	lock
	faceplayer
	msgbox Route126_Text_WarmSwimmerResolved, MSGBOX_DEFAULT
	release
	end

Route126_Text_WarmSwimmer:
	.string "Feel that? The current's pulling\n"
	.string "south. It never does that.\p"
	.string "And the water's warm. Not sun-warm.\n"
	.string "Warm from below.$"

@ =============================================
@ v1.8 Quest 4: The Fog Beneath (C192)
@ =============================================

Route126_EventScript_SwimmerQuestOffer::
	lock
	faceplayer
	msgbox Route126_Text_SwimmerQuestOffer, MSGBOX_DEFAULT
	setflag FLAG_QUEST_FOG_STARTED
	release
	end

Route126_EventScript_SwimmerQuestReminder::
	lock
	faceplayer
	msgbox Route126_Text_SwimmerQuestReminder, MSGBOX_DEFAULT
	release
	end

Route126_EventScript_SwimmerQuestReturn::
	lock
	faceplayer
	msgbox Route126_Text_SwimmerQuestReturn, MSGBOX_DEFAULT
	setflag FLAG_QUEST_FOG_COMPLETE
	release
	end

Route126_EventScript_SwimmerQuestDone::
	lock
	faceplayer
	msgbox Route126_Text_SwimmerQuestDone, MSGBOX_DEFAULT
	release
	end

Route126_Text_SwimmerQuestOffer:
	.string "Champion… you're here.\n"
	.string "Good. I didn't want to go\l"
	.string "back alone.\p"
	.string "I've been diving these waters\n"
	.string "for years. I know every rock,\l"
	.string "every current. But after\l"
	.string "the Gathering…\p"
	.string "There's an opening now.\n"
	.string "In the seabed. It wasn't\l"
	.string "there before. I KNOW it\l"
	.string "wasn't.\p"
	.string "I went down to look and…\n"
	.string "something moved. Something\l"
	.string "big. I surfaced fast.\p"
	.string "That researcher in MOSSDEEP\n"
	.string "says the sky changed too.\l"
	.string "Above and below -- like HOENN\l"
	.string "itself cracked open.\p"
	.string "Will you dive down there?\n"
	.string "The opening is just south.\l"
	.string "Under the fog.$"

Route126_Text_SwimmerQuestReminder:
	.string "The dive spot is south of\n"
	.string "here. Under the fog.\p"
	.string "Just… be careful down there.\n"
	.string "Something is living in that\l"
	.string "opening now.$"

Route126_Text_SwimmerQuestReturn:
	.string "A LAPRAS...? Down there?\p"
	.string "They say LAPRAS follow warm\n"
	.string "currents across the ocean.\l"
	.string "The Gathering must have\l"
	.string "drawn one to HOENN.\p"
	.string "The fog makes sense now.\n"
	.string "It's not hiding something\l"
	.string "dangerous. It's protecting\l"
	.string "something gentle.$"

Route126_Text_SwimmerQuestDone:
	.string "The fog's thinned a little\n"
	.string "since you found the LAPRAS.\p"
	.string "Like the ocean is breathing\n"
	.string "easier now that someone knows\l"
	.string "what it was sheltering.$"

@ =============================================
@ The Gathering Event -- "The Gathering" (C189)
@ The migration converges near Sootopolis.
@ Triggers once post-Badge 7 via coord_events.
@ No encounter -- the player can only witness.
@ =============================================

Route126_EventScript_TheGathering::
	goto_if_set FLAG_GATHERING_EVENT, Route126_EventScript_TheGathering_End
	goto_if_unset FLAG_BADGE07_GET, Route126_EventScript_TheGathering_End
	lockall
	@ Beat 1: The water feels wrong
	delay 15
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	@ Beat 2: Fog rolls in
	setweather WEATHER_FOG_HORIZONTAL
	doweather
	delay 40
	@ Beat 3: First cry -- deep, distant (Wailord)
	waitse
	playmoncry SPECIES_WAILORD, CRY_MODE_NORMAL
	delay 20
	waitmoncry
	@ Beat 4: Gentle shake -- not C188's violence, just a tremor
	LegendMacro_ScreenShake 0, 1, 2, 4
	delay 20
	@ Beat 5: Second cry -- sharp, closer (Sharpedo)
	waitse
	playmoncry SPECIES_SHARPEDO, CRY_MODE_NORMAL
	delay 15
	waitmoncry
	@ Beat 6: Third cry -- eerie, trailing (Tentacruel)
	waitse
	playmoncry SPECIES_TENTACRUEL, CRY_MODE_NORMAL
	delay 20
	waitmoncry
	@ Beat 7: The player sees -- a single text box
	msgbox Route126_Text_TheGathering, MSGBOX_DEFAULT
	@ Beat 8: Silence. The fog stays.
	delay 30
	@ Mark event complete, mark fog permanent
	setflag FLAG_GATHERING_EVENT
	setflag FLAG_GATHERING_FOG_SET
	releaseall
	end

Route126_EventScript_TheGathering_End::
	end

@ =============================================
@ The Gathering Event Text
@ =============================================

Route126_Text_TheGathering:
	.string "The sea churns with movement.\p"
	.string "Shapes of every size stream past\n"
	.string "beneath the fog, all heading the\l"
	.string "same direction.\p"
	.string "Toward SOOTOPOLIS.\n"
	.string "Toward something unseen.$"

@ =============================================
@ v1.8 Quest 4: The Fog Beneath - Dive Spot (C200)
@ =============================================

Route126_EventScript_DiveSpotTrigger::
	lock
	goto_if_set FLAG_QUEST_FOG_INVESTIGATED, Route126_EventScript_DiveSpotDone
	goto_if_set FLAG_QUEST_FOG_STARTED, Route126_EventScript_DiveSequence
	release
	end

Route126_EventScript_DiveSpotDone::
	setvar VAR_TEMP_1, 1
	release
	end

Route126_EventScript_DiveSequence::
	playbgm MUS_ABNORMAL_WEATHER, TRUE
	msgbox Route126_Text_Dive_Beat1, MSGBOX_DEFAULT
	msgbox Route126_Text_Dive_Beat2, MSGBOX_DEFAULT
	waitse
	playmoncry SPECIES_LAPRAS, CRY_MODE_NORMAL
	waitmoncry
	delay 20
	msgbox Route126_Text_Dive_Beat3, MSGBOX_DEFAULT
	fadedefaultbgm
	setflag FLAG_QUEST_FOG_INVESTIGATED
	setwildbattle SPECIES_LAPRAS, 50, ITEM_SHELL_BELL
	dowildbattle
	waitstate
	setvar VAR_TEMP_1, 1
	release
	end

Route126_Text_Dive_Beat1:
	.string "The fog closes in. The water\n"
	.string "here is warm -- not sun-warm.\l"
	.string "Heat rising from somewhere\l"
	.string "deep beneath the surface.$"

Route126_Text_Dive_Beat2:
	.string "Through the mist, a shadow\n"
	.string "moves below. Massive, but\l"
	.string "slow. Unhurried.\p"
	.string "A low cry rises from the\n"
	.string "depths -- resonant, ancient,\l"
	.string "and strangely gentle.\p"
	.string "Whatever found its way here\n"
	.string "through the warm current...\l"
	.string "it isn't afraid of you.$"

Route126_Text_Dive_Beat3:
	.string "The water parts. A long neck\n"
	.string "breaks the surface, and two\l"
	.string "dark eyes meet yours through\l"
	.string "the mist.\p"
	.string "The migration brought many\n"
	.string "things to HOENN. This one\l"
	.string "chose to stay.$"

@ =============================================
@ C205: "The Exhale" — Post-Rayquaza Resolution
@ =============================================

Route126_Text_WarmSwimmerResolved:
	.string "The current settled overnight.\n"
	.string "Just stopped pulling south.\p"
	.string "Water's cooling back to normal,\n"
	.string "too. Ocean-cold, not deep-warm.\p"
	.string "Whatever was gathering here...\n"
	.string "I think it's over.$"

