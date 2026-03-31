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

export interface ReleaseEntry {
  tag: string;
  name: string;
  date: string;
  body: string;
  url: string;
  ipsUrl: string | null;
  ipsName: string | null;
}

