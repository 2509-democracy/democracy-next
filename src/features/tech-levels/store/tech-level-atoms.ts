import { atom } from 'jotai';
import { TechCard } from '@/features/card-pool';
import { TechLevelState, TechLevelBonus } from '../types';
import {
  calculateTechLevelBonus,
  calculateFinalBonus,
  getTechLevelBonusDetails,
  upgradeTechLevels,
  setTechLevel,
  getMaxLevelTechCount,
} from '../services/tech-level-service';

// 技術レベルの基本状態
export const techLevelStateAtom = atom<TechLevelState>({
  levels: {},
});

// 技術レベル一覧（読み取り専用）
export const techLevelsAtom = atom(
  (get) => get(techLevelStateAtom).levels,
  (get, set, newLevels: Record<string, number>) => {
    set(techLevelStateAtom, { levels: newLevels });
  }
);

// 技術レベルボーナス（計算済み）
export const techLevelBonusAtom = atom((get) => {
  const levels = get(techLevelsAtom);
  return calculateTechLevelBonus(levels);
});

// 最終ボーナス（計算済み）
export const finalBonusAtom = atom((get) => {
  const levels = get(techLevelsAtom);
  return calculateFinalBonus(levels);
});

// 詳細ボーナス情報（計算済み）
export const techLevelBonusDetailsAtom = atom((get) => {
  const levels = get(techLevelsAtom);
  return getTechLevelBonusDetails(levels);
});

// 最大レベル技術数（計算済み）
export const maxLevelTechCountAtom = atom((get) => {
  const levels = get(techLevelsAtom);
  return getMaxLevelTechCount(levels);
});

// 技術レベル設定アクション
export const setTechLevelActionAtom = atom(null, (get, set, params: {
  techId: string;
  level: number;
}) => {
  const { techId, level } = params;
  const currentLevels = get(techLevelsAtom);
  const newLevels = setTechLevel(currentLevels, techId, level);
  set(techLevelsAtom, newLevels);
});

// 技術レベルアップグレードアクション
export const upgradeTechLevelsActionAtom = atom(null, (get, set, params: {
  selectedCards: TechCard[];
  maxLevel?: number;
}) => {
  const { selectedCards, maxLevel = 5 } = params;
  const currentLevels = get(techLevelsAtom);
  const newLevels = upgradeTechLevels(currentLevels, selectedCards, maxLevel);
  set(techLevelsAtom, newLevels);
  return newLevels;
});

// 技術レベル初期化アクション
export const initializeTechLevelsActionAtom = atom(null, (get, set) => {
  set(techLevelsAtom, {});
});