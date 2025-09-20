import React, { useState } from "react";
// チュートリアル用モーダル
interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { TechCard } from "@/features/card-pool";
import { TechCard as TechCardComponent } from "./TechCard";
import { ALL_TECH_CARDS } from "@/features/card-pool/constants/cards";
import { GameStatus } from "@/components/game/GameStatus";
import { TechLevels } from "@/components/game/TechLevels";
import { ShopHandTabsDemo } from "./ShopHandTabsDemo";

const sampleCard =
  ALL_TECH_CARDS.find((card) => card.id === "react") ?? ALL_TECH_CARDS[0];

const tutorialSteps = [
  {
    title: "ゲームの目的とサイクル",
    content: (
      <>
        このゲームは10ターン制のハイスコア競争型ハッカソンです。各ターンでAI採点によるスコアを獲得し、最終的な総合スコアを目指します。
      </>
    ),
  },
  {
    title: "技術カード（TechCard）の説明",
    content: (
      <>
        技術カードはアイデアを形にするための重要な要素です。
        <br />
        カードには「名前」「カテゴリ」「レベル」「コスト」「難度」「人気」「性能」などの情報が含まれます。
        <div className="flex justify-center my-4">
          <TechCardComponent card={sampleCard} />
        </div>
        カードは使うたびにレベルアップし、レベル5到達で最終ボーナスが得られます。
      </>
    ),
  },
  {
    title: "リソースとショップの使い方",
    content: (
      <>
        リソースを使ってショップから技術カードを購入できます。
        <br />
        ショップは毎ターンランダムなカードが並び、リソース消費でリロールも可能です。
        <div className="flex justify-center my-4">
          <GameStatus />
        </div>
      </>
    ),
  },
  {
    title: "技術カードのレベル・消費・ボーナス",
    content: (
      <>
        技術カードはハッカソンで使用するたびに消費され、レベルが1上がります。
        <br />
        レベル5に到達したカードは最終スコアにボーナス（100点）が加算されます。
        <div className="flex justify-center my-4">
          {/* モーダル用ダミーデータでTechLevelsを表示 */}
          <TechLevels techLevels={{ react: 3, vue: 1, express: 5 }} />
        </div>
      </>
    ),
  },
  {
    title: "ハッカソンの進行（開始までの流れ）",
    content: (
      <>
        <ol className="text-left list-decimal list-inside space-y-1 mb-4">
          <li>テーマと方向性が提示されます。</li>
          <li>ショップでカードを購入し、手札に加えます。</li>
          <li>テーマに沿ったアイデアを入力します。</li>
          <li>手札から最大3枚の技術カードを選択します。</li>
          <li>
            「ハッカソン開始」ボタンを押すとAIによる採点が実行され、スコアを獲得します。
          </li>
        </ol>
        <div className="flex justify-center my-4">
          <ShopHandTabsDemo />
        </div>
      </>
    ),
  },
  {
    title: "ランキングとゲーム終了",
    content: (
      <>
        10ターン終了後、総合スコアと最終ランキングが表示されます。
        <br />
        最高スコアを目指して挑戦しましょう！
      </>
    ),
  },
];

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [step, setStep] = useState(0);
  if (!isOpen) return null;
  const isFirst = step === 0;
  const isLast = step === tutorialSteps.length - 1;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">{tutorialSteps[step].title}</h2>
        <div className="mb-6">{tutorialSteps[step].content}</div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-600 rounded text-white disabled:opacity-50"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={isFirst}
          >
            前へ
          </button>
          <button
            className="px-4 py-2 bg-gray-600 rounded text-white"
            onClick={onClose}
          >
            閉じる
          </button>
          <button
            className="px-4 py-2 bg-blue-600 rounded text-white disabled:opacity-50"
            onClick={() =>
              setStep((s) => Math.min(tutorialSteps.length - 1, s + 1))
            }
            disabled={isLast}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className={`bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md mx-4 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
