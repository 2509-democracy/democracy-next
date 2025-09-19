import { TechCard } from '@/features/card-pool';

// プレイヤー情報の基本型
export interface PlayerInfo {
  id: string;
  name: string;
  score: number;
  resource: number;
  techLevels: Record<string, number>;
  selectedCards: TechCard[];
  isCurrentPlayer: boolean;
  turn: number;
  phase: 'preparation' | 'hackathon' | 'finished';
}

// ゲームモードの型
export type GameMode = 'single' | 'multi';

// ゲーム全体の状態
export interface MultiGameState {
  mode: GameMode;
  players: PlayerInfo[];
  currentPlayerId: string;
  maxTurns: number;
  currentTurn: number;
}

// プレイヤーランキング用の型
export interface PlayerRanking {
  playerId: string;
  name: string;
  score: number;
  rank: number;
}