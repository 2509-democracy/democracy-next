import { useAtom } from "jotai";
import { resourceAtom, handAtom, techLevelsAtom } from "@/store/game";
import {
  shopCardsAtom,
  rerollShopActionAtom,
  purchaseCardActionAtom,
} from "@/features/shop";
import { TechCard } from "@/components/ui/TechCard";
import { Button } from "@/components/ui/Button";
import { GAME_CONFIG } from "@/const/game";

export function Shop() {
  const [shop] = useAtom(shopCardsAtom);
  const [resource, setResource] = useAtom(resourceAtom);
  const [hand, setHand] = useAtom(handAtom);
  const [techLevels, setTechLevels] = useAtom(techLevelsAtom);
  const [, rerollShopAction] = useAtom(rerollShopActionAtom);
  const [, purchaseCardAction] = useAtom(purchaseCardActionAtom);

  const handleBuyCard = (cardIndex: number) => {
    purchaseCardAction({
      cardIndex,
      currentResource: resource,
      onResourceUpdate: setResource,
      onHandUpdate: setHand,
      onTechLevelUpdate: (techId: string, level: number) => {
        setTechLevels({ ...techLevels, [techId]: level });
      },
      currentHand: hand,
      currentTechLevels: techLevels,
    });
  };

  const handleReroll = () => {
    rerollShopAction({
      currentResource: resource,
      rerollCost: GAME_CONFIG.REROLL_COST,
      shopSize: GAME_CONFIG.SHOP_SIZE,
      onResourceUpdate: setResource,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">ショップ</h2>
        <Button
          variant="primary"
          size="sm"
          className="border border-cyan-300/40 bg-gradient-to-r from-cyan-500/60 to-sky-500/60 text-xs uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] hover:from-cyan-400/70 hover:to-sky-400/70"
          onClick={handleReroll}
          disabled={resource < GAME_CONFIG.REROLL_COST}
        >
          リロール ({GAME_CONFIG.REROLL_COST})
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {shop.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            techLevel={techLevels[card.id]}
            onClick={() => handleBuyCard(index)}
            className={`shadow-[0_0_25px_rgba(56,189,248,0.25)] ${
              resource < card.cost ? 'cursor-not-allowed opacity-40' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
