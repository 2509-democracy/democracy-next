import { AIEvaluationRequest, AIEvaluationResponse } from '@/types/game';

/**
 * モックAI評価実装
 * Geminiの代わりに使用する擬似AI評価
 */
export async function evaluateHackathon({
  theme,
  direction,
  idea,
  techNames,
}: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  // 2秒の擬似評価時間
  await new Promise(resolve => setTimeout(resolve, 2000));

  // スコア計算ロジック
  const techBonus = techNames.length * 15; // 技術1つにつき15点
  const ideaLength = idea.trim().length;
  const ideaBonus = Math.min(ideaLength / 5, 25); // アイデアの長さに応じて最大25点
  
  // 方向性ボーナス（簡易実装）
  const directionBonus = direction.length > 0 ? 10 : 0;
  
  const randomBonus = Math.floor(Math.random() * 30) + 20; // 20-50点のランダム要素
  
  const baseScore = techBonus + ideaBonus + directionBonus + randomBonus;
  const finalScore = Math.min(Math.max(baseScore, 20), 100); // 20-100点の範囲

  console.log(`モックAI評価: テーマ「${theme}」, アイデア「${idea.trim() || 'アイデア未入力'}」, 技術: ${techNames.join(', ')}, スコア: ${Math.floor(finalScore)}`);

  return {
    score: Math.floor(finalScore)
  };
}