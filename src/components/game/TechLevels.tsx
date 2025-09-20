import { useAtom } from "jotai";
import { techLevelsAtom } from "@/store/game";
import { getCardById } from "@/features/card-pool";

export function TechLevels({
  techLevels,
}: { techLevels?: Record<string, number> } = {}) {
  // techLevelsがpropsで渡された場合はそれを使い、なければatomから取得
  const [atomTechLevels] = useAtom(techLevelsAtom);
  const levels = techLevels ?? atomTechLevels;
  const techLevelEntries = Object.entries(levels);

  if (techLevelEntries.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800">技術レベル</h3>
        <div className="text-center text-gray-500 text-sm py-4">
          技術レベルなし
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-800">技術レベル</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {techLevelEntries.map(([techId, level]) => {
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
        })}
      </div>
    </div>
  );
}
