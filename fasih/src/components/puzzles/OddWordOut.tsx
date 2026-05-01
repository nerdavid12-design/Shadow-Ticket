import type { OddWordOutPuzzle } from '../../types/puzzle';
import { HintButton } from '../ui/HintButton';

interface Props {
  puzzle: OddWordOutPuzzle;
  onSelect: (index: number) => void;
  hintUsed: boolean;
  onRequestHint: () => void;
}

export function OddWordOut({
  puzzle,
  onSelect,
  hintUsed,
  onRequestHint,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6 flex-1">
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-teal-light text-teal text-xs font-semibold uppercase tracking-wider">
          {puzzle.category}
        </span>
        <p className="text-lg font-medium text-ink">{puzzle.instruction}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {puzzle.words.map((word, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="bg-surface border border-border rounded-xl p-6 text-center text-xl font-medium text-ink hover:border-teal hover:bg-teal-light/30 active:scale-[0.97] transition-colors min-h-[80px] flex items-center justify-center"
          >
            {word}
          </button>
        ))}
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
