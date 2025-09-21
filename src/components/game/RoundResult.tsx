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
      // TODO: 実際のAI評価結果を使用（現在はモックデータ）
      const mockAiEvaluation: DetailedAIEvaluationResponse = {
        totalScore: Math.floor(Math.random() * 40) + 50, // 50-90点
        comment: "優れたアイデアで技術選定も適切です。実装への具体的なアプローチが明確で、実現可能性が高いと評価できます。",
        generatedImageUrl: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
        breakdown: {
          criteria1: Math.floor(Math.random() * 8) + 12, // 12-20点
          criteria2: Math.floor(Math.random() * 8) + 12, // 12-20点
          criteria3: Math.floor(Math.random() * 8) + 12, // 12-20点
          demoScore: Math.floor(Math.random() * 10) + 20, // 20-30点
        }
      };
      
      return {
        playerId: player.id,
        playerName: player.name,
        score: player.score,
        rank: 0, // 後で計算
        idea: player.idea,
        techCards: player.selectedCards,
        aiEvaluation: mockAiEvaluation,
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
      case 1: return 'border-amber-400/40 text-amber-200 bg-slate-900/70 shadow-[0_0_20px_rgba(250,204,21,0.35)]';
      case 2: return 'border-slate-500/40 text-slate-200 bg-slate-900/70 shadow-[0_0_20px_rgba(148,163,184,0.3)]';
      case 3: return 'border-orange-400/40 text-orange-200 bg-slate-900/70 shadow-[0_0_20px_rgba(249,115,22,0.35)]';
      default: return 'border-cyan-400/30 text-cyan-200 bg-slate-900/70 shadow-[0_0_20px_rgba(56,189,248,0.25)]';
    }
  };
  
  return (
    <div className="space-y-8 text-slate-100">
      {/* ヘッダー */}
      <div className="text-center">
        <h2 className="mb-3 text-3xl font-black uppercase tracking-[0.4em] text-cyan-200">
          🎊 第{multiGameState.currentRound}ラウンド結果
        </h2>
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-slate-400">
          {isLastRound ? '最終ラウンドの結果です！' : `残り${multiGameState.maxRounds - multiGameState.currentRound}ラウンド`}
        </p>

        {/* タイマー表示 */}
        <div className={`inline-flex items-center gap-3 rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] ${
          multiGameState.timeLeft <= 10
            ? 'border-rose-400/40 bg-rose-500/20 text-rose-200'
            : 'border-orange-400/40 bg-orange-500/20 text-orange-200'
        }`}
        >
          <span>⏰ 自動進行まで</span>
          <span className="text-lg font-black tracking-[0.35em]">
            {Math.floor(multiGameState.timeLeft / 60)}:{(multiGameState.timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ラウンド情報 */}
      <div className="rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-6 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">現在のラウンド</span>
            <p className="mt-2 text-2xl font-black text-cyan-100">
              {multiGameState.currentRound}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">総ラウンド数</span>
            <p className="mt-2 text-2xl font-black text-cyan-100">
              {multiGameState.maxRounds}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">参加者数</span>
            <p className="mt-2 text-2xl font-black text-cyan-100">
              {multiGameState.players.length}
            </p>
          </div>
        </div>
      </div>
      
      {/* 結果一覧 */}
      <div className="space-y-5">
        {playerResults.map((result) => (
          <div
            key={result.playerId}
            className={`rounded-3xl border p-6 shadow-[0_0_45px_rgba(15,23,42,0.6)] ${
              isCurrentPlayer(result.playerId)
                ? 'border-sky-400/60 bg-slate-950/80'
                : 'border-slate-700/60 bg-slate-950/70'
            }`}
          >
            {/* プレイヤー情報とランキング */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className={`rounded-2xl border px-5 py-3 text-2xl font-black ${getRankColor(result.rank)}`}>
                  {getRankEmoji(result.rank)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {result.playerName}
                    {isCurrentPlayer(result.playerId) && (
                      <span className="ml-3 text-xs uppercase tracking-[0.3em] text-cyan-300">(あなた)</span>
                    )}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>総合スコア: {result.totalScore}点</span>
                    <span>今回獲得: +{result.aiEvaluation.totalScore}点</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* アイデアとスコア詳細 */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">提出アイデア</h4>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 text-sm leading-relaxed text-slate-200">
                  {result.idea || 'アイデアが入力されていません'}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">使用技術</h4>
                <div className="flex flex-wrap gap-2">
                  {result.techCards.length > 0 ? (
                    result.techCards.map((card) => (
                      <TechCard
                        key={card.id}
                        card={card}
                        className="scale-75 cursor-default opacity-80"
                      />
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">技術カードが選択されていません</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* AI評価詳細 */}
            <div className="mt-6 space-y-4">
              {/* 生成画像 */}
              {result.aiEvaluation.generatedImageUrl && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">生成画像</h4>
                  <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3">
                    <img
                      src={result.aiEvaluation.generatedImageUrl}
                      alt="AI生成画像"
                      className="mx-auto w-full max-w-md rounded-xl"
                    />
                  </div>
                </div>
              )}
              
              {/* 採点詳細 */}
              <div className="rounded-2xl border border-fuchsia-400/30 bg-slate-950/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-200">AI評価詳細</span>
                  <span className="text-2xl font-black text-fuchsia-200">
                    {result.aiEvaluation.totalScore}点
                  </span>
                </div>

                {/* 採点項目の内訳 */}
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">採点項目1</div>
                    <div className="text-sm font-semibold text-fuchsia-200">{result.aiEvaluation.breakdown.criteria1}/20点</div>
                  </div>
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">採点項目2</div>
                    <div className="text-sm font-semibold text-fuchsia-200">{result.aiEvaluation.breakdown.criteria2}/20点</div>
                  </div>
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">採点項目3</div>
                    <div className="text-sm font-semibold text-fuchsia-200">{result.aiEvaluation.breakdown.criteria3}/20点</div>
                  </div>
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">デモ評価</div>
                    <div className="text-sm font-semibold text-fuchsia-200">{result.aiEvaluation.breakdown.demoScore}/30点</div>
                  </div>
                </div>

                {/* 採点講評 */}
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3">
                  <div className="mb-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">採点講評</div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {result.aiEvaluation.comment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 進行ボタン */}
      <div className="flex flex-col items-center gap-4 pt-6">
        <div className="flex flex-wrap justify-center gap-4">
          {!isLastRound ? (
            <Button
              variant="primary"
              size="lg"
              className="border border-cyan-300/40 bg-gradient-to-r from-cyan-500/70 to-sky-500/70 text-xs uppercase tracking-[0.35em] text-white shadow-[0_0_35px_rgba(56,189,248,0.35)] hover:from-cyan-400/70 hover:to-sky-400/70"
              onClick={onNextRound}
            >
              🚀 次のラウンドへ進む
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="border border-emerald-300/40 bg-gradient-to-r from-emerald-500/70 to-teal-500/70 text-xs uppercase tracking-[0.35em] text-white shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:from-emerald-400/70 hover:to-teal-400/70"
              onClick={onFinishGame}
            >
              🏆 最終結果を確認
            </Button>
          )}
        </div>

        <p className="text-xs uppercase tracking-[0.35em] text-slate-400 text-center">
          {multiGameState.timeLeft > 0
            ? `${multiGameState.timeLeft}秒後に自動進行します（手動で進むこともできます）`
            : '自動進行中...'
          }
        </p>
      </div>

      {/* 次ラウンドの情報 */}
      {!isLastRound && (
        <div className="rounded-3xl border border-emerald-400/30 bg-slate-950/70 py-6 text-center shadow-[0_0_35px_rgba(16,185,129,0.3)]">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
            📈 次のラウンドについて
          </h4>
          <ul className="space-y-2 text-xs uppercase tracking-[0.3em] text-emerald-100">
            <li>• 新しいテーマが出題されます</li>
            <li>• 獲得したリソースでショップから技術を購入できます</li>
            <li>• より高度な技術でより高いスコアを狙いましょう</li>
          </ul>
        </div>
      )}
    </div>
  );
}