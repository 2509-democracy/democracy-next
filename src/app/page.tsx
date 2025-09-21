"use client";

import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './styles/button-effects.css';

// グローバルCSSとしてkeyframesを追加（styled-jsx使用）

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSingleMode = () => {
    setIsLoaded(false);
    setTimeout(() => {
      router.push("/single-mode");
    }, 500);
  };

  const handleMultiMode = () => {
    setIsLoaded(false);
    setTimeout(() => {
      router.push("/multi-mode");
    }, 500);
  };

  return (
    <div className="relative min-h-screen text-gray-100 flex items-center justify-center">
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
      <div className="max-w-md mx-auto text-center space-y-8 relative z-10 px-4">
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
            }`}
            onClick={handleSingleMode}
          >
            シングルモード
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className={`w-3/4 yusei-magic-regular mx-auto game-button game-button-secondary ${
              isLoaded ? 'button-enter' : 'opacity-0'
            }`}
            onClick={handleMultiMode}
          >
            マルチモード
          </Button>
        </div>
      </div>
    </div>
  );
}
