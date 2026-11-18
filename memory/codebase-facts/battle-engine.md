# Battle engine: abilities, EXP caps, Challenge mode, AI, weather

Moved verbatim from memory/codebase-facts.md in C380 (index: [../codebase-facts.md](../codebase-facts.md)). Current state, not a log: replace what a new fact makes redundant.

- **Challenge Mode scaling** (C210): `include/challenge_mode_scaling.h` — Leader +3, E4 +3, Champion +5, Rival +2, Aqua/Magma Leaders +2, Admins +1 (`sChallengeModeScaling[]`).

- **Trainer AI vs. status moves (C334)**: `AI_CBM_WillOWisp` (data/battle_ai_scripts.s ~531) scores Will-O-Wisp -10 into any Fire-resistant target, so with AI_SCRIPT_CHECK_BAD_MOVE a trainer never picks it into a Fire-type; it only "fails on" a Fire-type the player switches in. `AI_CV_HealBell` (~1841) checks the player's status, not its own team's (vanilla bug): avoid Heal Bell on AI teams.

## Custom Ability Implementation (C241, expanded C289, C300, C310, C311)

4+1 files: abilities.h (constant + ABILITIES_COUNT), global.h (ABILITY_NAME_LENGTH=14), text/abilities.h (string+name+pointer), battle_util.c OR battle_script_commands.c (effect), species_info.h (assign). 6 custom: TOXIC_TOUCH(78), FROZEN_SPORE(79), SCALDING_TOUCH(80), TEMPERED_BLADE(81), FEY_FLAME(82), UNDERTOW(83). ABILITIES_COUNT=84. Next: 84.

**Three implementation patterns**: Status-inflicting abilities (Toxic Touch, Frozen Spore, Scalding Touch) go in `battle_util.c` ABILITYEFFECT_ON_DAMAGE case. Crit-boosting abilities (Tempered Blade) go in `battle_script_commands.c` Cmd_critcalc. Damage multipliers (Fey Flame, Undertow) go in `pokemon.c` CalculateBaseDamage "apply abilities" block (scale gBattleMovePower; `attacker`/`defender` are struct BattlePokemon*, so `defender->status1` is readable). `battlerIdAtk`/`battlerIdDef` are also parameters, so per-battler arrays like gProtectStructs are indexable there.

**Switch-in ability announcement pattern (C310)**: add a case in `AbilityBattleEffects` → `ABILITYEFFECT_ON_SWITCHIN` → `switch (gLastUsedAbility)`: `BattleScriptPushCursorAndCallback(script); gBattleScripting.battler = battler; effect++; break;`. Script in battle_scripts_1.s = `pause B_WAIT_TIME_SHORT / printstring STRINGID_X / waitmessage B_WAIT_TIME_LONG / end3` (+ extern in battle_scripts.h). String uses `{B_SCR_ACTIVE_NAME_WITH_PREFIX}` (resolves from gBattleScripting.battler). New string IDs: append after the last ID in battle_string_ids.h, bump BATTLESTRINGS_COUNT, add to gBattleStringsTable (indexed `ID - BATTLESTRINGS_TABLE_START`). ON_SWITCHIN fires at battle start (battle_main.c counter loop) and on every Cmd_switchineffects, so no guard is needed unless you want once-per-battle. Next free STRINGID: 385 (C325 CHALLENGEBAGLOCKED took 384).

**"Was hit this turn" flag (C311, used by Undertow)**: `gProtectStructs[battler].physicalDmg || gProtectStructs[battler].specialDmg` (include/battle.h, u32 HP amounts). Set in Cmd_datahpupdate (battle_script_commands.c ~1939) when a damaging move lands, skipped for `HITMARKER_PASSIVE_HP_UPDATE` and Pain Split; substitute hits return before this, so they do not count. TurnValuesCleanUp (battle_main.c ~4919) zeroes the whole ProtectStruct every turn, so it is reliable within one turn. Vanilla Revenge-style code reads the same flag (battle_script_commands.c ~9193). `gSpecialStatuses[].physicalDmg` is a per-move copy (TARGET_TURN_DAMAGED macro), not per-turn.

**Unproven**: custom stat-drop abilities via SetMoveEffect + HITMARKER_STATUS_ABILITY_EFFECT — the stat-change paths do not clear that flag, so they may leak; test before relying on it.

## EXP Award System & Challenge Mode Level Caps (C182)

`Cmd_getexp()` in battle_script_commands.c. `GetChallengeLevelCap()` returns per-badge cap (18/20/24/30/34/38/42/48/55); EXP /= 10 when over.

**Challenge BAG lock (C325, #190)**: `IsChallengeBagLocked()` (src/battle_main.c, decl include/battle_main.h) = Challenge && BATTLE_TYPE_TRAINER && !BATTLE_TYPE_PYRAMID.

- Player: `HandleTurnActionSelectionState` case B_ACTION_USE_ITEM (STATE_WAIT_ACTION_CHOSEN) — `else if` after the vanilla link/Frontier branch, runs `BattleScript_ActionSelectionChallengeBagLocked` (STRINGID_CHALLENGEBAGLOCKED 384) and returns to STATE_BEFORE_ACTION_CHOSEN. The second B_ACTION_USE_ITEM case (STATE_WAIT_ACTION_CASE_CHOSEN) only reads the item the bag returned (0 = cancelled) — unreachable once the bag can't open, so left alone. `printselectionstring` prints in B_WIN_MSG (208px) via PlayerHandlePrintSelectionString.

- AI: `ShouldUseItem()` (src/battle_ai_switch_items.c, only caller `AI_TrySwitchOrUseItem`) returns FALSE first. Held items/hold effects are untouched.

- Locked: trainer singles, doubles, Steven tag (player only; partner AI never uses items anyway), Trainer Hill, secret bases. Open: wild, Safari, Wally tutorial (no TRAINER flag), Pyramid (own bag). Frontier/link/e-Reader/recorded link: already locked by vanilla (STRINGID_ITEMSCANTBEUSEDNOW).

- **Overworld → battle weather (C347)**: battle start copies `GetCurrentWeather()` (battle_main.c:3912 → battle_util.c:2493-2522): rain/downpour/thunderstorm → permanent rain, sandstorm, drought → sun; volcanic ash/snow/fog = no battle weather. Coord WEATHER_ROUTE119_CYCLE is SUNNY/RAIN/THUNDER/RAIN by RTC day (field_weather_effect.c:2581). To force rain for a scripted fight: `setweather` + `doweather` + `delay 90` before the battle (C349 TESSA uses 90: currWeather flips only after the old weather's finish(), field_weather.c:229-239, and Thunderstorm_Main goes WAIT_CHANGE → INIT_CYCLE_1 at field_weather_effect.c:1112-1114 so the first bolt follows). `trainerbattle_no_intro` (TRAINER_BATTLE_SINGLE_NO_INTRO_TEXT) resumes the script after a win, so a talk-only NPC can run field effects, battle, then continue (vanilla Route111 Winstrates, Phoebe; C349 Route119 TESSA).

## From strategy-notes Technical Reference (moved C380)

- **Custom ability pattern**: Status-inflicting: 4 files (abilities.h, text/abilities.h, battle_util.c, species_info.h). Crit-boosting: 4 files (abilities.h, text/abilities.h, battle_script_commands.c, species_info.h). Damage-multiplier + switch-in message: 9 files (see battle-engine.md Fey Flame / Undertow). ABILITY_NAME_LENGTH=14.
