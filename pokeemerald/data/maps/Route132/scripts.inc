Route132_MapScripts::
	.byte 0

Route132_EventScript_Gilbert::
	trainerbattle_single TRAINER_GILBERT, Route132_Text_GilbertIntro, Route132_Text_GilbertDefeat
	msgbox Route132_Text_GilbertPostBattle, MSGBOX_AUTOCLOSE
	end

Route132_EventScript_Dana::
	trainerbattle_single TRAINER_DANA, Route132_Text_DanaIntro, Route132_Text_DanaDefeat
	msgbox Route132_Text_DanaPostBattle, MSGBOX_AUTOCLOSE
	end

Route132_EventScript_Ronald::
	trainerbattle_single TRAINER_RONALD, Route132_Text_RonaldIntro, Route132_Text_RonaldDefeat
	msgbox Route132_Text_RonaldPostBattle, MSGBOX_AUTOCLOSE
	end

Route132_EventScript_Kiyo::
	trainerbattle_single TRAINER_KIYO, Route132_Text_KiyoIntro, Route132_Text_KiyoDefeat
	msgbox Route132_Text_KiyoPostBattle, MSGBOX_AUTOCLOSE
	end

Route132_EventScript_Paxton::
	trainerbattle_single TRAINER_PAXTON, Route132_Text_PaxtonIntro, Route132_Text_PaxtonDefeat
	msgbox Route132_Text_PaxtonPostBattle, MSGBOX_AUTOCLOSE
	end

Route132_EventScript_Darcy::
	trainerbattle_single TRAINER_DARCY, Route132_Text_DarcyIntro, Route132_Text_DarcyDefeat
	msgbox Route132_Text_DarcyPostBattle, MSGBOX_AUTOCLOSE
	end

Route132_EventScript_Jonathan::
	trainerbattle_single TRAINER_JONATHAN, Route132_Text_JonathanIntro, Route132_Text_JonathanDefeat
	msgbox Route132_Text_JonathanPostBattle, MSGBOX_AUTOCLOSE
	end

Route132_EventScript_Makayla::
	trainerbattle_single TRAINER_MAKAYLA, Route132_Text_MakaylaIntro, Route132_Text_MakaylaDefeat
	msgbox Route132_Text_MakaylaPostBattle, MSGBOX_AUTOCLOSE
	end

@ =============================================
@ v1.8 Quest 1: The Elder's Current - Dive Spot
@ =============================================

Route132_EventScript_DiveSpotTrigger::
	lock
	goto_if_set FLAG_QUEST_ELDER_INVESTIGATED, Route132_EventScript_DiveSpotDone
	goto_if_set FLAG_QUEST_ELDER_STARTED, Route132_EventScript_DiveSequence
	release
	end

Route132_EventScript_DiveSpotDone::
	setvar VAR_TEMP_1, 1
	release
	end

Route132_EventScript_DiveSequence::
	playbgm MUS_ABNORMAL_WEATHER, TRUE
	msgbox Route132_Text_DiveSpot_Beat1, MSGBOX_DEFAULT
	msgbox Route132_Text_DiveSpot_Beat2, MSGBOX_DEFAULT
	msgbox Route132_Text_DiveSpot_Beat3, MSGBOX_DEFAULT
	fadedefaultbgm
	setflag FLAG_QUEST_ELDER_INVESTIGATED
	setvar VAR_TEMP_1, 1
	release
	end

Route132_Text_DiveSpot_Beat1:
	.string "The water here feels strange...\n"
	.string "unnervingly warm, like a bath\l"
	.string "that no one drew.\p"
	.string "Beneath the surface, the current\n"
	.string "pulls downward. Steady.\l"
	.string "Patient. As if the ocean\l"
	.string "itself is breathing in.$"

Route132_Text_DiveSpot_Beat2:
	.string "The coral below has gone pale.\n"
	.string "Not bleached -- petrified.\p"
	.string "Great branches frozen mid-sway,\n"
	.string "turned to stone by heat\l"
	.string "rising from the seafloor.\p"
	.string "Thermal vents shimmer between\n"
	.string "the fossilized reef. The coral\l"
	.string "didn't die. It turned to stone\l"
	.string "in place, still standing.$"

Route132_Text_DiveSpot_Beat3:
	.string "Something shifts among the\n"
	.string "stone coral.\p"
	.string "A shape that shouldn't be able\n"
	.string "to move... does. Slowly.\l"
	.string "Deliberately.\p"
	.string "As if it has been waiting for\n"
	.string "someone to notice.\p"
	.string "The reversed currents make\n"
	.string "sense now. The sea isn't pulling\l"
	.string "toward nothing -- it's circling\l"
	.string "something that's still alive.$"

