import { TechCard, GameData } from '@/types/game';
import { GAME_CONFIG } from '@/const/game';

// 技術レベル関連の機能は @/features/tech-levels に移動されました
// 後方互換性のため、リエクスポート
export {
  calculateTechLevelBonus,
  calculateFinalBonus,
  upgradeTechLevels,
} from '@/features/tech-levels';

export function calculateResourceGain(roundScore: number): number {
  return Math.floor(roundScore / 50) + 5;
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