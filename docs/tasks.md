# TechCard 新プロパティ対応 実装計画

## 概要

TechCard 型に追加された以下のプロパティを TechCard コンポーネントで表示する。

- category: 左上に色付きラベルで表示（カテゴリごとに色分け）
- difficulty, popularity, performance: 絵文字で{値}回表示。レベル表示の下に並べる

## 関連ファイル

- src/components/ui/TechCard.tsx
- src/types/game.ts
- src/const/tech_cards.ts

## 実装詳細

### 1. カテゴリ色定義の追加

- 実装場所: `src/components/ui/TechCard.tsx`
- 変更内容: ファイル冒頭にカテゴリごとの色定義オブジェクトを新規追加（新規ファイル不要）

### 2. カテゴリラベル表示の実装

- 実装場所: `src/components/ui/TechCard.tsx` の TechCard 関数内
- 変更内容: absolute 配置のラベル用 div を新規追加。色は 1 で定義したものを使用

### 3. 絵文字表示ロジックの追加

- 実装場所: `src/components/ui/TechCard.tsx` の TechCard 関数内
- 変更内容: difficulty, popularity, performance を絵文字で{値}回表示するロジックを新規追加。既存のレベル表示の下に配置。絵文字生成用の新規関数を TechCard.tsx 内に追加

### 4. UI レイアウト・スタイル調整

- 実装場所: `src/components/ui/TechCard.tsx` の TechCard 関数内
- 変更内容: Tailwind クラスの追加・修正（既存メソッドの修正）

---

このように、すべて既存ファイル内で新規オブジェクト・関数・div の追加や既存メソッドの修正で対応します。新規ファイルは不要です。

## 不明点

- 絵文字の種類（例: 難易度:🧩, 人気:⭐, 性能:⚡ など）
  → 仮で決めて実装、後で調整可能

## コミット方針

各ステップごとに semantic commit でコミット
