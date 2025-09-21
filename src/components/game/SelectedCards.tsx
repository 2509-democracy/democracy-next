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
    <div className="rounded-2xl border border-rose-400/30 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80 p-4 shadow-[0_0_45px_rgba(244,63,94,0.25)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-rose-200">
          FIELD TECH ({GAME_CONFIG.MAX_SELECTED_CARDS})
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-300">
          Tap card to return to hand
        </span>
      </div>
      <div className="flex min-h-[96px] flex-wrap justify-center gap-3 rounded-xl border border-dashed border-rose-400/40 bg-slate-950/60 p-3">
        {selectedCards.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            techLevel={techLevels[card.id]}
            badge="SELECTED"
            onClick={() => handleCardClick(index)}
            className="shadow-[0_0_25px_rgba(244,63,94,0.25)]"
          />
        ))}
        {selectedCards.length === 0 && (
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Ready your comp
          </span>
        )}
      </div>
    </div>
  );
}
