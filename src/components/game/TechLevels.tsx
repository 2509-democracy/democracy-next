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
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-[0.35em] text-cyan-200">技術レベル</h3>
        <div className="rounded-xl border border-cyan-400/30 bg-slate-950/60 py-6 text-center text-xs tracking-[0.4em] text-slate-400 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
          技術レベルなし
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold tracking-[0.35em] text-cyan-200">技術レベル</h3>
      <div className="space-y-3 overflow-y-auto pr-1">
        {techLevelEntries.map(([techId, level]) => {
          const tech = getCardById(techId);
          if (!tech) return null;

          return (
            <div
              key={techId}
              className="flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-slate-950/70 px-3 py-2 text-slate-100 shadow-[0_0_25px_rgba(56,189,248,0.25)]"
            >
              <span className="text-sm font-semibold text-slate-100 truncate">{tech.name}</span>
              <div className="flex items-center space-x-1 text-lg">
                {Array(level).fill(null).map((_, i) => (
                  <span key={`star-${i}`} className="text-amber-300">★</span>
                ))}
                {Array(5 - level).fill(null).map((_, i) => (
                  <span key={`empty-${i}`} className="text-slate-700">☆</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
