"use client";

import { useEffect, useState } from "react";
import { TechCard as TechCardType } from "@/features/card-pool";

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-red-500",
  Backend: "bg-blue-500",
  Other: "bg-yellow-500",
};

function renderEmojis(count: number, emoji: string) {
  return Array(count).fill(emoji).join("");
}

interface TechCardProps {
  card: TechCardType;
  techLevel?: number;
  badge?: string;
  onClick?: () => void;
  className?: string;
  isSelected?: boolean;
}

export function TechCard({
  card,
  techLevel,
  badge = `${card.cost} リソース`,
  onClick,
  className = "",
  isSelected = false,
}: TechCardProps) {
  const [isClickAnimating, setIsClickAnimating] = useState(false);

  useEffect(() => {
    if (!isClickAnimating) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsClickAnimating(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [isClickAnimating]);

  const handleClick = () => {
    setIsClickAnimating(true);
    onClick?.();
  };

  return (
    <div
      className={`relative bg-white border-2 border-gray-300 p-1.5 rounded-lg w-28 cursor-pointer transition-all duration-200 hover:scale-105 hover:border-blue-400 group overflow-hidden ${
        isSelected
          ? "border-blue-400 shadow-[0_16px_35px_rgba(59,130,246,0.35)] ring-2 ring-blue-200/80 animate-selected-glow"
          : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/40 ${
            isClickAnimating ? "animate-ripple" : "opacity-0"
          }`}
        />
      </div>
      <div className="absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none">
        <div className="absolute inset-0 animate-sparkle bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 rounded-lg border border-blue-200/80" />
      )}
      {/* カテゴリバッジをリソースバッジと同じ形状・配置に変更 */}
      <div
        className={`absolute -top-1 -left-1 text-[10px] px-1 py-0.5 rounded-full text-white ${
          CATEGORY_COLORS[card.category] ?? "bg-gray-500"
        }`}
        style={{ zIndex: 2 }}
      >
        {card.category}
      </div>
      {/* アイコン画像表示（中央上部） */}
      {card.icon && (
        <img
          src={card.icon}
          alt={card.name + " icon"}
          className="mx-auto mt-0 mb-0 w-8 h-8 object-contain"
          style={{ display: "block" }}
        />
      )}
      <div className="font-bold text-center text-gray-900 text-base truncate mb-1 mt-0">
        {card.name}
      </div>
      <div className="text-center text-gray-600 mb-2 text-xs">
        Lv.{techLevel ?? card.level}
      </div>
      <div className="mb-1 text-[10px] w-full">
        <table className="w-full">
          <tbody>
            {[
              { label: "難度", value: renderEmojis(card.difficulty, "🧩") },
              { label: "人気", value: renderEmojis(card.popularity, "⭐") },
              { label: "性能", value: renderEmojis(card.performance, "⚡") },
            ].map(({ label, value }) => (
              <tr key={label}>
                <td className="pr-1 text-left">{label}:</td>
                <td className="text-left">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* リソースバッジ（右上） */}
      <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-[10px] px-1 py-0.5 rounded-full">
        {badge}
      </div>
    </div>
  );
}
