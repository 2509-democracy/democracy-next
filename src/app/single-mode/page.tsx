"use client";

import { AIEvaluationScreen } from '@/components/game/AIEvaluationScreen';
import { EndGameModal } from '@/components/game/EndGameModal';
import { FinalRanking } from '@/components/game/FinalRanking';
import { GameStatus } from '@/components/game/GameStatus';
import { HackathonInfo } from '@/components/game/HackathonInfo';
import { IdeaInput } from '@/components/game/IdeaInput';
import { PlayerList } from '@/components/game/PlayerList';
import { RoundResult } from '@/components/game/RoundResult';
import { ScoreSummary } from '@/components/game/ScoreSummary';
import { SelectedCards } from '@/components/game/SelectedCards';
import { ShopHandTabs } from '@/components/game/ShopHandTabs';
import { CollapsibleGameLayout } from '@/components/layout/CollapsibleGameLayout';
import { Button } from '@/components/ui/Button';
import { TutorialModal } from "@/components/ui/tutorial/TutorialModal";
import { GAME_CONFIG } from "@/const/game";
import { initializeShopAtom } from '@/features/shop';
import {
  calculateFieldTechBonus,
  calculateFinalBonus,
  calculateResourceGain,
  canStartHackathon,
  isGameEnded,
  upgradeTechLevels,
} from "@/libs/game";
import { evaluateHackathon } from '@/libs/mock-ai';
import {
  freeRerollShopAtom,
  gameStateAtom,
  ideaAtom,
  initializeGameAtom,
  initializeMultiGameAtom,
  isLoadingAtom,
  resourceAtom,
  scoreAtom,
  selectedCardsAtom,
  techLevelsAtom,
  turnAtom,
  multiGameStateAtom,
  setPhaseAtom,
  updateTimerFromTimestampAtom,
} from '@/store/game';
import { tutorialModalAtom } from "@/store/ui";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

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
  const [, initializeMultiGame] = useAtom(initializeMultiGameAtom);
  const [, freeRerollShop] = useAtom(freeRerollShopAtom);
  const [multiState, setMultiState] = useAtom(multiGameStateAtom);
  const [, setPhase] = useAtom(setPhaseAtom);
  const [, updateTimerFromTimestamp] = useAtom(updateTimerFromTimestampAtom);
  
  const [tutorialOpen, setTutorialOpen] = useAtom(tutorialModalAtom);

  const [showEndModal, setShowEndModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // シングルモードを「一人用マルチモード」として初期化
  useEffect(() => {
    initializeGame();
    initializeShop(GAME_CONFIG.SHOP_SIZE);

    // 一人用マルチモードとして初期化
    const singlePlayer = {
      id: "single-player",
      name: "あなた",
      score: 0,
      resource: GAME_CONFIG.INITIAL_RESOURCE,
      techLevels: {},
      hand: [],
      selectedCards: [],
      idea: "",
      isReady: false,
      isConnected: true,
    };

    // initializeMultiGameを使用して適切に初期化
    initializeMultiGame([singlePlayer], "single-player");
    
    // preparationフェーズに設定
    setPhase('preparation', 'ゲーム開始 - アイデアを考えよう！');

    // 初回のみチュートリアル表示
    setTutorialOpen(true);
  }, [initializeGame, initializeShop, initializeMultiGame, setPhase]);

  // タイムスタンプベースタイマー管理
  useEffect(() => {
    if (multiState.isTimerActive) {
      const interval = setInterval(() => {
        const result = updateTimerFromTimestamp();
        
        if (result?.isExpired) {
          // フェーズ期限切れ時の自動遷移
          if (multiState.currentPhase === 'preparation') {
            handleStartHackathon();
          } else if (multiState.currentPhase === 'round_result') {
            const nextTurn = turn + 1;
            if (isGameEnded(nextTurn)) {
              handleFinishGame();
            } else {
              handleNextRound();
            }
          }
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [multiState.isTimerActive, multiState.currentPhase, multiState.currentPhaseStartTime, updateTimerFromTimestamp, turn]);

  const handleStartHackathon = async () => {
    if (!canStartHackathon(selectedCards, idea) || !gameState.hackathonInfo) {
      return;
    }

    setIsLoading(true);
    setPhase('ai_evaluation', 'AI評価中...');

    try {
      // AI評価を実行
      const result = await evaluateHackathon({
        theme: gameState.hackathonInfo.theme,
        direction: gameState.hackathonInfo.direction,
        idea,
        techNames: selectedCards.map((c) => c.name),
      });

      // 技術レベルボーナス計算（場に出したカードのみ）
      const techLevelBonus = calculateFieldTechBonus(selectedCards, techLevels);
      const roundScore = result.totalScore + techLevelBonus;
      const resourceGain = calculateResourceGain(roundScore);

      // スコア更新
      const newScore = score + roundScore;
      const newResource = resource + resourceGain;
      setScore(newScore);
      setResource(newResource);

      // 技術レベル更新
      const newTechLevels = upgradeTechLevels(techLevels, selectedCards);
      setTechLevels(newTechLevels);

      // カードリセット
      setSelectedCards([]);
      setIdea("");

      // 結果表示フェーズに移行
      setPhase('round_result', '結果発表！');
    } catch (error) {
      console.error("Hackathon execution error:", error);
      setPhase('preparation', 'ゲーム開始 - アイデアを考えよう！'); // エラー時は準備フェーズに戻る
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowEndModal(false);
    setFinalScore(0);
    setPhase('preparation', 'ゲーム開始 - アイデアを考えよう！');
  };

  const handleNextRound = () => {
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    
    if (isGameEnded(nextTurn)) {
      // ゲーム終了
      const finalBonus = calculateFinalBonus(techLevels);
      const totalFinalScore = score + finalBonus;
      setFinalScore(totalFinalScore);
      setPhase('final_ranking', '最終結果発表');
    } else {
      // 新しいラウンド開始時に無料リロール実行
      freeRerollShop();
      setPhase('preparation', `第${nextTurn}ラウンド - 準備フェーズ`);
    }
  };

  const handleFinishGame = () => {
    const finalBonus = calculateFinalBonus(techLevels);
    const totalFinalScore = score + finalBonus;
    setFinalScore(totalFinalScore);
    setPhase('final_ranking', '最終結果発表');
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // フェーズベースのルーティング
  switch (multiState.currentPhase) {
    case 'ai_evaluation':
      return (
        <CollapsibleGameLayout
          header={<GameStatus isMultiMode={false} />}
          leftPanel={<ScoreSummary isMultiMode={false} />}
          centerPanel={
            <AIEvaluationScreen
              onEvaluationComplete={() => setPhase('round_result', '結果発表！')}
            />
          }
          rightPanel={<PlayerList isMultiMode={false} />}
          bottomPanel={<ShopHandTabs />}
        />
      );

    case 'round_result':
      return (
        <CollapsibleGameLayout
          header={<GameStatus isMultiMode={false} />}
          leftPanel={<ScoreSummary isMultiMode={false} />}
          centerPanel={
            <RoundResult
              onNextRound={handleNextRound}
              onFinishGame={handleFinishGame}
            />
          }
          rightPanel={<PlayerList isMultiMode={false} />}
          bottomPanel={<ShopHandTabs />}
        />
      );

    case 'final_ranking':
      return (
        <FinalRanking
          onRestart={handleRestart}
          onBackToHome={handleBackToHome}
        />  
      );

    case 'preparation':
    default:
      return (
        <CollapsibleGameLayout
          header={<GameStatus isMultiMode={false} />}
          leftPanel={<ScoreSummary isMultiMode={false} />}
          centerPanel={
            <div className="space-y-4">
              <HackathonInfo />
              <SelectedCards />
              <IdeaInput />
              <Button
                variant="danger"
                onClick={handleStartHackathon}
                disabled={!canStartHackathon(selectedCards, idea) || isLoading}
              >
                {isLoading ? "AI評価中..." : "ハッカソン実行"}
              </Button>
            </div>
          }
          rightPanel={<PlayerList isMultiMode={false} />}
          bottomPanel={<ShopHandTabs />}
        >
          <TutorialModal
            isOpen={tutorialOpen}
            onClose={() => setTutorialOpen(false)}
          />
          <EndGameModal
            isOpen={showEndModal}
            finalScore={finalScore}
            onRestart={handleRestart}
          />
        </CollapsibleGameLayout>
      );
  }
}
