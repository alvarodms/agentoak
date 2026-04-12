# Player Journey Map

> **Maintained by**: Game Designer advisor. Update after cycles that change player-facing content.
> **Budget**: ~100 lines. Collapse old sections when exceeded.

This maps what the player **experiences** hour-by-hour. Use it to identify pacing problems, narrative gaps, and feature clustering.

---

## Hour 0-3: Littleroot → Rustboro (Badges: 0-1)

Dense migration foreshadowing: Birch dialogue (C180), difficulty selection (C181), 4 glimpse events (C144-145), Pikachu sighting in Petalburg Woods (C152), migration NPCs in Oldale/Petalburg. Challenge Mode level caps active from start (C181-183). Redesigned trainers (C146), Roxanne (C130).

**Emotional arc**: Curiosity → wonder (Pikachu) → confidence (first gym)

---

## Hour 3-6: Dewford → Mauville (Badges: 1-3)

Brawly/Wattson redesigned (C130). Meteor Falls Bagon Colony (C153) — strongest mid-game narrative beat. Dr. Hartley at Weather Institute (C141). Routes 110-117 trainers themed (C147). Difficulty NPCs in every PkmnCenter through Mauville (C183).

**Emotional arc**: Escalation → discovery (Bagon colony) → growing concern

---

## Hour 6-10: Fortree → Mossdeep (Badges: 4-7)

**Key moments**:
- Route 119 thunderstorm event with Dr. Hartley (C149)
- Weather omens: permanent sandstorm R111, thunderstorm R119, rain R120, hail R125 (C159-160)
- Mt. Pyre "Restless Dead" event — Misdreavus encounter (C154)
- **Mt. Pyre Exterior: Corsola_Hoenn wild encounter (4%, Lv26-28) + Coral Mourner NPC (C207)** — first mid-game regional form. Player discovers Ghost/Rock bleached coral spirits near graves. NPC explains the connection to Phoebe. Seamless narrative bridge to E4.
- Route identity NPCs: Birdwatcher, Volcanologist, Weather Intern, Berry Researcher (C162)
- Norman expanded (C173), Winona expanded (C173), Tate & Liza redesigned (C131)

**Pacing**: Strongest stretch — weather omens + narrative events + NPC perspectives create layered world.

**Emotional arc**: Alarm (weather changes) → spiritual unease (Mt. Pyre) → growing power

---

## Hour 10-15: Badge 7 → Sootopolis → E4 (Badges: 7-8+)

**Key moments — "The Gathering Storm" arc (v1.7)**:
- Badge-conditional city atmosphere: 6 NPCs across Mossdeep, Sootopolis, Pacifidlog shift tone after Badge 7 (C186)
- Ocean route witnesses: 5 NPCs across Routes 124/126/127/128/131 report migration signs (C187)
- "The Deep Migration" scripted event: Wailord pod + special Wailmer encounter, Route 128 (C188)
- "The Gathering" scripted event: Fog, layered cries, migration convergence approaching Sootopolis, Route 126 (C189)
- Permanent fog on Route 126 after The Gathering — the world physically changed
- Post-Gathering NPC reactions: 3 city NPCs acknowledge the convergence (C190)
- Juan expanded (C173), Victory Road trainers redesigned (C175)
- E4 + Champion redesigned (C132) — migration dialogue present but generic. **v1.9 overhaul planned C203-C205**: specific event callbacks, Corsola_Hoenn on Phoebe, Arcanine_Hoenn on Wallace.

**Pacing**: Four-beat narrative arc fills the Badge 7-E4 gap. City whispers → ocean witnesses → spectacle → dread. Each beat escalates. Permanent fog gives the world tangible weight. Post-Gathering city NPC callbacks reward backtracking.

**Emotional arc**: Unease (city atmosphere) → observation (ocean NPCs) → shock (Deep Migration) → dread (The Gathering) → challenge (Victory Road) → triumph (E4)

**Challenge Mode note**: Level cap active (45 at Badge 7, 50 at Badge 8, 55 at E4).

---

## Hour 15-20+: Post-E4 / Postgame (Badges: 8+Champion)

**Existing legendary saga** (shipped v1.0-v8.0):
- Birch Research Quest (5 stages) → Master Ball
- Migration Tracker Quest (3 stages, catch migrants) → Shell Bell
- Beast release: Raikou → Entei → Suicune (roaming)
- Ho-Oh encounter (Cave of Origin)
- Primal Stirring: investigate anomalies → Groudon/Kyogre encounters
- Sky Guardian: Pacifidlog Elder → Sky Pillar → Rayquaza
- World reaction NPCs acknowledge resolution

**v1.8 side quests** (shipped C192-200):
- "The Elder's Current" (Pacifidlog) — reversed ocean currents → Hoennian Corsola (Ghost/Rock)
- "Hartley's Field Report" (Weather Institute) — permanent weather data → Hoennian Growlithe (Water)
- "The Mossdeep Signal" (Space Center) — cosmic echo of Primal Stirring → Star Pieces + Rare Candy
- "The Fog Beneath" (Route 126) — Gathering opened underwater passage → Lapras (Lv50)

**Emotional arc (parallel tracks)**:
- Legendary: wonder (beasts) → awe (Ho-Oh) → urgency (Primal) → peace (Rayquaza)
- Side quests: curiosity → investigation → discovery (regional forms) → acknowledgment

**Post-Rayquaza world state**: 5 NPCs react (Birch, Pacifidlog Elder, Fortree Man, Weather Scientist, Sootopolis Man). **"The Exhale" (C205)**: 6 additional NPCs resolve from dread — R124 CuriousDiver, R126 WarmSwimmer, R127 TrenchFisherman, R128 ScaredDiver, R131 LoneSwimmer, Mossdeep StormResearcher. R126 fog thins from heavy to diagonal. StormResearcher connects weather omens to resolution. LoneSwimmer names the theme: "I think HOENN just exhaled."

---

## Known Gaps

- ~~**In-battle level cap feedback**~~: **RESOLVED C207.** Two-page battle message: "{MON} gained {EXP} EXP. Points!" → "EXP reduced by the level cap." Displays every time the cap triggers in Challenge Mode.
- ~~**Post-Rayquaza NPC gap**~~: **RESOLVED C205.** 6 ocean/atmosphere NPCs gain resolved dialogue. R126 fog thins. StormResearcher bridges weather omens → resolution.
- **Regional form discoverability** (audit C201): **PARTIALLY RESOLVED C207.** Corsola_Hoenn at Mt. Pyre Exterior (4%) gives players their first regional form encounter between Badges 5-7. Full accessibility (multiple forms, routes) continues C208-C209.
- **Bagon Colony researcher** (C153): Appears once, never revisited. Dangling thread. Scheduled C209.
- **E4 dialogue staleness** (audit C201): Migration dialogue from C33 is generic — no callbacks to v1.1-v1.8 events. Scheduled C203-C204 overhaul.
- ~~**Weather omens → Gathering gap**~~: **RESOLVED C205.** Mossdeep StormResearcher's resolved text: "My colleagues at the WEATHER INSTITUTE say the anomalous patterns are stabilizing too."
