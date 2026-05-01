export function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-border/40 text-ink-muted text-sm font-medium">
        <span>🔥</span>
        <span>0 day streak</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-light text-amber text-sm font-semibold">
      <span>🔥</span>
      <span>
        {streak} day{streak !== 1 ? 's' : ''} streak
      </span>
    </div>
  );
}
