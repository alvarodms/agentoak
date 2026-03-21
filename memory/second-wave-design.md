---
name: Second Wave Event Design
description: Complete implementation specification for the mid-game migration intensification event — trigger mechanism, encounter tables, NPC dialogue, and implementation roadmap
type: project
---

# Second Wave Event — Complete Design Specification

> The dramatic turning point of the Legends of Hoenn narrative. When the player crosses Route 118 after defeating Norman, the migration accelerates — evolved forms appear in the wild, new apex species arrive, and NPCs across eastern Hoenn react with wonder and alarm.

---

## 1. Trigger Mechanism

### Flags

Rename two unused flags in `include/constants/flags.h`:

```c
#define FLAG_SECOND_WAVE             0x20  // Was FLAG_UNUSED_0x020
#define FLAG_SECOND_WAVE_BIRCH_CALL  0x21  // Was FLAG_UNUSED_0x021
```

### When FLAG_SECOND_WAVE Gets Set

In `data/maps/Route118/scripts.inc`, inside `Route118_EventScript_StevenTrigger` (line 90), add `setflag FLAG_SECOND_WAVE` immediately after `setvar VAR_ROUTE118_STATE, 1` (line 100):

```
	setvar VAR_ROUTE118_STATE, 1
	setflag FLAG_SECOND_WAVE
	removeobject LOCALID_ROUTE118_STEVEN
```

**Why Route 118 Steven encounter?** This is the natural midgame gateway. The player has Badge 5 (Norman/Surf), is level ~28-33, and is entering eastern Hoenn for the first time. Steven's encounter already serves as the narrative transition — we piggyback on it.

### Birch PokeNav Call (One-Time OnFrame Script)

Add to `Route118_OnFrame` so it fires once after the Steven encounter:

```
Route118_OnFrame:
	map_script_2 VAR_SHOULD_END_ABNORMAL_WEATHER, 1, AbnormalWeather_EventScript_EndEventAndCleanup_1
	map_script_2 VAR_ROUTE118_STATE, 1, Route118_EventScript_BirchSecondWaveCall
	.2byte 0

Route118_EventScript_BirchSecondWaveCall::
	goto_if_set FLAG_SECOND_WAVE_BIRCH_CALL, Route118_EventScript_BirchCallEnd
	lockall
	playse SE_POKENAV_ON
	delay 20
	msgbox Route118_Text_BirchSecondWaveCall, MSGBOX_DEFAULT
	setflag FLAG_SECOND_WAVE_BIRCH_CALL
	releaseall
Route118_EventScript_BirchCallEnd::
	end
```

**Birch dialogue:**
```
Route118_Text_BirchSecondWaveCall:
	.string "... ... ... ... ... ...\p"
	.string "PROF. BIRCH: {PLAYER}!\n"
	.string "You are on ROUTE 118?\p"
	.string "Listen, my sensors are going\n"
	.string "haywire. The data from the\l"
	.string "eastern routes is unlike\l"
	.string "anything we have recorded.\p"
	.string "The migration has not slowed.\n"
	.string "It is ACCELERATING.\p"
	.string "Evolved forms are appearing\n"
	.string "where we only saw juveniles\l"
	.string "before. New species entirely.\p"
	.string "I need you to keep your eyes\n"
	.string "open out there. Document\l"
	.string "everything you encounter.\p"
	.string "This is no longer just an\n"
	.string "interesting phenomenon.\l"
	.string "This is a Second Wave.$"
```

**Note:** Uses ASCII only (no smart quotes, no em dash). Uses `\p` for page breaks, `\n` for line 2, `\l` for lines 3+, `$` terminator. All lines under 35 characters.

---

## 2. Conditional Encounter Table System

### Technical Approach: Extend the Altering Cave Pattern

In `src/wild_encounter.c`, `GetCurrentMapWildMonHeaderId()` (line 305), after the existing Altering Cave check (lines 318-326), before `return i;` (line 328), add:

