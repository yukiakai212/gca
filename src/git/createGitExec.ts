import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import parseGithubUrl from 'parse-github-url';

export const createGitExec = (repo: ParsedGithubUrl, mountDir: string) => {
  const workingDir: string = path.join(mountDir, repo.name);

  /* ---------------- helpers ---------------- */

  const exec = (cmd: string): string => {
    return execSync(cmd, {
      cwd: workingDir,
      stdio: 'pipe',
      env: process.env,
    }).toString();
  };

  const exists = (): boolean => {
    return fs.existsSync(workingDir);
  };

  /* ---------------- checks ---------------- */

  /** Repo have any file ?  (not includes .git) */
  const isEmptyFile = (): boolean => {
    if (!exists()) return true;

    const files = fs.readdirSync(workingDir).filter((f) => f !== '.git');

    return files.length === 0;
  };

  /** Repo has any commit ? */
  const isRepoEmpty = (): boolean => {
    try {
      const count = exec('git rev-list --count HEAD').trim();
      return count === '0';
    } catch {
      // new repo
      return true;
    }
  };

  /* ---------------- actions ---------------- */

  const clone = (force = false) => {
    if (exists()) {
      if (!force) {
        throw new Error('Repository already exists locally');
      }
      fs.rmSync(workingDir, { recursive: true, force: true });
    }

    execSync(`git clone ${this.url}`, {
      cwd: mountDir,
      stdio: 'inherit',
    });
  };

  const commit = (date: Date, message = 'gh-art') => {
    const iso = date.toISOString();

    exec('git add -A');

    execSync(`git commit -m "${message}"`, {
      cwd: workingDir,
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: iso,
        GIT_COMMITTER_DATE: iso,
      },
      stdio: 'pipe',
    });
  };

  const push = (remote = 'origin', branch = 'main') => {
    execSync(`git push ${remote} ${branch}`, {
      cwd: workingDir,
      stdio: 'inherit',
    });
  };
  return {
    workingDir,
    isEmptyFile,
    isRepoEmpty,
    clone,
    commit,
    push,
  };
};
