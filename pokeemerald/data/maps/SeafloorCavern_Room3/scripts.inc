SeafloorCavern_Room3_MapScripts::
	.byte 0

SeafloorCavern_Room3_EventScript_Shelly::
	trainerbattle_single TRAINER_SHELLY_SEAFLOOR_CAVERN, SeafloorCavern_Room3_Text_ShellyIntro, SeafloorCavern_Room3_Text_ShellyDefeat
	msgbox SeafloorCavern_Room3_Text_ShellyPostBattle, MSGBOX_AUTOCLOSE
	end

SeafloorCavern_Room3_EventScript_Grunt5::
	trainerbattle_single TRAINER_GRUNT_SEAFLOOR_CAVERN_5, SeafloorCavern_Room3_Text_Grunt5Intro, SeafloorCavern_Room3_Text_Grunt5Defeat
	msgbox SeafloorCavern_Room3_Text_Grunt5PostBattle, MSGBOX_AUTOCLOSE
	end

SeafloorCavern_Room3_Text_ShellyIntro:
	.string "Ahahahaha!\p"
	.string "All the way down here.\n"
	.string "Without a submarine, even.\p"
	.string "…You've seen what's happening,\n"
	.string "haven't you?\l"
	.string "The new species. The changes.\p"
	.string "I've been watching too.\p"
	.string "But we can discuss that\n"
	.string "after I've tested you.$"

SeafloorCavern_Room3_Text_ShellyDefeat:
	.string "Ahaha…\p"
	.string "…Yes.\n"
	.string "I thought so.$"

SeafloorCavern_Room3_Text_ShellyPostBattle:
	.string "You know what I've noticed?\n"
	.string "The sea is changing.\p"
	.string "New species. New patterns.\l"
	.string "Things we never planned for.\p"
	.string "We wanted to expand the ocean.\n"
	.string "But the ocean…\p"
	.string "…It didn't need us for that.\p"
	.string "Keep going.\n"
	.string "You'll see what I mean.$"

SeafloorCavern_Room3_Text_Grunt5Intro:
	.string "For our dream to become real, we need\n"
	.string "the power of POKéMON.\p"
	.string "But meddlers like you use the power of\n"
	.string "POKéMON to mess with us even at\l"
	.string "a place like this!\p"
	.string "Life just doesn't work the way we\n"
	.string "need it to!$"

SeafloorCavern_Room3_Text_Grunt5Defeat:
	.string "Gwah!$"

SeafloorCavern_Room3_Text_Grunt5PostBattle:
	.string "You know, we don't dare question\n"
	.string "the motives of our leader.\p"
	.string "But here you are, just some punk,\n"
	.string "going up against our BOSS.\p"
	.string "Maybe…\n"
	.string "You must be something…$"

