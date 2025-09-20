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
  multiGameStateAtom,
} from '@/store/game';
import { initializeShopAtom } from '@/features/shop';
import { CollapsibleGameLayout } from '@/components/layout/CollapsibleGameLayout';
import { GameStatus } from '@/components/game/GameStatus';
import { HackathonInfo } from '@/components/game/HackathonInfo';
import { SelectedCards } from '@/components/game/SelectedCards';
import { IdeaInput } from '@/components/game/IdeaInput';
import { ScoreSummary } from '@/components/game/ScoreSummary';
import { PlayerList } from '@/components/game/PlayerList';
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
  const [multiGameState, setMultiGameState] = useAtom(multiGameStateAtom);
  
  const [showEndModal, setShowEndModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // シングルモードを「一人用マルチモード」として初期化
  useEffect(() => {
    initializeGame();
    initializeShop(GAME_CONFIG.SHOP_SIZE);
    
    // 一人用マルチモードとして初期化
    const singlePlayer = {
      id: 'single-player',
      name: 'あなた',
      score: 0,
      resource: GAME_CONFIG.INITIAL_RESOURCE,
      techLevels: {},
      hand: [],
      selectedCards: [],
      idea: '',
      isReady: false,
      isConnected: true,
    };
    
    setMultiGameState({
      mode: 'single',
      players: [singlePlayer],
      currentPlayerId: 'single-player',
      gameStarted: true,
      currentPhase: 'preparation',
      timeLeft: 0,
      isTimerActive: false,
    });
  }, [initializeGame, initializeShop, setMultiGameState]);

  // マルチモード状態をシングルプレイヤーの状態と同期
  useEffect(() => {
    if (multiGameState.players.length > 0) {
      const player = multiGameState.players[0];
      const updatedPlayer = {
        ...player,
        score,
        resource,
        techLevels,
        selectedCards,
        idea,
      };
      
      setMultiGameState({
        ...multiGameState,
        players: [updatedPlayer],
      });
    }
  }, [score, resource, techLevels, selectedCards, idea]); // setMultiGameState, multiGameStateは除く

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
    <CollapsibleGameLayout
      header={<GameStatus isMultiMode={true} />}
      leftPanel={<ScoreSummary isMultiMode={true} />}
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
      rightPanel={<PlayerList isMultiMode={true} />}
      bottomPanel={<ShopHandTabs />}
    >
      <EndGameModal
        isOpen={showEndModal}
        finalScore={finalScore}
        onRestart={handleRestart}
      />
    </CollapsibleGameLayout>
  );
}