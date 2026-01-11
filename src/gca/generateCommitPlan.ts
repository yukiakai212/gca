import { CommitLevelMatrix, GenerateCommitArtOptions } from './types.js';

export function generateCommitPlan(
  pixels: ContributionPixel[],
  options: GenerateCommitArtOptions,
): CommitDay[] {
  const { base, endDate, rng } = options;
  const commitScaleOptions: CommitScaleOptions = {
    base,
    rng,
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

  return days;
}
