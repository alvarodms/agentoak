MeteorFalls_StevensCave_MapScripts::
	.byte 0

MeteorFalls_StevensCave_EventScript_Steven::
	lock
	goto_if_set FLAG_DEFEATED_METEOR_FALLS_STEVEN, MeteorFalls_StevensCave_EventScript_StevenGone
	msgbox MeteorFalls_StevensCave_Text_WallMusing, MSGBOX_DEFAULT
	waitse
	playse SE_PIN
	applymovement LOCALID_METEOR_FALLS_STEVEN, Common_Movement_ExclamationMark
	waitmovement 0
	applymovement LOCALID_METEOR_FALLS_STEVEN, Common_Movement_Delay48
	waitmovement 0
	applymovement LOCALID_METEOR_FALLS_STEVEN, Common_Movement_FacePlayer
	waitmovement 0
	goto_if_set FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO, MeteorFalls_StevensCave_EventScript_TreeckoFound
	msgbox MeteorFalls_StevensCave_Text_TreeckoWaiting, MSGBOX_DEFAULT
	goto MeteorFalls_StevensCave_EventScript_Battle
	end

MeteorFalls_StevensCave_EventScript_TreeckoFound::
	msgbox MeteorFalls_StevensCave_Text_TreeckoFound, MSGBOX_DEFAULT
	goto MeteorFalls_StevensCave_EventScript_Battle
	end

MeteorFalls_StevensCave_EventScript_Battle::
	msgbox MeteorFalls_StevensCave_Text_PreBattle, MSGBOX_DEFAULT
	trainerbattle_no_intro TRAINER_STEVEN, MeteorFalls_StevensCave_Text_Defeat
	msgbox MeteorFalls_StevensCave_Text_PostBattle, MSGBOX_DEFAULT
	setflag FLAG_DEFEATED_METEOR_FALLS_STEVEN
	fadescreen FADE_TO_BLACK
	removeobject LOCALID_METEOR_FALLS_STEVEN
	fadescreen FADE_FROM_BLACK
	release
	end

MeteorFalls_StevensCave_EventScript_StevenGone::
	release
	end

MeteorFalls_StevensCave_EventScript_ChalkNote::
	lockall
	goto_if_unset FLAG_DEFEATED_METEOR_FALLS_STEVEN, MeteorFalls_StevensCave_EventScript_ChalkNoteNone
	msgbox MeteorFalls_StevensCave_Text_ChalkNote, MSGBOX_DEFAULT
	releaseall
	end

MeteorFalls_StevensCave_EventScript_ChalkNoteNone::
	releaseall
	end

MeteorFalls_StevensCave_Text_WallMusing:
	.string "STEVEN: …This wall was dry the\n"
	.string "first time I came here.\p"
	.string "Now it weeps a little every night.\n"
	.string "Even stone keeps moving.$"

MeteorFalls_StevensCave_Text_TreeckoFound:
	.string "{PLAYER}{KUN}. So you found the\n"
	.string "crystal TREECKO.\p"
	.string "I only wrote it down.\n"
	.string "You were the one who found it.\p"
	.string "I'm glad it was you.$"

MeteorFalls_StevensCave_Text_TreeckoWaiting:
	.string "{PLAYER}{KUN}. It's still down there,\n"
	.string "isn't it? Under my chalk note.\p"
	.string "Good. Some things should wait\n"
	.string "for the right person.$"

MeteorFalls_StevensCave_Text_PreBattle:
	.string "I won't explain these two.\n"
	.string "You'll understand them faster\l"
	.string "in battle.\p"
	.string "They didn't want to be collected.\n"
	.string "They wanted to be carried.$"

MeteorFalls_StevensCave_Text_Defeat:
	.string "So that's what it looks like\n"
	.string "from the other side.$"

MeteorFalls_StevensCave_Text_PostBattle:
	.string "STEVEN: You don't battle like a\n"
	.string "collector. You battle like\l"
	.string "someone who listens.\p"
	.string "If you want to meet their kind,\n"
	.string "read the old braille in the\l"
	.string "ruins under ROUTE 134.\p"
	.string "It asks for two old swimmers.$"

MeteorFalls_StevensCave_Text_ChalkNote:
	.string "Fresh chalk on the cave wall.\p"
	.string "Some things should be found.\n"
	.string "Some should be carried.\p"
	.string "- S.$"
