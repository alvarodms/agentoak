Route121_MapScripts::
	.byte 0

Route121_EventScript_Woman::
	msgbox Route121_Text_AheadLoomsMtPyre, MSGBOX_NPC
	end

Route121_EventScript_MtPyrePierSign::
	msgbox Route121_Text_MtPyrePierSign, MSGBOX_SIGN
	end

Route121_EventScript_SafariZoneSign::
	msgbox Route121_Text_SafariZoneSign, MSGBOX_SIGN
	end

Route121_EventScript_AquaGruntsMoveOut::
	lockall
	playbgm MUS_ENCOUNTER_AQUA, FALSE
	applymovement LOCALID_ROUTE121_GRUNT_2, Common_Movement_WalkInPlaceRight
	waitmovement 0
	msgbox Route121_Text_OkayMoveOutToMtPyre, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_ROUTE121_GRUNT_1, Route121_Movement_Grunt1Exit
	applymovement LOCALID_ROUTE121_GRUNT_2, Route121_Movement_Grunt2Exit
	applymovement LOCALID_ROUTE121_GRUNT_3, Route121_Movement_Grunt3Exit
	waitmovement 0
	fadedefaultbgm
	removeobject LOCALID_ROUTE121_GRUNT_1
	removeobject LOCALID_ROUTE121_GRUNT_2
	removeobject LOCALID_ROUTE121_GRUNT_3
	setvar VAR_ROUTE121_STATE, 1
	releaseall
	end

Route121_Movement_Grunt1Exit:
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	step_end

Route121_Movement_Grunt2Exit:
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	step_end

Route121_Movement_Grunt3Exit:
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	walk_down
	step_end

Route121_EventScript_Vanessa::
	trainerbattle_single TRAINER_VANESSA, Route121_Text_VanessaIntro, Route121_Text_VanessaDefeat
	msgbox Route121_Text_VanessaPostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Walter::
	trainerbattle_single TRAINER_WALTER_1, Route121_Text_WalterIntro, Route121_Text_WalterDefeat, Route121_EventScript_RegisterWalter
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route121_EventScript_RematchWalter
	msgbox Route121_Text_WalterPostBattle, MSGBOX_DEFAULT
	release
	end

Route121_EventScript_RegisterWalter::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route121_Text_WalterRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_WALTER_1
	release
	end

Route121_EventScript_RematchWalter::
	trainerbattle_rematch TRAINER_WALTER_1, Route121_Text_WalterRematchIntro, Route121_Text_WalterRematchDefeat
	msgbox Route121_Text_WalterPostRematch, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Tammy::
	trainerbattle_single TRAINER_TAMMY, Route121_Text_TammyIntro, Route121_Text_TammyDefeat
	msgbox Route121_Text_TammyPostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Kate::
	trainerbattle_double TRAINER_KATE_AND_JOY, Route121_Text_KateIntro, Route121_Text_KateDefeat, Route121_Text_KateNotEnoughMons
	msgbox Route121_Text_KatePostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Joy::
	trainerbattle_double TRAINER_KATE_AND_JOY, Route121_Text_JoyIntro, Route121_Text_JoyDefeat, Route121_Text_JoyNotEnoughMons
	msgbox Route121_Text_JoyPostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Jessica::
	trainerbattle_single TRAINER_JESSICA_1, Route121_Text_JessicaIntro, Route121_Text_JessicaDefeat, Route121_EventScript_RegisterJessica
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route121_EventScript_RematchJessica
	msgbox Route121_Text_JessicaPostBattle, MSGBOX_DEFAULT
	release
	end

Route121_EventScript_RegisterJessica::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route121_Text_JessicaRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_JESSICA_1
	release
	end

Route121_EventScript_RematchJessica::
	trainerbattle_rematch TRAINER_JESSICA_1, Route121_Text_JessicaRematchIntro, Route121_Text_JessicaRematchDefeat
	msgbox Route121_Text_JessicaPostRematch, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Cale::
	trainerbattle_single TRAINER_CALE, Route121_Text_CaleIntro, Route121_Text_CaleDefeat
	msgbox Route121_Text_CalePostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Myles::
	trainerbattle_single TRAINER_MYLES, Route121_Text_MylesIntro, Route121_Text_MylesDefeat
	msgbox Route121_Text_MylesPostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Pat::
	trainerbattle_single TRAINER_PAT, Route121_Text_PatIntro, Route121_Text_PatDefeat
	msgbox Route121_Text_PatPostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Marcel::
	trainerbattle_single TRAINER_MARCEL, Route121_Text_MarcelIntro, Route121_Text_MarcelDefeat
	msgbox Route121_Text_MarcelPostBattle, MSGBOX_AUTOCLOSE
	end

Route121_EventScript_Cristin::
	trainerbattle_single TRAINER_CRISTIN_1, Route121_Text_CristinIntro, Route121_Text_CristinDefeat, Route121_EventScript_RegisterCristin
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route121_EventScript_RematchCristin
	msgbox Route121_Text_CristinPostBattle, MSGBOX_DEFAULT
	release
	end

