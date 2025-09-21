import { v4 as uuidv4 } from 'uuid';

export interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

type WebSocketPayload = Record<string, unknown>;

export interface MatchingJoinedMessage extends WebSocketMessage {
  type: 'matching_joined';
  queueSize?: number;
}

export interface MatchingLeftMessage extends WebSocketMessage {
  type: 'matching_left';
}

export interface MatchFoundMessage extends WebSocketMessage {
  type: 'match_found';
  roomId?: string;
  players?: string[];
}

export interface WebSocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onMatchingJoined?: (data: MatchingJoinedMessage) => void;
  onMatchingLeft?: (data: MatchingLeftMessage) => void;
  onMatchFound?: (data: MatchFoundMessage) => void;
}

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private handlers: WebSocketEventHandlers;
  private playerId: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private maxReconnectDelay: number = 30000; // 最大30秒
  private isIntentionallyDisconnected: boolean = false;

  constructor(url: string, handlers: WebSocketEventHandlers = {}) {
    this.url = url;
    this.handlers = handlers;
    this.playerId = uuidv4(); // ユニークなプレイヤーID生成
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.handlers.onConnect?.();
          resolve();
        };

        this.socket.onclose = () => {
          console.log('WebSocket disconnected');
          this.handlers.onDisconnect?.();
          // 意図的な切断でなければ再接続を試行
          if (!this.isIntentionallyDisconnected) {
            this.handleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.handlers.onError?.(error);
          reject(error);
        };

        this.socket.onmessage = (event: MessageEvent<string>) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            console.log('WebSocket message received:', message);
            
            // メッセージタイプ別の処理
            switch (message.type) {
              case 'matching_joined':
                this.handlers.onMatchingJoined?.(message as MatchingJoinedMessage);
                break;
              case 'matching_left':
                this.handlers.onMatchingLeft?.(message as MatchingLeftMessage);
                break;
              case 'match_found':
                this.handlers.onMatchFound?.(message as MatchFoundMessage);
                break;
              default:
                this.handlers.onMessage?.(message);
                break;
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
        this.maxReconnectDelay
      );
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  sendMessage(message: WebSocketPayload): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageToSend = {
        ...message,
        playerId: this.playerId,
        timestamp: new Date().toISOString()
      };
      
      this.socket.send(JSON.stringify(messageToSend));
      console.log('WebSocket message sent:', messageToSend);
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  // マッチング関連メソッド
  joinMatching(): void {
    this.sendMessage({
      action: 'join_matching'
    });
  }

  leaveMatching(): void {
    this.sendMessage({
      action: 'leave_matching'
    });
  }

  ping(): void {
    this.sendMessage({
      action: 'ping'
    });
  }

  disconnect(): void {
    this.isIntentionallyDisconnected = true; // 意図的な切断をマーク
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  get connectionState(): number | undefined {
    return this.socket?.readyState;
  }

  getPlayerId(): string {
    return this.playerId;
  }
}

// WebSocketクライアントのシングルトンインスタンス
let webSocketClient: WebSocketClient | null = null;

export function createWebSocketClient(url: string, handlers: WebSocketEventHandlers = {}): WebSocketClient {
  if (webSocketClient) {
    webSocketClient.disconnect();
  }
  
  webSocketClient = new WebSocketClient(url, handlers);
  return webSocketClient;
}

export function getWebSocketClient(): WebSocketClient | null {
  return webSocketClient;
}