```c
// Second Wave: use alternate encounter table for eastern routes
if (FlagGet(FLAG_SECOND_WAVE))
{
    u16 mapKey = (gSaveBlock1Ptr->location.mapGroup << 8) | gSaveBlock1Ptr->location.mapNum;
    if (mapKey == ((MAP_GROUP(ROUTE118) << 8) | MAP_NUM(ROUTE118))
     || mapKey == ((MAP_GROUP(ROUTE119) << 8) | MAP_NUM(ROUTE119))
     || mapKey == ((MAP_GROUP(ROUTE120) << 8) | MAP_NUM(ROUTE120))
     || mapKey == ((MAP_GROUP(ROUTE121) << 8) | MAP_NUM(ROUTE121))
     || mapKey == ((MAP_GROUP(ROUTE123) << 8) | MAP_NUM(ROUTE123))
     || mapKey == ((MAP_GROUP(MT_PYRE_1F) << 8) | MAP_NUM(MT_PYRE_1F)))
    {
        i++;
    }
}
```

**Required includes** (add to top of `wild_encounter.c` if not already present):
- `#include "constants/flags.h"`
- `#include "event_data.h"` (for `FlagGet()`)

**NOTE:** The implementation agent MUST verify the exact `MAP_GROUP`/`MAP_NUM` macro syntax by checking existing uses in the codebase. The Altering Cave check at line 318-319 shows the correct pattern.

### Encounter JSON Structure

In `wild_encounters.json`, for each affected route, add a **second** encounter header entry immediately after the existing one. Same `"map"` value, different `"base_label"` (suffix `_SecondWave`). The C code increments `i` by 1 when FLAG_SECOND_WAVE is set, so the second entry is selected.

**CRITICAL ordering rule:** The second entry must come immediately after the first for that map. No other map's entry can be between them.

---

## 3. Post-Wave Encounter Tables

All tables: 12 land slots, distribution 20/20/10/10/10/10/5/5/4/4/1/1%.

### Route 118 — "The Gateway" (Lv 26-30)

The first route post-Wave. The shift must be immediately noticeable.

| Slot | Rate | Species | Min Lv | Max Lv | Notes |
|------|------|---------|--------|--------|-------|
| 0 | 20% | ELECTRIKE | 26 | 28 | Native anchor |
| 1 | 20% | SNUBBULL | 26 | 28 | Fairy corridor (boosted) |
| 2 | 10% | HOUNDOUR | 26 | 28 | First-wave migrant (boosted) |
| 3 | 10% | GROWLITHE | 26 | 28 | First-wave migrant (boosted) |
| 4 | 10% | KECLEON | 26 | 28 | Native |
| 5 | 10% | MANECTRIC | 28 | 30 | Evolved native |
| 6 | 5% | GLIGAR | 27 | 29 | **NEW** Ground/Flying, BST 430, Hyper Cutter |
| 7 | 5% | KANGASKHAN | 27 | 29 | **NEW** Normal, BST 490, Early Bird |
| 8 | 4% | ZANGOOSE | 27 | 29 | Native/migrant |
| 9 | 4% | SEVIPER | 27 | 29 | Native/migrant |
| 10 | 1% | HOUNDOOM | 29 | 30 | **Evolved** Dark/Fire, BST 500 |
| 11 | 1% | ARCANINE | 29 | 30 | **Evolved** Fire, BST 555 |

**Design intent:** Gligar (Ground/Flying, 105 Def, 85 Spe) is a unique typing unavailable elsewhere. Kangaskhan (105 HP, 95 Atk, 90 Spe) signals power escalation. Houndoom/Arcanine at 1% create "legendary moment" encounters.

### Route 119 — "The Jungle Surge" (Lv 27-31)

Bug migration hotspot. The perpetual rain draws apex insects.

| Slot | Rate | Species | Min Lv | Max Lv | Notes |
|------|------|---------|--------|--------|-------|
| 0 | 20% | ODDISH | 27 | 29 | Native |
| 1 | 20% | TROPIUS | 27 | 29 | Native/migrant |
| 2 | 10% | LINOONE | 28 | 30 | Evolved native |
| 3 | 10% | KECLEON | 27 | 29 | Native |
| 4 | 10% | HOUNDOUR | 27 | 29 | First-wave migrant |
| 5 | 10% | GROWLITHE | 27 | 29 | First-wave migrant |
| 6 | 5% | HERACROSS | 28 | 30 | **NEW** Bug/Fighting, BST 500, 125 Atk, Guts |
| 7 | 5% | SCYTHER | 28 | 30 | **NEW** Bug/Flying, BST 500, 110 Atk, Technician |
| 8 | 4% | GLOOM | 29 | 31 | Evolved native |
| 9 | 4% | BRELOOM | 29 | 31 | Evolved native, Fighting |
| 10 | 1% | DRAGONAIR | 30 | 31 | **Evolved first-wave** Dragon, BST 420 |
| 11 | 1% | PUPITAR | 30 | 31 | **Evolved first-wave** Rock/Ground, BST 410 |

