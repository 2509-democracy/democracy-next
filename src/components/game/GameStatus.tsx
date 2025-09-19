import { useAtom } from 'jotai';
import { turnAtom, resourceAtom, scoreAtom } from '@/store/game';
import { GAME_CONFIG } from '@/const/game';

export function GameStatus() {
  const [turn] = useAtom(turnAtom);
  const [resource] = useAtom(resourceAtom);
  const [score] = useAtom(scoreAtom);

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
    </div>
  );
}