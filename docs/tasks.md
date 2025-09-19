# タスク: sample.html を Next.js アプリに移管

## 分析結果

### 現在のsample.htmlの構造
- HTML + Tailwind CSS + Vanilla JavaScript で実装されたハッカソンゲーム
- 状態管理: `gameData`オブジェクト
- UI更新: DOM操作による動的更新
- イベント処理: addEventListener での直接的なイベントハンドリング
- APIコール: Gemini API を使用したAI採点機能

### 必要な依存関係
- Jotai (状態管理) - 未インストール
- 既存: React 19, Next.js 15, TailwindCSS

## 実装計画

### 1. 依存関係インストール
```bash
npm install jotai
```

### 2. 型定義作成 (types/)
- `src/types/game.ts`: ゲーム関連の型定義
  - TechCard, GameData, HackathonInfo, GamePhase など

### 3. 定数定義 (const/)
- `src/const/game.ts`: ゲーム定数
  - allTechCards, themes, directions

### 4. Jotai状態管理 (store/)
- `src/store/game.ts`: ゲーム状態のatom定義
  - gameDataAtom, shopAtom, handAtom など

### 5. コンポーネント作成 (components/)
- `src/components/ui/` (共通UIコンポーネント)
  - TechCard.tsx: 技術カード表示
  - Button.tsx: 共通ボタン
  - Modal.tsx: モーダル
- `src/components/game/` (ゲーム固有コンポーネント)
  - GameStatus.tsx: ターン・スコア・リソース表示
  - HackathonInfo.tsx: テーマ・方向性表示
  - Shop.tsx: ショップ機能
  - Hand.tsx: 手札表示
  - SelectedCards.tsx: 選択済みカード表示
  - IdeaInput.tsx: アイデア入力
  - TechLevels.tsx: 技術レベル表示
  - EndGameModal.tsx: ゲーム終了モーダル

### 6. API処理 (libs/)
- `src/libs/gemini.ts`: Gemini API呼び出しロジック
- `src/libs/game.ts`: ゲームロジック（スコア計算など）

### 7. メインページ更新
- `src/app/page.tsx`: ゲームメインページとして再構築

### 8. スタイリング調整
- `src/app/globals.css`: ダークテーマ対応

## 関連ファイルパス
- `/home/yotu/github/democracy-next/sample.html` (移管元)
- `/home/yotu/github/democracy-next/src/types/game.ts` (新規作成)
- `/home/yotu/github/democracy-next/src/const/game.ts` (新規作成) 
- `/home/yotu/github/democracy-next/src/store/game.ts` (新規作成)
- `/home/yotu/github/democracy-next/src/components/ui/TechCard.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/ui/Button.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/ui/Modal.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/GameStatus.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/HackathonInfo.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/Shop.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/Hand.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/SelectedCards.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/IdeaInput.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/TechLevels.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/components/game/EndGameModal.tsx` (新規作成)
- `/home/yotu/github/democracy-next/src/libs/gemini.ts` (新規作成)
- `/home/yotu/github/democracy-next/src/libs/game.ts` (新規作成)
- `/home/yotu/github/democracy-next/src/app/page.tsx` (更新)
- `/home/yotu/github/democracy-next/src/app/globals.css` (更新)
- `/home/yotu/github/democracy-next/package.json` (jotai追加)

## 技術的考慮点
- React 19の新機能活用
- Server Components と Client Components の適切な分離
- TypeScript 型安全性の確保
- Jotaiによる効率的な状態更新
- Tailwind CSS クラスの再利用性
- APIキーの環境変数化
- エラーハンドリングの改善