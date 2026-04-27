Route128_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, Route128_OnTransition
	map_script MAP_SCRIPT_ON_FRAME_TABLE, Route128_OnFrame
	.byte 0

Route128_OnTransition:
	call_if_set FLAG_SYS_WEATHER_CTRL, Common_EventScript_SetAbnormalWeather
	goto_if_set FLAG_SYS_GAME_CLEAR, Route128_OnTransition_ShowPostgameAquaGrunt
	setflag FLAG_HIDE_ROUTE128_POSTGAME_AQUA_GRUNT
	end

Route128_OnTransition_ShowPostgameAquaGrunt:
	clearflag FLAG_HIDE_ROUTE128_POSTGAME_AQUA_GRUNT
	end

Route128_OnFrame:
	map_script_2 VAR_ROUTE128_STATE, 1, Route128_EventScript_KyogreAwakenedScene
	.2byte 0

Route128_EventScript_KyogreAwakenedScene::
	lockall
	delay 20
	applymovement LOCALID_ROUTE128_ARCHIE, Route128_Movement_ArchieLookAround
	waitmovement 0
	msgbox Route128_Text_ArchieWhatHappened, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE128_ARCHIE, Route128_Movement_ArchieBackUp
	waitmovement 0
	msgbox Route128_Text_ArchieIOnlyWanted, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE128_MAXIE, Route128_Movement_MaxieApproachArchie
	waitmovement 0
	applymovement LOCALID_ROUTE128_ARCHIE, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	msgbox Route128_Text_MaxieDoYouUnderstandNow, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE128_MAXIE, Route128_Movement_MaxieApproachPlayer
	waitmovement 0
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	msgbox Route128_Text_MaxieResposibilityFallsToArchieAndMe, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE128_ARCHIE, Route128_Movement_ArchieRunLeft
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterLeft
	applymovement LOCALID_ROUTE128_MAXIE, Route128_Movement_MaxieWalkLeft
	waitmovement 0
	msgbox Route128_Text_MaxieThisDefiesBelief, MSGBOX_DEFAULT
	closemessage
	delay 40
	applymovement LOCALID_ROUTE128_MAXIE, Route128_Movement_MaxieExit
	applymovement LOCALID_ROUTE128_ARCHIE, Route128_Movement_ArchieExit
	waitmovement 0
	removeobject LOCALID_ROUTE128_MAXIE
	removeobject LOCALID_ROUTE128_ARCHIE
	delay 100
	setfieldeffectargument 0, 1
	dofieldeffect FLDEFF_NPCFLY_OUT
	waitfieldeffect FLDEFF_NPCFLY_OUT
	addobject LOCALID_ROUTE128_STEVEN
	applymovement LOCALID_ROUTE128_STEVEN, Route128_Movement_StevenApproachPlayer
	waitmovement 0
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterRight
	waitmovement 0
	msgbox Route128_Text_StevenWhatIsHappening, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE128_STEVEN, Route128_Movement_StevenWalkUp
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	msgbox Route128_Text_StevenWholeWorldWillDrown, MSGBOX_DEFAULT
	applymovement LOCALID_ROUTE128_STEVEN, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	msgbox Route128_Text_StevenImGoingToSootopolis, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE128_STEVEN, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	delay 50
	setfieldeffectargument 0, 1
	dofieldeffect FLDEFF_NPCFLY_OUT
	delay 15
	removeobject LOCALID_ROUTE128_STEVEN
	waitfieldeffect FLDEFF_NPCFLY_OUT
	clearflag FLAG_HIDE_MAP_NAME_POPUP
	setvar VAR_ROUTE128_STATE, 2
	releaseall
	end

Route128_Movement_Unused1:
	walk_fast_left
	step_end

Route128_Movement_Unused2:
	walk_left
	walk_left
	walk_left
	walk_left
	walk_left
	walk_left
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	step_end

Route128_Movement_StevenWalkUp:
	walk_up
	step_end

