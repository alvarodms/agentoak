# Player Journey Map

## Hour 0-3: Littleroot → Rustboro (Badges 0-1)

Dense migration foreshadowing: Birch dialogue (C180), difficulty selection (C181), 4 glimpse events (C144-145), Pikachu in Petalburg Woods (C152). Challenge Mode level caps active from start. Mom's migration send-off (C224): Poké Balls + warm dialogue replacing Running Shoes. **Roxanne now references Bagon_Hoenn near Meteor Falls (C244)** — academic curiosity, "living stone" hide. Team includes Bagon_Hoenn (Dragon/Rock).

**v2.3 shipped (C261-262)**: Lotad_Hoenn (Electric/Grass) on Route 102 at 20% (C346) — first regional form encounter, pre-Badge 1. Shroomish_Hoenn (Poison/Ice) in Petalburg Woods at 10% (C346) — second discovery moment, the "wrong mushroom." Both coexist with vanilla counterparts. **3 trainers carry Hoenn forms (C262)**: Bug Catcher Rick (Route 102, Lotad_Hoenn Lv7), Bug Catcher James (Petalburg Woods, Shroomish_Hoenn Lv8), Lass Haley (Route 104, Lotad_Hoenn Lv9). Rick and James mention their finds; Haley's intro/defeat are rain lines only since C365 (her post-battle "sparks when it rains" stays).
**FIELD NOTES key item (C324)**: given with the Pokédex; pages 1-4 open from minute one and gain red ink on catch. Den pages open on badges 5/6/8. **v3.3 First Ink (C361-C364)** adds four in-person beats to Hours 0-2; see the retrospective below.
**Red Ink reachability (C346)**: the payoff gate is 3 of pages 1-4. Casual one-pass estimate (≈8 grass encounters per route, ≈5 on B2F): ≥3 seen ≈46% (was ≈10%); a player hunting from the notebook needs ≈10 encounters per page. Playtest question: what page count did you have at Badge 5?

**Emotional arc**: Curiosity → wonder (Pikachu) → surprise (electric lily pad / frost mushroom) → confidence (first gym)

### v3.3 First Ink — retrospective (C365)

Measured on the emulator, not estimated. Every row is proven by a playtest; `first-ink-chapter-in-order` runs the four field beats on one save in story order (Route 102 catch → Route 104 schoolkid → Woods catch → forager → IVAN) and shows no earlier flag hides a later NPC.

| Beat | What the player sees change before anyone explains it | Playtest that proves it | How a player misses it |
|---|---|---|---|
| Pen moment (C361) | Back in the field after the first LOTAD_HOENN / SHROOMISH_HOENN catch: "!" over the player, page-turn sound, only their own red ink line, then FIELD NOTES sits on SELECT | route102-first-catch-ink, woods-first-catch-ink, first-ink-chapter-in-order | Only one per save (one flag for both pages): whichever page-1/2 map comes first. The second catch is silent (chain asserts it) |
| Schoolkid turn (C362) | The boy facing the sea breaks off mid-recital ("Hides from st..."), "!", turns east toward Petalburg and stays turned | route102-catch-then-route104-skeptic, first-ink-chapter-in-order | Never talks to him after the catch; facing the sea he reads as scenery |
| Forager walk (C363) | She goes quiet, looks back at the light and walks west out of view; later found in the cold patch (11,24). With the boy turned first she adds "That boy stopped reading his page too." | woods-catch-then-forager-walks, first-ink-chapter-in-order | Never talks to her with Shroomish_H caught (10% in the woods) |
| IVAN's rain (C364) | He quotes Birch's printed page 1, the sky turns to rain, then his Water team is walled by a Lotad_H | route104-ivan-rain-lotad-wins, -rain-no-lotad, first-ink-chapter-in-order | Sight 0: must be talked to. The heal needs RAIN DISH; a LIGHTNING_ROD Lotad_H sees no heal (the wall still shows); no Lotad_H in the party = rain but no wall |
| Pokénav report (C331, first verified C365) | Birch's rating call runs on into the names of the people the player changed, then "Keep the pen." | pokenav-birch-red-ink-report, -two-pages-no-report, -worst-case-report | Needs 3 inked pages, so Gligar_H (Granite B2F, 10%) at the earliest: around Hour 5+. Only if the player calls Birch; nothing prompts it |

