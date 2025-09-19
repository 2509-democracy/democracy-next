import { useAtom } from 'jotai';
import { turnAtom, resourceAtom, scoreAtom } from '@/store/game';
import { GAME_CONFIG } from '@/const/game';

export function GameStatus() {
  const [turn] = useAtom(turnAtom);
  const [resource] = useAtom(resourceAtom);
  const [score] = useAtom(scoreAtom);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl">
          ターン <span className="font-bold text-teal-300">{turn}</span> / {GAME_CONFIG.MAX_TURNS}
        </div>
        <div className="text-2xl">
          スコア <span className="font-bold text-yellow-400">{score}</span>
        </div>
        <div className="text-2xl">
          リソース <span className="font-bold text-lime-400">{resource}</span>
        </div>
      </div>
    </div>
  );
}