# NPC Dialogue

All modified NPC dialogue files — Professor Birch, Rival, Villains, Gym Leaders, Elite Four, and flavor text NPCs.

---

## Professor Birch

| File | Cycle | Notes |
|------|-------|-------|
| `data/text/birch_speech.inc` | 24 | Opening sequence → migration mystery |
| `data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc` | 15, 180, **181** | Lab aide + Birch rescue; C180: migration hint; C181: difficulty selection multichoice |
| `data/maps/OldaleTown_PokemonCenter_1F/scripts.inc` | 181, **183** | Difficulty-aware reminder NPC |
| `data/maps/RustboroCity_PokemonCenter_1F/scripts.inc` | **183** | Hiker NPC: difficulty-aware level cap explainer |
| `data/maps/DewfordTown_PokemonCenter_1F/scripts.inc` | **183** | Boy NPC: difficulty-aware |
| `data/maps/MauvilleCity_PokemonCenter_1F/scripts.inc` | **183** | Researcher NPC: difficulty-aware |

## Rival, Villains, Gym Leaders

- **Rival** (C25, 29, 36, 38, 94, 104): Routes 103/110/119, LilycoveCity — 4 encounters rewritten with migration theme
- **Villains** (C27, 36, 38): Maxie (MtChimney), Archie (SeafloorCavern, OceanicMuseum, Harbor)
- **Gym Leaders** (C32, 36, 103, **173**): All 8 pre-battle + migration-themed rematch dialogue. C173: Norman/Winona expanded

## Elite Four & Champion — Cycles 33, 42, **203**, **204**

C203: Rewrote Sidney (Murkrow/Houndoom callbacks), Phoebe (Mt. Pyre grandmother + Corsola_Hoenn intro), Glacia (Route 125 cold + migration pilgrim). Each ends with a question. Phoebe team: Banette → Corsola_Hoenn.
C204: Rewrote Drake (Bagon Colony + Draconid legend) and Wallace (The Gathering + Arcanine_Hoenn). Wallace team: Tentacruel → Arcanine_Hoenn. Drake→Wallace bridge + Hall of Fame setup.

## Flavor NPCs (Collapsed by Era)

**Early-game foreshadowing** (C15, 28, 36, 140, 144, 145, 152, **180**): LittlerootTown→Route 116 migration sightings. 4 glimpse coord_events (R101/102/104/116, flags 0x278-0x27B). Petalburg Woods Pikachu OW sprint (flag 0x27E-0x27F). C180: Birch kids.
**Mid-game escalation** (C29, 94, 95, 141, 149, 153, 154, 159, 160, 162): Weather Institute Dr. Hartley, Meteor Falls Bagon Colony (flag 0x280), Mt. Pyre Restless Dead (flag 0x281), weather omen NPCs (flags 0x282-0x285), route identity NPCs (R110/113/119/123). R119 thunderstorm event (flags 0x27C-0x27D).
**Late-game + The Gathering Storm** (C33, 112, 113, 186, 187, 188, 189, 190, **205**): City atmosphere (Mossdeep/Sootopolis/Pacifidlog badge-gated), ocean route witnesses (R124/126/127/128/131), Deep Migration R128 (flag 0x287), The Gathering R126 (flags 0x288-0x289). C205 "The Exhale": 6 ocean NPCs gain post-Rayquaza resolved dialogue, R126 fog thins.
**Postgame quests** (C116, 118, 120, 135-137, 139, 192, 193, 194, 200, **207**, **209**, **210**): Beast sightings, Primal network, Sky Guardian arc, 4 side quests (Elder's Current/Hartley's Report/Mossdeep Signal/Fog Beneath). C207: Mt. Pyre Coral Mourner NPC. C209: Bagon Colony researcher postgame callback. C210: Deoxys "Second Signal" quest.
