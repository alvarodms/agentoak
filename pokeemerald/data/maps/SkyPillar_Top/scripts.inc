SkyPillar_Top_MapScripts::
	map_script MAP_SCRIPT_ON_RESUME, SkyPillar_Top_OnResume
	map_script MAP_SCRIPT_ON_TRANSITION, SkyPillar_Top_OnTransition
	map_script MAP_SCRIPT_ON_WARP_INTO_MAP_TABLE, SkyPillar_Top_OnWarp
	.byte 0

SkyPillar_Top_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, SkyPillar_Top_EventScript_TryRemoveRayquaza
	end

SkyPillar_Top_EventScript_TryRemoveRayquaza::
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_ne VAR_RESULT, B_OUTCOME_CAUGHT, Common_EventScript_NopReturn
	removeobject VAR_LAST_TALKED
	return

SkyPillar_Top_OnTransition:
	call_if_lt VAR_SKY_PILLAR_STATE, 2, SkyPillar_Top_EventScript_SetCleanLayout
	call_if_ge VAR_SKY_PILLAR_STATE, 2, SkyPillar_Top_EventScript_TryShowRayquaza
	end

SkyPillar_Top_EventScript_SetCleanLayout::
	setmaplayoutindex LAYOUT_SKY_PILLAR_TOP_CLEAN
	setobjectmovementtype LOCALID_RAYQUAZA_SLEEPING, MOVEMENT_TYPE_FACE_DOWN
	return

SkyPillar_Top_EventScript_TryShowRayquaza::
	call_if_unset FLAG_DEFEATED_RAYQUAZA, SkyPillar_Top_EventScript_ShowRayquaza
	return

SkyPillar_Top_EventScript_ShowRayquaza::
	clearflag FLAG_HIDE_SKY_PILLAR_TOP_RAYQUAZA_STILL
	return

SkyPillar_Top_OnWarp:
	map_script_2 VAR_SKY_PILLAR_STATE, 0, SkyPillar_Top_EventScript_RayquazaFaceDown
	.2byte 0

SkyPillar_Top_EventScript_RayquazaFaceDown::
	turnobject LOCALID_RAYQUAZA_SLEEPING, DIR_SOUTH
	end

SkyPillar_Top_EventScript_Rayquaza::
	lockall
	applymovement LOCALID_PLAYER, Common_Movement_FaceUp
	waitmovement 0
	@ Storm builds around the summit
	setweather WEATHER_RAIN_THUNDERSTORM
	doweather
	delay 60
	msgbox SkyPillar_Top_Text_StormBuilds, MSGBOX_DEFAULT
	@ Camera shake - the tower trembles
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 2
	setvar VAR_0x8006, 8
	setvar VAR_0x8007, 3
	special ShakeCamera
	waitstate
	delay 20
	@ Rayquaza's cry pierces the storm
	waitse
	playmoncry SPECIES_RAYQUAZA, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	@ Air Lock activates - the sky clears
	setweather WEATHER_NONE
	doweather
	delay 40
	msgbox SkyPillar_Top_Text_SkyClearance, MSGBOX_DEFAULT
	closemessage
	delay 20
	@ Battle
	setwildbattle SPECIES_RAYQUAZA, 70
	setflag FLAG_SYS_CTRL_OBJ_DELETE
	special BattleSetup_StartLegendaryBattle
	waitstate
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, SkyPillar_Top_EventScript_EnhancedDefeatedRayquaza
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, SkyPillar_Top_EventScript_EnhancedRanFromRayquaza
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, SkyPillar_Top_EventScript_EnhancedRanFromRayquaza
	@ Caught - the trilogy concludes
	setflag FLAG_CAUGHT_RAYQUAZA_GUARDIAN
	setflag FLAG_DEFEATED_RAYQUAZA
	msgbox SkyPillar_Top_Text_RayquazaCaught, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_Top_EventScript_EnhancedDefeatedRayquaza::
	setflag FLAG_DEFEATED_RAYQUAZA_GUARDIAN
	setflag FLAG_DEFEATED_RAYQUAZA
	fadescreenswapbuffers FADE_TO_BLACK
	removeobject VAR_LAST_TALKED
	fadescreenswapbuffers FADE_FROM_BLACK
	msgbox SkyPillar_Top_Text_RayquazaFled, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_Top_EventScript_EnhancedRanFromRayquaza::
	setflag FLAG_DEFEATED_RAYQUAZA_GUARDIAN
	setflag FLAG_DEFEATED_RAYQUAZA
	fadescreenswapbuffers FADE_TO_BLACK
	removeobject VAR_LAST_TALKED
	fadescreenswapbuffers FADE_FROM_BLACK
	msgbox SkyPillar_Top_Text_RayquazaFled, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_Top_EventScript_AwakenRayquaza::
	lockall
	fadeoutbgm 1
	applymovement LOCALID_PLAYER, Common_Movement_FaceUp
	waitmovement 0
	special SpawnCameraObject
	applymovement LOCALID_CAMERA, SkyPillar_Top_Movement_CameraPanUp
	waitmovement 0
	special RemoveCameraObject
	applymovement LOCALID_RAYQUAZA_SLEEPING, SkyPillar_Top_Movement_RayquazaStir
	waitmovement 0
	waitse
	playmoncry SPECIES_RAYQUAZA, CRY_MODE_ENCOUNTER
	setvar VAR_0x8004, 1  @ vertical pan
	setvar VAR_0x8005, 1  @ horizontal pan
	setvar VAR_0x8006, 8  @ num shakes
	setvar VAR_0x8007, 3  @ shake delay
	special ShakeCamera
	waitstate
	waitse
	playmoncry SPECIES_RAYQUAZA, CRY_MODE_ENCOUNTER
	setvar VAR_0x8004, 1  @ vertical pan
	setvar VAR_0x8005, 2  @ horizontal pan
	setvar VAR_0x8006, 8  @ num shakes
	setvar VAR_0x8007, 5  @ shake delay
	special ShakeCamera
	waitstate
	waitmoncry
	applymovement LOCALID_RAYQUAZA_SLEEPING, SkyPillar_Top_Movement_RayquazaFlyOff
	waitmovement 0
	removeobject LOCALID_RAYQUAZA_SLEEPING
	msgbox SkyPillar_Top_Text_RayquazaFlewOff, MSGBOX_DEFAULT
	closemessage
	delay 20
	fadeinbgm 1
	special SpawnCameraObject
	applymovement LOCALID_CAMERA, SkyPillar_Top_Movement_CameraPanDown
	waitmovement 0
	special RemoveCameraObject
	setvar VAR_SOOTOPOLIS_CITY_STATE, 5
	setvar VAR_SKY_PILLAR_STATE, 1
	setvar VAR_SKY_PILLAR_RAYQUAZA_CRY_DONE, 1
	releaseall
	end

