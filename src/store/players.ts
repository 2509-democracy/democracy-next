import { atom } from 'jotai';
import { PlayerInfo, GameMode, MultiGameState, PlayerRanking } from '@/types/player';
import { GAME_CONFIG } from '@/const/game';

// 初期プレイヤー情報（シングルモード用）
const createInitialPlayer = (id: string, name: string): PlayerInfo => ({
  id,
  name,
  score: 0,
  resource: GAME_CONFIG.INITIAL_RESOURCE,
  techLevels: {},
  selectedCards: [],
  isCurrentPlayer: true,
  turn: 1,
  phase: 'preparation',
});

// 初期ゲーム状態（シングルモード）
const initialMultiGameState: MultiGameState = {
  mode: 'single',
  players: [createInitialPlayer('player-1', 'あなた')],
  currentPlayerId: 'player-1',
  maxTurns: GAME_CONFIG.MAX_TURNS,
  currentTurn: 1,
};

// メインのマルチゲーム状態管理
export const multiGameStateAtom = atom<MultiGameState>(initialMultiGameState);

// ゲームモード取得用
export const gameModeAtom = atom((get) => get(multiGameStateAtom).mode);

// 現在のプレイヤー取得用
export const currentPlayerAtom = atom((get) => {
  const state = get(multiGameStateAtom);
  return state.players.find(p => p.id === state.currentPlayerId) || state.players[0];
});

// 他のプレイヤー一覧取得用
export const otherPlayersAtom = atom((get) => {
  const state = get(multiGameStateAtom);
  return state.players.filter(p => p.id !== state.currentPlayerId);
});

// プレイヤーランキング取得用
export const playerRankingAtom = atom((get): PlayerRanking[] => {
  const state = get(multiGameStateAtom);
  return state.players
    .map(player => ({
      playerId: player.id,
      name: player.name,
      score: player.score,
      rank: 0, // 後で計算
    }))
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
});

// プレイヤー情報更新用アクション
export const updatePlayerAtom = atom(
  null,
  (get, set, playerId: string, updates: Partial<PlayerInfo>) => {
    const state = get(multiGameStateAtom);
    const updatedPlayers = state.players.map(player =>
      player.id === playerId ? { ...player, ...updates } : player
    );
    set(multiGameStateAtom, {
      ...state,
      players: updatedPlayers,
    });
  }
);

// プレイヤー追加用アクション（マルチモード時）
export const addPlayerAtom = atom(
  null,
  (get, set, name: string) => {
    const state = get(multiGameStateAtom);
    const newPlayerId = `player-${state.players.length + 1}`;
    const newPlayer = createInitialPlayer(newPlayerId, name);
    newPlayer.isCurrentPlayer = false;
    
    set(multiGameStateAtom, {
      ...state,
      players: [...state.players, newPlayer],
    });
  }
);

// モード切り替え用アクション
export const setGameModeAtom = atom(
  null,
  (get, set, mode: GameMode) => {
    const state = get(multiGameStateAtom);
    set(multiGameStateAtom, {
      ...state,
      mode,
    });
  }
);