import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { getPuzzleNumber } from '../../services/puzzle-selector';
import { AdService } from '../../services/ad';
import { ShareButton } from '../ui/ShareButton';
import { Button } from '../ui/Button';

export function ResultScreen() {
  const { state, dispatch } = useGame();
  const { today, todayPuzzle: puzzle, stats, adsRemoved } = state;
  const wasCorrect = today.wasCorrect === true;

  useEffect(() => {
    if (!adsRemoved) {
      AdService.showInterstitial();
    }
  }, [adsRemoved]);

  const selectedWord =
    puzzle.type === 'odd-word-out'
      ? puzzle.words[today.selectedIndex!]
      : puzzle.sentence[today.selectedIndex!];

  const correctWord =
    puzzle.type === 'odd-word-out'
      ? puzzle.words[puzzle.correctIndex]
      : puzzle.sentence[puzzle.correctIndex];

  return (
    <div className="flex flex-col items-center gap-6 flex-1 px-6 py-8">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
          wasCorrect ? 'bg-correct-bg' : 'bg-incorrect-bg'
        }`}
      >
        {wasCorrect ? '✓' : '✗'}
      </div>

      <h2
        className={`text-2xl font-semibold ${
          wasCorrect ? 'text-correct' : 'text-incorrect'
        }`}
      >
        {wasCorrect ? 'Correct!' : 'Incorrect'}
      </h2>

      {!wasCorrect && (
        <p className="text-ink-mid text-sm text-center">
          You picked{' '}
          <span className="font-semibold text-incorrect">{selectedWord}</span>
          {' — the answer was '}
          <span className="font-semibold text-correct">{correctWord}</span>
        </p>
      )}

      {puzzle.type === 'spot-grammar-error' && (
        <div className="bg-correct-bg border border-correct/20 rounded-xl px-4 py-3 text-sm text-correct font-medium w-full max-w-sm text-center">
          Correct form: &ldquo;{puzzle.correctedWord}&rdquo;
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-5 w-full max-w-sm space-y-2">
        <p className="text-ink text-sm leading-relaxed">
          {puzzle.explanation}
        </p>
      </div>

      <ShareButton
        puzzleType={puzzle.type}
        wasCorrect={wasCorrect}
        streak={stats.currentStreak}
        puzzleNumber={getPuzzleNumber()}
      />

      <p className="text-ink-muted text-sm">Come back tomorrow for a new puzzle!</p>

      <Button
        variant="ghost"
        onClick={() => dispatch({ type: 'GO_HOME' })}
        className="mt-auto"
      >
        Back to Home
      </Button>
    </div>
  );
}
