import { useAtom } from 'jotai';
import { hackathonInfoAtom } from '@/store/game';

export function HackathonInfo() {
  const [hackathonInfo] = useAtom(hackathonInfoAtom);

  if (!hackathonInfo) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-purple-400">今回のハッカソン</h2>
      <div className="text-lg">
        <div className="mb-2">
          テーマ: <span className="font-bold text-white">{hackathonInfo.theme}</span>
        </div>
        <div>
          方向性: <span className="font-bold text-white">{hackathonInfo.direction}</span>
        </div>
      </div>
    </div>
  );
}