- **Boxes before the first red ink** (chain transcript): 5 battle messages (appeared, MASTER BALL, Gotcha, Pokédex data, nickname), then 1 field page ("SAGE opened FIELD NOTES and took out a pen."); the ink is the 2nd field page. The C360 notebook read had it on the 5th.
- **Pages mentioning LOTAD from the catch to IVAN**: 4 battle messages + 5 field pages (schoolkid 2, IVAN 3; pen moment and forager 0), out of 18 field pages on the whole chain (pen 3, schoolkid 6, forager 6, IVAN 3).
- **First beat a player without Lotad_H can see**: IVAN's rain (ungated).
- **Pokénav budget**: worst case (7 pages, every den margin, the doubt, all-found rumour, national dex, 7-letter name) measured 834 B of gStringVar4's 1000; the report is kept. Static ceiling (longest rating tier) is check_matchcall_len 918 B.
- **Haley cut (C365)**: her intro "acting strange... different from normal" and defeat "Something is changing in Hoenn... Can you feel it?" told the player the theme before the notebook showed it, on the same route as the schoolkid and IVAN. Now "Let's battle before the clouds roll in!" / "Oh! I should have waited for the rain." (route104-haley-rain-lines).
- **Verdict**: Hours 0-2 are full. v3.4 adds nothing to Routes 102-104 or Petalburg Woods; it goes to Hours 3-6 (Dewford, Brawly, Routes 105-110, Slateport, Mauville), within the D1 no-lead rule.

---

## Hour 3-6: Dewford → Mauville (Badges 1-3)

Brawly (Gligar_Hoenn from tidal pools, Gliscor_H T4+) and Wattson (Lotad→Lombre→Ludicolo_Hoenn line across 5 tiers, rain at T4-T5) rebuilt C268-271; dialogue subtracted C299 to sensation, not exposition. Meteor Falls Bagon Colony (C153). Route 113: Vulpix_Hoenn (Ice/Fairy) 10% (C346) Lv21-22 + FrostTracker (C208); Jaylen/Madeline carry it (C244). Granite Cave B2F: Gligar_Hoenn 10% (C346) Lv10-13 (C250). **Red Ink believers**: Granite Cave B1F hiker (P3, C329) and Route 113 ash picnicker (P4, C330) — see walkthrough below.

**(planned v3.4) Route 109 "Storm watch" (C368)**: with the Route 104 schoolkid turned (0x35), the sandcastle kids face the sea with a LOTAD DOLL on the sand; Tuber TOBY battles (Plusle/Minun) and loses with "Heard it from a kid on 104." Miss: vanilla sandcastle kids.
**(planned v3.4) Mauville "Half a fact" (C369)**: ungated Youngster DAX at Wattson's door fights at once with a pure-Ground team built on "WATTSON's LOTAD is ELECTRIC"; Electric fails on him, Grass hits. The stale low point. Miss: a youngster by the gym, normal fight.

**Emotional arc**: Escalation → discovery (Bagon colony, cave creature) → wonder (ice fox in ash)

---

## Hour 6-10: Fortree → Mossdeep (Badges 4-7)

**Flannery references Pinsir on Route 112 (C244)** — fire-breathing adaptation, grandpa legacy. Team includes Pinsir_Hoenn (Bug/Fire). **Route 112 trainers (Bryant, Brice) carry Pinsir_Hoenn (C244)**. Route 119 thunderstorm (C149). **Rival Route 119 now carries Stantler_Hoenn (C244)** — Ghost/Grass disruptor with Hypnosis+Leech Seed. Weather omens: sandstorm R111, thunderstorm R119, rain R120, hail R125 (C159-160). Route 112: Pinsir_Hoenn (Bug/Fire) 5% Lv21-22 (C230). Route 119: Stantler_Hoenn (Ghost/Grass) 4% Lv26-28 (C231). Mt. Pyre "Restless Dead" + Corsola_Hoenn 4% Lv26-28 (C154, C207). **Mt. Pyre starlight Torchic (C312)**: a visible Torchic stands in the summit fog at Exterior (22,13). It is a one-time static Torchic_Hoenn Lv30 holding a Star Piece, If the player runs or knocks it out, it fades and comes back the next time they enter the map; only a catch removes it for good (true since the C315 den fix: before that, a KO or flee hid it permanently). Two optional cue signs point to it: a cold scorch mark at (11,31) in the sunny lower half and glowing frost prints at (27,21) by the fog line. Route identity NPCs (C162). **Norman's team now includes Farigiraf (Normal/Psychic, C268)** — replaces Kangaskhan in initial fight, Vigoroth/Linoone in rematches. Calm Mind+Psychic+Shadow Ball core forces the player to rethink pure-Normal counter strategies. **Norman dialogue rewritten (C269)**: intro references Farigiraf teaching him "NORMAL isn't as simple as I thought," defeat has dual-layer Psychic foresight ("both sensed your strength") + father who knew his child would surpass him. Norman/Winona/Tate & Liza expanded. **Echo dialogue layer (C232)**: R112 Hiker (Pinsir+Stantler), R113 FrostTracker extended (Vulpix+Pinsir), R119 Ecologist (all 4 forms→Hartley), WeatherInstitute Hartley badge-gated evolution, Fortree ChangedTrainer (player palette).

