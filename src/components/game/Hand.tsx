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
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">手札</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {hand.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            techLevel={techLevels[card.id]}
            badge="HAND"
            onClick={() => handleCardClick(index)}
            className={`shadow-[0_0_25px_rgba(249,115,22,0.3)] ${
              selectedCards.length >= GAME_CONFIG.MAX_SELECTED_CARDS
                ? 'cursor-not-allowed opacity-30'
                : ''
            }`}
          />
        ))}
        {hand.length === 0 && (
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            No cards in bench
          </span>
        )}
      </div>
    </div>
  );
}