Route128_Movement_StevenApproachPlayer:
	walk_fast_left
	step_end

Route128_Movement_ArchieLookAround:
	walk_fast_down
	walk_in_place_faster_left
	delay_16
	walk_in_place_faster_right
	delay_16
	delay_16
	walk_in_place_faster_down
	step_end

Route128_Movement_ArchieBackUp:
	lock_facing_direction
	walk_slow_up
	delay_16
	unlock_facing_direction
	step_end

Route128_Movement_ArchieRunLeft:
	walk_fast_left
	walk_fast_left
	walk_fast_left
	walk_in_place_faster_right
	step_end

Route128_Movement_ArchieExit:
	delay_16
	delay_16
	walk_fast_up
	walk_fast_left
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	step_end

Route128_Movement_MaxieWalkLeft:
	walk_left
	walk_left
	delay_8
	delay_4
	step_end

Route128_Movement_MaxieApproachArchie:
	walk_left
	walk_in_place_faster_down
	step_end

Route128_Movement_MaxieExit:
	walk_fast_left
	walk_fast_left
	walk_fast_left
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	step_end

Route128_Movement_MaxieApproachPlayer:
	walk_right
	walk_in_place_faster_down
	step_end

Route128_EventScript_Isaiah::
	trainerbattle_single TRAINER_ISAIAH_1, Route128_Text_IsaiahIntro, Route128_Text_IsaiahDefeat, Route128_EventScript_RegisterIsaiah
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route128_EventScript_RematchIsaiah
	msgbox Route128_Text_IsaiahPostBattle, MSGBOX_DEFAULT
	release
	end

Route128_EventScript_RegisterIsaiah::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route128_Text_IsaiahRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_ISAIAH_1
	release
	end

Route128_EventScript_RematchIsaiah::
	trainerbattle_rematch TRAINER_ISAIAH_1, Route128_Text_IsaiahRematchIntro, Route128_Text_IsaiahRematchDefeat
	msgbox Route128_Text_IsaiahPostRematch, MSGBOX_AUTOCLOSE
	end

Route128_EventScript_Katelyn::
	trainerbattle_single TRAINER_KATELYN_1, Route128_Text_KatelynIntro, Route128_Text_KatelynDefeat, Route128_EventScript_RegisterKatelyn
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route128_EventScript_RematchKatelyn
	msgbox Route128_Text_KatelynPostBattle, MSGBOX_DEFAULT
	release
	end

Route128_EventScript_RegisterKatelyn::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route128_Text_KatelynRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_KATELYN_1
	release
	end

Route128_EventScript_RematchKatelyn::
	trainerbattle_rematch TRAINER_KATELYN_1, Route128_Text_KatelynRematchIntro, Route128_Text_KatelynRematchDefeat
	msgbox Route128_Text_KatelynPostRematch, MSGBOX_AUTOCLOSE
	end

Route128_EventScript_Alexa::
	trainerbattle_single TRAINER_ALEXA, Route128_Text_AlexaIntro, Route128_Text_AlexaDefeat
	msgbox Route128_Text_AlexaPostBattle, MSGBOX_AUTOCLOSE
	end

Route128_EventScript_Ruben::
	trainerbattle_single TRAINER_RUBEN, Route128_Text_RubenIntro, Route128_Text_RubenDefeat
	msgbox Route128_Text_RubenPostBattle, MSGBOX_AUTOCLOSE
	end

Route128_EventScript_Wayne::
	trainerbattle_single TRAINER_WAYNE, Route128_Text_WayneIntro, Route128_Text_WayneDefeat
	msgbox Route128_Text_WaynePostBattle, MSGBOX_AUTOCLOSE
	end

Route128_EventScript_Harrison::
	trainerbattle_single TRAINER_HARRISON, Route128_Text_HarrisonIntro, Route128_Text_HarrisonDefeat
	msgbox Route128_Text_HarrisonPostBattle, MSGBOX_AUTOCLOSE
	end

