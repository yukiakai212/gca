import fs from 'fs';
import path from 'path';

const GCA_FILE = '.gca.json';

export const createGcaStateManager = (repoDir: string) => {
  const file: string = path.join(repoDir, GCA_FILE);

  const exists = (): boolean => {
    return fs.existsSync(file);
  };

  const load = (): GcaState => {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  };

  const save = (input: Omit<GcaState, 'version' | 'createdAt'>) => {
    const state: GcaState = {
      version: 1,
      createdAt: new Date().toISOString(),
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