**Design intent:** Heracross (125 Atk with Guts) + Scyther (110 Atk/105 Spe with Technician) = "bug invasion" narrative. With the P/S split, Megahorn is Physical Bug 120 BP. Dragonair/Pupitar at 1% = "the first-wave babies have grown up."

### Route 120 — "The Dark Forest" (Lv 27-31)

Shadow creatures drawn to the ancient forest's mystical energy.

| Slot | Rate | Species | Min Lv | Max Lv | Notes |
|------|------|---------|--------|--------|-------|
| 0 | 20% | ABSOL | 27 | 29 | Disaster sensor — now swarming |
| 1 | 20% | KECLEON | 27 | 29 | Native anchor |
| 2 | 10% | MIGHTYENA | 28 | 30 | Evolved native |
| 3 | 10% | ODDISH | 27 | 29 | Native |
| 4 | 10% | MARILL | 27 | 29 | Native |
| 5 | 10% | HOUNDOUR | 27 | 29 | First-wave migrant |
| 6 | 5% | MURKROW | 28 | 30 | **NEW** Dark/Flying, BST 405, Insomnia |
| 7 | 5% | MISDREAVUS | 28 | 30 | **NEW** Ghost, BST 435, Levitate |
| 8 | 4% | TOGETIC | 28 | 30 | Fairy corridor (retained) |
| 9 | 4% | GLOOM | 29 | 31 | Evolved native |
| 10 | 1% | SHELGON | 30 | 31 | **Evolved first-wave** Dragon, BST 420 |
| 11 | 1% | HOUNDOOM | 30 | 31 | **Evolved first-wave** Dark/Fire, BST 500 |

**Design intent:** Absol boosted to 20% — the disaster-sensing species is swarming because it feels what's coming. This is narrative through game mechanics. Murkrow (Insomnia) and Misdreavus (Levitate, immune to Ground/Normal/Fighting) fill the eerie tone. Togetic retained from the Fairy corridor (Cycle 49 — was slot 11 at 1%, now slot 8 at 4% — a small buff to reflect corridor maturing).

### Route 121 — "The Stampede" (Lv 28-32)

Open grassland near Safari Zone becomes a herd migration corridor.

| Slot | Rate | Species | Min Lv | Max Lv | Notes |
|------|------|---------|--------|--------|-------|
| 0 | 20% | CLEFAIRY | 28 | 30 | Fairy corridor (retained) |
| 1 | 20% | POOCHYENA | 28 | 30 | Native |
| 2 | 10% | SHUPPET | 28 | 30 | Native (near Mt. Pyre) |
| 3 | 10% | MIGHTYENA | 29 | 31 | Evolved native |
| 4 | 10% | HOUNDOUR | 28 | 30 | First-wave migrant |
| 5 | 10% | ODDISH | 28 | 30 | Native |
| 6 | 5% | TAUROS | 29 | 31 | **NEW** Normal, BST 490, Intimidate, 110 Spe |
| 7 | 5% | MILTANK | 29 | 31 | **NEW** Normal, BST 490, Thick Fat |
| 8 | 4% | GLOOM | 30 | 32 | Evolved native |
| 9 | 4% | CLEFABLE | 30 | 32 | **Evolved Fairy** BST 483 |
| 10 | 1% | URSARING | 31 | 32 | **NEW ultra-rare** Normal, BST 500, Guts, 130 Atk |
| 11 | 1% | DONPHAN | 31 | 32 | **NEW ultra-rare** Ground, BST 500, 120 Atk/120 Def |

**Design intent:** Tauros (100 Atk/95 Def/110 Spe, Intimidate) + Miltank (95 HP/105 Def/100 Spe, Thick Fat) = "herds migrating through." Ursaring (130 Atk with Guts) and Donphan (120 Atk/120 Def) as 1% ultra-rares add real stakes. Clefable at 4% shows the Fairy corridor species are evolving.

### Route 123 — "The Spillover" (Lv 28-32)

Convergence point where all migration streams meet. Maximum diversity.

