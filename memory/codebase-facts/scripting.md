# Scripting, dialogue, flags and specials

Moved verbatim from memory/codebase-facts.md in C380 (index: [../codebase-facts.md](../codebase-facts.md)). Current state, not a log: replace what a new fact makes redundant.

## Dialogue Editing System (Cycles 24-26)

**Text format**: `\n` (line 2), `\l` (line 3+), `\p` (new page), `$` (terminator). Max ~35 chars/line. Smart quotes valid (charmap B1/B2). ASCII `"` (0x22) NOT in charmap. Em-dashes NOT in charmap — use `--`. Ellipsis = B0 in charmap. **Only valid escapes**: `\n`, `\l`, `\p`, `$`. Any other `\X` (e.g. `\e`, `\t`) causes build error.

**Safety**: `MSGBOX_NPC` labels safe to rewrite. `MSGBOX_DEFAULT` may have story logic.

**Script temp vars**: Only VAR_0x8000 through VAR_0x800B exist. VAR_TEMP_* reset on map transition — coord_events using them as guards fire once per visit.

## Flag System Layout

Temp 0x00-0x1F (cleared every map load) → story/item flags → Hidden items 0x1F4-0x263 → Trainer 0x500-0x87A → System 0x87B+ → Daily 0x940-0x97F (cleared daily); FLAGS_COUNT 0x980. **Evaluated C334 by check_flag_values.cjs**: MAX_TRAINERS_COUNT is 891, so SYSTEM_FLAGS = TRAINER_FLAGS_END + 1 = 0x87B; the "0x860"/"0x85F" comments in flags.h (and a FLAG_UNUSED_0x863 name that is really 0x87E) are stale vanilla text. Never trust a hex in a flags.h comment or a FLAG_UNUSED_0xNNN name above 0x4FF; run `make check_flag_values` or evaluate the define. Custom flags 0x264-0x2BB (full since C336: 0x2BB = FLAG_DEN_METEOR_STEVEN_CHALK); further flags come from the verified FLAG_UNUSED_0x* pool listed in strategy-notes Flag space (rename the FLAG_UNUSED_0x* define in place). Den caught flags: 0x2B5 Mt. Pyre Torchic, 0x2B6 Meteor Falls Treecko, 0x2B7 Shoal Cave Mudkip. Beast: 0x881-0x886. Difficulty: 0x286. Reckoning: 0x2AB-0x2B4.

- **Event macros** (C179): `asm/macros/event_macros.inc` — `GlimpseEvent`, `BadgeGateShow`, `ConditionalDialogue`, and (C315) the den trio `EventMacro_StaticDen`, `EventMacro_StaticDenTransition`, `EventMacro_StaticDenTryRemove` (see Static Encounter Recipe). Macro-local labels use `\@` for uniqueness.

- **Coloured text in field messages**: `{COLOR RED}{SHADOW LIGHT_RED}` (charmap FC 01 04 / FC 03 05) recolours the rest of the text until the next msgbox resets it. `msgbox gStringVar4, MSGBOX_DEFAULT` works (BattleFrontier rooms do it). check_text_width counts STR_VAR_N as 60px, so short numeric placeholders may still need a \l rewrap. Field msgbox palette (gMessageBox_Pal, graphics/text_window/message_box.png, C337): idx1 WHITE 248,248,248 = box bg; idx3 LIGHT_GRAY 208,208,200 (unreadable on white); idx4 RED 224,8,8 / idx5 LIGHT_RED 248,184,112 (peach shadow, vanilla); idx8 BLUE 48,80,200 / idx9 LIGHT_BLUE 160,192,240. Check here before picking a text colour.

- **Specials table is name-indexed** (C330): `def_special` sets `SPECIAL_<name>` from a running counter and scripts use the name, so a special can be inserted mid-table (C330 put `CountInkedFieldNotePages` right after BufferFieldNotesPage). Nothing in src/ hard-codes special numbers.

- **ON_RESUME arms, ON_FRAME fires (C361 First Ink)**: a one-time field cue that must play after a battle catch uses MAP_SCRIPT_ON_RESUME to set a VAR_TEMP_* var (`setvar VAR_TEMP_7, 1` under its conditions) and MAP_SCRIPT_ON_FRAME_TABLE `map_script_2 VAR_TEMP_7, 1, <script>` to run the visible script (the script clears the var). ON_RESUME runs on every return to the field (battle, menus, bag, boot; overworld.c:2158 in the resume path, :821 on connection walk-in) and return from battle does NOT clear temp vars; map loads (warp :849, connection :799 ClearTempFieldEventData) do, and then re-run ON_RESUME, so the arm re-evaluates on every visit. ON_FRAME (field_control_avatar.c:150) only runs when the player has control and no script is running, so it waits for a trainer's post-battle script or the fade-in. ON_RESUME runs via RunScriptImmediately: keep it synchronous (setvar/specialvar/goto_if only). It also clobbers VAR_0x8004/VAR_RESULT on every resume, which is safe on Route 102 / Petalburg Woods (no script holds them across a menu or battle there); check before reusing on another map.

- **msgbox <label> overwrites gStringVar4** (C361): `msgbox Text, MSGBOX_DEFAULT` expands the text into gStringVar4 before printing, so a special that buffers gStringVar4 for a later `msgbox gStringVar4` must run AFTER any intervening text msgbox (FirstInk buffers the ink after the open line). Specials can also change VAR_0x8004-0x8006; copy a page id to VAR_0x8005 first if a msgbox/special sits between.
