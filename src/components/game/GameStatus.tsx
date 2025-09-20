import { useAtom } from 'jotai';
import { turnAtom, resourceAtom, scoreAtom, multiGameStateAtom } from '@/store/game';
import { GAME_CONFIG } from '@/const/game';

interface GameStatusProps {
  isMultiMode?: boolean;
}

export function GameStatus({ isMultiMode = false }: GameStatusProps) {
  const [turn] = useAtom(turnAtom);
  const [resource] = useAtom(resourceAtom);
  const [score] = useAtom(scoreAtom);
  const [multiGameState] = useAtom(multiGameStateAtom);

  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">ターン</span>
        <span className="text-lg font-bold text-teal-600">{turn}</span>
        <span className="text-sm text-gray-500">/ {GAME_CONFIG.MAX_TURNS}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">スコア</span>
        <span className="text-lg font-bold text-yellow-600">{score}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">リソース</span>
        <span className="text-lg font-bold text-lime-600">{resource}</span>
      </div>
      
      {isMultiMode && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">フェーズ</span>
            <span className="text-sm font-bold text-purple-600">
              {multiGameState.phaseMessage}
            </span>
          </div>
          
          {multiGameState.isTimerActive && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">残り時間</span>
              <span className={`text-lg font-bold ${multiGameState.timeLeft <= 10 ? 'text-red-600' : 'text-orange-600'}`}>
                {Math.floor(multiGameState.timeLeft / 60)}:{(multiGameState.timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">参加者</span>
            <span className="text-lg font-bold text-blue-600">
              {multiGameState.players.length} / 4
            </span>
          </div>
        </>
      )}
    </div>
  );
}