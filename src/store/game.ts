import { atom } from 'jotai';
import { GameState, HackathonInfo, MultiGamePhase, PlayerSubmission, RoundResult, AIEvaluationResponse } from '@/types/game';
import { generateCardPool, getShuffledPool } from '@/features/card-pool';
import { THEMES, DIRECTIONS, GAME_CONFIG } from '@/const/game';
import { TechCard } from '@/features/card-pool';

// フェーズ持続時間の定数（秒単位）
export const PHASE_DURATIONS: Record<MultiGamePhase, number> = {
  waiting: 0,
  matching: 0,
  preparation: 20,
  submission_review: 10,
  ai_evaluation: 0,
  round_result: 20,
  final_ranking: 0,
};

// タイムスタンプベースのタイマー計算関数
export function calculateTimeLeft(phaseStartTime: Date, phase: MultiGamePhase): number {
  const duration = PHASE_DURATIONS[phase];
  if (duration === 0) return 0; // 無制限の場合

  const elapsed = (Date.now() - phaseStartTime.getTime()) / 1000;
  return Math.max(0, Math.floor(duration - elapsed));
}

// 特定フェーズの終了時刻を計算
export function calculatePhaseEndTime(phaseStartTime: Date, phase: MultiGamePhase): Date {
  const duration = PHASE_DURATIONS[phase];
  return new Date(phaseStartTime.getTime() + (duration * 1000));
}
// 現在の時刻がフェーズ終了時刻を過ぎているかチェック
export function isPhaseExpired(phaseStartTime: Date, phase: MultiGamePhase): boolean {
  const duration = PHASE_DURATIONS[phase];
  if (duration === 0) return false; // 無制限の場合は期限切れなし

  const elapsed = Date.now() - phaseStartTime.getTime();
  console.log(phaseStartTime, phase, elapsed, duration * 1000);
  return elapsed > (duration * 1000);
}

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

// ターン開始時の無料リロールatom
export const freeRerollShopAtom = atom(null, (get, set) => {
  // リソース消費なしでショップをリロール
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

// 詳細なゲームフェーズ定義（後方互換性のため保持）
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
  isConnected: boolean;
}

export interface MultiGameState {
  mode: 'single' | 'multi';
  players: MultiPlayer[];
  currentPlayerId: string;
  gameStarted: boolean;
  currentPhase: MultiGamePhase; // 新しいフェーズ型を使用
  timeLeft: number;
  isTimerActive: boolean;
  phaseMessage: string; // フェーズメッセージ
  // 新規追加フィールド
  currentRound: number;
  maxRounds: number;
  roundResults: RoundResult[];
  submissions: PlayerSubmission[];
  roomId?: string; // リアルタイム通信用のルームID
  isHost?: boolean; // ホストプレイヤーフラグ
  // タイムスタンプベースタイマー用フィールド
  gameStartTime?: Date; // ゲーム開始時刻
  currentPhaseStartTime?: Date; // 現在フェーズの開始時刻
  // AI評価結果保存用
  currentRoundAIEvaluations?: Record<string, AIEvaluationResponse>; // プレイヤーID -> AI評価結果
}

// マルチゲーム初期状態
const initialMultiGameState: MultiGameState = {
  mode: 'single',
  players: [],
  currentPlayerId: '',
  gameStarted: false,
  currentPhase: 'waiting',
  timeLeft: 0,
  isTimerActive: false,
  phaseMessage: 'ゲームの準備をしています...',
  currentRound: 1,
  maxRounds: GAME_CONFIG.MAX_TURNS,
  roundResults: [],
  submissions: [],
  gameStartTime: undefined,
  currentPhaseStartTime: undefined,
  currentRoundAIEvaluations: undefined,
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
      gameStarted: false, // matchingフェーズではまだゲーム開始していない
      currentPhase: 'waiting',
      phaseMessage: 'ゲームの準備をしています...',
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

// フェーズ遷移アクション（タイムスタンプ付き）
export const setPhaseAtom = atom(
  null,
  (get, set, phase: MultiGamePhase, message?: string) => {
    const multiState = get(multiGameStateAtom);
    const now = new Date();
    const phaseMessages: Record<MultiGamePhase, string> = {
      waiting: 'ゲームの準備をしています...',
      matching: 'プレイヤーを待っています...',
      preparation: '準備フェーズ - アイデアを考えよう！',
      submission_review: 'お題が出そろいました！',
      ai_evaluation: 'AI評価中...',
      round_result: '結果発表！',
      final_ranking: '最終ランキング',
    };

    set(multiGameStateAtom, {
      ...multiState,
      currentPhase: phase,
      phaseMessage: message || phaseMessages[phase],
      currentPhaseStartTime: now,
      // ゲーム開始時刻を記録（初回のpreparationフェーズで）
      gameStartTime: (phase === 'preparation' && !multiState.gameStartTime) ? now : multiState.gameStartTime,
      // タイマーのあるフェーズではタイマーを有効化
      isTimerActive: PHASE_DURATIONS[phase] > 0,
      timeLeft: PHASE_DURATIONS[phase],
    });
  }
);

// タイムスタンプベースでタイマーを更新
export const updateTimerFromTimestampAtom = atom(
  null,
  (get, set) => {
    const multiState = get(multiGameStateAtom);
    if (!multiState.currentPhaseStartTime) return;

    const timeLeft = calculateTimeLeft(multiState.currentPhaseStartTime, multiState.currentPhase);
    const isExpired = isPhaseExpired(multiState.currentPhaseStartTime, multiState.currentPhase);

    console.log('[Timer Debug] updateTimerFromTimestamp:', {
      phase: multiState.currentPhase,
      timeLeft,
      isExpired,
      elapsed: Date.now() - multiState.currentPhaseStartTime.getTime()
    });

    set(multiGameStateAtom, {
      ...multiState,
      timeLeft: Math.max(0, Math.floor(timeLeft)),
      // 修正: 期限切れになるまで継続（timeLeft > 0の条件を削除）
      isTimerActive: PHASE_DURATIONS[multiState.currentPhase] > 0 && !isExpired,
    });

    return { timeLeft: Math.floor(timeLeft), isExpired };
  }
);

// ゲーム開始時刻設定
export const setGameStartTimeAtom = atom(
  null,
  (get, set, startTime: Date) => {
    const multiState = get(multiGameStateAtom);
    set(multiGameStateAtom, {
      ...multiState,
      gameStartTime: startTime,
    });
  }
);
