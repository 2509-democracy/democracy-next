import { useAtom } from 'jotai';
import { playerRankingAtom, otherPlayersAtom, currentPlayerAtom, gameModeAtom } from '@/store/players';
import { multiGameStateAtom } from '@/store/game';
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

  // マルチモード用のプレイヤー表示
  if (isMultiMode) {
    const playersToShow = multiGameState.players;
    // スコア順でソート（リアルタイムランキング統合）
    const sortedPlayers = [...playersToShow].sort((a, b) => b.score - a.score);
    const limitedPlayers = maxPlayers ? sortedPlayers.slice(0, maxPlayers) : sortedPlayers;

    if (limitedPlayers.length === 0) {
      return (
        <div className="text-center text-gray-500 text-sm py-4">
          参加者を待っています...
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">参加者ランキング</h3>
          <span className="text-xs text-gray-500">
            {playersToShow.length} / 4
          </span>
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {limitedPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.id === multiGameState.currentPlayerId
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${player.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    index === 0 ? 'text-yellow-600' :
                    index === 1 ? 'text-gray-500' :
                    index === 2 ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700  ">
                    {player.name} {player.id === multiGameState.currentPlayerId && '(あなた)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-lg font-bold text-yellow-600">{player.score}pt</span>
              </div>
            </div>
          ))}
        </div>
        
        {maxPlayers && playersToShow.length > maxPlayers && (
          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
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