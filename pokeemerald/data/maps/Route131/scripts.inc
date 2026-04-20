Route131_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, Route131_OnTransition
	.byte 0

Route131_OnTransition:
	call_if_ge VAR_SOOTOPOLIS_CITY_STATE, 4, Route131_EventScript_CheckSetAbnormalWeather
	call Route131_EventScript_SetLayout
	end

Route131_EventScript_SetLayout::
	setmaplayoutindex LAYOUT_ROUTE131_SKY_PILLAR
	return

Route131_EventScript_CheckSetAbnormalWeather::
	call_if_set FLAG_SYS_WEATHER_CTRL, Common_EventScript_SetAbnormalWeather
	return

Route131_EventScript_Richard::
	trainerbattle_single TRAINER_RICHARD, Route131_Text_RichardIntro, Route131_Text_RichardDefeat
	msgbox Route131_Text_RichardPostBattle, MSGBOX_AUTOCLOSE
	end

Route131_EventScript_Herman::
	trainerbattle_single TRAINER_HERMAN, Route131_Text_HermanIntro, Route131_Text_HermanDefeat
	msgbox Route131_Text_HermanPostBattle, MSGBOX_AUTOCLOSE
	end

Route131_EventScript_Susie::
	trainerbattle_single TRAINER_SUSIE, Route131_Text_SusieIntro, Route131_Text_SusieDefeat
	msgbox Route131_Text_SusiePostBattle, MSGBOX_AUTOCLOSE
	end

Route131_EventScript_Kara::
	trainerbattle_single TRAINER_KARA, Route131_Text_KaraIntro, Route131_Text_KaraDefeat
	msgbox Route131_Text_KaraPostBattle, MSGBOX_AUTOCLOSE
	end

Route131_EventScript_Reli::
	trainerbattle_double TRAINER_RELI_AND_IAN, Route131_Text_ReliIntro, Route131_Text_ReliDefeat, Route131_Text_ReliNotEnoughMons
	msgbox Route131_Text_ReliPostBattle, MSGBOX_AUTOCLOSE
	end

Route131_EventScript_Ian::
	trainerbattle_double TRAINER_RELI_AND_IAN, Route131_Text_IanIntro, Route131_Text_IanDefeat, Route131_Text_IanNotEnoughMons
	msgbox Route131_Text_IanPostBattle, MSGBOX_AUTOCLOSE
	end

Route131_EventScript_Talia::
	trainerbattle_single TRAINER_TALIA, Route131_Text_TaliaIntro, Route131_Text_TaliaDefeat
	msgbox Route131_Text_TaliaPostBattle, MSGBOX_AUTOCLOSE
	end

Route131_EventScript_Kevin::
	trainerbattle_single TRAINER_KEVIN, Route131_Text_KevinIntro, Route131_Text_KevinDefeat
	msgbox Route131_Text_KevinPostBattle, MSGBOX_AUTOCLOSE
	end

@ C187 Ocean Atmosphere NPC — Silent Swimmer
@ C205: Post-Rayquaza resolution ("The Exhale")
Route131_EventScript_LoneSwimmer::
	goto_if_set FLAG_CAUGHT_RAYQUAZA_GUARDIAN, Route131_EventScript_LoneSwimmerResolved
	goto_if_set FLAG_DEFEATED_RAYQUAZA_GUARDIAN, Route131_EventScript_LoneSwimmerResolved
	msgbox Route131_Text_LoneSwimmer, MSGBOX_NPC
	end

Route131_EventScript_LoneSwimmerResolved::
	lock
	faceplayer
	msgbox Route131_Text_LoneSwimmerResolved, MSGBOX_DEFAULT
	release
	end

Route131_Text_LoneSwimmer:
	.string "Have you noticed? No TENTACOOL.\n"
	.string "No WINGULL overhead. Nothing.\p"
	.string "I've been treading water for\n"
	.string "an hour. It's completely silent.$"

Route131_Text_LoneSwimmerResolved:
	.string "WINGULL are back! Listen…\n"
	.string "hear that? That's normal.\p"
	.string "For a while, the ocean was\n"
	.string "holding its breath.\p"
	.string "Whatever was happening…\n"
	.string "I think HOENN just exhaled.$"

@ =============================================
@ v1.8 Quest 3: The Mossdeep Signal - Shimmer Spot (C200)
@ =============================================

Route131_EventScript_ShimmerSpotTrigger::
	lock
	@ Quest 6: Resonance ocean investigation
	goto_if_set FLAG_QUEST_RESONANCE_OCEAN, Route131_EventScript_ShimmerResonanceDone
	goto_if_set FLAG_QUEST_RESONANCE_STARTED, Route131_EventScript_ResonanceOcean
	@ Quest 3: Mossdeep Signal shimmer
	goto_if_set FLAG_QUEST_MOSSDEEP_INVESTIGATED, Route131_EventScript_ShimmerSpotDone
	goto_if_set FLAG_QUEST_MOSSDEEP_STARTED, Route131_EventScript_ShimmerSequence
	release
	end

Route131_EventScript_ShimmerSpotDone::
	setvar VAR_TEMP_1, 1
	release
	end

