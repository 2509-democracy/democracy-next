# マルチモードのシングルモード統一化計画

## 目標
マルチモードをシングルモードと同じゲーム性・レイアウト形式に統一し、一貫した体験を提供する

## 分析結果

### シングルモードの特徴
- **レイアウト**: `CollapsibleGameLayout`による5パネル構造
  - Header: GameStatus (ターン/スコア/リソース)
  - Left: ScoreSummary  
  - Center: HackathonInfo + SelectedCards + IdeaInput + 開始ボタン
  - Right: PlayerList
  - Bottom: ShopHandTabs
- **ゲーム性**: ターン制ハッカソン実行 → AI評価 → 技術レベル更新 → 次ターン
- **状態管理**: `/src/store/game.ts` の既存atom使用
- **UIデザイン**: 白背景ベース、境界線・シャドウの清潔なデザイン

### 現在のマルチモードの問題点
- **レイアウト**: 独自レイアウトで統一感なし (gray-900背景のカスタムレイアウト)
- **ゲーム性**: マッチング中心で実際のゲームプレイ未実装
- **状態管理**: 分離されたmulti-game.ts atom
- **UIデザイン**: ダークテーマで全く異なるスタイル

## 修正計画

### 1. レイアウト統一
- **修正対象**: `/src/app/multi-mode/page.tsx`
- **アクション**: `CollapsibleGameLayout`を使用するよう変更
- **パネル構成**:
  - Header: MultiGameStatus (ターン/全プレイヤー数/自分のスコア/タイマー)
  - Left: MultiScoreSummary (全プレイヤーのスコアランキング)
  - Center: HackathonInfo + SelectedCards + IdeaInput + 準備完了ボタン
  - Right: MultiPlayerList (他プレイヤーの詳細状態)  
  - Bottom: ShopHandTabs (既存コンポーネント活用)

### 2. コンポーネント修正・新規作成

#### 修正が必要なコンポーネント
- **削除**: `/src/components/multi-game/MatchingLobby.tsx` (別ページに分離)
- **修正**: `/src/components/multi-game/Timer.tsx` → ヘッダー組み込み用に調整
- **修正**: `/src/components/multi-game/MultiPlayerStatus.tsx` → 右パネル用に調整

#### 新規作成コンポーネント  
- `/src/components/multi-game/MultiGameStatus.tsx` - ヘッダー用状態表示
- `/src/components/multi-game/MultiScoreSummary.tsx` - 左パネル用スコアボード
- `/src/components/multi-game/MultiPlayerList.tsx` - 右パネル用プレイヤーリスト
- `/src/app/multi-mode/lobby/page.tsx` - マッチングロビー専用ページ

### 3. 状態管理統一
- **既存使用**: `/src/store/game.ts` のatomを基本とする
- **マルチ拡張**: プレイヤー情報とタイマーのみ multi-game.ts で管理
- **統合**: ゲームロジック（技術カード、ショップ等）は既存コンポーネント活用

### 4. ゲーム性統一
- **同期化**: 全プレイヤーが同じハッカソンテーマ・方向性でプレイ
- **ターン制**: 準備時間45秒 → ハッカソン実行 → 結果表示 → 次ターン
- **AI評価**: シングルモードと同じ評価ロジック使用
- **リアルタイム要素**: プレイヤーの準備状態、残り時間のみ

### 5. 実装順序
1. マッチングロビーを別ページに分離
2. MultiGameStatusコンポーネント作成
3. MultiScoreSummary、MultiPlayerListコンポーネント作成  
4. multi-mode/page.tsx をCollapsibleGameLayout使用に変更
5. 既存のゲームロジックとの統合
6. タイマー・同期機能の実装
7. デバッグ・調整

## 実装制約
- 既存のシングルモードコンポーネントは変更しない
- `/src/store/game.ts` の既存atomは拡張のみ（破壊的変更なし）
- マッチング機能はモック実装を維持
- UI デザインはシングルモードに完全統一
