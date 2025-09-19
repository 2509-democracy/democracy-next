import { TechCard, getShuffledPool } from '@/features/card-pool';
import { PurchaseResult, RerollResult } from '../types';

/**
 * ショップの初期カードを生成する
 */
export function generateShopCards(size: number): TechCard[] {
  return getShuffledPool({ shuffled: true, size });
}

/**
 * ショップをリロールする
 */
export function rerollShop(currentResource: number, rerollCost: number, shopSize: number): RerollResult {
  if (currentResource < rerollCost) {
    return {
      success: false,
      error: 'リソースが不足しています',
    };
  }

  const newCards = generateShopCards(shopSize);
  return {
    success: true,
    newCards,
  };
}

/**
 * カードを購入する
 */
export function purchaseCard(
  card: TechCard,
  currentResource: number
): PurchaseResult {
  if (currentResource < card.cost) {
    return {
      success: false,
      error: 'リソースが不足しています',
    };
  }

  return {
    success: true,
    purchasedCard: card,
  };
}

/**
 * ショップからカードを削除する
 */
export function removeCardFromShop(shop: TechCard[], cardIndex: number): TechCard[] {
  return shop.filter((_, index) => index !== cardIndex);
}