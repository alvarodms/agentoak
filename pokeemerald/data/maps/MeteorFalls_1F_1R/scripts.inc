MeteorFalls_1F_1R_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, MeteorFalls_1F_1R_OnTransition
	map_script MAP_SCRIPT_ON_LOAD, MeteorFalls_1F_1R_OnLoad
	.byte 0

MeteorFalls_1F_1R_OnTransition:
	goto_if_set FLAG_SYS_GAME_CLEAR, MeteorFalls_1F_1R_OnTransition_ShowPostgameGrunt
	setflag FLAG_HIDE_METEOR_FALLS_POSTGAME_MAGMA_GRUNT
	end

MeteorFalls_1F_1R_OnTransition_ShowPostgameGrunt:
	clearflag FLAG_HIDE_METEOR_FALLS_POSTGAME_MAGMA_GRUNT
	end

MeteorFalls_1F_1R_OnLoad:
	call_if_set FLAG_SYS_GAME_CLEAR, MeteorFalls_1F_1R_EventScript_OpenStevensCave
	end

MeteorFalls_1F_1R_EventScript_OpenStevensCave::
	setmetatile 4, 1, METATILE_MeteorFalls_CaveEntrance_Top, TRUE
	setmetatile 3, 2, METATILE_MeteorFalls_CaveEntrance_Left, TRUE
	setmetatile 4, 2, METATILE_MeteorFalls_CaveEntrance_Bottom, FALSE
	setmetatile 5, 2, METATILE_MeteorFalls_CaveEntrance_Right, TRUE
	return

MeteorFalls_1F_1R_EventScript_MagmaStealsMeteoriteScene::
	lockall
	playbgm MUS_ENCOUNTER_MAGMA, FALSE
	applymovement LOCALID_PLAYER, Common_Movement_FaceDown
	waitmovement 0
	delay 30
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, Common_Movement_WalkInPlaceDown
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_WithThisMeteorite, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, Common_Movement_WalkInPlaceFasterUp
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_2, Common_Movement_WalkInPlaceFasterUp
	waitmovement 0
	playse SE_PIN
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, Common_Movement_ExclamationMark
	waitmovement 0
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, Common_Movement_Delay48
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_DontExpectMercyFromMagma, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, MeteorFalls_1F_1R_Movement_MagmaGruntApproachPlayer
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_HoldItRightThereMagma, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_PLAYER, Common_Movement_WalkInPlaceFasterLeft
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, Common_Movement_WalkInPlaceFasterLeft
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_2, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	addobject LOCALID_METEOR_FALLS_ARCHIE
	addobject LOCALID_METEOR_FALLS_AQUA_GRUNT_1
	addobject LOCALID_METEOR_FALLS_AQUA_GRUNT_2
	playbgm MUS_ENCOUNTER_AQUA, FALSE
	applymovement LOCALID_METEOR_FALLS_ARCHIE, MeteorFalls_1F_1R_Movement_ArchieArrive
	applymovement LOCALID_METEOR_FALLS_AQUA_GRUNT_1, MeteorFalls_1F_1R_Movement_AquaGrunt1Arrive
	applymovement LOCALID_METEOR_FALLS_AQUA_GRUNT_2, MeteorFalls_1F_1R_Movement_AquaGrunt2Arrive
	waitmovement 0
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, Common_Movement_WalkInPlaceFasterLeft
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_2, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_BeSeeingYouTeamAqua, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_PLAYER, MeteorFalls_1F_1R_Movement_PushPlayerOutOfWay
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_1, MeteorFalls_1F_1R_Movement_MagmaGrunt1Exit
	applymovement LOCALID_METEOR_FALLS_MAGMA_GRUNT_2, MeteorFalls_1F_1R_Movement_MagmaGrunt2Exit
	waitmovement 0
	removeobject LOCALID_METEOR_FALLS_MAGMA_GRUNT_1
	removeobject LOCALID_METEOR_FALLS_MAGMA_GRUNT_2
	applymovement LOCALID_METEOR_FALLS_ARCHIE, MeteorFalls_1F_1R_Movement_ArchieApproachPlayer
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_ArchieSeenYouBefore, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_METEOR_FALLS_AQUA_GRUNT_1, MeteorFalls_1F_1R_Movement_AquaGrunt1ApproachArchie
	applymovement LOCALID_METEOR_FALLS_AQUA_GRUNT_2, MeteorFalls_1F_1R_Movement_AquaGrunt2ApproachArchie
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_BossWeShouldChaseMagma, MSGBOX_DEFAULT
	applymovement LOCALID_METEOR_FALLS_ARCHIE, Common_Movement_WalkInPlaceFasterDown
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_ArchieYesNoTellingWhatMagmaWillDo, MSGBOX_DEFAULT
	applymovement LOCALID_METEOR_FALLS_ARCHIE, Common_Movement_WalkInPlaceFasterLeft
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_ArchieFarewell, MSGBOX_DEFAULT
	closemessage
	applymovement LOCALID_METEOR_FALLS_ARCHIE, MeteorFalls_1F_1R_Movement_ArchieExit
	applymovement LOCALID_METEOR_FALLS_AQUA_GRUNT_1, MeteorFalls_1F_1R_Movement_AquaGrunt1Exit
	applymovement LOCALID_METEOR_FALLS_AQUA_GRUNT_2, MeteorFalls_1F_1R_Movement_AquaGrunt2Exit
	waitmovement 0
	fadedefaultbgm
	removeobject LOCALID_METEOR_FALLS_ARCHIE
	removeobject LOCALID_METEOR_FALLS_AQUA_GRUNT_1
	removeobject LOCALID_METEOR_FALLS_AQUA_GRUNT_2
	setflag FLAG_HIDE_ROUTE_112_TEAM_MAGMA
	setflag FLAG_MET_ARCHIE_METEOR_FALLS
	setflag FLAG_HIDE_FALLARBOR_TOWN_BATTLE_TENT_SCOTT
	setvar VAR_METEOR_FALLS_STATE, 1
	releaseall
	end

