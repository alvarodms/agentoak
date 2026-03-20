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
  stats?: {
    tokensUsed?: number;
  };
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
  routes: Record<string, RouteData>;
}

export interface StrategyStarter {
  name: string;
  types: string;
  identity: string;
}

export interface RoadmapCompletedEntry {
  cycle: number;
  status: string;
  description: string;
}

export interface RoadmapUpcomingEntry {
  cycle: number;
  objective: string;
  priority?: string;
  complexity?: string;
}

export interface StrategyData {
  vision?: {
    title: string;
    description: string;
  };
  starters?: StrategyStarter[];
  roadmap?: {
    completed?: RoadmapCompletedEntry[];
    upcoming?: RoadmapUpcomingEntry[];
  };
}
