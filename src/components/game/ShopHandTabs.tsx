import { useState } from 'react';
import { Shop } from '@/components/game/Shop';
import { Hand } from '@/components/game/Hand';

export function ShopHandTabs() {
  const [activeTab, setActiveTab] = useState<'shop' | 'hand'>('shop');

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