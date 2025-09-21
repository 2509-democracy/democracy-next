import { useAtom } from 'jotai';
import { paneStateAtom, togglePaneAtom } from '@/store/ui';

interface PaneToggleProps {
  pane: 'left' | 'right' | 'bottom';
  position?: 'header' | 'inline';
  className?: string;
}

export function PaneToggle({ pane, position = 'header', className = '' }: PaneToggleProps) {
  const [paneState] = useAtom(paneStateAtom);
  const [, togglePane] = useAtom(togglePaneAtom);

  const isOpen = paneState[pane];

  const getIcon = () => {
    switch (pane) {
      case 'left':
        return isOpen ? '◀' : '▶';
      case 'right':
        return isOpen ? '▶' : '◀';
      case 'bottom':
        return isOpen ? '▼' : '▲';
    }
  };

  const getLabel = () => {
    switch (pane) {
      case 'left':
        return isOpen ? '左ペインを閉じる' : '左ペインを開く';
      case 'right':
        return isOpen ? '右ペインを閉じる' : '右ペインを開く';
      case 'bottom':
        return isOpen ? '下ペインを閉じる' : '下ペインを開く';
    }
  };

  const icon = getIcon();

  return (
    <button
      onClick={() => togglePane(pane)}
      className={`
        flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 text-base shadow-[0_0_20px_rgba(56,189,248,0.25)]
        ${position === 'header'
          ? 'border-cyan-400/40 bg-slate-900/70 text-cyan-200 hover:border-cyan-300 hover:text-white hover:bg-slate-800'
          : 'border-cyan-300/40 bg-slate-900/80 text-cyan-200 hover:border-cyan-200 hover:text-white hover:bg-slate-800'
        }
        ${className}
      `}
      title={getLabel()}
      aria-label={getLabel()}
    >
      {icon}
    </button>
  );
}