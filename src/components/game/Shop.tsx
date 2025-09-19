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
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-cyan-700">ショップ</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={handleReroll}
          disabled={resource < GAME_CONFIG.REROLL_COST}
        >
          リロール ({GAME_CONFIG.REROLL_COST})
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg p-2">
        {shop.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            techLevel={techLevels[card.id]}
            onClick={() => handleBuyCard(index)}
            className={
              resource < card.cost ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        ))}
      </div>
    </div>
  );
}
