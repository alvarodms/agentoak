SootopolisCity_Gym_1F_MapScripts::
	map_script MAP_SCRIPT_ON_FRAME_TABLE, SootopolisCity_Gym_1F_OnFrame
	map_script MAP_SCRIPT_ON_RESUME, SootopolisCity_Gym_1F_OnResume
	map_script MAP_SCRIPT_ON_LOAD, SootopolisCity_Gym_1F_OnLoad
	map_script MAP_SCRIPT_ON_TRANSITION, SootopolisCity_Gym_1F_OnTransition
	.byte 0

SootopolisCity_Gym_1F_OnTransition:
	setvar VAR_ICE_STEP_COUNT, 1
	end

SootopolisCity_Gym_1F_OnResume:
	setstepcallback STEP_CB_SOOTOPOLIS_ICE
	end

SootopolisCity_Gym_1F_OnLoad:
	call SootopolisCity_Gym_1F_EventScript_CheckSetStairMetatiles
	special SetSootopolisGymCrackedIceMetatiles
	end

SootopolisCity_Gym_1F_EventScript_CheckSetStairMetatiles::
	goto_if_lt VAR_ICE_STEP_COUNT, 8, SootopolisCity_Gym_1F_EventScript_StopCheckingStairs  @ All stairs ice
	goto_if_lt VAR_ICE_STEP_COUNT, 28, SootopolisCity_Gym_1F_EventScript_OpenFirstStairs
	goto_if_lt VAR_ICE_STEP_COUNT, 67, SootopolisCity_Gym_1F_EventScript_OpenFirstAndSecondStairs
	setmetatile 8, 4, METATILE_SootopolisGym_Stairs, FALSE
	setmetatile 8, 5, METATILE_SootopolisGym_Stairs, FALSE
SootopolisCity_Gym_1F_EventScript_OpenFirstAndSecondStairs::
	setmetatile 8, 10, METATILE_SootopolisGym_Stairs, FALSE
	setmetatile 8, 11, METATILE_SootopolisGym_Stairs, FALSE
SootopolisCity_Gym_1F_EventScript_OpenFirstStairs::
	setmetatile 8, 15, METATILE_SootopolisGym_Stairs, FALSE
	setmetatile 8, 16, METATILE_SootopolisGym_Stairs, FALSE
SootopolisCity_Gym_1F_EventScript_StopCheckingStairs::
	return

SootopolisCity_Gym_1F_OnFrame:
	map_script_2 VAR_ICE_STEP_COUNT, 8, SootopolisCity_Gym_1F_EventScript_UnlockFirstStairs
	map_script_2 VAR_ICE_STEP_COUNT, 28, SootopolisCity_Gym_1F_EventScript_UnlockSecondStairs
	map_script_2 VAR_ICE_STEP_COUNT, 67, SootopolisCity_Gym_1F_EventScript_UnlockThirdStairs
	map_script_2 VAR_ICE_STEP_COUNT, 0, SootopolisCity_Gym_1F_EventScript_FallThroughIce
	.2byte 0

SootopolisCity_Gym_1F_EventScript_UnlockFirstStairs::
	addvar VAR_ICE_STEP_COUNT, 1
	delay 40
	playse SE_ICE_STAIRS
	call SootopolisCity_Gym_1F_EventScript_CheckSetStairMetatiles
	special DrawWholeMapView
	end

SootopolisCity_Gym_1F_EventScript_UnlockSecondStairs::
	addvar VAR_ICE_STEP_COUNT, 1
	delay 40
	playse SE_ICE_STAIRS
	call SootopolisCity_Gym_1F_EventScript_CheckSetStairMetatiles
	special DrawWholeMapView
	end

SootopolisCity_Gym_1F_EventScript_UnlockThirdStairs::
	addvar VAR_ICE_STEP_COUNT, 1
	delay 40
	playse SE_ICE_STAIRS
	call SootopolisCity_Gym_1F_EventScript_CheckSetStairMetatiles
	special DrawWholeMapView
	end

