MtPyre_Exterior_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, MtPyre_Exterior_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, MtPyre_Exterior_OnResume
	.byte 0

MtPyre_Exterior_OnTransition:
	call MtPyre_Exterior_EventScript_CheckEnterFromSummit
	call_if_set FLAG_CAUGHT_MT_PYRE_STARLIGHT_TORCHIC, MtPyre_Exterior_EventScript_MournerWatchesFog
	call_if_defeated TRAINER_PYRE_MOURNER, MtPyre_Exterior_EventScript_MournerAtGraves
	EventMacro_StaticDenTransition FLAG_CAUGHT_MT_PYRE_STARLIGHT_TORCHIC, FLAG_TEMP_11
	end

MtPyre_Exterior_OnResume:
	call_if_set FLAG_SYS_CTRL_OBJ_DELETE, MtPyre_Exterior_EventScript_TryRemoveStarlightTorchic
	end

MtPyre_Exterior_EventScript_TryRemoveStarlightTorchic::
	EventMacro_StaticDenTryRemove

MtPyre_Exterior_EventScript_CheckEnterFromSummit::
	getplayerxy VAR_TEMP_0, VAR_TEMP_1
	goto_if_lt VAR_TEMP_1, 12, MtPyre_Exterior_EventScript_EnterFromSummit
	return

MtPyre_Exterior_EventScript_EnterFromSummit::
	setweather WEATHER_FOG_HORIZONTAL
	return

MtPyre_Exterior_EventScript_FogTrigger::
	setweather WEATHER_FOG_HORIZONTAL
	doweather
	end

MtPyre_Exterior_EventScript_SunTrigger::
	setweather WEATHER_SUNNY
	doweather
	end

MtPyre_Exterior_EventScript_CoralMourner::
	msgbox MtPyre_Exterior_Text_CoralMourner, MSGBOX_NPC
	end

MtPyre_Exterior_Text_CoralMourner:
	.string "Have you seen the pale coral near\n"
	.string "the graves? It wasn't here before\l"
	.string "the migration.\p"
	.string "PHOEBE says they're spirits of\n"
	.string "coral that didn't survive the\l"
	.string "crossing.\p"
	.string "I find them beautiful, in a\n"
	.string "mournful sort of way.\p"
	.string "That woman by the graves has\n"
	.string "watched the fog for weeks.$"

@ =============================================
@ C334: Red Ink page 5 - the mourner (battle believer)
@ ISOLDE (TRAINER_PYRE_MOURNER, slot 581) believes the starlight
@ Torchic is a soul-light of the dead. Her trainer flag is the only
@ state: a whiteout leaves her re-offering. Beaten, she moves to the
@ 17,11 alcove facing the graves (on re-entry) and page 5 gains its
@ red margin (IsFieldNotesMarginEarned, src/match_call.c).
@ =============================================

MtPyre_Exterior_EventScript_MournerAtGraves:
	setobjectxyperm LOCALID_MT_PYRE_EXTERIOR_MOURNER, 17, 11
	setobjectmovementtype LOCALID_MT_PYRE_EXTERIOR_MOURNER, MOVEMENT_TYPE_FACE_UP
	return

@ C338: Torchic caught, ISOLDE not yet beaten - she keeps watching where the light stood (matches the on-catch cue)
MtPyre_Exterior_EventScript_MournerWatchesFog:
	setobjectmovementtype LOCALID_MT_PYRE_EXTERIOR_MOURNER, MOVEMENT_TYPE_FACE_RIGHT
	return

@ C338: on-catch cue, called from EventMacro_StaticDen. No text: the turn is the message.
MtPyre_Exterior_EventScript_MournerSeesLightGone::
	applymovement LOCALID_MT_PYRE_EXTERIOR_MOURNER, MtPyre_Exterior_Movement_MournerSeesLightGone
	waitmovement 0
	return

MtPyre_Exterior_Movement_MournerSeesLightGone:
	face_right
	delay_16
	delay_16
	walk_in_place_slow_right
	delay_16
	step_end

MtPyre_Exterior_EventScript_Mourner::
	lock
	goto_if_defeated TRAINER_PYRE_MOURNER, MtPyre_Exterior_EventScript_MournerDone
	faceplayer
	goto_if_unset FLAG_CAUGHT_MT_PYRE_STARLIGHT_TORCHIC, MtPyre_Exterior_EventScript_MournerSilent
	msgbox MtPyre_Exterior_Text_MournerChallenge, MSGBOX_DEFAULT
	msgbox MtPyre_Exterior_Text_MournerAsk, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, NO, MtPyre_Exterior_EventScript_MournerDecline
	trainerbattle_single TRAINER_PYRE_MOURNER, MtPyre_Exterior_Text_MournerIntro, MtPyre_Exterior_Text_MournerDefeat, MtPyre_Exterior_EventScript_MournerDefeated
	release
	end

