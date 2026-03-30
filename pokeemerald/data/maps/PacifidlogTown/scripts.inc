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
	goto_if_set FLAG_PRIMAL_STIRRING_STARTED, PacifidlogTown_EventScript_ElderReport
	msgbox PacifidlogTown_Text_ElderNormal, MSGBOX_DEFAULT
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
