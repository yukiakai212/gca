import {
  ContributionArtOptions,
  ArtEngineOptions,
  CommitDay,
  GenerateCommitArtOptions,
  GcaMeta,
} from '../types.js';
import { createSeededRng } from './rng.js';
import { pngToContributionPixels } from './pngToContributionPixels.js';
import { generateCommitPlan } from './generateCommitPlan.js';

export const createArtEngine = (options: ArtEngineOptions) => {
  const generate = async (): Promise<CommitDay[]> => {
    const rng = createSeededRng(options.seed);
    const contributionArtOptions: ContributionArtOptions = {
      rng,
      weeks: 52,
      now: options.endDate,
    };
    const generateCommitArtOptions: GenerateCommitArtOptions = {
      base: options.base,
      endDate: options.endDate,
      rng,
      clampMax: 40,
    };
    const pixels = await pngToContributionPixels(options.image, contributionArtOptions);
    const commitDays: CommitDay[] = generateCommitPlan(pixels, generateCommitArtOptions);
    return commitDays;
  };

  return { generate };
};
