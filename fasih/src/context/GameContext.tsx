import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type { GameState, GameStats, Screen, TodayState } from '../types/puzzle';
import { getTodayPuzzle } from '../services/puzzle-selector';
import {
  loadStats,
  saveStats,
  loadTodayState,
  saveTodayState,
  getTodayDateString,
} from '../services/storage';
import { isAdsRemoved } from '../services/storage';

type GameAction =
  | { type: 'START_PUZZLE' }
  | { type: 'SELECT_ANSWER'; index: number }
  | { type: 'USE_HINT' }
  | { type: 'GO_HOME' }
  | { type: 'VIEW_RESULT' }
  | { type: 'SHOW_STATS'; from: Screen }
  | { type: 'CLOSE_STATS' }
  | { type: 'REMOVE_ADS' }
  | { type: 'RESET_TODAY' };

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

function isYesterday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, '0');
  const d = String(yesterday.getDate()).padStart(2, '0');
  return dateStr === `${y}-${m}-${d}`;
}

function computeStreak(
  wasCorrect: boolean,
  stats: GameStats,
): Pick<GameStats, 'currentStreak' | 'longestStreak'> {
  if (!wasCorrect) {
    return { currentStreak: 0, longestStreak: stats.longestStreak };
  }

  let newStreak: number;
  if (
    stats.lastPlayedDate === null ||
    isYesterday(stats.lastPlayedDate)
  ) {
    newStreak = stats.currentStreak + 1;
  } else if (stats.lastPlayedDate === getTodayDateString()) {
    newStreak = stats.currentStreak;
  } else {
    newStreak = 1;
  }

  return {
    currentStreak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
  };
}

let returnScreen: Screen = 'home';

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_PUZZLE': {
      const freshToday = {
        puzzleId: state.todayPuzzle.id,
        completed: false,
        wasCorrect: null,
        selectedIndex: null,
        hintUsed: false,
      };
      return { ...state, screen: 'puzzle', today: freshToday };
    }

    case 'SELECT_ANSWER': {
      if (state.today.completed) return state;

      const puzzle = state.todayPuzzle;
      const wasCorrect = action.index === puzzle.correctIndex;
      const streakUpdate = computeStreak(wasCorrect, state.stats);

      const newStats: GameStats = {
        ...state.stats,
        ...streakUpdate,
        totalPlayed: state.stats.totalPlayed + 1,
        totalCorrect: state.stats.totalCorrect + (wasCorrect ? 1 : 0),
        lastPlayedDate: getTodayDateString(),
      };

      const newToday: TodayState = {
        ...state.today,
        completed: true,
        wasCorrect,
        selectedIndex: action.index,
      };

      saveStats(newStats);
      saveTodayState(newToday);

      return {
        ...state,
        screen: 'result',
        stats: newStats,
        today: newToday,
      };
    }

    case 'USE_HINT': {
      const newToday = { ...state.today, hintUsed: true };
      saveTodayState(newToday);
      return { ...state, today: newToday };
    }

    case 'GO_HOME':
      return { ...state, screen: 'home' };

    case 'VIEW_RESULT':
      return { ...state, screen: 'result' };

    case 'SHOW_STATS':
      returnScreen = action.from;
      return { ...state, screen: 'stats' };

    case 'CLOSE_STATS':
      return { ...state, screen: returnScreen };

    case 'REMOVE_ADS':
      return { ...state, adsRemoved: true };

    case 'RESET_TODAY': {
      localStorage.removeItem('luaz_today');
      const freshToday = {
        puzzleId: state.todayPuzzle.id,
        completed: false,
        wasCorrect: null,
        selectedIndex: null,
        hintUsed: false,
      };
      return { ...state, screen: 'home', today: freshToday };
    }

    default:
      return state;
  }
}

function buildInitialState(): GameState {
  const todayPuzzle = getTodayPuzzle();
  const stats = loadStats();
  const savedToday = loadTodayState();
  const adsRemoved = isAdsRemoved();

  const todayRestored =
    savedToday && savedToday.puzzleId === todayPuzzle.id
      ? savedToday
      : {
          puzzleId: todayPuzzle.id,
          completed: false,
          wasCorrect: null,
          selectedIndex: null,
          hintUsed: false,
        };

  return {
    screen: todayRestored.completed ? 'result' : 'home',
    todayPuzzle,
    today: todayRestored,
    stats,
    adsRemoved,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState);

  return (
    <GameContext value={{ state, dispatch }}>
      {children}
    </GameContext>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
