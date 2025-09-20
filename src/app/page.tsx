"use client";

import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// グローバルCSSとしてkeyframesを追加（styled-jsx使用）

export default function Home() {
  const router = useRouter();

  const handleSingleMode = () => {
    router.push("/single-mode");
  };

  const handleMultiMode = () => {
    router.push("/multi-mode");
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
      <div className="max-w-md mx-auto text-center space-y-8 relative z-10">
        <div className="flex justify-center">
          <Image
            src="/logo_white_fulfilled.png"
            alt="ハッカソン・デベロッパー"
            width={500}
            height={120}
            className="max-w-full h-auto"
          />
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-3/4 yusei-magic-regular mx-auto"
            onClick={handleSingleMode}
          >
            シングルモード
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-3/4 yusei-magic-regular mx-auto"
            onClick={handleMultiMode}
          >
            マルチモード
          </Button>
        </div>
      </div>
    </div>
  );
}