MtPyre_Exterior_EventScript_MournerDefeated::
	msgbox MtPyre_Exterior_Text_MournerAfter, MSGBOX_DEFAULT
	applymovement LOCALID_MT_PYRE_EXTERIOR_MOURNER, Common_Movement_FaceUp
	waitmovement 0
	release
	end

MtPyre_Exterior_EventScript_MournerSilent::
	msgbox MtPyre_Exterior_Text_MournerSilent, MSGBOX_DEFAULT
	release
	end

MtPyre_Exterior_EventScript_MournerDecline::
	msgbox MtPyre_Exterior_Text_MournerDecline, MSGBOX_DEFAULT
	release
	end

@ No faceplayer: she keeps facing the graves
MtPyre_Exterior_EventScript_MournerDone::
	msgbox MtPyre_Exterior_Text_MournerDone, MSGBOX_DEFAULT
	release
	end

MtPyre_Exterior_Text_MournerSilent:
	.string "…You climbed past the graves\n"
	.string "with a notebook in your bag.\p"
	.string "The lights in the summit fog\n"
	.string "are not for notebooks.\p"
	.string "I won't speak of them.\n"
	.string "Not to you.$"

MtPyre_Exterior_Text_MournerChallenge:
	.string "The summit fog thinned when\n"
	.string "you came down. A soul-light\l"
	.string "left the mountain with you.\p"
	.string "My grandmother burned bright\n"
	.string "like that. I watch for her.\p"
	.string "If you carry her, prove you\n"
	.string "carry her with respect.$"

MtPyre_Exterior_Text_MournerAsk:
	.string "Will you show me how\n"
	.string "you carry it?$"

MtPyre_Exterior_Text_MournerDecline:
	.string "Then carry it quietly.\n"
	.string "I'll be here.$"

MtPyre_Exterior_Text_MournerIntro:
	.string "Show me, then.$"

MtPyre_Exterior_Text_MournerDefeat:
	.string "…It burned for you.\n"
	.string "Not for the dead.$"

MtPyre_Exterior_Text_MournerAfter:
	.string "Soul-lights don't battle.\n"
	.string "What you caught is alive.\p"
	.string "A living flame, pink as\n"
	.string "cold starlight.\p"
	.string "Grandmother burned orange.\n"
	.string "Warm, like a hearth.\p"
	.string "It was never her. …I can\n"
	.string "say goodbye now. Properly.$"

MtPyre_Exterior_Text_MournerDone:
	.string "…I'm talking to her now.\n"
	.string "The real her. Up there.\p"
	.string "Thank you for the battle.$"

@ =============================================
@ C312: Discovery beat - the starlight Torchic
@ =============================================

MtPyre_Exterior_EventScript_StarlightTorchic::
	EventMacro_StaticDen SPECIES_TORCHIC_HOENN, 30, ITEM_STAR_PIECE, FLAG_CAUGHT_MT_PYRE_STARLIGHT_TORCHIC, MtPyre_Exterior_Text_StarlightTorchicApproach, MtPyre_Exterior_Text_StarlightTorchicCaught, MtPyre_Exterior_Text_StarlightTorchicFaded, MtPyre_Exterior_EventScript_MournerSeesLightGone

MtPyre_Exterior_EventScript_ScorchMark::
	msgbox MtPyre_Exterior_Text_ScorchMark, MSGBOX_SIGN
	end

MtPyre_Exterior_EventScript_FrostPrints::
	msgbox MtPyre_Exterior_Text_FrostPrints, MSGBOX_SIGN
	end

MtPyre_Exterior_Text_StarlightTorchicApproach:
	.string "A TORCHIC...? Up here?\p"
	.string "No... its feathers aren't orange.\n"
	.string "They shine like cold starlight.$"

MtPyre_Exterior_Text_StarlightTorchicCaught:
	.string "The fog thins for a moment.\p"
	.string "Above the summit, a few stars\n"
	.string "are shining in broad daylight.$"

MtPyre_Exterior_Text_StarlightTorchicFaded:
	.string "The starlight scatters into\n"
	.string "the fog...\p"
	.string "Perhaps it will return once\n"
	.string "the mist settles again.$"

MtPyre_Exterior_Text_ScorchMark:
	.string "A pale scorch mark streaks\n"
	.string "across the rock.\p"
	.string "It's cold to the touch.\n"
	.string "The ash drifts uphill, not down.$"

MtPyre_Exterior_Text_FrostPrints:
	.string "Tiny three-toed prints are\n"
	.string "pressed into the frost.\p"
	.string "Each one glows faintly...\n"
	.string "then fades. They lead into\l"
	.string "the fog.$"