SootopolisCity_Gym_1F_EventScript_FallThroughIce::
	lockall
	delay 20
	applymovement LOCALID_PLAYER, SootopolisCity_Gym_1F_Movement_FallThroughIce
	waitmovement 0
	playse SE_FALL
	delay 60
	warphole MAP_SOOTOPOLIS_CITY_GYM_B1F
	waitstate
	end

SootopolisCity_Gym_1F_Movement_FallThroughIce:
	set_invisible
	step_end

SootopolisCity_Gym_1F_EventScript_Juan::
	trainerbattle_single TRAINER_JUAN_1, SootopolisCity_Gym_1F_Text_JuanIntro, SootopolisCity_Gym_1F_Text_JuanDefeat, SootopolisCity_Gym_1F_EventScript_JuanDefeated, NO_MUSIC
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, SootopolisCity_Gym_1F_EventScript_JuanRematch
	goto_if_unset FLAG_RECEIVED_TM_WATER_PULSE, SootopolisCity_Gym_1F_EventScript_GiveWaterPulse2
	goto_if_unset FLAG_BADGE06_GET, SootopolisCity_Gym_1F_EventScript_GoGetFortreeBadge
	msgbox SootopolisCity_Gym_1F_Text_JuanPostBattle, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanDefeated::
	message SootopolisCity_Gym_1F_Text_ReceivedRainBadge
	waitmessage
	call Common_EventScript_PlayGymBadgeFanfare
	msgbox SootopolisCity_Gym_1F_Text_ExplainRainBadgeTakeThis, MSGBOX_DEFAULT
	setflag FLAG_DEFEATED_SOOTOPOLIS_GYM
	setflag FLAG_BADGE08_GET
	setflag FLAG_HIDE_SOOTOPOLIS_CITY_RESIDENTS
	setflag FLAG_HIDE_SOOTOPOLIS_CITY_STEVEN
	setflag FLAG_HIDE_SOOTOPOLIS_CITY_WALLACE
	setvar VAR_SOOTOPOLIS_CITY_STATE, 6
	clearflag FLAG_HIDE_SOOTOPOLIS_CITY_MAN_1
	setvar VAR_0x8008, 8
	call Common_EventScript_SetGymTrainers
	call SootopolisCity_Gym_1F_EventScript_GiveWaterPulse
	closemessage
	delay 30
	playfanfare MUS_REGISTER_MATCH_CALL
	msgbox SootopolisCity_Gym_1F_Text_RegisteredJuan, MSGBOX_DEFAULT
	waitfanfare
	closemessage
	delay 30
	setflag FLAG_ENABLE_JUAN_MATCH_CALL
	release
	end

SootopolisCity_Gym_1F_EventScript_GiveWaterPulse::
	giveitem ITEM_TM_WATER_PULSE
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_BagIsFull
	msgbox SootopolisCity_Gym_1F_Text_ExplainWaterPulse, MSGBOX_DEFAULT
	setflag FLAG_RECEIVED_TM_WATER_PULSE
	return

SootopolisCity_Gym_1F_EventScript_GiveWaterPulse2::
	giveitem ITEM_TM_WATER_PULSE
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	msgbox SootopolisCity_Gym_1F_Text_ExplainWaterPulse, MSGBOX_DEFAULT
	setflag FLAG_RECEIVED_TM_WATER_PULSE
	release
	end

SootopolisCity_Gym_1F_EventScript_GoGetFortreeBadge::
	msgbox SootopolisCity_Gym_1F_Text_GoGetFortreeBadge, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanRematch::
	trainerbattle_rematch_double TRAINER_JUAN_1, SootopolisCity_Gym_1F_Text_JuanPreRematch, SootopolisCity_Gym_1F_Text_JuanRematchDefeat, SootopolisCity_Gym_1F_Text_JuanRematchNeedTwoMons
	msgbox SootopolisCity_Gym_1F_Text_JuanPostRematch, MSGBOX_AUTOCLOSE
	end

