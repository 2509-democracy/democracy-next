import { TechCard } from '@/features/card-pool';

export interface TechLevelState {
  levels: Record<string, number>;
}

export interface TechLevelBonus {
  totalBonus: number;
  levelBonus: number;
  finalBonus: number;
}

export interface TechLevelUpgrade {
  techId: string;
  oldLevel: number;
  newLevel: number;
  maxLevel: boolean;
}