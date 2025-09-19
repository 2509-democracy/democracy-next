import { useAtom } from "jotai";
import {
  shopAtom,
  buyCardAtom,
  rerollShopAtom,
  resourceAtom,
  techLevelsAtom,
} from "@/store/game";
import { TechCard } from "@/components/ui/TechCard";
import { Button } from "@/components/ui/Button";
import { GAME_CONFIG } from "@/const/game";

export function Shop() {
  const [shop] = useAtom(shopAtom);
  const [resource] = useAtom(resourceAtom);
  const [techLevels] = useAtom(techLevelsAtom);
  const [, buyCard] = useAtom(buyCardAtom);
  const [, rerollShop] = useAtom(rerollShopAtom);

  const handleBuyCard = (cardIndex: number) => {
    buyCard(cardIndex);
  };

  const handleReroll = () => {
    rerollShop();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">ショップ</h2>
      <div className="flex flex-wrap gap-4 justify-center mb-4">
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
      <div className="flex justify-center space-x-4">
        <Button
          variant="primary"
          onClick={handleReroll}
          disabled={resource < GAME_CONFIG.REROLL_COST}
        >
          リロール ({GAME_CONFIG.REROLL_COST} リソース)
        </Button>
      </div>
    </div>
  );
}
