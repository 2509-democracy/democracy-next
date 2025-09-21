import { useAtom } from 'jotai';
import { ideaAtom } from '@/store/game';

export function IdeaInput() {
  const [idea, setIdea] = useAtom(ideaAtom);

  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-4 shadow-[0_0_35px_rgba(56,189,248,0.25)]">
      <h2 className="mb-3 text-sm font-bold tracking-[0.3em] text-cyan-200">あなたのアイデア</h2>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        className="w-full h-28 resize-none rounded-xl border border-cyan-400/30 bg-slate-900/70 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-200 focus:outline-none focus:ring-0"
        placeholder="アイデアを入力してください..."
      />
    </div>
  );
}