| Slot | Rate | Species | Min Lv | Max Lv | Notes |
|------|------|---------|--------|--------|-------|
| 0 | 20% | ODDISH | 28 | 30 | Native |
| 1 | 20% | MIGHTYENA | 29 | 31 | Evolved native (dominant predator) |
| 2 | 10% | GLOOM | 29 | 31 | Evolved native |
| 3 | 10% | KECLEON | 28 | 30 | Native |
| 4 | 10% | HOUNDOUR | 28 | 30 | First-wave migrant |
| 5 | 10% | GROWLITHE | 28 | 30 | First-wave migrant |
| 6 | 5% | PINSIR | 29 | 31 | **NEW** Bug, BST 500, 125 Atk |
| 7 | 5% | STANTLER | 29 | 31 | **NEW** Normal, BST 465, Intimidate |
| 8 | 4% | HOUNDOOM | 30 | 32 | **Evolved** (more common here than 118) |
| 9 | 4% | ARCANINE | 30 | 32 | **Evolved** (more common here than 118) |
| 10 | 1% | NIDOKING | 31 | 32 | **NEW ultra-rare** Poison/Ground, BST 495 |
| 11 | 1% | NIDOQUEEN | 31 | 32 | **NEW ultra-rare** Poison/Ground, BST 495 |

**Design intent:** Route 123 is the "spillover" — migration at critical mass. Houndoom/Arcanine at 4% (vs. 1% on Route 118) shows escalation: what was ultra-rare at the gateway is now merely uncommon. The Nido royals at 1% with massive movepools are the most dramatic wild encounters in the Second Wave.

### Mt. Pyre 1F — "The Haunting Deepens" (Lv 27-31)

The ghost mountain's darkness intensifies. Currently all-Shuppet vanilla — this is a dramatic overhaul.

| Slot | Rate | Species | Min Lv | Max Lv | Notes |
|------|------|---------|--------|--------|-------|
| 0 | 20% | SHUPPET | 27 | 29 | Native ghost |
| 1 | 20% | DUSKULL | 27 | 29 | Native ghost |
| 2 | 10% | SNUBBULL | 27 | 29 | Fairy corridor (retained from Cycle 49) |
| 3 | 10% | VULPIX | 27 | 29 | First-wave migrant |
| 4 | 10% | MEDITITE | 27 | 29 | Native |
| 5 | 10% | HOUNDOUR | 27 | 29 | First-wave migrant |
| 6 | 5% | MISDREAVUS | 28 | 30 | **NEW** Ghost, BST 435, Levitate |
| 7 | 5% | MURKROW | 28 | 30 | **NEW** Dark/Flying, BST 405, Insomnia |
| 8 | 4% | BANETTE | 29 | 31 | Evolved native ghost |
| 9 | 4% | DUSCLOPS | 29 | 31 | Evolved native ghost |
| 10 | 1% | SNEASEL | 29 | 30 | Dark/Ice migrant, Weavile pipeline |
| 11 | 1% | HOUNDOOM | 30 | 31 | Evolved first-wave |

**Design intent:** Transforms the all-Shuppet dungeon into a proper haunted ecosystem. Misdreavus and Murkrow thematically fit. Banette/Dusclops at 4% raise the threat level. Sneasel at 1% is a Weavile candidate (Sneasel->Weavile evolution added in Cycle 61).

**NOTE on Mt. Pyre 1F:** The pre-Wave table is currently all-Shuppet (vanilla). The Second Wave table adds diversity but keeps Shuppet prominent. If the implementation agent wants to also overhaul the pre-Wave table, that's a separate decision — the Second Wave table should work regardless.

---

## 4. NPC Dialogue (8 NPCs)

### NPC 1: Professor Birch PokeNav Call — Route 118
See Section 1 above for full script and dialogue.

### NPC 2: Route 118 Fisherman (Existing Cycle 42 NPC — Before/After)

**Current state:** `Route118_EventScript_SecondWaveNPC` uses `MSGBOX_NPC` with post-wave text already written. Needs conversion to before/after with flag check.

**Updated script:**
```
Route118_EventScript_SecondWaveNPC::
	lock
	faceplayer
	goto_if_set FLAG_SECOND_WAVE, Route118_EventScript_SecondWaveNPC_Post
	msgbox Route118_Text_SecondWaveNPC_PreWave, MSGBOX_DEFAULT
	release
	end

Route118_EventScript_SecondWaveNPC_Post::
	msgbox Route118_Text_SecondWaveNPC_PostWave, MSGBOX_DEFAULT
	release
	end
```

