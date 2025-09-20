import { useAtom } from 'jotai';
import { multiGameStateAtom } from '@/store/game';
import { TechCard } from '@/components/ui/TechCard';

interface SubmissionReviewProps {
  onProceedToEvaluation: () => void;
}

export function SubmissionReview({ }: SubmissionReviewProps) {
  const [multiGameState] = useAtom(multiGameStateAtom);
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎯 提出されたアイデア
        </h2>
        <p className="text-gray-600">
          各プレイヤーの選択した技術とアイデアを確認してください
        </p>
      </div>
      
      {/* 現在のハッカソンテーマ */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">今回のお題</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-blue-600">テーマ</span>
            <p className="font-medium text-blue-900">
              {multiGameState.submissions[0]?.selectedCards[0] ? 'テーマ情報取得中...' : '未設定'}
            </p>
          </div>
          <div>
            <span className="text-sm text-blue-600">方向性</span>
            <p className="font-medium text-blue-900">
              {multiGameState.submissions[0]?.selectedCards[0] ? '方向性情報取得中...' : '未設定'}
            </p>
          </div>
        </div>
      </div>
      
      {/* 提出一覧 */}
      <div className="space-y-4">
        {multiGameState.players.map((player, index) => {
          const isCurrentPlayer = player.id === multiGameState.currentPlayerId;
          
          return (
            <div 
              key={player.id}
              className={`bg-white rounded-lg border-2 p-6 ${
                isCurrentPlayer 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              {/* プレイヤー情報 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    isCurrentPlayer ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {player.name}
                      {isCurrentPlayer && (
                        <span className="ml-2 text-blue-600 text-sm">(あなた)</span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500">
                      現在のスコア: {player.score}pt
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 選択された技術カード */}
              {player.selectedCards.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    選択した技術 ({player.selectedCards.length}枚)
                  </h5>
                  <div className="flex gap-2 flex-wrap">
                    {player.selectedCards.map((card) => (
                      <TechCard
                        key={card.id}
                        card={card}
                        className="opacity-80 cursor-default"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* アイデア */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  アイデア
                </h5>
                <div className="bg-gray-50 rounded-lg p-3">
                  {player.idea ? (
                    <p className="text-gray-800 leading-relaxed">{player.idea}</p>
                  ) : (
                    <p className="text-gray-500 italic">アイデアが入力されていません</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 自動進行メッセージ */}
      <div className="text-center py-4">
        <p className="text-gray-600">
          制限時間終了後、自動的にAI評価が開始されます...
        </p>
      </div>
    </div>
  );
}