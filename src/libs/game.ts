import { TechCard, GameData } from '@/types/game';
import { GAME_CONFIG } from '@/const/game';

export function calculateTechLevelBonus(techLevels: Record<string, number>): number {
  let bonus = 0;
  Object.values(techLevels).forEach(level => {
    bonus += level * 5;
  });
  return bonus;
}

export function calculateFinalBonus(techLevels: Record<string, number>): number {
  let finalBonus = 0;
  Object.values(techLevels).forEach(level => {
    if (level === GAME_CONFIG.TECH_LEVEL_MAX) {
      finalBonus += GAME_CONFIG.FINAL_BONUS_PER_MAX_TECH;
    }
  });
  return finalBonus;
}

export function calculateResourceGain(roundScore: number): number {
  return Math.floor(roundScore / 50) + 5;
}

export function upgradeTechLevels(
  techLevels: Record<string, number>,
  selectedCards: TechCard[]
): Record<string, number> {
  const newTechLevels = { ...techLevels };
  
  selectedCards.forEach(card => {
    const currentLevel = newTechLevels[card.id] || card.level;
    newTechLevels[card.id] = Math.min(GAME_CONFIG.TECH_LEVEL_MAX, currentLevel + 1);
  });
  
  return newTechLevels;
}

export function isGameEnded(turn: number): boolean {
  return turn > GAME_CONFIG.MAX_TURNS;
}

export function canStartHackathon(
  selectedCards: TechCard[],
  idea: string
): boolean {
  return selectedCards.length > 0 && 
         selectedCards.length <= GAME_CONFIG.MAX_SELECTED_CARDS && 
         idea.trim() !== '';
}