SootopolisCity_Gym_1F_EventScript_GymGuide::
	lock
	faceplayer
	goto_if_set FLAG_DEFEATED_SOOTOPOLIS_GYM, SootopolisCity_Gym_1F_EventScript_GymGuidePostVictory
	msgbox SootopolisCity_Gym_1F_Text_GymGuideAdvice, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_EventScript_GymGuidePostVictory::
	msgbox SootopolisCity_Gym_1F_Text_GymGuidePostVictory, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanCameo::
	lock
	faceplayer
	goto_if_set FLAG_SYS_GAME_CLEAR, SootopolisCity_Gym_1F_EventScript_JuanDuet
	goto_if_set FLAG_BADGE08_GET, SootopolisCity_Gym_1F_EventScript_JuanCameoPostBadge
	msgbox SootopolisCity_Gym_1F_Text_JuanCameo, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanCameoPostBadge::
	msgbox SootopolisCity_Gym_1F_Text_JuanCameoPostBadge, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanDuet::
	goto_if_defeated TRAINER_JUAN_DUET, SootopolisCity_Gym_1F_EventScript_JuanDuetDone
	msgbox SootopolisCity_Gym_1F_Text_JuanDuetOffer, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, SootopolisCity_Gym_1F_EventScript_JuanDuetDecline
	applymovement VAR_LAST_TALKED, SootopolisCity_Gym_1F_Movement_JuanSpin
	waitmovement 0
	trainerbattle_double TRAINER_JUAN_DUET, SootopolisCity_Gym_1F_Text_JuanDuetIntro, SootopolisCity_Gym_1F_Text_JuanDuetDefeat, SootopolisCity_Gym_1F_Text_JuanDuetNeedTwoMons, SootopolisCity_Gym_1F_EventScript_JuanDuetDefeated
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanDuetDecline::
	msgbox SootopolisCity_Gym_1F_Text_JuanDuetDecline, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanDuetDefeated::
	msgbox SootopolisCity_Gym_1F_Text_JuanDuetGift, MSGBOX_DEFAULT
	giveitem ITEM_MYSTIC_WATER
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	setflag FLAG_RECEIVED_JUAN_MYSTIC_WATER
	closemessage
	applymovement 1, Common_Movement_FaceRight
	waitmovement 0
	msgbox SootopolisCity_Gym_1F_Text_WallaceToJuan, MSGBOX_DEFAULT
	closemessage
	applymovement 3, Common_Movement_FaceLeft
	waitmovement 0
	delay 30
	applymovement 3, Common_Movement_FaceDown
	applymovement 1, Common_Movement_FaceDown
	waitmovement 0
	release
	end

SootopolisCity_Gym_1F_EventScript_JuanDuetDone::
	goto_if_unset FLAG_RECEIVED_JUAN_MYSTIC_WATER, SootopolisCity_Gym_1F_EventScript_JuanDuetDefeated
	msgbox SootopolisCity_Gym_1F_Text_JuanDuetDone, MSGBOX_DEFAULT
	release
	end

SootopolisCity_Gym_1F_Movement_JuanSpin:
	face_left
	delay_8
	face_up
	delay_8
	face_right
	delay_8
	face_down
	delay_8
	face_player
	step_end

SootopolisCity_Gym_1F_EventScript_LeftGymStatue::
	lockall
	goto_if_set FLAG_BADGE08_GET, SootopolisCity_Gym_1F_EventScript_GymStatueCertified
	goto SootopolisCity_Gym_1F_EventScript_GymStatue
	end

SootopolisCity_Gym_1F_EventScript_RightGymStatue::
	lockall
	goto_if_set FLAG_BADGE08_GET, SootopolisCity_Gym_1F_EventScript_GymStatueCertified
	goto SootopolisCity_Gym_1F_EventScript_GymStatue
	end

