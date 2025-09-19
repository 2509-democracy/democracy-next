export interface TechCard {
  id: string;
  name: string;
  cost: number;
  level: number;
}

export interface CardPool {
  cards: TechCard[];
}

export interface PoolGenerationOptions {
  shuffled?: boolean;
  size?: number;
}