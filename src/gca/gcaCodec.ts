import type { GcaCommitDay, CommitDay, CommitLevel } from '../types.js';

export function toGcaDays(days: CommitDay[]): GcaCommitDay[] {
  return days.map((d) => ({
    date: d.date.toISOString().slice(0, 10),
    commits: d.commits,
  }));
}

export function fromGcaDays(days: GcaCommitDay[]): CommitDay[] {
  return days.map((d) => ({
    date: new Date(d.date),
    commits: d.commits,
    level: 0 as CommitLevel, //  recompute if need
  }));
}
export const GcaCodec = {
  fromGca: fromGcaDays,
  toGca: toGcaDays,
};
