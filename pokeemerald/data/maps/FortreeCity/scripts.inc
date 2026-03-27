FortreeCity_MapScripts::
	map_script MAP_SCRIPT_ON_TRANSITION, FortreeCity_OnTransition
	map_script MAP_SCRIPT_ON_RESUME, FortreeCity_OnResume
	.byte 0

FortreeCity_OnTransition:
	setflag FLAG_VISITED_FORTREE_CITY
	end

FortreeCity_OnResume:
	setstepcallback STEP_CB_FORTREE_BRIDGE
	end

FortreeCity_EventScript_Man::
	msgbox FortreeCity_Text_SawGiganticPokemonInSky, MSGBOX_NPC
	end

FortreeCity_EventScript_Woman::
	lock
	faceplayer
	goto_if_set FLAG_LATIOS_OR_LATIAS_ROAMING, FortreeCity_EventScript_WomanBeastSighting
	goto_if_set FLAG_KECLEON_FLED_FORTREE, FortreeCity_EventScript_WomanGymAccessible
	msgbox FortreeCity_Text_SomethingBlockingGym, MSGBOX_DEFAULT
	release
	end

FortreeCity_EventScript_WomanBeastSighting::
	msgbox FortreeCity_Text_WomanBeastSighting, MSGBOX_DEFAULT
	release
	end

FortreeCity_EventScript_WomanGymAccessible::
	msgbox FortreeCity_Text_ThisTimeIllBeatWinona, MSGBOX_DEFAULT
	release
	end

FortreeCity_EventScript_Girl::
	msgbox FortreeCity_Text_TreesGrowByDrinkingRainwater, MSGBOX_NPC
	end

FortreeCity_EventScript_OldMan::
	lock
	faceplayer
	goto_if_set FLAG_SECOND_WAVE, FortreeCity_EventScript_OldMan_Post
	msgbox FortreeCity_Text_EveryoneHealthyAndLively, MSGBOX_DEFAULT
	release
	end

FortreeCity_EventScript_OldMan_Post::
	msgbox FortreeCity_Text_OldMan_PostWave, MSGBOX_DEFAULT
	release
	end

FortreeCity_EventScript_Boy::
	msgbox FortreeCity_Text_BugPokemonComeThroughWindow, MSGBOX_NPC
	end

FortreeCity_EventScript_GameboyKid::
	msgbox FortreeCity_Text_PokemonThatEvolveWhenTraded, MSGBOX_NPC
	end

FortreeCity_EventScript_CitySign::
	msgbox FortreeCity_Text_CitySign, MSGBOX_SIGN
	end

FortreeCity_EventScript_GymSign::
	msgbox FortreeCity_Text_GymSign, MSGBOX_SIGN
	end

FortreeCity_EventScript_Kecleon::
	lock
	faceplayer
	checkitem ITEM_DEVON_SCOPE
	goto_if_eq VAR_RESULT, TRUE, FortreeCity_EventScript_AskUseDevonScope
	msgbox FortreeCity_Text_SomethingUnseeable, MSGBOX_DEFAULT
	release
	end

FortreeCity_EventScript_AskUseDevonScope::
	msgbox FortreeCity_Text_UnseeableUseDevonScope, MSGBOX_YESNO
	goto_if_eq VAR_RESULT, YES, FortreeCity_EventScript_UseDevonScope
	release
	end

FortreeCity_EventScript_UseDevonScope::
	msgbox FortreeCity_Text_UsedDevonScopePokemonFled, MSGBOX_DEFAULT
	closemessage
	applymovement VAR_LAST_TALKED, Movement_KecleonAppears
	waitmovement 0
	waitse
	playmoncry SPECIES_KECLEON, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	applymovement VAR_LAST_TALKED, FortreeCity_Movement_KecleonFlee
	waitmovement 0
	removeobject VAR_LAST_TALKED
	setflag FLAG_KECLEON_FLED_FORTREE
	release
	end

FortreeCity_Movement_KecleonFlee:
	walk_right
	step_end

FortreeCity_Text_SawGiganticPokemonInSky:
	.string "I have catalogued bird POKéMON here\n"
	.string "for twenty years. Last week I spotted\l"
	.string "three Dragonite circling MT. PYRE.\p"
	.string "Three! In twenty years, not one.\n"
	.string "Something has shifted in this world.\l"
	.string "I can feel it in the treetops.$"

