import { TechCard } from '@/types/game';

// 後方互換性のため、カードプール機能からエクスポート
export { ALL_TECH_CARDS } from '@/features/card-pool';

export const THEMES = ['心', '光', '力', '命', '夢', '空', '時', '愛', '道', '美'];

export const DIRECTIONS = ['アイデア重視', '技術重視'];

export const GAME_CONFIG = {
  MAX_TURNS: 10,
  INITIAL_RESOURCE: 10,
  SHOP_SIZE: 5,
  MAX_SELECTED_CARDS: 3,
  REROLL_COST: 3,
  TECH_LEVEL_MAX: 5,
  FINAL_BONUS_PER_MAX_TECH: 100,
} as const;