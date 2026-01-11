export function computeFinalBase(
  commitsPerDay: number[],
  levelMatrix: CommitLevelMatrix[][],
  userBase?: number,
): number {
  if (userBase != null) return userBase;

  const { base } = dominantSmartBase(commitsPerDay);
  const boost = 4;
  const result: ContrastGuardResult = applyContrastGuard(base, levelMatrix, boost);
  return result.base;
}
