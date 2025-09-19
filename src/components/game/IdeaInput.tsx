import { useAtom } from 'jotai';
import { ideaAtom } from '@/store/game';

export function IdeaInput() {
  const [idea, setIdea] = useAtom(ideaAtom);

  return (
    <div>
      <h2 className="text-xl font-bold mt-4 mb-2 text-rose-400">あなたのアイデア</h2>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        className="w-full h-24 p-3 border-2 border-gray-600 rounded-lg bg-gray-700 text-gray-100 resize-none focus:border-blue-400 focus:outline-none"
        placeholder="アイデアを入力してください..."
      />
    </div>
  );
}