**Pacing**: Strongest stretch — weather omens + narrative events + NPC perspectives.

---

## Hour 10-15: Badge 7 → E4 (Badges 7-8+)

**"The Gathering Storm" arc (v1.7)**: City atmosphere NPCs (C186) → ocean witnesses (C187) → Deep Migration R128 (C188) → The Gathering R126 (C189) → permanent fog + post-Gathering callbacks (C190). Victory Road redesigned (C175). E4 + Champion redesigned with cross-gen evos (C203-204, C212-218). **Drake's team now includes Bagon_Hoenn (Dragon/Rock, C268)** — replaces Altaria across all 5 teams. Rock Head + Double-Edge combo with Hard Stone-boosted Rock STAB. **Drake dialogue rewritten (C269)**: intro now specifically references Bagon_Hoenn transformation — "young ones changed, harder scales, stone in their blood. I called it strength." Defeat: "born of HOENN's changing stone." Emotional register: reverence/pride toward the native dragon's evolution.
**Wallace Gym 8 (C309)**: Wallace has come home and leads Sootopolis Gym; Juan stands beside him (cameo NPC, pre/post-badge lines). Water-first team, Milotic ace, Hoenn Arcanine as the one migration species (unique to him). After HM Waterfall he fades from the city to wait in the Gym. Post-battle hands the player to Steven ("Show him what you have seen"). Hour-feel: homecoming + passing the torch, not a migration gallery.
**Meteor Falls crystal Treecko den (C315)**: Once the player has Waterfall after Badge 8, they can reach Meteor Falls B1F_2R. A crystal-leaved Treecko stands at (7,4) beside the TM Dragon Claw ball. It is a one-time static Treecko_Hoenn Lv40 holding a Moon Stone, and it comes back until caught (StaticDen pattern). Cues: a grooved meteorite chunk on B1F_1R (19,5) next to the B1F_2R entrance ("the cuts are too clean for claws"), a silver leaf at the B1F_2R entrance shelf (8,14), and Steven's chalked note beside the doll at (8,3) ("Not mine to collect. Some things should be found. - S."). That note sets up the Champion fight, where Steven has all three Changed starters. Hour-feel: a quiet reward for exploring before the League.
**Shoal Cave titan Mudkip den (C318)**: At low tide, Shoal Cave's Lower Room holds a titan Mudkip at (18,6), a one-time static Mudkip_Hoenn Lv38 holding a Shell Bell (StaticDen, comes back until caught). Cues: webbed prints at the Entrance (13,29), whose text changes with the tide, and a tide-pool sign (18,7) beside the doll. No Steven note, on purpose. At high tide the room can't be reached.
**Den chapter — Red Ink pages 5-7 (designed C333, builds C334-C336)**: the den believers sit in the Badge 6→8 stretch, after the P1-P4 believers (Hours 0-6) and the C331 Birch report. Mt. Pyre (first reached after Badge 6, cap 42): a Hex Maniac mourner refuses to speak of the summit "soul-light" until you catch the starlight Torchic, then battles you to prove you carry it with respect, and afterwards faces the graves (combat). Shoal Cave at low tide (Badge 7, cap 48): a sailor trades his Corsola_Hoenn for a fresh-water Barboach and then keeps the titan pool (bargaining). Meteor Falls B1F_2R (after Badge 8 Waterfall, pre-Champion): re-enter after catching the crystal Treecko and Steven has chalked a gentle correction under his old note, which you copy grey into page 7 (humility; the only time someone corrects the player). Hour-feel: the red pen stops being one-directional just before the summit.
**Birch's Field Notes (C319)**: Asking Birch to rate the Pokédex (by Pokénav call or in person) now ends with "I keep rereading my old notes…" and one hint per den the player can reach but hasn't caught: Mt. Pyre's starlight Torchic after Badge 5, Shoal Cave's tide-pool Mudkip after Badge 6, Meteor Falls' crystal Treecko after Badge 8. Each hint starts with a line about what that starter used to avoid ("TORCHIC shun mountains"). A hint goes away once its den is caught. Once all three are caught, Birch says the old lines are "crossed out by you." This is the pull that sends players back to dens they walked past.
**Steven Champion (C308)**: Cradily → Choice Band Donphan → Sceptile_H/Swampert_H/Blaziken_H → Metagross. The player has ONE Changed starter; Steven has ALL THREE. Two collectors recognizing each other, no exposition.
**Team Magma Quiet Reckoning (C248)**: Tabitha's defeat text cracks across 3 encounters; Magma Hideout grunts carry Pinsir_Hoenn; Courtney's Terra Cave Ninetales_Hoenn is her silent adoption of the new world.
**Wally's Migration Bond (C246→C270)**: VR_1 Ninetales_Hoenn; VR_2-5 Altaria + Breloom_Hoenn; dialogue ties his team to the Petalburg Woods frost Shroomish. VR silent swaps: Edgar/Samuel Mamoswine, Owen Weavile.
**Villain signatures (C316)**: Magma = land (Maxie Camerupt ace, Weezing/Rhydon/Nidoking lines; Tabitha Houndoom ace + Muk/Magmar), Aqua = sea (Archie Sharpedo ace + Wailord/Crobat/Gliscor_H; Shelly Huntail ace; Matt Poliwrath ace). Each boss names its ace in pre-battle text. **Archie's Gliscor_Hoenn (C251)**: Seafloor Cavern team includes Gliscor_Hoenn (Water/Rock). The leader of Team Aqua has adopted a creature born from the intersection of ocean and stone — the region's transformation is systemic, reaching even the faction leaders.

