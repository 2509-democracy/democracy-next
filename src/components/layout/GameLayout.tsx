import { ReactNode } from 'react';

interface GameLayoutProps {
  header: ReactNode;
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  bottomPanel: ReactNode;
  children?: ReactNode;
}

export function GameLayout({ header, leftPanel, centerPanel, bottomPanel, children }: GameLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 grid grid-rows-[60px_1fr_240px] overflow-hidden">
      {/* 上部ヘッダー - 固定高60px */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        {header}
      </header>

      {/* メインコンテンツエリア - 残りの高さを自動調整 */}
      <main className="grid grid-cols-[220px_1fr] gap-3 p-3 overflow-hidden">
        {/* 左ペイン - 固定幅220px */}
        <aside className="bg-white rounded-lg border border-gray-200 p-3 overflow-y-auto shadow-sm">
          {leftPanel}
        </aside>

        {/* 中央ペイン - 残りの幅 */}
        <section className="bg-white rounded-lg border border-gray-200 p-4 overflow-y-auto shadow-sm">
          {centerPanel}
        </section>
      </main>

      {/* 下部ペイン - 固定高240px */}
      <footer className="bg-white border-t border-gray-200 p-3 overflow-hidden shadow-sm">
        {bottomPanel}
      </footer>
      
      {/* モーダルやオーバーレイ */}
      {children}
    </div>
  );
}