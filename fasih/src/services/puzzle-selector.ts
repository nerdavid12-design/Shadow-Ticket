import puzzles from '../data/puzzles.json';
import { EPOCH } from '../config';
import type { Puzzle } from '../types/puzzle';

function startOfToday(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function getDaysSinceEpoch(): number {
  return Math.floor((startOfToday() - EPOCH) / 86_400_000);
}

export function getTodayPuzzleIndex(): number {
  const days = getDaysSinceEpoch();
  return ((days % puzzles.length) + puzzles.length) % puzzles.length;
}

export function getTodayPuzzle(): Puzzle {
  return puzzles[getTodayPuzzleIndex()] as Puzzle;
}

export function getPuzzleNumber(): number {
  return getDaysSinceEpoch() + 1;
}
