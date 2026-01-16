import {
  CommitScaleOptions,
  GenerateCommitArtOptions,
  ContributionPixel,
  CommitDay,
} from '../types.js';
import { levelToCommitCount } from './levelToCommitCount.js';

export function generateCommitPlan(
  pixels: ContributionPixel[],
  options: GenerateCommitArtOptions,
): CommitDay[] {
  const { base, endDate, rng, clampMax } = options;
  const commitScaleOptions: CommitScaleOptions = {
    base,
    rng,
    clampMax,
    jitter: true,
  };

  const result: CommitDay[] = [];

  for (const pixel of pixels) {
    result.push({
      date: pixel.date,
      commits: levelToCommitCount(pixel.level, commitScaleOptions),
      level: pixel.level,
    });
  }

  return result;
}
