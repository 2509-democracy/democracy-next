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
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-400/30 bg-slate-950/70 p-4 shadow-[0_0_35px_rgba(250,204,21,0.25)]">
        <h3 className="mb-3 text-sm font-semibold tracking-[0.35em] text-amber-200">現在のスコア</h3>
        <div className="text-center text-3xl font-black text-amber-200 tracking-[0.4em]">
          {score}
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-4 shadow-[0_0_35px_rgba(56,189,248,0.25)]">
        <h3 className="mb-3 text-sm font-semibold tracking-[0.35em] text-cyan-200">技術レベル</h3>
        <div className="space-y-2 overflow-y-auto pr-1 text-xs">
          {Object.keys(techLevels).length > 0 ? (
            Object.entries(techLevels).map(([techId, level]) => (
              <div key={techId} className="flex items-center justify-between rounded-xl border border-cyan-400/20 bg-slate-900/70 px-3 py-2 text-slate-100">
                <span className="font-semibold truncate">{techId}</span>
                <span className="text-sm font-bold text-cyan-200">Lv.{level}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-[10px] tracking-[0.4em] text-slate-400">
              技術なし
            </div>
          )}
        </div>
      </div>

      {techLevelBonus > 0 && (
        <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/70 p-4 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
          <h3 className="mb-2 text-sm font-semibold tracking-[0.35em] text-emerald-200">ボーナス</h3>
          <div className="text-center text-2xl font-black text-emerald-200 tracking-[0.4em]">+{techLevelBonus}</div>
        </div>
      )}
    </div>
  );
}