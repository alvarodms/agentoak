Route119_MapScripts::
	map_script MAP_SCRIPT_ON_RESUME, Route119_OnResume
	map_script MAP_SCRIPT_ON_TRANSITION, Route119_OnTransition
	.byte 0

Route119_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, Route119_EventScript_TryRemoveKecleon
	end

Route119_EventScript_TryRemoveKecleon::
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_ne VAR_RESULT, B_OUTCOME_CAUGHT, Common_EventScript_NopReturn
	removeobject VAR_LAST_TALKED
	return

Route119_OnTransition:
	call Common_EventScript_SetupRivalGfxId
	call Common_EventScript_SetupRivalOnBikeGfxId
	call_if_eq VAR_WEATHER_INSTITUTE_STATE, 1, Route119_EventScript_MoveInstituteWorkersDownstairs
	setflag FLAG_HIDE_ROUTE119_HARTLEY_EVENT
	setflag FLAG_HIDE_ROUTE119_OMEN_RANGER
	goto_if_set FLAG_BADGE06_GET, Route119_EventScript_SetOmenWeather
	special SetRoute119Weather
	end

Route119_EventScript_SetOmenWeather::
	setweather WEATHER_RAIN_THUNDERSTORM
	doweather
	clearflag FLAG_HIDE_ROUTE119_OMEN_RANGER
	end

Route119_EventScript_MoveInstituteWorkersDownstairs::
	setflag FLAG_HIDE_WEATHER_INSTITUTE_2F_WORKERS
	clearflag FLAG_HIDE_WEATHER_INSTITUTE_1F_WORKERS
	setvar VAR_WEATHER_INSTITUTE_STATE, 2
	return

Route119_EventScript_RivalTrigger1::
	setvar VAR_TEMP_1, 1
	goto Route119_EventScript_RivalEncounter
	end

Route119_EventScript_RivalTrigger2::
	setvar VAR_TEMP_1, 2
	goto Route119_EventScript_RivalEncounter
	end

Route119_EventScript_RivalEncounter::
	lockall
	addobject LOCALID_ROUTE119_RIVAL_ON_BIKE
	checkplayergender
	call_if_eq VAR_RESULT, MALE, Route119_EventScript_PlayMayMusic
	call_if_eq VAR_RESULT, FEMALE, Route119_EventScript_PlayBrendanMusic
	delay 65
	call_if_eq VAR_TEMP_1, 1, Route119_EventScript_RivalEnter1
	call_if_eq VAR_TEMP_1, 2, Route119_EventScript_RivalEnter2
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	delay 30
	call_if_eq VAR_TEMP_1, 1, Route119_EventScript_SetRivalPos1
	call_if_eq VAR_TEMP_1, 2, Route119_EventScript_SetRivalPos2
	removeobject LOCALID_ROUTE119_RIVAL_ON_BIKE
	addobject LOCALID_ROUTE119_RIVAL
	delay 30
	checkplayergender
	goto_if_eq VAR_RESULT, MALE, Route119_EventScript_BattleMay
	goto_if_eq VAR_RESULT, FEMALE, Route119_EventScript_BattleBrendan
	releaseall
	end

Route119_EventScript_PlayMayMusic::
	playbgm MUS_ENCOUNTER_MAY, TRUE
	return

Route119_EventScript_PlayBrendanMusic::
	playbgm MUS_ENCOUNTER_BRENDAN, TRUE
	return

Route119_EventScript_BattleMay::
	msgbox Route119_Text_MayIntro, MSGBOX_DEFAULT
	switch VAR_STARTER_MON
	case 0, Route119_EventScript_BattleMayTreecko
	case 1, Route119_EventScript_BattleMayTorchic
	case 2, Route119_EventScript_BattleMayMudkip
	end

Route119_EventScript_BattleMayTreecko::
	trainerbattle_no_intro TRAINER_MAY_ROUTE_119_TREECKO, Route119_Text_MayDefeat
	goto Route119_EventScript_DefeatedMay
	end

