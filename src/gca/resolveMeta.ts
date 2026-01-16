import { GcaMeta, CliOptions, ContributionAPI, RuntimeMeta, ContributionStats } from '../types.js';
import { createSeed } from './createSeed.js';
import { computeFinalBase } from './computeFinalBase.js';

function defaultEndDate(): Date {
  return new Date();
}
function throwMissing(name: string) {
  throw new Error(`${name} is required`);
}
export async function resolveMeta(
  state: GcaMeta | undefined,
  opts: CliOptions,
  fetchContributionStats: (date: Date) => Promise<ContributionStats>,
): Promise<RuntimeMeta> {
  const seed = opts.seed ?? state?.seed ?? createSeed();
  const endDate = new Date(opts.endDate ?? state?.endDate ?? defaultEndDate());
  let base = opts.base ?? state?.base ?? undefined;
  if (!base) {
    const stats: ContributionStats = await fetchContributionStats(endDate);
    base = computeFinalBase(stats);
  }
  return {
    seed,

    base,

    endDate,
    createdAt: new Date(),
    generator: 'dominant-smart',
  };
}