MeteorFalls_1F_1R_Movement_MagmaGruntApproachPlayer:
	walk_right
	walk_right
	walk_in_place_faster_up
	step_end

MeteorFalls_1F_1R_Movement_MagmaGrunt1Exit:
	walk_fast_up
	walk_fast_up
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	step_end

MeteorFalls_1F_1R_Movement_MagmaGrunt2Exit:
	walk_fast_up
	walk_fast_up
	walk_fast_up
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	walk_fast_right
	step_end

MeteorFalls_1F_1R_Movement_ArchieArrive:
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	step_end

MeteorFalls_1F_1R_Movement_AquaGrunt1Arrive:
	delay_16
	delay_16
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	step_end

MeteorFalls_1F_1R_Movement_AquaGrunt2Arrive:
	delay_16
	delay_16
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	step_end

MeteorFalls_1F_1R_Movement_ArchieExit:
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	step_end

MeteorFalls_1F_1R_Movement_ArchieApproachPlayer:
	walk_right
	walk_right
	walk_up
	walk_up
	walk_in_place_faster_left
	step_end

MeteorFalls_1F_1R_Movement_AquaGrunt1Exit:
	walk_up
	walk_up
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	step_end

MeteorFalls_1F_1R_Movement_AquaGrunt1ApproachArchie:
	walk_right
	walk_right
	walk_right
	walk_in_place_faster_up
	step_end

MeteorFalls_1F_1R_Movement_AquaGrunt2Exit:
	walk_up
	walk_up
	walk_up
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	walk_right
	step_end

MeteorFalls_1F_1R_Movement_AquaGrunt2ApproachArchie:
	walk_right
	walk_right
	walk_right
	walk_in_place_faster_up
	step_end

MeteorFalls_1F_1R_Movement_PushPlayerOutOfWay:
	walk_in_place_faster_down
	delay_4
	walk_in_place_faster_right
	lock_facing_direction
	walk_left
	unlock_facing_direction
	face_right
	step_end

