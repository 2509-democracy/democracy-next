import { useAtom } from 'jotai';
import { selectedCardsAtom, handAtom, techLevelsAtom } from '@/store/game';
import { TechCard } from '@/components/ui/TechCard';
import { GAME_CONFIG } from '@/const/game';

export function SelectedCards() {
  const [selectedCards, setSelectedCards] = useAtom(selectedCardsAtom);
  const [hand, setHand] = useAtom(handAtom);
  const [techLevels] = useAtom(techLevelsAtom);

  const handleCardClick = (cardIndex: number) => {
    const card = selectedCards[cardIndex];
    setHand([...hand, card]);
    setSelectedCards(selectedCards.filter((_, index) => index !== cardIndex));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-rose-400">
        今回のハッカソンで使用する技術 (最大{GAME_CONFIG.MAX_SELECTED_CARDS}枚)
      </h2>
      <div className="flex flex-wrap gap-4 justify-center h-24 border-2 border-dashed border-gray-600 rounded-lg p-2">
        {selectedCards.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            techLevel={techLevels[card.id]}
            badge="選択済み"
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
}