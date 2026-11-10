MeteorFalls_B1F_2R_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, MeteorFalls_B1F_2R_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, MeteorFalls_B1F_2R_OnResume
	.byte 0

MeteorFalls_B1F_2R_OnTransition:
	call_if_set FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO, MeteorFalls_B1F_2R_EventScript_NewChalk
	EventMacro_StaticDenTransition FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO, FLAG_TEMP_11
	end

@ C336: Steven came by while you were away. The catch visit's OnTransition ran before the catch,
@ so the answer can only appear on a later map load.
MeteorFalls_B1F_2R_EventScript_NewChalk::
	setflag FLAG_TEMP_13
	return

MeteorFalls_B1F_2R_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, MeteorFalls_B1F_2R_EventScript_TryRemoveCrystalTreecko
	end

MeteorFalls_B1F_2R_EventScript_TryRemoveCrystalTreecko::
	EventMacro_StaticDenTryRemove

@ =============================================
@ Quest 6: The Resonance — Meteorite Investigation (C233)
@ =============================================

MeteorFalls_B1F_2R_EventScript_ResonanceMeteor::
	lock
	goto_if_set FLAG_QUEST_COSMIC_COMPLETE, MeteorFalls_B1F_2R_EventScript_CosmicAftermath
	goto_if_set FLAG_QUEST_RESONANCE_COMPLETE, MeteorFalls_B1F_2R_EventScript_ResonanceMeteorResidue
	goto_if_set FLAG_QUEST_RESONANCE_METEOR, MeteorFalls_B1F_2R_EventScript_ResonanceMeteorDone
	goto_if_unset FLAG_QUEST_RESONANCE_STARTED, MeteorFalls_B1F_2R_EventScript_ResonanceMeteorInert
	@ Investigation sequence
	playse SE_PIN
	waitse
	setvar VAR_0x8004, 1
	setvar VAR_0x8005, 1
	setvar VAR_0x8006, 4
	setvar VAR_0x8007, 3
	special ShakeCamera
	waitstate
	msgbox MeteorFalls_B1F_2R_Text_ResonanceMeteorInvestigate, MSGBOX_DEFAULT
	setflag FLAG_QUEST_RESONANCE_METEOR
	release
	end

MeteorFalls_B1F_2R_EventScript_ResonanceMeteorDone::
	msgbox MeteorFalls_B1F_2R_Text_ResonanceMeteorAfter, MSGBOX_DEFAULT
	release
	end

MeteorFalls_B1F_2R_EventScript_ResonanceMeteorInert::
	msgbox MeteorFalls_B1F_2R_Text_ResonanceMeteorInert, MSGBOX_DEFAULT
	release
	end

MeteorFalls_B1F_2R_Text_ResonanceMeteorInvestigate:
	.string "The meteorite fragments pulse\n"
	.string "with a faint, rhythmic glow.\p"
	.string "The rhythm is steady.\n"
	.string "Like breathing.\p"
	.string "You feel a presence watching\n"
	.string "from somewhere impossibly\l"
	.string "far away.\p"
	.string "The glow fades, but the rhythm\n"
	.string "continues -- felt more than\l"
	.string "heard.$"

MeteorFalls_B1F_2R_Text_ResonanceMeteorAfter:
	.string "The meteorite fragments still\n"
	.string "pulse faintly. The rhythm\l"
	.string "hasn't stopped.$"

MeteorFalls_B1F_2R_Text_ResonanceMeteorInert:
	.string "Meteorite fragments. They look\n"
	.string "ordinary enough.$"

@ =============================================
@ Resonance Residue — Meteorite Post-Resonance (C236)
@ =============================================

MeteorFalls_B1F_2R_EventScript_ResonanceMeteorResidue::
	msgbox MeteorFalls_B1F_2R_Text_ResonanceMeteorResidue, MSGBOX_DEFAULT
	release
	end

MeteorFalls_B1F_2R_Text_ResonanceMeteorResidue:
	.string "The meteorite fragments glow\n"
	.string "with a steady light. Not\l"
	.string "pulsing. Constant.\p"
	.string "The cavern air is warm here.\n"
	.string "Warmer than it should be.\p"
	.string "You hold your hand near the\n"
	.string "stone. The warmth doesn't\l"
	.string "come from the surface.\p"
	.string "It comes from deeper.$"

@ =============================================
@ Quest 7: The Answer -- Meteor Falls Aftermath (C242)
@ =============================================

MeteorFalls_B1F_2R_EventScript_CosmicAftermath::
	msgbox MeteorFalls_B1F_2R_Text_CosmicAftermath, MSGBOX_DEFAULT
	release
	end

MeteorFalls_B1F_2R_Text_CosmicAftermath:
	.string "The hum stopped.\p"
	.string "You press your hand to the\n"
	.string "stone. Cool. For the first\l"
	.string "time in weeks, cool.\p"
	.string "The warmth that lived here\n"
	.string "has gone somewhere.\p"
	.string "You think you know where.$"

