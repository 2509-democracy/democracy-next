'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { 
  gameStateAtom, 
  initializeGameAtom, 
  selectedCardsAtom,
  ideaAtom,
  turnAtom,
  scoreAtom,
  techLevelsAtom,
  resourceAtom,
  isLoadingAtom,
} from '@/store/game';
import { initializeShopAtom } from '@/features/shop';
import { GameLayout } from '@/components/layout/GameLayout';
import { GameStatus } from '@/components/game/GameStatus';
import { HackathonInfo } from '@/components/game/HackathonInfo';
import { SelectedCards } from '@/components/game/SelectedCards';
import { IdeaInput } from '@/components/game/IdeaInput';
import { ScoreSummary } from '@/components/game/ScoreSummary';
import { ShopHandTabs } from '@/components/game/ShopHandTabs';
import { EndGameModal } from '@/components/game/EndGameModal';
import { Button } from '@/components/ui/Button';
import { evaluateHackathon } from '@/libs/gemini';
import { 
  calculateTechLevelBonus, 
  calculateFinalBonus, 
  calculateResourceGain,
  upgradeTechLevels,
  isGameEnded,
  canStartHackathon
} from '@/libs/game';
import { THEMES, DIRECTIONS, GAME_CONFIG } from '@/const/game';

export default function SingleModePage() {
  const [gameState] = useAtom(gameStateAtom);
  const [, initializeGame] = useAtom(initializeGameAtom);
  const [, initializeShop] = useAtom(initializeShopAtom);
  const [selectedCards, setSelectedCards] = useAtom(selectedCardsAtom);
  const [idea, setIdea] = useAtom(ideaAtom);
  const [turn, setTurn] = useAtom(turnAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [techLevels, setTechLevels] = useAtom(techLevelsAtom);
  const [resource, setResource] = useAtom(resourceAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  
  const [showEndModal, setShowEndModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    initializeGame();
    initializeShop(GAME_CONFIG.SHOP_SIZE);
  }, [initializeGame, initializeShop]);

  const handleStartHackathon = async () => {
    if (!canStartHackathon(selectedCards, idea) || !gameState.hackathonInfo) {
      return;
    }

    setIsLoading(true);

    try {
      // AI評価を実行
      const result = await evaluateHackathon({
        theme: gameState.hackathonInfo.theme,
        direction: gameState.hackathonInfo.direction,
        idea,
        techNames: selectedCards.map(c => c.name),
      });

      // 技術レベルボーナス計算
      const techLevelBonus = calculateTechLevelBonus(techLevels);
      const roundScore = result.score + techLevelBonus;
      const resourceGain = calculateResourceGain(roundScore);

      // スコア更新
      setScore(score + roundScore);
      setResource(resource + resourceGain);

      // 技術レベル更新
      const newTechLevels = upgradeTechLevels(techLevels, selectedCards);
      setTechLevels(newTechLevels);

      // カードリセット
      setSelectedCards([]);
      setIdea('');

      // 次のターンへ
      const nextTurn = turn + 1;
      setTurn(nextTurn);

      if (isGameEnded(nextTurn)) {
        // ゲーム終了
        const finalBonus = calculateFinalBonus(newTechLevels);
        const totalFinalScore = score + roundScore + finalBonus;
        setFinalScore(totalFinalScore);
        setShowEndModal(true);
      } else {
        // 新しいハッカソン情報生成
        const newHackathonInfo = {
          theme: THEMES[Math.floor(Math.random() * THEMES.length)],
          direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
        };
        // ここで新しいハッカソン情報をセットする処理が必要
      }
    } catch (error) {
      console.error('Hackathon execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowEndModal(false);
    setFinalScore(0);
  };

  return (
    <GameLayout
      header={<GameStatus />}
      leftPanel={<ScoreSummary />}
      centerPanel={
        <div className="space-y-4">
          <HackathonInfo />
          <SelectedCards />
          <IdeaInput />
          <Button
            variant="danger"
            size="lg"
            className="w-full"
            onClick={handleStartHackathon}
            disabled={
              !canStartHackathon(selectedCards, idea) || 
              isLoading || 
              !gameState.hackathonInfo
            }
          >
            {isLoading ? 'ハッカソン実行中...' : 'ハッカソンを開始'}
          </Button>
        </div>
      }
      bottomPanel={<ShopHandTabs />}
    >
      <EndGameModal
        isOpen={showEndModal}
        finalScore={finalScore}
        onRestart={handleRestart}
      />
    </GameLayout>
  );
}