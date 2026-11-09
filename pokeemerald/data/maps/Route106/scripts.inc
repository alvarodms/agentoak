Route106_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, Route106_OnTransition
	.byte 0

@ C348 v3.1 Beat A: after the credits, once GLIGAR_HOENN is caught, the Granite Cave hiker stands
@ on the sand by the cave walk (54,15 since C354: one row above the path, out of ELLIOT's and NED's sight),
@ back from the tide line, his back to the land, facing a sea the player can't see from beside him.
@ He waits for GLIGAR to come in from the sea "because it's in red". He never turns; nothing ever comes.
@ Global (::) so check_playtest R5 can find the label.
Route106_OnTransition::
	setflag FLAG_HIDE_ROUTE106_TIDE_HIKER
	goto_if_unset FLAG_SYS_GAME_CLEAR, Route106_EventScript_SetupTideHikerEnd
	setvar VAR_0x8004, SPECIES_GLIGAR_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_ne VAR_RESULT, TRUE, Route106_EventScript_SetupTideHikerEnd
	clearflag FLAG_HIDE_ROUTE106_TIDE_HIKER
Route106_EventScript_SetupTideHikerEnd:
	end

@ No faceplayer: he says it to the sea. The same line in every state (no FLAG_LILYCOVE_GLIGAR_DOUBT
@ variant: the world doesn't know about the doubt). HARD_STONE handoff keeps the C329 reward if it was missed.
Route106_EventScript_TideHiker::
	lock
	msgbox Route106_Text_TideHiker, MSGBOX_DEFAULT
	goto_if_set FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE, Route106_EventScript_TideHikerEnd
	giveitem ITEM_HARD_STONE
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	setflag FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE
Route106_EventScript_TideHikerEnd::
	release
	end

Route106_EventScript_TrainerTipsSign::
	msgbox Route106_Text_TrainerTips, MSGBOX_SIGN
	end

Route106_EventScript_Douglas::
	trainerbattle_single TRAINER_DOUGLAS, Route106_Text_DouglasIntro, Route106_Text_DouglasDefeated
	msgbox Route106_Text_DouglasPostBattle, MSGBOX_AUTOCLOSE
	end

Route106_EventScript_Kyla::
	trainerbattle_single TRAINER_KYLA, Route106_Text_KylaIntro, Route106_Text_KylaDefeated
	msgbox Route106_Text_KylaPostBattle, MSGBOX_AUTOCLOSE
	end

Route106_EventScript_Elliot::
	trainerbattle_single TRAINER_ELLIOT_1, Route106_Text_ElliotIntro, Route106_Text_ElliotDefeated, Route106_EventScript_ElliotRegisterMatchCallAfterBattle
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route106_EventScript_ElliotRematch
	msgbox Route106_Text_ElliotPostBattle, MSGBOX_DEFAULT
	release
	end

Route106_EventScript_ElliotRegisterMatchCallAfterBattle::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route106_Text_ElliotRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_ELLIOT_1
	release
	end

Route106_EventScript_ElliotRematch::
	trainerbattle_rematch TRAINER_ELLIOT_1, Route106_Text_ElliotRematchIntro, Route106_Text_ElliotRematchDefeated
	msgbox Route106_Text_ElliotRematchPostBattle, MSGBOX_AUTOCLOSE
	end

Route106_EventScript_Ned::
	trainerbattle_single TRAINER_NED, Route106_Text_NedIntro, Route106_Text_NedDefeated
	msgbox Route106_Text_NedPostBattle, MSGBOX_AUTOCLOSE
	end

Route106_Text_TrainerTips:
	.string "TRAINER TIPS\p"
	.string "Advice on catching POKéMON with a ROD:\n"
	.string "Press the A Button if you get a bite.$"

Route106_Text_TideHiker:
	.string "It's in red. They swim better\n"
	.string "than they glide. They'll come.$"

