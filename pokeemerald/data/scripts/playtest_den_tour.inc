@ C339 PLAYTEST den tour: run by NewGameInitData only when PLAYTEST=1 (make playtest).
@ Badge-8 state for the three den routes only; every den stays uncaught. Retail never calls it.
@ Synchronous commands only (RunScriptImmediately): no msgbox, delay, warp or waitstate.
EventScript_PlaytestDenTour::
	setflag FLAG_SYS_POKEMON_GET
	setflag FLAG_SYS_POKEDEX_GET
	setflag FLAG_SYS_POKENAV_GET
	setflag FLAG_RECEIVED_POKENAV
	setflag FLAG_HAS_MATCH_CALL
	setflag FLAG_ADDED_MATCH_CALL_TO_POKENAV
	setflag FLAG_ENABLE_PROF_BIRCH_MATCH_CALL
	setflag FLAG_ADVENTURE_STARTED
	setflag FLAG_RECEIVED_FIELD_NOTES
	setflag FLAG_BADGE01_GET
	setflag FLAG_BADGE02_GET
	setflag FLAG_BADGE03_GET
	setflag FLAG_BADGE04_GET
	setflag FLAG_BADGE05_GET
	setflag FLAG_BADGE06_GET
	setflag FLAG_BADGE07_GET
	setflag FLAG_BADGE08_GET
	setflag FLAG_VISITED_LILYCOVE_CITY
	setflag FLAG_VISITED_MOSSDEEP_CITY
	setflag FLAG_VISITED_FALLARBOR_TOWN
	@ Lilycove: rival battle and Aqua Hideout done (grunts gone, Wailmer cove open)
	setflag FLAG_MET_RIVAL_LILYCOVE
	setflag FLAG_HIDE_LILYCOVE_CITY_RIVAL
	setflag FLAG_HIDE_LILYCOVE_CITY_AQUA_GRUNTS
	setflag FLAG_TEAM_AQUA_ESCAPED_IN_SUBMARINE
	@ Route 121 grunts moved out; Mt. Pyre summit orbs taken and returned (summit empty)
	setvar VAR_ROUTE121_STATE, 1
	setflag FLAG_HIDE_ROUTE_121_TEAM_AQUA_GRUNTS
	setvar VAR_MT_PYRE_STATE, 3
	setflag FLAG_HIDE_MT_PYRE_SUMMIT_ARCHIE
	setflag FLAG_HIDE_MT_PYRE_SUMMIT_TEAM_AQUA
	setflag FLAG_RECEIVED_RED_OR_BLUE_ORB
	@ Meteor Falls: Magma/Aqua meteorite scene done, Cozmo gone home
	setvar VAR_METEOR_FALLS_STATE, 1
	setflag FLAG_HIDE_METEOR_FALLS_TEAM_MAGMA
	setflag FLAG_HIDE_METEOR_FALLS_1F_1R_COZMO
	setflag FLAG_MET_ARCHIE_METEOR_FALLS
	setflag FLAG_MET_PROF_COZMO
	@ Mossdeep: Space Center scene done
	setvar VAR_MOSSDEEP_CITY_STATE, 3
	setflag FLAG_HIDE_MOSSDEEP_CITY_SCOTT
	setrespawn HEAL_LOCATION_LILYCOVE_CITY
	givemon SPECIES_SWELLOW, 42
	givemon SPECIES_GYARADOS, 42
	givemon SPECIES_HARIYAMA, 41
	givemon SPECIES_MANECTRIC, 41
	givemon SPECIES_CLAYDOL, 41
	givemon SPECIES_ALTARIA, 41
	setmonmove 0, 3, MOVE_FLY
	setmonmove 1, 2, MOVE_SURF
	setmonmove 1, 3, MOVE_WATERFALL
	setmonmove 2, 2, MOVE_STRENGTH
	setmonmove 2, 3, MOVE_ROCK_SMASH
	@ Party is full: these four go to the PC. ScriptGiveMon sets SEEN+CAUGHT for PC
	@ deliveries too, which inks FIELD NOTES pages 1-4 (IsFieldNotesPageInked).
	givemon SPECIES_LOTAD_HOENN, 20
	givemon SPECIES_SHROOMISH_HOENN, 20
	givemon SPECIES_GLIGAR_HOENN, 24
	givemon SPECIES_VULPIX_HOENN, 24
	additem ITEM_FIELD_NOTES
	additem ITEM_GOOD_ROD
	additem ITEM_ULTRA_BALL, 20
	additem ITEM_HYPER_POTION, 10
	additem ITEM_REVIVE, 5
	end
