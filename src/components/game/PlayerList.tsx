import { useAtom } from 'jotai';
import { playerRankingAtom, otherPlayersAtom, currentPlayerAtom, gameModeAtom } from '@/store/players';
import { PlayerInfoCard } from './PlayerInfoCard';

interface PlayerListProps {
  showCurrentPlayer?: boolean;
  maxPlayers?: number;
}

export function PlayerList({ showCurrentPlayer = true, maxPlayers }: PlayerListProps) {
  const [playerRanking] = useAtom(playerRankingAtom);
  const [otherPlayers] = useAtom(otherPlayersAtom);
  const [currentPlayer] = useAtom(currentPlayerAtom);
  const [gameMode] = useAtom(gameModeAtom);

  // シングルモードでは自分のみ表示
  const playersToShow = gameMode === 'single' 
    ? (showCurrentPlayer ? [currentPlayer] : [])
    : (showCurrentPlayer ? playerRanking : otherPlayers);

  const limitedPlayers = maxPlayers ? playersToShow.slice(0, maxPlayers) : playersToShow;

  if (limitedPlayers.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm py-4">
        {gameMode === 'single' ? 'シングルプレイモード' : '他のプレイヤーはいません'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          {showCurrentPlayer ? 'プレイヤー' : '他のプレイヤー'}
        </h3>
        <span className="text-xs text-gray-500">
          {gameMode === 'single' ? 'シングル' : `${playerRanking.length}人`}
        </span>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {gameMode === 'single' && showCurrentPlayer ? (
          <PlayerInfoCard 
            player={currentPlayer} 
            showDetails={true}
          />
        ) : (
          playerRanking.map((ranking) => {
            const player = gameMode === 'single' 
              ? currentPlayer 
              : [...otherPlayers, currentPlayer].find(p => p.id === ranking.playerId);
            
            if (!player) return null;
            
            return (
              <PlayerInfoCard
                key={player.id}
                player={player}
                rank={ranking.rank}
                showDetails={player.isCurrentPlayer}
              />
            );
          })
        )}
      </div>
      
      {maxPlayers && playersToShow.length > maxPlayers && (
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          他 {playersToShow.length - maxPlayers} 人
        </div>
      )}
    </div>
  );
}