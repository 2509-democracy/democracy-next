'use client';

import { useAtom } from 'jotai';
import { turnAtom, resourceAtom, scoreAtom, multiGameStateAtom } from '@/store/game';
import { GAME_CONFIG } from '@/const/game';

export function MultiGameStatus() {
  const [turn] = useAtom(turnAtom);
  const [resource] = useAtom(resourceAtom);
  const [score] = useAtom(scoreAtom);
  const [multiState] = useAtom(multiGameStateAtom);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (multiState.currentPhase) {
      case 'preparation': return '準備フェーズ';
      case 'execution': return 'ハッカソン実行中';
      case 'result': return '結果発表';
      default: return '';
    }
  };

  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">ターン</span>
        <span className="text-lg font-bold text-teal-600">{turn}</span>
        <span className="text-sm text-gray-500">/ {GAME_CONFIG.MAX_TURNS}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">プレイヤー</span>
        <span className="text-lg font-bold text-blue-600">{multiState.players.length}人</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">スコア</span>
        <span className="text-lg font-bold text-yellow-600">{score}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">リソース</span>
        <span className="text-lg font-bold text-lime-600">{resource}</span>
      </div>

      {multiState.isTimerActive && (
        <>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">{getPhaseText()}</span>
            <span className={`text-lg font-bold font-mono ${
              multiState.timeLeft <= 10 ? 'text-red-600' : 
              multiState.timeLeft <= 30 ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {formatTime(multiState.timeLeft)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}