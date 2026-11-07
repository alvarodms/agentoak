GraniteCave_B1F_MapScripts::
	map_script MAP_SCRIPT_ON_FRAME_TABLE, CaveHole_CheckFallDownHole
	map_script MAP_SCRIPT_ON_TRANSITION, GraniteCave_B1F_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, GraniteCave_B1F_SetHoleWarp
	.byte 0

@ C329 Red Ink page 3: the hiker keeps his back to the deep ladder while he trusts BIRCH's page;
@ once GLIGAR_HOENN is caught he faces down toward it.
@ C348 v3.1 Beat A: after the credits he takes the red ink at its word and leaves for ROUTE 106's
@ tide line. B1F stays bare: nothing replaces him.
GraniteCave_B1F_OnTransition:
	call GraniteCave_B1F_EventScript_SetupHikerLeft
	EventMacro_DexBelieverPlace SPECIES_GLIGAR_HOENN, LOCALID_GRANITE_CAVE_B1F_HIKER, 26, 20, MOVEMENT_TYPE_FACE_DOWN
	goto CaveHole_FixCrackedGround

@ Global (::) so check_playtest R5 can find the label.
GraniteCave_B1F_EventScript_SetupHikerLeft::
	clearflag FLAG_HIDE_GRANITE_CAVE_B1F_HIKER
	goto_if_unset FLAG_SYS_GAME_CLEAR, GraniteCave_B1F_EventScript_SetupHikerLeftEnd
	setvar VAR_0x8004, SPECIES_GLIGAR_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_ne VAR_RESULT, TRUE, GraniteCave_B1F_EventScript_SetupHikerLeftEnd
	setflag FLAG_HIDE_GRANITE_CAVE_B1F_HIKER
GraniteCave_B1F_EventScript_SetupHikerLeftEnd:
	return

GraniteCave_B1F_SetHoleWarp:
	setstepcallback STEP_CB_CRACKED_FLOOR
	setholewarp MAP_GRANITE_CAVE_B2F
	end

GraniteCave_B1F_EventScript_CaveHiker::
	lock
	setvar VAR_0x8004, SPECIES_GLIGAR_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_eq VAR_RESULT, TRUE, GraniteCave_B1F_EventScript_HikerShown
	msgbox GraniteCave_B1F_Text_HikerRefuse, MSGBOX_DEFAULT
	call GraniteCave_B1F_EventScript_HikerMock
	release
	end

GraniteCave_B1F_EventScript_HikerMock::
	setvar VAR_0x8004, SPECIES_LOTAD_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	call_if_eq VAR_RESULT, TRUE, GraniteCave_B1F_EventScript_HikerMockSchoolkid
	setvar VAR_0x8004, SPECIES_SHROOMISH_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	call_if_eq VAR_RESULT, TRUE, GraniteCave_B1F_EventScript_HikerMockForager
	return

GraniteCave_B1F_EventScript_HikerMockSchoolkid::
	msgbox GraniteCave_B1F_Text_HikerMockSchoolkid, MSGBOX_DEFAULT
	return

GraniteCave_B1F_EventScript_HikerMockForager::
	msgbox GraniteCave_B1F_Text_HikerMockForager, MSGBOX_DEFAULT
	return

GraniteCave_B1F_EventScript_HikerShown::
	faceplayer
	goto_if_set FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE, GraniteCave_B1F_EventScript_HikerCorrected
	msgbox GraniteCave_B1F_Text_HikerReadsDex, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_GRANITE_CAVE_B1F_HIKER, Common_Movement_FaceAwayPlayer
	waitmovement 0
	msgbox GraniteCave_B1F_Text_HikerSilence, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_GRANITE_CAVE_B1F_HIKER, Common_Movement_FacePlayer
	waitmovement 0
	msgbox GraniteCave_B1F_Text_HikerRelents, MSGBOX_DEFAULT
	giveitem ITEM_HARD_STONE
	goto_if_eq VAR_RESULT, FALSE, Common_EventScript_ShowBagIsFull
	setflag FLAG_RECEIVED_GRANITE_HIKER_HARD_STONE
	msgbox GraniteCave_B1F_Text_HikerDontTell, MSGBOX_DEFAULT
	call GraniteCave_B1F_EventScript_HikerTryThreePages
	release
	end

GraniteCave_B1F_EventScript_HikerCorrected::
	msgbox GraniteCave_B1F_Text_HikerCorrected, MSGBOX_DEFAULT
	call GraniteCave_B1F_EventScript_HikerTryThreePages
	release
	end

GraniteCave_B1F_EventScript_HikerTryThreePages::
	setvar VAR_0x8004, SPECIES_LOTAD_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_ne VAR_RESULT, TRUE, GraniteCave_B1F_EventScript_HikerTryThreePagesEnd
	setvar VAR_0x8004, SPECIES_SHROOMISH_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexCaught
	goto_if_ne VAR_RESULT, TRUE, GraniteCave_B1F_EventScript_HikerTryThreePagesEnd
	msgbox GraniteCave_B1F_Text_HikerThreePages, MSGBOX_DEFAULT
GraniteCave_B1F_EventScript_HikerTryThreePagesEnd::
	return

GraniteCave_B1F_Text_HikerRefuse:
	.string "Not now. I don't take advice\n"
	.string "from kids with wet boots.\p"
	.string "PROF. BIRCH wrote it down.\n"
	.string "GLIGAR glide on dry wind.\p"
	.string "Water is their ENEMY.\n"
	.string "You'll find none down there.$"

GraniteCave_B1F_Text_HikerMockSchoolkid:
	.string "Heard some kid on ROUTE 104\n"
	.string "quit reading BIRCH's notes.\p"
	.string "Soft.$"

GraniteCave_B1F_Text_HikerMockForager:
	.string "Heard the woods lady moved\n"
	.string "into the cold patch.\p"
	.string "Soft, the lot of them.$"

GraniteCave_B1F_Text_HikerReadsDex:
	.string "…Your POKéDEX. Hold it up.\p"
	.string "A GLIGAR out of B2F, it says.\n"
	.string "Water and Rock.\p"
	.string "BIRCH wrote it down. Water\n"
	.string "is their ENEMY.$"

GraniteCave_B1F_Text_HikerSilence:
	.string "……$"

GraniteCave_B1F_Text_HikerRelents:
	.string "…It swam. Didn't it.\p"
	.string "That clicking I kept hearing\n"
	.string "down there. That was them.\p"
	.string "Here. Took this off the B2F\n"
	.string "wall. I'm done with it.$"

GraniteCave_B1F_Text_HikerDontTell:
	.string "Don't go telling DEWFORD.$"

GraniteCave_B1F_Text_HikerCorrected:
	.string "I face the deep now.\n"
	.string "Listening for the clicking.\p"
	.string "Don't go telling DEWFORD.$"

GraniteCave_B1F_Text_HikerThreePages:
	.string "Kid on ROUTE 104. Lady in the\n"
	.string "woods. Now me.\p"
	.string "Somebody ought to tell BIRCH.$"
