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
        return 'text-blue-600 bg-blue-50';
      case 'hackathon':
        return 'text-orange-600 bg-orange-50';
      case 'finished':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
    <div className={`bg-white border rounded-lg p-3 ${player.isCurrentPlayer ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {rank && (
            <span className="text-xs font-bold text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
              {rank}
            </span>
          )}
          <span className={`font-semibold ${player.isCurrentPlayer ? 'text-blue-800' : 'text-gray-800'}`}>
            {player.name}
          </span>
          {player.isCurrentPlayer && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              あなた
            </span>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getPhaseColor(player.phase)}`}>
          {getPhaseLabel(player.phase)}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">スコア:</span>
          <span className="font-bold text-yellow-600">{player.score}</span>
        </div>
        
        {showDetails && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">リソース:</span>
              <span className="font-medium text-green-600">{player.resource}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ターン:</span>
              <span className="text-sm text-gray-800">{player.turn}</span>
            </div>
            
            {Object.keys(player.techLevels).length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-600">技術レベル:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(player.techLevels).slice(0, 3).map(([tech, level]) => (
                    <span key={tech} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {tech} Lv.{level}
                    </span>
                  ))}
                  {Object.keys(player.techLevels).length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{Object.keys(player.techLevels).length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {player.selectedCards.length > 0 && (
              <div className="pt-2">
                <span className="text-xs text-gray-600">選択カード: {player.selectedCards.length}枚</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}