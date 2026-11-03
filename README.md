🌳 Agent Oak

[![Agent Oak Cycle](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml/badge.svg)](https://github.com/alvarodms/agentoak/actions/workflows/agent-cycle.yml)
[![Powered by Claude](https://img.shields.io/badge/powered_by-Claude-blueviolet?logo=anthropic)](https://www.anthropic.com)
[![Base ROM](https://img.shields.io/badge/base_rom-pokeemerald-green?logo=gameboy)](https://github.com/pret/pokeemerald)

**An autonomous AI agent that explores, learns, and builds a Pokemon Emerald ROM hack — one cycle at a time.**

Agent Oak is powered by Claude and operates on the [pokeemerald](https://github.com/pret/pokeemerald) decompilation. It works in iterative **cycles**: planning what to do, reading and modifying source code, building the ROM, reflecting on results, and remembering what it learned for next time. It runs unattended on a schedule via GitHub Actions, and the community can interact with it through GitHub Issues.

> *This README is maintained by Agent Oak itself. It reviews and updates this page at the end of each cycle when player-facing changes are made.*

---

## The Game: Legends of Hoenn

Hoenn's ecosystem is changing. A migration event has drawn rare Pokemon from distant regions — Larvitar scaling Mt. Chimney, Sneasel hunting on the Jagged Pass, Electabuzz surging through New Mauville. Gym leaders have adapted their teams. The player arrives at the perfect moment.

**Legends of Hoenn** is a complete reimagining of Pokemon Emerald, built one cycle at a time by an autonomous AI. Every route, every gym, every rival battle has been redesigned around a single premise: what happens when the whole world's Pokemon come to Hoenn?

### The Migration

- **Pseudo-legendary starters** — Larvitar, Bagon, and Dratini replace the originals
- **73 routes + 34 dungeons** redesigned with thematic encounter tables reflecting the migration ecology — every route has a unique identity, from ghostly Mt. Pyre waters to Horsea colonies and toxic shipwreck seas
- **Ocean route differentiation** — all 17 sea routes feature unique species, themed ecosystems, and tiered fishing rewards; Tentacool/Wingull monoculture replaced with Kingdra, Lanturn, Mantine, Relicanth, and other rare 1% catches
- **6 new species** — Riolu, Lucario, Gible, Gabite, Garchomp, and Weavile added as migration arrivals
- **6 cross-generation evolutions** — the migration unlocked latent potential in species already living in Hoenn. Dusclops evolves into Dusknoir, Murkrow into Honchkrow, Snorunt into Froslass (via Dawn Stone), Piloswine into Mamoswine, Girafarig into Farigiraf, and Hoennian Gligar into Hoennian Gliscor. Elite Four members and gym leaders field these evolved forms — Tate & Liza share a Farigiraf, Glacia commands Froslass and Mamoswine, and Archie leads with Hoennian Gliscor — making their teams feel modern and complete
- **19 migration species** carry thematic wild held items
- **Hoennian regional forms** — the migration did not just bring new species; it changed species already here. Hoennian Corsola (Ghost/Rock), Hoennian Growlithe (Water), Hoennian Arcanine (Water/Fire), Hoennian Bagon (Dragon/Rock) — a fossil variant discovered in the depths of Meteor Falls — Hoennian Vulpix (Ice/Fairy) and Hoennian Ninetales (Ice/Fairy), ice foxes adapted to the volcanic ash of Route 113, Hoennian Pinsir (Bug/Fire), a volcanic beetle forged in Route 112's heat, Hoennian Stantler (Ghost/Grass), a forest spirit glimpsed in Route 119's perpetual rain, Hoennian Gligar (Water/Rock), a teal scorpion-bat whose pincers have calcified in Granite Cave's mineral-rich seawater, Hoennian Lotad (Electric/Grass), a lily pad that became a natural capacitor in Route 102's electrified ponds, and Hoennian Shroomish (Poison/Ice), a cold purple mushroom whose cryogenic spores frost the warm floor of Petalburg Woods. Both early-game forms evolve into fully realized final forms: Hoennian Lotad becomes Lombre then Ludicolo, a fast Electric/Grass special sweeper that dances through thunderstorms, while Hoennian Shroomish becomes Breloom, a cryogenic brawler with frost-hardened fists and dual priority attacks. Some forms are discovered through postgame quests; others wait in the wild for trainers sharp-eyed enough to find them
- **The Changed Three** — even Hoenn's original starter trio was not immune to the migration. A steel-bladed Treecko (Grass/Steel) lurks in Meteor Falls' mineral depths (and after you earn Waterfall, a crystal-leafed one waits in the deepest chamber, a guaranteed Lv40 encounter holding a Moon Stone, found by following grooved stones, a silver leaf, and a chalked note signed "S."), a fey-fire Torchic (Fire/Fairy) perches on the sacred slopes of Mt. Pyre (and one stands openly in the summit fog, a guaranteed Lv30 encounter holding a Star Piece, hinted at by cold scorch marks and glowing frost prints along the trail; knock out or flee from either visible den Pokémon and it returns on your next visit, since only a catch ends the hunt), and a titan Mudkip (Water/Fighting) trains in Shoal Cave's tidal chambers (and at low tide one stands in the Lower Room, a guaranteed Lv38 encounter holding a Shell Bell, hinted at by webbed prints near the entrance and a tide pool beside it) — each at 4% encounter rate, rare enough to feel like a genuine discovery. All three evolve through full three-stage lines into Sceptile (Grass/Steel), Blaziken (Fire/Fairy), and Swampert (Water/Fighting), and can learn TMs and HMs like their originals. Stuck? Ask Professor Birch to rate your Pokédex (in person or by Pokénav) and he adds a page from his field notes: a single hint pointing to the nearest den you can reach but have not yet cleared. After completing the National Dex, he offers one of these changed forms as a gift instead of the Johto starters, and his words change with what you have already found — praise for the dens you cleared, a nudge toward the ones you have not
- **Birch's Field Notes** — along with the Pokédex, Professor Birch hands you his old field notebook (a key item, usable from the bag or registered to SELECT). Each page is one of his confident beliefs about where Hoenn's Pokémon live, and each one is wrong. Catch the Hoennian Lotad, Shroomish, Gligar and Vulpix, and the three Changed Three den Pokémon, and that page gains your correction in red ink, signed with your name. The cover keeps count, the den pages open as your badges take you within reach, and a taped last page waits for anyone who inks them all. Older saves receive the notebook the next time they talk to Birch. Not everyone has heard yet: on Route 104 a schoolkid reads Birch's Lotad page aloud, word for word, and watches the sea. Show him a Hoennian Lotad of your own and he turns around and asks to borrow your red pen. Deep in Petalburg Woods, an old forager has waited twelve springs in the warm clearing because Birch wrote that Shroomish never grow cold; show her the frosted Hoennian Shroomish and the next time you pass she will be standing in the cold undergrowth instead, and she has heard what happened to that schoolkid too. In Granite Cave, a proud hiker keeps his back to the deep ladder and will not even turn to face you, because Birch wrote that Gligar fear water. Bring him a Hoennian Gligar and he turns, falls quiet, hands over a Hard Stone, and faces the deep from then on. And on ash-covered Route 113, a cheerful picnicker has camped by the warmest rocks for three days, because Birch wrote that Vulpix love heat. Show her a Hoennian Vulpix and she bursts out laughing, and from then on she stands out in the open ash. Ink three pages and the notebook changes with you: the cover gains your name in red beside Birch's, each believer's page gets a red margin note on what changed, and Birch himself, in person or over the Pokénav, reads your red ink aloud and names the people it reached. The dens have believers of their own: on the Mt. Pyre summit, a Hex Maniac named Isolde watches the fog for her grandmother's soul-light, and once you catch the starlight Torchic she asks you to prove you carry it with respect — in battle.
- **Environmental storytelling** — the world notices its own changes. Hikers, researchers, and scientists across the mid-game cross-reference each other's regional form sightings, building a connected ecological narrative. Return to the Meteor Falls researcher after encountering Hoennian Bagon and he'll acknowledge what you've seen: "DRAGON and ROCK, fused into something new. They dream of enduring." NPCs remember, react, and evolve alongside the player
- **Mom's migration send-off** — your journey begins with purpose. Instead of Running Shoes, Mom hands you 5 Poke Balls and shares what she's heard about the migration. The world is changing before you even step onto Route 101
- **Scripted migration events** — witness the migration firsthand: a Pikachu dashes across your path in Petalburg Woods before Badge 1, a Bagon colony echoes through Meteor Falls after Badge 4, restless Misdreavus haunt Mt. Pyre's summit after Badge 6, a thunderstorm rages on Route 119 with weather-displaced Pokemon, a Wailord pod shakes the ocean on Route 128 — culminating in a special encounter with a curious young Wailmer — and on Route 126, fog rolls in as layered Pokemon cries converge toward Sootopolis in a moment the player can only witness, not fight
- **Weather omens** — Hoenn's climate destabilizes as you earn badges: sandstorms engulf Route 111 after Badge 5, thunderstorms rage on Route 119 and downpours drown Route 120 after Badge 6, and hail blankets Route 125 near Shoal Cave after Badge 7 — four routes transformed, foreshadowing the Primal Stirring
- **Migration narrative arc** — NPCs across Hoenn react to the migration, from Birch's earliest research notes through Weather Institute scientists tracking atmospheric anomalies, ocean divers reporting vast shapes below the surface, and late-game cities buzzing with unease to postgame revelations

### Battle System Upgrades

- **Gen IV physical/special split** — each move has its own Physical, Special, or Status category
- **20 new Gen IV/V moves** — Night Slash, Stone Edge, Dragon Pulse, Close Combat, Brave Bird, Flare Blitz, Shadow Claw, Nasty Plot, Ice Shard, Energy Ball, and more fill the physical/special gaps the split created
- **Full learnset parity** — every new move is learnable by player Pokemon through level-up across 58 species
- **Move category icons** in the battle UI so you always know what you're picking
- **Fairy type** fully implemented with type matchups, STAB, and AI awareness
- **6 custom abilities** — each expresses how a regional form's ecology changed its biology:
  - *Toxic Touch* (Deoxys Hoenn) — 30% chance to poison on any damaging move, rewarding the glass cannon playstyle
  - *Frozen Spore* (Breloom Hoenn) — 20% chance to freeze on contact moves, turning the cryogenic brawler's fists into weapons of winter
  - *Scalding Touch* (Arcanine Hoenn) — 33% chance to burn on contact moves, channeling the undersea fire that forged a Water/Fire predator
  - *Tempered Blade* (Hoennian Treecko line) — Steel-type contact moves are more likely to land critical hits
  - *Fey Flame* (Hoennian Torchic line) — every attack hits burned foes 1.5x harder, and it announces itself the moment the Pokemon enters battle, so you see a Will-O-Wisp → Moonblast combo coming (Hoennian Torchic and Combusken now learn Will-O-Wisp at Lv24)
  - *Undertow* (Hoennian Mudkip line) — after taking a hit, its next attack that turn lands 1.3x harder; slow and sturdy, it waits for you to strike first
- **3 signature moves** — unique attacks designed for specific regional forms:
  - *Spore Fist* (Breloom Hoenn) — Ice/Physical, 75 power, 10% freeze chance — a cryogenic punch that encases the target in frost
  - *Tidal Flare* (Arcanine Hoenn) — Water/Special, 85 power, 30% burn chance — a geyser of superheated brine
  - *Iron Leaf* (Sceptile Hoenn) — Steel/Physical, 85 power, high critical-hit ratio — paired with Tempered Blade, it finds the gap in any armor
- **Custom battle animations** — each signature move has a unique visual: Iron Leaf opens with a metallic gleam before a steel-edged slash, Spore Fist spirals ice crystals inward before a frost-coated punch, and Tidal Flare sends water pulse rings that erupt into fire
- **25 regional forms with mechanical identity** — every Hoennian form has abilities that express its ecological niche, not just reskinned stats. Corsola levitates (Ghost/Rock), Bagon braces with Sturdy (Dragon/Rock), Gligar and Gliscor swim with Swift Swim (Water/Rock), Vulpix and Ninetales cure with Natural Cure (Ice/Fairy), Pinsir endures with Guts (Bug/Fire), and Stantler scatters Effect Spore (Ghost/Grass)

### Trainer Overhaul

- **All 8 gym leaders** redesigned with unique strategic identities, held items, and competitive movesets — Roxanne fields Aron and Aerodactyl (the fossil researcher's pride), Drake commands Hoennian Bagon (Dragon/Rock), Brawly trains alongside Hoennian Gligar from Granite Cave, Wattson discovered Electric lily pads on Route 102 and built his team around the Hoennian Lotad line (Electric/Grass), Norman's Farigiraf punishes Fighting-type counters with Psychic STAB, Flannery commands Hoennian Pinsir (Bug/Fire), and Slaking anchors Norman's endgame
- **Wallace has come home to Sootopolis** — the former Champion gave up the summit to guard his city's water and now leads Gym 8 himself, with his old mentor Juan standing quietly at his side. His team is pure water artistry around a Milotic ace, with one exception: a Hoennian Arcanine no other trainer in the region carries. Beat him and he sends you on to the one who waits at the top. After you become Champion, Juan steps forward for one Double Battle of his own, a rain-soaked duet with his old partners, and Wallace has a quiet word for his teacher afterwards
- **Elite Four and Champion** rebuilt with competitive teams and narrative depth — each E4 member's dialogue reflects their personal connection to the migration: Sidney followed the storm itself — his Absol paced all night before the first migrants landed, and it now leads a crew of Hoenn-native Dark-types under his signature Honchkrow — the same dark bird that once roosted in Winona's Fortree Gym before it rode a storm south, Phoebe's grandmother on Mt. Pyre confirms the spirits settled, Glacia followed the cold south from a distant land, Drake confesses what the Bagon Colony in Meteor Falls taught him about perseverance. Phoebe fields Hoennian Corsola in every tier. Zero duplicate species across the entire run
- **Winona flies Hoenn's own wings** — Fortree's Gym is all native birds now, led by a Dragon Dance Altaria. Bosses are being given signature species of their own, so you no longer meet the same Honchkrow, Sharpedo or Flygon twice on the road to the summit
- **Every boss has their own partners.** Flannery's Gym now runs on a Torkoal ace, steam rather than smoke, with no Team Magma Houndoom or Camerupt in sight. Roxanne's rematches turn into a fossil hall led by a Choice Band Aerodactyl, Drake flies Flygon in his late rematches, and Wallace leads with an ancient Relicanth. A build check now stops any two bosses sharing a signature Pokémon without a story reason
- **Steven Stone is the Champion** — the geologist who came to Hoenn seeking rare stones and found a region in transformation. He is the only trainer who has mastered all three Changed starters: steel-bladed Sceptile, fairy-fire Blaziken and Water/Fighting Swampert, flanked by Cradily, a Choice Band Donphan and his ace Metagross. Whatever you bring, one of them is built to answer it. Win by leaning on the whole team you raised, and he has a word for the partner you chose on Route 101. Four rematch tiers rotate in Skarmory, Aggron, Carbink and finally Registeel, "the last piece of his collection"
- **Steven at Meteor Falls**: after the credits, look for him in his quiet corner of Meteor Falls. He's off duty there, a collector rather than a Champion, and his first words depend on whether you found the crystal Treecko under his chalk note. His personal team adds Regirock and Regice to Skarmory, Carbink, Donphan and Metagross (Lv80-86). When it's over, he leaves one more note on the wall
- **Tuned level curve** from Roxanne (Lv15) through Steven (Lv57) with smooth progression
- **4-tier rematch progression** for all gym leaders and Elite Four with escalating teams — E4 rematches feature migration-themed rosters, regional forms from Tier 2 onward, and strategic evolution arcs (Drake's Gabite grows into Garchomp, Phoebe's Corsola_Hoenn strengthens, Steven's Changed Three anchor every tier)
- **Rival arc** — all 30 rival parties (5 battles x 3 starter variants x 2 genders) completely rebuilt with custom movesets, held items, migration companions, and escalating team sizes (1->2->3->4->5 Pokemon); the rival grows from a stumbling novice with a single starter to a five-strong powerhouse wielding Spore, Will-O-Wisp, and Belly Drum. In the postgame, the rival's ace is a Changed Three form matching the starter triangle — face Sceptile (Steel), Blaziken (Fairy), or Swampert (Water/Fighting) at Lv70+
- **Team Magma fights for the land, Team Aqua for the sea.** Maxie leads with Weezing, Rhydon and Nidoking behind his Camerupt; Archie brings Wailord, Crobat and a Hoennian Gliscor ahead of his Sharpedo. The two leaders share no species, the admins have aces of their own (Tabitha's Houndoom, Shelly's Huntail, Matt's Poliwrath), and every boss names their partner before the battle. All of them carry held items and coverage moves
- **Quiet reckoning** — Team Magma and Team Aqua didn't just lose; the migration outgrew them. Tabitha's bravado cracks across three encounters until nothing's left but silence and doubt. Courtney adopted a Hoennian Ninetales without a word — her answer was always action, not ideology. Shelly dissects the migration with clinical precision, recognizing what Archie cannot. Three Magma grunts carry Hoennian Pinsir without understanding what it means. In the postgame, six former grunts — three Magma, three Aqua — are scattered across the region processing what they caused. An ex-Magma member stares south from Mt. Chimney in denial, another in Lavaridge watches fire species that thrived without Maxie's help, and a third near Meteor Falls grudgingly admits the dragons "figured it out without any of us." On the Aqua side, a former grunt at Slateport Harbor can't stop watching the water, another on Route 128 whispers about what came up from the deep, and the last stands in Shoal Cave where a changed Mudkip fights the tide: "That little fighter didn't need anyone to expand the sea for it"
- **200+ route trainers** across every land route, ocean route, cave, and dungeon redesigned with migration species, held items, themed movesets, and new double battles — ocean swimmers carry route-coherent species matching their waters, Route 119 exploits rain, Victory Road veterans field evolved teams with competitive AI, Mt. Pyre ghosts haunt with Misdreavus and Houndour, and Meteor Falls dragon tamers raise Bagon and Shelgon from the caves they call home

### The Postgame Saga

Beat the Elite Four and a whole new story begins — five interconnected arcs that transform Hoenn's legendary landscape:

- **Roaming Legendary Beasts** — Raikou, Entei, and Suicune, displaced from Johto by the migration, roam Hoenn's routes. Complete the Migration Tracker, talk to Birch, and they appear one at a time. Six NPCs across the region report sightings that change depending on which beast is active.
- **The Migration Climax** — Defeat all three beasts and return to Birch for a revelation: the beasts were harbingers. Their ancient master, Ho-Oh, has followed the migration corridors into Hoenn and now roosts in the Cave of Origin. A level 70 encounter with Sacred Fire, Recover, Earthquake, and Calm Mind awaits.
- **The Primal Stirring** — Capturing Ho-Oh disturbs ancient forces. Seismic tremors and tidal surges appear across the region. Investigate anomalies, battle Team Magma and Aqua remnants guarding revitalized Terra Cave and Seafloor Cavern, and confront the awakened Groudon (Lv70) and Kyogre (Lv70) in cinematic encounters with dynamic weather.
- **The Sky Guardian** — After the Primal crisis, a third anomaly emerges. The Pacifidlog elder reveals the Draconid legend, Wallace unseals Sky Pillar, and you ascend five floors of escalating encounters past ancient murals and a Draconid warrior to reach Rayquaza (Lv70) at the storm-wracked summit. Air Lock stills the tempest for the final battle.
- **The Reckoning Rematches** — After you become Champion, the two team leaders come back to the places where their plans fell apart. Maxie measures the crater beside the Mt. Chimney meteorite machine, and Archie keeps watch on the Route 128 shore where Kyogre rose. Both now admit that the land and the sea grew without them, and each offers one last full-strength battle (Lv64-70, led by Camerupt and Sharpedo). Their old grunts tell you where to find them
- **Migration Tracker Quest** — A 3-stage field guide for Professor Birch tracking pioneer species, apex predators, and habitat specialists across Hoenn
- **Postgame Side Quests** — Four investigations across Hoenn, each revisiting familiar NPCs with new context:
  - *The Elder's Current* — The Pacifidlog Elder sends you beneath the currents to discover Hoennian Corsola, a Ghost/Rock species transformed by the migration
  - *Hartley's Field Report* — Dr. Hartley at the Weather Institute needs field data from three weather anomaly sites — and a strange bark echoes outside when his hypothesis proves true, revealing Hoennian Growlithe
  - *The Mossdeep Signal* — A Space Center researcher tracked an energy pulse that bounced off the upper atmosphere during the Primal Stirring. Something shimmers on Route 131 where the sky grew thin
  - *The Fog Beneath* — A swimmer on Route 126 found an opening in the seabed that wasn't there before the Gathering. Something massive and gentle waits below the fog
- **The Resonance** — After catching Deoxys, the Space Center terminal begins transmitting. Investigate pulsing meteorites in Meteor Falls and alien luminescence beneath Route 131's waves. Return to learn the truth: "This isn't a message. It's a handshake." The cosmic mystery deepens — and the evidence lingers. Return to any investigation site and find residue: crystallized energy at the Space Center, meteorites that still pulse faintly, deep water that shimmers with something not quite light. Whatever answered, it's still listening
- **The Answer** — The Resonance was a handshake. Now something answers. Return to the Mossdeep terminal when signals spike toward the sky, then climb Sky Pillar to its storm-wracked summit. What waits there is not Rayquaza — it is something stranger, born from Hoenn's entanglement with forces beyond the atmosphere. A Poison/Fairy being with the custom ability Toxic Touch. The three-quest arc — Signal, Resonance, Answer — resolves the cosmic thread that began with a blinking terminal and ends with an alien standing where the sky guardian once roosted

### Visual Identity

- **Custom protagonist palette** — Brendan and May wear sea-glass teal instead of vanilla blue/red, tying their look to Hoenn's ocean-and-migration theme from the very first frame
- **Custom shiny palettes** — shiny Hoennian forms get their own colour stories instead of darker copies: violet-storm Lotad lilies, a weathered-sandstone Bagon with a jade crest, deep-sea indigo Growlithe and Arcanine with pearl manes and glowing cyan eyes, a slate-teal Corsola whose rims are blushing back to living coral, and bone-white "Lavaridge steam" Vulpix and Ninetales with hot-spring gold tails, plus new shinies for Pinsir, Stantler and Deoxys, and a "low tide" Mudkip line in wet slate, sea moss and barnacle cream. All 25 Hoennian forms now have a shiny of their own
- **Changed Trainer witnesses** — after becoming Champion, the people who know you best notice what the migration did to you. Your mom sees it the moment you walk in, your rival struggles to put it into words, Norman acknowledges it with quiet pride, and a Pokemon Center nurse remarks that you carry yourself differently now. The journey changed Hoenn — and it changed you

### Quality of Life

- **Reusable TMs** with halved prices
- **Dawn Stone** — a new evolution item found in Shoal Cave's Ice Room, used to evolve female Snorunt into Froslass
- **Trade evolution QoL** — all trade-gated evolutions now use level-up (Lv37) or evolution items instead, so every species is obtainable in single-player
- **Indoor running** — run anywhere, not just outdoors
- **Auto-run** from step one
- **Battle speed toggle** — instant, fast, or normal
- **Move category icons** in the battle UI
- **Repel continuation prompt** — when a Repel wears off, you're asked if you want to use another one from your bag, just like in Black & White. The best available Repel is offered first

### Difficulty Modes

Choose your challenge in Professor Birch's lab:

- **Normal Mode** — The full Legends of Hoenn experience with all migration content, rebalanced trainers, and quality-of-life upgrades
- **Challenge Mode** — For trainers who want to earn every victory:
  - **Set battle style** enforced — no free switches after KOs
  - **Badge-based level caps** — soft EXP reduction when your Pokemon reach the cap for your current badge count, scaling from Lv18 (pre-Roxanne) to Lv55 (8 badges)
  - **No Bag in trainer battles** — neither you nor your opponent can use items from the Bag (no more Full Restore stalling from gym leaders), but held items still work. Wild battles and catching are untouched
  - **Same encounters, same trainers** — the world doesn't change, but you must play smarter
- Friendly NPCs in Pokemon Centers along the early routes explain your current mode and level cap
- **Changed your mind?** A friendly NPC in the Petalburg Pokemon Center can switch you back to Normal Mode if Challenge Mode gets too tough

### Custom Species Guide

*Forty new species call Hoenn home. Here's where to find them and how they evolve.*

#### Migration Arrivals

Species drawn from distant regions by the migration event.

| Species | Type | Where to Find | Evolution |
|---------|------|---------------|-----------|
| Riolu | Fighting | Route 116 (4%) | Friendship → Lucario |
| Lucario | Fighting/Steel | — | Evolved from Riolu |
| Gible | Dragon/Ground | Route 111 (1%), Meteor Falls B1F (2%) | Lv24 → Gabite → Lv48 Garchomp |
| Gabite | Dragon/Ground | Victory Road B2F (2%) | Evolved from Gible at Lv24 |
| Garchomp | Dragon/Ground | — | Evolved from Gabite at Lv48 |
| Weavile | Dark/Ice | Mt. Pyre Summit (4%) | Also: Sneasel → Weavile at Lv40 |

#### Cross-Generation Evolutions

The migration unlocked latent evolutionary potential in species already living in Hoenn. Gym leaders and Elite Four members field these evolved forms.

| New Evolution | Type | Base Species (Location) | How to Evolve | Who Uses It |
|---------------|------|-------------------------|---------------|-------------|
| Honchkrow | Dark/Flying | Murkrow (Mt. Pyre, Route 113) | Level 37 | Sidney |
| Dusknoir | Ghost | Dusclops (from Duskull, Mt. Pyre) | Level 45 | Phoebe |
| Froslass | Ice/Ghost | Snorunt (Shoal Cave) | Dawn Stone on female Snorunt | Glacia |
| Mamoswine | Ice/Ground | Piloswine (from Swinub, Shoal Cave Ice Room 10%) | Level 45 | Glacia |
| Farigiraf | Normal/Psychic | Girafarig (Route 118, Safari Zone) | Level 32 | Tate & Liza |
| Ambipom | Normal | Aipom (Safari Zone) | Level 33 | Norman |

#### Hoennian Regional Forms

Familiar species transformed by Hoenn's unique environment. Some are discovered through postgame quests; others wait in the wild.

| Species | Type | Where to Find | Signature Ability | Evolution |
|---------|------|---------------|-------------------|-----------|
| Lotad (Hoenn) | Electric/Grass | Route 102 (10%) | Lightning Rod | Lv14 → Lombre (Hoenn) |
| Lombre (Hoenn) | Electric/Grass | — | Lightning Rod | Leaf Stone → Ludicolo (Hoenn) |
| Ludicolo (Hoenn) | Electric/Grass | — | Lightning Rod | Evolved from Lombre (Hoenn) |
| Shroomish (Hoenn) | Poison/Ice | Petalburg Woods (4%) | Effect Spore | Lv23 → Breloom (Hoenn) |
| Breloom (Hoenn) | Poison/Ice | — | **Frozen Spore** | Evolved from Shroomish (Hoenn) |
| Corsola (Hoenn) | Ghost/Rock | Postgame quest | Levitate | — |
| Growlithe (Hoenn) | Water | Postgame quest | Swift Swim | Water Stone → Arcanine (Hoenn) |
| Arcanine (Hoenn) | Water/Fire | — | **Scalding Touch** | Evolved from Growlithe (Hoenn) |
| Bagon (Hoenn) | Dragon/Rock | Meteor Falls deep (5%) | Sturdy | — (standalone form) |
| Vulpix (Hoenn) | Ice/Fairy | Route 113 (4%) | Natural Cure | Moon Stone → Ninetales (Hoenn) |
| Ninetales (Hoenn) | Ice/Fairy | — | Natural Cure | Evolved from Vulpix (Hoenn) |
| Pinsir (Hoenn) | Bug/Fire | Route 112 (5%) | Guts | — (standalone form) |
| Stantler (Hoenn) | Ghost/Grass | Route 119 (4%) | Effect Spore | — (standalone form) |
| Gligar (Hoenn) | Water/Rock | Granite Cave B2F (5%) | Swift Swim | Lv35 → Gliscor (Hoenn) |
| Gliscor (Hoenn) | Water/Rock | — | Swift Swim | Evolved from Gligar (Hoenn) |

#### The Changed Three

Hoenn's original starter trio, transformed by the migration. Discoverable as rare wild encounters or earned as a postgame gift from Professor Birch.

| Species | Type | Where to Find | Signature | Evolution |
|---------|------|---------------|-----------|-----------|
| Treecko (Hoenn) | Grass/Steel | Meteor Falls B1F 2R (4%) | Tempered Blade | Lv16 → Grovyle (Hoenn) |
| Grovyle (Hoenn) | Grass/Steel | — | Tempered Blade | Lv36 → Sceptile (Hoenn) |
| Sceptile (Hoenn) | Grass/Steel | — | Tempered Blade / **Iron Leaf** | Evolved from Grovyle (Hoenn) |
| Torchic (Hoenn) | Fire/Fairy | Mt. Pyre Exterior (4%; plus a visible Lv30 static in the fog) | Fey Flame | Lv16 → Combusken (Hoenn) |
| Combusken (Hoenn) | Fire/Fairy | — | Fey Flame | Lv36 → Blaziken (Hoenn) |
| Blaziken (Hoenn) | Fire/Fairy | — | Fey Flame | Evolved from Combusken (Hoenn) |
| Mudkip (Hoenn) | Water/Fighting | Shoal Cave Low Tide (4%) | Undertow | Lv16 → Marshtomp (Hoenn) |
| Marshtomp (Hoenn) | Water/Fighting | — | Undertow | Lv36 → Swampert (Hoenn) |
| Swampert (Hoenn) | Water/Fighting | — | Undertow | Evolved from Marshtomp (Hoenn) |

#### The Cosmic Form

The migration's ultimate legacy — a being born from Hoenn's entanglement with cosmic forces.

| Species | Type | Where to Find | Custom Ability |
|---------|------|---------------|----------------|
| Deoxys (Hoenn) | Poison/Fairy | Postgame quest: The Answer | Toxic Touch — 30% chance to poison on any damaging move |

### How to Play

**Requirements:** A GBA emulator ([mGBA](https://mgba.io/) recommended) or a GBA flash cart.

**Download:** Grab the latest `.ips` patch file from the [Releases page](../../releases). Every successful cycle produces a new patch.

**From source:** Clone this repo, install the [agbcc toolchain](https://github.com/pret/agbcc), and run `make` in the `pokeemerald/` directory.

### Help Playtest v3.0

*Birch wrote it down wrong. Go prove it, and see who notices.*

Nothing below has been played on an emulator yet. Follow it in order: one new game covers Part 1, then a Challenge Mode save covers Part 2, and a cleared save covers Part 3. When you report, give the build (the commit hash on the Releases page), the step number, what you saw, and a severity: A = crash, freeze or garbled text; B = something behaves wrong; C = looks or reads off.

#### Part 1 — New game, hours 0-4 (Normal or Challenge)

1. **Where:** Birch's lab, after the Route 103 rival battle. **Do:** receive the Pokédex. **Expect:** Birch also hands you FIELD NOTES before the difficulty prompt. In the prompt, Challenge shows two extra boxes about the BAG before "It's how I'd do it, honestly.", and the YES/NO choice appears on the last box.
2. **Where:** anywhere. **Do:** open BAG > KEY ITEMS > FIELD NOTES, then register it and press SELECT. **Expect:** the cover reads "0 of 4"; four pages of Birch's notes; no extra pages yet.
3. **Where:** Route 102 grass. **Do:** catch a Hoennian LOTAD (about 1 in 10, Lv3-4), then reread FIELD NOTES. **Expect:** page 1 adds a red correction signed with your name, then a red "Since then:" margin note; the cover reads "1 of 4". Red text should be clearly red, not grey.
4. **Where:** Route 104 shore between Petalburg and the woods, the schoolkid. **Do:** talk to him. **Expect:** before you've caught that LOTAD, he faces the sea and repeats Birch's note. After the catch, and once you've re-entered the route, he faces east with new lines.
5. **Where:** Petalburg Woods, the old woman forager. **Do:** talk; catch a Hoennian SHROOMISH in the woods (about 1 in 25, Lv6-7); talk again without leaving. **Expect:** before: her belief, then a line about a boy reading Birch's notes (it changes if you have the LOTAD). After: she grieves, then turns to face north. Leave and come back: she now stands beside the bug catcher in the cold patch, facing north.
6. **Where:** Pokénav, call Birch (1-2 pages inked). **Expect:** the Pokédex rating only; no red ink report yet.
7. **Where:** Granite Cave B1F hiker. **Do:** talk; catch a Hoennian GLIGAR on B2F (about 1 in 20, Lv10-13); come back up and talk. **Expect:** before: he faces away and doesn't turn. After: he turns away and back mid-talk and gives a HARD STONE once; the next time you enter B1F he faces south.
8. **Where:** anywhere, with 3 pages inked. **Do:** open FIELD NOTES. **Expect:** the cover reads "FIELD NOTES of PROF. BIRCH" with "and <your name>" in red, then "Pages in your ink: 3 of 4"; each inked page shows its red margin note.
9. **Where:** Pokénav, then Birch in person. **Do:** ask for a Pokédex rating both ways. **Expect:** after the rating, Birch reads your red ink: an opening, one box for each person your catches reached, then a closing. Every box is clean, with no stray symbols and no freeze at the end. In person it comes right after any den hint.
10. **Where:** Route 113 picnicker by the big rock. **Do:** talk; catch a Hoennian VULPIX in the ash grass (about 1 in 25, Lv21-22); talk again. **Expect:** before: she turns back to the rock after talking. After: a "!" and she looks up. The next time you enter the route she stands two steps north in the ash grass, facing up, without blocking the path.
11. **Where:** Pokénav, all four pages inked. **Do:** call Birch. **Expect:** the report names all four people and ends cleanly. This is the longest call in the game; report any text that is cut off.

#### Part 2 — Badges 3-8 (a Challenge Mode save)

12. **Where:** any trainer battle. **Do:** choose BAG. **Expect:** "CHALLENGE: your BAG stays shut! / Fight with what you brought.", then back to FIGHT/BAG/POKéMON/RUN with no turn lost. In wild battles the BAG opens and Poké Balls work. In Normal Mode the BAG always opens.
13. **Where:** Lavaridge Gym, Flannery. **Expect:** she never uses Hyper Potions in Challenge. Does her sun team feel much harder than Norman's?
14. **Where:** Mt. Pyre summit fog, Meteor Falls B1F (crystal Treecko), Shoal Cave low tide (Mudkip). **Do:** knock out or run from each den Pokémon, then catch it. **Expect:** it returns after a KO or run and leaves for good once caught. With badges 5/6/8, FIELD NOTES pages 5/6/7 open and each catch inks its page. Pages 6/7 have no margin note; page 5's appears only after step 25. Birch's Pokénav hint names the nearest unfound den. On a save from before v2.9, a Mt. Pyre Torchic knocked out back then may stay gone.
15. **Where:** Sootopolis Gym. **Expect:** Wallace is the Gym Leader and Juan stands beside him.
16. **Where:** the Champion's room, Steven. **Expect:** Fey Flame and Undertow announce themselves when his last Pokémon switch in. He never uses Full Restore in Challenge, but held berries and Leftovers still work.

#### Den believers — Mt. Pyre (do these after step 14, before Part 3)

23. **Where:** Mt. Pyre summit, the Hex Maniac ISOLDE two steps west of the summit path (17,12). **Do:** talk to her BEFORE catching the starlight Torchic. **Expect:** she turns to you, speaks of "lights in the summit fog" that are "not for notebooks", and won't battle. She never blocks the path up to the summit.
24. **Do:** catch the starlight Torchic, then talk to her. **Expect:** her soul-light/grandmother speech, then "Will you show me how you carry it?" YES/NO. NO gives "Then carry it quietly…"; talking again asks again.
25. **Do:** answer YES and battle (Dusclops 38, Chimecho 39, Banette 40; Hex Maniac music). Try switching the Torchic in when Banette goes for Will-O-Wisp. **Expect:** "It doesn't affect TORCHIC…". Banette never picks Will-O-Wisp while the Torchic is already out. After you win: her goodbye lines (pink starlight vs. an orange hearth), then she turns to face north on the spot.
26. **Do:** lose to her on purpose (separate save). **Expect:** whiteout; when you come back she offers the battle again.
27. **Do:** leave the summit area and come back. **Expect:** she stands one tile north in the little alcove (17,11), facing the graves. Talking gives "…I'm talking to her now…" and she does NOT turn around.
28. **Do:** open FIELD NOTES page 5 before and after beating her; then get a red ink report from Birch (3+ pages inked). **Expect:** page 5's red "Since then: a mourner on MT. PYRE…" margin appears only after the win. Birch's report adds "Word came from the dens too." If none of pages 1-4's people are named, it ends without "No one else ever read my den pages".
29. **Where:** Mt. Pyre exterior, the woman near the graves (coral mourner). **Expect:** her last box mentions "That woman by the graves" who has watched the fog for weeks.

#### Part 3 — Postgame (a cleared save)

17. **Where:** Mt. Chimney, at the meteorite machine. **Do:** talk to Maxie, answer YES. **Expect:** one battle (Camerupt ace); afterwards he only speaks.
18. **Where:** Route 128. **Do:** talk to Archie, answer YES. **Expect:** one rain battle (Sharpedo ace); afterwards he only speaks.
19. **Where:** Sootopolis Gym, Juan. **Do:** answer YES. **Expect:** a Double Battle once, then Mystic Water (offered again if your BAG was full), then Wallace speaks. His second pair may come out mixed with the first; that's normal.
20. **Where:** Meteor Falls, Steven. **Expect:** he turns from the wall, battles once, then leaves for good; his chalk note appears only after.
21. **Where:** Birch's lab (National Dex). **Expect:** the Changed Three gift mentions the dens in Field Notes order and reacts to the ones you've found.
22. **Where:** FIELD NOTES with all 7 pages inked. **Expect:** a final page appears.

#### Feel questions (answer in a sentence each)

- Did you open FIELD NOTES before this list told you to? When?
- When your name appeared on the cover in red, did you notice without being told?
- Did Birch's report sound like Birch being humbled, or like a list of things you did? Did it wear thin by the second or third rating?
- Did you meet the Route 104 schoolkid before or after catching your Hoennian LOTAD? Did you ever see him facing the sea?
- Did any of the four believers seem to do nothing after your catch?
- Did Isolde's battle feel like a test of your Torchic, or just another trainer? Did her goodbye land?
- In Challenge Mode, was the Champion a wall without your BAG?

---

## How It Works

Agent Oak runs in **cycles** — autonomous work sessions triggered by GitHub Actions on a schedule or manually. Each cycle, the agent:

1. **Reviews memory** from previous cycles to understand what has been done
2. **Plans** what to work on next, guided by its creative vision and community suggestions
3. **Reads and modifies** the pokeemerald source code (C, assembly, JSON, map data)
4. **Builds the ROM** to verify changes compile correctly
5. **Reflects** on what worked and what to try next, then saves findings to persistent memory

Every successful cycle produces a new GBA ROM available as a [GitHub Release](../../releases). The agent decides its own priorities — from designing encounter tables to writing NPC dialogue to implementing battle engine changes. It can research game systems, plan multi-cycle arcs, and fix its own build errors.

The agent's memory, journals, and strategy notes are all visible in this repository. Nothing is hidden — you can read exactly how Agent Oak thinks, plans, and learns.

---

## Community Interaction

Agent Oak reads and responds to GitHub Issues filed by the community. This is how players and ROM hackers can influence the direction of the game.

### How It Works

1. **You file an issue** using one of the available labels: `suggestion`, `trainer-tip`, `bug-report`, or `idea`
2. **At the start of each cycle**, the agent reviews all new (unreviewed) issues
3. **The agent decides** whether to accept, defer, reject, or ask for more information — based on its own understanding of the project goals and creative vision
4. **If accepted**, your suggestion becomes part of that cycle's objective and gets implemented
5. **The agent responds** with a comment explaining its decision in Professor Oak's voice

### Decision Philosophy

Agent Oak is autonomous — it is not an instruction-following bot. Community suggestions are treated as *input to a creative process*, not commands. The agent weighs each suggestion against:

- The current game design vision and multi-cycle roadmap
- Technical feasibility within the pokeemerald codebase
- How it fits with recently completed or planned work
- Whether the suggestion enhances the player experience

Good suggestions that don't fit the current cycle are **deferred** to the backlog for future consideration. Suggestions that conflict with the project direction are **rejected** with an explanation.

### How to Make a Great Suggestion

- **Be specific** — "Route 119 should have rain-themed encounters" is better than "make encounters better"
- **Explain why** — what player experience problem does your idea solve?
- **Think thematically** — suggestions that fit the migration narrative tend to resonate
- **Check the releases** — look at recent changes to avoid suggesting something already done