**Pre-Wave text:**
```
Route118_Text_SecondWaveNPC_PreWave:
	.string "I fish here every morning.\n"
	.string "Lately the catches have been\l"
	.string "different. Species I have never\l"
	.string "hooked before.\p"
	.string "PROF. BIRCH says it is part\n"
	.string "of some big migration event.\p"
	.string "I just hope the fishing\n"
	.string "stays good.$"
```

**Post-Wave text (existing Cycle 42 text, preserved):**
```
Route118_Text_SecondWaveNPC_PostWave:
	.string "I was fishing here last week and\n"
	.string "the water was calm. Normal.\p"
	.string "Then yesterday - schools of\n"
	.string "species I have never seen before.\l"
	.string "Not just one or two. Dozens.\p"
	.string "The first migration was strange\n"
	.string "enough. But this second wave\l"
	.string "feels different. More urgent.\p"
	.string "Whatever is happening out there,\n"
	.string "it is sending everything our way.$"
```

### NPC 3: Route 118 Girl (Existing Vanilla NPC — Before/After)

**Current state:** `Route118_EventScript_Girl` uses `MSGBOX_NPC` with vanilla Surf hint text.

**Updated script:**
```
Route118_EventScript_Girl::
	lock
	faceplayer
	goto_if_set FLAG_SECOND_WAVE, Route118_EventScript_Girl_Post
	msgbox Route118_Text_CanCrossRiversWithSurf, MSGBOX_DEFAULT
	release
	end

Route118_EventScript_Girl_Post::
	msgbox Route118_Text_Girl_PostWave, MSGBOX_DEFAULT
	release
	end
```

**Post-Wave text:**
```
Route118_Text_Girl_PostWave:
	.string "I used to see ELECTRIKE and\n"
	.string "not much else on this route.\p"
	.string "Now there are POKeMON I have\n"
	.string "never seen in any book.\l"
	.string "Some are enormous.\p"
	.string "My little brother wants to\n"
	.string "catch one. I told him to wait\l"
	.string "until he is stronger.$"
```

### NPC 4: Route 119 Boy (Existing Cycle 29 NPC — Before/After)

**Current state:** `Route119_Text_ThoughtFlyByCatchingBirdMons` has migration text about "new sounds" and "Pokemon calling." Script label unknown — need to find the script that references this text.

**Implementation agent must:** Find the script event that uses `Route119_Text_ThoughtFlyByCatchingBirdMons` and add a flag branch.

**Post-Wave text:**
```
Route119_Text_Boy_PostWave:
	.string "The jungle is ALIVE now.\n"
	.string "Buzzing. Clicking. Roaring.\p"
	.string "I saw an enormous beetle\n"
	.string "the size of my arm fighting\l"
	.string "something with scythes for\l"
	.string "hands.\p"
	.string "HERACROSS versus SCYTHER.\n"
	.string "Right here. In HOENN.\p"
	.string "The rain does not stop them.\n"
	.string "If anything it makes them\l"
	.string "more aggressive.$"
```

### NPC 5: Route 120 Ranger (NEW NPC — Post-Wave Only)

**Location:** Near Scorched Slab entrance area on Route 120.
**Sprite:** `OBJ_EVENT_GFX_BOY_3`
**Visibility:** Use `FLAG_SECOND_WAVE` as the `flag` field in `map.json` object event (NPC only appears after Second Wave).

**Script:**
```
Route120_EventScript_SecondWaveRanger::
	msgbox Route120_Text_SecondWaveRanger, MSGBOX_NPC
	end
```

**Text:**
```
Route120_Text_SecondWaveRanger:
	.string "I patrol this forest daily.\n"
	.string "I know every tree and trail.\p"
	.string "Something changed last week.\n"
	.string "Black birds with red eyes\l"
	.string "roosting in the canopy.\p"
	.string "Wisps of light drifting\n"
	.string "between the ancient trees\l"
	.string "after dark.\p"
	.string "The ABSOL are everywhere now.\n"
	.string "That species only gathers\l"
	.string "when it senses disaster.\p"
	.string "I am filing a report with\n"
	.string "the RANGER UNION.$"
```

**References:** Murkrow ("black birds with red eyes"), Misdreavus ("wisps of light"), Absol's 20% encounter rate.

### NPC 6: Route 121 Pokefan (NEW NPC — Post-Wave Only)

