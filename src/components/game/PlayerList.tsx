import { useAtom } from 'jotai';
import { playerRankingAtom, otherPlayersAtom, currentPlayerAtom, gameModeAtom } from '@/store/players';
import { multiGameStateAtom, resourceAtom } from '@/store/game';
import { PlayerInfoCard } from './PlayerInfoCard';

interface PlayerListProps {
  showCurrentPlayer?: boolean;
  maxPlayers?: number;
  isMultiMode?: boolean;
}

export function PlayerList({ showCurrentPlayer = true, maxPlayers, isMultiMode = false }: PlayerListProps) {
  // マルチモード時は game.ts の状態を使用
  const [multiGameState] = useAtom(multiGameStateAtom);
  // シングルモード時は players.ts の状態を使用（後方互換性のため）
  const [playerRanking] = useAtom(playerRankingAtom);
  const [otherPlayers] = useAtom(otherPlayersAtom);
  const [currentPlayer] = useAtom(currentPlayerAtom);
  const [gameMode] = useAtom(gameModeAtom);
  const [resource] = useAtom(resourceAtom);

  // マルチモード用のプレイヤー表示
  if (isMultiMode) {
    const playersToShow = multiGameState.players;
    // スコア順でソート（リアルタイムランキング統合）
    const sortedPlayers = [...playersToShow].sort((a, b) => b.score - a.score);
    const limitedPlayers = maxPlayers ? sortedPlayers.slice(0, maxPlayers) : sortedPlayers;

    if (limitedPlayers.length === 0) {
      return (
        <div className="rounded-xl border border-cyan-400/30 bg-slate-950/60 py-6 text-center text-xs tracking-[0.4em] text-slate-400 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
          参加者を待っています...
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-[0.35em] text-cyan-200">参加者ランキング</h3>
          <span className="text-[10px] font-semibold tracking-[0.3em] text-slate-400">
            {playersToShow.length} / 4 参加中
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto pr-1">
          {limitedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`relative flex items-center justify-between rounded-2xl border px-4 py-3 shadow-[0_0_35px_rgba(56,189,248,0.25)] transition-transform duration-200 hover:-translate-y-1 ${
                player.id === multiGameState.currentPlayerId
                  ? 'border-sky-400/60 bg-slate-950/80'
                  : 'border-slate-700/60 bg-slate-950/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${player.isConnected ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]'}`} />
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-black tracking-[0.35em] ${
                    index === 0 ? 'text-amber-300' :
                    index === 1 ? 'text-slate-200' :
                    index === 2 ? 'text-orange-300' : 'text-slate-400'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-100">
                    {player.name} {player.id === multiGameState.currentPlayerId && <span className="text-cyan-300">（あなた）</span>}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border border-amber-300/40 bg-slate-900/70 px-3 py-1 text-sm font-bold text-amber-200 shadow-[0_0_20px_rgba(250,204,21,0.35)]">
                  {player.score}点
                </span>
              </div>
            </div>
          ))}
        </div>

        {maxPlayers && playersToShow.length > maxPlayers && (
          <div className="border-t border-cyan-400/10 pt-2 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">
            他 {playersToShow.length - maxPlayers} 人
          </div>
        )}
      </div>
    );
  }

  // シングルモード用の既存のロジック
  const playersToShow = gameMode === 'single'
    ? (showCurrentPlayer ? [currentPlayer] : [])
    : (showCurrentPlayer ? playerRanking : otherPlayers);

  const limitedPlayers = maxPlayers ? playersToShow.slice(0, maxPlayers) : playersToShow;

  if (limitedPlayers.length === 0) {
    return (
      <div className="rounded-xl border border-cyan-400/30 bg-slate-950/60 py-6 text-center text-xs tracking-[0.4em] text-slate-400 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
        {gameMode === 'single' ? 'シングルプレイモード' : '他のプレイヤーはいません'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-[0.35em] text-cyan-200">
          {showCurrentPlayer ? 'プレイヤー' : '他のプレイヤー'}
        </h3>
        <span className="text-[10px] font-semibold tracking-[0.3em] text-slate-400">
          {gameMode === 'single' ? 'シングル' : `${playerRanking.length}人`}
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1">
        {gameMode === 'single' && showCurrentPlayer ? (
          <div className="rounded-2xl border border-sky-400/40 bg-slate-950/80 p-3 shadow-[0_0_35px_rgba(56,189,248,0.3)]">
            <PlayerInfoCard
              player={{ ...currentPlayer, resource }}
              showDetails={true}
            />
          </div>
        ) : (
          playerRanking.map((ranking) => {
            const player = gameMode === 'single'
              ? currentPlayer
              : [...otherPlayers, currentPlayer].find(p => p.id === ranking.playerId);

            if (!player) return null;

            return (
              <div
                key={player.id}
                className="rounded-2xl border border-slate-700/60 bg-slate-950/70 p-3 shadow-[0_0_25px_rgba(15,23,42,0.6)]"
              >
                <PlayerInfoCard
                  player={player}
                  rank={ranking.rank}
                  showDetails={player.isCurrentPlayer}
                />
              </div>
            );
          })
        )}
      </div>

      {maxPlayers && playersToShow.length > maxPlayers && (
        <div className="border-t border-cyan-400/10 pt-2 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">
          他 {playersToShow.length - maxPlayers} 人
        </div>
      )}
    </div>
  );
}