Route119_EventScript_BattleMayTorchic::
	trainerbattle_no_intro TRAINER_MAY_ROUTE_119_TORCHIC, Route119_Text_MayDefeat
	goto Route119_EventScript_DefeatedMay
	end

Route119_EventScript_BattleMayMudkip::
	trainerbattle_no_intro TRAINER_MAY_ROUTE_119_MUDKIP, Route119_Text_MayDefeat
	goto Route119_EventScript_DefeatedMay
	end

Route119_EventScript_DefeatedMay::
	msgbox Route119_Text_MayPresentForYou, MSGBOX_DEFAULT
	call Route119_EventScript_GiveFlyHM
	msgbox Route119_Text_MayExplainFly, MSGBOX_DEFAULT
	goto Route119_EventScript_RivalExitScottArrive
	end

Route119_EventScript_BattleBrendan::
	msgbox Route119_Text_BrendanIntro, MSGBOX_DEFAULT
	switch VAR_STARTER_MON
	case 0, Route119_EventScript_BattleBrendanTreecko
	case 1, Route119_EventScript_BattleBrendanTorchic
	case 2, Route119_EventScript_BattleBrendanMudkip
	end

Route119_EventScript_BattleBrendanTreecko::
	trainerbattle_no_intro TRAINER_BRENDAN_ROUTE_119_TREECKO, Route119_Text_BrendanDefeat
	goto Route119_EventScript_DefeatedBrendan
	end

Route119_EventScript_BattleBrendanTorchic::
	trainerbattle_no_intro TRAINER_BRENDAN_ROUTE_119_TORCHIC, Route119_Text_BrendanDefeat
	goto Route119_EventScript_DefeatedBrendan
	end

Route119_EventScript_BattleBrendanMudkip::
	trainerbattle_no_intro TRAINER_BRENDAN_ROUTE_119_MUDKIP, Route119_Text_BrendanDefeat
	goto Route119_EventScript_DefeatedBrendan
	end

Route119_EventScript_DefeatedBrendan::
	msgbox Route119_Text_BrendanIllGiveYouThis, MSGBOX_DEFAULT
	call Route119_EventScript_GiveFlyHM
	msgbox Route119_Text_BrendanExplainFly, MSGBOX_DEFAULT
	goto Route119_EventScript_RivalExitScottArrive
	end

Route119_EventScript_GiveFlyHM::
	giveitem ITEM_HM_FLY
	setflag FLAG_RECEIVED_HM_FLY
	return

Route119_EventScript_RivalExitScottArrive::
	closemessage
	call_if_eq VAR_TEMP_1, 1, Route119_EventScript_SetRivalPos1
	call_if_eq VAR_TEMP_1, 2, Route119_EventScript_SetRivalPos2
	removeobject LOCALID_ROUTE119_RIVAL
	addobject LOCALID_ROUTE119_RIVAL_ON_BIKE
	delay 30
	call_if_eq VAR_TEMP_1, 1, Route119_EventScript_RivalExit1
	call_if_eq VAR_TEMP_1, 2, Route119_EventScript_RivalExit2
	removeobject LOCALID_ROUTE119_RIVAL_ON_BIKE
	setvar VAR_ROUTE119_STATE, 1
	savebgm MUS_DUMMY
	fadedefaultbgm
	delay 60
	call_if_eq VAR_TEMP_1, 1, Route119_EventScript_SetScottPos1
	call_if_eq VAR_TEMP_1, 2, Route119_EventScript_SetScottPos2
	addobject LOCALID_ROUTE119_SCOTT
	applymovement LOCALID_ROUTE119_SCOTT, Route119_Movement_ScottEnter
	waitmovement 0
	addvar VAR_SCOTT_STATE, 1
	msgbox Route119_Text_ScottWayToGoBeSeeingYou, MSGBOX_DEFAULT
	closemessage
	call_if_eq VAR_TEMP_1, 1, Route119_EventScript_ScottExit1
	call_if_eq VAR_TEMP_1, 2, Route119_EventScript_ScottExit2
	removeobject LOCALID_ROUTE119_SCOTT
	releaseall
	end

