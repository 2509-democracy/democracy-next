"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
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
  initializeMultiGameAtom,
} from "@/store/game";
import { initializeShopAtom } from "@/features/shop";
import { CollapsibleGameLayout } from "@/components/layout/CollapsibleGameLayout";
import { GameStatus } from "@/components/game/GameStatus";
import { HackathonInfo } from "@/components/game/HackathonInfo";
import { SelectedCards } from "@/components/game/SelectedCards";
import { IdeaInput } from "@/components/game/IdeaInput";
import { ScoreSummary } from "@/components/game/ScoreSummary";
import { PlayerList } from "@/components/game/PlayerList";
import { ShopHandTabs } from "@/components/game/ShopHandTabs";
import { EndGameModal } from "@/components/game/EndGameModal";
import { AIEvaluationScreen } from "@/components/game/AIEvaluationScreen";
import { RoundResult } from "@/components/game/RoundResult";
import { FinalRanking } from "@/components/game/FinalRanking";
import { Button } from "@/components/ui/Button";
import { evaluateHackathon } from "@/libs/gemini";
import {
  calculateTechLevelBonus,
  calculateFinalBonus,
  calculateResourceGain,
  upgradeTechLevels,
  isGameEnded,
  canStartHackathon,
} from "@/libs/game";
import { GAME_CONFIG } from "@/const/game";
import { tutorialModalAtom } from "@/store/ui";
import { TutorialModal } from "@/components/ui/tutorial/TutorialModal";

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

    // initializeMultiGameを使用して適切に初期化
    initializeMultiGame([singlePlayer], "single-player");

    // 初回のみチュートリアル表示
    setTutorialOpen(true);
  }, [initializeGame, initializeShop, initializeMultiGame]);

  const handleStartHackathon = async () => {
    if (!canStartHackathon(selectedCards, idea) || !gameState.hackathonInfo) {
      return;
    }

    setIsLoading(true);
    setGamePhase("ai_evaluation");

    try {
      // AI評価を実行
      const result = await evaluateHackathon({
        theme: gameState.hackathonInfo.theme,
        direction: gameState.hackathonInfo.direction,
        idea,
        techNames: selectedCards.map((c) => c.name),
      });

      // 技術レベルボーナス計算
      const techLevelBonus = calculateTechLevelBonus(techLevels);
      const roundScore = result.score + techLevelBonus;
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
      setGamePhase("round_result");

      // 3秒後に次の判定
      setTimeout(() => {
        const nextTurn = turn + 1;
        setTurn(nextTurn);

        if (isGameEnded(nextTurn)) {
          // ゲーム終了
          const finalBonus = calculateFinalBonus(newTechLevels);
          const totalFinalScore = newScore + finalBonus;
          setFinalScore(totalFinalScore);
          setGamePhase("final_ranking");
        } else {
          // 次のラウンドへ
          setGamePhase("preparation");
        }
      }, 3000);
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

  const handleNextRound = () => {
    setGamePhase("preparation");
  };

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
