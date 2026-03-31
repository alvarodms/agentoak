TerraCave_End_MapScripts::
	map_script MAP_SCRIPT_ON_RESUME, TerraCave_End_OnResume
	map_script MAP_SCRIPT_ON_TRANSITION, TerraCave_End_OnTransition
	.byte 0

TerraCave_End_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, TerraCave_End_EventScript_TryRemoveGroudon
	end

TerraCave_End_EventScript_TryRemoveGroudon::
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_ne VAR_RESULT, B_OUTCOME_CAUGHT, Common_EventScript_NopReturn
	removeobject LOCALID_TERRA_CAVE_GROUDON
	return

TerraCave_End_OnTransition:
	call_if_unset FLAG_DEFEATED_GROUDON, TerraCave_End_EventScript_ShowGroudon
	call_if_set FLAG_DEFEATED_GROUDON, TerraCave_End_EventScript_TryShowPrimalGroudon
	end

TerraCave_End_EventScript_ShowGroudon::
	clearflag FLAG_HIDE_TERRA_CAVE_GROUDON
	setvar VAR_TEMP_1, 1
	return

TerraCave_End_EventScript_TryShowPrimalGroudon::
	goto_if_set FLAG_CAUGHT_PRIMAL_GROUDON, Common_EventScript_NopReturn
	goto_if_set FLAG_DEFEATED_PRIMAL_GROUDON, Common_EventScript_NopReturn
	goto_if_unset FLAG_ALL_SIGNS_REPORTED, Common_EventScript_NopReturn
	goto_if_unset FLAG_TERRA_CAVE_INVESTIGATED, Common_EventScript_NopReturn
	clearflag FLAG_HIDE_TERRA_CAVE_GROUDON
	setvar VAR_TEMP_1, 2
	return

TerraCave_End_EventScript_Groudon::
	lockall
	applymovement LOCALID_PLAYER, Common_Movement_FaceUp
	waitmovement 0
	applymovement LOCALID_TERRA_CAVE_GROUDON, TerraCave_End_Movement_GroudonApproach
	waitmovement 0
	waitse
	playmoncry SPECIES_GROUDON, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	setvar VAR_LAST_TALKED, LOCALID_TERRA_CAVE_GROUDON
	setwildbattle SPECIES_GROUDON, 70
	setflag FLAG_SYS_CTRL_OBJ_DELETE
	special BattleSetup_StartLegendaryBattle
	waitstate
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
	setvar VAR_TEMP_1, 0
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, TerraCave_End_EventScript_DefeatedGroudon
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, TerraCave_End_EventScript_RanFromGroudon
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, TerraCave_End_EventScript_RanFromGroudon
	setvar VAR_SHOULD_END_ABNORMAL_WEATHER, 1
	setflag FLAG_DEFEATED_GROUDON
	releaseall
	end

TerraCave_End_EventScript_DefeatedGroudon::
	setvar VAR_SHOULD_END_ABNORMAL_WEATHER, 1
	setflag FLAG_DEFEATED_GROUDON
	goto Common_EventScript_RemoveStaticPokemon
	end

TerraCave_End_EventScript_RanFromGroudon::
	setvar VAR_0x8004, SPECIES_GROUDON
	goto Common_EventScript_LegendaryFlewAway
	end

@ === Devon Corporation Researcher (Primal Stirring investigation) ===

TerraCave_End_EventScript_DevonResearcher::
	lock
	faceplayer
	goto_if_set FLAG_TERRA_CAVE_INVESTIGATED, TerraCave_End_EventScript_DevonResearcherShort
	msgbox TerraCave_End_Text_DevonResearcherFull, MSGBOX_DEFAULT
	setflag FLAG_TERRA_CAVE_INVESTIGATED
	release
	end

TerraCave_End_EventScript_DevonResearcherShort::
	msgbox TerraCave_End_Text_DevonResearcherShort, MSGBOX_DEFAULT
	release
	end

TerraCave_End_Text_DevonResearcherFull:
	.string "The seismic readings in here are\n"
	.string "unlike anything on record!\p"
	.string "The energy signature matches\n"
	.string "GROUDON's ancient profile...\p"
	.string "Whatever's stirring down here,\n"
	.string "it's been dormant for millennia.\p"
	.string "PROF. BIRCH needs to know\n"
	.string "about this immediately!$"

TerraCave_End_Text_DevonResearcherShort:
	.string "My instruments are still going\n"
	.string "haywire. Be careful down here.$"

TerraCave_End_Movement_GroudonApproach:
	init_affine_anim
	walk_down_start_affine
	delay_16
	delay_16
	walk_down_affine
	delay_16
	delay_16
	walk_down_affine
	step_end

@ === Primal Groudon Encounter (v6.0 Primal Awakening) ===

