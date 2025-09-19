function renderEmojis(count: number, emoji: string) {
  return Array(count).fill(emoji).join("");
}

import { TechCard as TechCardType } from "@/types/game";

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
      className={`relative bg-gray-700 p-7 rounded-lg w-36 cursor-pointer transition-transform duration-200 hover:scale-105 ${className}`}
      onClick={onClick}
    >
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
      <div className="mb-2 text-xs w-full">
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
      <div className="absolute bottom-1 right-1 bg-gray-900 text-xs px-2 py-1 rounded-full">
        {badge}
      </div>
    </div>
  );
}
