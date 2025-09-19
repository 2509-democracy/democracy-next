import { AIEvaluationRequest, AIEvaluationResponse } from '@/types/game';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

export async function evaluateHackathon({
  theme,
  direction,
  idea,
  techNames,
}: AIEvaluationRequest): Promise<AIEvaluationResponse> {
  const systemPrompt = `
    あなたはハッカソンのAI審査員です。与えられた「アイデア」と「使用技術」を評価してください。
    評価は、以下の観点を踏まえ、100点満点のスコアで返してください。
    観点:
    1. アイデアの独創性（テーマと方向性に合っているか）
    2. 技術選定の適切性（アイデアと技術がマッチしているか）
    3. 技術レベルの高さ（使用した技術のレベル合計）
    スコアは整数値のみで、それ以外の説明は一切不要です。
  `;

  const userQuery = `
    今回のハッカソンテーマ: ${theme}
    今回のハッカソン方向性: ${direction}
    提出されたアイデア: ${idea}
    使用した技術: ${techNames.join(', ')}
  `;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    tools: [{ "google_search": {} }],
  };

  try {
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found, using fallback score');
      return { score: 50 };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const scoreText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    const score = parseInt(scoreText);

    if (isNaN(score) || score < 0 || score > 100) {
      console.warn('Invalid score from API, using fallback:', scoreText);
      return { score: 50 };
    }

    return { score };
  } catch (error) {
    console.error('Gemini API Error:', error);
    // エラー時のフォールバック
    return { score: 50 };
  }
}