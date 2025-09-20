import type { TechCard } from '@/features/card-pool';

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

export type GamePhase = "preparation" | "execution" | "result" | "ended";

// マルチフェーズゲーム用の拡張GamePhase
export type MultiGamePhase = 
  | 'matching'           // マッチング待機
  | 'preparation'        // 準備フェーズ
  | 'submission_review'  // お題・技術確認
  | 'ai_evaluation'      // AI評価中
  | 'round_result'       // ラウンド結果
  | 'final_ranking'      // 最終結果

export interface GameState extends GameData {
  phase: GamePhase;
  isLoading: boolean;
}

// プレイヤーの提出情報
export interface PlayerSubmission {
  playerId: string;
  playerName: string;
  selectedCards: TechCard[];
  idea: string;
  techLevels: Record<string, number>;
}

// ラウンド結果
export interface RoundResult {
  roundNumber: number;
  theme: string;
  direction: string;
  playerResults: PlayerRoundResult[];
  timestamp: Date;
}

// プレイヤーのラウンド結果
export interface PlayerRoundResult {
  playerId: string;
  playerName: string;
  submission: PlayerSubmission;
  aiScore: number;
  aiComment?: string;
  resourceGained: number;
  techLevelGained: Record<string, number>;
  totalScore: number;
}

// AI評価結果の拡張
export interface DetailedAIEvaluationResponse {
  score: number;
  comment?: string;
  breakdown?: {
    creativity: number;
    technical: number;
    feasibility: number;
    alignment: number;
  };
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
