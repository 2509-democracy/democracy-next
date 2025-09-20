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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* ローディングアニメーション */}
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
          </div>
          
          {/* プレイヤーID表示 */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              接続中...
            </h2>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">あなたのID</p>
              <p className="font-mono text-lg text-teal-600 break-all">
                {currentPlayer?.id || 'loading...'}
              </p>
            </div>
          </div>
          
          {/* 待機メッセージ */}
          <p className="text-gray-600">
            ゲームの準備をしています...
          </p>
        </div>
      </div>
    </div>
  );
}