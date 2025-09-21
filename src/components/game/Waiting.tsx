import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { currentPlayerAtom } from '@/store/game';

const useAutoTransition = (callback: () => void, delay: number) => {
  useEffect(() => {
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [callback, delay]);
};

interface WaitingProps {
  onComplete: () => void;
}

export function Waiting({ onComplete }: WaitingProps) {
  const [currentPlayer] = useAtom(currentPlayerAtom);
  useAutoTransition(onComplete, 3000);
  
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/title_image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/85 to-black/95" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-8 text-center shadow-[0_0_80px_rgba(56,189,248,0.35)] backdrop-blur-xl">
          {/* ローディングアニメーション */}
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-200/40 border-t-cyan-400"></div>
          </div>

          {/* プレイヤーID表示 */}
          <div className="mb-6 space-y-3">
            <h2 className="text-lg font-black uppercase tracking-[0.4em] text-cyan-200">
              接続中...
            </h2>
            <div className="rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-2">あなたのID</p>
              <p className="break-all font-mono text-sm text-cyan-100">
                {currentPlayer?.id || 'loading...'}
              </p>
            </div>
          </div>

          {/* 待機メッセージ */}
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            ゲームの準備をしています...
          </p>
        </div>
      </div>
    </div>
  );
}