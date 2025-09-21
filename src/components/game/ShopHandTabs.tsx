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
      <div className="flex items-center gap-4 h-full">
        <button
          onClick={() => {
            setActiveTab('shop');
            if (!isBottomPaneOpen) setBottomPaneOpen(true);
          }}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeTab === 'shop'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          ショップ
        </button>
        <button
          onClick={() => {
            setActiveTab('hand');
            if (!isBottomPaneOpen) setBottomPaneOpen(true);
          }}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeTab === 'hand'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          手札
        </button>
        <span className="text-xs text-gray-500">
          {activeTab === 'shop' ? 'ショップ' : '手札'}を選択中
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* タブヘッダー - コンパクト化 */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => setActiveTab('shop')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'shop'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          ショップ
        </button>
        <button
          onClick={() => setActiveTab('hand')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'hand'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          手札
        </button>
      </div>

      {/* タブコンテンツ - 高さ制限とスクロール */}
      <div className="flex-1 overflow-y-auto p-2 min-h-0">
        {activeTab === 'shop' && <Shop />}
        {activeTab === 'hand' && <Hand />}
      </div>
    </div>
  );
}