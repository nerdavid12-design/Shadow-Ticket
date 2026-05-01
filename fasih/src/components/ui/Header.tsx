import { useGame } from '../../context/GameContext';
import { APP_NAME } from '../../config';

export function Header() {
  const { state, dispatch } = useGame();

  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-border">
      <span className="text-xl font-semibold text-teal">{APP_NAME}</span>

      <button
        onClick={() =>
          dispatch({ type: 'SHOW_STATS', from: state.screen })
        }
        className="p-2 -m-2 text-ink-mid hover:text-ink"
        aria-label="Statistics"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="12" width="4" height="9" rx="1" />
          <rect x="10" y="7" width="4" height="14" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
      </button>
    </header>
  );
}