@ Rayquaza has unusual movement frames
@ See comments, or sAnimTable_Rayquaza
SkyPillar_Top_Movement_RayquazaStir:
	delay_16
	walk_in_place_fast_left  @ Coiled, awake
	delay_16
	delay_16
	delay_16
	delay_16
	delay_16
	walk_in_place_left  @ Coiled, mouth open
	delay_16
	walk_in_place_right  @ Normal, awake
	delay_16
	delay_16
	delay_16
	delay_16
	delay_16
	delay_16
	step_end

SkyPillar_Top_Movement_RayquazaFlyOff:
	delay_16
	walk_in_place_down  @ Coiled, asleep
	delay_8
	walk_in_place_right  @ Normal, awake
	delay_8
	walk_faster_up  @ Fly up
	slide_up
	slide_up
	slide_up
	slide_up
	slide_up
	slide_up
	step_end

SkyPillar_Top_Movement_CameraPanUp:
	walk_slow_up
	walk_slow_up
	walk_slow_up
	step_end

SkyPillar_Top_Movement_CameraPanDown:
	walk_slow_down
	walk_slow_down
	walk_slow_down
	step_end

SkyPillar_Top_Text_RayquazaFlewOff:
	.string "The awakened RAYQUAZA flew off...$"

@ =============================================
@ v7.0 Sky Guardian Act 3 -- Enhanced Encounter
@ =============================================

SkyPillar_Top_Text_StormBuilds:
	.string "The summit trembles beneath your\n"
	.string "feet! Storm clouds churn around\l"
	.string "the tower as the ancient guardian\l"
	.string "stirs...\p"
	.string "Rain lashes the broken stones.\n"
	.string "A terrible pressure fills the air!$"

SkyPillar_Top_Text_SkyClearance:
	.string "Suddenly, the storm breaks.\p"
	.string "The sky opens to brilliant light\n"
	.string "as RAYQUAZA's presence calms the\l"
	.string "raging elements.\p"
	.string "The Sky Guardian awaits.$"

SkyPillar_Top_Text_RayquazaCaught:
	.string "The sky above HOENN glows with\n"
	.string "a radiant calm.\p"
	.string "The guardian of the sky rests\n"
	.string "within your POKe BALL.\p"
	.string "Earth, sea, and sky...\n"
	.string "The ancient balance is restored.$"

SkyPillar_Top_Text_RayquazaFled:
	.string "RAYQUAZA's cry echoes across\n"
	.string "the sky as it soars beyond\l"
	.string "the clouds.\p"
	.string "The ancient guardian retreats\n"
	.string "to the heavens... for now.$"

@ =============================================
@ Quest 7: The Answer -- Cosmic Form Encounter (C242)
@ =============================================

