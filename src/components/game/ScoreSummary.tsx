import { useAtom } from 'jotai';
import { scoreAtom, techLevelsAtom, multiGameStateAtom } from '@/store/game';
import { calculateTechLevelBonus } from '@/features/tech-levels';

interface ScoreSummaryProps {
  isMultiMode?: boolean;
}

export function ScoreSummary({ isMultiMode = false }: ScoreSummaryProps) {
  const [score] = useAtom(scoreAtom);
  const [techLevels] = useAtom(techLevelsAtom);
  const [multiGameState] = useAtom(multiGameStateAtom);

  const techLevelBonus = calculateTechLevelBonus(techLevels);

  // マルチモード時はランキング表示
  if (isMultiMode && multiGameState.players.length > 0) {
    const sortedPlayers = [...multiGameState.players].sort((a, b) => b.score - a.score);
    
    return (
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">リアルタイムランキング</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  player.id === multiGameState.currentPlayerId
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    index === 0 ? 'text-yellow-600' :
                    index === 1 ? 'text-gray-500' :
                    index === 2 ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium">
                    {player.name}
                    {player.id === multiGameState.currentPlayerId && ' (あなた)'}
                  </span>
                </div>
                <span className="text-sm font-bold text-yellow-600">{player.score}pt</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">あなたの技術レベル</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Object.keys(techLevels).length > 0 ? (
              Object.entries(techLevels).map(([techId, level]) => (
                <div key={techId} className="flex justify-between items-center bg-blue-50 p-1.5 rounded text-xs">
                  <span className="font-medium text-gray-700 truncate">{techId}</span>
                  <span className="font-bold text-blue-600">Lv.{level}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 italic text-center">技術なし</div>
            )}
          </div>
        </div>

        {techLevelBonus > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">ボーナス</h3>
            <div className="bg-green-50 p-2 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">+{techLevelBonus}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // シングルモード時の既存のロジック
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">現在のスコア</h3>
        <div className="bg-yellow-50 p-2 rounded-lg text-center">
          <div className="text-xl font-bold text-yellow-600">{score}</div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">技術レベル</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {Object.keys(techLevels).length > 0 ? (
            Object.entries(techLevels).map(([techId, level]) => (
              <div key={techId} className="flex justify-between items-center bg-blue-50 p-1.5 rounded text-xs">
                <span className="font-medium text-gray-700 truncate">{techId}</span>
                <span className="font-bold text-blue-600">Lv.{level}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-500 italic text-center">技術なし</div>
          )}
        </div>
      </div>

      {techLevelBonus > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">ボーナス</h3>
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600">+{techLevelBonus}</div>
          </div>
        </div>
      )}
    </div>
  );
}