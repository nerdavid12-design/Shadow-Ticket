import { useGame } from '../../context/GameContext';
import { getPuzzleNumber } from '../../services/puzzle-selector';
import { APP_TAGLINE } from '../../config';
import { Button } from '../ui/Button';
import { StreakBadge } from '../ui/StreakBadge';

const TYPE_LABELS: Record<string, string> = {
  'odd-word-out': 'Odd Word Out',
  'spot-grammar-error': 'Spot the Grammar Error',
};

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const puzzle = state.todayPuzzle;
  const puzzleNumber = getPuzzleNumber();

  return (
    <div className="flex flex-col items-center justify-center gap-8 flex-1 px-6 py-10">
      <p className="text-sm text-ink-muted font-medium tracking-wide uppercase">
        {APP_TAGLINE}
      </p>

      <div className="text-center space-y-3">
        <span className="inline-block px-4 py-1.5 rounded-full bg-teal text-white text-xs font-semibold uppercase tracking-wider">
          {TYPE_LABELS[puzzle.type] ?? puzzle.type}
        </span>
        <p className="text-ink-muted text-sm">Puzzle #{puzzleNumber}</p>
      </div>

      <StreakBadge streak={state.stats.currentStreak} />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="max-w-xs"
        onClick={() => dispatch({ type: 'START_PUZZLE' })}
      >
        Start
      </Button>
    </div>
  );
}
