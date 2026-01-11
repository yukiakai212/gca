import { CommitLevelMatrix, ContrastGuardResult } from './types.js';

export function applyContrastGuard(
  base: number,
  levelMatrix: CommitLevelMatrix,
  boost,
): ContrastGuardResult {
  const flat = levelMatrix.flat();
  const darkPixels = flat.filter((v) => v <= 1).length;
  const ratio = darkPixels / flat.length;

  if (ratio > 0.6) {
    return {
      base: base + boost,
      boosted: true,
    };
  }

  return { base, boosted: false };
}
