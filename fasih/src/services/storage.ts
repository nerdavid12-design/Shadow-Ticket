import type { GameStats, TodayState } from '../types/puzzle';

const KEYS = {
  STATS: 'luaz_stats',
  TODAY: 'luaz_today',
  ADS_REMOVED: 'luaz_ads_removed',
} as const;

const DEFAULT_STATS: GameStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalPlayed: 0,
  totalCorrect: 0,
  lastPlayedDate: null,
};

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(KEYS.STATS);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return {
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      totalPlayed: parsed.totalPlayed ?? 0,
      totalCorrect: parsed.totalCorrect ?? 0,
      lastPlayedDate: parsed.lastPlayedDate ?? null,
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: GameStats): void {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}

export function loadTodayState(): TodayState | null {
  try {
    const raw = localStorage.getItem(KEYS.TODAY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayDateString()) return null;
    return {
      puzzleId: parsed.puzzleId,
      completed: parsed.completed,
      wasCorrect: parsed.wasCorrect,
      selectedIndex: parsed.selectedIndex,
      hintUsed: parsed.hintUsed,
    };
  } catch {
    return null;
  }
}

export function saveTodayState(state: TodayState): void {
  localStorage.setItem(
    KEYS.TODAY,
    JSON.stringify({ ...state, date: getTodayDateString() }),
  );
}

export function isAdsRemoved(): boolean {
  return localStorage.getItem(KEYS.ADS_REMOVED) === 'true';
}

export function setAdsRemoved(): void {
  localStorage.setItem(KEYS.ADS_REMOVED, 'true');
}
