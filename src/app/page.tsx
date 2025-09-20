"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const router = useRouter();

  const handleSingleMode = () => {
    router.push("/single-mode");
  };

  const handleMultiMode = () => {
    router.push("/multi-mode");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto flex flex-col items-center space-y-8">
        <h1 className="text-5xl font-bold text-teal-400 dela-gothic-one-regular whitespace-nowrap text-center w-full">
          ハッカソン・デベロッパー
        </h1>

        <p className="text-xl text-gray-300 yusei-magic-regular text-center w-full">
          ゲームモードを選択してください
        </p>

        <div className="space-y-4 w-full flex flex-col items-center">
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

        <div className="mt-12 text-sm text-gray-500 yusei-magic-regular text-center w-full">
          <p>シングルモード: AIとのハッカソンバトル</p>
          <p>マルチモード: 他のプレイヤーとの対戦</p>
        </div>
      </div>
    </div>
  );
}
