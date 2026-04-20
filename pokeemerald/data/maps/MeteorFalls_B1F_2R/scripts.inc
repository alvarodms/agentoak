MeteorFalls_B1F_2R_MapScripts::
	.byte 0

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