**Location:** Near Safari Zone entrance on Route 121.
**Sprite:** `OBJ_EVENT_GFX_WOMAN_2`
**Visibility:** `FLAG_SECOND_WAVE` in map.json.

**Script:**
```
Route121_EventScript_SecondWavePokefan::
	msgbox Route121_Text_SecondWavePokefan, MSGBOX_NPC
	end
```

**Text:**
```
Route121_Text_SecondWavePokefan:
	.string "Oh my! Have you seen the\n"
	.string "TAUROS herds on this route?\p"
	.string "They just appeared three\n"
	.string "days ago. A dozen of them\l"
	.string "charging through the grass.\p"
	.string "And MILTANK too! One nearly\n"
	.string "knocked me over!\p"
	.string "The SAFARI ZONE warden says\n"
	.string "they are migrants. He has\l"
	.string "never seen this many new\l"
	.string "species arrive so fast.$"
```

### NPC 7: Fortree City Old Man (Existing Cycle 29 NPC — Before/After)

**Current state:** `FortreeCity_EventScript_OldMan` shows `FortreeCity_Text_EveryoneHealthyAndLively` which already has migration text about Skarmory nesting. Uses `MSGBOX_NPC`.

**Updated script:**
```
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
```

**Post-Wave text:**
```
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
```

### NPC 8: Mauville City Scientist (Existing Cycle 42 NPC — Before/After)

**Current state:** `MauvilleCity_EventScript_SecondWaveScientist` shows migration sensor text. Uses `MSGBOX_NPC`.

**Updated script:**
```
MauvilleCity_EventScript_SecondWaveScientist::
	lock
	faceplayer
	goto_if_set FLAG_SECOND_WAVE, MauvilleCity_EventScript_SecondWaveScientist_Post
	msgbox MauvilleCity_Text_SecondWaveScientist, MSGBOX_DEFAULT
	release
	end

MauvilleCity_EventScript_SecondWaveScientist_Post::
	msgbox MauvilleCity_Text_SecondWaveScientist_PostWave, MSGBOX_DEFAULT
	release
	end
```

**Post-Wave text:**
```
MauvilleCity_Text_SecondWaveScientist_PostWave:
	.string "The readings have gone\n"
	.string "off the scale.\p"
	.string "Our migration sensors on the\n"
	.string "eastern routes are detecting\l"
	.string "five times the biodiversity\l"
	.string "of last month.\p"
	.string "Evolved forms in the wild.\n"
	.string "Species we have only seen in\l"
	.string "foreign research papers.\p"
	.string "PROF. BIRCH calls it a\n"
	.string "Second Wave. I call it\l"
	.string "unprecedented.\p"
	.string "Whatever drove these POKeMON\n"
	.string "from their homelands is\l"
	.string "getting worse.$"
```

---

## 5. Species Verification

All 23 species used in Second Wave encounter tables exist in the codebase:

| Species | Constant Verified | BST | Type |
|---------|------------------|-----|------|
| Gligar | SPECIES_GLIGAR (207) | 430 | Ground/Flying |
| Kangaskhan | SPECIES_KANGASKHAN (115) | 490 | Normal |
| Heracross | SPECIES_HERACROSS (214) | 500 | Bug/Fighting |
| Scyther | SPECIES_SCYTHER (123) | 500 | Bug/Flying |
| Murkrow | SPECIES_MURKROW (198) | 405 | Dark/Flying |
| Misdreavus | SPECIES_MISDREAVUS (200) | 435 | Ghost |
| Tauros | SPECIES_TAUROS (128) | 490 | Normal |
| Miltank | SPECIES_MILTANK (241) | 490 | Normal |
| Ursaring | SPECIES_URSARING (217) | 500 | Normal |
| Donphan | SPECIES_DONPHAN (232) | 500 | Ground |
| Pinsir | SPECIES_PINSIR (127) | 500 | Bug |
| Stantler | SPECIES_STANTLER (234) | 465 | Normal |
| Nidoking | SPECIES_NIDOKING (34) | 495 | Poison/Ground |
| Nidoqueen | SPECIES_NIDOQUEEN (31) | 495 | Poison/Ground |
| Dragonair | SPECIES_DRAGONAIR | 420 | Dragon |
| Pupitar | SPECIES_PUPITAR | 410 | Rock/Ground |
| Shelgon | SPECIES_SHELGON | 420 | Dragon |
| Sneasel | SPECIES_SNEASEL | 430 | Dark/Ice |
| Houndoom | SPECIES_HOUNDOOM | 500 | Dark/Fire |
| Arcanine | SPECIES_ARCANINE | 555 | Fire |
| Clefable | SPECIES_CLEFABLE | 483 | Fairy* |
| Banette | SPECIES_BANETTE | 455 | Ghost |
| Dusclops | SPECIES_DUSCLOPS | 455 | Ghost |