MeteorFalls_1F_1R_EventScript_ProfCozmo::
	lock
	faceplayer
	goto_if_set FLAG_MET_PROF_COZMO, MeteorFalls_1F_1R_EventScript_MetCozmo
	setflag FLAG_MET_PROF_COZMO
	msgbox MeteorFalls_1F_1R_Text_MeetProfCozmo, MSGBOX_DEFAULT
	release
	end

MeteorFalls_1F_1R_EventScript_MetCozmo::
	msgbox MeteorFalls_1F_1R_Text_WhatsTeamMagmaDoingAtMtChimney, MSGBOX_DEFAULT
	release
	end

MeteorFalls_1F_1R_Text_WithThisMeteorite:
	.string "Hehehe!\p"
	.string "With this METEORITE, that thing in\n"
	.string "MT. CHIMNEY will…$"

MeteorFalls_1F_1R_Text_DontExpectMercyFromMagma:
	.string "Heh?\p"
	.string "I don't know who you are, but if you get\n"
	.string "in the way of TEAM MAGMA, don't\l"
	.string "expect any mercy!$"

MeteorFalls_1F_1R_Text_HoldItRightThereMagma:
	.string "Hold it right there, TEAM MAGMA!\p"
	.string "You're badly mistaken if you think you\n"
	.string "can have your way with the world!$"

MeteorFalls_1F_1R_Text_BeSeeingYouTeamAqua:
	.string "Hehehe!\n"
	.string "Even TEAM AQUA joins us!\p"
	.string "But it's too much trouble to deal with\n"
	.string "you all…\p"
	.string "Heh, it doesn't matter!\p"
	.string "We've got the METEORITE, so off to\n"
	.string "MT. CHIMNEY we go!\p"
	.string "Hehehe! Be seeing you, you TEAM\n"
	.string "AQUA dingbats!$"

MeteorFalls_1F_1R_Text_ArchieSeenYouBefore:
	.string "ARCHIE: Didn't I see you before?\n"
	.string "At SLATEPORT's MUSEUM?\p"
	.string "Ah, so your name is {PLAYER}.\p"
	.string "At the time, I thought you were one\n"
	.string "of TEAM MAGMA's goons.\p"
	.string "Humph…\n"
	.string "You're one odd kid.\p"
	.string "TEAM MAGMA is a dangerous group of\n"
	.string "total fanatics.\p"
	.string "They engage in destruction, claiming\n"
	.string "to expand the land mass.\p"
	.string "They are the rivals to us,\n"
	.string "the sea-loving TEAM AQUA!$"

MeteorFalls_1F_1R_Text_BossWeShouldChaseMagma:
	.string "BOSS, we should give chase to\n"
	.string "TEAM MAGMA…$"

MeteorFalls_1F_1R_Text_ArchieYesNoTellingWhatMagmaWillDo:
	.string "ARCHIE: Yes, yes, we must!\n"
	.string "We've got to hurry.\p"
	.string "There's no telling what TEAM MAGMA\n"
	.string "will do at MT. CHIMNEY!$"

MeteorFalls_1F_1R_Text_ArchieFarewell:
	.string "ARCHIE: {PLAYER}, you should keep\n"
	.string "an eye out for TEAM MAGMA, too.\p"
	.string "Farewell!$"

MeteorFalls_1F_1R_Text_MeetProfCozmo:
	.string "I… I'm COZMO…\n"
	.string "I'm a PROFESSOR…\p"
	.string "TEAM MAGMA asked me to guide them\n"
	.string "to METEOR FALLS…\p"
	.string "But they tricked me.\n"
	.string "They even took my METEORITE away…\p"
	.string "And then another similar bunch,\n"
	.string "TEAM AQUA showed up.\p"
	.string "After that…\n"
	.string "I don't understand any of it.\p"
	.string "But that TEAM MAGMA…\p"
	.string "What are they going to do with that\n"
	.string "METEORITE at MT. CHIMNEY?$"

