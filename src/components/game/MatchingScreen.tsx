import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { 
  isConnectedAtom, 
  matchingStateAtom, 
  connectAtom, 
  disconnectAtom, 
  joinMatchingAtom, 
  leaveMatchingAtom 
} from '@/store/websocket';
import { Button } from '../ui/Button';

interface MatchingScreenProps {
  onStartGame: () => void;
}

export function MatchingScreen({ onStartGame }: MatchingScreenProps) {
  const [isConnected] = useAtom(isConnectedAtom);
  const [matching] = useAtom(matchingStateAtom);
  const [, connect] = useAtom(connectAtom);
  const [, disconnect] = useAtom(disconnectAtom);
  const [, joinMatching] = useAtom(joinMatchingAtom);
  const [, leaveMatching] = useAtom(leaveMatchingAtom);
  
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');

  // WebSocket接続の初期化
  useEffect(() => {
    const initializeConnection = async () => {
      if (connectionStatus === 'idle') {
        setConnectionStatus('connecting');
        try {
          // TODO: 実際のWebSocketエンドポイントURLに置き換える
          const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://your-websocket-endpoint.com';
          await connect(wsUrl);
          setConnectionStatus('connected');
        } catch (error) {
          console.error('Failed to connect to WebSocket:', error);
          setConnectionStatus('idle');
        }
      }
    };

    initializeConnection();

    return () => {
      // コンポーネントアンマウント時に切断
      disconnect();
    };
  }, [connect, disconnect, connectionStatus]);

  // マッチング成功時の処理
  useEffect(() => {
    if (matching.status === 'matched') {
      // ルーム参加後、少し待ってからゲーム開始
      const timer = setTimeout(() => {
        onStartGame();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [matching.status, onStartGame]);

  const handleJoinMatching = () => {
    console.log(isConnected, matching.status);
    if (isConnected && matching.status === 'idle') {
      joinMatching();
    }
  };

  const handleLeaveMatching = () => {
    if (matching.status === 'waiting') {
      leaveMatching();
    }
  };

  const getStatusMessage = () => {
    switch (matching.status) {
      case 'connecting':
        return 'サーバーに接続中...';
      case 'waiting':
        return `マッチング中... (${matching.queueSize}/4 人)`;
      case 'matched':
        return 'マッチング完了！ゲーム開始準備中...';
      case 'error':
        return `エラー: ${matching.error}`;
      default:
        return isConnected ? 'マッチング待機中' : '接続中...';
    }
  };

  const getStatusColor = () => {
    switch (matching.status) {
      case 'waiting':
        return 'text-blue-600';
      case 'matched':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              マルチプレイヤーモード
            </h1>
          </div>
          
          {/* 接続状態 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  接続状態
                </h3>
                <p className={`text-sm ${getStatusColor()}`}>
                  {getStatusMessage()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-500">
                  {isConnected ? '接続中' : '未接続'}
                </span>
              </div>
            </div>
          </div>

          {/* マッチング情報 */}
          {matching.status === 'waiting' && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                マッチング中
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-blue-600">
                  キューに参加中...
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-700">
                    {matching.queueSize} / 4
                  </div>
                  <div className="text-xs text-blue-600">参加者数</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(matching.queueSize / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* マッチング成功 */}
          {matching.status === 'matched' && (
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                マッチング完了！
              </h3>
              <p className="text-green-600 mb-3">
                ルーム {matching.roomId} に参加しました
              </p>
              <div className="space-y-1">
                <p className="text-sm text-green-700 font-medium">参加プレイヤー:</p>
                {matching.players.map((player: string, index: number) => (
                  <p key={index} className="text-sm text-green-600">
                    • プレイヤー {index + 1}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* エラー表示 */}
          {matching.status === 'error' && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                エラーが発生しました
              </h3>
              <p className="text-red-600">
                {matching.error}
              </p>
            </div>
          )}

          {/* 操作ボタン */}
          <div className="flex justify-center space-x-4">
            {matching.status === 'idle' && isConnected && (
              <Button
                onClick={handleJoinMatching}
                variant="primary"
                disabled={!isConnected}
              >
                マッチングに参加
              </Button>
            )}
            
            {matching.status === 'waiting' && (
              <Button
                onClick={handleLeaveMatching}
                variant="secondary"
              >
                マッチングをキャンセル
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => window.location.href = '/'}
            >
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}