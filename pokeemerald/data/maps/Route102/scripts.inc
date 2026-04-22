Route102_MapScripts::
	.byte 0

Route102_EventScript_LittleBoy::
	msgbox Route102_Text_ImNotVeryTall, MSGBOX_NPC
	end

Route102_EventScript_RouteSignOldale::
	msgbox Route102_Text_RouteSignOldale, MSGBOX_SIGN
	end

Route102_EventScript_RouteSignPetalburg::
	msgbox Route102_Text_RouteSignPetalburg, MSGBOX_SIGN
	end

Route102_EventScript_Boy::
	msgbox Route102_Text_MigrationBugCatcher, MSGBOX_NPC
	end

Route102_EventScript_Calvin::
	trainerbattle_single TRAINER_CALVIN_1, Route102_Text_CalvinIntro, Route102_Text_CalvinDefeated, Route102_EventScript_CalvinRegisterMatchCallAfterBattle
	specialvar VAR_RESULT, ShouldTryRematchBattle
	goto_if_eq VAR_RESULT, TRUE, Route102_EventScript_CalvinRematch
	setvar VAR_0x8004, TRAINER_CALVIN_1
	specialvar VAR_RESULT, IsTrainerRegistered
	goto_if_eq VAR_RESULT, FALSE, Route102_EventScript_CalvinTryRegister
	msgbox Route102_Text_CalvinPostBattle, MSGBOX_DEFAULT
	release
	end

Route102_EventScript_CalvinRegisterMatchCallAfterBattle::
	special PlayerFaceTrainerAfterBattle
	waitmovement 0
	goto_if_set FLAG_HAS_MATCH_CALL, Route102_EventScript_CalvinRegisterMatchCall
	release
	end

Route102_EventScript_CalvinRegisterMatchCall::
	msgbox Route102_Text_CalvinRegisterShort, MSGBOX_DEFAULT
	register_matchcall TRAINER_CALVIN_1
	release
	end

Route102_EventScript_CalvinTryRegister::
	goto_if_set FLAG_HAS_MATCH_CALL, Route102_EventScript_CalvinRegister
	msgbox Route102_Text_CalvinPostBattle, MSGBOX_DEFAULT
	release
	end

Route102_EventScript_CalvinRegister::
	msgbox Route102_Text_CalvinRegister, MSGBOX_DEFAULT
	register_matchcall TRAINER_CALVIN_1
	release
	end

Route102_EventScript_CalvinRematch::
	trainerbattle_rematch TRAINER_CALVIN_1, Route102_Text_CalvinRematchIntro, Route102_Text_CalvinRematchDefeated
	msgbox Route102_Text_CalvinRematchPostBattle, MSGBOX_AUTOCLOSE
	end

Route102_EventScript_Rick::
	trainerbattle_single TRAINER_RICK, Route102_Text_RickIntro, Route102_Text_RickDefeated
	msgbox Route102_Text_RickPostBattle, MSGBOX_AUTOCLOSE
	end

Route102_EventScript_Tiana::
	trainerbattle_single TRAINER_TIANA, Route102_Text_TianaIntro, Route102_Text_TianaDefeated
	msgbox Route102_Text_TianaPostBattle, MSGBOX_AUTOCLOSE
	end

Route102_EventScript_Allen::
	trainerbattle_single TRAINER_ALLEN, Route102_Text_AllenIntro, Route102_Text_AllenDefeated
	msgbox Route102_Text_AllenPostBattle, MSGBOX_AUTOCLOSE
	end

Route102_EventScript_MigrationFisherman::
	msgbox Route102_Text_MigrationFisherman, MSGBOX_NPC
	end

Route102_Text_WatchMeCatchPokemon:
	.string "WALLY: {PLAYER}…\n"
	.string "POKéMON hide in tall grass like this,\l"
	.string "don't they?\p"
	.string "Please watch me and see if I can\n"
	.string "catch one properly.\p"
	.string "…Whoa!$"

Route102_Text_WallyIDidIt:
	.string "WALLY: I did it… It's my…\n"
	.string "My POKéMON!$"

Route102_Text_LetsGoBack:
	.string "{PLAYER}, thank you!\n"
	.string "Let's go back to the GYM!$"

Route102_Text_ImNotVeryTall:
	.string "I'm…not very tall, so I sink right\n"
	.string "into tall grass.\p"
	.string "The grass goes up my nose and…\n"
	.string "Fwafwafwafwafwa…\p"
	.string "Fwatchoo!$"

Route102_Text_MigrationBugCatcher:
	.string "Dude, have you SEEN what's on this\n"
	.string "route now? I came here for WURMPLE\l"
	.string "and found a BELDUM instead!\p"
	.string "A BELDUM! Just sitting in the tall\n"
	.string "grass! This is the coolest thing\l"
	.string "that's ever happened to me!$"

Route102_Text_CatchWholeBunchOfPokemon:
	.string "I'm going to catch a whole bunch of\n"
	.string "POKéMON!$"

Route102_Text_RouteSignOldale:
	.string "ROUTE 102\n"
	.string "{RIGHT_ARROW} OLDALE TOWN$"

Route102_Text_RouteSignPetalburg:
	.string "ROUTE 102\n"
	.string "{LEFT_ARROW} PETALBURG CITY$"

Route102_EventScript_MigrationGlimpse::
	lock
	goto_if_unset FLAG_ADVENTURE_STARTED, Route102_EventScript_MigrationGlimpse_End
	goto_if_set FLAG_MIGRATION_GLIMPSE_ROUTE102, Route102_EventScript_MigrationGlimpse_End
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	msgbox Route102_Text_MigrationGlimpse1, MSGBOX_DEFAULT
	delay 20
	msgbox Route102_Text_MigrationGlimpse2, MSGBOX_DEFAULT
	setflag FLAG_MIGRATION_GLIMPSE_ROUTE102
Route102_EventScript_MigrationGlimpse_End::
	release
	end

Route102_Text_MigrationGlimpse1:
	.string "A sharp, metallic clicking echoed\n"
	.string "from the grass ahead!\p"
	.string "Something small and steel-blue\n"
	.string "hovered just above the ground...$"

Route102_Text_MigrationGlimpse2:
	.string "It locked onto you with a single red\n"
	.string "eye, then shot away like a bullet.\p"
	.string "That was no ordinary Hoenn POKéMON.$"

Route102_Text_MigrationFisherman:
	.string "Careful near the shallows.\p"
	.string "The LOTAD in this pond have\n"
	.string "changed somehow.\p"
	.string "My line keeps getting shocked\n"
	.string "when I cast near 'em.\l"
	.string "Never had that problem before.$"
