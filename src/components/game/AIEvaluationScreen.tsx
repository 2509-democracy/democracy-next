import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { multiGameStateAtom } from '@/store/game';
import { Button } from '../ui/Button';
import { evaluateHackathon } from '@/libs/gemini';

interface AIEvaluationScreenProps {
  onEvaluationComplete: () => void;
}

interface EvaluationProgress {
  playerId: string;
  playerName: string;
  status: 'waiting' | 'evaluating' | 'completed' | 'error';
  score?: number;
  comment?: string;
}

export function AIEvaluationScreen({ onEvaluationComplete }: AIEvaluationScreenProps) {
  const [multiGameState] = useAtom(multiGameStateAtom);
  const [evaluationProgress, setEvaluationProgress] = useState<EvaluationProgress[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  
  const totalPlayers = multiGameState.players.length;
  const progressPercentage = Math.round((completedCount / totalPlayers) * 100);
  
  // 初期化
  useEffect(() => {
    const initialProgress = multiGameState.players.map(player => ({
      playerId: player.id,
      playerName: player.name,
      status: 'waiting' as const,
    }));
    setEvaluationProgress(initialProgress);
  }, [multiGameState.players]);
  
  // AI評価の実行
  const startEvaluation = async () => {
    if (isEvaluating) return;
    
    setIsEvaluating(true);
    
    try {
      // 順次評価（並列だとAPI制限に引っかかる可能性があるため）
      for (const player of multiGameState.players) {
        // 評価中状態に更新
        setEvaluationProgress(prev => prev.map(p => 
          p.playerId === player.id 
            ? { ...p, status: 'evaluating' }
            : p
        ));
        
        try {
          // AI評価の実行
          const techNames = player.selectedCards.map(card => card.name);
          const result = await evaluateHackathon({
            theme: "AI技術の活用", // TODO: 実際のテーマを取得
            direction: "実用的なソリューション", // TODO: 実際の方向性を取得
            idea: player.idea,
            techNames,
          });
          
          // 評価完了状態に更新
          setEvaluationProgress(prev => prev.map(p => 
            p.playerId === player.id 
              ? { 
                  ...p, 
                  status: 'completed',
                  score: result.score,
                  comment: `スコア: ${result.score}点` // 簡易コメント
                }
              : p
          ));
          
          setCompletedCount(prev => prev + 1);
          
        } catch (error) {
          console.error(`Player ${player.name} evaluation failed:`, error);
          // エラー状態に更新
          setEvaluationProgress(prev => prev.map(p => 
            p.playerId === player.id 
              ? { ...p, status: 'error', comment: '評価エラー' }
              : p
          ));
        }
        
        // 次の評価まで少し待機
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 評価完了後、5秒待ってから次のフェーズへ
      setTimeout(() => {
        onEvaluationComplete();
      }, 5000);
      
    } catch (error) {
      console.error('Evaluation process failed:', error);
    } finally {
      setIsEvaluating(false);
    }
  };
  
  // 評価の自動開始（画面が表示されたら開始）
  useEffect(() => {
    if (multiGameState.currentPhase === 'ai_evaluation' && !isEvaluating && completedCount === 0) {
      startEvaluation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiGameState.currentPhase]);
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 AI評価中...
        </h2>
        <p className="text-gray-600">
          各プレイヤーのアイデアをAIが評価しています
        </p>
      </div>
      
      {/* 全体の進捗 */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">評価進捗</h3>
          <span className="text-2xl font-bold text-blue-600">
            {progressPercentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center text-sm text-gray-600">
          {completedCount} / {totalPlayers} プレイヤーの評価完了
        </div>
      </div>
      
      {/* 個別プレイヤーの評価状況 */}
      <div className="space-y-3">
        {evaluationProgress.map((progress, index) => {
          const getStatusColor = (status: EvaluationProgress['status']) => {
            switch (status) {
              case 'waiting': return 'bg-gray-100 text-gray-600';
              case 'evaluating': return 'bg-blue-100 text-blue-700';
              case 'completed': return 'bg-green-100 text-green-700';
              case 'error': return 'bg-red-100 text-red-700';
              default: return 'bg-gray-100 text-gray-600';
            }
          };
          
          const getStatusText = (status: EvaluationProgress['status']) => {
            switch (status) {
              case 'waiting': return '待機中...';
              case 'evaluating': return '評価中...';
              case 'completed': return '評価完了';
              case 'error': return 'エラー';
              default: return '不明';
            }
          };
          
          const getStatusIcon = (status: EvaluationProgress['status']) => {
            switch (status) {
              case 'waiting': return '⏳';
              case 'evaluating': return '🔍';
              case 'completed': return '✅';
              case 'error': return '❌';
              default: return '❓';
            }
          };
          
          return (
            <div 
              key={progress.playerId}
              className="bg-white rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {progress.playerName}
                    </h4>
                    {progress.score && (
                      <p className="text-sm text-gray-600">
                        スコア: {progress.score}点
                      </p>
                    )}
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(progress.status)}`}>
                  <span>{getStatusIcon(progress.status)}</span>
                  <span>{getStatusText(progress.status)}</span>
                </div>
              </div>
              
              {progress.comment && (
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                  {progress.comment}
                </div>
              )}
              
              {progress.status === 'evaluating' && (
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-1">
                    <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{width: '60%'}} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 評価完了時のメッセージ */}
      {completedCount === totalPlayers && (
        <div className="text-center py-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            🎉 全ての評価が完了しました！
          </h3>
          <p className="text-green-600">
            まもなく結果発表画面に移動します...
          </p>
        </div>
      )}
      
      {/* 手動進行ボタン（開発・テスト用） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onEvaluationComplete}
          >
            [開発用] 結果画面に進む
          </Button>
        </div>
      )}
    </div>
  );
}