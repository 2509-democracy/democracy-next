import { useAtom } from 'jotai';
import { multiGameStateAtom } from '@/store/game';
import { Button } from '../ui/Button';
import { TechCard } from '../ui/TechCard';
import { TechCard as TechCardType } from '@/features/card-pool';
import { DetailedAIEvaluationResponse } from '@/types/game';

interface RoundResultProps {
  onNextRound: () => void;
  onFinishGame: () => void;
}

interface PlayerResult {
  playerId: string;
  playerName: string;
  score: number;
  rank: number;
  idea: string;
  techCards: TechCardType[];
  aiEvaluation: DetailedAIEvaluationResponse;
  totalScore: number;
}

export function RoundResult({ onNextRound, onFinishGame }: RoundResultProps) {
  const [multiGameState] = useAtom(multiGameStateAtom);
  
  // プレイヤー結果を生成（実際のデータを使用）
  const playerResults: PlayerResult[] = multiGameState.players
    .map(player => {
      // 実際のAI評価結果を取得、なければモックデータを使用
      const actualAIEvaluation = multiGameState.currentRoundAIEvaluations?.[player.id];
      
      let aiEvaluation: DetailedAIEvaluationResponse;
      
      if (actualAIEvaluation) {
        // 実際のAI評価結果を使用
        aiEvaluation = {
          totalScore: actualAIEvaluation.totalScore,
          comment: actualAIEvaluation.comment,
          generatedImageUrl: actualAIEvaluation.generatedImageUrl,
          breakdown: actualAIEvaluation.breakdown,
        };
      } else {
        // フォールバック: モックデータを使用
        aiEvaluation = {
          totalScore: Math.floor(Math.random() * 40) + 50, // 50-90点
          comment: "優れたアイデアで技術選定も適切です。実装への具体的なアプローチが明確で、実現可能性が高いと評価できます。",
          generatedImageUrl: undefined, // モックデータでは画像なし
          breakdown: {
            criteria1: Math.floor(Math.random() * 8) + 12, // 12-20点
            criteria2: Math.floor(Math.random() * 8) + 12, // 12-20点
            criteria3: Math.floor(Math.random() * 8) + 12, // 12-20点
            demoScore: Math.floor(Math.random() * 10) + 20, // 20-30点
          }
        };
      }
      
      return {
        playerId: player.id,
        playerName: player.name,
        score: player.score,
        rank: 0, // 後で計算
        idea: player.idea,
        techCards: player.selectedCards,
        aiEvaluation,
        totalScore: player.score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({ ...player, rank: index + 1 }));
    
  const isCurrentPlayer = (playerId: string) => playerId === multiGameState.currentPlayerId;
  const isLastRound = multiGameState.currentRound >= multiGameState.maxRounds;
  
  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}位`;
    }
  };
  
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎊 第{multiGameState.currentRound}ラウンド結果
        </h2>
        <p className="text-gray-600 mb-3">
          {isLastRound ? '最終ラウンドの結果です！' : `残り${multiGameState.maxRounds - multiGameState.currentRound}ラウンド`}
        </p>
        
        {/* タイマー表示 */}
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-medium">
          <span className="text-sm">⏰ 自動進行まで</span>
          <span className={`text-lg font-bold ${multiGameState.timeLeft <= 10 ? 'text-red-600' : 'text-orange-800'}`}>
            {Math.floor(multiGameState.timeLeft / 60)}:{(multiGameState.timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      
      {/* ラウンド情報 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-sm text-blue-600">現在のラウンド</span>
            <p className="text-xl font-bold text-blue-800">
              {multiGameState.currentRound}
            </p>
          </div>
          <div>
            <span className="text-sm text-blue-600">総ラウンド数</span>
            <p className="text-xl font-bold text-blue-800">
              {multiGameState.maxRounds}
            </p>
          </div>
          <div>
            <span className="text-sm text-blue-600">参加者数</span>
            <p className="text-xl font-bold text-blue-800">
              {multiGameState.players.length}
            </p>
          </div>
        </div>
      </div>
      
      {/* 結果一覧 */}
      <div className="space-y-3">
        {playerResults.map((result) => (
          <div 
            key={result.playerId}
            className={`border-2 rounded-lg p-6 ${
              isCurrentPlayer(result.playerId) 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* プレイヤー情報とランキング */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getRankColor(result.rank)}`}>
                  {getRankEmoji(result.rank)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {result.playerName}
                    {isCurrentPlayer(result.playerId) && (
                      <span className="ml-2 text-blue-600 text-sm">(あなた)</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>総合スコア: {result.totalScore}pt</span>
                    <span>今回獲得: +{result.aiEvaluation.totalScore}pt</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* アイデアとスコア詳細 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">提出アイデア</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {result.idea || 'アイデアが入力されていません'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">使用技術</h4>
                <div className="flex gap-1 flex-wrap">
                  {result.techCards.length > 0 ? (
                    result.techCards.map((card) => (
                      <TechCard
                        key={card.id}
                        card={card}
                        className="scale-75 opacity-80"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">技術カードが選択されていません</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* AI評価詳細 */}
            <div className="mt-6 space-y-4">
              {/* 生成画像 */}
              {result.aiEvaluation.generatedImageUrl && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">生成画像</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <img 
                      src={result.aiEvaluation.generatedImageUrl}
                      alt="AI生成画像"
                      className="w-full max-w-md mx-auto rounded-lg"
                      onError={(e) => {
                        // 画像読み込みエラー時は非表示にする
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* 採点詳細 */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-purple-700">AI評価詳細</span>
                  <span className="text-2xl font-bold text-purple-800">
                    {result.aiEvaluation.totalScore}点
                  </span>
                </div>
                
                {/* 採点項目の内訳 */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">採点項目1</div>
                    <div className="font-bold text-purple-700">{result.aiEvaluation.breakdown.criteria1}/20点</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">採点項目2</div>
                    <div className="font-bold text-purple-700">{result.aiEvaluation.breakdown.criteria2}/20点</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">採点項目3</div>
                    <div className="font-bold text-purple-700">{result.aiEvaluation.breakdown.criteria3}/20点</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-gray-600">デモ評価</div>
                    <div className="font-bold text-purple-700">{result.aiEvaluation.breakdown.demoScore}/30点</div>
                  </div>
                </div>
                
                {/* 採点講評 */}
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">採点講評</div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {result.aiEvaluation.comment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 進行ボタン */}
      <div className="flex flex-col items-center gap-3 pt-6">
        <div className="flex justify-center gap-4">
          {!isLastRound ? (
            <Button
              variant="primary"
              size="lg"
              onClick={onNextRound}
            >
              🚀 次のラウンドへ進む
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={onFinishGame}
            >
              🏆 最終結果を確認
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          {multiGameState.timeLeft > 0 
            ? `${multiGameState.timeLeft}秒後に自動進行します（手動で進むこともできます）`
            : '自動進行中...'
          }
        </p>
      </div>
      
      {/* 次ラウンドの情報 */}
      {!isLastRound && (
        <div className="text-center py-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">
            📈 次のラウンドについて
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 新しいテーマが出題されます</li>
            <li>• 獲得したリソースでショップから技術を購入できます</li>
            <li>• より高度な技術でより高いスコアを狙いましょう</li>
          </ul>
        </div>
      )}
    </div>
  );
}