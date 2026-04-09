Route126_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, Route126_OnTransition
	.byte 0

Route126_OnTransition:
	call_if_set FLAG_SYS_WEATHER_CTRL, Common_EventScript_SetAbnormalWeather
	goto_if_set FLAG_GATHERING_FOG_SET, Route126_EventScript_SetGatheringFog
	end

Route126_EventScript_SetGatheringFog::
	setweather WEATHER_FOG_HORIZONTAL
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
Route126_EventScript_WarmSwimmer::
	goto_if_set FLAG_GATHERING_EVENT, Route126_EventScript_WarmSwimmerPost
	msgbox Route126_Text_WarmSwimmer, MSGBOX_NPC
	end

Route126_EventScript_WarmSwimmerPost::
	msgbox Route126_Text_WarmSwimmerPost, MSGBOX_NPC
	end

Route126_Text_WarmSwimmer:
	.string "Feel that? The current's pulling\n"
	.string "south. It never does that.\p"
	.string "And the water's warm. Not sun-warm.\n"
	.string "Warm from below.$"

Route126_Text_WarmSwimmerPost:
	.string "They're all heading the same\n"
	.string "direction. Everything.\p"
	.string "The TENTACOOL, the WAILMER, even\n"
	.string "the SHARPEDO.\p"
	.string "Something's pulling them toward\n"
	.string "SOOTOPOLIS.$"

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

