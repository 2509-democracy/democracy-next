import { atom } from 'jotai';
import { GameState, TechCard, HackathonInfo } from '@/types/game';
import { generateCardPool } from '@/features/card-pool';
import { initializeShopAtom } from '@/features/shop';
import { THEMES, DIRECTIONS, GAME_CONFIG } from '@/const/game';

// 初期状態
const initialGameState: GameState = {
  turn: 1,
  resource: GAME_CONFIG.INITIAL_RESOURCE,
  score: 0,
  hand: [],
  shop: [],
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

  // ショップを初期化（新しいショップ機能を使用）
  // Note: ショップの初期化は別途 initializeShopAtom で行う必要があります
});

export const rerollShopAtom = atom(null, (get, set) => {
  // 新しいショップ機能を使用するため、このatomは非推奨
  // rerollShopActionAtom を使用してください
  console.warn('rerollShopAtom is deprecated, use rerollShopActionAtom from @/features/shop');
});

export const buyCardAtom = atom(null, (get, set, cardIndex: number) => {
  // 新しいショップ機能を使用するため、このatomは非推奨
  // purchaseCardActionAtom を使用してください
  console.warn('buyCardAtom is deprecated, use purchaseCardActionAtom from @/features/shop');
});

export const ideaAtom = atom<string>('');