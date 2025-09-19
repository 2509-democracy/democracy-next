import { TechCard, PoolGenerationOptions } from '../types';
import { ALL_TECH_CARDS } from '../constants/cards';

/**
 * カードプールを生成する
 */
export function generateCardPool(): TechCard[] {
  return ALL_TECH_CARDS.map(card => ({ ...card, level: 1 }));
}

/**
 * シャッフルされたカードプールを取得する
 */
export function getShuffledPool(options: PoolGenerationOptions = {}): TechCard[] {
  const { shuffled = true, size } = options;
  
  let pool = [...ALL_TECH_CARDS];
  
  if (shuffled) {
    pool = pool.sort(() => 0.5 - Math.random());
  }
  
  if (size && size > 0) {
    pool = pool.slice(0, size);
  }
  
  return pool;
}

/**
 * IDによってカードを取得する
 */
export function getCardById(id: string): TechCard | undefined {
  return ALL_TECH_CARDS.find(card => card.id === id);
}

/**
 * 複数IDによってカードを取得する
 */
export function getCardsByIds(ids: string[]): TechCard[] {
  return ids.map(id => getCardById(id)).filter((card): card is TechCard => card !== undefined);
}

/**
 * コスト範囲によってカードをフィルタリングする
 */
export function filterCardsByCost(cards: TechCard[], minCost?: number, maxCost?: number): TechCard[] {
  return cards.filter(card => {
    if (minCost !== undefined && card.cost < minCost) return false;
    if (maxCost !== undefined && card.cost > maxCost) return false;
    return true;
  });
}