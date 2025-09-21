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
  initializeSingleGameAtom,
  isLoadingAtom,
  multiGameStateAtom,
  resourceAtom,
  scoreAtom,
  selectedCardsAtom,
  techLevelsAtom,
  turnAtom,
  updateTimerFromTimestampAtom,
} from '@/store/game';
import { tutorialModalAtom } from "@/store/ui";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

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
  const [, initializeSingleGame] = useAtom(initializeSingleGameAtom);
  const [, freeRerollShop] = useAtom(freeRerollShopAtom);
  const [multiGameState, setMultiGameState] = useAtom(multiGameStateAtom);
  const [, updateTimerFromTimestamp] = useAtom(updateTimerFromTimestampAtom);
  
  const [tutorialOpen, setTutorialOpen] = useAtom(tutorialModalAtom);

  const [showEndModal, setShowEndModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<
    "preparation" | "ai_evaluation" | "round_result" | "final_ranking"
  >("preparation");

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

    // initializeSingleGameを使用して適切に初期化
    initializeSingleGame([singlePlayer], "single-player");

    // 初回のみチュートリアル表示
    setTutorialOpen(true);
  }, [initializeGame, initializeShop, initializeSingleGame]);


  const handleStartHackathon = async () => {
    if (!canStartHackathon(selectedCards, idea) || !gameState.hackathonInfo) {
      return;
    }

    setIsLoading(true);
    setGamePhase("ai_evaluation");

    try {
      // AI評価を実行
      const techNames = selectedCards.map((c) => c.name);
      const techLevelsSelected = Object.fromEntries(selectedCards.map(card => [card.name, card.level]));
      const result = await evaluateHackathon({
        theme: gameState.hackathonInfo.theme,
        direction: gameState.hackathonInfo.direction,
        idea,
        techNames,
        techLevels: techLevelsSelected,
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

      // AI評価結果をマルチゲーム状態に保存
      setMultiGameState((prevState) => ({
        ...prevState,
        currentRoundAIEvaluations: {
          ...prevState.currentRoundAIEvaluations,
          "single-player": result, // シングルプレイヤーのIDで保存
        },
      }));

      // カードリセット
      setSelectedCards([]);
      setIdea("");

      // 結果表示フェーズに移行し、タイマーを開始
      setGamePhase("round_result");
      
      // マルチゲーム状態のフェーズをround_resultに設定（タイマーが自動的に開始される）
      setMultiGameState((prevState) => ({
        ...prevState,
        currentPhase: 'round_result',
        currentPhaseStartTime: new Date(),
        timeLeft: 20, // round_resultフェーズは20秒
        isTimerActive: true,
      }));
    } catch (error) {
      console.error("Hackathon execution error:", error);
      setGamePhase("preparation"); // エラー時は準備フェーズに戻る
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowEndModal(false);
    setFinalScore(0);
    setGamePhase("preparation");
  };

  const handleNextRound = useCallback(() => {
    // ターン数を更新
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    
    // マルチゲーム状態のラウンド数も更新
    setMultiGameState((prevState) => ({
      ...prevState,
      currentRound: nextTurn,
      currentRoundAIEvaluations: {}, // 新しいラウンドでAI評価結果をリセット
    }));
    
    // 新しいラウンド開始時に無料リロール実行
    freeRerollShop();
    setGamePhase('preparation');
  }, [turn, setTurn, setMultiGameState, freeRerollShop, setGamePhase]);

  // タイマーの監視と自動進行
  useEffect(() => {
    if (!multiGameState.isTimerActive || gamePhase !== 'round_result') return;

    const interval = setInterval(() => {
      const timerResult = updateTimerFromTimestamp();
      
      if (timerResult?.isExpired) {
        // タイマー期限切れ時の自動進行
        const nextTurn = turn + 1;
        
        if (isGameEnded(nextTurn)) {
          // ゲーム終了
          const finalBonus = calculateFinalBonus(techLevels);
          const totalFinalScore = score + finalBonus;
          setFinalScore(totalFinalScore);
          setGamePhase("final_ranking");
        } else {
          // 次のラウンドへ
          handleNextRound();
        }
        
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [multiGameState.isTimerActive, gamePhase, turn, techLevels, score, updateTimerFromTimestamp, handleNextRound]);

  const handleFinishGame = () => {
    setGamePhase("final_ranking");
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // フェーズベースのルーティング
  switch (gamePhase) {
    case "ai_evaluation":
      return (
        <CollapsibleGameLayout
          header={<GameStatus isMultiMode={false} />}
          leftPanel={<ScoreSummary isMultiMode={false} />}
          centerPanel={
            <AIEvaluationScreen
              onEvaluationComplete={() => setGamePhase("round_result")}
            />
          }
          rightPanel={<PlayerList isMultiMode={false} />}
          bottomPanel={<ShopHandTabs />}
        />
      );

    case "round_result":
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

    case "final_ranking":
      return (
        <FinalRanking
          onRestart={handleRestart}
          onBackToHome={handleBackToHome}
        />  
      );

    case "preparation":
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
