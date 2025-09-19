# マルチモード対応レイアウト拡張計画

## 目標
- 各ペイン（左・右・下）を展開/縮小可能にする
- 右ペインに他プレイヤー情報を表示
- シングルモードでは自分のみ表示
- マルチモード時には複数プレイヤー対応

## 新しいレイアウト設計

### 全体構成（拡張版）
```
┌─────────────────────────────────────────────────────────────────────┐
│ 上部ヘッダー（ターン・スコア・リソース・ペイン制御ボタン）          │
├─────────┬─────────────────────────────────┬─────────────────────────┤
│[←]左ペイン│        中央ペイン（固定）        │       右ペイン[→]       │
│ スコア詳細│    - ハッカソン情報            │  - 他プレイヤー情報      │
│ 技術レベル│    - 選択カード                │  - スコアランキング      │
│          │    - アイデア入力              │  - プレイヤー状態        │
│          │    - 開始ボタン                │                         │
├─────────┴─────────────────────────────────┴─────────────────────────┤
│              下部ペイン（ショップ・手札タブ）[↕]                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 実装計画

### フェーズ1: ペイン展開/縮小機能の実装
- GameLayoutコンポーネントに状態管理追加
- 各ペインの展開/縮小状態を管理
- アニメーション付きの展開/縮小機能
- ペイン制御ボタンの実装

### フェーズ2: 他プレイヤー情報コンポーネントの作成
- PlayerInfo コンポーネント作成
- PlayerList コンポーネント作成（複数プレイヤー管理）
- プレイヤー状態管理用の atoms 追加
- ランキング表示機能

### フェーズ3: マルチモード対応状態管理
- マルチプレイヤー用の state 設計
- プレイヤー情報の型定義
- リアルタイム更新対応（将来の WebSocket 対応準備）

### フェーズ4: シングルモード対応
- シングルモードでは自分のみ表示
- プレイヤー切り替え機能
- モード判定ロジック

## 新規作成するファイル

### コンポーネント
- `src/components/layout/CollapsibleGameLayout.tsx` - 展開縮小対応レイアウト
- `src/components/game/PlayerInfo.tsx` - 個別プレイヤー情報表示
- `src/components/game/PlayerList.tsx` - プレイヤーリスト管理
- `src/components/game/PaneToggle.tsx` - ペイン展開縮小ボタン

### 状態管理
- `src/store/players.ts` - プレイヤー情報管理用 atoms
- `src/store/ui.ts` - UI状態管理用 atoms（ペイン展開状態等）

### 型定義
- `src/types/player.ts` - プレイヤー関連型定義
- `src/types/ui.ts` - UI状態関連型定義

## 更新するファイル

### メインページ
- `src/app/single-mode/page.tsx` - 新レイアウト適用

### 既存コンポーネント
- `src/components/game/GameStatus.tsx` - ペイン制御ボタン追加
- `src/components/game/ScoreSummary.tsx` - 展開縮小対応

## 技術的設計

### ペイン展開縮小機能
```typescript
interface PaneState {
  left: boolean;
  right: boolean;
  bottom: boolean;
}

const paneStateAtom = atom<PaneState>({
  left: true,
  right: true,
  bottom: true
});
```

### プレイヤー情報管理
```typescript
interface PlayerInfo {
  id: string;
  name: string;
  score: number;
  resource: number;
  techLevels: Record<string, number>;
  selectedCards: TechCard[];
  isCurrentPlayer: boolean;
}

interface GameMode {
  type: 'single' | 'multi';
  players: PlayerInfo[];
  currentPlayerId: string;
}
```

### レイアウト計算
- 左ペイン: 0px（縮小時） / 220px（展開時）
- 右ペイン: 0px（縮小時） / 280px（展開時）
- 下ペイン: 60px（縮小時） / 240px（展開時）
- 中央ペイン: 残り全幅を自動調整

## 実装順序

1. **UI状態管理の実装**
   - paneState atom の作成
   - ペイン制御ロジック

2. **レイアウトコンポーネントの拡張**
   - CollapsibleGameLayout の実装
   - アニメーション対応

3. **プレイヤー情報機能の実装**
   - プレイヤー状態管理
   - PlayerInfo/PlayerList コンポーネント

4. **シングルモード統合**
   - 既存機能との統合
   - テストと調整

## アクセシビリティ考慮点
- キーボードナビゲーション対応
- スクリーンリーダー対応
- ペイン状態の視覚的フィードバック
- 適切な ARIA ラベル設定