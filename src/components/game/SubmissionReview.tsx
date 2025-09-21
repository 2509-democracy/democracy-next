import { useAtom } from 'jotai';
import { multiGameStateAtom } from '@/store/game';
import { TechCard } from '@/components/ui/TechCard';

interface SubmissionReviewProps {
  onProceedToEvaluation: () => void;
}

export function SubmissionReview({ }: SubmissionReviewProps) {
  const [multiGameState] = useAtom(multiGameStateAtom);
  
  return (
    <div className="space-y-8 text-slate-100">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="mb-3 text-3xl font-black uppercase tracking-[0.4em] text-cyan-200">
          🎯 提出されたアイデア
        </h2>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          各プレイヤーの選択した技術とアイデアを確認してください
        </p>
      </div>

      {/* 現在のハッカソンテーマ */}
      <div className="rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-6 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">今回のお題</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">テーマ</span>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {multiGameState.submissions[0]?.selectedCards[0] ? 'テーマ情報取得中...' : '未設定'}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">方向性</span>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {multiGameState.submissions[0]?.selectedCards[0] ? '方向性情報取得中...' : '未設定'}
            </p>
          </div>
        </div>
      </div>

      {/* 提出一覧 */}
      <div className="space-y-6">
        {multiGameState.players.map((player, index) => {
          const isCurrentPlayer = player.id === multiGameState.currentPlayerId;

          return (
            <div
              key={player.id}
              className={`rounded-3xl border p-6 shadow-[0_0_45px_rgba(15,23,42,0.6)] ${
                isCurrentPlayer
                  ? 'border-sky-400/60 bg-slate-950/80'
                  : 'border-slate-700/60 bg-slate-950/70'
              }`}
            >
              {/* プレイヤー情報 */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                    isCurrentPlayer
                      ? 'border-sky-400/60 bg-slate-900/80 text-cyan-200'
                      : 'border-slate-700/60 bg-slate-900/70 text-slate-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {player.name}
                      {isCurrentPlayer && (
                        <span className="ml-2 text-xs uppercase tracking-[0.3em] text-cyan-300">(あなた)</span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">
                      現在のスコア: {player.score}点
                    </p>
                  </div>
                </div>
              </div>

              {/* 選択された技術カード */}
              {player.selectedCards.length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                    選択した技術 ({player.selectedCards.length}枚)
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {player.selectedCards.map((card) => (
                      <TechCard
                        key={card.id}
                        card={card}
                        className="cursor-default opacity-80"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* アイデア */}
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                  アイデア
                </h5>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 text-sm leading-relaxed text-slate-200">
                  {player.idea ? (
                    <p>{player.idea}</p>
                  ) : (
                    <p className="italic text-slate-500">アイデアが入力されていません</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 自動進行メッセージ */}
      <div className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 py-5 text-center shadow-[0_0_30px_rgba(56,189,248,0.25)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          制限時間終了後、自動的にAI評価が開始されます...
        </p>
      </div>
    </div>
  );
}