import parseGithubUrl from 'parse-github-url';
import { getContribution } from 'github-contribution-api';
import { ParsedGithubUrl, ContributionAPI, NestedResponseAPI } from '../types.js';

export const createGithubContribution = (repo: ParsedGithubUrl) => {
  function startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  const getContributionWindow = (endDate: Date) => {
    const end = startOfDay(endDate);
    const start = new Date(end);
    start.setDate(end.getDate() - 364);

    return { start, end };
  };
  function* iterateDays(start: Date, end: Date): Generator<Date> {
    const d = new Date(start);
    while (d <= end) {
      yield new Date(d);
      d.setDate(d.getDate() + 1);
    }
  }
  const getContributionForDate = (data: NestedResponseAPI, date: Date): ContributionAPI => {
    const defaultContribution: ContributionAPI = {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    };
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    return data.contributions[y]?.[m]?.[d] ?? defaultContribution;
  };
  const getContributionMatrix = async (endDate: Date): Promise<ContributionAPI[]> => {
    const { start } = getContributionWindow(endDate);
    const years = new Set<number>();
    years.add(endDate.getFullYear());
    years.add(start.getFullYear());
    const data = await getContribution(repo.owner, {
      format: 'nested',
      year: [...years],
    });
    if (!data.contributions) throw new Error('Cant fetch contribution');
    const result: ContributionAPI[] = [];
    for (const date of iterateDays(start, endDate)) {
      result.push(getContributionForDate(data, date));
    }
    return result;
  };
  return { getContributionMatrix };
};