@ =============================================
@ C315: Discovery beat - the crystal Treecko
@ =============================================

MeteorFalls_B1F_2R_EventScript_CrystalTreecko::
	EventMacro_StaticDen SPECIES_TREECKO_HOENN, 40, ITEM_MOON_STONE, FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO, MeteorFalls_B1F_2R_Text_CrystalTreeckoApproach, MeteorFalls_B1F_2R_Text_CrystalTreeckoCaught, MeteorFalls_B1F_2R_Text_CrystalTreeckoFaded

MeteorFalls_B1F_2R_EventScript_SilverLeaf::
	msgbox MeteorFalls_B1F_2R_Text_SilverLeaf, MSGBOX_SIGN
	end

@ C336 Red Ink page 7: Steven answers under his old note (humility: the player was right but incomplete)
MeteorFalls_B1F_2R_EventScript_ChalkNote::
	goto_if_set FLAG_DEN_METEOR_STEVEN_CHALK, MeteorFalls_B1F_2R_EventScript_ChalkCopied
	goto_if_set FLAG_TEMP_13, MeteorFalls_B1F_2R_EventScript_ChalkAnswer
	goto_if_set FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO, MeteorFalls_B1F_2R_EventScript_ChalkWaiting
	msgbox MeteorFalls_B1F_2R_Text_ChalkNote, MSGBOX_SIGN
	end

MeteorFalls_B1F_2R_EventScript_ChalkWaiting::
	lockall
	msgbox MeteorFalls_B1F_2R_Text_ChalkNote, MSGBOX_DEFAULT
	msgbox MeteorFalls_B1F_2R_Text_ChalkStub, MSGBOX_DEFAULT
	releaseall
	end

MeteorFalls_B1F_2R_EventScript_ChalkAnswer::
	lockall
	msgbox MeteorFalls_B1F_2R_Text_ChalkAnswer, MSGBOX_DEFAULT
	goto_if_unset FLAG_RECEIVED_FIELD_NOTES, MeteorFalls_B1F_2R_EventScript_ChalkNoBook
	playse SE_DEX_PAGE
	msgbox MeteorFalls_B1F_2R_Text_ChalkCopy, MSGBOX_DEFAULT
	setflag FLAG_DEN_METEOR_STEVEN_CHALK
	releaseall
	end

@ v2.9 save without the notebook: the answer reads, but nothing is copied until they hold FIELD NOTES
MeteorFalls_B1F_2R_EventScript_ChalkNoBook::
	releaseall
	end

MeteorFalls_B1F_2R_EventScript_ChalkCopied::
	msgbox MeteorFalls_B1F_2R_Text_ChalkAnswer, MSGBOX_SIGN
	end

MeteorFalls_B1F_2R_Text_CrystalTreeckoApproach:
	.string "A faint chime... like ice\n"
	.string "settling in the dark.\p"
	.string "A TREECKO...? Down here?\p"
	.string "No... its leaves aren't green.\n"
	.string "They're clear as crystal,\l"
	.string "and sharp as glass.$"

MeteorFalls_B1F_2R_Text_CrystalTreeckoCaught:
	.string "The chiming stops.\p"
	.string "For a moment, the meteorite\n"
	.string "fragments hum in answer.\p"
	.string "The chalk on the wall above\n"
	.string "seems to catch the light.$"

MeteorFalls_B1F_2R_Text_CrystalTreeckoFaded:
	.string "The glint sinks back into\n"
	.string "the rock...\p"
	.string "Somewhere below, the chime\n"
	.string "keeps ringing. It hasn't\l"
	.string "gone far.$"

MeteorFalls_B1F_2R_Text_SilverLeaf:
	.string "A silver leaf is wedged into\n"
	.string "the stalagmite.\p"
	.string "It's as thin as a knife,\n"
	.string "and cold to the touch.$"

MeteorFalls_B1F_2R_Text_ChalkNote:
	.string "Words are chalked on the cave\n"
	.string "wall in a neat hand:\p"
	.string "Not mine to collect.\n"
	.string "Some things should be found.\p"
	.string "- S.$"

MeteorFalls_B1F_2R_Text_ChalkStub:
	.string "A stub of fresh chalk sits on\n"
	.string "the ledge below the words.\p"
	.string "Someone means to come back.$"

MeteorFalls_B1F_2R_Text_ChalkAnswer:
	.string "Under the old chalk, a new\n"
	.string "line in the same neat hand:\p"
	.string "Found, then. Good.\p"
	.string "You were right. It needs no\n"
	.string "sun down here.\p"
	.string "But its kind still whet their\n"
	.string "leaves on forest bark.\p"
	.string "This one came for the meteor.\n"
	.string "The forest still remembers.\p"
	.string "- S.$"

MeteorFalls_B1F_2R_Text_ChalkCopy:
	.string "You copy it down.\n"
	.string "Blue chalk dust settles\l"
	.string "under your red ink.$"
