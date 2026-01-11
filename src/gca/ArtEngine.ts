export class ArtEngine {
  constructor(private options: ArtEngineOptions) {}
  async generate(): Promise<CommitDay[]> {
    const rng = createSeededRng(this.options.seed);
    const contributionArtOptions: ContributionArtOptions = {
      rng,
      weeks: 52,
      now: this.options.endDate,
    };
    const generateCommitArtOptions: GenerateCommitArtOptions = {
      base: this.options.base,
      endDate: this.options.endDate,
      rng,
    };
    const pixels = await pngToContributionPixels(this.options.image, contributionArtOptions);
    const commitDays: CommitDay[] = generateCommitPlan(pixels, generateCommitArtOptions);
    return commitDays;
  }
}
