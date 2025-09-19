// 絵文字生成関数
function renderEmojis(count: number, emoji: string) {
  return Array(count).fill(emoji).join("");
}

import { TechCard as TechCardType } from "@/types/game";

// カテゴリごとの色定義
const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-blue-500",
  Backend: "bg-green-500",
  "Machine Learning": "bg-yellow-500",
  Authentication: "bg-purple-500",
  "Data Store": "bg-red-500",
  Communication: "bg-pink-500",
};

interface TechCardProps {
  card: TechCardType;
  techLevel?: number;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export function TechCard({
  card,
  techLevel,
  badge = `${card.cost} リソース`,
  onClick,
  className = "",
}: TechCardProps) {
  return (
    <div
      className={`relative bg-gray-700 p-7 rounded-lg w-38 cursor-pointer transition-transform duration-200 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {/* カテゴリラベル absolute配置 左上 */}
      <div
        className={`absolute top-1 left-1 text-xs px-2 py-1 rounded-full text-white ${
          CATEGORY_COLORS[card.category] ?? "bg-gray-500"
        }`}
        style={{ zIndex: 2 }}
      >
        {card.category}
      </div>
      <div className="font-bold text-center mb-1">{card.name}</div>
      <div className="text-sm text-center text-gray-400 mb-1">
        レベル {techLevel ?? card.level}
      </div>
      {/* 絵文字パラメータ表示（ラベル＋絵文字の縦並び） */}
      <div className="flex flex-col items-center gap-1 mb-2 text-xs">
        <div>難易度: {renderEmojis(card.difficulty, "🧩")}</div>
        <div>人気: {renderEmojis(card.popularity, "⭐")}</div>
        <div>性能: {renderEmojis(card.performance, "⚡")}</div>
      </div>
      <div className="absolute bottom-1 right-1 bg-gray-900 text-xs px-2 py-1 rounded-full">
        {badge}
      </div>
    </div>
  );
}
