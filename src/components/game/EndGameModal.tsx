import { useAtom } from 'jotai';
import { scoreAtom, initializeGameAtom } from '@/store/game';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface EndGameModalProps {
  isOpen: boolean;
  finalScore: number;
  onRestart: () => void;
}

export function EndGameModal({ isOpen, finalScore, onRestart }: EndGameModalProps) {
  const [, initializeGame] = useAtom(initializeGameAtom);

  const handleRestart = () => {
    initializeGame();
    onRestart();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <h2 className="text-3xl font-bold text-teal-400 mb-4">ハッカソン終了！</h2>
      <div className="text-2xl mb-2">
        最終スコア: <span className="font-bold text-yellow-400">{finalScore}</span>
      </div>
      <div className="text-xl mb-4">（各技術レベルによるボーナスを含む）</div>
      <Button 
        variant="primary"
        onClick={handleRestart}
        className="bg-purple-500 hover:bg-purple-600"
      >
        もう一度プレイ
      </Button>
    </Modal>
  );
}