import { PlayerInfo } from '@/types/player';

interface PlayerInfoProps {
  player: PlayerInfo;
  rank?: number;
  showDetails?: boolean;
}

export function PlayerInfoCard({ player, rank, showDetails = true }: PlayerInfoProps) {
  const getPhaseColor = (phase: PlayerInfo['phase']) => {
    switch (phase) {
      case 'preparation':
        return 'border border-sky-400/40 bg-slate-900/70 text-sky-200';
      case 'hackathon':
        return 'border border-orange-400/40 bg-slate-900/70 text-orange-200';
      case 'finished':
        return 'border border-emerald-400/40 bg-slate-900/70 text-emerald-200';
      default:
        return 'border border-slate-700/50 bg-slate-900/70 text-slate-300';
    }
  };

  const getPhaseLabel = (phase: PlayerInfo['phase']) => {
    switch (phase) {
      case 'preparation':
        return '準備中';
      case 'hackathon':
        return 'ハッカソン中';
      case 'finished':
        return '完了';
      default:
        return '不明';
    }
  };

  return (
    <div className={`rounded-xl border p-4 backdrop-blur-sm ${
      player.isCurrentPlayer
        ? 'border-sky-400/50 bg-slate-950/80 shadow-[0_0_35px_rgba(56,189,248,0.3)]'
        : 'border-slate-700/60 bg-slate-950/70 shadow-[0_0_25px_rgba(15,23,42,0.6)]'
    }`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {rank && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/40 bg-slate-900/80 text-xs font-bold text-cyan-200">
              {rank}
            </span>
          )}
          <span className={`text-sm font-semibold tracking-wide ${player.isCurrentPlayer ? 'text-cyan-200' : 'text-slate-100'}`}>
            {player.name}
          </span>
          {player.isCurrentPlayer && (
            <span className="rounded-full border border-cyan-300/50 bg-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100">
              YOU
            </span>
          )}
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${getPhaseColor(player.phase)}`}>
          {getPhaseLabel(player.phase)}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span>スコア</span>
          <span className="rounded-full border border-amber-300/40 bg-slate-900/70 px-3 py-1 text-sm font-bold text-amber-200">
            {player.score}
          </span>
        </div>

        {showDetails && (
          <>
            <div className="flex items-center justify-between text-slate-300">
              <span>リソース</span>
              <span className="rounded-full border border-emerald-300/40 bg-slate-900/70 px-3 py-1 text-sm font-semibold text-emerald-200">
                {player.resource}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>ターン</span>
              <span className="text-sm font-semibold text-slate-100">{player.turn}</span>
            </div>

            {Object.keys(player.techLevels).length > 0 && (
              <div className="border-t border-cyan-400/10 pt-3 text-slate-300">
                <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-200">Tech Levels</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(player.techLevels).slice(0, 3).map(([tech, level]) => (
                    <span key={tech} className="rounded-full border border-cyan-400/30 bg-slate-900/70 px-3 py-1 text-[10px] font-semibold text-cyan-100 uppercase tracking-[0.3em]">
                      {tech} Lv.{level}
                    </span>
                  ))}
                  {Object.keys(player.techLevels).length > 3 && (
                    <span className="text-[10px] text-slate-400">+{Object.keys(player.techLevels).length - 3}</span>
                  )}
                </div>
              </div>
            )}

            {player.selectedCards.length > 0 && (
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                選択カード: {player.selectedCards.length}枚
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}