TerraCave_End_EventScript_PrimalGroudon::
	lockall
	setvar VAR_TEMP_1, 0
	applymovement LOCALID_PLAYER, Common_Movement_FaceUp
	waitmovement 0
	setweather WEATHER_SUNNY
	doweather
	playse SE_M_EARTHQUAKE
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 2
	setvar VAR_0x8006, 8
	setvar VAR_0x8007, 3
	special ShakeCamera
	waitstate
	delay 20
	msgbox TerraCave_End_Text_PrimalGroudonAwakens, MSGBOX_DEFAULT
	applymovement LOCALID_TERRA_CAVE_GROUDON, TerraCave_End_Movement_GroudonApproach
	waitmovement 0
	waitse
	playmoncry SPECIES_GROUDON, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	setvar VAR_LAST_TALKED, LOCALID_TERRA_CAVE_GROUDON
	setwildbattle SPECIES_GROUDON, 70
	setflag FLAG_SYS_CTRL_OBJ_DELETE
	special BattleSetup_StartLegendaryBattle
	waitstate
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, TerraCave_End_EventScript_PrimalGroudonDefeated
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, TerraCave_End_EventScript_PrimalGroudonFled
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, TerraCave_End_EventScript_PrimalGroudonFled
	@ Caught
	setflag FLAG_CAUGHT_PRIMAL_GROUDON
	setweather WEATHER_NONE
	doweather
	msgbox TerraCave_End_Text_GroudonCaught, MSGBOX_DEFAULT
	releaseall
	end

TerraCave_End_EventScript_PrimalGroudonDefeated::
	setflag FLAG_DEFEATED_PRIMAL_GROUDON
	setflag FLAG_HIDE_TERRA_CAVE_GROUDON
	setweather WEATHER_NONE
	doweather
	msgbox TerraCave_End_Text_GroudonFled, MSGBOX_DEFAULT
	releaseall
	end

TerraCave_End_EventScript_PrimalGroudonFled::
	setflag FLAG_DEFEATED_PRIMAL_GROUDON
	setflag FLAG_HIDE_TERRA_CAVE_GROUDON
	setweather WEATHER_NONE
	doweather
	msgbox TerraCave_End_Text_GroudonFled, MSGBOX_DEFAULT
	releaseall
	end

TerraCave_End_Text_PrimalGroudonAwakens:
	.string "The cavern shakes with terrible force!\n"
	.string "Waves of heat roll off the earth\l"
	.string "as something ancient stirs below...$"

TerraCave_End_Text_GroudonCaught:
	.string "The ground beneath your feet grows still.\n"
	.string "The searing heat begins to fade.\p"
	.string "The continent POKéMON rests within\n"
	.string "your POKé BALL, its primal fury\l"
	.string "finally contained.$"

TerraCave_End_Text_GroudonFled:
	.string "The tremors subside slowly.\n"
	.string "The ancient presence retreats\l"
	.string "into the earth...\p"
	.string "But the ground still shudders\n"
	.string "with restless fury.$"

@ === Team Magma Remnant Trainers (C123) ===

TerraCave_End_EventScript_MagmaGrunt2::
	trainerbattle_single TRAINER_MAGMA_GRUNT_TERRA_CAVE_2, TerraCave_End_Text_MagmaGrunt2Intro, TerraCave_End_Text_MagmaGrunt2Defeat
	msgbox TerraCave_End_Text_MagmaGrunt2Post, MSGBOX_AUTOCLOSE
	end

TerraCave_End_Text_MagmaGrunt2Intro:
	.string "The earth is shaking more than\n"
	.string "ever! GROUDON must be close!\p"
	.string "I won't let you ruin TEAM MAGMA's\n"
	.string "legacy!$"

TerraCave_End_Text_MagmaGrunt2Defeat:
	.string "No way... I trained so hard...$"

TerraCave_End_Text_MagmaGrunt2Post:
	.string "Even if you beat me, GROUDON's\n"
	.string "power can't be stopped. The land\l"
	.string "will expand as MAXIE envisioned.$"

TerraCave_End_EventScript_MagmaAdmin::
	trainerbattle_single TRAINER_MAGMA_ADMIN_TERRA_CAVE, TerraCave_End_Text_MagmaAdminIntro, TerraCave_End_Text_MagmaAdminDefeat
	msgbox TerraCave_End_Text_MagmaAdminPost, MSGBOX_AUTOCLOSE
	end

TerraCave_End_Text_MagmaAdminIntro:
	.string "I am COURTNEY, Admin of TEAM MAGMA.\p"
	.string "GROUDON stirs again because the\n"
	.string "land demands it. The migration\l"
	.string "has awakened the continent's fury.\p"
	.string "Stand aside, child.$"

TerraCave_End_Text_MagmaAdminDefeat:
	.string "Impressive... but it changes\n"
	.string "nothing.$"

TerraCave_End_Text_MagmaAdminPost:
	.string "GROUDON chose to awaken. Neither\n"
	.string "you nor I can change that.\p"
	.string "The only question is whether you\n"
	.string "have the strength to face it.$"
