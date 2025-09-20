# セッション管理用データ構造設計

## 1. 設計方針
**前提条件**：
- **マスターデータ**: 技術カード、ゲーム設定、テーマ等はコードベースに定義（保存不要）
- **ユーザーデータ**: セッション中のみ有効、ゲーム終了時に削除
- **最小構成**: セッション管理とリアルタイム通信に必要な情報のみ保持

## 2. マスターデータ（コードベース管理）
以下はDynamoDBに保存せず、コード内の定数として管理：
```typescript
// src/const/game.ts - ゲーム設定
export const GAME_CONFIG = {
  MAX_TURNS: 2,
  INITIAL_RESOURCE: 10,
  SHOP_SIZE: 5,
  MAX_SELECTED_CARDS: 3,
  REROLL_COST: 3,
  TECH_LEVEL_MAX: 5,
}

// src/const/game.ts - テーマ・方向性
export const THEMES = ["心", "光", "力", "命", "夢", "空", "時", "愛", "道", "美"];
export const DIRECTIONS = ["アイデア重視", "技術重視"];

// src/features/card-pool/constants/cards.ts - 技術カード
export const ALL_TECH_CARDS: TechCard[] = [...]
```

## 3. セッション管理要素の分析

### 3.1 プレイヤーマッチング
- **最大プレイヤー数**: 4人固定
- **マッチング方式**: シンプルな先着順（スキルマッチング無し）
- **待機時間**: 最大30秒で強制開始

### 3.2 ゲーム進行管理
- **フェーズ管理**: `matching` → `preparation` → `execution` → `結果表示`
- **ターン管理**: 最大2ターン（GAME_CONFIG.MAX_TURNS）
- **同期処理**: 全プレイヤー準備完了後に次フェーズへ移行

## 4. セッション管理エンティティ（DynamoDB保存対象）

### 4.1 Connection（WebSocket接続管理）
```typescript
interface Connection {
  connectionId: string;      // WebSocket接続ID（PK）
  userId: string;           // セッション用匿名ID
  connectedAt: number;      // 接続タイムスタンプ
  lastActivity: number;     // 最終アクティビティ（TTL用）
  ttl: number;             // 自動削除用TTL（24時間後）
}
```

### 4.2 Room（ゲームルーム管理）
```typescript
interface Room {
  roomId: string;           // ルームID（PK）
  hostConnectionId: string; // ホスト接続ID
  playerConnections: string[]; // 参加者接続ID配列（最大4）
  status: 'waiting' | 'starting' | 'in-progress' | 'finished';
  createdAt: number;
  ttl: number;             // 自動削除用TTL（6時間後）
}
```

### 4.3 GameSession（リアルタイムゲーム状態）
```typescript
interface GameSession {
  gameId: string;           // ゲームID（PK）
  roomId: string;           // 所属ルームID
  phase: MultiGamePhase;    // 現在フェーズ（matching除く）
  currentTurn: number;      // 現在ターン（1-2、GAME_CONFIG.MAX_TURNS）
  hackathonInfo: HackathonInfo; // 今回のハッカソン情報
  players: Record<string, SessionPlayerState>; // プレイヤー状態
  shop: SessionShopState;   // ショップ状態
  turnStartedAt?: number;   // ターン開始時刻
  createdAt: number;
  ttl: number;             // 自動削除用TTL（6時間後）
}

### 4.3 GameSession（リアルタイムゲーム状態）
```typescript
interface GameSession {
  gameId: string;           // ゲームID（PK）
  roomId: string;           // 所属ルームID
  phase: MultiGamePhase;    // 現在フェーズ（matching除く）
  currentTurn: number;      // 現在ターン（1-2、GAME_CONFIG.MAX_TURNS）
  hackathonInfo: HackathonInfo; // 今回のハッカソン情報
  players: Record<string, SessionPlayerState>; // プレイヤー状態
  shop: SessionShopState;   // ショップ状態
  turnStartedAt?: number;   // ターン開始時刻
  createdAt: number;
  ttl: number;             // 自動削除用TTL（6時間後）
}

interface HackathonInfo {
  theme: string;            // THEMESからランダム選択
  direction: string;        // DIRECTIONSからランダム選択
}

interface SessionPlayerState {
  connectionId: string;     // WebSocket接続ID
  id: string;              // プレイヤーID（PlayerInfoと整合）
  name?: string;           // 表示名（PlayerInfoと整合）
  resource: number;        // 現在リソース（PlayerInfoと整合）
  score: number;           // 累計スコア（PlayerInfoと整合）
  hand: string[];          // 手札（TechCard.idのみ）
  selectedCards: string[]; // 選択カード（TechCard.idのみ）
  techLevels: Record<string, number>; // 技術レベル（セッション中のみ）
  ideaSubmission?: string;  // アイデア提出内容
  isReady: boolean;         // 準備完了フラグ
  turn: number;            // プレイヤー個別ターン（PlayerInfoと整合）
}

