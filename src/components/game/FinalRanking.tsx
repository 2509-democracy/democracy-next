import { useAtom } from 'jotai';
import { multiGameStateAtom } from '@/store/game';
import { Button } from '../ui/Button';

interface FinalRankingProps {
  onRestart: () => void;
  onBackToHome: () => void;
}

interface FinalPlayerResult {
  playerId: string;
  playerName: string;
  totalScore: number;
  rank: number;
  roundScores: number[];
  averageScore: number;
}

export function FinalRanking({ onRestart, onBackToHome }: FinalRankingProps) {
  const [multiGameState] = useAtom(multiGameStateAtom);
  
  // 最終結果の生成
  const finalResults: FinalPlayerResult[] = multiGameState.players
    .map(player => {
      // 各ラウンドのスコア（仮データ - 実際はroundResultsから取得）
      const roundScores = Array.from({ length: multiGameState.maxRounds }, 
        () => Math.floor(Math.random() * 50) + 30);
      const averageScore = Math.round(roundScores.reduce((a, b) => a + b, 0) / roundScores.length);
      
      return {
        playerId: player.id,
        playerName: player.name,
        totalScore: player.score,
        rank: 0, // 後で計算
        roundScores,
        averageScore,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((player, index) => ({ ...player, rank: index + 1 }));
    
  const currentPlayer = finalResults.find(p => p.playerId === multiGameState.currentPlayerId);
  const winner = finalResults[0];
  const isCurrentPlayerWinner = currentPlayer?.rank === 1;
  
  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎯';
    }
  };
  
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏆 最終結果発表
          </h1>
          <p className="text-lg text-gray-600">
            全{multiGameState.maxRounds}ラウンドが終了しました！
          </p>
        </div>
        
        {/* 優勝者の特別表示 */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-2">優勝</h2>
            <h3 className="text-4xl font-bold mb-4">{winner.playerName}</h3>
            <div className="text-2xl font-semibold">
              総合スコア: {winner.totalScore}点
            </div>
            {isCurrentPlayerWinner && (
              <div className="mt-4 text-xl animate-bounce">
                🎉 おめでとうございます！ 🎉
              </div>
            )}
          </div>
        </div>
        
        {/* 全体ランキング */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            最終ランキング
          </h3>
          
          <div className="space-y-4">
            {finalResults.map((result) => (
              <div 
                key={result.playerId}
                className={`rounded-lg p-6 border-2 ${
                  result.playerId === multiGameState.currentPlayerId
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* ランク表示 */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getRankColor(result.rank)}`}>
                      {getRankEmoji(result.rank)}
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {result.rank}位 - {result.playerName}
                        {result.playerId === multiGameState.currentPlayerId && (
                          <span className="ml-2 text-blue-600 text-sm">(あなた)</span>
                        )}
                      </h4>
                      <p className="text-gray-600">
                        平均スコア: {result.averageScore}点/ラウンド
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-800">
                      {result.totalScore}
                    </div>
                    <div className="text-gray-600 text-sm">総合スコア</div>
                  </div>
                </div>
                
                {/* ラウンド別スコア */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">
                    ラウンド別スコア
                  </h5>
                  <div className="grid grid-cols-5 gap-2">
                    {result.roundScores.map((score, roundIndex) => (
                      <div 
                        key={roundIndex}
                        className="text-center bg-white rounded p-2"
                      >
                        <div className="text-xs text-gray-600">R{roundIndex + 1}</div>
                        <div className="font-bold text-gray-800">{score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* ゲーム統計 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">ゲーム統計</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {multiGameState.maxRounds}
              </div>
              <div className="text-sm text-gray-600">総ラウンド数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {multiGameState.players.length}
              </div>
              <div className="text-sm text-gray-600">参加プレイヤー</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.max(...finalResults.map(r => r.totalScore))}
              </div>
              <div className="text-sm text-gray-600">最高スコア</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(finalResults.reduce((sum, r) => sum + r.averageScore, 0) / finalResults.length)}
              </div>
              <div className="text-sm text-gray-600">平均スコア</div>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onRestart}
          >
            もう一度プレイ
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={onBackToHome}
          >
            ホームに戻る
          </Button>
        </div>
        
        {/* 感謝メッセージ */}
        <div className="text-center mt-8 text-gray-600">
        </div>
      </div>
    </div>
  );
}