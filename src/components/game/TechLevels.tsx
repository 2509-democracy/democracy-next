import { useAtom } from 'jotai';
import { techLevelsAtom } from '@/store/game';
import { getCardById } from '@/features/card-pool';

export function TechLevels() {
  const [techLevels] = useAtom(techLevelsAtom);

  const techLevelEntries = Object.entries(techLevels);

  if (techLevelEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-lime-400">技術レベル</h2>
      <div className="flex flex-wrap gap-4">
        {techLevelEntries.map(([techId, level]) => {
          const tech = getCardById(techId);
          if (!tech) return null;
          
          return (
            <div key={techId} className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg">
              <span className="font-bold">{tech.name}:</span>
              <div className="flex space-x-1">
                {Array(level).fill(null).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
                {Array(5 - level).fill(null).map((_, i) => (
                  <span key={i} className="text-gray-500 text-2xl">☆</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}