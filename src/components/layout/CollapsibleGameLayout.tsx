import { ReactNode } from 'react';
import { useAtom } from 'jotai';
import { paneStateAtom } from '@/store/ui';
import { PaneToggle } from '@/components/game/PaneToggle';

interface CollapsibleGameLayoutProps {
  header: ReactNode;
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
  bottomPanel: ReactNode;
  children?: ReactNode;
}

export function CollapsibleGameLayout({ 
  header, 
  leftPanel, 
  centerPanel, 
  rightPanel,
  bottomPanel, 
  children 
}: CollapsibleGameLayoutProps) {
  const [paneState] = useAtom(paneStateAtom);

  // 動的なグリッド列設定
  const getGridColumns = () => {
    const leftWidth = paneState.left ? '220px' : '0px';
    const rightWidth = paneState.right ? '280px' : '0px';
    return `[${leftWidth}_1fr_${rightWidth}]`;
  };

  // 動的なグリッド行設定
  const getGridRows = () => {
    const bottomHeight = paneState.bottom ? '240px' : '40px';
    return `[60px_1fr_${bottomHeight}]`;
  };

  return (
    <div 
      className="h-screen bg-gray-50 grid overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        gridTemplateColumns: `${paneState.left ? '220px' : '40px'} 1fr ${paneState.right ? '280px' : '40px'}`,
        gridTemplateRows: `60px 1fr ${paneState.bottom ? '240px' : '40px'}`,
      }}
    >
      {/* 上部ヘッダー - 全幅に跨る */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm col-span-3">
        {header}
      </header>

      {/* 左ペイン */}
      <aside 
        className={`relative bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
          paneState.left ? 'p-3' : 'p-0'
        }`}
      >
        {/* 左ペインの展開縮小ボタン */}
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
          <PaneToggle pane="left" position="inline" />
        </div>
        
        <div className={`h-full overflow-y-auto ${paneState.left ? 'opacity-100' : 'opacity-0'}`}>
          {paneState.left && leftPanel}
        </div>
      </aside>

      {/* 中央ペイン - 常に表示 */}
      <section className="bg-white p-4 overflow-y-auto">
        {centerPanel}
      </section>

      {/* 右ペイン */}
      <aside 
        className={`relative bg-white border-l border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
          paneState.right ? 'p-3' : 'p-0'
        }`}
      >
        {/* 右ペインの展開縮小ボタン */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
          <PaneToggle pane="right" position="inline" />
        </div>
        
        <div className={`h-full overflow-y-auto ${paneState.right ? 'opacity-100' : 'opacity-0'}`}>
          {paneState.right && rightPanel}
        </div>
      </aside>

      {/* 下部ペイン - 全幅に跨る */}
      <footer 
        className={`relative bg-white border-t border-gray-200 shadow-sm col-span-3 transition-all duration-300 ease-in-out overflow-hidden ${
          paneState.bottom ? 'p-3' : 'p-1'
        }`}
      >
        {/* 下部ペインの展開縮小ボタン */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
          <PaneToggle pane="bottom" position="inline" />
        </div>
        
        <div className={`h-full ${paneState.bottom ? 'opacity-100' : 'opacity-60'}`}>
          {bottomPanel}
        </div>
      </footer>
      
      {/* モーダルやオーバーレイ */}
      {children}
    </div>
  );
}