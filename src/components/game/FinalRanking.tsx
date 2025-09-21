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

  const summaryStats = [
    {
      label: '総ラウンド数',
      value: multiGameState.maxRounds,
      color: 'text-cyan-200',
    },
    {
      label: '参加プレイヤー',
      value: multiGameState.players.length,
      color: 'text-emerald-200',
    },
    {
      label: '最高スコア',
      value: Math.max(...finalResults.map(r => r.totalScore)),
      color: 'text-fuchsia-200',
    },
    {
      label: '平均スコア',
      value: Math.round(finalResults.reduce((sum, r) => sum + r.averageScore, 0) / finalResults.length),
      color: 'text-orange-200',
    },
  ];
  
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
      case 1: return 'border-amber-400/50 bg-slate-950/80 text-amber-200 shadow-[0_0_35px_rgba(250,204,21,0.35)]';
      case 2: return 'border-slate-500/50 bg-slate-950/80 text-slate-200 shadow-[0_0_30px_rgba(148,163,184,0.35)]';
      case 3: return 'border-orange-400/50 bg-slate-950/80 text-orange-200 shadow-[0_0_35px_rgba(249,115,22,0.35)]';
      default: return 'border-cyan-400/40 bg-slate-950/80 text-cyan-200 shadow-[0_0_25px_rgba(56,189,248,0.3)]';
    }
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/title_image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/85 to-black/95" aria-hidden="true" />

      <div className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* ヘッダー */}
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-black uppercase tracking-[0.4em] text-cyan-200">
              🏆 最終結果発表
            </h1>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              全{multiGameState.maxRounds}ラウンドが終了しました！
            </p>
          </div>

          {/* 優勝者の特別表示 */}
          <div className="overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500/30 via-amber-500/20 to-transparent p-10 text-center text-amber-100 shadow-[0_0_80px_rgba(250,204,21,0.35)] backdrop-blur-xl">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-semibold tracking-[0.35em] uppercase">優勝</h2>
            <h3 className="mt-3 text-4xl font-black text-white">{winner.playerName}</h3>
            <div className="mt-4 text-xl font-semibold tracking-[0.3em] text-amber-200">
              総合スコア: {winner.totalScore}点
            </div>
            {isCurrentPlayerWinner && (
              <div className="mt-6 text-lg uppercase tracking-[0.4em] text-white animate-bounce">
                🎉 おめでとうございます！ 🎉
              </div>
            )}
          </div>
        
        {/* 全体ランキング */}
        <div className="space-y-6 rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-6 shadow-[0_0_60px_rgba(56,189,248,0.35)] backdrop-blur-xl">
          <h3 className="text-center text-2xl font-bold uppercase tracking-[0.35em] text-cyan-200">
            最終ランキング
          </h3>

          <div className="space-y-5">
            {finalResults.map((result) => (
              <div
                key={result.playerId}
                className={`rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  result.playerId === multiGameState.currentPlayerId
                    ? 'border-sky-400/60 bg-slate-950/80 shadow-[0_0_45px_rgba(56,189,248,0.35)]'
                    : 'border-slate-700/60 bg-slate-950/70 shadow-[0_0_35px_rgba(15,23,42,0.6)]'
                }`}
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    {/* ランク表示 */}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl font-bold ${getRankColor(result.rank)}`}>
                      {getRankEmoji(result.rank)}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-slate-100">
                        {result.rank}位 - {result.playerName}
                        {result.playerId === multiGameState.currentPlayerId && (
                          <span className="ml-3 text-xs uppercase tracking-[0.3em] text-cyan-300">(あなた)</span>
                        )}
                      </h4>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        平均スコア: {result.averageScore}点/ラウンド
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-white tracking-[0.2em]">
                      {result.totalScore}
                    </div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">総合スコア</div>
                  </div>
                </div>

                {/* ラウンド別スコア */}
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
                  <h5 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                    ラウンド別スコア
                  </h5>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {result.roundScores.map((score, roundIndex) => (
                      <div
                        key={roundIndex}
                        className="rounded-xl border border-slate-700/50 bg-slate-950/80 p-3 text-center text-slate-200"
                      >
                        <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">R{roundIndex + 1}</div>
                        <div className="text-sm font-semibold text-white">{score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* ゲーム統計 */}
        <div className="rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-6 shadow-[0_0_45px_rgba(56,189,248,0.3)] backdrop-blur-xl">
          <h3 className="text-xl font-semibold uppercase tracking-[0.35em] text-cyan-200 mb-6">ゲーム統計</h3>
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[0_0_25px_rgba(15,23,42,0.6)]">
                <div className={`text-3xl font-black tracking-[0.2em] ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            className="border border-cyan-300/40 bg-gradient-to-r from-cyan-500/70 to-sky-500/70 text-xs uppercase tracking-[0.35em] text-white shadow-[0_0_35px_rgba(56,189,248,0.35)] hover:from-cyan-400/70 hover:to-sky-400/70"
            onClick={onRestart}
          >
            もう一度プレイ
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="border border-slate-700/60 bg-slate-900/70 text-xs uppercase tracking-[0.35em] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100"
            onClick={onBackToHome}
          >
            ホームに戻る
          </Button>
        </div>
        
        {/* 感謝メッセージ */}
        <div className="text-center text-xs uppercase tracking-[0.35em] text-slate-400">
          ご参加ありがとうございました！
        </div>
        </div>
      </div>
    </div>
  );
}

export default FinalRanking;