MeteorFalls_1F_1R_Text_WhatsTeamMagmaDoingAtMtChimney:
	.string "PROF. COZMO: But that TEAM MAGMA…\p"
	.string "What are they going to do with that\n"
	.string "METEORITE at MT. CHIMNEY?$"

@ =============================================
@ Migration Event: The Bagon Colony (C153)
@ Triggers post-Badge 4 near the waterfall
@ =============================================

MeteorFalls_1F_1R_EventScript_ColonySighting::
	goto_if_set FLAG_METEOR_FALLS_COLONY_EVENT, MeteorFalls_1F_1R_EventScript_ColonySighting_End
	goto_if_unset FLAG_BADGE04_GET, MeteorFalls_1F_1R_EventScript_ColonySighting_End
	lockall
	delay 20
	applymovement OBJ_EVENT_ID_PLAYER, Common_Movement_ExclamationMark
	waitmovement 0
	delay 10
	playmoncry SPECIES_BAGON, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	delay 15
	playmoncry SPECIES_BAGON, CRY_MODE_NORMAL
	delay 30
	waitmoncry
	applymovement LOCALID_METEOR_FALLS_RESEARCHER, MeteorFalls_1F_1R_Movement_ResearcherApproach
	waitmovement 0
	msgbox MeteorFalls_1F_1R_Text_ColonyResearcher1, MSGBOX_DEFAULT
	msgbox MeteorFalls_1F_1R_Text_ColonyResearcher2, MSGBOX_DEFAULT
	msgbox MeteorFalls_1F_1R_Text_ColonyResearcher3, MSGBOX_DEFAULT
	playse SE_PIN
	delay 30
	setwildbattle SPECIES_BAGON, 27, ITEM_DRAGON_FANG
	dowildbattle
	msgbox MeteorFalls_1F_1R_Text_ColonyPostBattle1, MSGBOX_DEFAULT
	msgbox MeteorFalls_1F_1R_Text_ColonyPostBattle2, MSGBOX_DEFAULT
	giveitem ITEM_DRAGON_FANG
	msgbox MeteorFalls_1F_1R_Text_ColonyPostBattle3, MSGBOX_DEFAULT
	setflag FLAG_METEOR_FALLS_COLONY_EVENT
	releaseall
	end

MeteorFalls_1F_1R_EventScript_ColonySighting_End::
	end

MeteorFalls_1F_1R_EventScript_ColonyResearcher::
	lock
	faceplayer
	goto_if_set FLAG_METEOR_FALLS_COLONY_EVENT, MeteorFalls_1F_1R_EventScript_ColonyResearcherPost
	msgbox MeteorFalls_1F_1R_Text_ResearcherPreEvent, MSGBOX_DEFAULT
	release
	end

MeteorFalls_1F_1R_EventScript_ColonyResearcherPost::
	goto_if_set FLAG_SYS_GAME_CLEAR, MeteorFalls_1F_1R_EventScript_ColonyResearcherPostChampion
	msgbox MeteorFalls_1F_1R_Text_ResearcherPostEvent, MSGBOX_DEFAULT
	release
	end

MeteorFalls_1F_1R_EventScript_ColonyResearcherPostChampion::
	goto_if_set FLAG_BAGON_COLONY_CALLBACK, MeteorFalls_1F_1R_EventScript_ColonyResearcherRevisit
	msgbox MeteorFalls_1F_1R_Text_ColonyPostChampion1, MSGBOX_DEFAULT
	msgbox MeteorFalls_1F_1R_Text_ColonyPostChampion2, MSGBOX_DEFAULT
	msgbox MeteorFalls_1F_1R_Text_ColonyPostChampion3, MSGBOX_DEFAULT
	msgbox MeteorFalls_1F_1R_Text_ColonyPostChampion4, MSGBOX_DEFAULT
	setflag FLAG_BAGON_COLONY_CALLBACK
	release
	end

