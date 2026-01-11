import { CommitLevel, CommitScaleOptions } from './types.js';

export function levelToCommitCount(level: CommitLevel, options: CommitScaleOptions): number {
  const { base, jitter = true, clampMax, rng = Math.random } = options;

  if (level === 0) return 0;

  const ratios: Record<Exclude<CommitLevel, 0>, number> = {
    1: 0.12,
    2: 0.35,
    3: 0.65,
    4: 0.9,
  };

  let commits = Math.round(base * ratios[level]);

  if (jitter) {
    const jitterRatio = level === 4 ? 0.05 : level === 3 ? 0.08 : 0.12;

    const delta = commits * jitterRatio;
    commits += Math.round((rng() * 2 - 1) * delta);
  }

  commits = Math.max(0, commits);

  if (clampMax !== undefined) {
    commits = Math.min(commits, clampMax);
  }

  return Math.min(commits, base);
}
