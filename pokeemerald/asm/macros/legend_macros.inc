@ legend_macros.inc
@ Legendary Encounter Template -- parameterized macros for legendary
@ and scripted encounters. Composable building blocks, not complete
@ scripts. Combine these in map script files as needed.
@
@ Atmospheric blocks reduce 4-6 lines to 1 line each.
@ LegendMacro_StartBattle reduces ~12 lines of battle setup +
@ outcome branching to a single macro invocation.
@
@ See TerraCave_End, SkyPillar_Top, SeafloorCavern_Room9 for the
@ original patterns these were extracted from.

@ LegendMacro_ScreenShake -- dramatic camera shake effect
@ \v_pan: vertical intensity (1-4)
@ \h_pan: horizontal intensity (1-4)
@ \shakes: number of shakes (4-10)
@ \shake_delay: frames between shakes (2-5)
	.macro LegendMacro_ScreenShake v_pan, h_pan, shakes, shake_delay
	setvar VAR_0x8004, \v_pan
	setvar VAR_0x8005, \h_pan
	setvar VAR_0x8006, \shakes
	setvar VAR_0x8007, \shake_delay
	special ShakeCamera
	waitstate
	.endm

@ LegendMacro_PlayCry -- pokemon cry with encounter timing
@ \species: SPECIES_* constant
	.macro LegendMacro_PlayCry species
	waitse
	playmoncry \species, CRY_MODE_ENCOUNTER
	delay 40
	waitmoncry
	.endm

@ LegendMacro_SetWeather -- set atmospheric weather
@ \weather: WEATHER_* constant
	.macro LegendMacro_SetWeather weather
	setweather \weather
	doweather
	.endm

@ LegendMacro_ClearWeather -- reset to clear weather
	.macro LegendMacro_ClearWeather
	setweather WEATHER_NONE
	doweather
	.endm

@ LegendMacro_FadeOut -- screen fade to black
	.macro LegendMacro_FadeOut
	fadescreenswapbuffers FADE_TO_BLACK
	.endm

@ LegendMacro_FadeIn -- screen fade from black
	.macro LegendMacro_FadeIn
	fadescreenswapbuffers FADE_FROM_BLACK
	.endm

@ LegendMacro_StartBattle -- legendary battle with outcome branching
@
@ Sets up wild battle, manages FLAG_SYS_CTRL_OBJ_DELETE, starts
@ the legendary battle special, waits for completion, then branches:
@   Caught -> jumps to \caught_label
@   Won/Fled/Teleported -> jumps to \won_label
@
@ \species: SPECIES_* constant
@ \level: encounter level
@ \item: held item (ITEM_NONE if none)
@ \won_label: label for defeated/fled/teleported outcomes
@ \caught_label: label for caught outcome
	.macro LegendMacro_StartBattle species, level, item, won_label, caught_label
	setwildbattle \species, \level, \item
	setflag FLAG_SYS_CTRL_OBJ_DELETE
	special BattleSetup_StartLegendaryBattle
	waitstate
	clearflag FLAG_SYS_CTRL_OBJ_DELETE
	specialvar VAR_RESULT, GetBattleOutcome
	goto_if_eq VAR_RESULT, B_OUTCOME_CAUGHT, \caught_label
	goto_if_eq VAR_RESULT, B_OUTCOME_WON, \won_label
	goto_if_eq VAR_RESULT, B_OUTCOME_RAN, \won_label
	goto_if_eq VAR_RESULT, B_OUTCOME_PLAYER_TELEPORTED, \won_label
	.endm