Route119_EventScript_SetScottPos1::
	setobjectxyperm LOCALID_ROUTE119_SCOTT, 27, 25
	return

Route119_EventScript_SetScottPos2::
	setobjectxyperm LOCALID_ROUTE119_SCOTT, 28, 25
	return

Route119_EventScript_ScottExit1::
	applymovement LOCALID_ROUTE119_SCOTT, Route119_Movement_ScottExit1
	waitmovement 0
	return

Route119_EventScript_ScottExit2::
	applymovement LOCALID_ROUTE119_SCOTT, Route119_Movement_ScottExit2
	waitmovement 0
	return

Route119_EventScript_RivalEnter1::
	applymovement LOCALID_ROUTE119_RIVAL_ON_BIKE, Route119_Movement_RivalEnter1
	waitmovement 0
	return

Route119_EventScript_RivalEnter2::
	applymovement LOCALID_ROUTE119_RIVAL_ON_BIKE, Route119_Movement_RivalEnter2
	waitmovement 0
	return

Route119_EventScript_RivalExit1::
	applymovement LOCALID_PLAYER, Route119_Movement_PlayerWatchRivalExit1
	applymovement LOCALID_ROUTE119_RIVAL_ON_BIKE, Route119_Movement_RivalExit1
	waitmovement 0
	return

Route119_EventScript_RivalExit2::
	applymovement LOCALID_PLAYER, Route119_Movement_PlayerWatchRivalExit2
	applymovement LOCALID_ROUTE119_RIVAL_ON_BIKE, Route119_Movement_RivalExit2
	waitmovement 0
	return

Route119_EventScript_SetRivalPos1::
	setobjectxyperm LOCALID_ROUTE119_RIVAL, 25, 32
	setobjectxyperm LOCALID_ROUTE119_RIVAL_ON_BIKE, 25, 32
	return

Route119_EventScript_SetRivalPos2::
	setobjectxyperm LOCALID_ROUTE119_RIVAL, 26, 32
	setobjectxyperm LOCALID_ROUTE119_RIVAL_ON_BIKE, 26, 32
	return

Route119_Movement_PlayerWatchRivalExit1:
	delay_16
	walk_in_place_faster_right
	delay_8
	walk_in_place_faster_up
	step_end

Route119_Movement_PlayerWatchRivalExit2:
	delay_16
	walk_in_place_faster_left
	delay_8
	walk_in_place_faster_up
	step_end

Route119_Movement_RivalEnter1:
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_up
	step_end

Route119_Movement_RivalEnter2:
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_up
	step_end

Route119_Movement_RivalExit1:
	walk_fast_right
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_right
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	step_end

Route119_Movement_RivalExit2:
	walk_fast_left
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_right
	walk_fast_right
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_up
	step_end

Route119_Movement_ScottEnter:
	walk_down
	walk_down
	walk_down
	walk_down
	walk_left
	walk_left
	walk_down
	step_end

Route119_Movement_ScottExit1:
	walk_up
	walk_right
	walk_right
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	step_end

Route119_Movement_ScottExit2:
	walk_up
	walk_right
	walk_up
	walk_up
	walk_up
	walk_up
	walk_up
	step_end

Route119_EventScript_CyclingTriathleteM::
	msgbox Route119_Text_TallGrassSnaresBikeTires, MSGBOX_NPC
	end

Route119_EventScript_RouteSignFortree::
	msgbox Route119_Text_RouteSignFortree, MSGBOX_SIGN
	end

Route119_EventScript_WeatherInstituteSign::
	msgbox Route119_Text_WeatherInstitute, MSGBOX_SIGN
	end