*Clefable retyped to Fairy in Cycle 44/46.

**Flags verified:** FLAG_UNUSED_0x020 (0x20) and FLAG_UNUSED_0x021 (0x21) are available.

---

## 6. Implementation Roadmap

### Cycle 63: Trigger + C Code + Route 118 Dialogue

**Files to modify:**
1. `include/constants/flags.h` — rename FLAG_UNUSED_0x020/0x021
2. `src/wild_encounter.c` — add Second Wave header offset logic
3. `data/maps/Route118/scripts.inc` — add setflag to Steven script, add Birch OnFrame call, convert fisherman + girl to before/after

**Build risk:** Low. Flag rename safe. C code follows Altering Cave pattern. Script additions use standard commands.

**Exit criteria:** Build-clean. FLAG_SECOND_WAVE set by Steven encounter. Birch call fires once on Route 118 post-trigger.

### Cycle 64: Encounter Tables (All 6 Routes)

**Files to modify:**
1. `src/data/wild_encounters.json` — add 6 SecondWave encounter entries

**Build risk:** Low. JSON format well-understood. Must verify placement order.

**Pre-implementation check:** Read each route's current pre-Wave table from JSON to ensure the second entry's placement doesn't break header indexing.

**Exit criteria:** Build-clean. All 6 routes have two encounter headers in the JSON.

### Cycle 65: NPC Dialogue (Routes 119-121, Fortree, Mauville)

**Files to modify:**
1. `data/maps/Route119/scripts.inc` — add post-Wave branch to rain boy
2. `data/maps/Route120/scripts.inc` + `map.json` — add Ranger NPC (post-Wave only)
3. `data/maps/Route121/scripts.inc` + `map.json` — add Pokefan NPC (post-Wave only)
4. `data/maps/FortreeCity/scripts.inc` — add post-Wave branch to Old Man
5. `data/maps/MauvilleCity/scripts.inc` — add post-Wave branch to Scientist

**Build risk:** Low. Dialogue-only changes. New NPC objects require map.json entries.

**Exit criteria:** Build-clean. All 8 NPCs have correct before/after behavior.

### Alternative: Combine Cycles 64+65

Cycles 64 and 65 touch different files (JSON vs. scripts.inc) and can be combined into one cycle if momentum is good. Total: 2 cycles minimum (63 trigger+code, 64 encounters+dialogue).

---

## 7. Player Experience Summary

**Before the Second Wave:**
Routes 118-123 have Hoenn natives with scattered first-wave migrants (Houndour, Growlithe, Snubbull, Clefairy). The migration is "an interesting phenomenon."

**The Trigger Moment (Route 118, post-Norman):**
Steven appears. As he leaves, Birch calls — urgent, excited, worried. "The migration is ACCELERATING. Evolved forms appearing. New species entirely. This is a Second Wave."

**After the Second Wave:**
- Route 118: Gligar swoops by. Kangaskhan in the grass. 1% chance: wild Houndoom.
- Route 119: Bug swarms. Heracross vs Scyther. 1% chance: wild Dragonair.
- Route 120: Absol everywhere. Murkrow in canopy, Misdreavus drifting. 1% chance: wild Shelgon.
- Route 121: Tauros herds charging. 1% chance: wild Ursaring (130 Atk, Guts).
- Route 123: Total spillover. Evolved fire-types at 4%. 1% chance: Nidoking/Nidoqueen.
- Mt. Pyre: Ghost concentration intensifies. 1% chance: Sneasel (Weavile pipeline).

NPCs react across every route. The fisherman is unsettled. The ranger files a report. The old man in Fortree says "this is an invasion." The scientist's sensors are off the scale.

**The meta-effect:** Every patch of grass becomes worth re-exploring. The 1% evolved forms (Houndoom, Dragonair, Shelgon, Ursaring, Nidoking) create memorable encounters. The Second Wave transforms the midgame from route traversal into ecological crisis investigation.
