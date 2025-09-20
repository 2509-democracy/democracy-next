import { useAtom } from 'jotai';
import { techLevelsAtom } from '@/store/game';
import { getCardById } from '@/features/card-pool';

export function TechLevels() {
  const [techLevels] = useAtom(techLevelsAtom);

  const techLevelEntries = Object.entries(techLevels);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800">技術レベル</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {techLevelEntries.length > 0 ? (
          techLevelEntries.map(([techId, level]) => {
            const tech = getCardById(techId);
            if (!tech) return null;
            
            return (
              <div key={techId} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                <span className="text-sm font-medium text-gray-700 truncate">{tech.name}</span>
                <div className="flex items-center space-x-1">
                  {Array(level).fill(null).map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">★</span>
                  ))}
                  {Array(5 - level).fill(null).map((_, i) => (
                    <span key={i} className="text-gray-300 text-lg">☆</span>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 text-sm py-4">
            技術レベルなし
          </div>
        )}
      </div>
    </div>
  );
}