Route131_EventScript_ShimmerSequence::
	playbgm MUS_ABNORMAL_WEATHER, TRUE
	msgbox Route131_Text_Shimmer_Beat1, MSGBOX_DEFAULT
	playse SE_SHINY
	waitse
	delay 20
	msgbox Route131_Text_Shimmer_Beat2, MSGBOX_DEFAULT
	msgbox Route131_Text_Shimmer_Beat3, MSGBOX_DEFAULT
	fadedefaultbgm
	setflag FLAG_QUEST_MOSSDEEP_INVESTIGATED
	setvar VAR_TEMP_1, 1
	release
	end

Route131_Text_Shimmer_Beat1:
	.string "The air above the water shifts...\p"
	.string "A faint shimmer, like heat haze,\n"
	.string "ripples across the sky.\p"
	.string "No clouds. No wind. Just a\n"
	.string "trembling in the atmosphere\l"
	.string "itself.$"

Route131_Text_Shimmer_Beat2:
	.string "For a moment, the light bends\n"
	.string "wrong. Points of light appear\l"
	.string "in broad daylight -- starlight\l"
	.string "filtering through a gap that\l"
	.string "shouldn't exist.\p"
	.string "The shimmer pulses once,\n"
	.string "twice... then fades.\p"
	.string "Whatever thinned the sky here,\n"
	.string "it happened during the PRIMAL\l"
	.string "STIRRING. The energy didn't\l"
	.string "just shake the ground.\l"
	.string "It reached upward.$"

Route131_Text_Shimmer_Beat3:
	.string "The shimmer is gone now.\p"
	.string "But something glints on the\n"
	.string "water's surface. Fragments\l"
	.string "of... something. Cosmic dust,\l"
	.string "maybe.\p"
	.string "Evidence that the sky opened,\n"
	.string "even briefly.\p"
	.string "The researcher in MOSSDEEP\n"
	.string "will want to hear about this.$"

@ =============================================
@ Quest 6: The Resonance — Ocean Investigation (C233)
@ =============================================

Route131_EventScript_ShimmerResonanceDone::
	setvar VAR_TEMP_1, 1
	release
	end

Route131_EventScript_ResonanceOcean::
	fadescreen FADE_TO_BLACK
	delay 40
	msgbox Route131_Text_ResonanceOceanVision1, MSGBOX_DEFAULT
	delay 20
	fadescreen FADE_FROM_BLACK
	delay 20
	msgbox Route131_Text_ResonanceOceanVision2, MSGBOX_DEFAULT
	setflag FLAG_QUEST_RESONANCE_OCEAN
	setvar VAR_TEMP_1, 1
	release
	end

Route131_Text_ResonanceOceanVision1:
	.string "The air shimmers, but this time\n"
	.string "the distortion comes from below.\p"
	.string "The ocean glows with a faint,\n"
	.string "alien luminescence.\p"
	.string "For an instant, you see\n"
	.string "something beneath the waves --\l"
	.string "vast and still.$"

Route131_Text_ResonanceOceanVision2:
	.string "The vision fades as quickly\n"
	.string "as it appeared.\p"
	.string "Only the warmth of the water\n"
	.string "remains.$"

@ =============================================
@ Resonance Residue — Ocean Witness (C236)
@ =============================================

Route131_EventScript_ResidueSwimmer::
	lock
	faceplayer
	goto_if_set FLAG_QUEST_COSMIC_COMPLETE, Route131_EventScript_CosmicAftermath
	goto_if_set FLAG_QUEST_RESONANCE_COMPLETE, Route131_EventScript_ResidueSwimmerPostResonance
	msgbox Route131_Text_ResidueSwimmerNormal, MSGBOX_DEFAULT
	release
	end

Route131_EventScript_ResidueSwimmerPostResonance::
	goto_if_set FLAG_RESONANCE_RESIDUE_OCEAN, Route131_EventScript_ResidueSwimmerRevisit
	msgbox Route131_Text_ResidueSwimmerFirstTime, MSGBOX_DEFAULT
	setflag FLAG_RESONANCE_RESIDUE_OCEAN
	release
	end

Route131_EventScript_ResidueSwimmerRevisit::
	msgbox Route131_Text_ResidueSwimmerRevisit, MSGBOX_DEFAULT
	release
	end

Route131_Text_ResidueSwimmerNormal:
	.string "The current's strong out here.\n"
	.string "Good for training, though.$"

Route131_Text_ResidueSwimmerFirstTime:
	.string "Lights under the water some\n"
	.string "nights now. Faint. Blue-green.\p"
	.string "Fish don't mind.\n"
	.string "I don't mind.\p"
	.string "Started after that tremor.\n"
	.string "You know the one.\p"
	.string "My grandfather would've called\n"
	.string "them sea spirits.\l"
	.string "I just call them Tuesday.$"

Route131_Text_ResidueSwimmerRevisit:
	.string "Lights were out again last\n"
	.string "night. Getting used to\l"
	.string "them, honestly.$"

@ =============================================
@ Quest 7: The Answer -- Route 131 Aftermath (C242)
@ =============================================

Route131_EventScript_CosmicAftermath::
	msgbox Route131_Text_CosmicAftermath, MSGBOX_DEFAULT
	release
	end

Route131_Text_CosmicAftermath:
	.string "The lights went out last\n"
	.string "night.\p"
	.string "The water went still.\n"
	.string "Like it's holding its breath.\p"
	.string "Not scared-still.\n"
	.string "Waiting-still.\p"
	.string "Like the sea knows something\n"
	.string "happened.$"

