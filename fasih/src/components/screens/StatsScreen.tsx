import { useGame } from '../../context/GameContext';

export function StatsScreen() {
  const { state, dispatch } = useGame();
  const { stats } = state;

  const accuracy =
    stats.totalPlayed > 0
      ? Math.round((stats.totalCorrect / stats.totalPlayed) * 100)
      : 0;

  return (
    <div className="fixed inset-0 bg-bg z-50 flex flex-col safe-top safe-bottom">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-ink">Statistics</h2>
        <button
          onClick={() => dispatch({ type: 'CLOSE_STATS' })}
          className="p-2 -m-2 text-ink-mid hover:text-ink"
          aria-label="Close"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <div className="flex-1 flex items-start justify-center px-6 pt-12">
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <StatCard
            value={stats.currentStreak}
            label="Current Streak"
            icon="🔥"
          />
          <StatCard
            value={stats.longestStreak}
            label="Best Streak"
            icon="🏆"
          />
          <StatCard
            value={stats.totalPlayed}
            label="Played"
            icon="🧩"
          />
          <StatCard
            value={stats.totalPlayed > 0 ? `${accuracy}%` : '--'}
            label="Accuracy"
            icon="🎯"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: number | string;
  label: string;
  icon: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 text-center space-y-1">
      <div className="text-2xl">{icon}</div>
      <div className="text-3xl font-semibold text-teal">{value}</div>
      <div className="text-xs text-ink-muted uppercase tracking-wide font-medium">
        {label}
      </div>
    </div>
  );
}
