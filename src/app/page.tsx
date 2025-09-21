"use client";

import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './styles/button-effects.css';
import './styles/page-transition.css';

// グローバルCSSとしてkeyframesを追加（styled-jsx使用）

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleTransition = (path: string) => {
    setIsTransitioning(true);
    setTransitionTarget(path);
    
    // アニメーションの完了を待ってから遷移
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  const handleSingleMode = () => {
    handleTransition("/single-mode");
  };

  const handleMultiMode = () => {
    handleTransition("/multi-mode");
  };

  return (
    <div className="relative min-h-screen text-gray-100 flex items-center justify-center">
      <div className={`transition-overlay ${isTransitioning ? 'active' : ''}`} />
      {/* 背景画像のみの透明度を変更 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url(/title_image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5,
          zIndex: 0,
          animation: "bgVibrateY 6s ease-in-out infinite alternate",
        }}
        aria-hidden="true"
        className={isTransitioning ? 'content-exit' : ''}
      />
      <style jsx global>{`
        @keyframes bgVibrateY {
          0% {
            background-position: center center;
          }
          50% {
            background-position: center calc(50% + 20px);
          }
          100% {
            background-position: center center;
          }
        }
      `}</style>
      <div className={`max-w-md mx-auto text-center space-y-8 relative z-10 px-4 ${isTransitioning ? 'content-exit' : ''}`}>
        <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo_white_fulfilled.png"
            alt="ハッカソン・デベロッパー"
            width={500}
            height={120}
            className="max-w-full h-auto"
            priority
          />
        </div>

        <div className="space-y-6 sm:space-y-8">
          <Button
            variant="primary"
            size="lg"
            className={`w-3/4 yusei-magic-regular mx-auto game-button game-button-primary ${
              isLoaded ? 'button-enter' : 'opacity-0'
            } ${isTransitioning ? 'button-exit' : ''}`}
            onClick={handleSingleMode}
          >
            シングルモード
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className={`w-3/4 yusei-magic-regular mx-auto game-button game-button-secondary ${
              isLoaded ? 'button-enter' : 'opacity-0'
            } ${isTransitioning ? 'button-exit' : ''}`}
            onClick={handleMultiMode}
          >
            マルチモード
          </Button>
        </div>
      </div>
    </div>
  );
}
