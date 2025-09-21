import { TechCard as TechCardType } from "@/features/card-pool";

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "from-pink-500/80 to-rose-500/60",
  Backend: "from-sky-500/80 to-cyan-500/60",
  Other: "from-amber-400/80 to-yellow-400/60",
};

function renderEmojis(count: number, emoji: string) {
  return Array(count).fill(emoji).join("");
}

interface TechCardProps {
  card: TechCardType;
  techLevel?: number;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
}

export function TechCard({
  card,
  techLevel,
  badge = card.cost,
  onClick,
  className = "",
}: TechCardProps) {
  return (
    <div
      className={`group relative w-32 cursor-pointer rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-slate-950/90 p-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(56,189,248,0.35)] ${className}`}
      onClick={onClick}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-active:opacity-100">
        <div className="absolute inset-0 animate-sparkle bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      </div>
      {/* カテゴリバッジをリソースバッジと同じ形状・配置に変更 */}
      <div
        className={`absolute -top-2 -left-2 rounded-full bg-gradient-to-r px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white ${
          CATEGORY_COLORS[card.category] ?? 'from-slate-500/80 to-slate-600/60'
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
          className="mx-auto mt-0 mb-0 h-8 w-8 object-contain drop-shadow-[0_6px_14px_rgba(12,74,110,0.55)]"
          style={{ display: "block" }}
        />
      )}
      <div className="mt-2 mb-1 truncate text-center text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
        {card.name}
      </div>
      <div className="mb-2 text-center text-[10px] uppercase tracking-[0.3em] text-slate-300">
        Lv.{techLevel ?? card.level}
      </div>
      <div className="mb-2 w-full text-[10px] text-slate-300">
        <table className="w-full">
          <tbody>
            {[
              { label: "難度", value: renderEmojis(card.difficulty, "🧩") },
              { label: "人気", value: renderEmojis(card.popularity, "⭐") },
              { label: "性能", value: renderEmojis(card.performance, "⚡") },
            ].map(({ label, value }) => (
              <tr key={label} className="">
                <td className="pr-1 text-left text-slate-500">{label}:</td>
                <td className="text-left text-slate-100">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* リソースバッジ（右上） */}
      <div className="absolute -top-2 -right-2 rounded-full border border-amber-300/40 bg-amber-500/30 px-2 py-1 text-[11px] font-semibold tracking-[0.25em] text-amber-100">
        {badge}
      </div>
    </div>
  );
}
