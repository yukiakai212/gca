import got from 'got';
import parse from 'parse-github-url';
import { ParsedGithubUrl } from '../types.js';

export function parseGithubUrl(url: string): ParsedGithubUrl {
  const parsed = parse(url);

  if (!parsed || !parsed.owner || !parsed.name || !parsed.repo) {
    throw new Error('Invalid GitHub repository URL');
  }

  return {
    ...parsed,
    url,
    owner: parsed.owner,
    name: parsed.name,
    repo: parsed.repo,
  };
}