SootopolisCity_Gym_1F_EventScript_GymStatueCertified::
	msgbox SootopolisCity_Gym_1F_Text_GymStatueCertified, MSGBOX_DEFAULT
	releaseall
	end

SootopolisCity_Gym_1F_EventScript_GymStatue::
	msgbox SootopolisCity_Gym_1F_Text_GymStatue, MSGBOX_DEFAULT
	releaseall
	end

SootopolisCity_Gym_1F_Text_GymGuideAdvice:
	.string "Yo! How's it going, CHAMPION-\n"
	.string "bound {PLAYER}?\p"
	.string "SOOTOPOLIS's GYM LEADER WALLACE is\n"
	.string "a master of WATER-type POKéMON.\p"
	.string "And, to get to WALLACE, an icy floor\n"
	.string "will hamper your progress…\p"
	.string "Listen, I'm sorry, but that's all the\n"
	.string "advice that I have for you.\p"
	.string "The rest of the way, you have to\n"
	.string "go for it yourself!$"

SootopolisCity_Gym_1F_Text_GymGuidePostVictory:
	.string "Yow! You've beaten WALLACE, who\n"
	.string "once sat at the very top of HOENN!\p"
	.string "Okay! Check out your TRAINER CARD.\p"
	.string "If you've gotten all the BADGES, you're\n"
	.string "set for the POKéMON LEAGUE challenge!$"

SootopolisCity_Gym_1F_Text_JuanIntro:
	.string "WALLACE: Welcome, {PLAYER}{KUN}.\p"
	.string "I once looked down on HOENN from\n"
	.string "the LEAGUE's summit.\p"
	.string "From up there, every change in\n"
	.string "the water seemed small.\p"
	.string "Down here, I watched my own city\n"
	.string "change beneath my feet.\p"
	.string "Even the water's children have\n"
	.string "changed. I've learned to love\l"
	.string "them as they are.\p"
	.string "Now… Let me show you the beauty\n"
	.string "of SOOTOPOLIS's water, renewed!$"

SootopolisCity_Gym_1F_Text_JuanDefeat:
	.string "Bravo! Your POKéMON moved like\n"
	.string "water shaped by your will.$"

SootopolisCity_Gym_1F_Text_ReceivedRainBadge:
	.string "{PLAYER} received the RAIN BADGE\n"
	.string "from WALLACE.$"

SootopolisCity_Gym_1F_Text_ExplainRainBadgeTakeThis:
	.string "Having the RAIN BADGE shall assure you\n"
	.string "the full obedience of all your POKéMON\l"
	.string "to your every command.\p"
	.string "The RAIN BADGE also allows the use\n"
	.string "of the HM move WATERFALL to scale\l"
	.string "walls of cascading water.\p"
	.string "And, so that you never forget the\n"
	.string "battle we shared, take this…$"

SootopolisCity_Gym_1F_Text_ExplainWaterPulse:
	.string "The TECHNICAL MACHINE I handed you\n"
	.string "contains WATER PULSE.\p"
	.string "In use, it will occasionally confuse\n"
	.string "the target with ultrasonic waves.\p"
	.string "… … … … … …$"

SootopolisCity_Gym_1F_Text_RegisteredJuan:
	.string "Registered GYM LEADER WALLACE\n"
	.string "in the POKéNAV.$"

SootopolisCity_Gym_1F_Text_JuanPostBattle:
	.string "The TRAINERS who have gathered all\n"
	.string "the GYM BADGES of HOENN should make\l"
	.string "way to the POKéMON LEAGUE.\p"
	.string "Travel east, to the island of\n"
	.string "EVER GRANDE.\p"
	.string "The one who waits at the summit\n"
	.string "has seen more of this new HOENN\l"
	.string "than I ever will.\p"
	.string "Show him what you've seen.$"

