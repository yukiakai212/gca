#!/usr/bin/env node
import { Command } from 'commander';
import { logger } from './logger.js';
import { runDrawCommand } from './runner/draw.js';

const program = new Command();

program.name('gh-art').description('Draw GitHub contribution art').version('1.0.0');

program
  .argument('<repo>', 'GitHub repository URL')
  .option('-i, --image <path>', 'PNG image path')

  .option('-f, --force', 'Allow non-empty git repo')
  .option('-e, --end-date <date>', 'End date (YYYY-MM-DD)')
  .option('-b, --base <number>', 'Commit base', Number)
  .option('-s, --seed <number>', 'Random seed', Number)
  .option('--dry-run', 'Preview only, do not commit')
  .option('--from-gca', 'Replay from gca.json')
  .option('--print-matrix', 'Print grayscale/level matrix')
  .option('--no-save-gca', 'Do not write gca.json')
  .option('--clean-workdir', 'Remove working directory if not empty')
  .option('--verbose', 'Verbose logging')
  .option('--quiet', 'Slient mode')

  .action(async (repo, options) => {
    try {
      logger.level = options.quiet ? 0 : options.verbose ? 4 : 2;
      await runDrawCommand({
        url: repo,
        ...options,
      });
    } catch (err: any) {
      logger.error(err);
      process.exit(1);
    }
  });

program.parse();
