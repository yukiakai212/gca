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
  clampMax: number;
  endDate: Date;
  rng: () => number;
}
export interface CommitDay {
  date: Date;
  commits: number;
  level: CommitLevel;
}

export interface ContributionStats {
  commitsPerDay: number[]; // [0,3,5,1,...] (365)
  levels: number[]; // [0,1,3,2,...] (365)
  maxCommits: number;
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
  seed: string | number;
}
export interface CliOptions {
  image?: string;
  url: string;
  force?: boolean;
  base?: number;
  seed?: string;
  dryRun?: boolean;
  printMatrix?: boolean;
  endDate?: string;
  fromGca?: boolean;
  cleanWorkdir?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  noSaveGca?: boolean;
}
export interface GcaCommitDay {
  date: string; // ISO yyyy-mm-dd
  commits: number;
}
export interface RuntimeMeta {
  base: number;
  seed: number | string;
  endDate: Date;
  createdAt: Date;
  generator: 'dominant-smart';
}

export interface GcaMeta {
  seed: string | number;
  base: number;
  endDate: string;
  createdAt: string;
  generator: 'dominant-smart';
}
export interface GcaArt {
  format: 'commit-days';
  days: GcaCommitDay[];
}
export interface GcaState {
  version: number;
  meta: GcaMeta;
  art: GcaArt;
}
export interface ParsedGithubUrl {
  owner: string;
  name: string;
  repo: string; // `${owner}/${name}`
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
