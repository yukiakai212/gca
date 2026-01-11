import got from 'got';
import parseGithubUrl from 'parse-github-url';

export class GithubAPI {
  static readonly BASE_GITHUB_CONTRIBUTION_API: string =
    'https://github-contributions-api.jogruber.de';
  private repo: ParsedGithubUrl;
  constructor(private url: string) {
    const parsed = parseGithubUrl(url);

    if (!parsed || !parsed.owner || !parsed.name) {
      throw new Error('Invalid GitHub repository URL');
    }

    this.repo = parsed;
  }
  private getContributionWindow(endDate: Date) {
    const end = startOfDay(endDate);
    const start = new Date(end);
    start.setDate(end.getDate() - 364);

    return { start, end };
  }
  private *iterateDays(start: Date, end: Date): Generator<Date> {
    const d = new Date(start);
    while (d <= end) {
      yield new Date(d);
      d.setDate(d.getDate() + 1);
    }
  }
  private getContributionForDate(data: NestedResponseAPI, date: Date): number {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    return data.contributions[y]?.[m]?.[d]?.count ?? 0;
  }
  getContributionMatrix(endDate: Date): number[] {
    const url: string = new URL(`v4/${this.repo.owner}`, this.BASE_GITHUB_CONTRIBUTION_API);
    const { start } = this.getContributionWindow(endDate);
    const years = new Set<number>();
    years.add(endDate.getFullYear());
    years.add(start.getFullYear());
    url.searchParams.set('format', 'nested');
    for (const year of years) {
      url.searchParams.append('y', year);
    }
    const data = await got<NestedResponseAPI>(url.toString()).json();
    if (!data.contributions) throw new Error('Cant fetch contribution');
    const result: number[] = [];
    for (const date of this.iterateDays(start, endDate)) {
      result.push(this.getContributionForDate(data, date));
    }
    return result;
  }
}
