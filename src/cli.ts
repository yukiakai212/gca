#!/usr/bin/env node
import { Command } from 'commander';
import { runDrawCommand } from '../runner/draw';

const program = new Command();

program.name('gh-art').description('Draw GitHub contribution art').version('0.1.0');

program
  .command('draw')
  .argument('<image>', 'PNG image to draw')
  .option('-f, --force', 'overwrite non-empty repository')
  .option('--overwrite', 'overwrite existing art using gca.json')
  .option('--base <number>', 'set commit base manually', (v) => Number(v))
  .option('--seed <string>', 'random seed')
  .option('--dry-run', 'preview commit plan without committing')
  .option('--end-date <date>', 'end date (YYYY-MM-DD)')
  .action(async (image, options) => {
    try {
      await runDrawCommand({
        image,
        ...options,
      });
    } catch (err: any) {
      console.error(`✖ ${err.message}`);
      process.exit(1);
    }
  });

program.parse();
