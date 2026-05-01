import { useState } from 'react';
import { sharePuzzleResult } from '../../services/share';

interface ShareButtonProps {
  puzzleType: string;
  wasCorrect: boolean;
  streak: number;
  puzzleNumber: number;
}

export function ShareButton({
  puzzleType,
  wasCorrect,
  streak,
  puzzleNumber,
}: ShareButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleShare() {
    const result = await sharePuzzleResult({
      puzzleType,
      wasCorrect,
      streak,
      puzzleNumber,
    });

    if (result === 'copied') {
      setFeedback('Copied!');
      setTimeout(() => setFeedback(null), 2000);
    } else if (result === 'failed') {
      setFeedback('Could not share');
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal text-white font-medium text-sm hover:bg-teal-dark transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {feedback ?? 'Share Result'}
    </button>
  );
}
