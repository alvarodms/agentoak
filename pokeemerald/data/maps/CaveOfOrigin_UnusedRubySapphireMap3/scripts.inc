CaveOfOrigin_UnusedRubySapphireMap3_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, CaveOfOrigin_Depths_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, CaveOfOrigin_Depths_OnResume
	.byte 0

CaveOfOrigin_Depths_OnTransition:
	@ Gate: warp player out if climax not triggered
	goto_if_unset FLAG_LEGENDS_AWAKENED, CaveOfOrigin_Depths_EventScript_WarpOut
	call_if_set FLAG_CAUGHT_HO_OH, CaveOfOrigin_Depths_EventScript_HideHoOh
	call_if_unset FLAG_CAUGHT_HO_OH, CaveOfOrigin_Depths_EventScript_TryShowHoOh
	end

CaveOfOrigin_Depths_EventScript_WarpOut:
	setwarp MAP_CAVE_OF_ORIGIN_UNUSED_RUBY_SAPPHIRE_MAP2, 8, 14
	end

CaveOfOrigin_Depths_EventScript_HideHoOh:
	setvar VAR_TEMP_1, 1
	setflag FLAG_HIDE_HO_OH
	return

CaveOfOrigin_Depths_EventScript_TryShowHoOh:
	setvar VAR_TEMP_1, 1
	goto_if_set FLAG_DEFEATED_HO_OH, Common_EventScript_NopReturn
	setvar VAR_TEMP_1, 0
	clearflag FLAG_HIDE_HO_OH
	return

CaveOfOrigin_Depths_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, CaveOfOrigin_Depths_EventScript_TryRemoveHoOh
	end

CaveOfOrigin_Depths_EventScript_TryRemoveHoOh::
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_ne VAR_RESULT, B_OUTCOME_CAUGHT, Common_EventScript_NopReturn
	removeobject 1
	return

CaveOfOrigin_Depths_EventScript_HoOh::
	lockall
	setvar VAR_TEMP_1, 1
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 2
	setvar VAR_0x8006, 8
	setvar VAR_0x8007, 3
	special ShakeCamera
	waitstate
	playse SE_M_EXPLOSION
	waitse
	delay 30
	fadescreen FADE_TO_WHITE
	delay 40
	playmoncry SPECIES_HO_OH, CRY_MODE_ENCOUNTER
	waitmoncry
	delay 20
	clearflag FLAG_HIDE_HO_OH
	fadescreen FADE_FROM_WHITE
	delay 30
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	delay 40
	seteventmon SPECIES_HO_OH, 70
	setflag FLAG_SYS_CTRL_OBJ_DELETE
	special BattleSetup_StartLegendaryBattle
	waitstate
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
	setvar VAR_LAST_TALKED, 1
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, CaveOfOrigin_Depths_EventScript_DefeatedHoOh
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, CaveOfOrigin_Depths_EventScript_RanFromHoOh
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, CaveOfOrigin_Depths_EventScript_RanFromHoOh
	setflag FLAG_CAUGHT_HO_OH
	releaseall
	end

CaveOfOrigin_Depths_EventScript_DefeatedHoOh::
	setflag FLAG_DEFEATED_HO_OH
	setvar VAR_0x8004, SPECIES_HO_OH
	goto Common_EventScript_LegendaryFlewAway
	end

CaveOfOrigin_Depths_EventScript_RanFromHoOh::
	setvar VAR_0x8004, SPECIES_HO_OH
	goto Common_EventScript_LegendaryFlewAway
	end
