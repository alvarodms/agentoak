PacifidlogTown_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, PacifidlogTown_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, PacifidlogTown_OnResume
	.byte 0

PacifidlogTown_OnTransition:
	setflag FLAG_VISITED_PACIFIDLOG_TOWN
	end

PacifidlogTown_OnResume:
	setstepcallback STEP_CB_PACIFIDLOG_BRIDGE
	end

PacifidlogTown_EventScript_NinjaBoy::
	msgbox PacifidlogTown_Text_NeatHousesOnWater, MSGBOX_NPC
	end

PacifidlogTown_EventScript_Girl::
	msgbox PacifidlogTown_Text_FastRunningCurrent, MSGBOX_NPC
	end

PacifidlogTown_EventScript_Fisherman::
	msgbox PacifidlogTown_Text_SkyPillarTooScary, MSGBOX_NPC
	end

PacifidlogTown_EventScript_TownSign::
	msgbox PacifidlogTown_Text_TownSign, MSGBOX_SIGN
	end

PacifidlogTown_Text_FastRunningCurrent:
	.string "The sea between PACIFIDLOG and\n"
	.string "SLATEPORT has a fast-running tide.\p"
	.string "If you decide to SURF, you could end\n"
	.string "up swept away somewhere else.$"

PacifidlogTown_Text_NeatHousesOnWater:
	.string "See, isn't it neat?\n"
	.string "These houses are on water!\p"
	.string "I was born here!$"

PacifidlogTown_Text_SkyPillarTooScary:
	.string "The SKY PILLAR?\p"
	.string "…Oh, you must mean that tall, tall\n"
	.string "tower a little further out.\p"
	.string "If you asked me, I wouldn't climb it.\n"
	.string "It's too scary to get up that high.\p"
	.string "Life at sea level in PACIFIDLOG,\n"
	.string "that suits me fine.$"

PacifidlogTown_Text_TownSign:
	.string "PACIFIDLOG TOWN\p"
	.string "“Where the morning sun smiles upon\n"
	.string "the waters.”$"


@ =============================================
@ Primal Sighting Network - Elder
@ =============================================

PacifidlogTown_EventScript_TideElder::
	lock
	faceplayer
	@ v1.8 Quest states (highest priority)
	goto_if_set FLAG_QUEST_ELDER_COMPLETE, PacifidlogTown_EventScript_ElderQuestDone
	goto_if_set FLAG_QUEST_ELDER_STARTED, PacifidlogTown_EventScript_ElderQuestReminder
	@ Existing saga checks
	goto_if_set FLAG_CAUGHT_RAYQUAZA_GUARDIAN, PacifidlogTown_EventScript_ElderSkyGuardianDone
	goto_if_set FLAG_DEFEATED_RAYQUAZA_GUARDIAN, PacifidlogTown_EventScript_ElderSkyGuardianDone
	goto_if_set FLAG_SPOKE_PACIFIDLOG_ELDER, PacifidlogTown_EventScript_DraconidReminder
	goto_if_set FLAG_SKY_GUARDIAN_QUEST_ACTIVE, PacifidlogTown_EventScript_DraconidLegend
	goto_if_set FLAG_PRIMAL_CRISIS_RESOLVED, PacifidlogTown_EventScript_TideElderResolved
	goto_if_set FLAG_PRIMAL_STIRRING_STARTED, PacifidlogTown_EventScript_ElderReport
	@ v1.8 Quest offer (post-E4)
	goto_if_set FLAG_SYS_GAME_CLEAR, PacifidlogTown_EventScript_ElderQuestOffer
	msgbox PacifidlogTown_Text_ElderNormal, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_EventScript_DraconidLegend::
	msgbox PacifidlogTown_Text_DraconidLegend, MSGBOX_DEFAULT
	setflag FLAG_SPOKE_PACIFIDLOG_ELDER
	release
	end

PacifidlogTown_EventScript_DraconidReminder::
	msgbox PacifidlogTown_Text_DraconidReminder, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_EventScript_ElderReport::
	msgbox PacifidlogTown_Text_ElderReport, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_Text_ElderNormal:
	.string "PACIFIDLOG drifts where the\n"
	.string "currents take us. We have\l"
	.string "lived on the sea for\l"
	.string "generations.\p"
	.string "The ocean provides, and we\n"
	.string "are grateful.$"

