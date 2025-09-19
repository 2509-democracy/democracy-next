import { useAtom } from 'jotai';
import { hackathonInfoAtom } from '@/store/game';

export function HackathonInfo() {
  const [hackathonInfo] = useAtom(hackathonInfoAtom);

  if (!hackathonInfo) {
    return null;
  }

  return (
    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
      <h2 className="text-lg font-bold mb-3 text-purple-700">今回のハッカソン</h2>
      <div className="space-y-2">
        <div className="text-sm">
          <span className="font-medium text-gray-600">テーマ:</span>
          <span className="font-bold text-gray-900 ml-2">{hackathonInfo.theme}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-gray-600">方向性:</span>
          <span className="font-bold text-gray-900 ml-2">{hackathonInfo.direction}</span>
        </div>
      </div>
    </div>
  );
}