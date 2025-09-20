"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleSingleMode = () => {
    router.push("/single-mode");
  };

  const handleMultiMode = () => {
    router.push("/multi-mode");
  };

  return (
    <div className="min-h-screen bg-white text-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <Image 
            src="/logo_fulfilled.png" 
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