MeteorFalls_1F_1R_EventScript_ColonyResearcherRevisit::
	setvar VAR_0x8004, SPECIES_BAGON_HOENN
	specialvar VAR_RESULT, ScriptCheckPokedexSeen
	compare VAR_RESULT, 1
	goto_if_eq MeteorFalls_1F_1R_EventScript_ColonyResearcherWitness
	msgbox MeteorFalls_1F_1R_Text_ColonyResearcherRevisit, MSGBOX_DEFAULT
	release
	end

MeteorFalls_1F_1R_EventScript_ColonyResearcherWitness::
	msgbox MeteorFalls_1F_1R_Text_ColonyResearcherWitness, MSGBOX_DEFAULT
	release
	end

MeteorFalls_1F_1R_Movement_ResearcherApproach:
	walk_down
	walk_in_place_faster_down
	step_end

@ =============================================
@ Colony Event Text
@ =============================================

MeteorFalls_1F_1R_Text_ColonyResearcher1:
	.string "Shh! Stay still...\p"
	.string "Did you hear that? Those cries have\n"
	.string "been echoing through these caves\l"
	.string "for days now.$"

MeteorFalls_1F_1R_Text_ColonyResearcher2:
	.string "I'm a researcher from MAUVILLE.\n"
	.string "Something extraordinary is happening.\p"
	.string "A colony of BAGON has appeared near\n"
	.string "the falls. Dragon-types that have\l"
	.string "never been recorded in HOENN.$"

MeteorFalls_1F_1R_Text_ColonyResearcher3:
	.string "BAGON are drawn to high places.\n"
	.string "They dream of soaring through the sky\l"
	.string "and hurl themselves off cliffs.\p"
	.string "METEOR FALLS must feel like home\n"
	.string "to them.\p"
	.string "Wait... one of them has noticed us.\n"
	.string "Brace yourself!$"

MeteorFalls_1F_1R_Text_ColonyPostBattle1:
	.string "Remarkable! That BAGON was far more\n"
	.string "powerful than any wild specimen\l"
	.string "I've documented.$"

MeteorFalls_1F_1R_Text_ColonyPostBattle2:
	.string "I found this near their nesting site.\n"
	.string "The BAGON seem drawn to it.\p"
	.string "Perhaps you can put it to better\n"
	.string "use than I can.$"

MeteorFalls_1F_1R_Text_ColonyPostBattle3:
	.string "The migration is accelerating.\n"
	.string "Whatever is drawing these creatures\l"
	.string "to HOENN... it's far from over.\p"
	.string "Keep your eyes open out there.$"

MeteorFalls_1F_1R_Text_ResearcherPreEvent:
	.string "Shh... I'm monitoring something.\n"
	.string "Strange cries near the waterfall.\p"
	.string "Go take a closer look, but\n"
	.string "be careful.$"

MeteorFalls_1F_1R_Text_ResearcherPostEvent:
	.string "The rest of the BAGON colony has\n"
	.string "scattered deeper into the caves.\p"
	.string "I'll keep studying what traces\n"
	.string "they left behind.$"

@ =============================================
@ Colony Researcher Post-Champion Text (C209)
@ Triggers after player becomes Champion
@ Seeds future Hoennian Bagon regional form
@ =============================================

MeteorFalls_1F_1R_Text_ColonyPostChampion1:
	.string "You're back! I was hoping you'd\n"
	.string "return.\p"
	.string "I've barely left these caves since\n"
	.string "we last met. Weeks of observation,\l"
	.string "and what I've found...\p"
	.string "The juvenile BAGON near the inner\n"
	.string "chambers are changing. Their scales\l"
	.string "have hardened, taken on the\l"
	.string "texture of meteor stone itself.$"

MeteorFalls_1F_1R_Text_ColonyPostChampion2:
	.string "And the strangest part?\n"
	.string "They've stopped hurling themselves\l"
	.string "off ledges.\p"
	.string "Every BAGON dreams of flight.\n"
	.string "It's their very nature.\p"
	.string "But these ones dig deeper instead.\n"
	.string "As if they've chosen the mountain\l"
	.string "over the sky.$"

