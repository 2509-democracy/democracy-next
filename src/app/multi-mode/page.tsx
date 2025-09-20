'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { 
  gameStateAtom, 
  initializeGameAtom, 
  selectedCardsAtom,
  ideaAtom,
  scoreAtom,
  techLevelsAtom,
  resourceAtom,
  multiGameStateAtom,
  initializeMultiGameAtom,
  startTimerAtom,
  stopTimerAtom,
  updateTimerAtom,
  setPhaseAtom,
  freeRerollShopAtom,
  MultiPlayer,
} from '@/store/game';
import { initializeShopAtom } from '@/features/shop';
import { CollapsibleGameLayout } from '@/components/layout/CollapsibleGameLayout';
import { GameStatus } from '@/components/game/GameStatus';
import { HackathonInfo } from '@/components/game/HackathonInfo';
import { SelectedCards } from '@/components/game/SelectedCards';
import { IdeaInput } from '@/components/game/IdeaInput';
import { PlayerList } from '@/components/game/PlayerList';
import { TechLevels } from '@/components/game/TechLevels';
import { ShopHandTabs } from '@/components/game/ShopHandTabs';
import { MatchingScreen } from '@/components/game/MatchingScreen';
import { Waiting } from '@/components/game/Waiting';
import { SubmissionReview } from '@/components/game/SubmissionReview';
import { AIEvaluationScreen } from '@/components/game/AIEvaluationScreen';
import { RoundResult } from '@/components/game/RoundResult';
import { FinalRanking } from '@/components/game/FinalRanking';
import { Button } from '@/components/ui/Button';
import { evaluateHackathon } from '@/libs/mock-ai';
import { 
  calculateFieldTechBonus,
  calculateResourceGain,
  upgradeTechLevels,
  canStartHackathon
} from '@/libs/game';
import { GAME_CONFIG } from '@/const/game';

// ダミープレイヤー名
const AI_NAMES = ['エンジニア太郎', 'コーダー花子', 'デベロッパー次郎'];

