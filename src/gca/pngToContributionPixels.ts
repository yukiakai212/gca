import { ContributionPixel, ContributionArtOptions } from '../types.js';
import { pngToCommitMatrix } from './pngToCommitMatrix.js';
import { mapPixelToDate } from './mapPixelToDate.js';

/**
 * PNG → GitHub contribution pixels
 */
export async function pngToContributionPixels(
  filePath: string,
  options: ContributionArtOptions,
): Promise<ContributionPixel[]> {
  const weeks = options.weeks;
  const now = options.now;

  const matrix = await pngToCommitMatrix(filePath, weeks, options.rng);

  const result: ContributionPixel[] = [];

  for (let col = 0; col < weeks; col++) {
    for (let row = 0; row < 7; row++) {
      const level = matrix[row][col];
      const date = mapPixelToDate(row, col, weeks, now);

      result.push({
        date,
        row,
        col,
        level,
      });
    }
  }

  return result;
}

export function previewArt(pixels: ContributionPixel[]) {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(52).fill(0));

  for (const p of pixels) {
    grid[p.row][p.col] = p.level;
  }

  const chars = [' ', '.', ':', '*', '#'];
  for (let r = 0; r < 7; r++) {
    console.log(grid[r].map((v) => chars[v]).join(''));
  }
}
