import { atom } from 'jotai';
import { GameState, HackathonInfo } from '@/types/game';
import { generateCardPool, getShuffledPool } from '@/features/card-pool';
import { THEMES, DIRECTIONS, GAME_CONFIG } from '@/const/game';
import { TechCard } from '@/features/card-pool';

// 初期状態
const initialGameState: GameState = {
  turn: 1,
  resource: GAME_CONFIG.INITIAL_RESOURCE,
  score: 0,
  hand: [],
  shop: [], // TODO: features/shop に完全移行後は削除予定
  cardPool: generateCardPool(),
  techLevels: {},
  hackathonInfo: null,
  selectedCards: [],
  phase: 'preparation',
  isLoading: false,
};

// 基本的なゲーム状態atom
export const gameStateAtom = atom<GameState>(initialGameState);

// derived atoms（計算されたatom）
export const turnAtom = atom(
  (get) => get(gameStateAtom).turn,
  (get, set, newTurn: number) => {
    set(gameStateAtom, { ...get(gameStateAtom), turn: newTurn });
  }
);

export const resourceAtom = atom(
  (get) => get(gameStateAtom).resource,
  (get, set, newResource: number) => {
    set(gameStateAtom, { ...get(gameStateAtom), resource: newResource });
  }
);

export const scoreAtom = atom(
  (get) => get(gameStateAtom).score,
  (get, set, newScore: number) => {
    set(gameStateAtom, { ...get(gameStateAtom), score: newScore });
  }
);

export const handAtom = atom(
  (get) => get(gameStateAtom).hand,
  (get, set, newHand: TechCard[]) => {
    set(gameStateAtom, { ...get(gameStateAtom), hand: newHand });
  }
);

export const shopAtom = atom(
  (get) => get(gameStateAtom).shop,
  (get, set, newShop: TechCard[]) => {
    set(gameStateAtom, { ...get(gameStateAtom), shop: newShop });
  }
);

export const selectedCardsAtom = atom(
  (get) => get(gameStateAtom).selectedCards,
  (get, set, newSelectedCards: TechCard[]) => {
    set(gameStateAtom, { ...get(gameStateAtom), selectedCards: newSelectedCards });
  }
);

export const hackathonInfoAtom = atom(
  (get) => get(gameStateAtom).hackathonInfo,
  (get, set, newInfo: HackathonInfo | null) => {
    set(gameStateAtom, { ...get(gameStateAtom), hackathonInfo: newInfo });
  }
);

export const techLevelsAtom = atom(
  (get) => get(gameStateAtom).techLevels,
  (get, set, newTechLevels: Record<string, number>) => {
    set(gameStateAtom, { ...get(gameStateAtom), techLevels: newTechLevels });
  }
);

export const phaseAtom = atom(
  (get) => get(gameStateAtom).phase,
  (get, set, newPhase: GameState['phase']) => {
    set(gameStateAtom, { ...get(gameStateAtom), phase: newPhase });
  }
);

export const isLoadingAtom = atom(
  (get) => get(gameStateAtom).isLoading,
  (get, set, isLoading: boolean) => {
    set(gameStateAtom, { ...get(gameStateAtom), isLoading });
  }
);

// アクション用のatom
export const initializeGameAtom = atom(null, (get, set) => {
  const newHackathonInfo: HackathonInfo = {
    theme: THEMES[Math.floor(Math.random() * THEMES.length)],
    direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
  };

  set(gameStateAtom, {
    ...initialGameState,
    hackathonInfo: newHackathonInfo,
  });

  // ショップを生成
  const shuffledPool = getShuffledPool({ shuffled: true, size: GAME_CONFIG.SHOP_SIZE });
  set(shopAtom, shuffledPool);
});

export const rerollShopAtom = atom(null, (get, set) => {
  const state = get(gameStateAtom);
  if (state.resource < GAME_CONFIG.REROLL_COST) return;

  set(resourceAtom, state.resource - GAME_CONFIG.REROLL_COST);
  
  const shuffledPool = getShuffledPool({ shuffled: true, size: GAME_CONFIG.SHOP_SIZE });
  set(shopAtom, shuffledPool);
});

export const buyCardAtom = atom(null, (get, set, cardIndex: number) => {
  const state = get(gameStateAtom);
  const card = state.shop[cardIndex];
  
  if (!card || state.resource < card.cost) return;

  // リソースを消費
  set(resourceAtom, state.resource - card.cost);
  
  // 手札に追加
  set(handAtom, [...state.hand, card]);
  
  // ショップから削除
  const newShop = state.shop.filter((_, index) => index !== cardIndex);
  set(shopAtom, newShop);
  
  // 技術レベルを設定
  const newTechLevels = { ...state.techLevels };
  newTechLevels[card.id] = newTechLevels[card.id] || card.level;
  set(techLevelsAtom, newTechLevels);
});

export const ideaAtom = atom<string>('');

// 詳細なゲームフェーズ定義
export type GamePhase = 'waiting' | 'preparation' | 'hackathon_ready' | 'execution' | 'evaluation' | 'result' | 'ranking';

