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
import { GameStatus } from '@/components/game/GameStatus';
import { HackathonInfo } from '@/components/game/HackathonInfo';
import { Shop } from '@/components/game/Shop';
import { Hand } from '@/components/game/Hand';
import { SelectedCards } from '@/components/game/SelectedCards';
import { IdeaInput } from '@/components/game/IdeaInput';
import { TechLevels } from '@/components/game/TechLevels';
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
import { THEMES, DIRECTIONS } from '@/const/game';

export default function SingleModePage() {
  const [gameState] = useAtom(gameStateAtom);
  const [, initializeGame] = useAtom(initializeGameAtom);
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
  }, [initializeGame]);

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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-teal-400">
          ハッカソン・デベロッパー（シングルモード）
        </h1>
        
        <div className="space-y-8">
          <GameStatus />
          <HackathonInfo />
          <Shop />
          <Hand />
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <SelectedCards />
            <IdeaInput />
            
            <Button
              variant="danger"
              size="lg"
              className="mt-4 w-full"
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

          <TechLevels />
        </div>

        <EndGameModal
          isOpen={showEndModal}
          finalScore={finalScore}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}