PacifidlogTown_Text_ElderReport:
	.string "In all my years on this\n"
	.string "ocean, I have never been\l"
	.string "afraid of the water.\p"
	.string "Until now.\p"
	.string "The town drifts on\n"
	.string "CORSOLA colonies. They\l"
	.string "anchor us to the seafloor.\l"
	.string "Steady as stone.\p"
	.string "But the CORSOLA are\n"
	.string "stressed. Bleaching.\l"
	.string "The water beneath us\l"
	.string "grows warmer every night.\p"
	.string "And the currents...\n"
	.string "they circle now. Like a\l"
	.string "drain. Like something is\l"
	.string "pulling from below.\p"
	.string "The old songs speak of\n"
	.string "a beast that ruled the\l"
	.string "seas. KYOGRE.\p"
	.string "I pray those are just\n"
	.string "songs.$"

PacifidlogTown_EventScript_TideElderResolved::
	msgbox PacifidlogTown_Text_TideElderResolved, MSGBOX_NPC
	end

PacifidlogTown_Text_TideElderResolved:
	.string "The old tales were true, then.\n"
	.string "When land and sea clash, the world\l"
	.string "trembles.\p"
	.string "But the trembling has stopped.\n"
	.string "Someone restored the balance.\p"
	.string "The elders always said a brave\n"
	.string "soul would rise when needed.\l"
	.string "I believe that soul is you.\p"
	.string "But the old ones say the sky\n"
	.string "feels wrong. Heavy, like before\l"
	.string "a great storm.\p"
	.string "PROF. BIRCH seemed worried when\n"
	.string "I spoke with him. Something about\l"
	.string "atmospheric readings.\p"
	.string "Perhaps you should visit him\n"
	.string "in LITTLEROOT.$"

@ =============================================
@ v7.0 Sky Guardian Arc - Draconid Legend
@ =============================================

PacifidlogTown_Text_DraconidLegend:
	.string "Ah, you must be the young trainer\n"
	.string "PROF. BIRCH spoke of.\p"
	.string "Sit, child. What I tell you now\n"
	.string "has been passed down through my\l"
	.string "family for a thousand years.\p"
	.string "Long ago, when the land burned\n"
	.string "with GROUDON's fury and the seas\l"
	.string "raged with KYOGRE's wrath...\p"
	.string "The people looked to the sky\n"
	.string "and cried out for deliverance.\p"
	.string "And the SKY GUARDIAN answered.\p"
	.string "A great dragon, emerald and gold,\n"
	.string "descended from above the clouds.\p"
	.string "Its very presence stilled the\n"
	.string "storms.\p"
	.string "The ancients built SKY PILLAR to\n"
	.string "honor it.\p"
	.string "A stairway reaching toward the\n"
	.string "heavens themselves.\p"
	.string "They say the guardian sleeps atop\n"
	.string "that pillar still, waiting for\l"
	.string "the day it is needed once more.\p"
	.string "If BIRCH's instruments detect\n"
	.string "something in the sky...\p"
	.string "Then perhaps that day has come.\p"
	.string "WALLACE of SOOTOPOLIS knows the\n"
	.string "way to SKY PILLAR.\p"
	.string "Seek him at its base, east of\n"
	.string "here.$"

PacifidlogTown_Text_DraconidReminder:
	.string "The SKY GUARDIAN sleeps atop\n"
	.string "SKY PILLAR.\p"
	.string "WALLACE can show you the way.\n"
	.string "Be careful, young one.$"

@ =============================================
@ v7.0 Sky Guardian Act 3 -- Elder reaction
@ =============================================

PacifidlogTown_EventScript_ElderSkyGuardianDone::
	lock
	faceplayer
	msgbox PacifidlogTown_Text_ElderSkyGuardianDone, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_Text_ElderSkyGuardianDone:
	.string "The ancient texts spoke true.\n"
	.string "The Sky Guardian has answered.\p"
	.string "For generations, my family has\n"
	.string "guarded the Draconid prophecy.\p"
	.string "We believed the guardian would\n"
	.string "return when the land and sea\l"
	.string "clashed once more.\p"
	.string "And you stood at the summit\n"
	.string "and faced the dragon of the sky.\p"
	.string "The prophecy is fulfilled.\n"
	.string "Our watch is complete.\p"
	.string "May the skies of HOENN remain\n"
	.string "clear for a thousand years.$"

@ =============================================
@ C186 Badge-Conditional Atmosphere NPCs
@ =============================================