Route119_EventScript_Brent::
	trainerbattle_single TRAINER_BRENT, Route119_Text_BrentIntro, Route119_Text_BrentDefeat
	msgbox Route119_Text_BrentPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Donald::
	trainerbattle_single TRAINER_DONALD, Route119_Text_DonaldIntro, Route119_Text_DonaldDefeat
	msgbox Route119_Text_DonaldPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Taylor::
	trainerbattle_single TRAINER_TAYLOR, Route119_Text_TaylorIntro, Route119_Text_TaylorDefeat
	msgbox Route119_Text_TaylorPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Doug::
	trainerbattle_single TRAINER_DOUG, Route119_Text_DougIntro, Route119_Text_DougDefeat
	msgbox Route119_Text_DougPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Greg::
	trainerbattle_single TRAINER_GREG, Route119_Text_GregIntro, Route119_Text_GregDefeat
	msgbox Route119_Text_GregPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Kent::
	trainerbattle_single TRAINER_KENT, Route119_Text_KentIntro, Route119_Text_KentDefeat
	msgbox Route119_Text_KentPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Jackson::
	trainerbattle_single TRAINER_JACKSON_1, Route119_Text_JacksonIntro, Route119_Text_JacksonDefeat, Route119_EventScript_RegisterJackson
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route119_EventScript_RematchJackson
	msgbox Route119_Text_JacksonPostBattle, MSGBOX_DEFAULT
	release
	end

Route119_EventScript_RegisterJackson::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route119_Text_JacksonRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_JACKSON_1
	release
	end

Route119_EventScript_RematchJackson::
	trainerbattle_rematch TRAINER_JACKSON_1, Route119_Text_JacksonRematchIntro, Route119_Text_JacksonRematchDefeat
	msgbox Route119_Text_JacksonPostRematch, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Catherine::
	trainerbattle_single TRAINER_CATHERINE_1, Route119_Text_CatherineIntro, Route119_Text_CatherineDefeat, Route119_EventScript_RegisterCatherine
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route119_EventScript_RematchCatherine
	msgbox Route119_Text_CatherinePostBattle, MSGBOX_DEFAULT
	release
	end

Route119_EventScript_RegisterCatherine::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route119_Text_CatherineRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_CATHERINE_1
	release
	end

Route119_EventScript_RematchCatherine::
	trainerbattle_rematch TRAINER_CATHERINE_1, Route119_Text_CatherineRematchIntro, Route119_Text_CatherineRematchDefeat
	msgbox Route119_Text_CatherinePostRematch, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Hugh::
	trainerbattle_single TRAINER_HUGH, Route119_Text_HughIntro, Route119_Text_HughDefeat
	msgbox Route119_Text_HughPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Phil::
	trainerbattle_single TRAINER_PHIL, Route119_Text_PhilIntro, Route119_Text_PhilDefeat
	msgbox Route119_Text_PhilPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Yasu::
	trainerbattle_single TRAINER_YASU, Route119_Text_YasuIntro, Route119_Text_YasuDefeat
	msgbox Route119_Text_YasuPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Takashi::
	trainerbattle_single TRAINER_TAKASHI, Route119_Text_TakashiIntro, Route119_Text_TakashiDefeat
	msgbox Route119_Text_TakashiPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Hideo::
	trainerbattle_single TRAINER_HIDEO, Route119_Text_HideoIntro, Route119_Text_HideoDefeat
	msgbox Route119_Text_HideoPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Chris::
	trainerbattle_single TRAINER_CHRIS, Route119_Text_ChrisIntro, Route119_Text_ChrisDefeat
	msgbox Route119_Text_ChrisPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Fabian::
	trainerbattle_single TRAINER_FABIAN, Route119_Text_FabianIntro, Route119_Text_FabianDefeat
	msgbox Route119_Text_FabianPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Dayton::
	trainerbattle_single TRAINER_DAYTON, Route119_Text_DaytonIntro, Route119_Text_DaytonDefeat
	msgbox Route119_Text_DaytonPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_Rachel::
	trainerbattle_single TRAINER_RACHEL, Route119_Text_RachelIntro, Route119_Text_RachelDefeat
	msgbox Route119_Text_RachelPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_BridgeAquaGrunt1::
	lock
	faceplayer
	msgbox Route119_Text_StayAwayFromWeatherInstitute, MSGBOX_DEFAULT
	closemessage
	applymovement VAR_LAST_TALKED, Common_Movement_FaceOriginalDirection
	waitmovement 0
	release
	end

