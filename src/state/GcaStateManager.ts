import fs from 'fs';
import path from 'path';

const GCA_FILE = '.gca.json';

export class GcaStateManager {
  private file: string;
  constructor(private repoDir: string) {
    this.file = path.join(repoDir, GCA_FILE);
  }

  exists(): boolean {
    return fs.existsSync(this.file);
  }

  load(): GcaState {
    return JSON.parse(fs.readFileSync(this.file, 'utf8'));
  }

  save(input: Omit<GcaState, 'version' | 'createdAt'>) {
    const state: GcaState = {
      version: 1,
      createdAt: new Date().toISOString(),
      ...input,
    };

    fs.writeFileSync(this.file, JSON.stringify(state, null, 2));
  }
}
