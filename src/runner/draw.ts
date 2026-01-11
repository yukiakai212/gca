export async function runDrawCommand(opts: DrawOptions) {
  const github = new GithubAPI(opts.url);
  const git = new GitAPI(os.name, opts.url, os.tempDir());
  const gca = new GcaStateManager(git.workingDir);
  await git.clone();
  if (!git.isRepoEmpty() && !opts.force) throw new Error('Repository is not empty. Use --force to overwrite.');
  if (!gca.exists() && !opts.base && !git.isRepoEmpty()) throw new Error('Missing .gca.json or --base option. Cannot determine commit base.');
  if (gca.exists()) {
    const gcaState = gca.load();
    opts = { ...gcaState, ...opts };
    //opts.base = gcaState.base;
  }
  const art = new ArtEngine({
    base: opts.base,
    image: opts.image,
    url: opts.url,
    endDate: new Date(opts.endDate),
    seed: opts.seed,
  });
  const days: CommitDay[] = art.generate();
  gca.save({
    seed: opts.seed,
    base: opts.base,
    endDate: new Date(opts.endDate).toISOString(),
  });
  for (const day of days) {
    for (const _ of day.commits) git.commit(day.date);
  }
  git.push();
}