**Emotional arc**: Unease → observation → shock → dread → triumph (Steven's Changed Three = "the migration was mastered by someone before you")

---

## Hour 15-20+: Postgame

**Legendary saga**: Birch Quest → Migration Tracker → Beasts (roaming) → Ho-Oh → Primal Stirring (Groudon/Kyogre) → Sky Guardian (Rayquaza).
**v1.8 side quests**: Elder's Current (Corsola_Hoenn) → Hartley's Report (Growlithe_Hoenn) → Mossdeep Signal (Star Pieces) → Fog Beneath (Lapras). **v1.9 "The Second Signal"**: Mossdeep terminal → Deoxys Lv70. Postgame shifts from resolution to new mystery.
**v2.1 "The Resonance" (C233)**: After Deoxys, terminal begins SENDING a signal to Meteor Falls + Route 131. Player investigates both: pulsing meteorites underground, alien luminescence beneath the waves. Returns to learn: "This isn't a message. It's a handshake." Cosmic thread left open — something knows Hoenn answered. Star Piece ×2 reward. Rare Candy reward at Mossdeep Residue visit (C237).
**"The Exhale" (C205)**: 6 ocean NPCs resolve from dread. R126 fog thins. "I think HOENN just exhaled."
**Bagon Colony resolution (C209/C215)**: Researcher reports physical changes → Bagon_Hoenn encounter Meteor Falls B1F_2R.
**Mt. Chimney Postgame Magma Grunt (C248)**: Lone ex-Magma member appears after Champion, stares south at the landscape. "The land's the same size, but there's more of everything anyway." Confused deflection, not redemption.
**Reckoning Rematches (C326)**: two optional villain epilogue fights after game clear. Maxie stands at the Mt. Chimney meteorite machine measuring the crater (Lv64-67, Camerupt 70 Eruption; key is Water/Ground). Archie watches the Route 128 spot where Kyogre surfaced (rain team Lv64-67, Sharpedo 70; key is Electric/Grass, Thunder in his rain). Both admit the land and sea grew without them, and their ex-grunts' repeat lines point the player to them. YES/NO offer, one win each.
**Postgame Rival Battle (C280)**: Rival appears in Littleroot Town with full 6-mon team including Changed Three form matching their starter. Lv70-73, IV 200. Narrative capstone — rival traveled Hoenn too and raised what the migration brought.
**Juan Duet (C322)**: after game clear, Juan (Sootopolis Gym 9,2) offers one Double Battle: Luvdisc/Ludicolo then Vaporeon/Gorebyss (Lv66-72, rain/Helping Hand). Win → Mystic Water, and Wallace says "You still lead, you know." A teacher-student closing beat, not a power spike.
**Changed Three Gift (C279, reactive C319)**: Birch offers the Changed Three starters postgame. Before the offer he reacts to each den: "You found the starlight TORCHIC on MT. PYRE before I did!" if it's caught, or "Something still glitters in the fog atop MT. PYRE" if not. The same goes for Meteor Falls Treecko and Shoal Cave Mudkip. Then he says the three "hatched here at the lab, from eggs the migration left behind." C319 fix: the Mudkip ball now really gives SPECIES_MUDKIP_HOENN. From C279 to C318 it showed and gave vanilla Mudkip.

**v3.1 "Taken at Their Word" (designed C347, all three shipped C348-C350, all covered by playtests since C357-C360; playtest steps 44-46)**: postgame + page species caught. A (C348, shipped) Route 106 cave mouth: Granite hiker alone at the tide line 54,15 (moved from 54,11 in C354, one row above the cave path), back to the land, "They'll come"; B1F empty (P3). B (C349, shipped) Route 119 20,110: storm-chaser brings the rain, Ludicolo_H/Thunder team (P1). C (C350, shipped) Route 113 38,5: Camper ELLIS quotes page 4 ("Cold fur in the falling ash. It's in red.") facing the ash picnicker, Vulpix_H 54 / Ninetales_H 56 with Hail as one move of four (may never be used), no weather change; once beaten both stand side by side facing east (P4). Page 2 gets no beat.

**Postgame: loud vs quiet beats (C352).** LOUD (fight/legendary/gift): legendary saga, v1.8 quests, Deoxys, Resonance, Reckonings, postgame rival, Juan duet, Changed Three gift, TESSA, ELLIS. QUIET (someone standing somewhere): Route 106 tide hiker (no other postgame draw to that beach), ex-Magma grunt, Exhale ocean NPCs, Route 104 coda lesson (reached via the Lilycove doubt).

**What the player should see first (before any text box):** A = a hiker on Route 106 sand facing the sea, the Granite B1F spot empty; B = a parasol lady on Route 119 turns up, the sky darkens and flashes before the battle; C = camper and picnicker facing each other in the ash, both face east after the win; T1 = six trodden tiles ring the pair and never regrow ash (checklist 46b).
 ELLIS: Hail is an AI flourish only (battle_ai_scripts.s:2261-2276); on the suite seed he never set it in 3 turns (C360), and turn 1 has no battle weather (playtest).

---

## Red Ink believers — static walkthrough (C330)

Built by reading each map.json object and talk script (C330), not from notes. "Caught" = the page's species is Pokédex-caught (`ScriptCheckPokedexCaught`, the same truth as `IsFieldNotesPageInked`). Position/facing changes come from `EventMacro_DexBelieverPlace` in each map's ON_TRANSITION, so they show on the next map load, not in the scene where you catch. Exception (C362): the Route 104 skeptic turns only when shown the LOTAD in person (flag-gated facing).
Per-believer object/tile/label table (C330): git history; the map scripts are the source of truth and every state is now a playtest (believer-*).
Trace result (C330): no bug found. No branch is unreachable (the picnicker's rumour needs 2 *other* pages inked, since her own page is not inked in that branch; reachable from any two of P1-P3, or with den pages). No item can be given twice. Since C334 every believer has an in-scene beat (the skeptic turns FACE_RIGHT right after his Corrected line).
**Emulator coverage (C360)**: all four believers, Lilycove doubt and the coda lesson are covered by passing playtests (pokeemerald/playtests/).

### Red Ink payoff (C331; emulator-verified C358/C360/C365)
Report fires at CountInkedFieldNotePages() ≥ 3 (cover turns to CoverYours at the same count). States (2 pages: no report; 3+: Open → names → Believed → Close; dens only: OnlyYou; Champion's Room never reports; postgame lab offer once per visit via FLAG_TEMP_1) are proven by field-notes-*, birch-bookshelf-*, birch-postgame-offer-* and pokenav-birch-* playtests. Pokénav worst case measured 834 B / 1000 (static ceiling 918 B). Old static table: git history C331.
