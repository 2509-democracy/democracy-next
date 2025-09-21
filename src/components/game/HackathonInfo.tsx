import { useAtom } from 'jotai';
import { hackathonInfoAtom } from '@/store/game';

export function HackathonInfo() {
  const [hackathonInfo] = useAtom(hackathonInfoAtom);

  if (!hackathonInfo) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80 p-5 shadow-[0_0_40px_rgba(217,70,239,0.25)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
      <h2 className="text-lg font-bold uppercase tracking-[0.4em] text-fuchsia-200">HACKATHON BRIEFING</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex flex-col gap-1 rounded-xl border border-cyan-400/30 bg-slate-900/60 px-4 py-3 text-slate-100 shadow-[0_0_25px_rgba(56,189,248,0.2)]">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">THEME</span>
          <span className="text-base font-bold text-white">{hackathonInfo.theme}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-emerald-400/30 bg-slate-900/60 px-4 py-3 text-slate-100 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">DIRECTION</span>
          <span className="text-base font-bold text-white">{hackathonInfo.direction}</span>
        </div>
      </div>
    </div>
  );
}