Route119_EventScript_BridgeAquaGrunt2::
	lock
	faceplayer
	msgbox Route119_Text_DontGoNearWeatherInstitute, MSGBOX_DEFAULT
	closemessage
	applymovement VAR_LAST_TALKED, Common_Movement_FaceOriginalDirection
	waitmovement 0
	release
	end

Route119_EventScript_Boy1::
	lock
	faceplayer
	goto_if_set FLAG_SECOND_WAVE, Route119_EventScript_Boy1_Post
	msgbox Route119_Text_ThoughtFlyByCatchingBirdMons, MSGBOX_DEFAULT
	release
	end

Route119_EventScript_Boy1_Post::
	msgbox Route119_Text_Boy_PostWave, MSGBOX_DEFAULT
	release
	end

Route119_EventScript_Boy2::
	msgbox Route119_Text_CanYourMonMakeSecretBase, MSGBOX_NPC
	end

Route119_EventScript_TrainerTipsDecoration::
	msgbox Route119_Text_TrainerTipsDecoration, MSGBOX_SIGN
	end

Route119_EventScript_ScottWonAtFortreeGymCall::
	lockall
	pokenavcall Route119_Text_ScottYouWonAtFortreeGym
	waitmessage
	clearflag FLAG_SCOTT_CALL_FORTREE_GYM
	addvar VAR_SCOTT_STATE, 1
	releaseall
	end

Route119_Text_MayIntro:
	.string "MAY: {PLAYER}{KUN}!\n"
	.string "Have you seen the new POKéMON\l"
	.string "around here?\p"
	.string "I spotted a CHINCHOU in the\n"
	.string "river! Never seen one in\l"
	.string "HOENN before.\p"
	.string "But first - let me see how\n"
	.string "strong you've gotten!\p"
	.string "Ready? Of course you are!\n"
	.string "Go!$"

Route119_Text_MayDefeat:
	.string "Wow...\n"
	.string "You've been catching those\l"
	.string "new POKéMON, haven't you?$"

Route119_Text_MayPresentForYou:
	.string "MAY: That was a great battle!\n"
	.string "Those migration POKéMON really\l"
	.string "made your team shine.\p"
	.string "Oh! And here - a present\n"
	.string "for you.$"

Route119_Text_MayExplainFly:
	.string "MAY: Use FLY, and your POKéMON will\n"
	.string "instantly carry you to any town you've\l"
	.string "already visited.\p"
	.string "But, to use FLY, you have to get\n"
	.string "the GYM BADGE from FORTREE CITY.\l"
	.string "That's important, so don't forget.\p"
	.string "You should FLY home and visit\n"
	.string "LITTLEROOT for a change.\p"
	.string "I bet your mom's worried about you,\n"
	.string "{PLAYER}{KUN}.\p"
	.string "Well, let's meet again somewhere!$"

Route119_Text_BrendanIntro:
	.string "BRENDAN: {PLAYER}! Have you\n"
	.string "seen the new POKéMON around\l"
	.string "here?\p"
	.string "There's CHINCHOU in the\n"
	.string "river. Dad's migration\l"
	.string "research was right!\p"
	.string "But enough about that -\n"
	.string "let me test your skills!\p"
	.string "Come on!\n"
	.string "Let's battle!$"

Route119_Text_BrendanDefeat:
	.string "Hmm...\n"
	.string "Those migration POKéMON are\l"
	.string "giving you a real edge.$"

