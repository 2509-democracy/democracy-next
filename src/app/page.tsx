'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  const handleSingleMode = () => {
    router.push('/single-mode');
  };

  const handleMultiMode = () => {
    // 未実装のため、今は何もしない
    alert('マルチモードは未実装です。');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold text-teal-400">
          ハッカソン・デベロッパー
        </h1>
        
        <p className="text-xl text-gray-300">
          ゲームモードを選択してください
        </p>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSingleMode}
          >
            シングルモード
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleMultiMode}
          >
            マルチモード（未実装）
          </Button>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>シングルモード: AIとのハッカソンバトル</p>
          <p>マルチモード: 他のプレイヤーとの対戦</p>
        </div>
      </div>
    </div>
  );
}
