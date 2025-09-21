import { useAtom } from 'jotai';
import { useEffect } from 'react';
import {
  isConnectedAtom,
  matchingStateAtom,
  connectAtom,
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
  const [,  joinMatching] = useAtom(joinMatchingAtom);
  const [, leaveMatching] = useAtom(leaveMatchingAtom);

  // WebSocket接続の初期化
  useEffect(() => {
    let isCancelled = false;
    
    const initializeConnection = async () => {
      if (!isCancelled) {
        try {
          // TODO: 実際のWebSocketエンドポイントURLに置き換える
          const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://your-websocket-endpoint.com';
          await connect(wsUrl);
        } catch (error) {
          if (!isCancelled) {
            console.error('Failed to connect to WebSocket:', error);
          }
        }
      }
    };

    initializeConnection();

    return () => {
      isCancelled = true;
    };
  }, [connect]); // connectの参照が更新された場合に再実行

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
        return 'text-cyan-200';
      case 'matched':
        return 'text-emerald-200';
      case 'error':
        return 'text-rose-300';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/title_image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/85 to-black/95" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950/70 p-10 shadow-[0_0_80px_rgba(56,189,248,0.35)] backdrop-blur-xl">
          {/* ヘッダー */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black uppercase tracking-[0.5em] text-cyan-200 mb-3">
              マルチプレイヤーモード
            </h1>
            <p className="text-sm tracking-[0.4em] text-slate-400">戦略ロビーへようこそ</p>
          </div>

          {/* 接続状態 */}
          <div className="mb-6 rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-6 shadow-[0_0_35px_rgba(56,189,248,0.25)]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                  接続状態
                </h3>
                <p className={`text-xs uppercase tracking-[0.3em] ${getStatusColor()}`}>
                  {getStatusMessage()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${
                  isConnected ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.7)]'
                }`} />
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  {isConnected ? '接続中' : '未接続'}
                </span>
              </div>
            </div>
          </div>

          {/* マッチング情報 */}
          {matching.status === 'waiting' && (
            <div className="mb-6 rounded-2xl border border-cyan-400/30 bg-slate-950/70 p-6 shadow-[0_0_35px_rgba(56,189,248,0.25)]">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
                マッチング中
              </h3>
              <div className="flex items-center justify-between text-slate-100">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-300">
                  キューに参加中...
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-cyan-200">
                    {matching.queueSize} / 4
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-200">参加者数</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${(matching.queueSize / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* マッチング成功 */}
          {matching.status === 'matched' && (
            <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-slate-950/70 p-6 shadow-[0_0_35px_rgba(16,185,129,0.35)]">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
                マッチング完了！
              </h3>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-200">
                ルーム {matching.roomId} に参加しました
              </p>
              <div className="space-y-1 text-xs text-emerald-100">
                <p className="font-semibold uppercase tracking-[0.3em]">参加プレイヤー:</p>
                {matching.players.map((player: string, index: number) => (
                  <p key={index} className="uppercase tracking-[0.3em]">
                    • プレイヤー {index + 1}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* エラー表示 */}
          {matching.status === 'error' && (
            <div className="mb-6 rounded-2xl border border-rose-400/30 bg-slate-950/70 p-6 shadow-[0_0_35px_rgba(244,63,94,0.35)]">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-rose-300">
                エラーが発生しました
              </h3>
              <p className="text-xs uppercase tracking-[0.3em] text-rose-200">
                {matching.error}
              </p>
            </div>
          )}

          {/* 操作ボタン */}
          <div className="flex justify-center gap-4">
            {matching.status === 'idle' && isConnected && (
              <Button
                onClick={handleJoinMatching}
                variant="primary"
                className="border border-cyan-300/40 bg-gradient-to-r from-cyan-500/70 to-sky-500/70 text-xs uppercase tracking-[0.35em] text-white shadow-[0_0_35px_rgba(56,189,248,0.35)] hover:from-cyan-400/70 hover:to-sky-400/70"
                disabled={!isConnected}
              >
                マッチングに参加
              </Button>
            )}

            {matching.status === 'waiting' && (
              <Button
                onClick={handleLeaveMatching}
                variant="secondary"
                className="border border-orange-300/40 bg-orange-500/30 text-xs uppercase tracking-[0.35em] text-orange-100 shadow-[0_0_30px_rgba(249,115,22,0.35)] hover:bg-orange-500/50"
              >
                マッチングをキャンセル
              </Button>
            )}

            <Button
              variant="secondary"
              className="border border-slate-700/60 bg-slate-900/70 text-xs uppercase tracking-[0.35em] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100"
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