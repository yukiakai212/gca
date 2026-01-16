import { DominantSmartOptions, DominantSmartResult } from '../types.js';

export function dominantSmartBase(
  commitsPerDay: number[],
  options: DominantSmartOptions,
): DominantSmartResult {
  const { percentile = 95, minBase = 12, maxBase = 40, contrastBoost = 4 } = options;

  if (commitsPerDay.length === 0) {
    return {
      base: minBase,
      pValue: 0,
      reason: 'empty-history',
    };
  }

  // Clone + sort tăng dần
  const sorted = [...commitsPerDay].sort((a, b) => a - b);

  // Percentile index
  const index = Math.floor((percentile / 100) * (sorted.length - 1));
  const pValue = sorted[index];

  // Clamp base
  let base = clamp(pValue, minBase, maxBase);

  return {
    base,
    pValue,
    reason: `p${percentile}`,
  };
}
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
