import { useAtom } from 'jotai';
import { turnAtom, resourceAtom, scoreAtom, multiGameStateAtom } from '@/store/game';
import { GAME_CONFIG } from '@/const/game';

interface GameStatusProps {
  isMultiMode?: boolean;
}

export function GameStatus({ isMultiMode = false }: GameStatusProps) {
  const [turn] = useAtom(turnAtom);
  const [resource] = useAtom(resourceAtom);
  const [score] = useAtom(scoreAtom);
  const [multiGameState] = useAtom(multiGameStateAtom);

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-slate-300">
      <div className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-slate-900/70 px-4 py-3 shadow-[0_0_25px_rgba(56,189,248,0.25)]">
        <span className="text-cyan-300">TURN</span>
        <span className="text-lg font-black text-teal-300 tracking-widest">
          {turn}
        </span>
        <span className="text-slate-400">/ {GAME_CONFIG.MAX_TURNS}</span>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-slate-900/70 px-4 py-3 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
        <span className="text-amber-200">SCORE</span>
        <span className="text-lg font-black text-amber-300 tracking-widest">
          {score}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-slate-900/70 px-4 py-3 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
        <span className="text-emerald-200">RESOURCE</span>
        <span className="text-lg font-black text-emerald-300 tracking-widest">
          {resource}
        </span>
      </div>

      {isMultiMode && (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-fuchsia-400/30 bg-slate-900/70 px-4 py-3 shadow-[0_0_25px_rgba(217,70,239,0.35)]">
            <span className="text-fuchsia-200">PHASE</span>
            <span className="text-sm font-semibold tracking-[0.3em] text-fuchsia-100">
              {multiGameState.phaseMessage}
            </span>
          </div>

          {multiGameState.isTimerActive && (
            <div className={`flex items-center gap-3 rounded-xl border ${
              multiGameState.timeLeft <= 10
                ? 'border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                : 'border-orange-400/30 shadow-[0_0_25px_rgba(249,115,22,0.35)]'
            } bg-slate-900/70 px-4 py-3`}
            >
              <span className="text-orange-200">TIMER</span>
              <span
                className={`text-lg font-black tracking-widest ${
                  multiGameState.timeLeft <= 10 ? 'text-rose-300' : 'text-orange-300'
                }`}
              >
                {Math.floor(multiGameState.timeLeft / 60)}:{(multiGameState.timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-sky-400/30 bg-slate-900/70 px-4 py-3 shadow-[0_0_25px_rgba(56,189,248,0.3)]">
            <span className="text-sky-200">PLAYERS</span>
            <span className="text-lg font-black text-sky-300 tracking-widest">
              {multiGameState.players.length} / 4
            </span>
          </div>
        </>
      )}
    </div>
  );
}