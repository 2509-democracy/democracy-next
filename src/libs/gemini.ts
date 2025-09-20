import { AIEvaluationRequest, AIEvaluationResponse } from "@/types/game";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function evaluateHackathon({
  theme,
  direction,
  idea,
  techNames,
}: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  let systemPrompt = "";
  switch (direction) {
    case "アイデア重視":
      systemPrompt = `
        必ず最初の行に 'SCORE: [合計点]' を出力してください。前置きや説明文は一切不要です。
        その後、各項目の点数・理由を穴埋め形式で記載してください。
        
        あなたはハッカソンのAI審査員です。与えられた「アイデア」と「使用技術」を評価してください。
        評価は、以下の観点ごとに最大点を明示し、合計100点満点でスコアを返してください。
        観点と配点:
        1. テーマへの合致度（20点）: アイデアがテーマに沿っているか
        2. アイデアの独創性（30点）: 他と差別化できるユニークさ
        3. アイデアと技術の親和性（20点）: アイデアと技術の組み合わせの適切さ
        4. 実現可能性（30点）: 現実的な実装が可能か
        以下の穴埋め形式で各項目の点数・理由・合計スコアを返してください。
        
        SCORE: [合計点]
        テーマへの合致度: [点数]/20点 理由: [理由]
        アイデアの独創性: [点数]/30点 理由: [理由]
        アイデアと技術の親和性: [点数]/20点 理由: [理由]
        実現可能性: [点数]/30点 理由: [理由]
      `;
      break;
    case "技術重視":
      systemPrompt = `
        必ず最初の行に 'SCORE: [合計点]' を出力してください。前置きや説明文は一切不要です。
        その後、各項目の点数・理由を穴埋め形式で記載してください。
        
        あなたはハッカソンのAI審査員です。与えられた「アイデア」と「使用技術」を評価してください。
        評価は、以下の観点ごとに最大点を明示し、合計100点満点でスコアを返してください。
        観点と配点:
        1. テーマへの合致度（20点）: アイデアがテーマに沿っているか
        2. アイデアと技術の親和性（20点）: アイデアと技術の組み合わせの適切さ
        3. 技術の親和性（組み合わせとしての親和性）（30点）: 技術同士の組み合わせの適切さ・新規性
        4. 実現可能性（30点）: 現実的な実装が可能か
        以下の穴埋め形式で各項目の点数・理由・合計スコアを返してください。
        
        SCORE: [合計点]
        テーマへの合致度: [点数]/20点 理由: [理由]
        アイデアと技術の親和性: [点数]/20点 理由: [理由]
        技術の親和性: [点数]/30点 理由: [理由]
        実現可能性: [点数]/30点 理由: [理由]
      `;
      break;
  }

  const userQuery = `
    今回のハッカソンテーマ: ${theme}
    今回のハッカソン方向性: ${direction}
    提出されたアイデア: ${idea}
    使用した技術: ${techNames.join(", ")}
  `;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    tools: [{ google_search: {} }],
  };

  try {
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key not found, using fallback score");
      return { score: 50 };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const scoreText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(scoreText);
    // 1行目のSCORE: [合計点]のみ抽出
    const firstLine = scoreText.split("\n")[0];
    const match = firstLine.match(/SCORE:\s*(\d+)/);
    const score = match ? parseInt(match[1], 10) : NaN;

    if (isNaN(score) || score < 0 || score > 100) {
      console.warn("Invalid score from API, using fallback:", scoreText);
      return { score: 50 };
    }

    return { score };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // エラー時のフォールバック
    return { score: 50 };
  }
}
