# ゲームロジックをFeatures構造に移行

## 分析結果（調査レポート: docs/reports/game-logic-structure-analysis.md）

### 現在の問題点
- ドメインロジックが技術層別に分散（libs, store, const）
- プール仕様が複数箇所に散らばっている
- ビジネスロジックと状態管理が混在
- 機能変更時に複数ファイルの修正が必要

### 目標構造
```
src/features/
├── card-pool/           # カードプール機能
├── shop/               # ショップ機能  
├── tech-levels/        # 技術レベル機能
├── hackathon/          # ハッカソン機能
└── game-core/          # コアゲーム機能
```

## 実装計画

### フェーズ1: カードプール機能の分離 (高優先)
- `src/features/card-pool/constants/cards.ts` - カードマスターデータ移動
- `src/features/card-pool/services/pool-service.ts` - プール生成ロジック
- `src/features/card-pool/types.ts` - カード関連型定義
- `src/features/card-pool/index.ts` - エクスポート

### フェーズ2: ショップ機能の分離 (中優先)  
- `src/features/shop/services/shop-service.ts` - ショップロジック
- `src/features/shop/store/shop-atoms.ts` - ショップ状態管理
- `src/features/shop/components/Shop.tsx` - ショップUI移動
- `src/features/shop/types.ts` - ショップ関連型
- `src/features/shop/index.ts` - エクスポート

### フェーズ3: 技術レベル機能の分離 (中優先)
- `src/features/tech-levels/services/tech-level-service.ts` - レベル計算ロジック
- `src/features/tech-levels/store/tech-level-atoms.ts` - 技術レベル状態
- `src/features/tech-levels/components/TechLevels.tsx` - UI移動
- `src/features/tech-levels/types.ts` - 技術レベル関連型
- `src/features/tech-levels/index.ts` - エクスポート

### フェーズ4: ハッカソン機能の分離 (低優先)
- `src/features/hackathon/services/hackathon-service.ts` - ハッカソンロジック
- `src/features/hackathon/services/evaluation-service.ts` - AI評価処理
- `src/features/hackathon/store/hackathon-atoms.ts` - ハッカソン状態
- `src/features/hackathon/components/` - ハッカソンUI移動
- `src/features/hackathon/constants/themes.ts` - テーマ・方向性定数
- `src/features/hackathon/types.ts` - ハッカソン関連型
- `src/features/hackathon/index.ts` - エクスポート

### フェーズ5: ゲームコア機能の統合 (低優先)
- `src/features/game-core/services/game-service.ts` - ゲーム進行ロジック
- `src/features/game-core/store/game-atoms.ts` - 基本ゲーム状態
- `src/features/game-core/constants/config.ts` - ゲーム設定
- `src/features/game-core/types.ts` - コアゲーム型
- `src/features/game-core/index.ts` - エクスポート

## 関連ファイルパス

### 移行元ファイル
- `src/const/game.ts` (分割・移動)
- `src/libs/game.ts` (分割・移動) 
- `src/libs/gemini.ts` (移動)
- `src/store/game.ts` (分割・移動)
- `src/types/game.ts` (分割・移動)
- `src/components/game/` (一部移動)

### 新規作成するファイル
- `src/features/card-pool/` (全ファイル)
- `src/features/shop/` (全ファイル)
- `src/features/tech-levels/` (全ファイル) 
- `src/features/hackathon/` (全ファイル)
- `src/features/game-core/` (全ファイル)

### 更新が必要なファイル
- `src/app/single-mode/page.tsx` (インポート更新)
- 各コンポーネントファイル (インポート更新)

## 移行手順
1. フェーズ1から順番に実装
2. 各フェーズ完了後にテスト・動作確認
3. インポートパスの更新
4. 不要になった元ファイルの削除
5. コミット

## 技術的考慮点
- 既存のJotai atoms の依存関係を維持
- 循環参照を避ける設計
- TypeScript型定義の整合性確保
- コンポーネントの動作に影響しない段階的移行