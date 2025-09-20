import { AIEvaluationRequest, AIEvaluationResponse } from "@/types/game";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function executeAPI({
  theme,
  direction,
  idea,
  techNames,
}: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  let systemPrompt = "";
  switch (direction) {
    case "技術重視":
      systemPrompt = `
        必ず最初の行に 'SCORE: [合計点]' を出力してください。前置きや説明文は一切不要です。
        その後、各項目の点数・理由を穴埋め形式で記載してください。
        あなたはハッカソンのAI審査員です。与えられた「アイデア」と「使用技術」を評価してください。
        評価は、以下の観点ごとに最大点を明示し、合計100点満点でスコアを返してください。
        観点と配点:
        1. テーマへの合致度（10点）: アイデアがテーマに沿っているか
        2. 技術チャレンジ（難易度）（30点）: 技術的な挑戦度・難易度
        3. アイデアに対する技術の妥当性（30点）: 技術選定の妥当性
        4. アイデアに対する技術的実現性（30点）: 技術的に実現可能か
        以下の穴埋め形式で各項目の点数・理由・合計スコアを返してください。
        SCORE: [合計点]
        テーマへの合致度: [点数]/10点 理由: [理由]
        技術チャレンジ: [点数]/30点 理由: [理由]
        技術の妥当性: [点数]/30点 理由: [理由]
        技術的実現性: [点数]/30点 理由: [理由]
      `;
      break;
    case "ビジネス性重視":
      systemPrompt = `
        必ず最初の行に 'SCORE: [合計点]' を出力してください。前置きや説明文は一切不要です。
        その後、各項目の点数・理由を穴埋め形式で記載してください。
        あなたはハッカソンのAI審査員です。与えられた「アイデア」と「使用技術」を評価してください。
        評価は、以下の観点ごとに最大点を明示し、合計100点満点でスコアを返してください。
        観点と配点:
        1. テーマへの合致度（10点）: アイデアがテーマに沿っているか
        2. アイデアのビジネス的実現性（30点）: ビジネスとして成立するか
        3. ビジネス的価値の提供（30点）: 社会・市場への価値
        4. アイデアに対する技術の妥当性（30点）: 技術選定の妥当性
        以下の穴埋め形式で各項目の点数・理由・合計スコアを返してください。
        SCORE: [合計点]
        テーマへの合致度: [点数]/10点 理由: [理由]
        ビジネス的実現性: [点数]/30点 理由: [理由]
        ビジネス的価値: [点数]/30点 理由: [理由]
        技術の妥当性: [点数]/30点 理由: [理由]
      `;
      break;
    case "おもしろさ重視":
      systemPrompt = `
        必ず最初の行に 'SCORE: [合計点]' を出力してください。前置きや説明文は一切不要です。
        その後、各項目の点数・理由を穴埋め形式で記載してください。
        あなたはハッカソンのAI審査員です。与えられた「アイデア」と「使用技術」を評価してください。
        評価は、以下の観点ごとに最大点を明示し、合計100点満点でスコアを返してください。
        観点と配点:
        1. テーマへの合致度（10点）: アイデアがテーマに沿っているか
        2. アイデアの面白さ・楽しさ（30点）: ユーザー体験・楽しさ
        3. 技術の無駄使いポイント（30点）: 技術のユニークな使い方
        4. アイデアに対する技術的実現性（30点）: 技術的に実現可能か
        以下の穴埋め形式で各項目の点数・理由・合計スコアを返してください。
        SCORE: [合計点]
        テーマへの合致度: [点数]/10点 理由: [理由]
        面白さ・楽しさ: [点数]/30点 理由: [理由]
        技術の無駄使い: [点数]/30点 理由: [理由]
        技術的実現性: [点数]/30点 理由: [理由]
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
      return { score: 50, response: "Gemini API key not found" };
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
    const scoreText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log(scoreText);
    // 1行目のSCORE: [合計点]のみ抽出
    const firstLine = scoreText.split("\n")[0];
    const match = firstLine.match(/SCORE:\s*(\d+)/);
    const score = match ? parseInt(match[1], 10) : NaN;

    if (isNaN(score) || score < 0 || score > 100) {
      console.warn("Invalid score from API, using fallback:", scoreText);
      return { score: 50, response: scoreText };
    }

    return { score, response: scoreText };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // エラー時のフォールバック
    return { score: 50, response: String(error) };
  }
}
