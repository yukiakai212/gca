import got from 'got';
import parse from 'parse-github-url';

export function parseGithubUrl(url: string): ParsedGithubUrl {
  const parsed = { url, ...parse(url) };

  if (!parsed || !parsed.owner || !parsed.name) {
    throw new Error('Invalid GitHub repository URL');
  }

  return parsed;
}
