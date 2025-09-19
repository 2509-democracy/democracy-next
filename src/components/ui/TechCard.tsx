import { TechCard as TechCardType } from '@/types/game';

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
      className={`relative bg-gray-700 p-7 rounded-lg w-32 cursor-pointer transition-transform duration-200 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <div className="font-bold text-center">{card.name}</div>
      <div className="text-sm text-center text-gray-400">
        レベル {techLevel ?? card.level}
      </div>
      <div className="absolute bottom-1 right-1 bg-gray-900 text-xs px-2 py-1 rounded-full">
        {badge}
      </div>
    </div>
  );
}