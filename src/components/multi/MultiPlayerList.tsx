'use client';

import { useAtom } from 'jotai';
import { otherPlayersAtom, multiGameStateAtom } from '@/store/game';

export function MultiPlayerList() {
  const [otherPlayers] = useAtom(otherPlayersAtom);
  const [multiState] = useAtom(multiGameStateAtom);

  const getPhaseColor = (player: any) => {
    if (!player.isConnected) return 'text-red-500';
    if (player.isReady) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getPhaseText = (player: any) => {
    if (!player.isConnected) return '切断中';
    if (multiState.currentPhase === 'preparation') {
      return player.isReady ? '準備完了' : '準備中';
    }
    return multiState.currentPhase === 'execution' ? '実行中' : '結果確認中';
  };

  const getTechLevelStats = (player: any) => {
    const levels = Object.values(player.techLevels) as number[];
    if (levels.length === 0) return { total: 0, max: 0, avg: 0 };
    
    const total = levels.reduce((sum, level) => sum + level, 0);
    const max = Math.max(...levels);
    const avg = total / levels.length;
    
    return { total, max, avg: Math.round(avg * 10) / 10 };
  };

  return (
    <div className="h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-teal-600">他のプレイヤー</h3>
      
      {otherPlayers.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-2">👤</div>
          <p>他のプレイヤーがいません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {otherPlayers.map((player) => {
            const techStats = getTechLevelStats(player);
            
            return (
              <div key={player.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{player.name}</h4>
                    <div className={`w-2 h-2 rounded-full ${
                      player.isConnected ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getPhaseColor(player)} bg-gray-100`}>
                    {getPhaseText(player)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600">スコア</div>
                    <div className="font-mono font-semibold text-lg">{player.score}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">リソース</div>
                    <div className="font-mono text-lg">{player.resource}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-gray-500">手札</div>
                      <div className="font-mono">{player.hand.length}枚</div>
                    </div>
                    <div>
                      <div className="text-gray-500">選択中</div>
                      <div className="font-mono">{player.selectedCards.length}枚</div>
                    </div>
                  </div>
                  
                  {Object.keys(player.techLevels).length > 0 && (
                    <div className="mt-2">
                      <div className="text-gray-500 text-xs mb-1">技術レベル</div>
                      <div className="flex justify-between text-xs">
                        <span>合計: {techStats.total}</span>
                        <span>最高: Lv.{techStats.max}</span>
                        <span>平均: {techStats.avg}</span>
                      </div>
                    </div>
                  )}
                </div>

                {player.idea && multiState.currentPhase !== 'preparation' && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-gray-500 text-xs mb-1">アイデア</div>
                    <div className="text-xs text-gray-700 line-clamp-2">
                      {player.idea.length > 50 ? `${player.idea.slice(0, 50)}...` : player.idea}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}