FortreeCity_Text_SomethingBlockingGym:
	.string "I want to go to the POKéMON GYM,\n"
	.string "but something's blocking the way.\p"
	.string "After all the bother I went through\n"
	.string "training on ROUTE 120…$"

FortreeCity_Text_ThisTimeIllBeatWinona:
	.string "I've got my pride-and-joy POKéMON\n"
	.string "with me. This time, I'll beat WINONA.$"

FortreeCity_Text_TreesGrowByDrinkingRainwater:
	.string "The ground absorbs rainwater, and\n"
	.string "trees grow by drinking that water…\p"
	.string "Our FORTREE CITY exists because\n"
	.string "there's both water and soil.$"

FortreeCity_Text_EveryoneHealthyAndLively:
	.string "Three Skarmory nested on the platform\n"
	.string "above mine two weeks ago.\p"
	.string "Skarmory do not nest this far inland.\n"
	.string "A ranger tracked whole formations\l"
	.string "moving through Hoenn.\p"
	.string "Like they are passing through\n"
	.string "on their way to somewhere bigger.$"

FortreeCity_Text_BugPokemonComeThroughWindow:
	.string "The tree bridges creak more at night.\p"
	.string "Something large has been roosting in\n"
	.string "the upper canopy.\l"
	.string "I have seen wing shadows I do not\l"
	.string "recognize.\p"
	.string "I leave out Oran Berries. Whatever it\n"
	.string "is, it takes them before dawn.$"

FortreeCity_Text_PokemonThatEvolveWhenTraded:
	.string "There are POKéMON that evolve when\n"
	.string "you trade them! That's what I heard.$"

FortreeCity_Text_SomethingUnseeable:
	.string "Something unseeable is in the way.$"

FortreeCity_Text_UnseeableUseDevonScope:
	.string "Something unseeable is in the way.\p"
	.string "Want to use the DEVON SCOPE?$"

FortreeCity_Text_UsedDevonScopePokemonFled:
	.string "{PLAYER} used the DEVON SCOPE.\p"
	.string "An invisible POKéMON became completely\n"
	.string "visible!\p"
	.string "The startled POKéMON fled!$"

FortreeCity_Text_CitySign:
	.string "FORTREE CITY\n"
	.string "“The treetop city that frolics with\l"
	.string "nature.”$"


FortreeCity_Text_GymSign:
	.string "FORTREE CITY POKéMON GYM\n"
	.string "LEADER: WINONA\p"
	.string "“The bird user taking flight into\n"

FortreeCity_Text_OldMan_PostWave:
	.string "Forty years I have lived in\n"
	.string "these trees.\p"
	.string "The first migration was a\n"
	.string "curiosity. Strange creatures\l"
	.string "wandering through.\p"
	.string "This is different. This is\n"
	.string "an invasion. The forest\l"
	.string "cannot hold them all.\p"
	.string "The SKARMORY are fighting\n"
	.string "with newcomers for roosting\l"
	.string "space. I hear them clashing\l"
	.string "all night.$"

FortreeCity_EventScript_MigrationBirdKeeper::
	msgbox FortreeCity_Text_MigrationBirdKeeper, MSGBOX_NPC
	end

FortreeCity_Text_MigrationBirdKeeper:
	.string "Twenty years I've kept birds in\n"
	.string "this canopy. Never seen anything\l"
	.string "like what's happening now.\p"
	.string "TAILLOW and SWELLOW are losing\n"
	.string "their nesting sites to foreign\l"
	.string "species moving in from outside.\p"
	.string "Even WINONA's rethinking her\n"
	.string "gym strategy. The skies over\l"
	.string "HOENN aren't what they used to be.$"

FortreeCity_Text_WomanBeastSighting:
	.string "My POKeMON have been restless\n"
	.string "for days now. Pacing, whimpering,\l"
	.string "staring off toward the routes.\p"
	.string "The wild POKeMON feel it too.\n"
	.string "The SWABLU will not even land in\l"
	.string "the trees anymore.\p"
	.string "Something powerful is moving\n"
	.string "through Hoenn. I can feel it\l"
	.string "in my bones.$"