Route121_EventScript_RegisterCristin::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	msgbox Route121_Text_CristinRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_CRISTIN_1
	release
	end

Route121_EventScript_RematchCristin::
	trainerbattle_rematch TRAINER_CRISTIN_1, Route121_Text_CristinRematchIntro, Route121_Text_CristinRematchDefeat
	msgbox Route121_Text_CristinPostRematch, MSGBOX_AUTOCLOSE
	end

Route121_Text_OkayMoveOutToMtPyre:
	.string "Okay!\n"
	.string "We're to move out to MT. PYRE!$"

Route121_Text_AheadLoomsMtPyre:
	.string "Ahead looms MT. PYRE…\p"
	.string "It is a natural monument to the spirits \n"
	.string "of departed POKéMON…$"

Route121_Text_MtPyrePierSign:
	.string "MT. PYRE PIER\p"
	.string "…The sign is old and worn out.\n"
	.string "The words are barely legible…$"


Route121_Text_SafariZoneSign:
	.string "“Filled with rare POKéMON!”\n"
	.string "SAFARI ZONE$"


Route121_EventScript_SecondWavePokefan::
	msgbox Route121_Text_SecondWavePokefan, MSGBOX_NPC
	end

Route121_Text_SecondWavePokefan:
	.string "Oh my! Have you seen the\n"
	.string "TAUROS herds on this route?\p"
	.string "They just appeared three\n"
	.string "days ago. A dozen of them\l"
	.string "charging through the grass.\p"
	.string "And MILTANK too! One nearly\n"
	.string "knocked me over!\p"
	.string "The SAFARI ZONE warden says\n"
	.string "they are migrants. He has\l"
	.string "never seen this many new\l"
	.string "species arrive so fast.$"

Route121_EventScript_BeastSighting::
	lock
	faceplayer
	special IsRoamerActive
	goto_if_eq VAR_RESULT, TRUE, Route121_EventScript_BeastSighting_Active
	goto_if_set FLAG_BEAST_RAIKOU_DONE, Route121_EventScript_BeastSighting_AllDone
	goto_if_set FLAG_BEAST_RAIKOU_KO, Route121_EventScript_BeastSighting_AllDone
	msgbox Route121_Text_BeastSighting_Default, MSGBOX_DEFAULT
	release
	end

Route121_EventScript_BeastSighting_AllDone::
	msgbox Route121_Text_BeastSighting_AllDone, MSGBOX_DEFAULT
	release
	end

Route121_EventScript_BeastSighting_Active::
	goto_if_set FLAG_BEAST_RAIKOU_DONE, Route121_EventScript_BeastSighting_NotRaikou
	goto_if_set FLAG_BEAST_RAIKOU_KO, Route121_EventScript_BeastSighting_NotRaikou
	msgbox Route121_Text_BeastSighting_Raikou, MSGBOX_DEFAULT
	release
	end

Route121_EventScript_BeastSighting_NotRaikou::
	goto_if_set FLAG_BEAST_ENTEI_DONE, Route121_EventScript_BeastSighting_Suicune
	goto_if_set FLAG_BEAST_ENTEI_KO, Route121_EventScript_BeastSighting_Suicune
	msgbox Route121_Text_BeastSighting_Entei, MSGBOX_DEFAULT
	release
	end

Route121_EventScript_BeastSighting_Suicune::
	msgbox Route121_Text_BeastSighting_Suicune, MSGBOX_DEFAULT
	release
	end

Route121_Text_BeastSighting_Default:
	.string "Just came from the SAFARI ZONE.\n"
	.string "The POKeMON there are as lively\l"
	.string "as ever.$"

Route121_Text_BeastSighting_Raikou:
	.string "Don't go near the tall grass\n"
	.string "at night!\p"
	.string "I saw something huge crackling\n"
	.string "with electricity bolt across\l"
	.string "the path.\p"
	.string "It was gone in a flash.\n"
	.string "Literally. Fastest thing\l"
	.string "I have ever seen.$"

Route121_Text_BeastSighting_Entei:
	.string "The ground was warm under my\n"
	.string "boots this morning. Not from\l"
	.string "the sun.\p"
	.string "Found scorched patches in the\n"
	.string "grass that were not there\l"
	.string "yesterday.\p"
	.string "Something big and burning\n"
	.string "passed through here.$"

Route121_Text_BeastSighting_Suicune:
	.string "The stream by the SAFARI ZONE\n"
	.string "is flowing cleaner than I have\l"
	.string "ever seen.\p"
	.string "A graceful creature was spotted\n"
	.string "at the water's edge at dawn.\p"
	.string "By the time anyone got close,\n"
	.string "it had vanished like morning\l"
	.string "mist.$"

Route121_Text_BeastSighting_AllDone:
	.string "Those legendary beasts shook up\n"
	.string "every trail in HOENN.\p"
	.string "The SAFARI ZONE POKeMON are\n"
	.string "still a bit restless from\l"
	.string "it all.$"