Route119_Text_BrendanIllGiveYouThis:
	.string "BRENDAN: You've gotten strong.\n"
	.string "The migration's changed how\l"
	.string "we all train, hasn't it?\p"
	.string "Here, I'll give you this.$"

Route119_Text_BrendanExplainFly:
	.string "BRENDAN: Use FLY, and your POKéMON\n"
	.string "instantly carries you to any town\l"
	.string "you've already visited.\p"
	.string "But you need the FORTREE GYM BADGE \n"
	.string "to do that.\p"
	.string "Anyway, I have to move along.$"

Route119_Text_ScottWayToGoBeSeeingYou:
	.string "SCOTT: Hahahah!\n"
	.string "Way to go, {PLAYER}{KUN}!\p"
	.string "I just passed by a TRAINER riding\n"
	.string "a BIKE.\p"
	.string "You just beat that TRAINER, didn't you?\n"
	.string "It was pretty obvious that you did.\p"
	.string "The kid looked really upset with\n"
	.string "a face all red from anger.\p"
	.string "I sure seem to run into you often.\n"
	.string "Are you off to FORTREE GYM next?\p"
	.string "I expect that you'll do well at the GYM.\n"
	.string "Well, I'll be seeing you!$"


Route119_Text_ScottYouWonAtFortreeGym:
	.string "… … … … … …\n"
	.string "… … … … … Beep!\p"
	.string "SCOTT: Hiya, {PLAYER}{KUN}, it's me!\p"
	.string "Just as I thought, you won at\n"
	.string "the FORTREE GYM.\p"
	.string "Your strength…\n"
	.string "Perhaps you really are the TRAINER\l"
	.string "that I've been searching for.\p"
	.string "Remember, you have a fan in me.\n"
	.string "I'll be cheering from the sidelines.\l"
	.string "Keep up the great work!\p"
	.string "… … … … … …\n"
	.string "… … … … … Click!$"

Route119_Text_StayAwayFromWeatherInstitute:
	.string "We're standing lookout here.\p"
	.string "Hey, you! Stay away from the WEATHER\n"
	.string "INSTITUTE. It's not safe.$"

Route119_Text_DontGoNearWeatherInstitute:
	.string "Lookout duty is surprisingly boring.\p"
	.string "Hey, you! Please don't go near the\n"
	.string "WEATHER INSTITUTE.$"

Route119_Text_ThoughtFlyByCatchingBirdMons:
	.string "The rain here never used to bother me.\p"
	.string "What bothers me now are new sounds.\n"
	.string "POKéMON calling from the tall grass\l"
	.string "that I do not recognize.\p"
	.string "My Machoke has been jumpy for a week.\n"
	.string "He is never jumpy.$"

Route119_Text_TallGrassSnaresBikeTires:
	.string "Tch…\n"
	.string "It's a no-go…\p"
	.string "The tall grass snares BIKE tires.\n"
	.string "There's no way you can cycle here.$"

Route119_Text_CanYourMonMakeSecretBase:
	.string "Can your POKéMON use its SECRET POWER\n"
	.string "on a big pile of grass and make a\l"
	.string "SECRET BASE?$"

Route119_Text_RouteSignFortree:
	.string "ROUTE 119\n"
	.string "{RIGHT_ARROW} FORTREE CITY$"

Route119_Text_WeatherInstitute:
	.string "WEATHER INSTITUTE$"

Route119_Text_TrainerTipsDecoration:
	.string "TRAINER TIPS\p"
	.string "Up to sixteen decorations and\n"
	.string "furniture items can be placed in\l"
	.string "a SECRET BASE.\p"
	.string "Pick your favorite items and create\n"
	.string "your very own SECRET BASE exactly the\l"
	.string "way you want.$"

Route119_Text_Boy_PostWave:
	.string "The jungle is ALIVE now.\n"
	.string "Buzzing. Clicking. Roaring.\p"
	.string "I saw an enormous beetle\n"
	.string "the size of my arm fighting\l"
	.string "something with scythes for\l"
	.string "hands.\p"
	.string "HERACROSS versus SCYTHER.\n"
	.string "Right here. In HOENN.\p"
	.string "The rain does not stop them.\n"
	.string "If anything it makes them\l"
	.string "more aggressive.$"