// プレイヤーID生成
const generatePlayerId = () => `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ダミープレイヤー生成
const createDummyPlayer = (name: string): MultiPlayer => ({
  id: generatePlayerId(),
  name,
  score: 0,
  resource: GAME_CONFIG.INITIAL_RESOURCE,
  techLevels: {},
  hand: [],
  selectedCards: [],
  idea: '',
  isConnected: true,
});

export default function MultiModePage() {
  const router = useRouter();
  const [gameState] = useAtom(gameStateAtom);
  const [, initializeGame] = useAtom(initializeGameAtom);
  const [, initializeShop] = useAtom(initializeShopAtom);
  const [selectedCards, setSelectedCards] = useAtom(selectedCardsAtom);
  const [idea, setIdea] = useAtom(ideaAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [techLevels, setTechLevels] = useAtom(techLevelsAtom);
  const [resource, setResource] = useAtom(resourceAtom);
  
  const [multiState, setMultiState] = useAtom(multiGameStateAtom);
  const [, initializeMultiGame] = useAtom(initializeMultiGameAtom);
  const [, startTimer] = useAtom(startTimerAtom);
  const [, stopTimer] = useAtom(stopTimerAtom);
  const [, updateTimer] = useAtom(updateTimerAtom);
  const [, setPhase] = useAtom(setPhaseAtom);
  const [, freeRerollShop] = useAtom(freeRerollShopAtom);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化
  useEffect(() => {
    if (!isInitialized) {
      const playerId = generatePlayerId();
      
      // シングルゲーム初期化
      initializeGame();
      initializeShop(GAME_CONFIG.SHOP_SIZE);
      
      // マルチプレイヤー作成（自分 + CPU3人 = 合計4人）
      const players: MultiPlayer[] = [
        {
          id: playerId,
          name: 'あなた',
          score: 0,
          resource: GAME_CONFIG.INITIAL_RESOURCE,
          techLevels: {},
          hand: [],
          selectedCards: [],
          idea: '',
          isConnected: true,
        }
      ];
      
      // CPU3人を追加
      for (let i = 0; i < 3; i++) {
        players.push(createDummyPlayer(AI_NAMES[i % AI_NAMES.length]));
      }
      
      // マルチゲーム初期化
      initializeMultiGame(players, playerId);
      
      // マッチングフェーズから開始（タイマーはまだ開始しない）
      
      setIsInitialized(true);
    }
  }, [isInitialized, initializeGame, initializeShop, initializeMultiGame, startTimer]);

  // タイマー管理
  useEffect(() => {
    if (multiState.isTimerActive && multiState.timeLeft > 0) {
      const interval = setInterval(() => {
        const newTime = multiState.timeLeft - 1;
        updateTimer(newTime);
        
        if (newTime <= 0) {
          stopTimer();
          
          if (multiState.currentPhase === 'preparation') {
            // 準備時間終了 → 自動でハッカソン実行（強制実行）
            handleStartHackathon(true);
          } else if (multiState.currentPhase === 'round_result') {
            // 結果表示時間終了 → 次のラウンドまたは最終結果に進行
            const nextRound = multiState.currentRound + 1;
            if (nextRound > multiState.maxRounds) {
              handleFinishGame();
            } else {
              handleNextRound();
            }
          }
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiState.isTimerActive, multiState.timeLeft, multiState.currentPhase, updateTimer, stopTimer]); // handleStartHackathon is hoisted function declaration

  // 関数宣言でhoistingを利用
  async function handleStartHackathon(forceStart = false) {
    // 制限時間終了時は強制実行、通常時はバリデーションチェック
    if (!forceStart && (!canStartHackathon(selectedCards, idea) || !gameState.hackathonInfo)) {
      return;
    }

    // ハッカソン情報がない場合のフォールバック
    if (!gameState.hackathonInfo) {
      console.warn('ハッカソン情報がありません。スキップします。');
      return;
    }

    setPhase('ai_evaluation', 'ハッカソン実行中...');

    try {
      // 評価フェーズに遷移
      setPhase('ai_evaluation', 'AI評価中...');

      // AI評価を実行（モック版）
      const result = await evaluateHackathon({
        theme: gameState.hackathonInfo.theme,
        direction: gameState.hackathonInfo.direction,
        idea: idea.trim() || 'アイデア未入力',
        techNames: selectedCards.length > 0 ? selectedCards.map(c => c.name) : ['技術なし'],
      });

      // 技術レベルボーナス計算（場に出したカードのみ）
      const techLevelBonus = calculateFieldTechBonus(selectedCards, techLevels);
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

      // 結果フェーズに遷移
      setPhase('round_result', '結果発表！');

      // マルチプレイヤー状態も更新
      setMultiState(prev => ({
        ...prev,
        players: prev.players.map(player => 
          player.id === multiState.currentPlayerId 
            ? { 
                ...player, 
                score: newScore, 
                resource: newResource, 
                techLevels: newTechLevels,
                selectedCards: [],
                idea: '',
              }
            : {
                ...player,
                score: player.score + Math.floor(Math.random() * 50) + 20, // ダミーAIのスコア
              }
        )
      }));

      // カードリセット
      setSelectedCards([]);
      setIdea('');

      // 結果表示（60秒のタイマー開始）
      startTimer(60); // 60秒タイマー開始

    } catch (error) {
      console.error('Hackathon execution error:', error);
    }
  }

  // フェーズハンドラー
  const handleWaitingComplete = () => {
    setPhase('matching', 'プレイヤーを待っています...');
  };
  
  const handleStartGame = () => {
    // ゲーム開始状態に変更し、準備フェーズに移行
    setMultiState(prev => ({ 
      ...prev, 
      gameStarted: true,
    }));
    setPhase('preparation', '第1ラウンド - 準備フェーズ');
    console.log('Starting initial timer for round 1'); // デバッグログ
    startTimer(60);
  };
  
  const handleProceedToEvaluation = () => {
    setPhase('ai_evaluation', 'AI評価中...');
  };
  
  const handleEvaluationComplete = () => {
    setPhase('round_result', '結果発表！');
  };
  
  const handleNextRound = () => {
    // ラウンド進行ロジック
    const nextRound = multiState.currentRound + 1;
    setMultiState(prev => ({ ...prev, currentRound: nextRound }));
    
    if (nextRound > multiState.maxRounds) {
      setPhase('final_ranking', '最終結果発表');
    } else {
      // 新しいラウンド開始時に無料リロール実行
      freeRerollShop();
      setPhase('preparation', `第${nextRound}ラウンド - 準備フェーズ`);
      console.log('Starting timer for round', nextRound); // デバッグログ
      startTimer(60); // 準備フェーズのタイマー開始
    }
  };
  
  const handleFinishGame = () => {
    setPhase('final_ranking', '最終結果発表');
  };
  
  const handleRestart = () => {
    setMultiState(prev => ({ 
      ...prev, 
      currentPhase: 'waiting',
      currentRound: 1,
      roundResults: [],
      submissions: [],
      phaseMessage: 'ゲームの準備をしています...'
    }));
  };

  const handleBackToHome = () => {
    stopTimer();
    router.push('/');
  };

  // 初期化時の待機画面
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">マルチゲームを初期化中...</p>
        </div>
      </div>
    );
  }

  // SPA内フェーズルーティング
  switch (multiState.currentPhase) {
    case 'waiting':
      return <Waiting onComplete={handleWaitingComplete} />;
      
    case 'matching':
      return <MatchingScreen onStartGame={handleStartGame} />;
      
    case 'preparation':
      return (
        <CollapsibleGameLayout
          header={
            <div className="flex items-center justify-between w-full">
              <GameStatus isMultiMode={true} />
              <Button variant="secondary" onClick={handleBackToHome}>
                ホームに戻る
              </Button>
            </div>
          }
          leftPanel={<TechLevels />}
          centerPanel={
            <div className="space-y-4">
              <HackathonInfo />
              <SelectedCards />
              <IdeaInput />
              
              <div className="space-y-2">
                <div className="text-center py-3 bg-blue-50 rounded-lg">
                  <h2 className="text-lg font-bold text-blue-700">
                    {multiState.phaseMessage}
                  </h2>
                </div>
              </div>
            </div>
          }
          rightPanel={<PlayerList isMultiMode={true} />}
          bottomPanel={<ShopHandTabs />}
        />
      );
      
    case 'submission_review':
      return (
        <CollapsibleGameLayout
          header={
            <div className="flex items-center justify-between w-full">
              <GameStatus isMultiMode={true} />
              <Button variant="secondary" onClick={handleBackToHome}>
                ホームに戻る
              </Button>
            </div>
          }
          leftPanel={<TechLevels />}
          centerPanel={<SubmissionReview onProceedToEvaluation={handleProceedToEvaluation} />}
          rightPanel={<PlayerList isMultiMode={true} />}
          bottomPanel={<ShopHandTabs />}
        />
      );
      
    case 'ai_evaluation':
      return (
        <CollapsibleGameLayout
          header={
            <div className="flex items-center justify-between w-full">
              <GameStatus isMultiMode={true} />
              <Button variant="secondary" onClick={handleBackToHome}>
                ホームに戻る
              </Button>
            </div>
          }
          leftPanel={<TechLevels />}
          centerPanel={<AIEvaluationScreen onEvaluationComplete={handleEvaluationComplete} />}
          rightPanel={<PlayerList isMultiMode={true} />}
          bottomPanel={<ShopHandTabs />}
        />
      );
      
    case 'round_result':
      return (
        <CollapsibleGameLayout
          header={
            <div className="flex items-center justify-between w-full">
              <GameStatus isMultiMode={true} />
              <Button variant="secondary" onClick={handleBackToHome}>
                ホームに戻る
              </Button>
            </div>
          }
          leftPanel={<TechLevels />}
          centerPanel={
            <RoundResult 
              onNextRound={handleNextRound} 
              onFinishGame={handleFinishGame} 
            />
          }
          rightPanel={<PlayerList isMultiMode={true} />}
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
      
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">不明なフェーズです: {multiState.currentPhase}</p>
            <Button variant="secondary" onClick={handleBackToHome} className="mt-4">
              ホームに戻る
            </Button>
          </div>
        </div>
      );
  }
}