Route128_EventScript_Carlee::
	trainerbattle_single TRAINER_CARLEE, Route128_Text_CarleeIntro, Route128_Text_CarleeDefeat
	msgbox Route128_Text_CarleePostBattle, MSGBOX_AUTOCLOSE
	end

Route128_Text_ArchieWhatHappened:
	.string "ARCHIE: What happened…\n"
	.string "What is this wretched scene…\p"
	.string "Did I…make a horrible mistake?$"

Route128_Text_ArchieIOnlyWanted:
	.string "I…\n"
	.string "I only wanted…$"

Route128_Text_MaxieDoYouUnderstandNow:
	.string "MAXIE: Do you understand now,\n"
	.string "ARCHIE?\p"
	.string "Do you finally see how disastrous\n"
	.string "your dream turned out to be?\p"
	.string "We have to hurry! We have to do\n"
	.string "something before the situation goes\l"
	.string "completely out of control!$"

Route128_Text_MaxieResposibilityFallsToArchieAndMe:
	.string "MAXIE: {PLAYER}, don't say anything.\p"
	.string "I know that I have no right to be\n"
	.string "critical of ARCHIE…\p"
	.string "But the way things are now, I doubt\n"
	.string "that we humans will be capable of\l"
	.string "doing anything about it.\p"
	.string "But neither can we stand by and\n"
	.string "just watch helplessly.\p"
	.string "The responsibility for putting an end\n"
	.string "to this falls to ARCHIE and me…$"

Route128_Text_MaxieThisDefiesBelief:
	.string "MAXIE: This defies belief…\p"
	.string "Those super-ancient POKéMON…\p"
	.string "Their power is unbelievable.\n"
	.string "They've upset the balance of nature…$"

Route128_Text_StevenWhatIsHappening:
	.string "STEVEN: {PLAYER}{KUN}!\n"
	.string "What is happening?$"

Route128_Text_StevenWholeWorldWillDrown:
	.string "This is terrible…\p"
	.string "After the scorching heat wave ended,\n"
	.string "this deluge began.\p"
	.string "If this doesn't stop, all of HOENN…\n"
	.string "No, the whole world will drown.\p"
	.string "This huge rain cloud is spreading\n"
	.string "from above SOOTOPOLIS…\p"
	.string "What in the world is taking place there?\p"
	.string "There's no point arguing here…\n"
	.string "SOOTOPOLIS might provide answers…$"

Route128_Text_StevenImGoingToSootopolis:
	.string "{PLAYER}{KUN}…\n"
	.string "I don't know what you intend to do,\l"
	.string "but don't do anything reckless.\p"
	.string "Okay.\n"
	.string "I'm going to SOOTOPOLIS.$"

@ C187 Ocean Atmosphere NPC — Scared Diver
@ C205: Post-Rayquaza resolution ("The Exhale")
Route128_EventScript_ScaredDiver::
	goto_if_set FLAG_CAUGHT_RAYQUAZA_GUARDIAN, Route128_EventScript_ScaredDiverResolved
	goto_if_set FLAG_DEFEATED_RAYQUAZA_GUARDIAN, Route128_EventScript_ScaredDiverResolved
	msgbox Route128_Text_ScaredDiver, MSGBOX_NPC
	end

Route128_EventScript_ScaredDiverResolved::
	lock
	faceplayer
	msgbox Route128_Text_ScaredDiverResolved, MSGBOX_DEFAULT
	release
	end

Route128_Text_ScaredDiver:
	.string "I saw shapes below me. Big ones.\n"
	.string "Moving together, like a convoy.\p"
	.string "They had somewhere to be.\n"
	.string "I'm not going back down there.$"

Route128_Text_ScaredDiverResolved:
	.string "I went back down. Took me\n"
	.string "a week to work up the nerve.\p"
	.string "The shapes are gone. Just\n"
	.string "open water where they passed.\p"
	.string "But the current down there\n"
	.string "feels… different now.\p"
	.string "Like something big came through\n"
	.string "and left a trail.$"

