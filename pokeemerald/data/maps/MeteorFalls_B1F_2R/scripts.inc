MeteorFalls_B1F_2R_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, MeteorFalls_B1F_2R_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, MeteorFalls_B1F_2R_OnResume
	.byte 0

MeteorFalls_B1F_2R_OnTransition:
	EventMacro_StaticDenTransition FLAG_CAUGHT_METEOR_FALLS_CRYSTAL_TREECKO, FLAG_TEMP_11
	end

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

MeteorFalls_B1F_2R_EventScript_ChalkNote::
	msgbox MeteorFalls_B1F_2R_Text_ChalkNote, MSGBOX_SIGN
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
	.string "fragments hum in answer.$"

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
