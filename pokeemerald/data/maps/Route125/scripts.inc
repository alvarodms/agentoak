Route125_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, Route125_OnTransition
	map_script MAP_SCRIPT_ON_LOAD, Route125_OnLoad
	map_script MAP_SCRIPT_ON_FRAME_TABLE, Route125_OnFrame
	.byte 0

Route125_OnTransition:
	call_if_set FLAG_SYS_WEATHER_CTRL, Common_EventScript_SetAbnormalWeather
	call_if_eq VAR_SHOULD_END_ABNORMAL_WEATHER, 1, AbnormalWeather_EventScript_HideMapNamePopup
	call_if_eq VAR_ABNORMAL_WEATHER_LOCATION, ABNORMAL_WEATHER_ROUTE_125_WEST, AbnormalWeather_StartKyogreWeather
	call_if_eq VAR_ABNORMAL_WEATHER_LOCATION, ABNORMAL_WEATHER_ROUTE_125_EAST, AbnormalWeather_StartKyogreWeather
	setflag FLAG_HIDE_ROUTE125_OMEN_SWIMMER
	call_if_set FLAG_BADGE07_GET, Route125_EventScript_SetOmenWeather
	end

Route125_EventScript_SetOmenWeather::
	setweather WEATHER_SNOW
	doweather
	clearflag FLAG_HIDE_ROUTE125_OMEN_SWIMMER
	return

Route125_OnLoad:
	call_if_eq VAR_ABNORMAL_WEATHER_LOCATION, ABNORMAL_WEATHER_ROUTE_125_WEST, AbnormalWeather_EventScript_PlaceTilesRoute125West
	call_if_eq VAR_ABNORMAL_WEATHER_LOCATION, ABNORMAL_WEATHER_ROUTE_125_EAST, AbnormalWeather_EventScript_PlaceTilesRoute125East
	end

Route125_OnFrame:
	map_script_2 VAR_SHOULD_END_ABNORMAL_WEATHER, 1, AbnormalWeather_EventScript_EndEventAndCleanup_1
	.2byte 0

Route125_EventScript_Nolen::
	trainerbattle_single TRAINER_NOLEN, Route125_Text_NolenIntro, Route125_Text_NolenDefeat
	msgbox Route125_Text_NolenPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Stan::
	trainerbattle_single TRAINER_STAN, Route125_Text_StanIntro, Route125_Text_StanDefeat
	msgbox Route125_Text_StanPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Tanya::
	trainerbattle_single TRAINER_TANYA, Route125_Text_TanyaIntro, Route125_Text_TanyaDefeat
	msgbox Route125_Text_TanyaPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Sharon::
	trainerbattle_single TRAINER_SHARON, Route125_Text_SharonIntro, Route125_Text_SharonDefeat
	msgbox Route125_Text_SharonPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Ernest::
	trainerbattle_single TRAINER_ERNEST_1, Route125_Text_ErnestIntro, Route125_Text_ErnestDefeat, Route125_EventScript_RegisterErnest
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route125_EventScript_RematchErnest
	msgbox Route125_Text_ErnestPostBattle, MSGBOX_DEFAULT
	release
	end

Route125_EventScript_RegisterErnest::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route125_Text_ErnestRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_ERNEST_1
	release
	end

Route125_EventScript_RematchErnest::
	trainerbattle_rematch TRAINER_ERNEST_1, Route125_Text_ErnestRematchIntro, Route125_Text_ErnestRematchDefeat
	msgbox Route125_Text_ErnestRematchPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Kim::
	trainerbattle_double TRAINER_KIM_AND_IRIS, Route125_Text_KimIntro, Route125_Text_KimDefeat, Route125_Text_KimNotEnoughMons
	msgbox Route125_Text_KimPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Iris::
	trainerbattle_double TRAINER_KIM_AND_IRIS, Route125_Text_IrisIntro, Route125_Text_IrisDefeat, Route125_Text_IrisNotEnoughMons
	msgbox Route125_Text_IrisPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Presley::
	trainerbattle_single TRAINER_PRESLEY, Route125_Text_PresleyIntro, Route125_Text_PresleyDefeat
	msgbox Route125_Text_PresleyPostBattle, MSGBOX_AUTOCLOSE
	end

Route125_EventScript_Auron::
	trainerbattle_single TRAINER_AURON, Route125_Text_AuronIntro, Route125_Text_AuronDefeat
	msgbox Route125_Text_AuronPostBattle, MSGBOX_AUTOCLOSE
	end

@ =============================================
@ Weather Omen NPC — Route 125 Swimmer (C160)
@ Only visible after Badge 7 permanent hail
@ =============================================

Route125_EventScript_WeatherOmenSwimmer::
	lock
	faceplayer
	goto_if_set FLAG_QUEST_HARTLEY_SITE3, Route125_EventScript_OmenSwimmerChecked
	goto_if_set FLAG_QUEST_HARTLEY_STARTED, Route125_EventScript_OmenSwimmerQuest
	msgbox Route125_Text_OmenSwimmer, MSGBOX_DEFAULT
	release
	end

Route125_EventScript_OmenSwimmerQuest::
	msgbox Route125_Text_OmenSwimmerQuest, MSGBOX_DEFAULT
	setflag FLAG_QUEST_HARTLEY_SITE3
	release
	end

Route125_EventScript_OmenSwimmerChecked::
	msgbox Route125_Text_OmenSwimmerChecked, MSGBOX_DEFAULT
	release
	end

Route125_Text_OmenSwimmer:
	.string "The water's ice cold today!\p"
	.string "The currents have changed.\n"
	.string "Shoal Cave must be freezing.$"

Route125_Text_OmenSwimmerQuest:
	.string "You're checking the hail?\n"
	.string "Good. Someone should.\p"
	.string "It hasn't stopped once since\n"
	.string "the migration. Not once.\p"
	.string "But lately the pattern changed.\n"
	.string "It used to fall steady, like rain.\p"
	.string "Now it pulses. Heavy, then light,\n"
	.string "then heavy. Like breathing.\p"
	.string "And the ice -- hold a piece\n"
	.string "sometime. It's not cold the way\l"
	.string "ice should be.\p"
	.string "It's a different kind of cold.\n"
	.string "I don't know what it means.\l"
	.string "But I wish I didn't notice it.$"

Route125_Text_OmenSwimmerChecked:
	.string "The pulsing hasn't stopped.\n"
	.string "I'd rather not keep watching.$"

