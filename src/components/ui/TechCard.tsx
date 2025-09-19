import { TechCard as TechCardType } from '@/features/card-pool';

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
  className = ''
}: TechCardProps) {
  return (
    <div 
      className={`relative bg-white border-2 border-gray-300 p-2 rounded-lg w-40 cursor-pointer transition-transform duration-200 hover:scale-105 hover:border-blue-400 ${className}`}
      onClick={onClick}
    >
      <div className="font-bold text-center text-gray-900 text-s truncate">{card.name}</div>
      <div className="text-center text-gray-600">
        Lv.{techLevel ?? card.level}
      </div>
      <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded-full">
        {badge}
      </div>
    </div>
  );
}