import { AIEvaluationRequest, AIEvaluationResponse } from '@/types/game';

/**
 * 採点講評テンプレート
 */
const COMMENT_TEMPLATES = [
  "優れたアイデアで技術選定も適切です。実装への具体的なアプローチが明確で、実現可能性が高いと評価できます。",
  "創造的なアイデアですが、技術的な実装面でやや課題があります。もう少し具体的な技術選定があると良いでしょう。",
  "技術的な深さがあり、実装レベルが高いです。ユーザー体験への配慮も見られ、完成度の高い提案です。",
  "テーマに対する理解が深く、独創的なアプローチが評価できます。技術とアイデアのバランスが取れています。",
  "実用性に優れた提案です。技術選定が適切で、実際のサービスとして展開できそうな完成度があります。"
];

/**
 * ダミー画像URL生成
 */
const generateMockImageUrl = (theme: string, idea: string): string => {
  const imageId = Math.floor(Math.random() * 1000) + 1;
  return `https://picsum.photos/400/300?random=${imageId}&blur=1`;
};

/**
 * モックAI評価実装
 * 新しい採点項目に対応した擬似AI評価
 */
export async function evaluateHackathon({
  theme,
  direction,
  idea,
  techNames,
}: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  // 3秒の擬似評価時間
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 各項目の採点ロジック
  const ideaLength = idea.trim().length;
  const techCount = techNames.length;
  const response = await fetch(process.env.NEXT_PUBLIC_IPOINT_API_KEY as string, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idea,
      techNames,
      theme,
      direction
    }),
  }).then((res) => res.json());
  console.log(response)
  
  // 採点項目1: アイデアの独創性（20点満点）
  const criteria1 = response.breakdown.criteria1;
  
  // 採点項目2: 技術選定の適切性（20点満点）
  const criteria2 = response.breakdown.criteria2;
  
  // 採点項目3: テーマ適合性（20点満点）
  const criteria3 = response.breakdown.criteria3;
  
  // デモ評価点（30点満点）
  const demoScore = Math.min(Math.max(
    15 + Math.floor(Math.random() * 12) + (techCount * 2), 
    10
  ), 30);

  const totalScore = criteria1 + criteria2 + criteria3 + demoScore;
  
  // ランダムな講評を選択
  const comment = COMMENT_TEMPLATES[Math.floor(Math.random() * COMMENT_TEMPLATES.length)];
  
  // ダミー画像URL生成
  const generatedImageUrl = response.generatedImageUrl;


  console.log(`モックAI評価: テーマ「${theme}」, アイデア「${idea.trim() || 'アイデア未入力'}」, 技術: ${techNames.join(', ')}, 総合スコア: ${Math.floor(totalScore)}`);

  return {
    totalScore: Math.floor(totalScore),
    comment,
    generatedImageUrl,
    breakdown: {
      criteria1: Math.floor(criteria1),
      criteria2: Math.floor(criteria2),
      criteria3: Math.floor(criteria3),
      demoScore: Math.floor(demoScore)
    }
  };
}