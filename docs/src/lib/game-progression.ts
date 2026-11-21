/**
 * Pokémon Emerald game progression — defines the order locations, battles,
 * and events occur as a player progresses through the main story.
 */

export interface ProgressionStep {
  type: 'starter' | 'route' | 'gym' | 'rival' | 'elite-four' | 'champion' | 'landmark' | 'chapter' | 'boss' | 'rematches' | 'route-trainers';
  label: string;
  /** Matches key in GuideData.routes (e.g. "Route 101", "Petalburg Woods") */
  routeKeys?: string[];
  /** Matches gymLeader.gym number */
  gymNumber?: number;
  /** Substring match against rival battle location */
  rivalLocation?: string;
  /** For type === 'boss': one or more BossBattle.key values to render as a group */
  bossKeys?: string[];
  /** Flavor text for landmarks / chapters */
  description?: string;
  /** For type === 'route-trainers': map name key to look up in routeTrainers */
  trainerMapKey?: string;
}

export const GAME_PROGRESSION: ProgressionStep[] = [
  // ── Chapter 1: The Journey Begins ──
  { type: 'chapter', label: 'Chapter 1: The Journey Begins', description: 'Choose your partner and take your first steps into Hoenn.' },
  { type: 'starter', label: 'Starter Selection' },
  { type: 'route', label: 'Route 101', routeKeys: ['Route 101'] },
  { type: 'landmark', label: 'Oldale Town', description: 'A small town with a Pok\u00e9mon Center and Pok\u00e9 Mart.' },
  { type: 'route', label: 'Route 103', routeKeys: ['Route 103'] },
  { type: 'rival', label: 'Rival Battle \u2014 Route 103', rivalLocation: 'Route 103' },
  { type: 'route', label: 'Route 102', routeKeys: ['Route 102'] },

  // ── Chapter 2: First Gym Challenge ──
  { type: 'chapter', label: 'Chapter 2: First Gym Challenge', description: 'Head through Petalburg Woods to reach Rustboro City and face Roxanne.' },
  { type: 'landmark', label: 'Petalburg City', description: 'Your father Norman\'s gym is here, but you need 4 badges first.' },
  { type: 'route', label: 'Route 104', routeKeys: ['Route 104'] },
  { type: 'route', label: 'Petalburg Woods', routeKeys: ['Petalburg Woods'] },
  { type: 'landmark', label: 'Rustboro City', description: 'Home to the Rustboro Gym and Devon Corporation.' },
  { type: 'gym', label: 'Gym 1: Roxanne', gymNumber: 1 },
  { type: 'route', label: 'Route 116', routeKeys: ['Route 116'] },
  { type: 'route', label: 'Rusturf Tunnel', routeKeys: ['Rusturf Tunnel'] },

  // ── Chapter 3: Island Detour ──
  { type: 'chapter', label: 'Chapter 3: Island Detour', description: 'Sail to Dewford Town and explore the seas south of Hoenn.' },
  { type: 'route', label: 'Route 104 (South)', routeKeys: ['Route 104'] },
  { type: 'route', label: 'Sea Routes 105\u2013109', routeKeys: ['Route 105', 'Route 106', 'Route 107', 'Route 108', 'Route 109'] },
  { type: 'route', label: 'Granite Cave', routeKeys: ['Granite Cave 1f', 'Granite Cave B1f', 'Granite Cave B2f', 'Granite Cave Stevens Room'] },
  { type: 'landmark', label: 'Dewford Town', description: 'A small island town known for its trendy sayings.' },
  { type: 'gym', label: 'Gym 2: Brawly', gymNumber: 2 },

  // ── Chapter 4: The Electric Road ──
  { type: 'chapter', label: 'Chapter 4: The Electric Road', description: 'Travel north to Mauville City and face Wattson.' },
  { type: 'landmark', label: 'Slateport City', description: 'A bustling port city with a market and museum.' },
  { type: 'route', label: 'Route 110', routeKeys: ['Route 110'] },
  { type: 'rival', label: 'Rival Battle \u2014 Route 110', rivalLocation: 'Route 110' },
  { type: 'landmark', label: 'Mauville City', description: 'The crossroads of Hoenn, home to the Game Corner and Bike Shop.' },
  { type: 'gym', label: 'Gym 3: Wattson', gymNumber: 3 },
  { type: 'boss', label: 'Boss Fight \u2014 Wally (Mauville City)', bossKeys: ['wally_mauville'] },
  { type: 'route', label: 'New Mauville', routeKeys: ['New Mauville Entrance', 'New Mauville Inside'] },

  // ── Chapter 5: The Road to Lavaridge ──
  { type: 'chapter', label: 'Chapter 5: The Road to Lavaridge', description: 'Journey through the volcanic routes to reach Lavaridge Town.' },
  { type: 'route', label: 'Route 117', routeKeys: ['Route 117'] },
  { type: 'route', label: 'Route 111 (North)', routeKeys: ['Route 111'] },
  { type: 'route', label: 'Route 112', routeKeys: ['Route 112'] },
  { type: 'route', label: 'Fiery Path', routeKeys: ['Fiery Path'] },
  { type: 'route', label: 'Route 113', routeKeys: ['Route 113'] },
  { type: 'landmark', label: 'Fallarbor Town', description: 'A quiet town near the foot of Mt. Chimney.' },
  { type: 'route', label: 'Route 114', routeKeys: ['Route 114'] },
  { type: 'route', label: 'Meteor Falls', routeKeys: ['Meteor Falls 1f 1r', 'Meteor Falls 1f 2r'] },
  { type: 'boss', label: 'Boss Fights \u2014 Tabitha & Maxie (Mt. Chimney)', bossKeys: ['tabitha_mt_chimney', 'maxie_mt_chimney'] },
  { type: 'route', label: 'Jagged Pass', routeKeys: ['Jagged Pass'] },
  { type: 'landmark', label: 'Lavaridge Town', description: 'A town famous for its hot springs, nestled at the base of Mt. Chimney.' },
  { type: 'gym', label: 'Gym 4: Flannery', gymNumber: 4 },

  // ── Chapter 6: Norman's Challenge ──
  { type: 'chapter', label: 'Chapter 6: Norman\'s Challenge', description: 'Return to Petalburg to challenge your father.' },
  { type: 'route', label: 'Route 111 (Desert)', routeKeys: ['Route 111'] },
  { type: 'route', label: 'Mirage Tower', routeKeys: ['Mirage Tower 1f', 'Mirage Tower 2f', 'Mirage Tower 3f', 'Mirage Tower 4f'] },
  { type: 'gym', label: 'Gym 5: Norman', gymNumber: 5 },

  // ── Chapter 7: East Hoenn ──
  { type: 'chapter', label: 'Chapter 7: East Hoenn', description: 'Cross the water to explore eastern Hoenn and earn the Feather Badge.' },
  { type: 'route', label: 'Route 118', routeKeys: ['Route 118'] },
  { type: 'route', label: 'Route 119', routeKeys: ['Route 119'] },
  { type: 'rival', label: 'Rival Battle \u2014 Route 119', rivalLocation: 'Route 119' },
  { type: 'boss', label: 'Boss Fight \u2014 Shelly (Weather Institute)', bossKeys: ['shelly_weather_institute'] },
  { type: 'landmark', label: 'Fortree City', description: 'A city of treehouses deep in the forest.' },
  { type: 'gym', label: 'Gym 6: Winona', gymNumber: 6 },
  { type: 'route', label: 'Route 120', routeKeys: ['Route 120'] },
  { type: 'route', label: 'Route 121', routeKeys: ['Route 121'] },
  { type: 'route', label: 'Safari Zone', routeKeys: ['Safari Zone North', 'Safari Zone Northeast', 'Safari Zone Northwest', 'Safari Zone South', 'Safari Zone Southeast', 'Safari Zone Southwest'] },

  // ── Chapter 8: Lilycove & Mt. Pyre ──
  { type: 'chapter', label: 'Chapter 8: Lilycove & Mt. Pyre', description: 'Confront Team Aqua and protect Mt. Pyre.' },
  { type: 'landmark', label: 'Lilycove City', description: 'The cultural capital of Hoenn, home to the Contest Hall and Department Store.' },
  { type: 'rival', label: 'Rival Battle \u2014 Lilycove', rivalLocation: 'Lilycove' },
  { type: 'route', label: 'Route 122', routeKeys: ['Route 122'] },
  { type: 'route', label: 'Mt. Pyre', routeKeys: ['Mt Pyre 1f', 'Mt Pyre 2f', 'Mt Pyre 3f', 'Mt Pyre 4f', 'Mt Pyre 5f', 'Mt Pyre 6f', 'Mt Pyre Exterior', 'Mt Pyre Summit'] },
  { type: 'boss', label: 'Boss Fight \u2014 Matt (Mt. Pyre Summit)', bossKeys: ['matt'] },
  { type: 'route', label: 'Route 123', routeKeys: ['Route 123'] },
  { type: 'route', label: 'Magma Hideout', routeKeys: ['Magma Hideout 1f', 'Magma Hideout 2f 1r', 'Magma Hideout 2f 2r', 'Magma Hideout 2f 3r', 'Magma Hideout 3f 1r', 'Magma Hideout 3f 2r', 'Magma Hideout 3f 3r', 'Magma Hideout 4f'] },
  { type: 'boss', label: 'Boss Fights \u2014 Matthew, Tabitha & Maxie (Magma Hideout)', bossKeys: ['matthew', 'tabitha_magma_hideout', 'maxie_magma_hideout'] },

  // ── Chapter 9: The Deep Sea ──
  { type: 'chapter', label: 'Chapter 9: The Deep Sea', description: 'Dive beneath the ocean and earn the Mind Badge on Mossdeep Island.' },
  { type: 'route', label: 'Sea Routes 124\u2013126', routeKeys: ['Route 124', 'Route 125', 'Route 126'] },
  { type: 'route', label: 'Shoal Cave', routeKeys: ['Shoal Cave Low Tide Entrance Room', 'Shoal Cave Low Tide Ice Room', 'Shoal Cave Low Tide Inner Room', 'Shoal Cave Low Tide Lower Room', 'Shoal Cave Low Tide Stairs Room'] },
  { type: 'landmark', label: 'Mossdeep City', description: 'Home to the Space Center and the 7th Gym.' },
  { type: 'gym', label: 'Gym 7: Tate & Liza', gymNumber: 7 },
  { type: 'boss', label: 'Boss Fights \u2014 Tabitha & Maxie (Mossdeep City)', bossKeys: ['tabitha_mossdeep', 'maxie_mossdeep'] },
  { type: 'route', label: 'Route 127', routeKeys: ['Route 127'] },
  { type: 'route', label: 'Seafloor Cavern', routeKeys: ['Seafloor Cavern Entrance', 'Seafloor Cavern Room1', 'Seafloor Cavern Room2', 'Seafloor Cavern Room3', 'Seafloor Cavern Room4', 'Seafloor Cavern Room5', 'Seafloor Cavern Room6', 'Seafloor Cavern Room7', 'Seafloor Cavern Room8'] },
  { type: 'boss', label: 'Boss Fights \u2014 Shelly & Archie (Seafloor Cavern)', bossKeys: ['shelly_seafloor_cavern', 'archie'] },

  // ── Chapter 10: The Final Gym ──
  { type: 'chapter', label: 'Chapter 10: The Final Gym', description: 'Calm Groudon and Kyogre, then earn your 8th badge.' },
  { type: 'route', label: 'Route 128', routeKeys: ['Route 128'] },
  { type: 'route', label: 'Cave of Origin', routeKeys: ['Cave Of Origin Entrance', 'Cave Of Origin 1f'] },
  { type: 'landmark', label: 'Sootopolis City', description: 'A city inside a volcanic crater, accessible only by sea or sky.' },
  { type: 'gym', label: 'Gym 8: Juan', gymNumber: 8 },

  // ── Chapter 11: Victory Road & the League ──
  { type: 'chapter', label: 'Chapter 11: Victory Road & the League', description: 'The final stretch — conquer Victory Road and become Champion.' },
  { type: 'route', label: 'Sea Routes 129\u2013134', routeKeys: ['Route 129', 'Route 130', 'Route 131', 'Route 132', 'Route 133', 'Route 134'] },
  { type: 'landmark', label: 'Ever Grande City', description: 'The gateway to the Pok\u00e9mon League.' },
  { type: 'route', label: 'Victory Road', routeKeys: ['Victory Road 1f', 'Victory Road B1f', 'Victory Road B2f'] },
  { type: 'boss', label: 'Boss Fight \u2014 Wally Rematch Tiers (Victory Road)', bossKeys: ['wally_vr_1', 'wally_vr_2', 'wally_vr_3', 'wally_vr_4', 'wally_vr_5'] },
  { type: 'elite-four', label: 'Elite Four' },
  { type: 'champion', label: 'Champion' },

  // ── Postgame ──
  { type: 'chapter', label: 'Postgame', description: 'Explore remaining areas, challenge rematches, and uncover the cosmic mystery.' },
  { type: 'rival', label: 'Rival Battle \u2014 Littleroot Town (Postgame)', rivalLocation: 'Postgame' },
  { type: 'route', label: 'Route 115', routeKeys: ['Route 115'] },
  { type: 'route', label: 'Sky Pillar', routeKeys: ['Sky Pillar 1f', 'Sky Pillar 3f'] },
  { type: 'route', label: 'Meteor Falls (Deep)', routeKeys: ['Meteor Falls B1f 1r', 'Meteor Falls B1f 2r'] },
  { type: 'boss', label: 'Boss Fight \u2014 Steven (Meteor Falls)', bossKeys: ['steven_postgame'] },
  { type: 'route', label: 'Altering Cave', routeKeys: ['Altering Cave'] },
  { type: 'route', label: 'Artisan Cave', routeKeys: ['Artisan Cave 1f', 'Artisan Cave B1f'] },
  { type: 'route', label: 'Desert Underpass', routeKeys: ['Desert Underpass'] },
  { type: 'route', label: 'Abandoned Ship', routeKeys: ['Abandoned Ship Hidden Floor Corridors', 'Abandoned Ship Rooms B1f'] },

  // ── Rematches ──
  { type: 'chapter', label: 'Rematches', description: 'Gym leader, Elite Four, and Champion rematch tiers with escalating teams.' },
  { type: 'rematches', label: 'Gym Leader Rematches' },
  { type: 'rematches', label: 'Elite Four Rematches' },
  { type: 'rematches', label: 'Champion Rematches' },
];