SkyPillar_Top_EventScript_CosmicArrival::
	@ Guards -- exit silently if conditions not met
	goto_if_set FLAG_QUEST_COSMIC_COMPLETE, SkyPillar_Top_EventScript_CosmicEnd
	goto_if_unset FLAG_QUEST_COSMIC_STARTED, SkyPillar_Top_EventScript_CosmicEnd
	goto_if_unset FLAG_DEFEATED_RAYQUAZA, SkyPillar_Top_EventScript_CosmicEnd
	@ Past all guards -- this IS the encounter
	lockall
	setvar VAR_TEMP_1, 1
	goto_if_set FLAG_QUEST_COSMIC_APPEARED, SkyPillar_Top_EventScript_CosmicRetry
	@ --- Full dramatic sequence (first encounter) ---
	applymovement LOCALID_PLAYER, Common_Movement_FaceUp
	waitmovement 0
	@ Silence -- remove music, let the wrongness build
	fadeoutbgm 1
	delay 60
	msgbox SkyPillar_Top_Text_CosmicSilence, MSGBOX_DEFAULT
	delay 30
	@ The impossible color
	msgbox SkyPillar_Top_Text_CosmicShimmer, MSGBOX_DEFAULT
	@ Cosmic flash -- extended double pulse (longer than Residue)
	fadescreen FADE_TO_WHITE
	delay 8
	fadescreen FADE_FROM_WHITE
	delay 20
	fadescreen FADE_TO_WHITE
	delay 4
	fadescreen FADE_FROM_WHITE
	@ Alien cry echoes across the summit
	waitse
	playmoncry SPECIES_DEOXYS_HOENN, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	@ The summit trembles
	LegendMacro_ScreenShake 2, 2, 8, 3
	@ The presence reveals itself
	msgbox SkyPillar_Top_Text_CosmicPresence, MSGBOX_DEFAULT
	setflag FLAG_QUEST_COSMIC_APPEARED
	@ Battle -- Level 70 Deoxys_Hoenn, no held item
	setwildbattle SPECIES_DEOXYS_HOENN, 70
	special BattleSetup_StartLegendaryBattle
	waitstate
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_CAUGHT, SkyPillar_Top_EventScript_CosmicCaught
	goto SkyPillar_Top_EventScript_CosmicNotCaught

SkyPillar_Top_EventScript_CosmicRetry::
	@ Shorter retry -- atmosphere without the full buildup
	applymovement LOCALID_PLAYER, Common_Movement_FaceUp
	waitmovement 0
	fadeoutbgm 1
	delay 30
	msgbox SkyPillar_Top_Text_CosmicRetryShimmer, MSGBOX_DEFAULT
	fadescreen FADE_TO_WHITE
	delay 4
	fadescreen FADE_FROM_WHITE
	waitse
	playmoncry SPECIES_DEOXYS_HOENN, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	LegendMacro_ScreenShake 1, 1, 4, 3
	msgbox SkyPillar_Top_Text_CosmicRetryPresence, MSGBOX_DEFAULT
	setwildbattle SPECIES_DEOXYS_HOENN, 70
	special BattleSetup_StartLegendaryBattle
	waitstate
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_CAUGHT, SkyPillar_Top_EventScript_CosmicCaught
	goto SkyPillar_Top_EventScript_CosmicNotCaught

SkyPillar_Top_EventScript_CosmicCaught::
	fadeinbgm 1
	setflag FLAG_QUEST_COSMIC_COMPLETE
	msgbox SkyPillar_Top_Text_CosmicCaught, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_Top_EventScript_CosmicNotCaught::
	fadeinbgm 1
	msgbox SkyPillar_Top_Text_CosmicFaded, MSGBOX_DEFAULT
	releaseall
	end

SkyPillar_Top_EventScript_CosmicEnd::
	end

@ --- Quest 7 text strings ---

SkyPillar_Top_Text_CosmicSilence:
	.string "The summit is silent.\p"
	.string "No wind. No cries.\n"
	.string "Even the clouds have stilled.\p"
	.string "Something is wrong with\n"
	.string "the quiet.$"

SkyPillar_Top_Text_CosmicShimmer:
	.string "The air shimmers with an\n"
	.string "impossible color--\l"
	.string "pink and violet, sweet\l"
	.string "and wrong.\p"
	.string "It wasn't here a moment ago.\n"
	.string "Or perhaps it always was.$"

SkyPillar_Top_Text_CosmicPresence:
	.string "Something is here.\p"
	.string "Not arriving.\n"
	.string "Already present. Waiting.\p"
	.string "The answer to the handshake\n"
	.string "has come to HOENN.$"

SkyPillar_Top_Text_CosmicRetryShimmer:
	.string "The impossible color returns.\n"
	.string "Pink and violet, sweet and\l"
	.string "wrong.\p"
	.string "It has been waiting.$"

SkyPillar_Top_Text_CosmicRetryPresence:
	.string "The presence stirs again.\p"
	.string "The answer has not left.$"

SkyPillar_Top_Text_CosmicCaught:
	.string "The color drains from the air.\p"
	.string "The summit breathes again.\n"
	.string "Wind returns. Clouds move.\p"
	.string "Whatever crossed over from\n"
	.string "beyond HOENN's sky is yours\l"
	.string "now.\p"
	.string "The handshake is complete.$"

SkyPillar_Top_Text_CosmicFaded:
	.string "The shimmer fades but doesn't\n"
	.string "vanish.\p"
	.string "The presence withdrew.\n"
	.string "But the color lingers.\p"
	.string "It hasn't left.$"

