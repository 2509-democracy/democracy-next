import { TechCard } from '@/features/card-pool';
import { TechLevelBonus, TechLevelUpgrade } from '../types';

/**
 * 技術レベルボーナスを計算する
 */
export function calculateTechLevelBonus(techLevels: Record<string, number>): number {
  let bonus = 0;
  Object.values(techLevels).forEach(level => {
    bonus += level * 5;
  });
  return bonus;
}

/**
 * 最終ボーナスを計算する
 */
export function calculateFinalBonus(
  techLevels: Record<string, number>,
  maxLevel: number = 5,
  bonusPerMaxTech: number = 100
): number {
  let finalBonus = 0;
  Object.values(techLevels).forEach(level => {
    if (level === maxLevel) {
      finalBonus += bonusPerMaxTech;
    }
  });
  return finalBonus;
}

/**
 * 技術レベルの詳細ボーナス情報を取得する
 */
export function getTechLevelBonusDetails(
  techLevels: Record<string, number>,
  maxLevel: number = 5,
  bonusPerMaxTech: number = 100
): TechLevelBonus {
  const levelBonus = calculateTechLevelBonus(techLevels);
  const finalBonus = calculateFinalBonus(techLevels, maxLevel, bonusPerMaxTech);
  
  return {
    totalBonus: levelBonus + finalBonus,
    levelBonus,
    finalBonus,
  };
}

/**
 * 技術レベルをアップグレードする
 */
export function upgradeTechLevels(
  techLevels: Record<string, number>,
  selectedCards: TechCard[],
  maxLevel: number = 5
): Record<string, number> {
  const newTechLevels = { ...techLevels };
  
  selectedCards.forEach(card => {
    const currentLevel = newTechLevels[card.id] || card.level;
    newTechLevels[card.id] = Math.min(maxLevel, currentLevel + 1);
  });
  
  return newTechLevels;
}

/**
 * 技術レベルのアップグレード詳細を取得する
 */
export function getTechLevelUpgrades(
  techLevels: Record<string, number>,
  selectedCards: TechCard[],
  maxLevel: number = 5
): TechLevelUpgrade[] {
  const upgrades: TechLevelUpgrade[] = [];
  
  selectedCards.forEach(card => {
    const oldLevel = techLevels[card.id] || card.level;
    const newLevel = Math.min(maxLevel, oldLevel + 1);
    
    upgrades.push({
      techId: card.id,
      oldLevel,
      newLevel,
      maxLevel: newLevel === maxLevel,
    });
  });
  
  return upgrades;
}

/**
 * 技術レベルを設定する
 */
export function setTechLevel(
  techLevels: Record<string, number>,
  techId: string,
  level: number
): Record<string, number> {
  return {
    ...techLevels,
    [techId]: level,
  };
}

/**
 * 最大レベルに達した技術の数を取得する
 */
export function getMaxLevelTechCount(
  techLevels: Record<string, number>,
  maxLevel: number = 5
): number {
  return Object.values(techLevels).filter(level => level === maxLevel).length;
}