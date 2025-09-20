import { useAtom } from 'jotai';
import { scoreAtom, techLevelsAtom } from '@/store/game';
import { calculateTechLevelBonus } from '@/features/tech-levels';

interface ScoreSummaryProps {
  isMultiMode?: boolean;
}

export function ScoreSummary({ isMultiMode = false }: ScoreSummaryProps) {
  const [score] = useAtom(scoreAtom);
  const [techLevels] = useAtom(techLevelsAtom);

  const techLevelBonus = calculateTechLevelBonus(techLevels);

  // マルチモード時は何も表示しない（PlayerListに統合）
  if (isMultiMode) {
    return null;
  }

  // シングルモード専用のスコア表示
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