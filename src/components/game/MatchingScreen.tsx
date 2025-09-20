import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { multiGameStateAtom } from '@/store/game';
import { PlayerList } from './PlayerList';
import { Button } from '../ui/Button';

interface MatchingScreenProps {
  onStartGame: () => void;
}

export function MatchingScreen({ onStartGame }: MatchingScreenProps) {
  const [multiGameState] = useAtom(multiGameStateAtom);
  
  const maxPlayers = 4;
  const canAutoStart = multiGameState.players.length >= maxPlayers;
  
  // 4人集まったら自動開始
  useEffect(() => {
    if (canAutoStart) {
      const timer = setTimeout(() => {
        onStartGame();
      }, 1000); // 1秒後に自動開始
      
      return () => clearTimeout(timer);
    }
  }, [canAutoStart, onStartGame]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ハッカソン・デベロッパー
            </h1>
            <p className="text-gray-600">
              マルチプレイヤーモード - プレイヤー待機中
            </p>
          </div>
          
          {/* ルーム情報 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  ルーム情報
                </h3>
                <p className="text-blue-600 text-sm">
                  {multiGameState.roomId ? `ルームID: ${multiGameState.roomId}` : 'プライベートルーム'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-700">
                  {multiGameState.players.length} / {maxPlayers}
                </div>
                <div className="text-xs text-blue-600">参加者数</div>
              </div>
            </div>
          </div>
          
          {/* プレイヤーリスト */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              参加プレイヤー
            </h3>
            <PlayerList isMultiMode={true} />
          </div>
          
          {/* 開始条件 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">ゲーム開始条件</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className={`flex items-center gap-2 ${
                multiGameState.players.length >= maxPlayers ? 'text-green-600' : 'text-orange-500'
              }`}>
                <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs">
                  {multiGameState.players.length >= maxPlayers ? '✓' : '●'}
                </span>
                {multiGameState.players.length >= maxPlayers 
                  ? `${maxPlayers}人集まりました！まもなく開始...` 
                  : `${maxPlayers}人集まったら自動開始 (${multiGameState.players.length}/${maxPlayers})`}
              </li>
            </ul>
          </div>
          
          {/* アクションボタン */}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/'}
            >
              ホームに戻る
            </Button>
          </div>
          
          {/* 注意事項 */}
          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>ゲーム開始後は途中退出できません</p>
            <p>安定したインターネット接続を確認してください</p>
          </div>
        </div>
      </div>
    </div>
  );
}