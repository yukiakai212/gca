import os from 'node:os';
import { logger } from '../logger.js';
import { CliOptions, CommitDay, ParsedGithubUrl } from '../types.js';
import { createGithubContribution } from '../git/createGithubContribution.js';
import { createGitExec } from '../git/createGitExec.js';
import { parseGithubUrl } from '../git/parseGithubUrl.js';
import { normalizeGithubContributions } from '../gca/normalizeGithubContributions.js';
import { createGcaStateManager } from '../state/createGcaStateManager.js';
import { resolveMeta } from '../gca/resolveMeta.js';
import { createArtEngine } from '../gca/createArtEngine.js';
import { GcaCodec } from '../gca/gcaCodec.js';
import { metaToGca } from '../gca/metaCodec.js';
import { printPreview } from '../gca/printPreview.js';

export async function runDrawCommand(opts: CliOptions) {
  logger.info('Starting draw command');
  logger.debug('CLI options', opts);
  const repo: ParsedGithubUrl = parseGithubUrl(opts.url);
  logger.debug('Repo:', repo);
  const contributionProvider = createGithubContribution(repo);
  const git = createGitExec(repo, os.tmpdir());
  logger.info('Using working directory:', git.workingDir);
  if (opts.dryRun) {
    logger.warn('Running in dry-run mode. No commits will be created.');
  }

  if (!git.isWorkdirEmpty()) {
    if (!opts.cleanWorkdir) {
      logger.warn('Working directory is not empty. Re-run with --clean-workdir to confirm.');
      throw new Error(
        'Working directory is not empty.\n' +
          'This action will DELETE all files in:\n' +
          git.workingDir +
          '\nRe-run with --clean-workdir to confirm.',
      );
    }

    logger.debug('Clean-workdir enabled');

    if (!opts.dryRun) {
      logger.debug('Removing workdir');
      git.removeWorkdir();
    }
  }
  const gca = createGcaStateManager(git.workingDir);
  logger.info('Cloning repository');
  await git.clone();
  logger.success('Repository cloned');
  logger.debug('Repo empty: ', git.isRepoEmpty());

  if (!git.isRepoEmpty() && !opts.force) {
    logger.error('Repository is not empty');
    throw new Error('Repository is not empty. Use --force to overwrite.');
  }
  if (!gca.exists() && !opts.base && !git.isRepoEmpty())
    throw new Error('Missing .gca.json or --base option. Cannot determine commit base.');

  let days: CommitDay[] = [];
  const state = gca.exists() ? gca.load() : undefined;
  const meta = await resolveMeta(state?.meta, opts, async (date: Date) => {
    const raw = await contributionProvider.getContributionMatrix(date);

    return normalizeGithubContributions(raw);
  });

  logger.debug('Resolved meta:', meta);

  if (opts.fromGca) {
    if (!state) {
      throw new Error('Missing art data in gca.json.');
    }
    logger.debug('Replaying from gca');
    days = GcaCodec.fromGca(state.art.days);
  } else {
    if (!opts.image) throw new Error('Missing --image');
    const art = createArtEngine({
      base: meta.base,
      image: opts.image,
      url: opts.url,
      endDate: new Date(meta.endDate),
      seed: meta.seed,
    });
    days = await art.generate();
  }
  if (!opts.noSaveGca) {
    logger.debug('saving gca.json');
    gca.save({
      meta: metaToGca(meta),
      art: { format: 'commit-days', days: GcaCodec.toGca(days) },
    });
  }
  logger.debug('Generated days:', days.length);
  if (opts.printMatrix) {
    printPreview(days.map((d) => d.level));
  }
  if (opts.dryRun) {
    return;
  }
  git.checkout();

  for (const day of days) {
    logger.debug(`commit ${day.commits} times at ${day.date.toISOString()}`);

    for (let i = 0; i < day.commits; i++) {
      git.commit(day.date);
    }
  }
  git.push();
}
