import { useGame } from '../../context/GameContext';
import { OddWordOut } from '../puzzles/OddWordOut';
import { SpotGrammarError } from '../puzzles/SpotGrammarError';

export function PuzzleScreen() {
  const { state, dispatch } = useGame();
  const puzzle = state.todayPuzzle;

  function handleSelect(index: number) {
    dispatch({ type: 'SELECT_ANSWER', index });
  }

  function handleHint() {
    dispatch({ type: 'USE_HINT' });
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      {puzzle.type === 'odd-word-out' && (
        <OddWordOut
          puzzle={puzzle}
          onSelect={handleSelect}
          hintUsed={state.today.hintUsed}
          onRequestHint={handleHint}
        />
      )}
      {puzzle.type === 'spot-grammar-error' && (
        <SpotGrammarError
          puzzle={puzzle}
          onSelect={handleSelect}
          hintUsed={state.today.hintUsed}
          onRequestHint={handleHint}
        />
      )}
    </div>
  );
}
