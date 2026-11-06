FortreeCity_House3_MapScripts::
	.byte 0

FortreeCity_House3_EventScript_Maniac::
	msgbox FortreeCity_House3_Text_MetStevenHadAmazingPokemon, MSGBOX_NPC
	end

FortreeCity_House3_EventScript_SchoolKidM::
	lock
	faceplayer
	specialvar VAR_RESULT, CountInkedFieldNotePages
	goto_if_ge VAR_RESULT, 4, FortreeCity_House3_EventScript_SchoolKidMWallFull
	goto_if_ge VAR_RESULT, 1, FortreeCity_House3_EventScript_SchoolKidMWall
	msgbox FortreeCity_House3_Text_OhYouHavePokedex, MSGBOX_DEFAULT
	release
	end

@ C344: crayon wall. Drawn wrong on purpose. No flags, never red, never corrects anyone.
FortreeCity_House3_EventScript_SchoolKidMWall::
	msgbox FortreeCity_House3_Text_CrayonWall, MSGBOX_DEFAULT
	release
	end

FortreeCity_House3_EventScript_SchoolKidMWallFull::
	msgbox FortreeCity_House3_Text_CrayonWallFull, MSGBOX_DEFAULT
	release
	end

FortreeCity_House3_Text_MetStevenHadAmazingPokemon:
	.string "While speaking about POKéDEXES,\n"
	.string "I remembered something.\p"
	.string "I met this TRAINER, STEVEN, when\n"
	.string "I was searching for rare stones.\p"
	.string "Hoo, boy, he had some amazing POKéMON\n"
	.string "with him.\p"
	.string "They weren't just rare, they were\n"
	.string "trained to terrifying extremes!\p"
	.string "He might even be stronger than the\n"
	.string "GYM LEADER in this town…$"

FortreeCity_House3_Text_OhYouHavePokedex:
	.string "What's that thing you have there?\p"
	.string "… … … … … …\p"
	.string "Oh, it's called a POKéDEX?\n"
	.string "It's really awesome!\p"
	.string "I'm going to draw one on my wall.\n"
	.string "Mine's going to have wings!$"

FortreeCity_House3_Text_CrayonWall:
	.string "Oh! You've got a notebook too?\n"
	.string "Look, look! This wall is mine!\p"
	.string "That's a WAILORD that lives\n"
	.string "in a cloud. It rains when it naps.\p"
	.string "And that's a TORCHIC that's\n"
	.string "really a star. It only comes out\l"
	.string "at night!\p"
	.string "None of it's true. I made it all up!\n"
	.string "That's the best part!$"

FortreeCity_House3_Text_CrayonWallFull:
	.string "You're back! I drew more!\p"
	.string "That's a SKARMORY made of spoons.\n"
	.string "It clinks when it flies.\p"
	.string "And that's a SPINDA that got dizzy\n"
	.string "from looking at its own spots.\p"
	.string "A big kid told me a trainer\n"
	.string "writes the TRUE stuff in red ink.\p"
	.string "So I only draw the NOT true stuff.\n"
	.string "Somebody has to!$"
