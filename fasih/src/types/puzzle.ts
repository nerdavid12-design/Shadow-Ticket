export interface OddWordOutPuzzle {
  id: string;
  type: 'odd-word-out';
  instruction: string;
  words: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  hint: string;
  category: string;
}

export interface SpotGrammarErrorPuzzle {
  id: string;
  type: 'spot-grammar-error';
  instruction: string;
  sentence: string[];
  correctIndex: number;
  correctedWord: string;
  explanation: string;
  hint: string;
  grammarRule: string;
}

export type Puzzle = OddWordOutPuzzle | SpotGrammarErrorPuzzle;

export type Screen = 'home' | 'puzzle' | 'result' | 'stats';

export interface GameStats {
  currentStreak: number;
  longestStreak: number;
  totalPlayed: number;
  totalCorrect: number;
  lastPlayedDate: string | null;
}

export interface TodayState {
  puzzleId: string;
  completed: boolean;
  wasCorrect: boolean | null;
  selectedIndex: number | null;
  hintUsed: boolean;
}

export interface GameState {
  screen: Screen;
  todayPuzzle: Puzzle;
  today: TodayState;
  stats: GameStats;
  adsRemoved: boolean;
}