MeteorFalls_1F_1R_Text_ColonyPostChampion3:
	.string "DRAKE of the ELITE FOUR reached\n"
	.string "out to me. He'd heard about the\l"
	.string "colony through his DRACONID kin.\p"
	.string "I told him what I'd seen.\n"
	.string "He was quiet for a long time.\p"
	.string "Then he said the DRACONID people\n"
	.string "have a name for this:\l"
	.string "'choosing to stay.'$"

MeteorFalls_1F_1R_Text_ColonyPostChampion4:
	.string "I need more time to understand.\n"
	.string "But I believe we're witnessing\l"
	.string "something unprecedented.\p"
	.string "A new kind of dragon, shaped by\n"
	.string "this very mountain.\p"
	.string "The migration changed HOENN.\n"
	.string "Perhaps it's changing what it\l"
	.string "means to be a dragon, too.$"

@ =============================================
@ Colony Researcher Revisit Text (C215)
@ Hints at Bagon_Hoenn encounter in B1F_2R
@ =============================================

MeteorFalls_1F_1R_Text_ColonyResearcherRevisit:
	.string "I keep coming back to watch them.\p"
	.string "The juveniles near the deepest\n"
	.string "waterfall chamber are the most\l"
	.string "changed.\p"
	.string "Their scales are the color of the\n"
	.string "mountain itself now.\p"
	.string "And so still you might mistake\n"
	.string "one for a rock.\p"
	.string "If you venture down there, tread\n"
	.string "carefully.\l"
	.string "They're shy of footsteps.$"

@ =============================================
@ Colony Researcher Witness Text (C225)
@ Triggers after player has seen Bagon_Hoenn
@ Environmental storytelling -- "the world noticed"
@ =============================================

MeteorFalls_1F_1R_Text_ColonyResearcherWitness:
	.string "You've seen one, haven't you?\p"
	.string "I can tell. That look in your\n"
	.string "eyes -- I had it too, the first\l"
	.string "time.\p"
	.string "DRAGON and ROCK, fused into\n"
	.string "something new. They don't dream\l"
	.string "of flying anymore.\p"
	.string "They dream of enduring.\p"
	.string "I've written it all down.\n"
	.string "Every observation, every change.\l"
	.string "The DRACONID will want to know.\p"
	.string "The mountain made them.\n"
	.string "And they chose to stay.$"

@ C284: Postgame ex-Magma grunt -- grudging acknowledgment
MeteorFalls_1F_1R_EventScript_ExMagmaGrunt::
	lock
	faceplayer
	goto_if_set FLAG_RECKONING_TALKED_METEOR_FALLS, MeteorFalls_1F_1R_EventScript_ExMagmaGruntShort
	msgbox MeteorFalls_1F_1R_Text_ExMagmaGrunt, MSGBOX_DEFAULT
	giveitem ITEM_RARE_CANDY
	setflag FLAG_RECKONING_TALKED_METEOR_FALLS
	release
	end

MeteorFalls_1F_1R_EventScript_ExMagmaGruntShort::
	msgbox MeteorFalls_1F_1R_Text_ExMagmaGruntShort, MSGBOX_DEFAULT
	release
	end

MeteorFalls_1F_1R_Text_ExMagmaGrunt:
	.string "You've seen them, haven't you?\n"
	.string "The young dragons with stone\l"
	.string "in their scales.\p"
	.string "MAXIE said the land needed to\n"
	.string "be stronger.\p"
	.string "These dragons figured that out\n"
	.string "without any of us.\p"
	.string "Here. Take this.\n"
	.string "I've been carrying it since\l"
	.string "the old days.\p"
	.string "It's no use to someone who's\n"
	.string "done fighting.$"

MeteorFalls_1F_1R_Text_ExMagmaGruntShort:
	.string "These dragons don't need\n"
	.string "anyone's help.\p"
	.string "Took me a long time to\n"
	.string "understand that.$"