interface SessionShopState {
  cardIds: string[];        // ショップカードID（GAME_CONFIG.SHOP_SIZE=5枚固定）
  rerollCount: number;      // リロール回数
  refreshedAt: number;      // 最終更新時刻
}
```

### 4.4 MatchingQueue（マッチング待機列）
```typescript
interface MatchingQueue {
  queueId: string;          // 固定値 "GLOBAL_QUEUE"（PK）
  waitingConnections: Array<{
    connectionId: string;
    joinedAt: number;
    id: string;              // プレイヤーID（PlayerInfoと整合）
  }>;
  lastProcessedAt: number;  // 最終処理時刻
  ttl: number;             // 自動削除用TTL
}
```

## 5. DynamoDB シンプルテーブル設計

### 5.1 単一テーブル構造（sessions）
```
PK (Partition Key) | SK (Sort Key) | TTL | エンティティタイプ
-------------------|---------------|-----|-------------------
CONN#{connectionId} | METADATA     | 24h | Connection
ROOM#{roomId}       | METADATA     | 6h  | Room  
GAME#{gameId}       | METADATA     | 6h  | GameSession
QUEUE               | GLOBAL       | 1h  | MatchingQueue
```

**設計理由**：
- **TTL自動削除**: 全エンティティに適切な期限設定
- **GSI不要**: シンプルなクエリパターンのみ
- **最小構成**: セッション管理のみに特化

### 5.2 クエリパターン
```typescript
// 接続情報取得
PK = "CONN#{connectionId}", SK = "METADATA"

// ルーム情報取得  
PK = "ROOM#{roomId}", SK = "METADATA"

// ゲーム状態取得
PK = "GAME#{gameId}", SK = "METADATA"

// マッチングキュー取得
PK = "QUEUE", SK = "GLOBAL"
```

## 6. リアルタイム通信仕様

### 6.1 WebSocketメッセージタイプ
```typescript
type WebSocketMessage = 
  | JoinMatchingMessage
  | LeaveMatchingMessage
  | ReadyMessage
  | ShopActionMessage
  | IdeaSubmissionMessage
  | CardSelectionMessage
  | GameStateUpdateMessage;

interface JoinMatchingMessage {
  type: 'join_matching';
  id: string;              // プレイヤーID（PlayerInfoと整合）
  name?: string;           // プレイヤー名（PlayerInfoと整合）
}

interface GameStateUpdateMessage {
  type: 'game_state_update';
  gameId: string;
  phase: MultiGamePhase;
  currentTurn: number;
  hackathonInfo?: HackathonInfo; // 現在のハッカソン情報
  players: Record<string, SessionPlayerState>;
  shop?: SessionShopState;
}

interface ShopActionMessage {
  type: 'shop_action';
  action: 'buy_card' | 'reroll_shop';
  cardId?: string;        // 購入時のみ
}
```

### 6.2 状態同期方法
- **プッシュ通知**: DynamoDB Streamsなし、Lambda内で直接WebSocket送信
- **ブロードキャスト**: ルーム内全プレイヤーに状態変更を配信
- **楽観的更新**: フロントエンド即座更新、エラー時のみ修正

## 7. マッチング実装方針

### 7.1 シンプルマッチングフロー
1. プレイヤーがマッチング参加
2. グローバルキューに追加（QUEUE/GLOBAL）
3. 4人揃ったら即座にルーム作成
4. 30秒タイムアウトで強制開始（不足分はボット補完なし）

### 7.2 マッチング処理
- **処理間隔**: WebSocket接続時とメッセージ受信時にトリガー
- **スキルマッチング**: なし（シンプルな先着順）
- **地域考慮**: なし

## 8. パフォーマンス・運用考慮

### 8.1 自動削除設計（TTL）
- **Connection**: 24時間後自動削除（非アクティブ接続のクリーンアップ）
- **Room/GameSession**: 6時間後自動削除（完了済みゲームの削除）
- **MatchingQueue**: 1時間後自動削除（古いキューデータの削除）

### 8.2 リソース最適化
- **TechCardデータ**: IDのみ保存、詳細情報はALL_TECH_CARDSから取得
- **ゲーム設定**: GAME_CONFIGから定数として参照
- **テーマ・方向性**: THEMES, DIRECTIONSからランダム選択
- **バッチ処理**: なし（リアルタイム処理のみ）
- **キャッシュ**: なし（DynamoDB直接アクセス）

## 9. 削除された要素
以下の要素は前提条件により不要：

### 9.1 永続化不要
- **ユーザープロフィール**: 累計スコア、プレイ履歴等
- **ゲーム結果履歴**: 過去のゲーム記録
- **技術レベル永続化**: セッション終了時に破棄

### 9.2 複雑な機能
- **スキルベースマッチング**: シンプルな先着順のみ
- **GSIインデックス**: 基本的なPK/SKクエリのみ
- **DynamoDB Streams**: Lambda内で直接WebSocket処理

## 10. 実装優先度
1. **最優先**: WebSocket接続管理、マッチングキュー
2. **高優先**: ルーム作成、ゲーム状態管理
3. **中優先**: ショップ機能、カード選択
4. **低優先**: AI評価、スコア計算

## 11. 次のステップ
1. DynamoDB テーブル作成（sessionsテーブル、TTL設定）
2. マッチング用Lambda関数実装
3. WebSocket メッセージハンドラー拡張
4. ゲーム状態管理Lambda実装
5. フロントエンド WebSocket integration