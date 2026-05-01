import { APP_NAME } from '../config';

export async function sharePuzzleResult(params: {
  puzzleType: string;
  wasCorrect: boolean;
  streak: number;
  puzzleNumber: number;
}): Promise<'shared' | 'copied' | 'failed'> {
  const typeLabel =
    params.puzzleType === 'odd-word-out'
      ? 'Odd Word Out'
      : 'Spot the Grammar Error';

  const result = params.wasCorrect ? '✅ Correct!' : '❌ Incorrect';
  const text = [
    `${APP_NAME} #${params.puzzleNumber}`,
    '',
    `${typeLabel}: ${result}`,
    `🔥 Streak: ${params.streak}`,
  ].join('\n');

  if (navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch {
      // user cancelled or share failed, fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
