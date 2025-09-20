'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  initializeMultiGameAtom,
  currentPlayerAtom,
  startTimerAtom,
  stopTimerAtom,
  updateTimerAtom,
  setPhaseAtom,
  togglePlayerReadyAtom,
  checkAllReadyAtom,
  MultiPlayer,
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
  isReady: false,
  isConnected: true,
});

export default function MultiModePage() {
  const router = useRouter();
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
  
  const [multiState, setMultiState] = useAtom(multiGameStateAtom);
  const [, initializeMultiGame] = useAtom(initializeMultiGameAtom);
  const [currentPlayer] = useAtom(currentPlayerAtom);
  const [, startTimer] = useAtom(startTimerAtom);
  const [, stopTimer] = useAtom(stopTimerAtom);
  const [, updateTimer] = useAtom(updateTimerAtom);
  const [, setPhase] = useAtom(setPhaseAtom);
  const [, togglePlayerReady] = useAtom(togglePlayerReadyAtom);
  const [allReady] = useAtom(checkAllReadyAtom);
  
  const [showEndModal, setShowEndModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化
  useEffect(() => {
    if (!isInitialized) {
      const playerId = generatePlayerId();
      
      // シングルゲーム初期化
      initializeGame();
      initializeShop(GAME_CONFIG.SHOP_SIZE);
      
      // マルチプレイヤー作成（自分 + ダミー2-3人）
      const playerCount = Math.floor(Math.random() * 2) + 3; // 3-4人
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
          isReady: false,
          isConnected: true,
        }
      ];
      
      // ダミープレイヤー追加
      for (let i = 1; i < playerCount; i++) {
        players.push(createDummyPlayer(AI_NAMES[(i - 1) % AI_NAMES.length]));
      }
      
      // マルチゲーム初期化
      initializeMultiGame(players, playerId);
      
      // 準備フェーズのタイマー開始（45秒）
      startTimer(45);
      
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
          handleTimerEnd();
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [multiState.isTimerActive, multiState.timeLeft, updateTimer]);

  // ダミープレイヤーの行動シミュレート
  useEffect(() => {
    if (multiState.gameStarted && multiState.currentPhase === 'preparation') {
      const interval = setInterval(() => {
        setMultiState(prev => ({
          ...prev,
          players: prev.players.map(player => 
            player.id === multiState.currentPlayerId 
              ? player 
              : { ...player, isReady: Math.random() > 0.7 }
          )
        }));
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [multiState.gameStarted, multiState.currentPhase, multiState.currentPlayerId, setMultiState]);

  const handleTimerEnd = () => {
    stopTimer();
    
    if (multiState.currentPhase === 'preparation') {
      // 準備時間終了 → 自動でハッカソン実行
      handleStartHackathon();
    }
  };

  const handleReadyToggle = () => {
    if (currentPlayer) {
      togglePlayerReady(currentPlayer.id);
    }
  };

  const handleStartHackathon = async () => {
    if (!canStartHackathon(selectedCards, idea) || !gameState.hackathonInfo) {
      return;
    }

    setIsLoading(true);
    setPhase('execution', 'ハッカソン実行中...');

    try {
      // 評価フェーズに遷移
      setPhase('evaluation', 'AI評価中...');

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
      const newScore = score + roundScore;
      const newResource = resource + resourceGain;
      setScore(newScore);
      setResource(newResource);

      // 技術レベル更新
      const newTechLevels = upgradeTechLevels(techLevels, selectedCards);
      setTechLevels(newTechLevels);

      // 結果フェーズに遷移
      setPhase('result', '結果発表！');

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
                isReady: false,
              }
            : {
                ...player,
                score: player.score + Math.floor(Math.random() * 50) + 20, // ダミーAIのスコア
                isReady: false,
              }
        )
      }));

      // カードリセット
      setSelectedCards([]);
      setIdea('');

      // 結果表示タイマー（10秒）
      startTimer(10);

      // 10秒後に次のターンへ
      setTimeout(() => {
        const nextTurn = turn + 1;
        setTurn(nextTurn);

        if (isGameEnded(nextTurn)) {
          // ゲーム終了
          const finalBonus = calculateFinalBonus(newTechLevels);
          const totalFinalScore = newScore + finalBonus;
          setFinalScore(totalFinalScore);
          setShowEndModal(true);
          stopTimer();
        } else {
          // 次のターン開始
          const newHackathonInfo = {
            theme: THEMES[Math.floor(Math.random() * THEMES.length)],
            direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
          };
          
          setMultiState(prev => ({ ...prev, currentPhase: 'preparation' }));
          startTimer(45); // 次の準備フェーズ
        }
      }, 10000);

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

  const handleBackToHome = () => {
    stopTimer();
    router.push('/');
  };

  if (!isInitialized || !multiState.gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">マルチゲームを初期化中...</p>
        </div>
      </div>
    );
  }

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
      leftPanel={<ScoreSummary isMultiMode={true} />}
      centerPanel={
        <div className="space-y-4">
          <HackathonInfo />
          <SelectedCards />
          <IdeaInput />
          
          <div className="space-y-2">
            {/* フェーズメッセージを大きく表示 */}
            <div className="text-center py-3 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-bold text-blue-700">
                {multiState.phaseMessage}
              </h2>
            </div>

            {multiState.currentPhase === 'preparation' && (
              <>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleReadyToggle}
                >
                  {currentPlayer?.isReady ? '✓ 準備完了' : '準備完了にする'}
                </Button>
                
                <Button
                  variant="primary"
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
              </>
            )}

            {multiState.currentPhase === 'hackathon_ready' && (
              <div className="text-center py-6">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  🎉 お題が出そろいました！
                </div>
                <div className="text-sm text-gray-600">
                  まもなくハッカソンが始まります...
                </div>
              </div>
            )}
            
            {multiState.currentPhase === 'execution' && (
              <div className="text-center py-4">
                <div className="animate-pulse text-lg font-semibold text-blue-600">
                  ハッカソン実行中...
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  AI評価を実行しています
                </div>
              </div>
            )}
            
            {multiState.currentPhase === 'evaluation' && (
              <div className="text-center py-4">
                <div className="animate-pulse text-lg font-semibold text-orange-600">
                  AI評価中...
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  あなたのアイデアを評価しています
                </div>
              </div>
            )}

            {multiState.currentPhase === 'result' && (
              <div className="text-center py-4">
                <div className="text-lg font-semibold text-green-600 mb-2">
                  🎊 結果発表！
                </div>
                <div className="text-sm text-gray-500">
                  次のターンまであと {multiState.timeLeft} 秒
                </div>
              </div>
            )}

            {multiState.currentPhase === 'ranking' && (
              <div className="text-center py-4">
                <div className="text-xl font-bold text-purple-600 mb-2">
                  🏆 最終ランキング
                </div>
                <div className="text-sm text-gray-500">
                  ゲーム終了です！
                </div>
              </div>
            )}
          </div>
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