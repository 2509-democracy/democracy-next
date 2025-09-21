import { useState } from 'react';
import { useAtom } from 'jotai';
import { bottomPaneAtom } from '@/store/ui';
import { Shop } from '@/components/game/Shop';
import { Hand } from '@/components/game/Hand';

export function ShopHandTabs() {
  const [activeTab, setActiveTab] = useState<'shop' | 'hand'>('shop');
  const [isBottomPaneOpen, setBottomPaneOpen] = useAtom(bottomPaneAtom);

  if (!isBottomPaneOpen) {
    return (
      <div className="flex h-full items-center gap-4 text-[10px] uppercase tracking-[0.3em]">
        <button
          onClick={() => {
            setActiveTab('shop');
            if (!isBottomPaneOpen) setBottomPaneOpen(true);
          }}
          className={`rounded-full border px-4 py-2 font-semibold transition-all ${
            activeTab === 'shop'
              ? 'border-cyan-400/50 bg-cyan-500/30 text-cyan-100 shadow-[0_0_25px_rgba(56,189,248,0.35)]'
              : 'border-slate-700/60 bg-slate-900/70 text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100'
          }`}
        >
          ショップ
        </button>
        <button
          onClick={() => {
            setActiveTab('hand');
            if (!isBottomPaneOpen) setBottomPaneOpen(true);
          }}
          className={`rounded-full border px-4 py-2 font-semibold transition-all ${
            activeTab === 'hand'
              ? 'border-orange-400/60 bg-orange-500/30 text-orange-100 shadow-[0_0_25px_rgba(249,115,22,0.35)]'
              : 'border-slate-700/60 bg-slate-900/70 text-slate-300 hover:border-orange-300/40 hover:text-orange-100'
          }`}
        >
          手札
        </button>
        <span className="text-slate-400">
          {activeTab === 'shop' ? 'ショップ' : '手札'} を選択中
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* タブヘッダー - コンパクト化 */}
      <div className="flex flex-shrink-0 border-b border-cyan-400/30 bg-slate-950/70">
        <button
          onClick={() => setActiveTab('shop')}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
            activeTab === 'shop'
              ? 'border-b-2 border-cyan-300 text-cyan-200'
              : 'border-b-2 border-transparent text-slate-400 hover:border-cyan-200/40 hover:text-cyan-100'
          }`}
        >
          ショップ
        </button>
        <button
          onClick={() => setActiveTab('hand')}
          className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
            activeTab === 'hand'
              ? 'border-b-2 border-orange-300 text-orange-200'
              : 'border-b-2 border-transparent text-slate-400 hover:border-orange-200/40 hover:text-orange-100'
          }`}
        >
          手札
        </button>
      </div>

      {/* タブコンテンツ - 高さ制限とスクロール */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-950/60 p-4">
        {activeTab === 'shop' && <Shop />}
        {activeTab === 'hand' && <Hand />}
      </div>
    </div>
  );
}