@ =============================================
@ Deep Migration Event -- "The Deep Migration" (C188)
@ A Wailord pod passes beneath Route 128.
@ Triggers once post-Badge 7 via coord_events.
@ =============================================

Route128_EventScript_DeepMigration::
	goto_if_set FLAG_DEEP_MIGRATION_EVENT, Route128_EventScript_DeepMigration_End
	goto_if_unset FLAG_BADGE07_GET, Route128_EventScript_DeepMigration_End
	lockall
	@ Beat 1: Something is wrong
	delay 15
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	@ Beat 2: The ocean trembles
	LegendMacro_ScreenShake 1, 1, 4, 3
	delay 20
	@ Beat 3: First cry -- close, massive
	LegendMacro_PlayCry SPECIES_WAILORD
	@ Beat 4: Weather darkens
	LegendMacro_SetWeather WEATHER_RAIN
	delay 30
	@ Beat 5: Second cry -- distant echo
	waitse
	playmoncry SPECIES_WAILORD, CRY_MODE_NORMAL
	delay 30
	waitmoncry
	@ Beat 6: The player sees it
	msgbox Route128_Text_DeepMigration1, MSGBOX_DEFAULT
	@ Beat 7: One breaks away
	delay 15
	waitse
	playmoncry SPECIES_WAILORD, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	msgbox Route128_Text_DeepMigration2, MSGBOX_DEFAULT
	@ Beat 8: The encounter
	playse SE_PIN
	delay 20
	setwildbattle SPECIES_WAILMER, 40, ITEM_MYSTIC_WATER
	dowildbattle
	@ Beat 9: Aftermath
	msgbox Route128_Text_DeepMigration3, MSGBOX_DEFAULT
	@ Restore weather
	setweather WEATHER_SUNNY
	doweather
	@ Mark complete
	setflag FLAG_DEEP_MIGRATION_EVENT
	releaseall
	end

Route128_EventScript_DeepMigration_End::
	end

@ =============================================
@ Deep Migration Event Text
@ =============================================

Route128_Text_DeepMigration1:
	.string "The ocean trembles beneath you.\n"
	.string "Vast shadows glide below the surface.\p"
	.string "A convoy of enormous shapes,\n"
	.string "blotting out the seafloor.\l"
	.string "Moving south. Moving with purpose.$"

Route128_Text_DeepMigration2:
	.string "One shape breaks from the pod.\n"
	.string "Smaller. Younger.\p"
	.string "It surfaces nearby, drawn by\n"
	.string "your presence on the water.$"

Route128_Text_DeepMigration3:
	.string "The pod has passed.\n"
	.string "The sea goes still.\p"
	.string "But the current still hums with\n"
	.string "their passing.\l"
	.string "The world is moving.$"

@ C285: Postgame ex-Aqua grunt -- quiet horror
Route128_EventScript_ExAquaGrunt::
	lock
	faceplayer
	goto_if_set FLAG_RECKONING_TALKED_ROUTE128, Route128_EventScript_ExAquaGruntShort
	msgbox Route128_Text_ExAquaGrunt, MSGBOX_DEFAULT
	setflag FLAG_RECKONING_TALKED_ROUTE128
	release
	end

Route128_EventScript_ExAquaGruntShort::
	msgbox Route128_Text_ExAquaGruntShort, MSGBOX_DEFAULT
	release
	end

Route128_Text_ExAquaGrunt:
	.string "I used to dive. Every day,\n"
	.string "out past the reef.\p"
	.string "After everything happened...\n"
	.string "I went down once more.\l"
	.string "Near the rift.\p"
	.string "The water was different.\n"
	.string "Not warmer, not colder.\p"
	.string "...Aware.\p"
	.string "I haven't been back in the\n"
	.string "water since.$"

Route128_Text_ExAquaGruntShort:
	.string "You ever look at the ocean\n"
	.string "and feel like it's looking back?\p"
	.string "...No? Good.$"

