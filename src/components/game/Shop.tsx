import { useAtom } from 'jotai';
import { resourceAtom, handAtom, techLevelsAtom } from '@/store/game';
import { shopCardsAtom, rerollShopActionAtom, purchaseCardActionAtom } from '@/features/shop';
import { TechCard } from '@/components/ui/TechCard';
import { Button } from '@/components/ui/Button';
import { GAME_CONFIG } from '@/const/game';

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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">ショップ</h2>
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {shop.map((card, index) => (
          <TechCard
            key={`${card.id}-${index}`}
            card={card}
            onClick={() => handleBuyCard(index)}
            className={resource < card.cost ? 'opacity-50 cursor-not-allowed' : ''}
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