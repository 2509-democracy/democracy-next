import { useAtom } from 'jotai';
import { ideaAtom } from '@/store/game';

export function IdeaInput() {
  const [idea, setIdea] = useAtom(ideaAtom);

  return (
    <div>
      <h2 className="text-base font-bold mb-2 text-gray-700">あなたのアイデア</h2>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        className="w-full h-20 p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 resize-none focus:border-blue-400 focus:outline-none"
        placeholder="アイデアを入力してください..."
      />
    </div>
  );
}