"use client";

import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import './styles/button-effects.css';
import './styles/page-transition.css';

// グローバルCSSとしてkeyframesを追加（styled-jsx使用）

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState("");
  const [isLightningActive, setIsLightningActive] = useState(false);
  const [lightningRotation, setLightningRotation] = useState(0);
  const [lightningHorizontal, setLightningHorizontal] = useState(50);
  const lightningStyle = useMemo(
    () => ({
      '--lightning-rotation': `${lightningRotation}deg`,
      '--lightning-horizontal': `${lightningHorizontal}%`,
    }),
    [lightningHorizontal, lightningRotation],
  );

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    let lightningTimeout: NodeJS.Timeout;
    let lightningResetTimeout: NodeJS.Timeout;

    const scheduleLightning = () => {
      const delay = 6000 + Math.random() * 4000; // 約8秒間隔（±2秒）
      lightningTimeout = setTimeout(() => {
        const rotation = (Math.random() - 0.5) * 50; // -25度〜25度
        const horizontal = 25 + Math.random() * 50; // 25%〜75%
        setLightningRotation(rotation);
        setLightningHorizontal(horizontal);
        setIsLightningActive(true);
        lightningResetTimeout = setTimeout(() => {
          setIsLightningActive(false);
          scheduleLightning();
        }, 900);
      }, delay);
    };

    scheduleLightning();

    return () => {
      clearTimeout(lightningTimeout);
      clearTimeout(lightningResetTimeout);
    };
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
      <div
        className={`lightning-container ${isLightningActive ? 'active' : ''}`}
        aria-hidden="true"
        style={lightningStyle}
      />
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

        @keyframes lightningFlash {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          25% {
            opacity: 0.2;
          }
          40% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes lightningBolt {
          0% {
            opacity: 0;
            transform: translate(-50%, -20%) rotate(var(--lightning-rotation)) scaleY(0.2) skewX(-12deg);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, 0%) rotate(var(--lightning-rotation)) scaleY(1) skewX(-12deg);
          }
          40% {
            opacity: 0.8;
            transform: translate(-48%, 10%) rotate(var(--lightning-rotation)) scaleY(0.9) skewX(-10deg);
          }
          100% {
            opacity: 0;
            transform: translate(-46%, 20%) rotate(var(--lightning-rotation)) scaleY(0.4) skewX(-8deg);
          }
        }

        @keyframes lightningGlow {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          20% {
            opacity: 0.9;
            transform: scale(1.05);
          }
          100% {
            opacity: 0;
            transform: scale(1.1);
          }
        }

        .lightning-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          --lightning-rotation: 0deg;
          --lightning-horizontal: 50%;
        }

        .lightning-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--lightning-horizontal, 50%) 10%,
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0)
          );
          opacity: 0;
        }

        .lightning-container::after {
          content: '';
          position: absolute;
          top: -15%;
          left: var(--lightning-horizontal, 50%);
          width: 12px;
          height: 150%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 10%, rgba(80, 178, 255, 0.8) 45%, rgba(255, 255, 255, 0) 90%);
          filter: drop-shadow(0 0 12px rgba(173, 216, 255, 0.8)) drop-shadow(0 0 18px rgba(80, 178, 255, 0.5));
          opacity: 0;
          transform-origin: top center;
          clip-path: polygon(50% 0%, 60% 10%, 40% 20%, 65% 30%, 35% 45%, 55% 60%, 45% 70%, 70% 85%, 50% 100%, 30% 75%, 45% 55%, 25% 40%, 45% 25%, 30% 10%);
        }

        .lightning-container.active::before {
          animation: lightningFlash 0.9s ease-out forwards, lightningGlow 0.9s ease-out forwards;
        }

        .lightning-container.active::after {
          animation: lightningBolt 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .lightning-container.active {
          animation: lightningGlow 0.9s ease-out forwards;
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
