import { useAtom } from "jotai";
import { selectedCardsAtom, handAtom, techLevelsAtom } from "@/store/game";
import { TechCard } from "@/components/ui/TechCard";
import { GAME_CONFIG } from "@/const/game";

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
    <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
      <h2 className="text-base font-bold mb-3 text-rose-700">
        使用技術 (最大{GAME_CONFIG.MAX_SELECTED_CARDS}枚)
      </h2>
      <div className="flex flex-wrap gap-2 justify-center min-h-[80px] border-2 border-dashed border-rose-300 rounded-lg p-2">
        {selectedCards.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            techLevel={techLevels[card.id]}
            badge="選択済み"
            onClick={() => handleCardClick(index)}
            isSelected
          />
        ))}
      </div>
    </div>
  );
}
