import { useState } from 'react';
import { AdService } from '../../services/ad';

interface HintButtonProps {
  onHintRevealed: () => void;
  disabled: boolean;
}

export function HintButton({ onHintRevealed, disabled }: HintButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (disabled || loading) return;
    setLoading(true);
    const result = await AdService.showRewarded();
    setLoading(false);
    if (result === 'shown' || result === 'removed') {
      onHintRevealed();
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber text-amber font-medium text-sm hover:bg-amber-light disabled:opacity-40 disabled:pointer-events-none transition-colors"
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
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      </svg>
      {loading ? 'Loading...' : 'Get a Hint'}
    </button>
  );
}
