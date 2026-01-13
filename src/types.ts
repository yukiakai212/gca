export type CommitLevelMatrix = CommitLevel[][];

export type CommitLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionPixel {
  date: Date;
  row: number;
  col: number;
  level: CommitLevel;
}
export interface DominantSmartOptions {
  percentile: number; // default 95
  minBase: number; // default 12
  maxBase: number; // default 40
  contrastBoost: number; // default 4
}

export interface DominantSmartResult {
  base: number;
  pValue: number;
  reason: string;
}
export interface CommitScaleOptions {
  base: number;
  jitter: boolean;
  clampMax: number;
  rng: () => number; // inject random
}
export interface ContributionArtOptions {
  weeks: number;
  now: Date;
  rng: () => number;
}
export interface GenerateCommitArtOptions {
  base: number;
  endDate: Date;
  rng: () => number;
}
export interface CommitDay {
  date: Date;
  commits: number;
  level: CommitLevel;
}

export interface ContrastGuardResult {
  base: number;
  boosted: boolean;
}

export interface ArtEngineOptions {
  base: number;
  image: string;
  url: string;
  endDate: Date;
  seed: string;
}
export interface DrawOptions {
  image: string;
  url: string;
  force?: boolean;
  overwrite?: boolean;
  base?: number;
  seed?: string;
  dryRun?: boolean;
  endDate?: string;
}
export interface GcaState {
  version: number;
  seed: string;
  base: number;
  endDate: string;
  createdAt: string;
}
interface ParsedGithubUrl {
  owner: string;
  name: string;
  repo: string; // `${owner}/${name}`
  branch?: string;
  filepath?: string;
  protocol?: string;
  url: string;
}

export type ContributionAPI = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type NestedResponseAPI = {
  total: {
    [year: number]: number;
    [year: string]: number; // 'lastYear;
  };
  contributions: {
    [year: number]: {
      [month: number]: {
        [day: number]: ContributionAPI;
      };
    };
  };
};
