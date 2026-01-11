import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import parseGithubUrl from 'parse-github-url';

export class GitAPI {
  private repo: ParsedGithubUrl;
  public workingDir: string;

  constructor(
    private os: string,
    private url: string,
    private mountDir: string,
  ) {
    const parsed = parseGithubUrl(url);

    if (!parsed || !parsed.owner || !parsed.name) {
      throw new Error('Invalid GitHub repository URL');
    }

    this.repo = parsed;

    this.workingDir = path.join(mountDir, this.repo.name);
  }

  /* ---------------- helpers ---------------- */

  private exec(cmd: string) {
    return execSync(cmd, {
      cwd: this.workingDir,
      stdio: 'pipe',
      env: process.env,
    }).toString();
  }

  private exists(): boolean {
    return fs.existsSync(this.workingDir);
  }

  /* ---------------- checks ---------------- */

  /** Repo have any file ?  (not includes .git) */
  isEmptyFile(): boolean {
    if (!this.exists()) return true;

    const files = fs.readdirSync(this.workingDir).filter((f) => f !== '.git');

    return files.length === 0;
  }

  /** Repo has any commit ? */
  isRepoEmpty(): boolean {
    try {
      const count = this.exec('git rev-list --count HEAD').trim();
      return count === '0';
    } catch {
      // new repo
      return true;
    }
  }

  /* ---------------- actions ---------------- */

  clone(force = false) {
    if (this.exists()) {
      if (!force) {
        throw new Error('Repository already exists locally');
      }
      fs.rmSync(this.workingDir, { recursive: true, force: true });
    }

    execSync(`git clone ${this.url}`, {
      cwd: this.mountDir,
      stdio: 'inherit',
    });
  }

  commit(date: Date, message = 'gh-art') {
    const iso = date.toISOString();

    this.exec('git add -A');

    execSync(`git commit -m "${message}"`, {
      cwd: this.workingDir,
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: iso,
        GIT_COMMITTER_DATE: iso,
      },
      stdio: 'pipe',
    });
  }

  push(remote = 'origin', branch = 'main') {
    execSync(`git push ${remote} ${branch}`, {
      cwd: this.workingDir,
      stdio: 'inherit',
    });
  }
}
