import { atom } from 'jotai';
import { TechCard } from '@/features/card-pool';
import { ShopState } from '../types';
import { generateShopCards, rerollShop, purchaseCard, removeCardFromShop } from '../services/shop-service';

// ショップの基本状態
export const shopStateAtom = atom<ShopState>({
  cards: [],
  isRerolling: false,
});

// ショップのカード一覧（読み取り専用）
export const shopCardsAtom = atom(
  (get) => get(shopStateAtom).cards
);

// ショップ初期化アクション
export const initializeShopAtom = atom(null, (get, set, shopSize: number) => {
  const newCards = generateShopCards(shopSize);
  set(shopStateAtom, {
    cards: newCards,
    isRerolling: false,
  });
});

// ショップリロールアクション
export const rerollShopActionAtom = atom(null, (get, set, params: {
  currentResource: number;
  rerollCost: number;
  shopSize: number;
  onResourceUpdate: (newResource: number) => void;
}) => {
  const { currentResource, rerollCost, shopSize, onResourceUpdate } = params;
  
  const result = rerollShop(currentResource, rerollCost, shopSize);
  
  if (result.success && result.newCards) {
    // リソースを消費
    onResourceUpdate(currentResource - rerollCost);
    
    // ショップを更新
    set(shopStateAtom, {
      cards: result.newCards,
      isRerolling: false,
    });
  }
  
  return result;
});

// カード購入アクション
export const purchaseCardActionAtom = atom(null, (get, set, params: {
  cardIndex: number;
  currentResource: number;
  onResourceUpdate: (newResource: number) => void;
  onHandUpdate: (newHand: TechCard[]) => void;
  onTechLevelUpdate: (techId: string, level: number) => void;
  currentHand: TechCard[];
  currentTechLevels: Record<string, number>;
}) => {
  const {
    cardIndex,
    currentResource,
    onResourceUpdate,
    onHandUpdate,
    onTechLevelUpdate,
    currentHand,
    currentTechLevels,
  } = params;
  
  const shopState = get(shopStateAtom);
  const card = shopState.cards[cardIndex];
  
  if (!card) {
    return { success: false, error: 'カードが見つかりません' };
  }
  
  const result = purchaseCard(card, currentResource);
  
  if (result.success && result.purchasedCard) {
    // リソースを消費
    onResourceUpdate(currentResource - card.cost);
    
    // 手札に追加
    onHandUpdate([...currentHand, result.purchasedCard]);
    
    // ショップから削除
    const newShopCards = removeCardFromShop(shopState.cards, cardIndex);
    set(shopStateAtom, {
      ...shopState,
      cards: newShopCards,
    });
    
    // 技術レベルを設定
    const currentLevel = currentTechLevels[card.id];
    if (!currentLevel) {
      onTechLevelUpdate(card.id, card.level);
    }
  }
  
  return result;
});