import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { GcaState } from '../types.js';

const GCA_FILE = '.gca.json';
const CURRENT_VERSION = 1;

export const GcaCommitDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  commits: z.number().int().min(0),
});

export const GcaStateSchema = z.object({
  version: z.literal(CURRENT_VERSION),
  meta: z.object({
    seed: z.string(),
    base: z.number().int().positive(),
    endDate: z.string().datetime(),
    createdAt: z.string().datetime(),
    generator: z.literal('dominant-smart'),
  }),
  art: z.object({
    format: z.literal('commit-days'),
    days: z.array(GcaCommitDaySchema).min(1),
  }),
});

export const createGcaStateManager = (repoDir: string) => {
  const file: string = path.join(repoDir, GCA_FILE);

  const exists = (): boolean => {
    return fs.existsSync(file);
  };

  const load = (): GcaState => {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));

    const parsed = GcaStateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        'Invalid gca.json:\n' +
          parsed.error.issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n'),
      );
    }
    const state = parsed.data;

    switch (state.version) {
      case CURRENT_VERSION:
        break;
      default:
        throw new Error('Unsupported GCA version');
    }
    if (state.art) {
      for (const d of state.art.days) {
        if (d.commits > state.meta.base * 10) {
          throw new Error(`Commits too large at ${d.date}`);
        }
      }
    }
    return state;
  };

  const save = (input: Omit<GcaState, 'version'>) => {
    const state: GcaState = {
      version: CURRENT_VERSION,
      ...input,
    };

    fs.writeFileSync(file, JSON.stringify(state, null, 2));
  };
  return {
    exists,
    load,
    save,
  };
};
