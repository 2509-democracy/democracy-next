'use client';

import { useAtom } from 'jotai';
import { multiGameStateAtom } from '@/store/game';

export function MultiScoreSummary() {
  const [multiState] = useAtom(multiGameStateAtom);

  const sortedPlayers = [...multiState.players].sort((a, b) => b.score - a.score);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}位`;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 1: return 'text-gray-600 bg-gray-50 border-gray-200';
      case 2: return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-teal-600">スコアランキング</h3>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg border ${getRankColor(index)} ${
              player.id === multiState.currentPlayerId ? 'ring-2 ring-teal-400' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getRankBadge(index)}</span>
                <span className={`font-semibold ${
                  player.id === multiState.currentPlayerId ? 'text-teal-700' : ''
                }`}>
                  {player.name}
                </span>
                {player.id === multiState.currentPlayerId && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                    YOU
                  </span>
                )}
              </div>
              
              <div className={`w-2 h-2 rounded-full ${
                player.isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">スコア:</span>
                <span className="font-mono font-semibold">{player.score}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">リソース:</span>
                <span className="font-mono">{player.resource}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">手札:</span>
                <span className="font-mono">{player.hand.length}枚</span>
              </div>
              {player.isReady && multiState.currentPhase === 'preparation' && (
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded text-center">
                  準備完了
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-1">
          <div>参加者: {multiState.players.length}人</div>
          <div>準備完了: {multiState.players.filter(p => p.isReady).length}人</div>
          <div>接続中: {multiState.players.filter(p => p.isConnected).length}人</div>
        </div>
      </div>
    </div>
  );
}