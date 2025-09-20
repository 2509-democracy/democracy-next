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
      className={`relative bg-white border-2 border-gray-300 p-2 rounded-lg w-40 cursor-pointer transition-transform duration-200 hover:scale-105 hover:border-blue-400 ${className}`}
      onClick={onClick}
    >
      <div
        className={`absolute top-4 left-1 text-xs px-2 py-1 rounded-full text-white ${
          CATEGORY_COLORS[card.category] ?? "bg-gray-500"
        }`}
        style={{ zIndex: 2 }}
      >
        {card.category}
      </div>
      <div className="font-bold text-center text-gray-900 text-s truncate mb-1 mt-8">
        {card.name}
      </div>
      <div className="text-center text-gray-600 mb-4">
        Lv.{techLevel ?? card.level}
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
      <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded-full">
        {badge}
      </div>
    </div>
  );
}
