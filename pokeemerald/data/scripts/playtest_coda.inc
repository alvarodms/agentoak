@ C343 PLAYTEST Red Ink coda: run by NewGameInitData only when PLAYTEST=2 (make playtest_coda).
@ Cleared save, pages 1-4 inked, Lilycove doubt NOT written: the tester sees the Route 104 lesson,
@ flies to Lilycove to write the "...?", then returns for page 3. Retail never calls it.
@ C351: also walks v3.1 beats A/B/C (GAME_CLEAR + the PC Pokemon count as caught).
@ Synchronous commands only (RunScriptImmediately): no msgbox, delay, warp or waitstate.
EventScript_PlaytestCoda::
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
	setflag FLAG_VISITED_PETALBURG_CITY
	@ C351 v3.1 beats: Fly to Dewford (Route 106 tide hiker), Mauville (Route 118 -> 119 TESSA), Fallarbor (Route 113 ELLIS); Fortree for the walk down 119.
	setflag FLAG_VISITED_DEWFORD_TOWN
	setflag FLAG_VISITED_MAUVILLE_CITY
	setflag FLAG_VISITED_FALLARBOR_TOWN
	setflag FLAG_VISITED_FORTREE_CITY
	setflag FLAG_SYS_GAME_CLEAR
	@ Petalburg: Norman beaten and Wally's house visited (no gym-guide or Scott coord scenes)
	setvar VAR_PETALBURG_CITY_STATE, 5
	setvar VAR_PETALBURG_GYM_STATE, 7
	setvar VAR_SCOTT_PETALBURG_ENCOUNTER, 1
	@ Wally tutorial hides his mom for good (PetalburgCity_Gym); Wally, his dad and Scott stay hidden by ResetAllMapFlags
	setflag FLAG_HIDE_PETALBURG_CITY_WALLYS_MOM
	@ Route 104: rival and Briney done (VAR 0 would fire the Migration glimpse coord events)
	setvar VAR_ROUTE104_STATE, 2
	@ Lilycove: rival battle and Aqua Hideout done (grunts gone, Wailmer cove open)
	setflag FLAG_MET_RIVAL_LILYCOVE
	setflag FLAG_HIDE_LILYCOVE_CITY_RIVAL
	setflag FLAG_HIDE_LILYCOVE_CITY_AQUA_GRUNTS
	setflag FLAG_TEAM_AQUA_ESCAPED_IN_SUBMARINE
	setrespawn HEAL_LOCATION_PETALBURG_CITY
	givemon SPECIES_SWELLOW, 55
	givemon SPECIES_GYARADOS, 55
	givemon SPECIES_HARIYAMA, 54
	givemon SPECIES_MANECTRIC, 54
	givemon SPECIES_CLAYDOL, 54
	givemon SPECIES_ALTARIA, 54
	setmonmove 0, 3, MOVE_FLY
	setmonmove 1, 2, MOVE_SURF
	@ Party is full: these four go to the PC. ScriptGiveMon sets SEEN+CAUGHT for PC
	@ deliveries too, which inks FIELD NOTES pages 1-4 (IsFieldNotesPageInked).
	givemon SPECIES_LOTAD_HOENN, 20
	givemon SPECIES_SHROOMISH_HOENN, 20
	givemon SPECIES_GLIGAR_HOENN, 24
	givemon SPECIES_VULPIX_HOENN, 24
	additem ITEM_FIELD_NOTES
	additem ITEM_ULTRA_BALL, 20
	additem ITEM_HYPER_POTION, 10
	additem ITEM_REVIVE, 5
	end