PacifidlogTown_EventScript_CurrentSailor::
	lock
	faceplayer
	goto_if_set FLAG_BADGE07_GET, PacifidlogTown_EventScript_CurrentSailor_PostBadge7
	msgbox PacifidlogTown_Text_CurrentSailor_Normal, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_EventScript_CurrentSailor_PostBadge7:
	msgbox PacifidlogTown_Text_CurrentSailor_Uneasy, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_EventScript_CorsolaElder::
	lock
	faceplayer
	goto_if_set FLAG_GATHERING_EVENT, PacifidlogTown_EventScript_CorsolaElder_PostGathering
	goto_if_set FLAG_BADGE07_GET, PacifidlogTown_EventScript_CorsolaElder_PostBadge7
	msgbox PacifidlogTown_Text_CorsolaElder_Normal, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_EventScript_CorsolaElder_PostBadge7:
	msgbox PacifidlogTown_Text_CorsolaElder_Uneasy, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_EventScript_CorsolaElder_PostGathering::
	lock
	faceplayer
	msgbox PacifidlogTown_Text_CorsolaElder_PostGathering, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_Text_CurrentSailor_Normal:
	.string "PACIFIDLOG rides the currents\n"
	.string "smooth as a WAILORD's back!\p"
	.string "Been living on this town my whole\n"
	.string "life. Wouldn't trade it for\l"
	.string "solid ground.$"

PacifidlogTown_Text_CurrentSailor_Uneasy:
	.string "My house shifted six inches\n"
	.string "overnight.\p"
	.string "The currents underneath us have\n"
	.string "reversed. Never seen that.\p"
	.string "Not once in thirty years\n"
	.string "on this town.$"

PacifidlogTown_Text_CorsolaElder_Normal:
	.string "The CORSOLA colonies beneath us\n"
	.string "surface every evening to feed.\p"
	.string "You can set your watch by them.\n"
	.string "That's how you know the sea\l"
	.string "is healthy.$"

PacifidlogTown_Text_CorsolaElder_Uneasy:
	.string "The CORSOLA haven't surfaced in\n"
	.string "three days.\p"
	.string "Something down below is keeping\n"
	.string "them from rising.\p"
	.string "This town stands on their backs,\n"
	.string "child. Remember that.$"

PacifidlogTown_Text_CorsolaElder_PostGathering:
	.string "A fog has settled over the waters\n"
	.string "near SOOTOPOLIS.\p"
	.string "My grandmother spoke of a time\n"
	.string "when the sea would hold its breath\l"
	.string "before something changed.\p"
	.string "I believe that time has come,\n"
	.string "child.$"

@ =============================================
@ v1.8 Quest 1: The Elder's Current (C192)
@ =============================================

PacifidlogTown_EventScript_ElderQuestOffer::
	lock
	faceplayer
	msgbox PacifidlogTown_Text_ElderQuestOffer, MSGBOX_DEFAULT
	setflag FLAG_QUEST_ELDER_STARTED
	release
	end

PacifidlogTown_EventScript_ElderQuestReminder::
	lock
	faceplayer
	msgbox PacifidlogTown_Text_ElderQuestReminder, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_EventScript_ElderQuestDone::
	lock
	faceplayer
	msgbox PacifidlogTown_Text_ElderQuestDone, MSGBOX_DEFAULT
	release
	end

PacifidlogTown_Text_ElderQuestOffer:
	.string "Champion… I was hoping you'd\n"
	.string "return.\p"
	.string "The sea isn't what it was.\n"
	.string "The currents near ROUTE 132…\l"
	.string "they reversed. Clean reversed.\p"
	.string "My grandfather built this town\n"
	.string "reading the tides. If he saw\l"
	.string "what the water does now…\l"
	.string "he wouldn't recognize it.\p"
	.string "Sailors won't dive there\n"
	.string "anymore. They say something\l"
	.string "changed beneath the surface.\p"
	.string "That scientist at the WEATHER\n"
	.string "INSTITUTE is seeing the same\l"
	.string "kind of thing. The land and\l"
	.string "sea both remember what happened.\p"
	.string "Would you look into it?\n"
	.string "ROUTE 132… the dive spot the\l"
	.string "fishermen marked. You're the\l"
	.string "only one I'd trust with this.$"

PacifidlogTown_Text_ElderQuestReminder:
	.string "ROUTE 132… the dive spot.\n"
	.string "The fishermen marked it, but\l"
	.string "none will go near it now.\p"
	.string "Be careful down there,\n"
	.string "Champion.$"

PacifidlogTown_Text_ElderQuestDone:
	.string "The sea gives back what it\n"
	.string "takes… just in a different\l"
	.string "form.\p"
	.string "My grandfather would say\n"
	.string "PACIFIDLOG was built by\l"
	.string "people who listened to the\l"
	.string "ocean. You listened too.$"