// マルチモード用の拡張
export interface MultiPlayer {
  id: string;
  name: string;
  score: number;
  resource: number;
  techLevels: Record<string, number>;
  hand: TechCard[];
  selectedCards: TechCard[];
  idea: string;
  isReady: boolean;
  isConnected: boolean;
}

export interface MultiGameState {
  mode: 'single' | 'multi';
  players: MultiPlayer[];
  currentPlayerId: string;
  gameStarted: boolean;
  currentPhase: GamePhase;
  timeLeft: number;
  isTimerActive: boolean;
  phaseMessage: string; // フェーズメッセージ
}

// マルチゲーム初期状態
const initialMultiGameState: MultiGameState = {
  mode: 'single',
  players: [],
  currentPlayerId: '',
  gameStarted: false,
  currentPhase: 'preparation',
  timeLeft: 0,
  isTimerActive: false,
  phaseMessage: 'ゲーム準備中...',
};

// マルチゲーム用atom
export const multiGameStateAtom = atom<MultiGameState>(initialMultiGameState);

// マルチゲーム用derived atoms
export const currentPlayerAtom = atom((get) => {
  const multiState = get(multiGameStateAtom);
  return multiState.players.find(p => p.id === multiState.currentPlayerId) || null;
});

export const otherPlayersAtom = atom((get) => {
  const multiState = get(multiGameStateAtom);
  return multiState.players.filter(p => p.id !== multiState.currentPlayerId);
});

// マルチゲーム初期化action
export const initializeMultiGameAtom = atom(
  null,
  (get, set, players: MultiPlayer[], playerId: string) => {
    set(multiGameStateAtom, {
      ...initialMultiGameState,
      mode: 'multi',
      players,
      currentPlayerId: playerId,
      gameStarted: true,
    });
    
    // 現在のプレイヤーの状態をゲーム状態に反映
    const currentPlayer = players.find(p => p.id === playerId);
    if (currentPlayer) {
      set(gameStateAtom, {
        ...get(gameStateAtom),
        resource: currentPlayer.resource,
        score: currentPlayer.score,
        techLevels: currentPlayer.techLevels,
        hand: currentPlayer.hand,
        selectedCards: currentPlayer.selectedCards,
      });
      set(ideaAtom, currentPlayer.idea);
    }
  }
);

// タイマー関連
export const startTimerAtom = atom(
  null,
  (get, set, seconds: number) => {
    const multiState = get(multiGameStateAtom);
    set(multiGameStateAtom, {
      ...multiState,
      timeLeft: seconds,
      isTimerActive: true,
    });
  }
);

export const stopTimerAtom = atom(
  null,
  (get, set) => {
    const multiState = get(multiGameStateAtom);
    set(multiGameStateAtom, {
      ...multiState,
      isTimerActive: false,
    });
  }
);

export const updateTimerAtom = atom(
  null,
  (get, set, timeLeft: number) => {
    const multiState = get(multiGameStateAtom);
    set(multiGameStateAtom, {
      ...multiState,
      timeLeft: Math.max(0, timeLeft),
    });
  }
);

// フェーズ遷移アクション
export const setPhaseAtom = atom(
  null,
  (get, set, phase: GamePhase, message?: string) => {
    const multiState = get(multiGameStateAtom);
    const phaseMessages: Record<GamePhase, string> = {
      waiting: 'プレイヤーを待っています...',
      preparation: '準備フェーズ - アイデアを考えよう！',
      hackathon_ready: 'お題が出そろいました！',
      execution: 'ハッカソン実行中...',
      evaluation: 'AI評価中...',
      result: '結果発表！',
      ranking: '最終ランキング',
    };
    
    set(multiGameStateAtom, {
      ...multiState,
      currentPhase: phase,
      phaseMessage: message || phaseMessages[phase],
    });
  }
);

// 全プレイヤーの準備完了チェック
export const checkAllReadyAtom = atom((get) => {
  const multiState = get(multiGameStateAtom);
  return multiState.players.length > 0 && multiState.players.every(p => p.isReady);
});

// プレイヤーの準備状態を切り替え
export const togglePlayerReadyAtom = atom(
  null,
  (get, set, playerId: string) => {
    const multiState = get(multiGameStateAtom);
    const updatedPlayers = multiState.players.map(player =>
      player.id === playerId ? { ...player, isReady: !player.isReady } : player
    );
    
    set(multiGameStateAtom, {
      ...multiState,
      players: updatedPlayers,
    });
    
    // 全員準備完了の場合、フェーズを進める
    const allReady = updatedPlayers.every(p => p.isReady);
    if (allReady && multiState.currentPhase === 'preparation') {
      // 「お題が出そろいました！」フェーズに遷移
      set(setPhaseAtom, 'hackathon_ready', 'お題が出そろいました！');
      // 5秒後にexecutionフェーズに自動遷移
      setTimeout(() => {
        set(setPhaseAtom, 'execution', 'ハッカソン実行中...');
      }, 5000);
    }
  }
);