import { ContributionStats, ContributionAPI } from '../types.js';

export function normalizeGithubContributions(contributions: ContributionAPI[]): ContributionStats {
  const commitsPerDay: number[] = [];
  const levels: number[] = [];

  for (const c of contributions) {
    commitsPerDay.push(c.count);
    levels.push(c.level);
  }

  return {
    commitsPerDay,
    levels,
    maxCommits: Math.max(0, ...commitsPerDay),
  };
}
