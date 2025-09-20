import { useAtom } from "jotai";
import { handAtom, selectedCardsAtom, techLevelsAtom } from "@/store/game";
import { TechCard } from "@/components/ui/TechCard";
import { GAME_CONFIG } from "@/const/game";

export function Hand() {
  const [hand, setHand] = useAtom(handAtom);
  const [selectedCards, setSelectedCards] = useAtom(selectedCardsAtom);
  const [techLevels] = useAtom(techLevelsAtom);

  const handleCardClick = (cardIndex: number) => {
    if (selectedCards.length >= GAME_CONFIG.MAX_SELECTED_CARDS) {
      return;
    }

    const card = hand[cardIndex];
    if (selectedCards.some((c) => c.id === card.id)) {
      return;
    }

    setSelectedCards([...selectedCards, card]);
    setHand(hand.filter((_, index) => index !== cardIndex));
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 text-orange-700">手札</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {hand.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            techLevel={techLevels[card.id]}
            badge="手札"
            onClick={() => handleCardClick(index)}
            className={
              selectedCards.length >= GAME_CONFIG.MAX_SELECTED_CARDS
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          />
        ))}
      </div>
    </div>
  );
}