Route119_EventScript_MigrationSrJune::
	trainerbattle_double TRAINER_JUNE_AND_VIC_1, Route119_Text_JuneIntro, Route119_Text_JuneDefeat, Route119_Text_JuneNotEnoughMons
	msgbox Route119_Text_MigrationSrJrPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_EventScript_MigrationJrVic::
	trainerbattle_double TRAINER_JUNE_AND_VIC_1, Route119_Text_VicIntro, Route119_Text_VicDefeat, Route119_Text_VicNotEnoughMons
	msgbox Route119_Text_MigrationSrJrPostBattle, MSGBOX_AUTOCLOSE
	end

Route119_Text_JuneIntro:
	.string "My grandson found this SNUBBULL\n"
	.string "in the tall grass.\p"
	.string "And I caught a HOUNDOUR near\n"
	.string "the Weather Institute! Battle us!$"

Route119_Text_JuneDefeat:
	.string "These foreign POKeMON have such\n"
	.string "spirit! No wonder they traveled\l"
	.string "so far to reach HOENN.$"

Route119_Text_JuneNotEnoughMons:
	.string "Come back with two POKeMON and\n"
	.string "we'll have a double battle!$"

Route119_Text_VicIntro:
	.string "Grandma said I could keep the\n"
	.string "SNUBBULL if I beat a trainer!\p"
	.string "Come on, let's double battle!$"

Route119_Text_VicDefeat:
	.string "That was fun! Grandma's HOUNDOUR\n"
	.string "is really strong, too!$"

Route119_Text_VicNotEnoughMons:
	.string "We need two against two!\n"
	.string "Bring another POKeMON!$"

Route119_Text_MigrationSrJrPostBattle:
	.string "A breeder told me these species\n"
	.string "are from distant regions. They're\l"
	.string "breeding well in HOENN's climate.$"

@ =============================================
@ Mid-Game Migration Sighting Event (C149)
@ Triggers once after Weather Institute cleared
@ =============================================

Route119_EventScript_MigrationSighting::
	goto_if_set FLAG_ROUTE119_MIGRATION_EVENT, Route119_EventScript_MigrationSighting_End
	lockall
	@ Intensify the storm
	setweather WEATHER_RAIN_THUNDERSTORM
	doweather
	delay 40
	@ Dr. Hartley rushes in from the south
	clearflag FLAG_HIDE_ROUTE119_HARTLEY_EVENT
	addobject LOCALID_ROUTE119_HARTLEY
	applymovement LOCALID_ROUTE119_HARTLEY, Route119_Movement_HartleyApproach
	waitmovement 0
	applymovement LOCALID_ROUTE119_HARTLEY, Common_Movement_FacePlayer
	waitmovement 0
	msgbox Route119_Text_HartleyStorm, MSGBOX_DEFAULT
	msgbox Route119_Text_HartleyMigration, MSGBOX_DEFAULT
	msgbox Route119_Text_HartleyConnected, MSGBOX_DEFAULT
	msgbox Route119_Text_HartleyReturn, MSGBOX_DEFAULT
	closemessage
	@ Hartley departs back south
	applymovement LOCALID_ROUTE119_HARTLEY, Route119_Movement_HartleyDepart
	waitmovement 0
	removeobject LOCALID_ROUTE119_HARTLEY
	setflag FLAG_HIDE_ROUTE119_HARTLEY_EVENT
	@ Restore normal cycling weather
	setweather WEATHER_ROUTE119_CYCLE
	doweather
	delay 20
	@ Mark event complete
	setflag FLAG_ROUTE119_MIGRATION_EVENT
	releaseall
	end

Route119_EventScript_MigrationSighting_End::
	end

Route119_Movement_HartleyApproach:
	walk_up
	walk_up
	walk_up
	step_end