SootopolisCity_Gym_1F_Text_GoGetFortreeBadge:
	.string "There remains but one BADGE to\n"
	.string "obtain in HOENN.\p"
	.string "If you wish to challenge the POKéMON\n"
	.string "LEAGUE, you must obtain the last\l"
	.string "BADGE from the GYM in FORTREE.$"

SootopolisCity_Gym_1F_Text_GymStatue:
	.string "SOOTOPOLIS CITY POKéMON GYM$"

SootopolisCity_Gym_1F_Text_GymStatueCertified:
	.string "SOOTOPOLIS CITY POKéMON GYM\p"
	.string "WALLACE'S CERTIFIED TRAINERS:\n"
	.string "{PLAYER}$"

SootopolisCity_Gym_1F_Text_JuanPreRematch:
	.string "WALLACE: Ah, {PLAYER}{KUN}!\n"
	.string "The water keeps changing.\p"
	.string "My partners have grown with it.\p"
	.string "Shall we show each other what\n"
	.string "the tides have brought?$"

SootopolisCity_Gym_1F_Text_JuanRematchDefeat:
	.string "WALLACE: Splendid. You still read\n"
	.string "the current better than I do.$"

SootopolisCity_Gym_1F_Text_JuanPostRematch:
	.string "WALLACE: JUAN saw the migration as\n"
	.string "a tide. I see it as art.\p"
	.string "It reshapes the shore, and we\n"
	.string "learn to move with it.\p"
	.string "Come back when the current\n"
	.string "shifts again.$"

SootopolisCity_Gym_1F_Text_JuanRematchNeedTwoMons:
	.string "WALLACE: Ah, {PLAYER}{KUN}…\n"
	.string "Please return with at least two\n"
	.string "POKéMON for our grand exhibition.$"

SootopolisCity_Gym_1F_Text_JuanCameo:
	.string "JUAN: Fufu… An audience!\p"
	.string "I kept this GYM while my student\n"
	.string "wandered the LEAGUE's high halls.\p"
	.string "Now WALLACE has come home, and\n"
	.string "the stage is his once more.\p"
	.string "Go on. Show him your elegance.$"

SootopolisCity_Gym_1F_Text_JuanCameoPostBadge:
	.string "JUAN: My student took back the\n"
	.string "GYM. Good.\p"
	.string "An old man should spend his last\n"
	.string "seasons listening to the water.\p"
	.string "The sea gives, and we learn.$"

SootopolisCity_Gym_1F_Text_JuanDuetOffer:
	.string "JUAN: My KINGDRA swims for\n"
	.string "WALLACE now. Good.\p"
	.string "A teacher should be outgrown.\p"
	.string "But a dance needs two.\n"
	.string "Will you keep time with me?$"

SootopolisCity_Gym_1F_Text_JuanDuetDecline:
	.string "JUAN: Fufu… The music will wait.$"

SootopolisCity_Gym_1F_Text_JuanDuetIntro:
	.string "JUAN: Two by two, then.\n"
	.string "Watch my partners, not my face!$"

SootopolisCity_Gym_1F_Text_JuanDuetDefeat:
	.string "JUAN: Bravo… You kept time\n"
	.string "better than I did.$"

SootopolisCity_Gym_1F_Text_JuanDuetNeedTwoMons:
	.string "JUAN: A duet needs two dancers.\n"
	.string "Return with two POKéMON.$"

SootopolisCity_Gym_1F_Text_JuanDuetGift:
	.string "JUAN: Take this.\n"
	.string "The rhythm, bottled.$"

SootopolisCity_Gym_1F_Text_WallaceToJuan:
	.string "WALLACE: You still lead,\n"
	.string "you know.$"

SootopolisCity_Gym_1F_Text_JuanDuetDone:
	.string "JUAN: Fufu… Some steps are\n"
	.string "only danced once.$"
