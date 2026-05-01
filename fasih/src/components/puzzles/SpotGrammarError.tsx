import type { SpotGrammarErrorPuzzle } from '../../types/puzzle';
import { HintButton } from '../ui/HintButton';

interface Props {
  puzzle: SpotGrammarErrorPuzzle;
  onSelect: (index: number) => void;
  hintUsed: boolean;
  onRequestHint: () => void;
}

const PUNCTUATION = /^[.,!?;:'"()]$/;

export function SpotGrammarError({
  puzzle,
  onSelect,
  hintUsed,
  onRequestHint,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6 flex-1">
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-teal-light text-teal text-xs font-semibold uppercase tracking-wider">
          {puzzle.grammarRule}
        </span>
        <p className="text-lg font-medium text-ink">{puzzle.instruction}</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm">
        <div className="flex flex-wrap items-baseline gap-1.5 justify-center text-xl leading-relaxed">
          {puzzle.sentence.map((token, i) => {
            if (PUNCTUATION.test(token)) {
              return (
                <span key={i} className="text-ink -ml-1">
                  {token}
                </span>
              );
            }

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className="px-2 py-1 rounded-lg text-ink font-medium underline decoration-ink-muted/40 decoration-1 underline-offset-4 hover:bg-teal-light hover:text-teal active:scale-[0.97] transition-colors"
              >
                {token}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-4 w-full max-w-sm">
        {hintUsed ? (
          <div className="bg-amber-light border border-amber/20 rounded-xl p-4 text-sm text-ink-mid">
            <span className="font-semibold text-amber">Hint: </span>
            {puzzle.hint}
          </div>
        ) : (
          <div className="flex justify-center">
            <HintButton onHintRevealed={onRequestHint} disabled={false} />
          </div>
        )}
      </div>
    </div>
  );
}