Route119_Movement_HartleyDepart:
	walk_down
	walk_down
	walk_down
	step_end

Route119_Text_HartleyStorm:
	.string "Trainer! Stay where you are!\n"
	.string "This is no ordinary storm!$"

Route119_Text_HartleyMigration:
	.string "My instruments detected a massive\n"
	.string "barometric shift just now.\p"
	.string "The migration species use atmospheric\n"
	.string "corridors to travel - and ROUTE 119\p"
	.string "sits on one of the primary pathways.\p"
	.string "DRAGONAIR in the upper canopy...\n"
	.string "LAPRAS sighted in the river during\l"
	.string "storms like these... even the CASTFORM\l"
	.string "here are behaving erratically.$"

Route119_Text_HartleyConnected:
	.string "The rain isn't just weather - it's\n"
	.string "a highway for migrating POKéMON.\p"
	.string "The geothermal surges near LAVARIDGE,\n"
	.string "the deep-sea currents by SOOTOPOLIS,\p"
	.string "the atmospheric anomalies right here...\n"
	.string "It's all connected.\p"
	.string "Whatever force is reshaping HOENN's\n"
	.string "ecosystem, it's accelerating.$"

Route119_Text_HartleyReturn:
	.string "I need to recalibrate my equipment\n"
	.string "before this storm passes.\p"
	.string "Keep your eyes open out here,\n"
	.string "Trainer. The rain draws them in -\l"
	.string "and not all of them are gentle.$"

@ =============================================
@ Weather Omen NPC — Route 119 Ranger (C159)
@ Only visible after Badge 6 permanent thunderstorm
@ =============================================

Route119_EventScript_WeatherOmenRanger::
	lock
	faceplayer
	goto_if_set FLAG_QUEST_HARTLEY_SITE2, Route119_EventScript_OmenRangerChecked
	goto_if_set FLAG_QUEST_HARTLEY_STARTED, Route119_EventScript_OmenRangerQuest
	msgbox Route119_Text_OmenRanger, MSGBOX_DEFAULT
	release
	end

Route119_EventScript_OmenRangerQuest::
	msgbox Route119_Text_OmenRangerQuest, MSGBOX_DEFAULT
	setflag FLAG_QUEST_HARTLEY_SITE2
	release
	end

Route119_EventScript_OmenRangerChecked::
	msgbox Route119_Text_OmenRangerChecked, MSGBOX_DEFAULT
	release
	end

Route119_Text_OmenRanger:
	.string "The WEATHER INSTITUTE says these\n"
	.string "storms are unprecedented.\p"
	.string "The cycling rain was normal.\n"
	.string "This constant thunder is not.\p"
	.string "Nature itself feels restless.\n"
	.string "Even the TROPIUS won't fly.$"

Route119_Text_OmenRangerQuest:
	.string "Oh! You're from HARTLEY's team?\n"
	.string "Perfect timing!\p"
	.string "Listen -- hear that? That low\n"
	.string "hum under the rain? That's new.\p"
	.string "The permanent storms brought\n"
	.string "moisture we've never measured.\p"
	.string "New moss on every tree. Calls I\n"
	.string "can't identify in the canopy.\p"
	.string "Something moved into these woods.\n"
	.string "Not just bugs. Something warm-\l"
	.string "blooded, adapting to the wet.\p"
	.string "HARTLEY's going to love this\n"
	.string "data.$"

Route119_Text_OmenRangerChecked:
	.string "Still raining! The data keeps\n"
	.string "coming. HARTLEY will be thrilled.$"

Route119_EventScript_WeatherIntern::
	msgbox Route119_Text_WeatherIntern, MSGBOX_NPC
	end

Route119_Text_WeatherIntern:
	.string "Our instruments have been going haywire!\n"
	.string "Barometric pressure, wind speed,\l"
	.string "humidity - all off the charts.\p"
	.string "The senior researchers say they've\n"
	.string "never recorded storms like these.$"
