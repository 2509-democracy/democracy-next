import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { multiGameStateAtom } from '@/store/game';
import { Button } from '../ui/Button';
import { evaluateHackathon } from '@/libs/mock-ai';

interface AIEvaluationScreenProps {
  onEvaluationComplete: () => void;
}

interface EvaluationProgress {
  playerId: string;
  playerName: string;
  status: 'waiting' | 'evaluating' | 'completed' | 'error';
  totalScore?: number;
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
          const techLevels = Object.fromEntries(player.selectedCards.map(card => [card.name, card.level]));
          const result = await evaluateHackathon({
            theme: "AI技術の活用", // TODO: 実際のテーマを取得
            direction: "実用的なソリューション", // TODO: 実際の方向性を取得
            idea: player.idea,
            techNames,
            techLevels,
          });
          
          // 評価完了状態に更新
          setEvaluationProgress(prev => prev.map(p => 
            p.playerId === player.id 
              ? { 
                  ...p, 
                  status: 'completed',
                  totalScore: result.totalScore,
                  comment: result.comment
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
    <div className="space-y-8 text-slate-100">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="mb-3 text-3xl font-black uppercase tracking-[0.4em] text-cyan-200">
          🤖 AI評価中...
        </h2>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          各プレイヤーのアイデアをAIが評価しています
        </p>
      </div>

      {/* 全体の進捗 */}
      <div className="rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-6 shadow-[0_0_45px_rgba(56,189,248,0.25)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">評価進捗</h3>
          <span className="text-3xl font-black tracking-[0.35em] text-cyan-100">
            {progressPercentage}%
          </span>
        </div>

        <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="text-center text-xs uppercase tracking-[0.35em] text-slate-300">
          {completedCount} / {totalPlayers} プレイヤーの評価完了
        </div>
      </div>

      {/* 個別プレイヤーの評価状況 */}
      <div className="space-y-4">
        {evaluationProgress.map((progress, index) => {
          const getStatusColor = (status: EvaluationProgress['status']) => {
            switch (status) {
              case 'waiting': return 'border-slate-700/60 text-slate-300';
              case 'evaluating': return 'border-cyan-400/40 text-cyan-200';
              case 'completed': return 'border-emerald-400/40 text-emerald-200';
              case 'error': return 'border-rose-400/40 text-rose-300';
              default: return 'border-slate-700/60 text-slate-300';
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
              className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-5 shadow-[0_0_35px_rgba(15,23,42,0.6)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900/70 text-sm font-bold text-cyan-200">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {progress.playerName}
                    </h4>
                    {progress.totalScore && (
                      <p className="text-xs text-slate-400">
                        スコア: {progress.totalScore}点
                      </p>
                    )}
                  </div>
                </div>

                <div className={`flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${getStatusColor(progress.status)}`}>
                  <span>{getStatusIcon(progress.status)}</span>
                  <span>{getStatusText(progress.status)}</span>
                </div>
              </div>

              {progress.comment && (
                <div className="mt-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3 text-xs text-slate-300">
                  {progress.comment}
                </div>
              )}

              {progress.status === 'evaluating' && (
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-3/5 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 評価完了時のメッセージ */}
      {completedCount === totalPlayers && (
        <div className="rounded-3xl border border-emerald-400/40 bg-slate-950/70 p-6 text-center shadow-[0_0_40px_rgba(16,185,129,0.35)]">
          <h3 className="mb-2 text-xl font-black text-emerald-200">
            🎉 全ての評価が完了しました！
          </h3>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-100">
            まもなく結果発表画面に移動します...
          </p>
        </div>
      )}

      {/* 手動進行ボタン（開発・テスト用） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="border-t border-slate-700/60 pt-4 text-center">
          <Button
            variant="secondary"
            className="border border-slate-700/60 bg-slate-900/70 text-xs uppercase tracking-[0.35em] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100"
            onClick={onEvaluationComplete}
          >
            [開発用] 結果画面に進む
          </Button>
        </div>
      )}
    </div>
  );
}