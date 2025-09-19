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
        flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 text-base shadow-md
        ${position === 'header' 
          ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
          : 'bg-white border-2 border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:shadow-lg'
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