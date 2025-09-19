export interface TechCard {
  id: string;
  name: string;
  cost: number;
  level: number;
}

export interface HackathonInfo {
  theme: string;
  direction: string;
}

export interface GameData {
  turn: number;
  resource: number;
  score: number;
  hand: TechCard[];
  shop: TechCard[];
  cardPool: TechCard[];
  techLevels: Record<string, number>;
  hackathonInfo: HackathonInfo | null;
  selectedCards: TechCard[];
}

export type GamePhase = 'preparation' | 'execution' | 'result' | 'ended';

export interface GameState extends GameData {
  phase: GamePhase;
  isLoading: boolean;
}

export interface AIEvaluationRequest {
  theme: string;
  direction: string;
  idea: string;
  techNames: string[];
}

export interface AIEvaluationResponse {
  score: number;
}