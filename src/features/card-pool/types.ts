export interface TechCard {
  id: string;
  name: string;
  category: string;
  cost: number;
  level: number;
  difficulty: number;
  popularity: number;
  performance: number;
  icon?: string; // アイコン画像パス
}

export interface CardPool {
  cards: TechCard[];
}

export interface PoolGenerationOptions {
  shuffled?: boolean;
  size?: number;
}
