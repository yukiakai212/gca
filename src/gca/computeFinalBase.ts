import {
  CommitLevelMatrix,
  ContrastGuardResult,
  ContributionStats,
  DominantSmartOptions,
} from '../types.js';
import { applyContrastGuard } from './applyContrastGuard.js';
import { dominantSmartBase } from './dominantSmartBase.js';

export function computeFinalBase(
  stats: ContributionStats,
  //levelMatrix: CommitLevelMatrix
): number {
  const dominantSmartOptions: DominantSmartOptions = {
    percentile: 95,
    minBase: 12,
    maxBase: 40,
    contrastBoost: 4,
  };
  const { base } = dominantSmartBase(stats.commitsPerDay, dominantSmartOptions);
  const boost = 4;
  const result: ContrastGuardResult = applyContrastGuard(base, stats.levels, boost);
  return result.base;
}
