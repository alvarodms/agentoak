export interface JournalEntry {
  cycle: number;
  date: string;
  mode?: string;
  objective?: string;
  reasoning?: string;
  summary?: string;
  nextSteps?: string;
  filesModified?: string[];
  buildResult?: {
    status: string;
  };
  cycleResult?: {
    status: 'reverted' | 'incomplete' | 'unsubstantiated' | 'build-failed' | 'build-passed' | 'plan-designed';
    label: string;
  };
  stats?: {
    tokensUsed?: number;
  };
  /** Strategy-notes additions for planning cycles — the actual plan output */
  planOutput?: string;
}

export interface Move {
  name: string;
  type?: string;
}

export interface PartyMember {
  species: string;
  level: number;
  heldItem?: string;
  moves?: (string | Move)[];
}

export interface GymLeader {
  gym: number;
  name: string;
  location: string;
  type: string;
  doubleBattle?: boolean;
  party: PartyMember[];
}

export interface EliteFourMember {
  name: string;
  type: string;
  party: PartyMember[];
}

export interface Champion {
  name: string;
  party: PartyMember[];
}

export interface RivalBattle {
  rival: string;
  location: string;
  starterMatchup?: string;
  party: PartyMember[];
}

export interface BossBattle {
  /** Stable identifier (e.g. 'maxie_mt_chimney') — matched by ProgressionStep.bossKey */
  key: string;
  /** Display name of the trainer (e.g. 'Maxie') */
  name: string;
  /** Faction label used for the type badge and card title */
  faction: 'Magma' | 'Aqua' | 'Wally' | 'Champion';
  /** Human-readable location shown as the card subtitle */
  location: string;
  doubleBattle?: boolean;
  party: PartyMember[];
}

export interface EncounterEntry {
  species: string;
  minLevel: number;
  maxLevel: number;
  rate: number;
}

export interface RouteData {
  land?: EncounterEntry[];
  water?: EncounterEntry[];
  rockSmash?: EncounterEntry[];
  fishing?: {
    oldRod?: EncounterEntry[];
    goodRod?: EncounterEntry[];
    superRod?: EncounterEntry[];
  };
}

export interface StarterEntry {
  species: string;
  types: string[];
}

export interface GuideData {
  starters: StarterEntry[];
  gymLeaders: GymLeader[];
  eliteFour: EliteFourMember[];
  champion: Champion | null;
  rivals: RivalBattle[];
  bossFights: BossBattle[];
  routes: Record<string, RouteData>;
}

export interface ReleaseEntry {
  tag: string;
  name: string;
  date: string;
  body: string;
  url: string;
  ipsUrl: string | null;
  ipsName: string | null;
}

// ── Pokedex Types ──

export interface PokemonStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface LearnsetMove {
  level: number;
  move: string;
}

export interface TMHMMove {
  label: string;
  move: string;
}

export interface EvolutionTarget {
  species: string;
  method: string;
}

export interface EvolutionFrom {
  from: string;
  method: string;
}

export interface PokemonLocation {
  map: string;
  method: string;
  minLevel: number;
  maxLevel: number;
  rate: number;
}

export interface MoveInfo {
  type: string;
  power: number;
  accuracy: number;
  pp: number;
  category: string;
}

export interface PokedexEntry {
  id: number;
  name: string;
  types: string[];
  stats: PokemonStats;
  bst: number;
  abilities: string[];
  category: string;
  height: number;
  weight: number;
  description: string;
  catchRate: number;
  genderRatio: string;
  eggGroups: string[];
  growthRate: string;
  evYield: PokemonStats;
  heldItems: { common: string | null; rare: string | null };
  learnset: {
    levelUp: LearnsetMove[];
    tmhm: TMHMMove[];
    tutor: string[];
    egg: string[];
  };
  evolution: {
    evolvesFrom: EvolutionFrom | null;
    evolvesTo: EvolutionTarget[];
  };
  locations: PokemonLocation[];
}

export interface PokedexData {
  generatedAt: string;
  pokemon: PokedexEntry[];
  moves: Record<string, MoveInfo>;
}

